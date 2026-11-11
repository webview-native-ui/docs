---
title: Ionic アプリで Native UI をセットアップする
---

# Ionic アプリで Native UI をセットアップする

標準の Ionic iOS 構成から始めます。パッケージを導入し、テーマのプリセットを使い、Native UI ランタイムを1つ起動します。**Vertical Bars は通常のコントロールとともにデフォルトで有効です。** 対応デバイスがレール配置を決め、ブラウザーやレールのないデバイスでは Web レイアウトを維持します。

Capacitor 8 を使う既存の Ionic アプリを対象とします。このガイドは iOS 27 テーマの高レベルなスタイルシートと設定を使います。別の Web テーマを維持する場合は[既存テーマの設定](ionic-vertical-bars.md)、Ionic を使わない場合は [HTML 設定](framework-independent.md)を参照してください。

## 1. プラグインをインストールする

```sh
npm install @rdlabo/capacitor-native-ui @rdlabo/ionic-theme-ios27 @erkamyaman/capacitor-foldable
```

Capacitor がネイティブプラグインを検出できるよう、Native UI をアプリの直接依存へ追加します。テーマ、プラグイン、Foldable はそれぞれ独立した依存です。テーマが宣言する Native UI の peer 範囲を守ってください。標準のデバイス配置連携には Foldable 8.5 以降のバージョン8を使います。

## 2. Shell を有効にする

Ionic の基本スタイルは維持します。グローバルスタイルシートでは、個別の Ionic ダークパレットと iOS テーマの import を、テーマの単一エントリーに置き換えます。

```css
@import '@rdlabo/ionic-theme-ios27/styles/system.css';
```

描画を始める前に、既存の Ionic 初期化へテーマのプリセットを渡します。

```ts
import { ios27ThemeConfig } from '@rdlabo/ionic-theme-ios27';

const ionicConfig = {
  ...ios27ThemeConfig,
};
```

| フレームワーク | 既存の Ionic 初期化 |
| --- | --- |
| Angular / Ionic 8 | `@ionic/angular/standalone` の `provideIonicAngular(ionicConfig)` |
| Angular / Ionic 9 | `@ionic/angular` の `provideIonicAngular(ionicConfig)` |
| React | `@ionic/react` の `setupIonicReact(ionicConfig)` |
| Vue | `@ionic/vue` の `IonicVue` を使う `app.use(IonicVue, ionicConfig)` |

