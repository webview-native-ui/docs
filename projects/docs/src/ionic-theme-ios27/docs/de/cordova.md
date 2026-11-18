---
title: "Cordova einrichten"
sourceRevision: "07b45f9b135f41690d411c8e630f95c0d7be1090936d7401b69a22fa33298403"
---

Installieren Sie das Theme im Web-Projekt nach der [Cordova-Einrichtung](/cordova-native-ui/docs/readme).

```sh
npm install @rdlabo/ionic-theme-ios27
```

## Optionales iOS-Theme

Behalten Sie die Ionic-Basisstile bei und wählen Sie das Preset für Ihre Dunkelmodus-Einstellung. Für die Systemeinstellung:

```css
@import '@rdlabo/ionic-theme-ios27/styles/system.css';
```

Übergeben Sie `ios27ThemeConfig` an die bestehende Ionic-Initialisierung, um Seitenübergänge und Popover zu animieren. Siehe [Beispiele für Angular, React und Vue](setup.md).

Importieren Sie JavaScript-Helfer aus dem Theme. Ordnen Sie im Web-Bundler den exakten Modulnamen

`@rdlabo/capacitor-native-ui/integration` → `@webview-native-ui/cordova-plugin/integration`

```ts
// vite.config.ts
import { defineConfig } from 'vite';

export default defineConfig({
  resolve: {
    alias: [{
      find: /^@rdlabo\/capacitor-native-ui\/integration$/,
      replacement: '@webview-native-ui/cordova-plugin/integration',
    }],
  },
});
```

## Native UI nach Bereitschaft von Cordova und App starten

Behalten Sie `<script src="cordova.js"></script>` im Cordova-Einstiegs-HTML bei. Registrieren Sie den Device-Ready-Listener beim Start und warten Sie vor dem Aktivieren von Native UI, bis Ihr Framework `ion-app` eingebunden hat:

```ts
import { enableNativeUI } from '@webview-native-ui/cordova-plugin';

const deviceReady = new Promise<void>((resolve) => {
  document.addEventListener('deviceready', () => resolve(), { once: true });
});

export async function startNativeUI(appMounted: Promise<void>) {
  await Promise.all([deviceReady, appMounted]);
  return enableNativeUI();
}
```

Stellen Sie `appMounted` über den Mount-Lebenszyklus Ihrer Anwendung bereit, rufen Sie `startNativeUI()` einmal auf und behalten Sie das zurückgegebene Handle. Rufen Sie `await handle.destroy()` auf, wenn die Anwendung Native UI dauerhaft nicht mehr verwendet. Erzeugen Sie keine Laufzeit pro Seite und rufen Sie nicht zusätzlich zu diesem npm-basierten Start `window.NativeUI.enableNativeUI()` auf. Browser-Vorschauen senden Cordovas `deviceready` nicht; verwenden Sie diesen Startpfad nur im Cordova-Build und betrachten Sie das Web-Theme über Ihren normalen Browsereinstieg.

Bauen Sie Ihre Web-Assets in das `www`-Verzeichnis der Cordova-Anwendung und bereiten Sie anschließend die native App vor und bauen sie neu, zum Beispiel:

```sh
cordova prepare ios
cordova build ios
```

Verwenden Sie nach Erfüllung der Voraussetzungen `android` für einen Android-Build. Nutzen Sie für Cordova kein `npx cap sync`. Unter iOS deaktiviert der Adapter automatische Scroll-View-Einzüge; setzen Sie Safe-Area-Abstände im Seiten-CSS wie in der [Plugin-Anleitung](https://github.com/webview-native-ui/cordova-plugin#start-native-ui) beschrieben.

## Bestehende Theme-App zu dieser Integration migrieren

Ersetzen Sie ab 0.1.6 die Importe des zuvor mitgelieferten Themes. Für das Aussehen aus 0.1.5 verwenden Sie Theme-Version 2.2.0.

- `@webview-native-ui/cordova-plugin/theme` → `@rdlabo/ionic-theme-ios27`
- `@webview-native-ui/cordova-plugin/theme/css/*` → `@rdlabo/ionic-theme-ios27/dist/css/*`
