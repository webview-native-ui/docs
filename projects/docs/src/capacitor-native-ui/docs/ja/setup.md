---
title: Ionic アプリで Native UI をセットアップする
---

# Ionic アプリで Native UI をセットアップする

パッケージを導入し、テーマを設定して、Native UI を起動します。通常のコントロールと **Vertical Bars はデフォルトで有効**です。ネイティブレールを利用できるかどうかはデバイスが決定します。

## 1. パッケージをインストールする

```sh
npm install @rdlabo/capacitor-native-ui @rdlabo/ionic-theme-ios27 @erkamyaman/capacitor-foldable
```

Capacitor 8 と iOS プロジェクトを持つ既存の Ionic アプリを使います。標準構成は iOS 27 テーマのプリセットと、Foldable 8.5 以降のバージョン8を使用します。

## 2. テーマを設定する

Ionic の基本 CSS は維持します。アプリのテーマとダークパレット用スタイルシートには、この単一エントリーを使います。

```css
@import '@rdlabo/ionic-theme-ios27/styles/system.css';
```

描画の前に、アプリの Ionic 初期化へプリセットを渡します。

```ts
import { ios27ThemeConfig } from '@rdlabo/ionic-theme-ios27';

const ionicConfig = {
  ...ios27ThemeConfig,
};
```

| フレームワーク | Ionic の初期化 |
| --- | --- |
| Angular / Ionic 8 | `@ionic/angular/standalone` の `provideIonicAngular(ionicConfig)` |
| Angular / Ionic 9 | `@ionic/angular` の `provideIonicAngular(ionicConfig)` |
| React | `@ionic/react` の `setupIonicReact(ionicConfig)` |
| Vue | `@ionic/vue` の `IonicVue` を使う `app.use(IonicVue, ionicConfig)` |

スタイルシートにはレールのレイアウトとシステムのダークパレットが含まれます。プリセットは Ionic のモードとアニメーションを設定し、Native UI のナビゲーションも連携します。

## 3. Native UI を起動する

アプリのシェルがマウントされた後に、デフォルトのランタイムを起動します。

```ts
import { enableNativeUI } from '@rdlabo/capacitor-native-ui';

await enableNativeUI();
```


Angular では `bootstrapApplication` の完了後、React や Vue ではアプリシェルの描画後に呼びます。Foldable の初期配置と `layoutChange` 通知を `resolveVerticalBarsLayout` とテーマの `setVerticalBarsLayout` で接続します。[起動とデバイス配置の例](device-layout.md)を参照してください。

## 4. ビルド・同期して実行する

アプリの Web アセットをビルドしてから、ネイティブプロジェクトを同期します。

```sh
npx cap sync ios
```

Xcode 26+ で再ビルドし、iOS 26+ で実行します。ネイティブレールには追加の[対応デバイスと OS](vertical-bars.md#native-rendering)が必要です。それ以外のデバイスは通常のレイアウトを維持します。SwiftPM は Engine を自動解決します。既存の CocoaPods アプリには[ネイティブプロジェクト設定](configuration.md#native-project-setup)を適用します。

既存のツールバー操作とタブが元のハンドラーを呼ぶことを確認します。進む・戻る、戻るジェスチャーのキャンセル、レール対応デバイスでの画面切替を試します。ブラウザーでは Web フォールバックを確認します。

## 次のステップ

- 標準プリセットの代わりに[既存の Web テーマを使う](ionic-vertical-bars.md)。
- [Ionic なしで HTML を使う](framework-independent.md)。
- [外観とアプリの上書き設定](https://webview-native-ui.com/projects/ionic-theme-ios27/docs/configuration)。
- [対応コントロール](native-ui.md)と[設定リファレンス](configuration.md)。
- [以前の連携を更新する](migration.md#simplify-an-existing-ios-setup)。
