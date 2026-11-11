---
title: テーマに Native UI を追加する
---

# テーマに Native UI を追加する

iOS Native UI と Android Dynamic Color をまとめて導入する場合は、[WebView Native UI 標準導入](https://webview-native-ui.com/standard-setup)を使います。このページでは既存の iOS テーマへ Native UI を追加します。

Capacitor アプリで `@rdlabo/ionic-theme-ios27` を使用していますか。テーマのスタイル、Web コンテンツ、ルーティングを維持したまま、iOS にネイティブコントロールを追加できます。未対応のコントロール、ブラウザー、Android では Web の外観を維持します。

テーマをまだ設定していない場合は[テーマのセットアップ](setup.md)から始めてください。別の Web 外観を使用する場合は [既存テーマの設定](../../capacitor-native-ui/docs/ionic-vertical-bars.md)に進んでください。

ネイティブコントロールと Web DOM・ハンドラーの接続については、[投影の仕組み](../../capacitor-native-ui/docs/native-ui.md)を参照してください。

## 1. ネイティブプラグインをインストールする

このガイドは iOS プロジェクトを備えた Capacitor 8 アプリを前提としています。Cordova では別の [Cordova のセットアップ](cordova.md)に従ってください。Web テーマだけを使う場合は Capacitor なしで利用できます。iOS のネイティブコントロールを追加する場合は、先にネイティブプロジェクトをセットアップします。対応する Ionic、iOS、Xcode のバージョンは [Native UI の要件](https://webview-native-ui.com/projects/capacitor-native-ui/docs/readme#requirements)を参照してください。

テーマと Native UI は独立してバージョン管理されます。テーマが宣言する peer dependency と互換性のある Native UI をインストールし、Foldable をアプリの別の依存関係としてインストールします。

```sh
npm install @rdlabo/ionic-theme-ios27 @rdlabo/capacitor-native-ui @erkamyaman/capacitor-foldable
```

Vertical Bars の配置を含む[テーマ設定](setup.md)のスタイルシートを維持します。Foldable はバージョン8の8.5以降を使います。Capacitor の標準のプラグイン検出には直接依存が必要です。テーマ経由でインストールされるだけではネイティブプラグインは登録されません。

## 2. ネイティブコントロールを有効にする

`ion-app` の描画後に一度実行します。通常のコントロールと Vertical Bars はデフォルトで有効です。デバイスの変更を購読してから初期配置を反映します。

```ts
import { enableNativeUI } from '@rdlabo/capacitor-native-ui';
import { Foldable } from '@erkamyaman/capacitor-foldable';
import { resolveVerticalBarsLayout } from '@rdlabo/capacitor-native-ui/integration';
import { setVerticalBarsLayout } from '@rdlabo/ionic-theme-ios27';

await enableNativeUI();

const updateLayout = async () => {
  setVerticalBarsLayout(await resolveVerticalBarsLayout(Foldable));
};

void Foldable.addListener('layoutChange', () => void updateLayout().catch(console.error))
  .then(updateLayout)
  .catch(console.error);
```

Angular では、この起動コードをアプリシェルの `afterNextRender` コールバックへ置きます。React・Vue ではシェルのマウント後に両方を実行します。テーマがデバイスに合う余白を反映し、Native UI がネイティブ描画を担当します。edge が null の場合は通常配置へ戻ります。

テーマパッケージの `navAnimation: iosTransitionAnimation` は維持します。画面遷移や戻るジェスチャーでのネイティブコントロールの調整を含むため、再度ラップしないでください。独自のアニメーションでは[遷移アダプターの手順](../../capacitor-native-ui/docs/migration.md#native-ui-transition-adapter)を参照してください。

プラグインのインストールやテーマのアニメーション設定だけでは、ネイティブコントロールは有効になりません。アプリが上記の起動呼び出しで有効にします。

## 3. iOS を同期して実行する

CocoaPods プロジェクトでは、先に [Engine の Podfile 設定](https://webview-native-ui.com/projects/capacitor-native-ui/docs/configuration#native-project-setup)を完了してください。SwiftPM は Engine を自動で解決します。Web アセットをビルドしてから、次を実行します。

```sh
npx cap sync ios
```

対応する iOS デバイスまたはシミュレーターでアプリを実行します。対象の固定コントロールがネイティブ表示になり、既存のハンドラーが呼び出されることを確認してください。前後の画面に遷移し、ブラウザーでも Web フォールバックを確認します。対応する iOS ですべて Web 表示のままなら、直接依存、起動呼び出し、同期、ネイティブの再ビルドを確認してください。対象のマークアップとフォールバック動作は[対応コントロール](../../capacitor-native-ui/docs/native-ui.md#supported-markup)を参照してください。Web コンテンツと投影されないコントロールのためにテーマのスタイルは維持します。

## 既存のネイティブ連携を更新する

テーマパッケージからネイティブ API をインポートしていた場合は、[ネイティブインポートの移行](../../capacitor-native-ui/docs/migration.md#2-replace-native-imports)と[ネイティブプロジェクトの移行](../../capacitor-native-ui/docs/migration.md#3-sync-the-native-project)に従ってください。通常のテーマのインポートとスタイルシートは維持します。
