---
title: 'Add an appearance switch'
headingAliases:
  '1.-place-the-appearance-controls': '1.-check-the-two-settings-to-add'
  '3.-connect-the-buttons': '3.-connect-both-settings'
---

# Add an appearance switch

App setup preserves OS-following appearance. This optional task replaces that policy with two independent app settings: Use device colors and Dark mode. Each setting uses an ion-item containing an ion-toggle to show its current value. The initial Dark mode value is sampled once from the OS; later OS changes do not change the setting.

For a theme-only app, start with the [iOS 26](/projects/ionic-theme-ios26/docs/setup), [iOS 27](/projects/ionic-theme-ios27/docs/setup), or [MD3](/projects/ionic-theme-md3/docs/setup) installation guide. Native UI is not required. The steps below add appearance settings to the combined Ionic + Capacitor setup.

## 1. Check the two settings to add

Start with [completed app setup](/standard-setup), with its temporary verification hook removed. In this step, identify the two settings; no file changes are needed yet. Use device colors selects the available Android 12+ palette instead of theme defaults. Dark mode selects dark when checked and light when unchecked, independently of the palette source. There is no OS-following choice in this UI.

| Setting           | On                          | Off                |
| ----------------- | --------------------------- | ------------------ |
| Use device colors | Use available device colors | Use theme defaults |
| Dark mode         | Dark                        | Light              |

## 2. Keep the existing appearance controller

Apply four diffs in order: change the existing stylesheet from System to Class presets, then add preference state, the provider and the getter/setter to the existing startup module. This deliberately changes appearance ownership from OS-following CSS to the app’s Dark mode toggle; it is independent of choosing device colors. The controller still starts once. It takes the current OS appearance only as the initial dark boolean, starts in the matching explicit dark/light mode, and thereafter follows that boolean. Partial updates preserve the other setting. At the end, the API is ready; the two toggles are added in step 3.

On iOS, status-bar text and icons need an explicit update independently of the Web theme and Native UI controls. Call SystemBars at startup and after preference changes so they remain readable when the app appearance differs from the OS. This iOS-only synchronization preserves existing Android system-bar and inset handling.

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

## 3. Connect both settings

Use an existing routed settings page and apply only your framework’s diff. Keep its actual filename, route and other content. Both toggles read the shared preferences and display the selected values, without creating another controller. Leaving and reopening this route retains the settings during this running session. No values are persisted: restarting the app or fully reloading the browser samples the current OS again for the initial Dark mode value. Use device colors expresses a preference, not proof that a device palette is available; its nearby explanation covers unsupported devices.

### Angular / Ionic 9

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

## 4. Check each mode and the fallback

Before checking the edited controls, run the app’s existing Web development server and fully reload the browser page. For native verification, run npm run build in the app directory, sync only the selected target with npx cap sync ios or npx cap sync android, rebuild that native target, then stop and relaunch its app/WebView. A source edit alone does not update an installed native app. Restarting the app or fully reloading the browser resets these in-memory preferences; select the test values after that restart. Reopening only the routed settings page retains them.

Check all four combinations: device colors off/dark off, off/on, on/off and on/on. The selected Dark mode toggle must produce light or dark Web UI and supported iOS controls respectively. Changing the OS light/dark appearance while the app keeps running must not change this toggle or override its appearance. Changing either toggle must not reset the other.

On supported Android 12+, enable device colors, change the wallpaper palette and return to the same running app to check the new colors. Disabling device colors must restore theme defaults while preserving Dark mode. On iOS, in browsers and unsupported Android, either source setting keeps usable theme colors. Reopen the settings route and confirm that both toggle values remain visible. The task is complete when all four combinations, source fallback and route reopening work.

On iOS, leave the OS light and set the app dark; verify that the time, battery and other status-bar content remain readable. Also check OS dark with app light. This example does not persist preferences. If connecting it to existing persistence, apply the same SystemBars update immediately after restoration and verify both directions after restarting.

If the app prints or exports documents or PDFs, check that output keeps the intended colors after changing display settings. If screen theme variables propagate into the output, give that output its own print palette. Compare the actual settings and main app screens before and after the change, not only a temporary verification screen.

For brand-color mapping, see the [Dynamic Color reference](/projects/capacitor-native-ui/docs/dynamic-colors). For theme-only installation, use the [iOS 26](/projects/ionic-theme-ios26/docs/setup), [iOS 27](/projects/ionic-theme-ios27/docs/setup), or [MD3](/projects/ionic-theme-md3/docs/setup) instructions.