スタイルシートには Vertical Bars のレイアウト、プリセットには Native UI に対応したページ遷移が含まれます。別のレール用スタイルシートを重ねたり、プリセットの遷移を再度ラップしたりしないでください。手動ダークモードやアプリ側の上書きは[テーマ設定](https://webview-native-ui.com/projects/ionic-theme-ios27/docs/configuration)を参照してください。

アプリの `ion-app` がマウントされた後に Native UI を一度起動します。

```ts
import { enableNativeUI } from '@rdlabo/capacitor-native-ui';

const shell = await enableNativeUI();
```

このデフォルトの呼び出しで、通常のコントロールと **Vertical Bars の両方**を有効にします。標準設定に `controls: 'verticalOnly'` は不要です。個別選択、ブラウザー向け固定配置、拡張、中断リースは設定リファレンスの API であり、導入の前提ではありません。

### フレームワークのアプリルートに起動処理を置く

ランタイムの寿命はアプリの bootstrap が所有します。デバイス情報はアプリのサービス、テーマ設定は Ionic 初期化とグローバルスタイルシート、既存のハンドラーと状態はページコンポーネントが担当します。`AppComponent` やページへ別のルーター、投影状態、ネイティブの寿命管理を追加しないでください。

Angular では[デバイス配置サービス](ionic-vertical-bars.md#3-connect-device-placement-and-start-the-controls)を用意し、既存の `src/main.ts` で両方の所有者を接続します。

```ts
import { bootstrapApplication } from '@angular/platform-browser';
import { enableNativeUI } from '@rdlabo/capacitor-native-ui';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';
import { VerticalBarsLayoutService } from './app/vertical-bars-layout.service';

void bootstrapApplication(AppComponent, appConfig)
  .then(async (app) => {
    const shell = await enableNativeUI();
    if (app.destroyed) {
      await shell.destroy();
      return;
    }
    app.onDestroy(() => {
      void shell.destroy().catch((error: unknown) => console.error('Native UI cleanup failed', error));
    });
    await app.injector.get(VerticalBarsLayoutService).initialize();
  })
  .catch((error: unknown) => console.error('Application startup failed', error));
```

アプリの1つの bootstrap へ統合してください。別の bootstrap やランタイムを増やしません。`AppComponent` はアプリのシェルと router outlet の構成に留めます。サービスは初回のデバイス読み取りより先に購読し、破棄時に解除して、解決した位置と寸法をテーマへ渡します。ネイティブ投影、フォールバック、イベント転送は Native UI が担当します。

React と Vue でも所有関係は同じです。アプリのシェルがマウントされた後に一度起動し、デバイス連携はルーティングされるページの外へ置きます。アプリの所有者を破棄するときに、ランタイムを破棄してデバイス購読を解除します。Angular の DI サービスを他のフレームワークへコピーしたり、モジュールグローバルの寿命管理キューを追加したりしないでください。

## 3. ナビゲーションを調整する

標準の `ios27ThemeConfig` は、戻るジェスチャーを含む Ionic ナビゲーションとネイティブ表示をすでに連携します。通常の Ionic ルートとハンドラーを維持してください。アプリ独自の `navigate()` ラッパー、Web Animation によるページ切替、ページごとの Native UI 起動は不要です。

上記のデバイス購読も、標準の Vertical Bars 設定に含まれます。後から選ぶオプションではありません。`layoutChange` と `resolveVerticalBarsLayout(Foldable)` は edge、inset、toolbar の原点を取得し、edge/inset が変わらない画面切替も扱います。Web レイアウトはテーマ、ネイティブレールの利用可否は Native UI が担当します。デバイスの edge が null の場合は通常のレイアウトへ戻します。

既存の Web テーマや独自テーマを使う場合は、テーマを置き換えず[単独レイアウトと遷移の設定](ionic-vertical-bars.md)に従います。独自アニメーションには[遷移アダプター](migration.md#native-ui-transition-adapter)を使います。これはプリセットと別の経路であり、2つ目の調整処理を追加するものではありません。

## 4. ビルド・同期して実行する

通常のネイティブコントロールには Ionic `>=8.8.1 <10`、Capacitor 8、Xcode 26+、iOS 26+ が必要です。ネイティブ Vertical Bars には追加の[対応デバイスと OS](vertical-bars.md#native-rendering)が必要です。デフォルトで有効でも、非対応のハードウェアへレールを強制しません。

SwiftPM は Engine を自動解決します。既存の CocoaPods アプリでは、導入済み Native UI が必要とする Engine のバージョンをインストールします。

```sh
npm install "@webview-native-ui/engine@$(node -p "require('./node_modules/@rdlabo/capacitor-native-ui/package.json').dependencies['@webview-native-ui/engine']")"
```

`ios/App/Podfile` の既存アプリターゲットで、生成される `def capacitor_pods` ブロックの外へ Engine を追加します。

```ruby
target 'App' do
  capacitor_pods
  pod 'WebViewNativeUIEngine', :path => '../../node_modules/@webview-native-ui/engine'
  # Keep your other application pods here.
end
```

プロジェクト構成に応じてパスを調整し、Native UI の更新時にもバージョンを揃えます。これは CocoaPods の互換設定であり、アプリの UI ロジックではありません。

アプリの Web アセットをビルドしてから同期します。

```sh
npx cap sync ios
```

Xcode で再ビルドして実行します。対応する既存のツールバー操作とタブはネイティブに投影され、元のハンドラーを呼び出します。対応レールデバイスでは Vertical Bars を使い、コンテンツは報告された余白を確保します。進む・戻る、戻るジェスチャーのキャンセル、デバイス画面の切替、Web フォールバックを確認してください。ブラウザープレビューではネイティブ描画を検証できません。

| 表示される状態 | 確認すること |
| --- | --- |
| 対応 iOS でもすべて Web 表示のまま | 直接依存、マウント後の起動、Capacitor sync、ネイティブ再ビルド。 |
| 一部のコントロールだけ Web のまま | [対応コントロール](native-ui.md#supported-markup)とソースのマークアップを照合します。 |
| レール対応デバイスでも通常レイアウト | デバイスサービスを接続し、対応するテーマスタイルシートを読み込みます。 |
| 画面切替でレイアウトが更新されない | edge/inset のイベントだけでなく `layoutChange` とリゾルバーを使います。 |
| 遷移中にコントロールが重なる | プリセットの遷移、または独自遷移アダプターのどちらか1つを設定します。 |

## 次のステップ

- 標準の Vertical Bars 動作を維持して[既存の Web テーマを使う](ionic-vertical-bars.md)。
- 明示的なカスタマイズや既定値の無効化は[設定リファレンス](configuration.md)。
- [対応コントロール](native-ui.md)と[外観](appearance.md)。
- 旧パッケージ名や連携 API からの[移行](migration.md)。

## テーマなしのナビゲーション

これは別のナビゲーション寿命を所有するアプリ向けの高度な連携であり、標準の Ionic 導入手順ではありません。ナビゲーションの所有者はアプリのルーター1つに保ちます。ルーターのないアプリは [HTML の例](https://github.com/webview-native-ui/capacitor-plugin/tree/main/examples/native-ui-html)、明示的に Web 表示へ受け渡す場合は[中断](native-ui.md#custom-overlay-suspension)を参照してください。完了・キャンセルが落ち着いてから再開し、Ionic アプリへ別のページルーターをコピーしないでください。
