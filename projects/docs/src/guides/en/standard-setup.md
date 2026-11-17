# WebView Native UI Standard setup

Set up an existing Ionic + Capacitor app with iOS 26 as its base iOS theme, iOS 27 styling on capable browsers, and Material Design 3 on Android. This guide also connects iOS native controls, iPhone Duo / Vertical Bars, and Android Dynamic Color.

## Before you start

Use Ionic 8.8.1 or later within Ionic 8 or 9, Capacitor 8, and Foldable 8.5 or later within version 8. Start with an app whose Web build already works and whose iOS and Android native projects have been added. Keep your existing routes and event handlers.

iOS native controls require iOS 26+ and Xcode 26+. Android Dynamic Color requires Android 12+; older devices retain the default palette. Native rail rendering additionally requires a [supported device and OS](/projects/capacitor-native-ui/docs/vertical-bars#native-rendering).

For other integrations, choose [HTML without Ionic](/projects/capacitor-native-ui/docs/framework-independent), [Cordova](/projects/cordova-native-ui/docs/readme), or [themes only](/guides/appearance).

## 1. Install the packages

```sh
npm install @rdlabo/capacitor-native-ui @rdlabo/ionic-theme-ios26 \
  @rdlabo/ionic-theme-ios27 @rdlabo/ionic-theme-md3 \
  @erkamyaman/capacitor-foldable@8
```

## 2. Configure both themes

Add these imports to your global stylesheet after Ionic’s base CSS. Replace existing theme and Ionic dark-palette imports. The presets include the matching dark palette and compatibility styles; no additional Sass setup is needed.

```css
@import '@rdlabo/ionic-theme-ios26/styles/class.css' supports(not (overflow-anchor: auto));
@import '@rdlabo/ionic-theme-ios27/styles/class.css' supports(overflow-anchor: auto);
@import '@rdlabo/ionic-theme-ios27/dist/css/vertical-bars.css' supports(not (overflow-anchor: auto));
@import '@rdlabo/ionic-theme-md3/styles/theme.css';
```

CSS selects iOS 26 by default and iOS 27 when the browser supports `overflow-anchor: auto`. Material Design mode uses MD3. Both iOS themes use the same `ios27ThemeConfig`, including native transition synchronization. Pass the platform preset to the Ionic initializer your app already calls:

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

To preview iOS styling on desktop, use `ios27ThemeConfig` in your existing initializer. The theme alone does not activate native controls.

## 3. Start after the app shell renders

Run this once after the app shell, including `ion-app`, has rendered. It connects both features and the required device-layout notifications:

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

The theme controller follows the system appearance and applies Android’s palette when available. Other platforms and unsupported Android devices keep the theme’s fallback colors. On iOS, Native UI starts with ordinary controls and Vertical Bars enabled; the layout subscription applies the initial placement and display changes.

For Angular, use the app shell’s `afterNextRender` callback. For React or Vue, use application startup after mounting. If your app manages its own appearance preference, use the [Dynamic Color guide](/projects/capacitor-native-ui/docs/dynamic-colors#apply-to-ionic) to connect it instead of creating a second appearance controller.

## 4. Build, sync, and run

Run your app’s Web build first (the command below assumes the existing `build` script), then sync. Open each existing native project and build/run it for a simulator or device:

```sh
npm run build
npx cap sync
npx cap open ios
npx cap open android
```

SwiftPM resolves Engine automatically; existing CocoaPods projects use [native project setup](/projects/capacitor-native-ui/docs/configuration#native-project-setup).

## Check the result on each platform

- Check light/dark appearance and page navigation. The iOS 27 navigation preset works with both iOS theme styles.
- On iOS 26 or later, supported controls render natively and keep the existing Web event handlers. The iOS theme styles the remaining Web content.
- On Android 12 or later, Material Design 3 uses the device’s Dynamic Color palette. The controls remain Web controls. Older Android devices use the theme’s fallback palette.
- On devices supporting native rails, changing the device layout updates Vertical Bars. Other devices retain the ordinary Web layout.
- A browser can preview the Web themes and application behavior. Check native controls, device colors and device-driven rails in the native apps.

## After setup

When the checks above pass, [customize appearance](/guides/appearance), [configure native controls](/guides/native-ui), or [adapt the device layout](/guides/device-layout). For a theme-only integration, follow the [iOS 26 setup](/projects/ionic-theme-ios26/docs/setup), [iOS 27 setup](/projects/ionic-theme-ios27/docs/setup), or [MD3 setup](/projects/ionic-theme-md3/docs/setup).

## Individual options

For Native UI without these themes, use [existing-theme setup](/projects/capacitor-native-ui/docs/ionic-vertical-bars) or [HTML setup](/projects/capacitor-native-ui/docs/framework-independent). See [Dynamic Color](/projects/capacitor-native-ui/docs/dynamic-colors) for appearance preferences and color mapping, [configuration](/projects/capacitor-native-ui/docs/configuration) for Native UI options, and [migration](/projects/capacitor-native-ui/docs/migration) for an existing integration.
