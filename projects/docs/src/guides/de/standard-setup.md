---
title: 'WebView Native UI Standardeinrichtung'
sourceRevision: '5481aa83039b3ce45afc79b52611c20a1dad86b2e932b6d8b7caff54da5deec8'
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
npm install --save-dev sass
```

## 2. Beide Themes konfigurieren

Bearbeiten Sie die globale Sass-Datei, etwa `src/global.scss`, nach den Ionic-Basisstilen. Setzen Sie `@use 'sass:meta'` an den Dateianfang. Ersetzen Sie vorhandene Imports der dunklen Ionic-Palette und der Themes durch diese Zusammenstellung. Eigene Anpassungen bleiben nach den Themes. Der Erscheinungscontroller aus Schritt 3 verwaltet die Klasse `ion-palette-dark`.

```scss:src/global.scss
@use 'sass:meta';

@include meta.load-css('@ionic/core/css/palettes/dark.class.css');

@supports not (overflow-anchor: auto) {
  @include meta.load-css('@rdlabo/ionic-theme-ios26/src/styles/default-variables');
  @include meta.load-css('@rdlabo/ionic-theme-ios26/src/styles/ionic-theme-ios26');
  @include meta.load-css('@rdlabo/ionic-theme-ios26/src/styles/ionic-theme-ios26-dark-class');
  @include meta.load-css('@rdlabo/ionic-theme-ios26/src/styles/md-remove-ios-class-effect');
  @include meta.load-css('@rdlabo/ionic-theme-ios27/src/styles/vertical-bars');
}

@supports (overflow-anchor: auto) {
  @include meta.load-css('@rdlabo/ionic-theme-ios27/src/styles/default-variables');
  @include meta.load-css('@rdlabo/ionic-theme-ios27/src/styles/ionic-theme-ios27');
  @include meta.load-css('@rdlabo/ionic-theme-ios27/src/styles/ionic-theme-ios27-dark-class');
  @include meta.load-css('@rdlabo/ionic-theme-ios27/src/styles/md-remove-ios-class-effect');
}

@include meta.load-css('@rdlabo/ionic-theme-md3/dist/styles/theme.css');
```

Sass muss Pakete über `node_modules` auflösen können. Ergänzen Sie bei Angular die folgenden Build-Optionen der App in `angular.json`. Konfigurieren Sie bei anderen Werkzeugen den entsprechenden Sass-Suchpfad.

```json
"stylePreprocessorOptions": {
  "includePaths": ["node_modules"]
}
```

Der iOS-Standardzweig verwendet das iOS-26-Theme. Browser mit Unterstützung für `overflow-anchor: auto` verwenden iOS 27. Geprüft wird eine Browserfunktion, keine Betriebssystemversion. Im Material-Design-Modus gilt MD3. Beide iOS-Zweige enthalten die Vertical-Bars-Layoutstile.

Wählen Sie das passende Preset vor der bestehenden Ionic-Initialisierung. Behalten Sie beim Anwenden Ihre weiteren Ionic-Optionen bei:

```ts
import { Capacitor } from '@capacitor/core';
import { ios26ThemeConfig, iosTransitionAnimation as ios26TransitionAnimation } from '@rdlabo/ionic-theme-ios26';
import { ios27ThemeConfig, withNativeUITransition } from '@rdlabo/ionic-theme-ios27';
import { md3ThemeConfig } from '@rdlabo/ionic-theme-md3';

const iosConfig =
  typeof CSS !== 'undefined' && CSS.supports('overflow-anchor: auto')
    ? ios27ThemeConfig
    : {
        ...ios26ThemeConfig,
        navAnimation: withNativeUITransition(ios26TransitionAnimation),
      };
const ionicConfig = Capacitor.getPlatform() === 'ios' ? iosConfig : md3ThemeConfig;
```

Die iOS-26-Navigationsanimation wird mit `withNativeUITransition` umschlossen, um Web und native Steuerelemente zu synchronisieren. `ios27ThemeConfig` enthält diesen Adapter bereits. Behalten Sie die Popover-Animationen des jeweiligen Presets bei.

| Framework         | Ionic initializer                                                   |
| ----------------- | ------------------------------------------------------------------- |
| Angular / Ionic 8 | `provideIonicAngular(ionicConfig)` from `@ionic/angular/standalone` |
| Angular / Ionic 9 | `provideIonicAngular(ionicConfig)` from `@ionic/angular`            |
| React             | `setupIonicReact(ionicConfig)` from `@ionic/react`                  |
| Vue               | `app.use(IonicVue, ionicConfig)` with `IonicVue` from `@ionic/vue`  |

Im Browser wählt dieses Beispiel MD3. Zur iOS-Vorschau auf dem Desktop setzen Sie `mode: 'ios'` in der vorhandenen Initialisierung mit dem passenden iOS-Preset. Das Theme allein aktiviert keine nativen Steuerelemente.

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
  mode: 'system',
  onError: console.error,
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

- Prüfen Sie unter iOS das Basistheme iOS 26 und das anhand der Fähigkeiten gewählte iOS-27-Theme. Wechseln Sie zwischen heller und dunkler Darstellung, navigieren Sie und öffnen Sie ein Popover, um die passenden Animationen zu prüfen.
- Unter iOS 26 oder neuer werden unterstützte Steuerelemente nativ dargestellt und verwenden die bestehenden Web-Ereignishandler. Das iOS-Theme gestaltet den übrigen Web-Inhalt.
- Unter Android 12 oder neuer verwendet Material Design 3 die Dynamic-Color-Palette des Geräts. Die Steuerelemente bleiben Web-Elemente. Ältere Android-Versionen verwenden die Theme-Palette.
- Auf Geräten mit nativen Rails folgt Vertical Bars den Änderungen des Gerätelayouts. Andere Geräte behalten das normale Web-Layout.
- Im Browser lassen sich Web-Themes und das Verhalten der App prüfen. Testen Sie native Steuerelemente, Gerätefarben und geräteabhängige Rails in den nativen Apps.

## Nach der Einrichtung

Nach diesen Prüfungen können Sie [das Erscheinungsbild anpassen](/guides/appearance), [native Steuerelemente konfigurieren](/guides/native-ui) oder [das Gerätelayout anpassen](/guides/device-layout). Nur für Themes folgen Sie der [iOS-26-Einrichtung](/projects/ionic-theme-ios26/docs/setup), [iOS 27](/projects/ionic-theme-ios27/docs/setup) oder [MD3](/projects/ionic-theme-md3/docs/setup).

## Einzelne Optionen

Für Native UI ohne diese Themes verwenden Sie die [Einrichtung mit vorhandenem Theme](/projects/capacitor-native-ui/docs/ionic-vertical-bars) oder die [HTML-Einrichtung](/projects/capacitor-native-ui/docs/framework-independent). Siehe [Dynamic Color](/projects/capacitor-native-ui/docs/dynamic-colors) für Darstellung und Farbzuordnung, [Konfiguration](/projects/capacitor-native-ui/docs/configuration) für Native-UI-Optionen und [Migration](/projects/capacitor-native-ui/docs/migration) für bestehende Integrationen.
