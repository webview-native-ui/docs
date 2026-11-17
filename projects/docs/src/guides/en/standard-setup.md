---
title: 'Set up an Ionic app'
headingAliases:
  'verify-installation': '5.-verify-the-integration'
  'check-the-result-on-each-platform': '5.-verify-the-integration'
  'after-setup': 'setup-complete'
---

# Set up an Ionic app

Set up an existing Ionic + Capacitor app with iOS 26 as its base iOS theme, iOS 27 styling on capable browsers, and Material Design 3 on Android. This guide also connects iOS native controls, iPhone Duo / Vertical Bars, and Android Dynamic Color.

## Before you start

This combined guide starts from an app that already uses Ionic dark.system.css and follows OS light/dark appearance. The removal line in the stylesheet diff is this actual starting policy, not a placeholder for any dark palette. If your app uses class or always policy, keep that behavior and use [existing-theme integration](/projects/capacitor-native-ui/docs/ionic-vertical-bars), the theme’s [configuration](/projects/ionic-theme-ios27/docs/configuration), or the [migration guide](/guides/migration) for an update. Switching such an app to system would change behavior and is outside this setup.

Use an existing Ionic 9 app with Capacitor 8 and Foldable 8.5 or later within major version 8. Choose iOS, Android, or both as your target. Begin with a working Web build and a native project for each selected platform; a second native project is not required. Keep your existing routes and handlers.

