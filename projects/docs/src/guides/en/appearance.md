---
title: 'Add an appearance switch'
headingAliases:
  '4.-check-each-mode-and-the-fallback': '3.-switch-the-toggles-and-check-the-result'
  '3.-connect-both-settings': '2.-add-two-toggles-to-the-settings-page'
  '2.-keep-the-existing-appearance-controller': '1.-let-the-app-choose-light-or-dark-appearance'
  '1.-check-the-two-settings-to-add': 'settings-to-add'
  '1.-place-the-appearance-controls': 'settings-to-add'
  '3.-connect-the-buttons': '2.-add-two-toggles-to-the-settings-page'
---

# Add an appearance switch

Add two toggles, Use device colors and Dark mode, and apply the chosen appearance throughout the app.

Start with an app that has completed [Ionic app setup](/standard-setup). First prepare the shared appearance behavior, then call it from the settings-page toggles.

## Settings to add

The toggles choose the palette source and light/dark appearance independently. For example, device colors can be used in light mode, or the default theme colors in dark mode.

| Setting           | On                                         | Off                |
| ----------------- | ------------------------------------------ | ------------------ |
| Use device colors | Use available device colors on Android 12+ | Use theme defaults |
| Dark mode         | Dark                                       | Light              |

## 1. Let the app choose light or dark appearance

Change src/global.css and the src/native-ui.ts created during setup, in that order. This lets the settings page change the appearance of the whole app.

### Change the stylesheet that controls light and dark appearance

The installed system.css follows OS appearance. Replace it with class.css so the app can choose light or dark. class.css responds to the ion-palette-dark class, which setMode adds or removes for you.

Apply the diff to your global stylesheet. If Angular uses src/global.scss, change that file.

<!-- prettier-ignore -->
```diff:src/global.css
@@
- @import '@rdlabo/ionic-theme-ios26/styles/system.css' supports(not (overflow-anchor: auto));
- @import '@rdlabo/ionic-theme-ios27/styles/system.css' supports(overflow-anchor: auto);
+ @import '@rdlabo/ionic-theme-ios26/styles/class.css' supports(not (overflow-anchor: auto));
+ @import '@rdlabo/ionic-theme-ios27/styles/class.css' supports(overflow-anchor: auto);
 @import '@rdlabo/ionic-theme-ios27/dist/css/vertical-bars.css' supports(not (overflow-anchor: auto));
 @import '@rdlabo/ionic-theme-md3/styles/theme.css';
```

### Keep the current settings in variables

In src/native-ui.ts, keep the two settings in preferences. deviceColors controls device colors; dark controls dark mode. The initial dark value comes from the OS when the app starts.

appearance holds the object returned by enableDynamicColors. The next change stores that result so its setMode and refresh methods can be used later.

<!-- prettier-ignore -->
```diff:src/native-ui.ts
@@
- import { Capacitor } from '@capacitor/core';
+ import { Capacitor, SystemBars, SystemBarsStyle } from '@capacitor/core';
@@
 import { enableDynamicColors } from '@rdlabo/ionic-theme-md3/dynamic-colors';
+ import type { DynamicColorTheme } from '@rdlabo/ionic-theme-md3/dynamic-colors';
@@
 let startup: Promise<void> | undefined;
+ 
+ export type AppearancePreferences = {
+   deviceColors: boolean;
+   dark: boolean;
+ };
+ 
+ let appearance: DynamicColorTheme;
+ let preferences: AppearancePreferences = {
+   deviceColors: true,
+   dark: globalThis.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false,
+ };
```

### Apply the settings when the app starts

Pass the initial light/dark choice to enableDynamicColors and store its result in appearance. After startup, appearance.setMode switches the app between light and dark and appearance.refresh selects the palette again.

When device colors are off, withhold the device palette so the theme uses its defaults. On iOS, also call syncIOSSystemBars at startup; it is defined below.

