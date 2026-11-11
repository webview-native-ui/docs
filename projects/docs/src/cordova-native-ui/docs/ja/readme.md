---
title: Cordova ではじめる
---

# Cordova ではじめる

公開済みの `@webview-native-ui/cordova-plugin` v0.1.1 を使い、Cordova アプリに Native UI を追加します。Capacitor プラグインと Native UI Core を共有しますが、Capacitor の JavaScript ランタイムは不要です。標準 HTML は `/core`、Ionic 連携はパッケージルートから利用します。

## 要件と対応範囲

- Cordova CLI 13 と、Swift Package Manager を使う cordova-ios 8.1+、または cordova-android 15+。
- iOS のネイティブコントロールには iOS 26+ と Xcode 26+ が必要です。古い iOS は Web 表示を維持します。CocoaPods と古い Cordova は未対応です。
- Ionic 連携と同梱テーマには `@ionic/core >=8.8.1 <10` が必要です。標準 HTML 用の `/core` には Ionic は不要です。
- Android は API 24+、SDK 36、JDK 21、Kotlin 2.2.20、Compose が必要です。標準コントロールは Web 表示を維持し、アプリ固有の Compose 拡張は別の機能です。iOS と同じ toolbar・検索機能が使えるとは限りません。

## 両プロジェクトへ同じ版をインストールする

Cordova プロジェクトで実行します。

```sh
cordova plugin add @webview-native-ui/cordova-plugin@0.1.1
```

Web アセットをバンドルする場合は、その npm プロジェクトでも実行します。

```sh
npm install --save-exact @webview-native-ui/cordova-plugin@0.1.1
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

## 任意の同梱 Ionic テーマ

0.1.1 には iOS27 テーマの2.1.0が同梱されています。単独テーマは独立してリリースされるため、そちらの最新版を入れても Cordova プラグインの同梱版は更新されません。バンドラーの alias を使わず、プラグインの `/theme` と `/theme/css/*` を使用します。アニメーションと CSS は [Cordova テーマ設定](/ionic-theme-ios27/docs/cordova)を参照し、古いテーマ import を置き換えて連携方式を混在させないでください。

`deviceready` と、アプリの `ion-app` のマウントが両方完了してから Native UI を開始します。テーマの import やスタイリングだけではネイティブコントロールは有効になりません。主な対応ホストは Capacitor であり、Cordova の対応範囲は限定されます。ビルド成功だけでフレームワークのルーターやジェスチャーの完全な同等性を確認したことにはなりません。

## 次の手順

- [Engine の概念と制約](/webview-native-ui-engine/docs/concepts)では、共有する表示モデルを説明しています。
- [パッケージの README](https://github.com/webview-native-ui/cordova-plugin/blob/5ac3c7e2754c55c3ffde2e90b3d54ad10152362a/README.md)には、ローカルアーカイブ、問題の調査、共有ソース、開発時の検証手順があります。
- Cordova のインストール・コールバック・ライフサイクルの問題は [Cordova リポジトリ](https://github.com/webview-native-ui/cordova-plugin/issues)へ報告してください。