iOS native controls require iOS 26+ and Xcode 26+. Android Dynamic Color requires Android 12+; older devices retain the default palette. Native rail rendering additionally requires a [supported device and OS](/projects/capacitor-native-ui/docs/vertical-bars#native-rendering).

For a theme-only app, choose the [iOS 26](/projects/ionic-theme-ios26/docs/setup), [iOS 27](/projects/ionic-theme-ios27/docs/setup), or [MD3](/projects/ionic-theme-md3/docs/setup) installation. For [Native UI with an existing theme](/projects/capacitor-native-ui/docs/ionic-vertical-bars), [HTML without Ionic](/projects/capacitor-native-ui/docs/framework-independent), or [Cordova](/projects/cordova-native-ui/docs/readme), use that integration instead.

Paths in these diffs are example names for existing roles. Apply each edit to your app’s existing entry, root, page or global stylesheet; for Angular that stylesheet is often src/global.scss. Do not create src/global.css just to match a caption, because an unimported new file has no effect. Create only the files explicitly described as new, and retain unshown application code.

## 1. Install the packages

An existing app builds, but these packages are not installed. Run the command in the application directory. This step is complete when npm succeeds and the dependency manifest and lockfile have been updated; the UI is not enabled yet.

```sh
npm install @rdlabo/capacitor-native-ui @rdlabo/ionic-theme-ios26 \
  @rdlabo/ionic-theme-ios27 @rdlabo/ionic-theme-md3 \
  @erkamyaman/capacitor-foldable@8
```

## 2. Configure both themes

The packages are installed. Apply the stylesheet diff, then only your framework’s initialization diff. Context lines belong to the existing file and remain in place; preserve all unshown providers, router setup and application options. At the end, the themes and Ionic options are configured, but native startup is still missing.

The stylesheet diff uses src/global.css as the existing global stylesheet. If your app uses global.scss or another file, apply it there instead of creating another stylesheet. The removed dark.system.css is the actual starting palette; do not substitute a class or always palette in this removal.

These system presets preserve the existing policy of following OS light/dark appearance. Installing a theme does not introduce an application-controlled light/dark override. Change to class presets only when adding that override in the [appearance settings task](/guides/appearance). The startup controller keeps its default system mode.

<!-- prettier-ignore -->
```diff:src/global.css
@@
 @import '@ionic/core/css/core.css';
 @import '@ionic/core/css/structure.css';
- @import '@ionic/core/css/palettes/dark.system.css';
+ @import '@rdlabo/ionic-theme-ios26/styles/system.css' supports(not (overflow-anchor: auto));
+ @import '@rdlabo/ionic-theme-ios27/styles/system.css' supports(overflow-anchor: auto);
+ @import '@rdlabo/ionic-theme-ios27/dist/css/vertical-bars.css' supports(not (overflow-anchor: auto));
+ @import '@rdlabo/ionic-theme-md3/styles/theme.css';

 :root { --app-content-width: 72rem; }
```

CSS selects iOS 26 by default and iOS 27 when the browser supports `overflow-anchor: auto`. Material Design mode uses MD3. Both iOS themes use the same `ios27ThemeConfig`, including native transition synchronization. Pass the platform preset to the Ionic initializer your app already calls:

Use the example for your framework. Replace the app’s existing Ionic initialization with it; initialize Ionic once.

### Angular / Ionic 9

In the existing application configuration, pass the preset to the Ionic provider. Keep the other entries in the providers array, including the router and HTTP providers.

<!-- prettier-ignore -->
```diff:src/app/app.config.ts
@@
 import { provideIonicAngular } from '@ionic/angular';
 import { provideRouter } from '@angular/router';
 import { routes } from './app.routes';
+ import { Capacitor } from '@capacitor/core';
+ import { ios27ThemeConfig } from '@rdlabo/ionic-theme-ios27';
+ import { md3ThemeConfig } from '@rdlabo/ionic-theme-md3';
+ 
+ const ionicConfig = Capacitor.getPlatform() === 'ios' ? ios27ThemeConfig : md3ThemeConfig;

 export const appConfig: ApplicationConfig = {
   providers: [
     provideRouter(routes),
-     provideIonicAngular(),
+     provideIonicAngular(ionicConfig),
     provideHttpClient(),
   ],
 };
```

### React

In the existing entry file, call this before the existing root render. Keep your React root, routes, and CSS imports.

<!-- prettier-ignore -->
```diff:src/main.tsx
@@
 import { setupIonicReact } from '@ionic/react';
+ import { Capacitor } from '@capacitor/core';
+ import { ios27ThemeConfig } from '@rdlabo/ionic-theme-ios27';
+ import { md3ThemeConfig } from '@rdlabo/ionic-theme-md3';
 import { createRoot } from 'react-dom/client';
 import App from './App';
 import './global.css';

- setupIonicReact();
+ const ionicConfig = Capacitor.getPlatform() === 'ios' ? ios27ThemeConfig : md3ThemeConfig;
+ 
+ setupIonicReact(ionicConfig);

 createRoot(document.getElementById('root')!).render(<App />);
```

### Vue

In the existing entry file, pass the preset when registering IonicVue, before mounting. Keep existing router and other plugin registrations between creating and mounting the app.

<!-- prettier-ignore -->
```diff:src/main.ts
@@
 import { createApp } from 'vue';
 import { IonicVue } from '@ionic/vue';
+ import { Capacitor } from '@capacitor/core';
+ import { ios27ThemeConfig } from '@rdlabo/ionic-theme-ios27';
+ import { md3ThemeConfig } from '@rdlabo/ionic-theme-md3';
 import App from './App.vue';
 import router from './router';
 import './global.css';

+ const ionicConfig = Capacitor.getPlatform() === 'ios' ? ios27ThemeConfig : md3ThemeConfig;
+ 
 const app = createApp(App);
- app.use(IonicVue);
+ app.use(IonicVue, ionicConfig);
 app.use(router);
 router.isReady().then(() => app.mount('#app'));
```

## 3. Start after the app shell renders

The themes are configured. Create the new shared module using its all-added diff, then apply only your framework’s diff to the existing app root. Keep its template and router. The existing root will then call startup after rendering; native behavior has not yet been built or verified.

<!-- prettier-ignore -->
```diff:src/native-ui.ts
+ import { Capacitor } from '@capacitor/core';
+ import { enableNativeUI, getDynamicColorScheme, addDynamicColorListener } from '@rdlabo/capacitor-native-ui';
+ import { Foldable } from '@erkamyaman/capacitor-foldable';
+ import { resolveVerticalBarsLayout } from '@rdlabo/capacitor-native-ui/integration';
+ import { setVerticalBarsLayout } from '@rdlabo/ionic-theme-ios27';
+ import { enableDynamicColors } from '@rdlabo/ionic-theme-md3/dynamic-colors';
+ 
+ let startup: Promise<void> | undefined;
+ 
+ export function startNativeUI(): Promise<void> {
+   return (startup ??= connectNativeUI());
+ }
+ 
+ async function connectNativeUI(): Promise<void> {
+   await enableDynamicColors({
+     getScheme: getDynamicColorScheme,
+     listen: addDynamicColorListener,
+   });
+ 
+   if (Capacitor.getPlatform() === 'ios') {
+     await enableNativeUI();
+ 
+     const updateLayout = async () => {
+       setVerticalBarsLayout(await resolveVerticalBarsLayout(Foldable));
+     };
+ 
+     void Foldable.addListener('layoutChange', () => void updateLayout().catch(console.error))
+       .then(updateLayout)
+       .catch(console.error);
+   }
+ }
```

### Angular

Apply this diff to the existing root component. The template and component imports shown as context stay in place, including your existing menu and router.

<!-- prettier-ignore -->
```diff:src/app/app.component.ts
@@
- import { Component } from '@angular/core';
+ import { Component, afterNextRender } from '@angular/core';
 import { IonApp, IonRouterOutlet } from '@ionic/angular';
+ import { startNativeUI } from '../native-ui';

 @Component({
   selector: 'app-root',
   imports: [IonApp, IonRouterOutlet],
   template: '<ion-app><ion-router-outlet /></ion-app>',
 })
- export class AppComponent {}
+ export class AppComponent {
+   constructor() {
+     afterNextRender(() => {
+       void startNativeUI().catch(console.error);
+     });
+   }
+ }
```

### React

Apply this diff to the existing App component. ExistingRouter represents the router already rendered by the app; keep that router and its routes.

<!-- prettier-ignore -->
```diff:src/App.tsx
@@
+ import { useEffect } from 'react';
+ import { startNativeUI } from './native-ui';
 import { IonApp } from '@ionic/react';
 import { ExistingRouter } from './router';

 export default function App() {
+   useEffect(() => {
+     void startNativeUI().catch(console.error);
+   }, []);
+ 
   return <IonApp><ExistingRouter /></IonApp>;
 }
```

### Vue

Apply this diff to the existing App.vue script. Its current template, router outlet and menu stay unchanged.

<!-- prettier-ignore -->
```diff:src/App.vue
@@
 <script setup lang="ts">
+ import { onMounted } from 'vue';
 import { IonApp, IonRouterOutlet } from '@ionic/vue';
+ import { startNativeUI } from './native-ui';
+ 
+ onMounted(() => {
+   void startNativeUI().catch(console.error);
+ });
 </script>

 <template>
```

## 4. Build, sync, and run

Startup is wired. From the application directory, build the Web assets and run only the commands for your target platform. Build and launch the opened project in Xcode or Android Studio. At the end, the native app contains the new Web assets and plugin; installation is not accepted until step 5.

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

SwiftPM resolves Engine automatically. Existing CocoaPods projects use [native project setup](/projects/capacitor-native-ui/docs/configuration#native-project-setup).

## 5. Verify the integration

Native presentation of supported Ionic controls and device-layout updates are already enabled by setup. Use your existing screens and handlers to verify them below; no toolbar action, custom component or layout-preview code needs to be added.

The updated app is running. Android-only apps and iOS systems below the native requirements skip both iOS-only sections below, including all Safari commands, temporary-hook diffs, and iOS rebuild/sync commands. Use the completion-check table for your targets, then continue to Setup complete. Only iOS 26+ built with Xcode 26+ performs the temporary inspection and its removal.

### iOS 26+ / Xcode 26+ only: add temporary inspection

On iOS 26+ with Xcode 26+, inspect the existing runtime once during verification. In src/native-ui.ts, temporarily replace the existing await enableNativeUI() inside the iOS branch with these two lines. This exposes a read-only check of that same handle; it does not start another runtime.

<!-- prettier-ignore -->
```diff:src/native-ui.ts (iOS verification)
@@
-     await enableNativeUI();
+     const shell = await enableNativeUI();
+     Object.assign(window, { inspectNativeUI: () => shell.getStatus() });
```

Rebuild the development app and sync iOS using step 4. Open the app’s WebView in Safari Web Inspector. Display an existing page with a supported toolbar button or tab bar, then run this in its console after the page renders:

```js
window.inspectNativeUI();
```

For supported native controls, state must be native and projected must be positive, and activating a control must call its original Web handler once. Projection is asynchronous: if projected is initially 0, let the page finish displaying and check again. A persistent 0 does not verify native rendering. If state stays web on a supported iOS build, inspect reason and check the native sync/rebuild and control support before completing setup. A web fallback is expected on unsupported systems; confirm that the Web controls remain usable. After checking, remove the temporary hook and restore the original await enableNativeUI() call.

### All targets: completion checks

| Target                          | Check                                                                     | Complete when                                                                                                                              |
| ------------------------------- | ------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| All targets                     | Open existing pages, navigate, and change light/dark appearance.          | Routes, handlers, and readable Web controls still work.                                                                                    |
| iOS                             | Run on iOS 26+ with Xcode 26+ and inspect supported controls.             | The existing supported control renders natively; activating it runs the original Web handler once. Older systems keep usable Web controls. |
| Android                         | Open the native app; on Android 12+ change the device palette and reopen. | MD3 uses device colors where available; unsupported devices keep a usable fallback palette and Web controls.                               |
| Device with native rail support | Change its layout and restore it.                                         | Vertical Bars follows the reported layout and removes spacing again. On other devices, ordinary layout is the expected result.             |
| Browser                         | Preview themes and use existing actions.                                  | Web appearance and behavior work; this is not evidence of native controls, device colors, or rails.                                        |

### iOS 26+ / Xcode 26+ only: remove temporary inspection

Only if you used the supported-iOS inspection above, apply this removal diff. Android-only and older-iOS users skip this entire section, including its commands, and continue to Setup complete.

<!-- prettier-ignore -->
```diff:src/native-ui.ts (iOS verification)
@@
-     const shell = await enableNativeUI();
-     Object.assign(window, { inspectNativeUI: () => shell.getStatus() });
+     await enableNativeUI();
```

From the app directory run the build and sync commands below, stop the running iOS app, and relaunch it. Reopen Safari Web Inspector and evaluate the console expression; its expected result is undefined. The normal controls and original handlers must still work. This clears the old window hook as well as removing it from source.

```sh
npm run build
npx cap sync ios
```

```js
typeof window.inspectNativeUI;
```

## Setup complete

When the selected platforms pass the checks above, setup is complete. Choose an optional task only to add a feature: [appearance settings](/guides/appearance) or [custom native UI](/guides/extensions).

## Individual options

For Native UI without these themes, use [existing-theme setup](/projects/capacitor-native-ui/docs/ionic-vertical-bars) or [HTML setup](/projects/capacitor-native-ui/docs/framework-independent). See [Dynamic Color](/projects/capacitor-native-ui/docs/dynamic-colors) for appearance preferences and color mapping, [configuration](/projects/capacitor-native-ui/docs/configuration) for Native UI options, and [migration](/projects/capacitor-native-ui/docs/migration) for an existing integration.
