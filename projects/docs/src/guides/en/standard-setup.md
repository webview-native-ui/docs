# Set up an Ionic app

Set up an existing Ionic + Capacitor app with iOS 26 as its base iOS theme, iOS 27 styling on capable browsers, and Material Design 3 on Android. This guide also connects iOS native controls, iPhone Duo / Vertical Bars, and Android Dynamic Color.

## Before you start

Use an existing Ionic 9 app with Capacitor 8 and Foldable 8.5 or later within major version 8. Choose iOS, Android, or both as your target. Begin with a working Web build and a native project for each selected platform; a second native project is not required. Keep your existing routes and handlers.

iOS native controls require iOS 26+ and Xcode 26+. Android Dynamic Color requires Android 12+; older devices retain the default palette. Native rail rendering additionally requires a [supported device and OS](/projects/capacitor-native-ui/docs/vertical-bars#native-rendering).

For a theme-only app, choose the [iOS 26](/projects/ionic-theme-ios26/docs/setup), [iOS 27](/projects/ionic-theme-ios27/docs/setup), or [MD3](/projects/ionic-theme-md3/docs/setup) installation. For [Native UI with an existing theme](/projects/capacitor-native-ui/docs/ionic-vertical-bars), [HTML without Ionic](/projects/capacitor-native-ui/docs/framework-independent), or [Cordova](/projects/cordova-native-ui/docs/readme), use that integration instead.

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

Use the example for your framework. Replace the app’s existing Ionic initialization with it; initialize Ionic once.

### Angular / Ionic 9

In the existing application configuration, pass the preset to the Ionic provider. Keep the other entries in the providers array, including the router and HTTP providers.

```ts:src/app/app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideIonicAngular } from '@ionic/angular';
import { Capacitor } from '@capacitor/core';
import { ios27ThemeConfig } from '@rdlabo/ionic-theme-ios27';
import { md3ThemeConfig } from '@rdlabo/ionic-theme-md3';

const ionicConfig = Capacitor.getPlatform() === 'ios' ? ios27ThemeConfig : md3ThemeConfig;

export const appConfig: ApplicationConfig = {
  providers: [provideIonicAngular(ionicConfig)],
};
```

### React

In the existing entry file, call this before the existing root render. Keep your React root, routes, and CSS imports.

```ts:src/main.tsx
import { setupIonicReact } from '@ionic/react';
import { Capacitor } from '@capacitor/core';
import { ios27ThemeConfig } from '@rdlabo/ionic-theme-ios27';
import { md3ThemeConfig } from '@rdlabo/ionic-theme-md3';

const ionicConfig = Capacitor.getPlatform() === 'ios' ? ios27ThemeConfig : md3ThemeConfig;

setupIonicReact(ionicConfig);
```

### Vue

In the existing entry file, pass the preset when registering IonicVue, before mounting. Keep existing router and other plugin registrations between creating and mounting the app.

```ts:src/main.ts
import { createApp } from 'vue';
import { IonicVue } from '@ionic/vue';
import { Capacitor } from '@capacitor/core';
import { ios27ThemeConfig } from '@rdlabo/ionic-theme-ios27';
import { md3ThemeConfig } from '@rdlabo/ionic-theme-md3';
import App from './App.vue';

const ionicConfig = Capacitor.getPlatform() === 'ios' ? ios27ThemeConfig : md3ThemeConfig;

const app = createApp(App);
app.use(IonicVue, ionicConfig);
app.mount('#app');
```

## 3. Start after the app shell renders

Create src/native-ui.ts with the shared startup below. It returns the same startup promise on repeated calls so a repeated React effect does not start the appearance controller twice. Call it from your app shell after rendering, using only the example for your framework.

```ts:src/native-ui.ts
import { Capacitor } from '@capacitor/core';
import { enableNativeUI, getDynamicColorScheme, addDynamicColorListener } from '@rdlabo/capacitor-native-ui';
import { Foldable } from '@erkamyaman/capacitor-foldable';
import { resolveVerticalBarsLayout } from '@rdlabo/capacitor-native-ui/integration';
import { setVerticalBarsLayout } from '@rdlabo/ionic-theme-ios27';
import { enableDynamicColors } from '@rdlabo/ionic-theme-md3/dynamic-colors';

let startup: Promise<void> | undefined;

export function startNativeUI(): Promise<void> {
  return (startup ??= connectNativeUI());
}

async function connectNativeUI(): Promise<void> {
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
}
```

### Angular

In the existing root component, add the import and afterNextRender callback. The minimal shell below shows where it goes; keep your existing component imports, template, menu, and router.

```ts:src/app/app.component.ts
import { Component, afterNextRender } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular';
import { startNativeUI } from '../native-ui';

@Component({
  selector: 'app-root',
  imports: [IonApp, IonRouterOutlet],
  template: '<ion-app><ion-router-outlet /></ion-app>',
})
export class AppComponent {
  constructor() {
    afterNextRender(() => {
      void startNativeUI().catch(console.error);
    });
  }
}
```

### React

In the existing App component, add the import and effect. Keep your existing JSX router and pages inside IonApp.

```tsx:src/App.tsx
import { useEffect } from 'react';
import { IonApp } from '@ionic/react';
import { startNativeUI } from './native-ui';

export default function App() {
  useEffect(() => {
    void startNativeUI().catch(console.error);
  }, []);

  return <IonApp>{/* Keep your existing router and pages here. */}</IonApp>;
}
```

### Vue

In the existing App.vue, add the import and onMounted callback to its script. Keep the current template, routes, and menu.

```vue:src/App.vue
<script setup lang="ts">
import { onMounted } from 'vue';
import { IonApp, IonRouterOutlet } from '@ionic/vue';
import { startNativeUI } from './native-ui';

onMounted(() => {
  void startNativeUI().catch(console.error);
});
</script>

<template>
  <ion-app><ion-router-outlet /></ion-app>
</template>
```

## 4. Build, sync, and run

Build the Web app, then run only the commands for your selected native platform. Build and run that project in Xcode or Android Studio; run both groups only when targeting both platforms.

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

## Check the result on each platform

Complete the row for each selected platform. Features unavailable on that device pass when the documented fallback works; another platform or a rail-capable device is not required to finish.

| Target                          | Check                                                                     | Complete when                                                                                                                                                              |
| ------------------------------- | ------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| All targets                     | Open existing pages, navigate, and change light/dark appearance.          | Routes, handlers, and readable Web controls still work.                                                                                                                    |
| iOS                             | Run on iOS 26+ with Xcode 26+ and inspect supported controls.             | Native presentation and the existing Web action work. Use the [control walkthrough](/guides/native-ui) for projection diagnostics. Older systems keep usable Web controls. |
| Android                         | Open the native app; on Android 12+ change the device palette and reopen. | MD3 uses device colors where available; unsupported devices keep a usable fallback palette and Web controls.                                                               |
| Device with native rail support | Change its layout and restore it.                                         | Vertical Bars follows the reported layout and removes spacing again. On other devices, ordinary layout is the expected result.                                             |
| Browser                         | Preview themes and use existing actions.                                  | Web appearance and behavior work; this is not evidence of native controls, device colors, or rails.                                                                        |

## After setup

When the checks above pass, [customize appearance](/guides/appearance), [configure native controls](/guides/native-ui), or [adapt the device layout](/guides/device-layout). For a theme-only integration, follow the [iOS 26 setup](/projects/ionic-theme-ios26/docs/setup), [iOS 27 setup](/projects/ionic-theme-ios27/docs/setup), or [MD3 setup](/projects/ionic-theme-md3/docs/setup).

## Individual options

For Native UI without these themes, use [existing-theme setup](/projects/capacitor-native-ui/docs/ionic-vertical-bars) or [HTML setup](/projects/capacitor-native-ui/docs/framework-independent). See [Dynamic Color](/projects/capacitor-native-ui/docs/dynamic-colors) for appearance preferences and color mapping, [configuration](/projects/capacitor-native-ui/docs/configuration) for Native UI options, and [migration](/projects/capacitor-native-ui/docs/migration) for an existing integration.
