---
title: "Native UI in einer Ionic-App einrichten"
sourceRevision: "2060f6f26af79395d7b9276d93f9403ceaa19c85c5c49bef08fe0dae1a18576d"
---

# Native UI in einer Ionic-App einrichten

Installieren Sie die Pakete, konfigurieren Sie das Theme und starten Sie Native UI. Gewöhnliche Bedienelemente und **Vertical Bars sind standardmäßig aktiviert**; das Gerät bestimmt, ob eine native Rail verfügbar ist.

## 1. Pakete installieren

```sh
npm install @rdlabo/capacitor-native-ui @rdlabo/ionic-theme-ios27 @erkamyaman/capacitor-foldable
```

Verwenden Sie eine bestehende Ionic-App mit Capacitor 8 und einem iOS-Projekt. Die Standardeinrichtung verwendet das iOS-27-Theme-Preset und Foldable 8.5 oder neuer innerhalb von Version 8.

## 2. Theme konfigurieren

Behalten Sie das Ionic-Basis-CSS. Verwenden Sie diesen einzelnen Einstiegspunkt als Theme- und Dunkelpaletten-Stylesheet der Anwendung:

```css
@import '@rdlabo/ionic-theme-ios27/styles/system.css';
```

Übergeben Sie das Preset vor dem Rendern an die Ionic-Initialisierung der Anwendung:

```ts
import { ios27ThemeConfig } from '@rdlabo/ionic-theme-ios27';

const ionicConfig = {
  ...ios27ThemeConfig,
};
```

| Framework | Ionic-Initialisierung |
| --- | --- |
| Angular / Ionic 8 | `provideIonicAngular(ionicConfig)` aus `@ionic/angular/standalone` |
| Angular / Ionic 9 | `provideIonicAngular(ionicConfig)` aus `@ionic/angular` |
| React | `setupIonicReact(ionicConfig)` aus `@ionic/react` |
| Vue | `app.use(IonicVue, ionicConfig)` mit `IonicVue` aus `@ionic/vue` |

Das Stylesheet enthält das Rail-Layout und die systemabhängige Dunkelpalette. Das Preset liefert Ionic-Modus und Animationen einschließlich der Native-UI-Navigationskoordination.

## 3. Native UI starten

Starten Sie nach dem Einbinden der App-Shell die standardmäßige Runtime:

```ts
import { enableNativeUI } from '@rdlabo/capacitor-native-ui';

const shell = await enableNativeUI();
```

Verbinden Sie im Rahmen dieses Schritts [Anwendungsstart und Gerätelayout](device-layout.md). Das anwendungseigene Modul wendet Foldables erstes Layout und Änderungsereignisse über das Theme an, sodass das standardmäßige Vertical-Bars-Layout dem Gerät folgt.

### Lebensdauer der Anwendung

Der Anwendungs-Bootstrap startet und stoppt Native UI. Das Gerätemodul besitzt seinen Listener, das Theme das Web-Layout; Seitenkomponenten behalten ihren normalen Zustand und ihre Handler. Der [Angular-Bootstrap](device-layout.md#angular-bootstrap) und die [frameworkunabhängige Anwendungsverbindung](device-layout.md#react-vue-and-other-application-owners) zeigen die vollständige Verdrahtung von Start und Entsorgung.

## 4. Erstellen, synchronisieren und ausführen

Erstellen Sie die Web-Assets der Anwendung und synchronisieren Sie anschließend das native Projekt:

```sh
npx cap sync ios
```

Erstellen Sie die App erneut und starten Sie sie mit Xcode 26+ unter iOS 26+. Natives Rail-Rendering benötigt zusätzlich das [unterstützte Gerät und Betriebssystem](vertical-bars.md#native-rendering); andere Geräte behalten das gewöhnliche Layout. SwiftPM löst Engine automatisch auf. Bestehende CocoaPods-Anwendungen verwenden die [native Projekteinrichtung](configuration.md#native-project-setup).

Prüfen Sie, dass bestehende Werkzeugleistenaktionen und Tabs ihre ursprünglichen Handler aufrufen. Navigieren Sie vorwärts und zurück, brechen Sie eine Zurück-Geste ab und wechseln Sie die aktive Anzeige auf einem Rail-Gerät. Prüfen Sie den Web-Fallback im Browser.

## Nächste Schritte

- [Ein bestehendes Web-Theme verwenden](ionic-vertical-bars.md) statt des Standard-Theme-Presets.
- [HTML ohne Ionic verwenden](framework-independent.md).
- [Darstellung und anwendungsspezifische Überschreibungen konfigurieren](https://webview-native-ui.com/projects/ionic-theme-ios27/docs/configuration).
- [Unterstützte Bedienelemente](native-ui.md) und [Konfigurationsreferenz](configuration.md).
- [Eine frühere Integration aktualisieren](migration.md#simplify-an-existing-ios-setup).
