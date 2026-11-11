---
title: "Anwendungsstart und Gerätelayout verbinden"
sourceRevision: "a489f0c38652b8c7cefd1187c31bfc534fd85f52208e2b2df090fb2daea665a9"
---

# Anwendungsstart und Gerätelayout verbinden

Verbinden Sie Runtime und Gerätelayout einmal für die Anwendung. Native UI projiziert Bedienelemente; das Theme wendet das Web-Layout an; die Anwendung verbindet Foldables Geräteberichte mit diesem Layout. Dieselbe Verbindung unterstützt das Standard-Theme-Preset und ein bestehendes Web-Theme.

## Gerätelayout-Modul

Erstellen Sie `src/device-layout.ts`. Dieses anwendungseigene Modul enthält keinen Komponenten- oder Routerzustand. Abonnieren Sie vor dem ersten Abruf, wenden Sie die Werte des Resolvers an und entfernen Sie den Listener, wenn sein Eigentümer stoppt:

```ts
import { Capacitor } from '@capacitor/core';
import { Foldable } from '@erkamyaman/capacitor-foldable';
import { resolveVerticalBarsLayout } from '@rdlabo/capacitor-native-ui/integration';

export async function connectDeviceLayout(
  applyLayout: (layout: Awaited<ReturnType<typeof resolveVerticalBarsLayout>>) => void,
): Promise<() => Promise<void>> {
  if (Capacitor.getPlatform() !== 'ios') return async () => {};
  let active = true;
  const refresh = async () => {
    const layout = await resolveVerticalBarsLayout(Foldable);
    if (active) applyLayout(layout);
  };
  const listener = await Foldable.addListener('layoutChange', () => {
    void refresh().catch((error: unknown) => console.error('Device layout refresh failed', error));
  });
  try {
    await refresh();
  } catch (error) {
    active = false;
    await listener.remove();
    throw error;
  }
  return async () => {
    active = false;
    await listener.remove();
  };
}
```

Der Callback besitzt das Web-Layout. Nutzer des Ionic-Themes übergeben `setVerticalBarsLayout`; HTML-Anwendungen übergeben ihren eigenen CSS-/Layout-Updater und verwenden den `/core`-Einstieg von Native UI. Das Gerätemodul selbst importiert weder Theme noch Framework.

Dies verwendet Foldable 8.5 oder neuer innerhalb von Version 8. Der Resolver gibt `edge`, `inset` und `toolbarTop` in CSS-Pixeln des Viewports zurück. Eine Kante von null stellt das gewöhnliche Layout wieder her; nicht verfügbare Werte lassen die Standardwerte des Themes bestehen. Gerätegeometrie und Verfügbarkeit nativen Renderings sind getrennte Eingaben.

## Angular-Bootstrap

Verwenden Sie einen Root-Service als Eigentümer der Geräteverbindung. Erstellen Sie `src/app/vertical-bars-layout.service.ts`:

```ts
import { DestroyRef, Injectable, inject } from '@angular/core';
import { connectDeviceLayout } from '../device-layout';
import { setVerticalBarsLayout } from '@rdlabo/ionic-theme-ios27';

@Injectable({ providedIn: 'root' })
export class VerticalBarsLayoutService {
  readonly #destroyRef = inject(DestroyRef);

  async initialize(): Promise<void> {
    const disconnect = await connectDeviceLayout(setVerticalBarsLayout);
    if (this.#destroyRef.destroyed) {
      await disconnect();
      return;
    }
    this.#destroyRef.onDestroy(() => {
      void disconnect().catch((error: unknown) => console.error('Device layout cleanup failed', error));
    });
  }
}
```

Verbinden Sie Service und Native UI in der bestehenden `src/main.ts` der Anwendung. `appConfig` liefert Ionic-Preset und Routen; `AppComponent` setzt App-Shell und Router-Outlet zusammen:

```ts
import { bootstrapApplication } from '@angular/platform-browser';
import { enableNativeUI } from '@rdlabo/capacitor-native-ui';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';
import { VerticalBarsLayoutService } from './app/vertical-bars-layout.service';

void bootstrapApplication(AppComponent, appConfig)
  .then(async (app) => {
    const shell = await enableNativeUI();
    if (app.destroyed) {
      await shell.destroy();
      return;
    }
    app.onDestroy(() => {
      void shell.destroy().catch((error: unknown) => console.error('Native UI cleanup failed', error));
    });
    await app.injector.get(VerticalBarsLayoutService).initialize();
  })
  .catch((error: unknown) => console.error('Application startup failed', error));
```

Die Anwendung besitzt das Runtime-Handle und zerstört es beim Beenden. Der Root-Service entfernt das Geräteabonnement. Seitenkomponenten behalten ihren bestehenden Zustand und ihre Aktionshandler.

## React, Vue und andere Anwendungseigentümer

Verwenden Sie dasselbe Modul `connectDeviceLayout` beim Anwendungsstart nach dem Einbinden der App-Shell. Die Integration ist frameworkunabhängig:

```ts
import { enableNativeUI } from '@rdlabo/capacitor-native-ui';
import { connectDeviceLayout } from './device-layout';
import { setVerticalBarsLayout } from '@rdlabo/ionic-theme-ios27';

export async function startApplicationNativeUI(): Promise<() => Promise<void>> {
  const shell = await enableNativeUI();
  try {
    const disconnect = await connectDeviceLayout(setVerticalBarsLayout);
    return async () => {
      try {
        await disconnect();
      } finally {
        await shell.destroy();
      }
    };
  } catch (error) {
    await shell.destroy();
    throw error;
  }
}
```

Warten Sie beim Start der eingebundenen Anwendung einmal auf diese Funktion, behalten Sie die zurückgegebene Entsorgungsfunktion und warten Sie vor dem Entfernen dieser Anwendung auf deren Abschluss. Reacts Entwicklungs-Strict-Mode kann Effekte erneut einbinden: Halten Sie diesen einmaligen Anwendungsstart beim Anwendungseigentümer, statt ihn in jeder gerouteten Komponente oder wiederholt aus einem erneut eingebundenen Effekt zu starten. Auch Vue-Anwendungen verwenden ihren Anwendungseigentümer statt Seiten-Lebenszyklushooks. Browser-/Server-Rendering sollte die Funktion erst aufrufen, nachdem das Dokument existiert.

## Geräteverhalten überprüfen

Wechseln Sie auf einem unterstützten Rail-Gerät die aktive Anzeige und prüfen Sie, dass sich Web-Inhaltsabstand und Werkzeugleistenursprung gemeinsam aktualisieren. Auf Geräten ohne Rail bleibt das gewöhnliche Layout aktiv. Eine Browser-Vorschau prüft das Web-Layout; natives Rail-Rendering benötigt das unterstützte iOS-Gerät und Betriebssystem.
