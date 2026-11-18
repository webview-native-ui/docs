---
title: "Cordova のセットアップ"
sourceRevision: "07b45f9b135f41690d411c8e630f95c0d7be1090936d7401b69a22fa33298403"
---

[Cordova プラグインの導入](/cordova-native-ui/docs/readme)を済ませたら、Web プロジェクトにテーマをインストールします。

```sh
npm install @rdlabo/ionic-theme-ios27
```

## iOS テーマを使う場合

Ionic の基本 CSS を維持し、現在のダークモード設定に合うプリセットを使います。OS の明暗に追従する場合は次のように指定します。

```css
@import '@rdlabo/ionic-theme-ios27/styles/system.css';
```

ページ遷移とポップオーバーにテーマのアニメーションを使うには、既存のIonic初期化に `ios27ThemeConfig` を渡します。[Angular・React・Vueの設定例](setup.md)を参照してください。

JavaScript ヘルパーはテーマからインポートします。ヘルパーを使う場合は、Web バンドラーで次のモジュールを完全一致で置き換え、テーマと Cordova が同じ Native UI の状態を参照するようにします。

`@rdlabo/capacitor-native-ui/integration` → `@webview-native-ui/cordova-plugin/integration`

```ts
// vite.config.ts
import { defineConfig } from 'vite';

export default defineConfig({
  resolve: {
    alias: [{
      find: /^@rdlabo\/capacitor-native-ui\/integration$/,
      replacement: '@webview-native-ui/cordova-plugin/integration',
    }],
  },
});
```

## Cordova とアプリの準備後に Native UI を起動する

Cordova のエントリー HTML に `<script src="cordova.js"></script>` を残します。起動中にデバイス準備完了のリスナーを登録し、フレームワークが `ion-app` をマウントしてから Native UI を有効にします。

```ts
import { enableNativeUI } from '@webview-native-ui/cordova-plugin';

const deviceReady = new Promise<void>((resolve) => {
  document.addEventListener('deviceready', () => resolve(), { once: true });
});

export async function startNativeUI(appMounted: Promise<void>) {
  await Promise.all([deviceReady, appMounted]);
  return enableNativeUI();
}
```

アプリのマウントライフサイクルから `appMounted` を渡し、`startNativeUI()` を1回呼んで返されたハンドルを保持します。アプリが Native UI の使用を恒久的に終了するときに `await handle.destroy()` を呼びます。ページごとに新しいランタイムを作ったり、この npm ベースの起動と並行して `window.NativeUI.enableNativeUI()` も呼んだりしないでください。ブラウザーのプレビューは Cordova の `deviceready` を発火しません。この起動経路は Cordova ビルド専用にし、Web テーマは通常のブラウザー用エントリーからプレビューしてください。

Web アセットを Cordova アプリの `www` ディレクトリへビルドし、ネイティブアプリの準備と再ビルドを行います。例:

```sh
cordova prepare ios
cordova build ios
```

Android の要件を満たしてビルドする場合は `android` を使います。Cordova に `npx cap sync` は使わないでください。iOS のアダプターはスクロールビューの自動 inset を無効にします。[プラグインガイド](https://github.com/webview-native-ui/cordova-plugin#start-native-ui)に従って、ページの CSS でセーフエリアの余白を適用してください。

## 既存のテーマアプリをこの連携へ移行する

0.1.5 以前の同梱テーマを使っていたアプリは、0.1.6 への更新時に次の import を置き換えます。0.1.5 と同じ外観を維持するにはテーマを 2.2.0 に固定します。

- `@webview-native-ui/cordova-plugin/theme` → `@rdlabo/ionic-theme-ios27`
- `@webview-native-ui/cordova-plugin/theme/css/*` → `@rdlabo/ionic-theme-ios27/dist/css/*`
