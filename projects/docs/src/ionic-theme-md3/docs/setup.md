---
title: Set up the MD3 theme
---

Apply the Material Design 3 theme to an existing Ionic 9 Angular, React or Vue app. This page installs the theme only. Native UI startup, a native Capacitor project and Foldable configuration are not required. Keep the app’s existing routes and event handlers.


The diffs use an existing app with an argument-free Ionic initializer. Keep all unshown router, provider and rendering code. If you already pass application options, add the preset before those options so your overrides remain. The example src/global.css means your existing global stylesheet (such as Angular’s src/global.scss); edit that file rather than creating another stylesheet.


The stylesheet diff starts from dark.system.css and retains OS-following appearance. If your app already uses class-based or always-dark appearance, keep that policy and choose the matching preset instead of applying a System change.

## Install the theme

After npm succeeds, dependencies are installed; stylesheet and initializer changes are still pending.

Install the package from the application directory:

```sh
npm install @rdlabo/ionic-theme-md3
```

## Load the theme stylesheet

After this diff, the theme stylesheet is loaded; Ionic configuration is still pending.

In the global stylesheet, keep Ionic’s base CSS and the app’s chosen Ionic dark palette, then load the MD3 stylesheet. The example uses system dark mode. If a different palette is already configured, keep it instead of adding a second palette. Replace individual MD3 stylesheet imports with this one theme import.

```diff:src/global.css
@@
 @import '@ionic/core/css/structure.css';
 @import '@ionic/core/css/palettes/dark.system.css';
+ @import '@rdlabo/ionic-theme-md3/styles/theme.css';

 :root { --app-content-width: 72rem; }
```

## Configure Ionic

Apply only your framework’s diff. Afterward the stylesheet and initializer are configured; the browser check remains.

Choose one framework example. The preset supplies the theme’s mode and animations, including browser previews. Preserve existing application options by adding them after the preset spread. If the app deliberately selects different modes by platform, retain that selection and apply this preset only to the matching mode.

### Angular

In src/app/app.config.ts, pass the preset to the existing Ionic provider. The example shows the Ionic provider; retain the other providers already in the array, including the router and HTTP configuration.

```diff:src/app/app.config.ts
@@
 import { ApplicationConfig } from '@angular/core';
 import { provideIonicAngular } from '@ionic/angular';
+ import { md3ThemeConfig } from '@rdlabo/ionic-theme-md3';
 import { provideRouter } from '@angular/router';
 import { routes } from './app.routes';

 export const appConfig: ApplicationConfig = {
   providers: [
     provideRouter(routes),
-     provideIonicAngular(),
+     provideIonicAngular({ ...md3ThemeConfig }),
     provideHttpClient(),
   ],
 };
```

### React

In src/main.tsx, replace the existing setupIonicReact call with this call before the existing React root is rendered. Keep the root rendering, routing and CSS imports.

```diff:src/main.tsx
@@
 import { setupIonicReact } from '@ionic/react';
+ import { md3ThemeConfig } from '@rdlabo/ionic-theme-md3';
 import { createRoot } from 'react-dom/client';
 import App from './App';
 import './global.css';

- setupIonicReact();
+ setupIonicReact({ ...md3ThemeConfig });

 createRoot(document.getElementById('root')!).render(<App />);
```

### Vue

In src/main.ts, pass the preset when registering IonicVue on the existing app, before mounting. The example shows where registration belongs; retain the app’s router, other plugins and existing mount sequence.

```diff:src/main.ts
@@
 import { createApp } from 'vue';
 import { IonicVue } from '@ionic/vue';
+ import { md3ThemeConfig } from '@rdlabo/ionic-theme-md3';
 import App from './App.vue';
 import router from './router';
@@

 const app = createApp(App);
- app.use(IonicVue);
+ app.use(IonicVue, { ...md3ThemeConfig });
 app.use(router);
 router.isReady().then(() => app.mount('#app'));
```

## Preview a screen

Start the application’s usual development server and open an existing page with Ionic buttons or list items. Check the Material Design 3 appearance, change the system between light and dark, and navigate between existing pages. If using manual or always-dark mode, check that chosen policy instead. Installation is complete when the page is styled, its existing controls and navigation still work, and the chosen appearance policy is respected. No native build or rail-capable device is needed for this check.

For individual styles and application overrides, use [configuration](configuration.md). To update an existing integration, use [migration](migration.md).
