# Shape the appearance

Add working light, dark, and system appearance controls to the app you have set up. Android keeps using the device palette when available; the same preference controls the remaining Web UI and iOS native controls.

For a theme-only app, start with the [iOS 26](/projects/ionic-theme-ios26/docs/setup), [iOS 27](/projects/ionic-theme-ios27/docs/setup), or [MD3](/projects/ionic-theme-md3/docs/setup) installation guide. Native UI is not required. The steps below add appearance settings to the combined Ionic + Capacitor setup.

## 1. Place the appearance controls

Start with the app from [app setup](/standard-setup). The goal is a settings page with Light, Dark and System buttons. Add the shared setter in step 2, then use only your framework example in step 3. No new controller or plugin is installed.

## 2. Keep the existing appearance controller

In src/native-ui.ts from app setup, add the type import and variable at module level. Change the existing call inside connectNativeUI to assign that variable, then append setAppearanceMode to the same module. There is still one controller. The setter waits for the existing startup, so a settings page opened later can safely use it.

```ts:src/native-ui.ts
import type { ColorMode, DynamicColorTheme } from '@rdlabo/ionic-theme-md3/dynamic-colors';

let appearance: DynamicColorTheme;
```

```diff
- await enableDynamicColors({
+ appearance = await enableDynamicColors({
```

```ts:src/native-ui.ts
export async function setAppearanceMode(mode: ColorMode): Promise<void> {
  await startNativeUI();
  appearance.setMode(mode);
}
```

## 3. Connect the buttons

Choose one example. Add its imports and event bindings to the existing settings page; the filenames below show the import paths. Keep the page route and its other content. Framework-managed click bindings require no DOM query, render callback, or manual listener. Leaving and reopening the page reuses the same startup and appearance controller.

### Angular / Ionic 9

```ts:src/app/appearance.page.ts
import { Component } from '@angular/core';
import type { ColorMode } from '@rdlabo/ionic-theme-md3/dynamic-colors';
import { setAppearanceMode } from '../native-ui';

@Component({
  selector: 'app-appearance',
  template: `
    <section aria-label="Appearance">
      <button type="button" (click)="setMode('light')">Light</button>
      <button type="button" (click)="setMode('dark')">Dark</button>
      <button type="button" (click)="setMode('system')">System</button>
    </section>
  `,
})
export class AppearancePage {
  setMode(mode: ColorMode): void {
    void setAppearanceMode(mode).catch(console.error);
  }
}
```

### React

```tsx:src/Appearance.tsx
import type { ColorMode } from '@rdlabo/ionic-theme-md3/dynamic-colors';
import { setAppearanceMode } from './native-ui';

function setMode(mode: ColorMode): void {
  void setAppearanceMode(mode).catch(console.error);
}

export default function Appearance() {
  return (
    <section aria-label="Appearance">
      <button type="button" onClick={() => setMode('light')}>Light</button>
      <button type="button" onClick={() => setMode('dark')}>Dark</button>
      <button type="button" onClick={() => setMode('system')}>System</button>
    </section>
  );
}
```

### Vue

```vue:src/Appearance.vue
<script setup lang="ts">
import type { ColorMode } from '@rdlabo/ionic-theme-md3/dynamic-colors';
import { setAppearanceMode } from './native-ui';

function setMode(mode: ColorMode): void {
  void setAppearanceMode(mode).catch(console.error);
}
</script>

<template>
  <section aria-label="Appearance">
    <button type="button" @click="setMode('light')">Light</button>
    <button type="button" @click="setMode('dark')">Dark</button>
    <button type="button" @click="setMode('system')">System</button>
  </section>
</template>
```

## 4. Check each mode and the fallback

Click Dark and Light: both the Web background and supported iOS controls must change together. Select System, change the device appearance, and confirm the app follows. On Android 12+, change the wallpaper palette and reopen the app: MD3 should use the new colors. In a browser or on an unsupported Android device, the fallback palette remains usable. If Web and native surfaces disagree, remove an old dark-palette import or a second appearance owner before adding more options.

For brand-color mapping, see the [Dynamic Color reference](/projects/capacitor-native-ui/docs/dynamic-colors). For theme-only installation, use the [iOS 26](/projects/ionic-theme-ios26/docs/setup), [iOS 27](/projects/ionic-theme-ios27/docs/setup), or [MD3](/projects/ionic-theme-md3/docs/setup) instructions.
