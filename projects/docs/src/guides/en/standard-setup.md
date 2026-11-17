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
npm install --save-dev sass
```

## 2. Configure both themes

Edit your global Sass file, such as `src/global.scss`, after Ionic’s base styles. Put `@use 'sass:meta'` at the top of the file. Replace existing Ionic dark-palette and theme imports with this composition; keep app-specific overrides after the theme styles. The appearance controller in step 3 owns the `ion-palette-dark` class.

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

Sass must resolve installed packages through `node_modules`. For Angular, add this to the application build options in `angular.json`. In another build tool, configure its Sass load path equivalently.

```json
"stylePreprocessorOptions": {
  "includePaths": ["node_modules"]
}
```

The default iOS branch uses the iOS 26 theme. Browsers supporting `overflow-anchor: auto` use iOS 27 instead; this is a capability check, not OS-version detection. Material Design mode uses MD3. Vertical Bars layout styles are included in both iOS branches.

Choose the matching preset before your existing Ionic initializer runs. Keep your other Ionic options when applying it:

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

The iOS 26 navigation animation is wrapped with `withNativeUITransition` to synchronize Web and native controls during navigation. `ios27ThemeConfig` already includes this adapter. Keep the popover animations supplied by each preset.

| Framework         | Ionic initializer                                                   |
| ----------------- | ------------------------------------------------------------------- |
| Angular / Ionic 8 | `provideIonicAngular(ionicConfig)` from `@ionic/angular/standalone` |
| Angular / Ionic 9 | `provideIonicAngular(ionicConfig)` from `@ionic/angular`            |
| React             | `setupIonicReact(ionicConfig)` from `@ionic/react`                  |
| Vue               | `app.use(IonicVue, ionicConfig)` with `IonicVue` from `@ionic/vue`  |

In a browser, this example selects MD3. To preview iOS styling on desktop, set `mode: 'ios'` in your existing initializer and use the matching iOS preset. The theme alone does not activate native controls.

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

- On iOS, check the base iOS 26 theme and the capability-selected iOS 27 theme. Switch between light and dark appearance, then navigate and open a popover to check the matching animations.
- On iOS 26 or later, supported controls render natively and keep the existing Web event handlers. The iOS theme styles the remaining Web content.
- On Android 12 or later, Material Design 3 uses the device’s Dynamic Color palette. The controls remain Web controls. Older Android devices use the theme’s fallback palette.
- On devices supporting native rails, changing the device layout updates Vertical Bars. Other devices retain the ordinary Web layout.
- A browser can preview the Web themes and application behavior. Check native controls, device colors and device-driven rails in the native apps.

## After setup

When the checks above pass, [customize appearance](/guides/appearance), [configure native controls](/guides/native-ui), or [adapt the device layout](/guides/device-layout). For a theme-only integration, follow the [iOS 26 setup](/projects/ionic-theme-ios26/docs/setup), [iOS 27 setup](/projects/ionic-theme-ios27/docs/setup), or [MD3 setup](/projects/ionic-theme-md3/docs/setup).

## Individual options

For Native UI without these themes, use [existing-theme setup](/projects/capacitor-native-ui/docs/ionic-vertical-bars) or [HTML setup](/projects/capacitor-native-ui/docs/framework-independent). See [Dynamic Color](/projects/capacitor-native-ui/docs/dynamic-colors) for appearance preferences and color mapping, [configuration](/projects/capacitor-native-ui/docs/configuration) for Native UI options, and [migration](/projects/capacitor-native-ui/docs/migration) for an existing integration.
