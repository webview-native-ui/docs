---
title: Ionic Theme iOS27
---

# Ionic Theme iOS27

`npm install @rdlabo/ionic-theme-ios27 @erkamyaman/capacitor-foldable` でインストールします。1.x は [v1.2.1 のガイド](https://github.com/webview-native-ui/ionic-theme-ios27/tree/ios27-v1.2.1)を使用してください。Ionic アプリに iOS 27 の Liquid Glass とアニメーションを適用します。Capacitor iOS では、2.0.0から正式対応した Native UI を対応コントロールへ追加できます。

**[Ionic 9 デモ](https://ionic-theme-ios27.rdlabo.dev/) · [セットアップ](https://docs.rdlabo.dev/projects/ionic-theme-ios27/docs/setup)**

<!-- rdlabo-docs-pick -->

<p>
  <img src="https://raw.githubusercontent.com/webview-native-ui/ionic-theme-ios27/c70beb9d1e5b39de696b2b2c47a3d9bc5ffcdfbe/screenshots/ios27-settings.png" width="32%" alt="iOS 27 theme: Settings in light mode with a Liquid Glass search bar" />
  <img src="https://raw.githubusercontent.com/webview-native-ui/ionic-theme-ios27/c70beb9d1e5b39de696b2b2c47a3d9bc5ffcdfbe/screenshots/ios27-settings-dark.png" width="32%" alt="iOS 27 theme: Settings in dark mode" />
  <img src="https://raw.githubusercontent.com/webview-native-ui/ionic-theme-ios27/c70beb9d1e5b39de696b2b2c47a3d9bc5ffcdfbe/screenshots/ios27-library.png" width="32%" alt="iOS 27 theme: Library with Liquid Glass buttons and tab bar" />
</p>

<!-- /rdlabo-docs-pick -->

## 何をしたいですか？

| 目的 | ガイド |
| --- | --- |
| 既存の Ionic アプリにテーマを適用する | [はじめる](https://docs.rdlabo.dev/projects/ionic-theme-ios27/docs/setup) |
| iOS 26/27 の選択と任意の MD3 併用 | [適応テーマ](https://docs.rdlabo.dev/projects/ionic-theme-ios27/docs/adaptive-themes) |
| Capacitor アプリに iOS のネイティブコントロールを追加する | [Native UI を追加](https://docs.rdlabo.dev/projects/ionic-theme-ios27/docs/add-native-ui) |
| 既存テーマを維持して Ionic にサイドレールを追加する | [Vertical Bars の導入](https://docs.rdlabo.dev/projects/capacitor-native-ui/docs/ionic-vertical-bars) |
| 任意で Cordova からテーマと Native UI を使う | [Cordova の設定](/docs/cordova) |
| スタイル・ダークモード・アニメーションを個別に設定する | [設定](/docs/configuration) |
| 既存環境を更新する | [移行](https://docs.rdlabo.dev/projects/ionic-theme-ios27/docs/migration) |

## はじめる

標準ガイドは単独テーマパッケージを使用し、ネイティブホストは Capacitor を標準とします。テーマだけをブラウザーで使うこともできます。Cordova アプリには、同梱テーマとホスト固有の起動を説明する [Cordova ガイド](/docs/cordova)があります。

デバイスレイアウトには、Erkam Yaman によるコミュニティプラグイン [Capacitor Foldable](https://github.com/erkamyaman/capacitor-foldable) を標準連携として使用します。折りたたみ状態、ヒンジの形状、バー配置と変更イベントをアプリへ提供し、レイアウトの応答を制御できます。Foldable はデバイス情報、テーマは Web レイアウト、Native UI はコントロールの投影を担当します。使用するパッケージと一緒に導入し、アプリでイベントを接続してください。

テーマを導入し、Ionic の基本 CSS の後にグローバルのテーマ CSS を1つ読み込み、既存の Ionic 初期化へテーマ設定を渡します。Angular・React・Vue の手順は[セットアップ](https://docs.rdlabo.dev/projects/ionic-theme-ios27/docs/setup)を参照してください。

```sh
npm install @rdlabo/ionic-theme-ios27 @erkamyaman/capacitor-foldable
```

```css
@import '@rdlabo/ionic-theme-ios27/styles/system.css';
```

```ts
import { ios27ThemeConfig } from '@rdlabo/ionic-theme-ios27';

provideIonicAngular({
  ...ios27ThemeConfig,
  // animated: false,
});
```

手動のダークモードには `styles/class.css`、常時ダークには `styles/always.css` を選びます。対応する Ionic ダークパレットも含まれます。テーマ設定は iOS モードとアニメーションを既定とし、アプリのオプションで上書きできます。対応する Ionic は `>=8.8.1 <10` です。ブラウザー専用アプリにネイティブ Capacitor プロジェクトは不要です。

テーマは toolbar、tabs、list、button、search、overlay のライト・ダーク外観を提供しますが、ネイティブコントロールは有効にしません。Web テーマの動作後に任意で [Native UI を追加](https://docs.rdlabo.dev/projects/ionic-theme-ios27/docs/add-native-ui)できます。

## アプリをカスタマイズする

個別の CSS とアニメーションは[設定](/docs/configuration)、既存アプリの任意の簡略化は[移行](/docs/migration#optional-simplify-the-setup)を参照してください。

- [機能](https://docs.rdlabo.dev/projects/ionic-theme-ios27/docs/features): CSS 変数、Liquid Glass、コンポーネント別の読み込み。
- [特殊なマークアップとクラス](https://docs.rdlabo.dev/projects/ionic-theme-ios27/docs/special-markup): 明示的に有効にする動作。
- [ion-item-group](https://docs.rdlabo.dev/projects/ionic-theme-ios27/docs/using-ion-item-group): inset リストの構造。
- [アニメーション](https://docs.rdlabo.dev/projects/ionic-theme-ios27/docs/animation): tab・segment・検索の効果。
- [ESLint](https://docs.rdlabo.dev/projects/ionic-theme-ios27/docs/eslint): 未対応リスト構造の検出。
- [Vertical Bars レイアウト](https://docs.rdlabo.dev/projects/ionic-theme-ios27/docs/vertical-bars-layout): 余白、RTL、配置、姿勢、split pane。

## リポジトリの責務

Capacitor プラグインは [webview-native-ui/capacitor-plugin](https://github.com/webview-native-ui/capacitor-plugin) で保守します。このリポジトリはテーマ、統合デモ、ブラウザー撮影とシミュレーター連携テストを管理します。デモは npm の `@rdlabo/capacitor-native-ui` を使用し、テーマのリリースでプラグインの公開や版の変更は行いません。

[Cordova プラグイン](https://github.com/webview-native-ui/cordova-plugin)は別に保守し、連携 import を Cordova に接続した固定版テーマを配布します。共通テーマの修正はテーマ側で行い、Cordova は後続のプラグインリリースで同梱版を更新します。以下の Capacitor デモと候補検証は Cordova を検証しません。

未公開のプラグインアーカイブを実際のデモで検証する場合:

```sh
npm run test:native-candidate -- /absolute/path/rdlabo-capacitor-native-ui-VERSION.tgz --e2e
```

隔離した一時チェックアウトを作成し、既存の manifest と lockfile は変更しません。`--e2e` と一緒に `--shard=1/2` を渡すと Playwright の1シャードを実行します。全体を検証するには全シャードを実行してください。各シャードでパッケージ検証、unit test、本番ビルドを維持します。`--simulator=UDID` は Native UI・検索・edge のシミュレーター検証を追加します。診断情報と一時デモは表示された場所に残ります。プラグイン単体とネイティブライブラリのテストはプラグイン側で管理し、その CI は候補をこのリポジトリの main と組み合わせて検証します。

## メンテナンス

最新のクリーンな `main` から `npm run release` でテーマをリリースします。`ios27-v…` のタグワークフローはテーマだけを公開し、プレリリースには `next`、安定版には `latest` を使います。

テーマとプラグインは独立したバージョンです。単独の `@rdlabo/ionic-theme-ios27` は、アプリと同じインスタンスを使うため Capacitor Native UI を必須 peer dependency とします。npm 7+ はテーマ専用アプリでも自動導入し、ほかのパッケージマネージャーでは必須 peer を導入する必要があります。ネイティブコントロールを使うアプリは Capacitor の検出用にプラグインを直接依存へ宣言してください。公開済み npm バージョンは上書きできません。
