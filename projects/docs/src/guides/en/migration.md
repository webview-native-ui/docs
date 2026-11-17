# Migrate an existing app

Update an existing integration without replacing routes, application state, or event handlers. Check what is installed, update the matching packages, replace old wiring, and verify the same screens after the native rebuild.

## 1. Record the installed packages

Run this in the app directory and record its package versions. A missing entry tells you that capability is not installed; do not add Native UI to a theme-only app just to migrate a theme. This page uses Ionic 9 and Capacitor 8. Cordova apps use their bundled plugin migration instead of the Capacitor commands here.

```sh
npm ls @ionic/core @capacitor/core @rdlabo/ionic-theme-ios26 @rdlabo/ionic-theme-ios27 @rdlabo/ionic-theme-md3 @rdlabo/capacitor-native-ui
```

## 2. Update the packages you use

For the combined Ionic + Capacitor app, update these packages together, keeping Foldable within major version 8. For a theme-only app, update only its installed theme instead. Keep the lockfile produced by npm. Do not change framework, theme, and native behavior by copying every alternative command.

```sh
npm install @rdlabo/ionic-theme-ios26@latest @rdlabo/ionic-theme-ios27@latest   @rdlabo/ionic-theme-md3@latest @rdlabo/capacitor-native-ui@latest   @erkamyaman/capacitor-foldable@8
```

## 3. Replace old Native UI imports and startup

Only apps with the earlier theme-bundled Native UI need this replacement. Search the project for the old native entry and enableNativeUIShell. Replace that existing call at the app shell; keep one runtime and the existing page handlers. If these old names are absent, move to the next step.

```diff
- import { enableNativeUIShell } from '@rdlabo/ionic-theme-ios27/native';
+ import { enableNativeUI } from '@rdlabo/capacitor-native-ui';

- await enableNativeUIShell();
+ await enableNativeUI();
```

## 4. Keep the appearance policy and simplify its imports

An app already using the iOS 27 class palette can replace the following matching group with one preset. Keep system.css for system-managed theme-only apps and always.css for an always-dark app. For the combined iOS 26/27 + MD3 configuration, keep the four imports and the single iOS preset from [app setup](/standard-setup); do not add this iOS-27-only import alongside them.

```diff
- @import '@ionic/core/css/palettes/dark.class.css';
- @import '@rdlabo/ionic-theme-ios27/dist/css/default-variables.css';
- @import '@rdlabo/ionic-theme-ios27/dist/css/ionic-theme-ios27.css';
- @import '@rdlabo/ionic-theme-ios27/dist/css/ionic-theme-ios27-dark-class.css';
- @import '@rdlabo/ionic-theme-ios27/dist/css/md-remove-ios-class-effect.css';
+ @import '@rdlabo/ionic-theme-ios27/styles/class.css';
```

## 5. Update the existing layout handler

If the app maps getBarPlacement directly to edge and inset, replace that mapping inside its existing layoutChange handler. The resolver also provides toolbarTop. Do not add another subscription, change the appearance preset by OS generation, or manually wrap the shared iOS preset’s navigation animation. Keep ordinary Native UI startup at the app shell.

Skip this step if the app has no device-layout integration.

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

## 6. Rebuild and finish the regression checks

For a browser/theme-only app, run the Web build and check the selected theme's appearance, light/dark policy and navigation. That finishes the migration; skip Native UI and layout steps when those features are absent. No native project or rail device is required.

For an app with native features, build Web assets and run only the commands for each existing target below. Check the native features the app actually uses, the same Web handlers and navigation including cancellation. Test device colors or rails only when installed and supported; otherwise verify the fallback on the available device. Custom extensions are not required.

```sh
npm run build
```

### iOS

```sh
npx cap sync ios
npx cap open ios
```

### Android

```sh
npx cap sync android
npx cap open android
```

For [Native UI with an existing theme](/projects/capacitor-native-ui/docs/ionic-vertical-bars), [HTML without Ionic](/projects/capacitor-native-ui/docs/framework-independent), or [Cordova](/projects/cordova-native-ui/docs/readme), use that integration instead. [Choose another setup](/#choose-setup) before changing the app.
