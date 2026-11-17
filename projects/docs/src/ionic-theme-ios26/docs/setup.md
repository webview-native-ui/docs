---
title: Set up the iOS 26 theme
---

Apply the iOS 26 theme to an existing Ionic 9 Angular, React or Vue app. This page installs the theme only. Native UI startup, a native Capacitor project and Foldable configuration are not required. Keep the app’s existing routes and event handlers.

## 1. Install

Install the package from the application directory:

```sh
npm install @rdlabo/ionic-theme-ios26
```

## 2. Load one stylesheet

In the global stylesheet, replace the existing theme and corresponding Ionic dark-palette imports with this import after Ionic’s base CSS. The preset includes system dark mode and the theme’s compatibility styles. No Sass configuration is needed.

```css
@import '@rdlabo/ionic-theme-ios26/styles/system.css';
```

For manual dark mode, choose styles/class.css instead and keep your existing ion-palette-dark class control. For an always-dark application, choose styles/always.css. Load only one of these presets.

## 3. Configure Ionic

Choose one framework example. The preset supplies the theme’s mode and animations, including browser previews. Preserve existing application options by adding them after the preset spread. If the app deliberately selects different modes by platform, retain that selection and apply this preset only to the matching mode.

### Angular

In src/app/app.config.ts, pass the preset to the existing Ionic provider. The example shows the Ionic provider; retain the other providers already in the array, including the router and HTTP configuration.

```ts:src/app/app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideIonicAngular } from '@ionic/angular';
import { ios26ThemeConfig } from '@rdlabo/ionic-theme-ios26';

export const appConfig: ApplicationConfig = {
  providers: [provideIonicAngular({ ...ios26ThemeConfig })],
};
```

### React

In src/main.tsx, replace the existing setupIonicReact call with this call before the existing React root is rendered. Keep the root rendering, routing and CSS imports.

```ts:src/main.tsx
import { setupIonicReact } from '@ionic/react';
import { ios26ThemeConfig } from '@rdlabo/ionic-theme-ios26';

setupIonicReact({ ...ios26ThemeConfig });
```

### Vue

In src/main.ts, pass the preset when registering IonicVue on the existing app, before mounting. The example shows where registration belongs; retain the app’s router, other plugins and existing mount sequence.

```ts:src/main.ts
import { createApp } from 'vue';
import { IonicVue } from '@ionic/vue';
import { ios26ThemeConfig } from '@rdlabo/ionic-theme-ios26';
import App from './App.vue';

const app = createApp(App);
app.use(IonicVue, { ...ios26ThemeConfig });
app.mount('#app');
```

## 4. Preview

Start the application’s usual development server and open an existing page with Ionic buttons or list items. Check the iOS appearance, change the system between light and dark, and navigate between existing pages. If using manual or always-dark mode, check that chosen policy instead. Installation is complete when the page is styled, its existing controls and navigation still work, and the chosen appearance policy is respected. No native build or rail-capable device is needed for this check.

For individual styles and application overrides, use [configuration](configuration.md). To update an existing integration, use [migration](migration.md).
