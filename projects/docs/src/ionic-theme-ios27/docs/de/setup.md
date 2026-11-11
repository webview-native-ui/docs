---
title: "Das iOS-27-Theme einrichten"
sourceRevision: "f0a32f142c76345cff225766112b4f44065d063ad5e42882f022c1c6e2dd6693"
---

# Das iOS-27-Theme einrichten

Geben Sie einer bestehenden Ionic-App die iOS-27-Darstellung mit einem Stylesheet und einem Theme-Konfigurationsobjekt. Diese Anleitung verwendet ausschließlich das iOS-27-Theme und den systemgesteuerten Dunkelmodus. Für browserabhängige iOS-26/27-Stile oder MD3 verwenden Sie stattdessen [adaptive Themes](https://docs.rdlabo.dev/projects/ionic-theme-ios27/docs/adaptive-themes).

## Vorbereitungen

Verwenden Sie eine bestehende Ionic-Angular-, React- oder Vue-Anwendung mit Ionic `>=8.8.1 <10`. Behalten Sie Ionics CSS-Basisimporte bei. Reine Browser-Apps benötigen kein natives Capacitor-Projekt. Dies ist die Standardeinrichtung für das eigenständige Theme-Paket; Cordova-Anwendungen verwenden die optionale [Cordova-Einrichtung](cordova.md).

## 1. Theme und Foldable installieren

```sh
npm install @rdlabo/ionic-theme-ios27 @erkamyaman/capacitor-foldable
```

Foldable liefert die Geräteposition und Faltstellung. Verbinden Sie seine Anfangswerte und Änderungsereignisse anhand der [Anleitung zum Gerätelayout](vertical-bars-layout.md#read-the-device-layout).

## 2. Ein Stylesheet laden

Fügen Sie das Stylesheet in Ihrem globalen Stylesheet nach Ionics CSS-Basisimporten hinzu. Ersetzen Sie Ihre vorhandenen Importe der dunklen Ionic-Palette und des Themes durch dieses Stylesheet, damit jedes Stylesheet nur einmal geladen wird.

```css
@import '@rdlabo/ionic-theme-ios27/styles/system.css';
```

Das Stylesheet bündelt die passende dunkle Ionic-Palette und die Theme-Stile. Manuelle oder immer dunkle Darstellung, die Kombination von Stylesheets und anwendungsspezifische Überschreibungen beschreibt die [Konfiguration](configuration.md#dark-mode).

## 3. Die Theme-Konfiguration an Ionic übergeben

```ts
import { ios27ThemeConfig } from '@rdlabo/ionic-theme-ios27';

const ionicConfig = {
  ...ios27ThemeConfig,
  // animated: false,
};
```

Die Konfiguration stellt `mode: 'ios'` sowie Animationen für Seitenübergänge und Popover bereit. Übergeben Sie sie vor dem Rendern an Ihre bestehende Ionic-Initialisierung. Ergänzen Sie bei Bedarf anwendungsspezifische Optionen nach dem Spread.

| Framework | Optionen anwenden |
| --- | --- |
| Angular / Ionic 8 | `provideIonicAngular(ionicConfig)` aus `@ionic/angular/standalone` |
| Angular / Ionic 9 | `provideIonicAngular(ionicConfig)` aus `@ionic/angular` |
| React | `setupIonicReact(ionicConfig)` aus `@ionic/react` |
| Vue | `app.use(IonicVue, ionicConfig)` mit `IonicVue` aus `@ionic/vue` |

Bestehende Anwendungen können der [optionalen Einrichtungsmigration](migration.md#optional-simplify-the-setup) folgen, um ihre plattformabhängige Modusauswahl und eigenen Animationen beizubehalten. Einzelne Stylesheet- und Animations-APIs beschreibt die [Konfiguration](configuration.md).

## 4. Den ersten Bildschirm ansehen

Starten Sie den üblichen Entwicklungsserver Ihrer Anwendung und öffnen Sie eine vorhandene Seite. Fügen Sie dieses Markup innerhalb ihres `ion-content` ein; verwenden Sie dabei die Komponentensyntax Ihres Frameworks:

```html
<ion-list inset="true">
  <ion-item-group>
    <ion-item><ion-label>Notifications</ion-label></ion-item>
    <ion-item><ion-label>Appearance</ion-label></ion-item>
  </ion-item-group>
</ion-list>
```

Sie sollten eine eingerückte Gruppe mit abgerundeten Rändern sehen. Wechseln Sie die Systemdarstellung zwischen hell und dunkel und navigieren Sie zwischen Seiten, um den Theme-Übergang zu sehen. Die Listenstruktur beschreibt [ion-item-group verwenden](https://docs.rdlabo.dev/projects/ionic-theme-ios27/docs/using-ion-item-group).

| Sichtbares Problem | Prüfen Sie Folgendes |
| --- | --- |
| Material-Design-Bedienelemente auf dem Desktop | Setzen Sie `mode: 'ios'` in der bestehenden Ionic-Initialisierung. |
| Ungestaltete Bedienelemente | Laden Sie das Theme-Stylesheet global nach Ionics Basisstilen. |
| Gemischte helle und dunkle Flächen | Verwenden Sie eine zusammenpassende Ionic-Palette und Theme-Dunkelmodusvariante. |
| Standardseitenübergänge | Übergeben Sie die Animationsoptionen vor der Ionic-Initialisierung. |

## Nächste Schritte

- [Stile und Komponenten anpassen](https://docs.rdlabo.dev/projects/ionic-theme-ios27/docs/features).
- [Native UI hinzufügen](https://docs.rdlabo.dev/projects/ionic-theme-ios27/docs/add-native-ui), um unterstützte Bedienelemente in einer Capacitor-iOS-App zu verwenden. Die Theme-Installation allein aktiviert keine nativen Bedienelemente.
- [Vertical Bars zu einem bestehenden Theme hinzufügen](https://docs.rdlabo.dev/projects/capacitor-native-ui/docs/ionic-vertical-bars).
- [Eine bestehende App migrieren](https://docs.rdlabo.dev/projects/ionic-theme-ios27/docs/migration).