<!-- prettier-ignore -->
```diff:src/native-ui.ts
@@
-   await enableDynamicColors({
-     getScheme: getDynamicColorScheme,
+   appearance = await enableDynamicColors({
+     mode: preferences.dark ? 'dark' : 'light',
+     getScheme: async () => {
+       const scheme = await getDynamicColorScheme();
+       return preferences.deviceColors
+         ? scheme
+         : { available: false as const, systemDark: scheme.systemDark };
+     },
     listen: addDynamicColorListener,
   });
@@
   if (Capacitor.getPlatform() === 'ios') {
+     await syncIOSSystemBars();
```

### Add functions for the settings page to call

Add these functions at the end of the same file.

- getAppearancePreferences returns the current settings so the settings page can display the initial toggle values.
- setAppearancePreferences accepts a changed setting and applies it to the theme. Changing one toggle preserves the other value.
- syncIOSSystemBars matches iOS status-bar text and icons to the app appearance, keeping the clock and battery readable on a dark screen.

<!-- prettier-ignore -->
```diff:src/native-ui.ts
@@
       .catch(console.error);
   }
 }
+ 
+ export function getAppearancePreferences(): AppearancePreferences {
+   return { ...preferences };
+ }
+ 
+ export async function setAppearancePreferences(patch: Partial<AppearancePreferences>): Promise<void> {
+   const paletteChanged = patch.deviceColors !== undefined && patch.deviceColors !== preferences.deviceColors;
+   preferences = { ...preferences, ...patch };
+   await startNativeUI();
+   appearance.setMode(preferences.dark ? 'dark' : 'light');
+   if (paletteChanged) await appearance.refresh();
+   await syncIOSSystemBars();
+ }
+ 
+ async function syncIOSSystemBars(): Promise<void> {
+   if (Capacitor.getPlatform() !== 'ios') return;
+   await SystemBars.setStyle({
+     style: preferences.dark ? SystemBarsStyle.Dark : SystemBarsStyle.Light,
+   });
+ }
```

The settings page can now read the current values and change the app appearance. Connect these two operations to its toggles next.

## 2. Add two toggles to the settings page

Add two ion-item elements to the existing settings page, each containing one ion-toggle. Read initial values with getAppearancePreferences, then pass toggle changes to setAppearancePreferences.

Apply the example for your framework.

### Angular / Ionic 9

Initialize the Signal Forms model from the current preferences. When a toggle updates the model, effect calls setAppearancePreferences to apply the change to the app.

<!-- prettier-ignore -->
```diff:src/app/appearance.page.ts
@@
- import { Component } from '@angular/core';
+ import { Component, effect, signal } from '@angular/core';
+ import { form, FormField } from '@angular/forms/signals';
+ import { IonItem, IonToggle } from '@ionic/angular';
+ import { getAppearancePreferences, setAppearancePreferences } from '../native-ui';

 @Component({
   selector: 'app-appearance',
+   imports: [FormField, IonItem, IonToggle],
   template: `
     <section aria-label="Appearance">
       <h1>Appearance</h1>
+       <ion-item>
+         <ion-toggle [formField]="fields.deviceColors"
+           helperText="Uses device colors on supported Android 12+ devices; otherwise uses theme colors.">
+           Use device colors
+         </ion-toggle>
+       </ion-item>
+       <ion-item>
+         <ion-toggle [formField]="fields.dark">Dark mode</ion-toggle>
+       </ion-item>
     </section>
   `,
 })
- export class AppearancePage {}
+ export class AppearancePage {
+   readonly model = signal(getAppearancePreferences());
+   readonly fields = form(this.model);
+ 
+   constructor() {
+     effect(() => {
+       void setAppearancePreferences(this.model()).catch(console.error);
+     });
+   }
+ }
```

### React

Pass the current value to checked. onIonChange supplies the new value in event.detail.checked; pass it to setAppearancePreferences. Update the page state too, so its toggle displays the same value.

