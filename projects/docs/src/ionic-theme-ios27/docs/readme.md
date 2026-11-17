---
title: Ionic Theme iOS27
---

Install with `npm install @rdlabo/ionic-theme-ios27`. For 1.x, use the [v1.2.1 guide](https://github.com/webview-native-ui/ionic-theme-ios27/tree/ios27-v1.2.1).
A theme for Ionic apps that brings iOS 27 Liquid Glass and motion to the Web. Capacitor iOS apps can also opt into Native UI for supported controls, officially supported starting with 2.0.0.

**[Ionic 9 demo](https://ionic-theme-ios27.rdlabo.dev/) · [Setup guide](https://docs.rdlabo.dev/projects/ionic-theme-ios27/docs/setup)**

<!-- rdlabo-docs-pick -->

<p>
  <img src="https://raw.githubusercontent.com/webview-native-ui/ionic-theme-ios27/c70beb9d1e5b39de696b2b2c47a3d9bc5ffcdfbe/screenshots/ios27-settings.png" width="32%" alt="iOS 27 theme: Settings in light mode with a Liquid Glass search bar" />
  <img src="https://raw.githubusercontent.com/webview-native-ui/ionic-theme-ios27/c70beb9d1e5b39de696b2b2c47a3d9bc5ffcdfbe/screenshots/ios27-settings-dark.png" width="32%" alt="iOS 27 theme: Settings in dark mode" />
  <img src="https://raw.githubusercontent.com/webview-native-ui/ionic-theme-ios27/c70beb9d1e5b39de696b2b2c47a3d9bc5ffcdfbe/screenshots/ios27-library.png" width="32%" alt="iOS 27 theme: Library with Liquid Glass buttons and tab bar" />
</p>

<!-- /rdlabo-docs-pick -->

## What would you like to do?

| Goal                                                    | Guide                                                                                                       |
| ------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| Style an existing Ionic app                             | [Get started](https://docs.rdlabo.dev/projects/ionic-theme-ios27/docs/setup)                                |
| Select iOS 26/27 styles and optionally use MD3          | [Adaptive themes](https://docs.rdlabo.dev/projects/ionic-theme-ios27/docs/adaptive-themes)                  |
| Add native iOS controls to a Capacitor app              | [Add Native UI](https://docs.rdlabo.dev/projects/ionic-theme-ios27/docs/add-native-ui)                      |
| Add a side rail to Ionic while keeping your own theme   | [Vertical Bars step by step](https://docs.rdlabo.dev/projects/capacitor-native-ui/docs/ionic-vertical-bars) |
| Optional: use the theme and Native UI with Cordova      | [Cordova setup](docs/cordova.md)                                                                            |
| Configure styles, dark mode and animations individually | [Configuration](docs/configuration.md)                                                                      |
| Upgrade an existing installation                        | [Migration](https://docs.rdlabo.dev/projects/ionic-theme-ios27/docs/migration)                              |

## Get started

Start with the standalone theme in an existing Ionic 9 app. Browser-only theme use needs no native Capacitor project or Native UI startup. For a Cordova application, use the optional [Cordova guide](docs/cordova.md), which covers its bundled theme and host-specific startup.

Only if you want device-driven layout, add [Capacitor Foldable](https://github.com/erkamyaman/capacitor-foldable), the community plugin by Erkam Yaman, using the [device layout guide](https://webview-native-ui.com/projects/ionic-theme-ios27/docs/vertical-bars-layout). It reports placement, posture and change events; the theme provides Web layout helpers, while Native UI projects controls when separately enabled. Installing Foldable and connecting its events are optional additions, not prerequisites for the theme.

Install the theme, add one global theme stylesheet after Ionic's base CSS, and pass the theme configuration to your existing Ionic initializer. See the [setup guide](https://docs.rdlabo.dev/projects/ionic-theme-ios27/docs/setup) for Angular, React and Vue.

```sh
npm install @rdlabo/ionic-theme-ios27
```

```diff:src/global.css
@@
 @import '@ionic/core/css/core.css';
 @import '@ionic/core/css/structure.css';
- @import '@ionic/core/css/palettes/dark.system.css';
+ @import '@rdlabo/ionic-theme-ios27/styles/system.css';

 :root { --app-content-width: 72rem; }
```

```diff:src/app/app.config.ts
@@
 import { ApplicationConfig } from '@angular/core';
 import { provideIonicAngular } from '@ionic/angular';
+ import { ios27ThemeConfig } from '@rdlabo/ionic-theme-ios27';
 import { provideRouter } from '@angular/router';
 import { routes } from './app.routes';

 export const appConfig: ApplicationConfig = {
   providers: [
     provideRouter(routes),
-     provideIonicAngular(),
+     provideIonicAngular({ ...ios27ThemeConfig }),
     provideHttpClient(),
   ],
 };
```

Choose `styles/class.css` for application-controlled dark mode or `styles/always.css` for always-dark mode. The stylesheet includes the matching Ionic dark palette. The theme configuration defaults to iOS mode and its animations, with application options taking precedence. Ionic compatibility is `>=9 <10`. Browser-only apps do not need a native Capacitor project.

The theme styles toolbars, tabs, lists, buttons, search, and overlays, with light and dark appearances. It does not activate native controls. Once the Web theme is working, you can optionally [add Native UI](https://docs.rdlabo.dev/projects/ionic-theme-ios27/docs/add-native-ui).

## Customize your app

Use [configuration](docs/configuration.md) for individual CSS and animation settings. Existing applications can optionally simplify their setup using the [migration guide](docs/migration.md#optional-simplify-the-setup).

- [Features](https://docs.rdlabo.dev/projects/ionic-theme-ios27/docs/features): CSS variables, Liquid Glass, and selective component imports.
- [Special markup and classes](https://docs.rdlabo.dev/projects/ionic-theme-ios27/docs/special-markup): opt-in component behavior.
- [Using ion-item-group](https://docs.rdlabo.dev/projects/ionic-theme-ios27/docs/using-ion-item-group): inset list markup.
- [Animation](https://docs.rdlabo.dev/projects/ionic-theme-ios27/docs/animation): tab, segment, and search effects.
- [ESLint](https://docs.rdlabo.dev/projects/ionic-theme-ios27/docs/eslint): catch unsupported list structure.
- [Vertical Bars layout](https://docs.rdlabo.dev/projects/ionic-theme-ios27/docs/vertical-bars-layout): spacing, RTL, device placement, posture, and split panes.

## Repository boundaries

The Capacitor plugin is maintained in [webview-native-ui/capacitor-plugin](https://github.com/webview-native-ui/capacitor-plugin). This repository owns the Ionic theme, the combined demo, browser screenshots, and simulator integration tests. The demo installs `@rdlabo/capacitor-native-ui` from npm; theme releases do not publish or change the plugin version.

The [Cordova plugin](https://github.com/webview-native-ui/cordova-plugin) is maintained separately. It distributes a pinned copy of this theme with its integration imports connected to Cordova. Shared theme fixes belong here; Cordova updates its pinned theme version in a subsequent plugin release. The Capacitor demo and candidate checks below do not validate Cordova.

To verify an unpublished plugin archive against the real demo, run:

```sh
npm run test:native-candidate -- /absolute/path/rdlabo-capacitor-native-ui-VERSION.tgz --e2e
```

This creates an isolated temporary checkout and leaves your manifests and lockfiles unchanged. Add `--shard=1/2` alongside `--e2e` to run one Playwright shard; run every shard to cover the full suite. Each shard retains package checks, unit tests, and the production build. Add `--simulator=UDID` for native UI, search, and edge simulator suites. Diagnostics and the temporary demo are retained at the printed path. Plugin-only unit and native library tests live in the plugin repository. Its CI tests each candidate archive against this repository’s main branch.

## Maintenance

Release the root theme package with `npm run release` from a clean, up-to-date `main`. The `ios27-v…` tag workflow publishes only the theme, using `next` for prereleases and `latest` for stable releases.

Theme and plugin versions are independent. For the standalone `@rdlabo/ionic-theme-ios27` package, Capacitor Native UI is a required peer dependency so the theme and application share one plugin instance. npm 7+ installs it automatically for theme-only apps; other package managers must install required peers. Apps using native controls must also declare the plugin directly for Capacitor discovery. A published npm version cannot be overwritten.
