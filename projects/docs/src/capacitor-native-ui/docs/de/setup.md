---
title: "iOS Native UI und Android Dynamic Color einrichten"
sourceRevision: "cd1bb557ded9f71114fbb245d3ae38c0cac6e0a39987bfb056cf8ac505e919ab"
---

# iOS Native UI und Android Dynamic Color einrichten

Diese standardmäßige Ionic-Einrichtung kombiniert native iOS-Steuerelemente einschließlich iPhone Duo / Vertical Bars mit Android Dynamic Color. Zustand, Routen und Ereignishandler bleiben bei Ihrer Anwendung.

## 1. Pakete installieren

```sh
npm install @rdlabo/capacitor-native-ui @rdlabo/ionic-theme-ios27 @rdlabo/ionic-theme-md3 @erkamyaman/capacitor-foldable
```

Verwenden Sie eine bestehende Ionic-App mit Capacitor 8 und Foldable ab 8.5 innerhalb von Version 8.

## 2. Beide Themes konfigurieren

Behalten Sie Ionic-Basis-CSS bei und verwenden Sie diese Stylesheets. Der iOS-Einstieg enthält die klassenbasierte Dunkelpalette und das Vertical-Bars-Layout. Ersetzen Sie einen vorhandenen systemabhängigen oder dauerhaft dunklen Palettenimport durch diesen Einstieg.

```css
@import '@rdlabo/ionic-theme-ios27/styles/class.css';
@import '@rdlabo/ionic-theme-md3/styles/theme.css';
```

Übergeben Sie das passende Preset an die vorhandene Ionic-Initialisierung:

```ts
import { Capacitor } from '@capacitor/core';
import { ios27ThemeConfig } from '@rdlabo/ionic-theme-ios27';
import { md3ThemeConfig } from '@rdlabo/ionic-theme-md3';

const ionicConfig = Capacitor.getPlatform() === 'ios' ? ios27ThemeConfig : md3ThemeConfig;
```

| Framework | Ionic initializer |
| --- | --- |
| Angular / Ionic 8 | `provideIonicAngular(ionicConfig)` from `@ionic/angular/standalone` |
| Angular / Ionic 9 | `provideIonicAngular(ionicConfig)` from `@ionic/angular` |
| React | `setupIonicReact(ionicConfig)` from `@ionic/react` |
| Vue | `app.use(IonicVue, ionicConfig)` with `IonicVue` from `@ionic/vue` |

## 3. Nach dem Rendern der App-Shell starten

Führen Sie dies einmal nach dem Rendern der App-Shell einschließlich `ion-app` aus. Es verbindet beide Funktionen und die erforderlichen Layoutmeldungen:

```ts
import { Capacitor } from '@capacitor/core';
import { enableNativeUI, getDynamicColorScheme, addDynamicColorListener } from '@rdlabo/capacitor-native-ui';
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

Verwenden Sie unter Angular den `afterNextRender`-Callback der App-Shell, unter React oder Vue den Start nach dem Mounten. Verwaltet Ihre App eine eigene Darstellungspräferenz, verbinden Sie diese gemäß dem [Dynamic-Color-Leitfaden](dynamic-colors.md#apply-to-ionic), statt einen zweiten Darstellungscontroller anzulegen.

## 4. Erstellen, synchronisieren und ausführen

Erstellen Sie die Web-Assets, synchronisieren Sie und bauen und starten Sie anschließend jede native App neu:

```sh
npx cap sync
```

Native iOS-Steuerelemente benötigen iOS 26+ und Xcode 26+. Android Dynamic Color benötigt Android 12+; ältere Geräte behalten die Standardpalette. Natives Rail-Rendering erfordert zusätzlich ein [unterstütztes Gerät und Betriebssystem](vertical-bars.md#native-rendering). SwiftPM löst Engine automatisch auf; vorhandene CocoaPods-Projekte verwenden die [native Einrichtung](configuration.md#native-project-setup).

## Einzelne Optionen

Für Native UI ohne diese Themes verwenden Sie die [Einrichtung mit vorhandenem Theme](ionic-vertical-bars.md) oder die [HTML-Einrichtung](framework-independent.md). Siehe [Dynamic Color](dynamic-colors.md) für Darstellung und Farbzuordnung, [Konfiguration](configuration.md) für Native-UI-Optionen und [Migration](migration.md) für bestehende Integrationen.
