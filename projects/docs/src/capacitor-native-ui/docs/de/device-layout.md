---
title: "Anwendungsstart und Gerätelayout"
sourceRevision: "0daef9b9b205c8ca6d5eb604459f7f856fa549d2659b03adc687ba15d0f7bd29"
---

# Anwendungsstart und Gerätelayout

Starten Sie Native UI einmal nach dem Rendern der App-Shell. Verbinden Sie Foldables Layoutmeldungen mit dem Theme, damit die Web-Abstände dem Gerät folgen.

## Gerätelayout

Abonnieren Sie nach dem Rendern von `ion-app` zuerst `layoutChange` und lesen Sie dann das anfängliche Layout:

```ts
import { Foldable } from '@erkamyaman/capacitor-foldable';
import { resolveVerticalBarsLayout } from '@rdlabo/capacitor-native-ui/integration';
import { setVerticalBarsLayout } from '@rdlabo/ionic-theme-ios27';

const updateLayout = async () => {
  setVerticalBarsLayout(await resolveVerticalBarsLayout(Foldable));
};

void Foldable.addListener('layoutChange', () => void updateLayout().catch(console.error))
  .then(updateLayout)
  .catch(console.error);
```

Verwenden Sie Foldable ab 8.5 innerhalb von Version 8. Der Resolver liefert `edge`, `inset` und `toolbarTop` in CSS-Pixeln des Viewports. Das Theme wendet die Werte auf das Web-Layout an; ein null-Rand stellt das normale Layout wieder her. Native UI übernimmt die Projektion der Steuerelemente separat.

## Angular-Bootstrap

Starten Sie Native UI in `src/main.ts` nach dem Angular-Bootstrap:

```ts
import { bootstrapApplication } from '@angular/platform-browser';
import { enableNativeUI } from '@rdlabo/capacitor-native-ui';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

void bootstrapApplication(AppComponent, appConfig)
  .then(() => {
    void enableNativeUI().catch(console.error);
  })
  .catch(console.error);
```

Platzieren Sie den obigen Layoutcode im vorhandenen `afterNextRender`-Callback der App-Shell. Behalten Sie Ionic-Routen und Seitenhandler bei. Ein zusätzlicher Service oder Lifecycle-Wrapper ist nicht erforderlich.

## React, Vue und andere Frameworks

Starten Sie Native UI einmal nach dem Rendern der App-Shell und verbinden Sie den obigen Layoutcode:

```ts
import { enableNativeUI } from '@rdlabo/capacitor-native-ui';

void enableNativeUI().catch(console.error);
```

Verwenden Sie den Startpunkt der Anwendung nach dem Mounten statt einer gerouteten Seite. HTML-Anwendungen verwenden den Einstieg `/core` und ihre eigene CSS-Aktualisierung anstelle von `setVerticalBarsLayout`.

## Geräteverhalten prüfen

Wechseln Sie auf einem unterstützten Rail-Gerät das aktive Display und prüfen Sie, ob Web-Abstände und Toolbar-Ursprung gemeinsam aktualisiert werden. Ohne Rail bleibt das normale Layout aktiv. Eine Browser-Vorschau prüft das Web-Layout; natives Rail-Rendering benötigt ein unterstütztes iOS-Gerät und Betriebssystem.
