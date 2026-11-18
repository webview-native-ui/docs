---
title: Getting Started with Cordova
---

# Getting Started with Cordova

Use the published `@webview-native-ui/cordova-plugin` v0.1.6 to add Native UI to a Cordova application. The adapter shares Native UI Core with the Capacitor plugin; it does not require the Capacitor JavaScript runtime. Standard HTML is supported through `/core`, while the package root adds Ionic integration.

## Requirements and support

- Cordova CLI 13, with cordova-ios 8.1+ using Swift Package Manager, or cordova-android 15+.
- Native iOS controls require iOS 26+ and Xcode 26+. Older iOS versions keep Web presentation. CocoaPods and older Cordova versions are unsupported.
- Ionic integration requires `@ionic/core >=8.8.1 <10`. Standard HTML through `/core` does not require Ionic.
- Android requires API 24+, SDK 36, JDK 21, Kotlin 2.2.20, and Compose. Standard controls keep Web presentation; app-local Compose extensions are supported separately. Do not assume iOS toolbar or search parity.

## Install the same version in both projects

Run this command in the Cordova project:

```sh
cordova plugin add @webview-native-ui/cordova-plugin@0.1.6
```

For a bundled Web application, also run this command in the npm project that builds the Web assets:

```sh
npm install --save-exact @webview-native-ui/cordova-plugin@0.1.6
```

The Cordova command installs the native plugin. The npm dependency supplies imports to the Web bundler. Keep their versions aligned. Keep `<script src="cordova.js"></script>` in the Cordova entry HTML, build the Web assets into `www`, then run `cordova prepare` and rebuild the native application. Reloading Web assets does not update native code. Direct Git URL installation is unsupported.

Add these preferences to `config.xml` for Android:

```xml
<preference name="GradlePluginKotlinEnabled" value="true" />
<preference name="GradlePluginKotlinVersion" value="2.2.20" />
<preference name="AndroidGradlePluginVersion" value="8.13.0" />
<preference name="AndroidJavaSourceCompatibility" value="21" />
<preference name="AndroidJavaTargetCompatibility" value="21" />
<preference name="AndroidKotlinJVMTarget" value="21" />
```

## Start after Cordova is ready

For the bundled browser API, retain the handle and start after `deviceready`:

```js
let nativeUI;

document.addEventListener('deviceready', async () => {
  nativeUI = await window.NativeUI.enableNativeUI();
}, { once: true });
```

Call `await nativeUI.destroy()` when the application permanently stops using Native UI. Inspect `nativeUI.getStatus()` when diagnosing Web fallback. On iOS, provide safe-area spacing in your CSS, such as `env(safe-area-inset-top)`; automatic scroll-view insets are disabled.

For an ESM application, import `enableNativeUI` from `@webview-native-ui/cordova-plugin/core` for standard HTML, or from `@webview-native-ui/cordova-plugin` for Ionic. Use one runtime entry style. Do not mix npm startup with `window.NativeUI` startup.

## Optional iOS theme

Install the iOS theme separately if your app uses it. See [Cordova theme setup](/ionic-theme-ios27/docs/cordova).

**iPhone Duo:** Cordova has no equivalent to `@erkamyaman/capacitor-foldable`; this setup does not support iPhone Duo.

## Toolbar button badges

Place `ion-badge` directly inside an `ion-button` in an `ion-toolbar`.

```html
<ion-toolbar>
  <ion-buttons slot="end">
    <ion-button aria-label="3 notifications">
      <ion-icon name="ellipsis-horizontal" slot="icon-only"></ion-icon>
      <ion-badge color="primary">3</ion-badge>
    </ion-button>
  </ion-buttons>
</ion-toolbar>
```

On supported iOS native Vertical Bars, the badge follows the source text and Ionic background and text colors. The Web rail fallback also preserves its display state. Count and color changes, hiding and removal update the existing action. For an unread indicator, use a completely empty `<ion-badge></ion-badge>` without spaces or line breaks inside it. Include notification state in the accessible label. Update both plugin installations, run `cordova prepare` and rebuild the native app.

## Next steps

- [Engine concepts and limits](/webview-native-ui-engine/docs/concepts) explain the shared presentation model.
- The [package README](https://github.com/webview-native-ui/cordova-plugin/blob/v0.1.6/README.md) covers local archives, troubleshooting, shared source, and development checks.
- Report Cordova installation, callbacks, and lifecycle issues in the [Cordova repository](https://github.com/webview-native-ui/cordova-plugin/issues).