<!-- prettier-ignore -->
```diff:src/Appearance.tsx
@@
+ import { useState } from 'react';
+ import { IonItem, IonToggle } from '@ionic/react';
+ import {
+   getAppearancePreferences,
+   setAppearancePreferences,
+   type AppearancePreferences,
+ } from './native-ui';
+ 
 export default function Appearance() {
+   const [preferences, setPreferences] = useState(getAppearancePreferences);
+ 
+   function apply(patch: Partial<AppearancePreferences>): void {
+     setPreferences((current) => ({ ...current, ...patch }));
+     void setAppearancePreferences(patch).catch(console.error);
+   }
+ 
   return (
     <section aria-label="Appearance">
       <h1>Appearance</h1>
+       <IonItem>
+         <IonToggle
+           checked={preferences.deviceColors}
+           onIonChange={(event) => apply({ deviceColors: event.detail.checked })}
+           helperText="Uses device colors on supported Android 12+ devices; otherwise uses theme colors."
+         >Use device colors</IonToggle>
+       </IonItem>
+       <IonItem>
+         <IonToggle checked={preferences.dark}
+           onIonChange={(event) => apply({ dark: event.detail.checked })}>Dark mode</IonToggle>
+       </IonItem>
     </section>
   );
 }
```

### Vue

Pass the current value to checked. ionChange supplies the new value in event.detail.checked; pass it to setAppearancePreferences and update the page state held by reactive.

<!-- prettier-ignore -->
```diff:src/Appearance.vue
@@
 <script setup lang="ts">
+ import { reactive } from 'vue';
+ import { IonItem, IonToggle } from '@ionic/vue';
+ import {
+   getAppearancePreferences,
+   setAppearancePreferences,
+   type AppearancePreferences,
+ } from './native-ui';
+ 
+ const preferences = reactive(getAppearancePreferences());
+ 
+ function apply(patch: Partial<AppearancePreferences>): void {
+   Object.assign(preferences, patch);
+   void setAppearancePreferences(patch).catch(console.error);
+ }
+ 
+ function updateDeviceColors(event: CustomEvent<{ checked: boolean }>): void {
+   apply({ deviceColors: event.detail.checked });
+ }
+ 
+ function updateDark(event: CustomEvent<{ checked: boolean }>): void {
+   apply({ dark: event.detail.checked });
+ }
 </script>

 <template>
   <section aria-label="Appearance">
     <h1>Appearance</h1>
+     <ion-item>
+       <ion-toggle :checked="preferences.deviceColors" @ionChange="updateDeviceColors"
+         helper-text="Uses device colors on supported Android 12+ devices; otherwise uses theme colors.">
+         Use device colors
+       </ion-toggle>
+     </ion-item>
+     <ion-item>
+       <ion-toggle :checked="preferences.dark" @ionChange="updateDark">Dark mode</ion-toggle>
+     </ion-item>
   </section>
 </template>
```

The app shares these values, so reopening the settings page keeps them. This example does not persist them. Restarting the app or fully reloading the browser enables device colors and initializes dark mode from the current OS setting. While running, the app follows the toggle value even if the OS appearance changes.

## 3. Switch the toggles and check the result

In the browser, start the development server and reload the page. For native apps, run npm run build and npx cap sync ios or npx cap sync android for the target, then rebuild and launch it.

First turn Dark mode on and off. The background and text throughout the app should change between dark and light.

On supported Android 12+ devices, also switch Use device colors. On uses the device palette; off uses theme defaults. Change the wallpaper and return to the app to check that its colors update while enabled. iOS, browsers and unsupported Android use theme defaults for either value.

Try all four combinations: changing the palette source must preserve light/dark mode, and changing light/dark mode must preserve the palette source. Reopen the settings page and check that both choices are still displayed.

On iOS, check OS light with app dark and the opposite combination; the clock and battery must remain readable. If connecting existing persistence, update SystemBars when restoring preferences and check again after restarting.

For apps that print or export PDFs, check whether palette or light/dark mode changes affect output colors. Use a separate print palette where needed. Check the actual settings and main app screens.

See the [Dynamic Color reference](/projects/capacitor-native-ui/docs/dynamic-colors) for color mappings.
