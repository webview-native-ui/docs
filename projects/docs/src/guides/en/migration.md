# Migrate to the recommended setup

Earlier versions required apps to configure each package separately. This guide shows how to replace those settings with the recommended setup for the themes and native features your Ionic app already uses.

## 1. Record the installed packages

For an Ionic 9 and Capacitor 8 app, list the installed themes and plugins to select the packages to update in step 2. For Cordova, see the [Cordova plugin guide](/projects/cordova-native-ui/docs/readme).

```sh
npm ls @rdlabo/ionic-theme-ios26 @rdlabo/ionic-theme-ios27 @rdlabo/ionic-theme-md3 @rdlabo/capacitor-native-ui @erkamyaman/capacitor-foldable
```

## 2. Update the packages you use

Using that inventory, update only the packages already used. The combined-install command is only for that configuration. This step ends with updated dependencies and lockfile; existing source wiring has not yet changed.

For the combined Ionic + Capacitor app, update these packages together, keeping Foldable within major version 8. For a theme-only app, update only its installed theme instead. Keep the lockfile produced by npm. Do not change framework, theme, and native behavior by copying every alternative command.

```sh
npm install @rdlabo/ionic-theme-ios26@latest @rdlabo/ionic-theme-ios27@latest   @rdlabo/ionic-theme-md3@latest @rdlabo/capacitor-native-ui@latest   @erkamyaman/capacitor-foldable@8
```

If your app uses the Native UI bundled with an older iOS 27 theme, follow the [package migration guide](/projects/ionic-theme-ios27/docs/migration#native-ui-package-separation).

## 3. Keep the appearance policy and simplify its imports

Apply this stylesheet diff only if its old class-palette group matches your app. Keep a system/always policy instead when that is the installed policy. The selected policy is unchanged; only its import composition is simplified.

An app already using the iOS 27 class palette can replace the following matching group with one preset. Keep system.css for system-managed theme-only apps and always.css for an always-dark app. For the combined iOS 26/27 + MD3 configuration, keep the imports and the single iOS preset from [app setup](/standard-setup); do not add this iOS-27-only import alongside them.

The combined app setup keeps system imports for both iOS themes by default, preserving OS-following light/dark behavior. Keep those imports during a theme-only update. Only the [appearance settings task](/guides/appearance) changes them to class imports when adding application-controlled light/dark overrides; that policy change is separate from choosing device colors. The legacy class-palette diff below already uses manual policy and preserves it.

<!-- prettier-ignore -->
```diff:src/global.css
@@
 @import '@ionic/core/css/core.css';
- @import '@ionic/core/css/palettes/dark.class.css';
- @import '@rdlabo/ionic-theme-ios27/dist/css/default-variables.css';
- @import '@rdlabo/ionic-theme-ios27/dist/css/ionic-theme-ios27.css';
- @import '@rdlabo/ionic-theme-ios27/dist/css/ionic-theme-ios27-dark-class.css';
- @import '@rdlabo/ionic-theme-ios27/dist/css/md-remove-ios-class-effect.css';
+ @import '@rdlabo/ionic-theme-ios27/styles/class.css';
```

## 4. Update the existing layout handler

If an old device-layout callback exists, change only its import and resolver mapping with this diff. The listener shown is existing context. Otherwise skip the step. At the end, one existing subscription applies the resolver result.

If the app maps getBarPlacement directly to edge and inset, replace that mapping inside its existing layoutChange handler. The resolver also provides toolbarTop. Do not add another subscription, change the appearance preset by OS generation, or manually wrap the shared iOS preset’s navigation animation. Keep ordinary Native UI startup at the app shell.

Skip this step if the app has no device-layout integration.

<!-- prettier-ignore -->
```diff:src/native-ui.ts
@@
 import { enableNativeUI } from '@rdlabo/capacitor-native-ui';
 import { Foldable } from '@erkamyaman/capacitor-foldable';
+ import { resolveVerticalBarsLayout } from '@rdlabo/capacitor-native-ui/integration';
 import { setVerticalBarsLayout } from '@rdlabo/ionic-theme-ios27';

 export async function startLegacyUI(): Promise<void> {
   await enableNativeUI();
   const updateLayout = async () => {
-     const placement = await Foldable.getBarPlacement();
-     setVerticalBarsLayout({ edge: placement.edge, inset: placement.inset });
+     setVerticalBarsLayout(await resolveVerticalBarsLayout(Foldable));
   };
   void Foldable.addListener('layoutChange', () => void updateLayout().catch(console.error))
     .then(updateLayout)
```

## 5. Rebuild and finish the regression checks

The applicable source changes are now made. Build from the app directory and run only the target commands for existing native features. A browser/theme-only app finishes after its Web checks. Native apps finish when the features actually used still work after rebuild, sync and relaunch; optional rails or extensions are not new prerequisites.

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
