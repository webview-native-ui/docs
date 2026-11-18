---
title: Cordova ではじめる
---

# Cordova ではじめる

`@webview-native-ui/cordova-plugin` v0.1.6 は、CordovaアプリのHTMLコントロールをネイティブ表示するプラグインです。標準HTMLでは `/core`、Ionicアプリではパッケージルートからインポートします。Capacitor版とNative UI Coreを共有し、Cordovaのランタイムで動作します。

## 要件と対応範囲

- Cordova CLI 13 と、Swift Package Manager を使う cordova-ios 8.1+、または cordova-android 15+。
- iOS のネイティブコントロールには iOS 26+ と Xcode 26+ が必要です。古い iOS は Web 表示を維持します。CocoaPods と古い Cordova は未対応です。
- Ionic 連携には `@ionic/core >=8.8.1 <10` が必要です。標準 HTML 用の `/core` には Ionic は不要です。
- Android は API 24+、SDK 36、JDK 21、Kotlin 2.2.20、Compose が必要です。標準コントロールは Web 表示を維持し、アプリ固有の Compose 拡張は別の機能です。iOS と同じ toolbar・検索機能が使えるとは限りません。

## 両プロジェクトへ同じ版をインストールする

Cordova プロジェクトで実行します。

```sh
cordova plugin add @webview-native-ui/cordova-plugin@0.1.6
```

Web アセットをバンドルする場合は、その npm プロジェクトでも実行します。

```sh
npm install --save-exact @webview-native-ui/cordova-plugin@0.1.6
```

Cordova のコマンドはネイティブプラグイン、npm 依存は Web バンドラー向けの import を導入します。両方のバージョンを揃えてください。Cordova の HTML に `<script src="cordova.js"></script>` を残し、Web アセットを `www` へビルドしてから `cordova prepare` を実行し、ネイティブアプリを再ビルドします。Web アセットの再読み込みではネイティブコードは更新されません。Git URL からの直接インストールは未対応です。

Android では `config.xml` へ次の設定を追加します。

```xml
<preference name="GradlePluginKotlinEnabled" value="true" />
<preference name="GradlePluginKotlinVersion" value="2.2.20" />
<preference name="AndroidGradlePluginVersion" value="8.13.0" />
<preference name="AndroidJavaSourceCompatibility" value="21" />
<preference name="AndroidJavaTargetCompatibility" value="21" />
<preference name="AndroidKotlinJVMTarget" value="21" />
```

## Cordova の準備完了後に開始する

同梱ブラウザー API ではハンドルを保持し、`deviceready` の後に開始します。

```js
let nativeUI;

document.addEventListener('deviceready', async () => {
  nativeUI = await window.NativeUI.enableNativeUI();
}, { once: true });
```

アプリが Native UI の利用を終了するときに `await nativeUI.destroy()` を呼びます。Web フォールバックの調査には `nativeUI.getStatus()` を確認してください。iOS の自動スクロール inset は無効なので、`env(safe-area-inset-top)` などで CSS 側の safe-area 余白を用意します。

ESM アプリでは、標準 HTML は `@webview-native-ui/cordova-plugin/core`、Ionic は `@webview-native-ui/cordova-plugin` から `enableNativeUI` を import します。ランタイムの開始方法は1つに統一し、npm と `window.NativeUI` の開始を混在させないでください。

## Android Dynamic Color

Android 12以降では、Cordovaの準備ができた後に端末の配色を取得できます。配色だけを使うアプリではNative UIの起動は不要です。

```ts
import { getDynamicColorScheme } from '@webview-native-ui/cordova-plugin/core';

const scheme = await getDynamicColorScheme();
```

## iOS テーマを使う場合

iOS テーマを使うアプリは、テーマを別途インストールします。手順は [Cordova のテーマ設定](/ionic-theme-ios27/docs/cordova)を参照してください。

**iPhone Duo について**　Cordova には `@erkamyaman/capacitor-foldable` に相当するプラグインがないため、この構成では iPhone Duo に対応できません。

## ツールバーボタンのバッジ

`ion-toolbar` 内の `ion-button` の直下に `ion-badge` を配置します。

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

対応する iOS のネイティブ Vertical Bars では、元のテキストと Ionic の背景色・文字色を反映します。Web レールのフォールバックでも表示状態を維持します。件数・色の変更、非表示、削除は既存のアクションへ反映されます。未読インジケーターには、タグの間に空白や改行を入れない完全に空の `<ion-badge></ion-badge>` を使います。通知状態をアクセシブルなラベルにも含めてください。両プロジェクトのプラグインを更新し、`cordova prepare` を実行してネイティブアプリを再ビルドします。

## 次の手順

- [Engine の概念と制約](/webview-native-ui-engine/docs/concepts)では、共有する表示モデルを説明しています。
- [パッケージの README](https://github.com/webview-native-ui/cordova-plugin/blob/v0.1.6/README.md)には、ローカルアーカイブ、問題の調査、共有ソース、開発時の検証手順があります。
- Cordova のインストール・コールバック・ライフサイクルの問題は [Cordova リポジトリ](https://github.com/webview-native-ui/cordova-plugin/issues)へ報告してください。
