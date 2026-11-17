---
title: 'WebView Native UI Standardeinrichtung'
sourceRevision: 'd464340cef90f89bc2de11fddf7c1d14ee8d4cf989b4e08fcac1c9240e1e4a80'
---

# WebView Native UI Standardeinrichtung

Richten Sie eine bestehende Ionic- und Capacitor-App mit iOS 26 als iOS-Basistheme, iOS 27 für geeignete Browser und Material Design 3 auf Android ein. Diese Anleitung verbindet außerdem native iOS-Steuerelemente, iPhone Duo / Vertical Bars und Android Dynamic Color.

## Vor dem Start

Verwenden Sie Ionic 8 oder 9 ab 8.8.1, Capacitor 8 sowie Foldable 8.5 oder neuer innerhalb von Version 8. Beginnen Sie mit einer App, deren Web-Build funktioniert und deren native iOS- und Android-Projekte bereits hinzugefügt wurden. Bestehende Routen und Ereignishandler bleiben erhalten.

Native iOS-Steuerelemente benötigen iOS 26+ und Xcode 26+. Android Dynamic Color benötigt Android 12+; ältere Geräte behalten die Standardpalette. Natives Rail-Rendering erfordert zusätzlich ein [unterstütztes Gerät und Betriebssystem](/projects/capacitor-native-ui/docs/vertical-bars#native-rendering).

Für andere Integrationen wählen Sie [HTML ohne Ionic](/projects/capacitor-native-ui/docs/framework-independent), [Cordova](/projects/cordova-native-ui/docs/readme) oder [nur Themes](/guides/appearance).

## 1. Pakete installieren

```sh
npm install @rdlabo/capacitor-native-ui @rdlabo/ionic-theme-ios26 \
  @rdlabo/ionic-theme-ios27 @rdlabo/ionic-theme-md3 \
  @erkamyaman/capacitor-foldable@8
```

## 2. Beide Themes konfigurieren

Fügen Sie diese Imports nach dem Ionic-Basis-CSS in die globale Stylesheet-Datei ein. Ersetzen Sie vorhandene Theme- und dunkle Ionic-Paletten-Imports. Die Presets enthalten die passende Palette und Kompatibilitätsstile; zusätzliche Sass-Konfiguration ist nicht nötig.

```css
@import '@rdlabo/ionic-theme-ios26/styles/class.css' supports(not (overflow-anchor: auto));
@import '@rdlabo/ionic-theme-ios27/styles/class.css' supports(overflow-anchor: auto);
@import '@rdlabo/ionic-theme-ios27/dist/css/vertical-bars.css' supports(not (overflow-anchor: auto));
@import '@rdlabo/ionic-theme-md3/styles/theme.css';
```

CSS wählt standardmäßig iOS 26 und bei Unterstützung für `overflow-anchor: auto` iOS 27. Der Material-Design-Modus nutzt MD3. Beide iOS-Stile verwenden dasselbe `ios27ThemeConfig` einschließlich nativer Übergangssynchronisierung. Übergeben Sie das Plattform-Preset an Ihre vorhandene Ionic-Initialisierung:

```ts
import { Capacitor } from '@capacitor/core';
import { ios27ThemeConfig } from '@rdlabo/ionic-theme-ios27';
import { md3ThemeConfig } from '@rdlabo/ionic-theme-md3';

const ionicConfig = Capacitor.getPlatform() === 'ios' ? ios27ThemeConfig : md3ThemeConfig;
```

| Framework         | Ionic initializer                                                   |
| ----------------- | ------------------------------------------------------------------- |
| Angular / Ionic 8 | `provideIonicAngular(ionicConfig)` from `@ionic/angular/standalone` |
| Angular / Ionic 9 | `provideIonicAngular(ionicConfig)` from `@ionic/angular`            |
| React             | `setupIonicReact(ionicConfig)` from `@ionic/react`                  |
| Vue               | `app.use(IonicVue, ionicConfig)` with `IonicVue` from `@ionic/vue`  |

Für die iOS-Vorschau auf dem Desktop verwenden Sie `ios27ThemeConfig` in der vorhandenen Initialisierung. Das Theme allein aktiviert keine nativen Steuerelemente.

## 3. Nach dem Rendern der App-Shell starten

Führen Sie dies einmal nach dem Rendern der App-Shell einschließlich `ion-app` aus. Es verbindet beide Funktionen und die erforderlichen Layoutmeldungen:

```ts
import { Capacitor } from '@capacitor/core';
import {
  enableNativeUI,
  getDynamicColorScheme,
  addDynamicColorListener,
} from '@rdlabo/capacitor-native-ui';
import { Foldable } from '@erkamyaman/capacitor-foldable';
import { resolveVerticalBarsLayout } from '@rdlabo/capacitor-native-ui/integration';
import { setVerticalBarsLayout } from '@rdlabo/ionic-theme-ios27';
import { enableDynamicColors } from '@rdlabo/ionic-theme-md3/dynamic-colors';

await enableDynamicColors({
  getScheme: getDynamicColorScheme,
  listen: addDynamicColorListener,
});

if (Capacitor.getPlatform() === 'ios') {
  await enableNativeUI();

  const updateLayout = async () => {
    setVerticalBarsLayout(await resolveVerticalBarsLayout(Foldable));
  };

  void Foldable.addListener('layoutChange', () => void updateLayout().catch(console.error))
    .then(updateLayout)
    .catch(console.error);
}
```

Der Theme-Controller folgt der Systemdarstellung und wendet die Android-Palette an, wenn verfügbar. Andere Plattformen und nicht unterstützte Android-Geräte behalten die Ersatzfarben. Unter iOS startet Native UI mit normalen Steuerelementen und Vertical Bars; das Abonnement übernimmt das anfängliche Layout und Displaywechsel.

Verwenden Sie unter Angular den `afterNextRender`-Callback der App-Shell, unter React oder Vue den Start nach dem Mounten. Verwaltet Ihre App eine eigene Darstellungspräferenz, verbinden Sie diese gemäß dem [Dynamic-Color-Leitfaden](/projects/capacitor-native-ui/docs/dynamic-colors#apply-to-ionic), statt einen zweiten Darstellungscontroller anzulegen.

## 4. Erstellen, synchronisieren und ausführen

Erstellen Sie zuerst die Web-Dateien; der Befehl setzt ein vorhandenes `build`-Skript voraus. Synchronisieren Sie dann, öffnen Sie jedes bestehende native Projekt und bauen/starten Sie es für einen Simulator oder ein Gerät:

```sh
npm run build
npx cap sync
npx cap open ios
npx cap open android
```

SwiftPM löst Engine automatisch auf; vorhandene CocoaPods-Projekte verwenden die [native Einrichtung](/projects/capacitor-native-ui/docs/configuration#native-project-setup).

## Das Ergebnis auf jeder Plattform prüfen

- Prüfen Sie helle/dunkle Darstellung und Navigation. Das iOS-27-Übergangspreset gilt für beide iOS-Stile.
- Unter iOS 26 oder neuer werden unterstützte Steuerelemente nativ dargestellt und verwenden die bestehenden Web-Ereignishandler. Das iOS-Theme gestaltet den übrigen Web-Inhalt.
- Unter Android 12 oder neuer verwendet Material Design 3 die Dynamic-Color-Palette des Geräts. Die Steuerelemente bleiben Web-Elemente. Ältere Android-Versionen verwenden die Theme-Palette.
- Auf Geräten mit nativen Rails folgt Vertical Bars den Änderungen des Gerätelayouts. Andere Geräte behalten das normale Web-Layout.
- Im Browser lassen sich Web-Themes und das Verhalten der App prüfen. Testen Sie native Steuerelemente, Gerätefarben und geräteabhängige Rails in den nativen Apps.

## Nach der Einrichtung

Nach diesen Prüfungen können Sie [das Erscheinungsbild anpassen](/guides/appearance), [native Steuerelemente konfigurieren](/guides/native-ui) oder [das Gerätelayout anpassen](/guides/device-layout). Nur für Themes folgen Sie der [iOS-26-Einrichtung](/projects/ionic-theme-ios26/docs/setup), [iOS 27](/projects/ionic-theme-ios27/docs/setup) oder [MD3](/projects/ionic-theme-md3/docs/setup).

## Einzelne Optionen

Für Native UI ohne diese Themes verwenden Sie die [Einrichtung mit vorhandenem Theme](/projects/capacitor-native-ui/docs/ionic-vertical-bars) oder die [HTML-Einrichtung](/projects/capacitor-native-ui/docs/framework-independent). Siehe [Dynamic Color](/projects/capacitor-native-ui/docs/dynamic-colors) für Darstellung und Farbzuordnung, [Konfiguration](/projects/capacitor-native-ui/docs/configuration) für Native-UI-Optionen und [Migration](/projects/capacitor-native-ui/docs/migration) für bestehende Integrationen.
