---
title: Ionic Theme iOS27
sourceRevision: "7340ece4c80437455dcad07cad5def0cdb3b564fba7a8717de8392e9719df36f"
---

IonicコンポーネントにiOS 27のLiquid Glassとアニメーションを適用します。

[セットアップ](setup.md) · [ブラウザーで試す](https://ionic-theme-ios27.rdlabo.dev/)

セットアップ例はIonic 9向けです。Ionic 8のAngularアプリでは、`provideIonicAngular` を `@ionic/angular/standalone` からインポートします。

<!-- rdlabo-docs-pick -->

<p>
  <img src="https://raw.githubusercontent.com/webview-native-ui/ionic-theme-ios27/c70beb9d1e5b39de696b2b2c47a3d9bc5ffcdfbe/screenshots/ios27-settings.png" width="32%" alt="iOS 27 theme: Settings in light mode with a Liquid Glass search bar" />
  <img src="https://raw.githubusercontent.com/webview-native-ui/ionic-theme-ios27/c70beb9d1e5b39de696b2b2c47a3d9bc5ffcdfbe/screenshots/ios27-settings-dark.png" width="32%" alt="iOS 27 theme: Settings in dark mode" />
  <img src="https://raw.githubusercontent.com/webview-native-ui/ionic-theme-ios27/c70beb9d1e5b39de696b2b2c47a3d9bc5ffcdfbe/screenshots/ios27-library.png" width="32%" alt="iOS 27 theme: Library with Liquid Glass buttons and tab bar" />
</p>

<!-- /rdlabo-docs-pick -->

<a id="%E3%81%AF%E3%81%98%E3%82%81%E3%82%8B"></a><a id="get-started"></a>

## 何をしたいですか？

Cordovaでも、まずIonicの初期化に `ios27ThemeConfig` を渡し、その後に[Cordova連携](cordova.md)を設定します。

| 目的 | ガイド |
| --- | --- |
| 既存の Ionic アプリにテーマを適用する | [はじめる](https://webview-native-ui.com/projects/ionic-theme-ios27/docs/setup) |
| iOS 26/27 の選択と任意の MD3 併用 | [適応テーマ](https://webview-native-ui.com/projects/ionic-theme-ios27/docs/adaptive-themes) |
| Capacitor アプリに iOS のネイティブコントロールを追加する | [Native UI を追加](https://webview-native-ui.com/projects/ionic-theme-ios27/docs/add-native-ui) |
| 既存テーマを維持して Ionic にサイドレールを追加する | [Vertical Bars の導入](https://webview-native-ui.com/projects/capacitor-native-ui/docs/ionic-vertical-bars) |
| 任意で Cordova からテーマと Native UI を使う | [Cordova の設定](/docs/cordova) |
| スタイル・ダークモード・アニメーションを個別に設定する | [設定](/docs/configuration) |
| 既存環境を更新する | [移行](https://webview-native-ui.com/projects/ionic-theme-ios27/docs/migration) |

## アプリをカスタマイズする

個別の CSS とアニメーションは[設定](/docs/configuration)、既存アプリの任意の簡略化は[移行](/docs/migration#optional-simplify-the-setup)を参照してください。

- [機能](https://webview-native-ui.com/projects/ionic-theme-ios27/docs/features): CSS 変数、Liquid Glass、コンポーネント別の読み込み。
- [特殊なマークアップとクラス](https://webview-native-ui.com/projects/ionic-theme-ios27/docs/special-markup): 明示的に有効にする動作。
- [ion-item-group](https://webview-native-ui.com/projects/ionic-theme-ios27/docs/using-ion-item-group): inset リストの構造。
- [アニメーション](https://webview-native-ui.com/projects/ionic-theme-ios27/docs/animation): tab・segment・検索の効果。
- [ESLint](https://webview-native-ui.com/projects/ionic-theme-ios27/docs/eslint): 未対応リスト構造の検出。
- [Vertical Bars レイアウト](https://webview-native-ui.com/projects/ionic-theme-ios27/docs/vertical-bars-layout): 余白、RTL、配置、姿勢、split pane。

## リポジトリの責務

Capacitor プラグインは [webview-native-ui/capacitor-plugin](https://github.com/webview-native-ui/capacitor-plugin) で保守します。このリポジトリはテーマ、統合デモ、ブラウザー撮影とシミュレーター連携テストを管理します。デモは npm の `@rdlabo/capacitor-native-ui` を使用し、テーマのリリースでプラグインの公開や版の変更は行いません。

iOS テーマを使うアプリは、テーマを別途インストールします。手順は [Cordova のテーマ設定](cordova.md)を参照してください。

未公開のプラグインアーカイブを実際のデモで検証する場合:

```sh
npm run test:native-candidate -- /absolute/path/rdlabo-capacitor-native-ui-VERSION.tgz --e2e
```

隔離した一時チェックアウトを作成し、既存の manifest と lockfile は変更しません。`--e2e` と一緒に `--shard=1/2` を渡すと Playwright の1シャードを実行します。全体を検証するには全シャードを実行してください。各シャードでパッケージ検証、unit test、本番ビルドを維持します。`--simulator=UDID` は Native UI・検索・edge のシミュレーター検証を追加します。診断情報と一時デモは表示された場所に残ります。プラグイン単体とネイティブライブラリのテストはプラグイン側で管理し、その CI は候補をこのリポジトリの main と組み合わせて検証します。

## メンテナンス

最新のクリーンな `main` から `npm run release` でテーマをリリースします。`ios27-v…` のタグワークフローはテーマだけを公開し、プレリリースには `next`、安定版には `latest` を使います。

テーマとプラグインは独立したバージョンです。単独の `@rdlabo/ionic-theme-ios27` は、アプリと同じインスタンスを使うため Capacitor Native UI を必須 peer dependency とします。npm 7+ はテーマ専用アプリでも自動導入し、ほかのパッケージマネージャーでは必須 peer を導入する必要があります。ネイティブコントロールを使うアプリは Capacitor の検出用にプラグインを直接依存へ宣言してください。公開済み npm バージョンは上書きできません。
