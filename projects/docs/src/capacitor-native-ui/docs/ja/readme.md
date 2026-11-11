---
title: "Capacitor Native UI"
---

# Capacitor Native UI

Capacitor Native UI は、WebView アプリにネイティブコントロール、端末の配色、独自のネイティブコンテンツを提供します。

## 標準導入：iOS Native UI と Android Dynamic Color

Ionic アプリでは、両プラットフォームの機能をまとめて設定するところから始めます。標準導入には iOS の iPhone Duo / Vertical Bars と配置変更への追従、対応する Android 端末の Material You 配色が含まれます。

```sh
npm install @rdlabo/capacitor-native-ui @rdlabo/ionic-theme-ios27 @rdlabo/ionic-theme-md3 @erkamyaman/capacitor-foldable
```

テーマのプリセット、スタイルシート、必要な起動コード一式は[標準導入](setup.md)にまとめています。

## 個別のガイド

### 1. プラグインの Native UI を使う

対応する Ionic・HTML コントロールを iOS でネイティブ表示します。アプリの状態、ルーティング、ハンドラーはそのまま使います。

| アプリの構成 | ガイド |
| --- | --- |
| Ionic と標準の iOS 27 テーマ | [標準導入](setup.md) |
| Ionic と既存の Web テーマ | [既存テーマの設定](ionic-vertical-bars.md) |
| Ionic を使わない HTML | [HTML の設定](framework-independent.md) |

#### 投影の仕組み

元の Web コントロールの状態とハンドラーを維持し、ネイティブ表示します。[対応コントロールと投影の動作](native-ui.md)を参照してください。

### 2. Dynamic Color を使う

Android の端末配色を取得し、テーマへ適用します。単独利用、明暗設定、配色変換は [Dynamic Color ガイド](dynamic-colors.md)を参照してください。

### 3. 自分で Native UI を作って使う

[アプリ内拡張](native-ui-extensions.md)を使い、独自の SwiftUI または Android Compose コンテンツを表示します。この機能は実験的です。

## 要件

ネイティブ起動には Capacitor 8 と iOS または Android プロジェクトが必要です。Android 拡張には API 24 以上と Kotlin／Compose が必要です。通常のネイティブ描画には iOS 26 以上と Xcode 26 以上が必要です。Ionic アダプターが宣言する対応範囲は Ionic `>=8.8.1 <10` で、自動 E2E 検証は Ionic 9 を対象としています。HTML 向けの `/core` アダプターでは Ionic もテーマパッケージも不要です。[Vertical Bars](/docs/vertical-bars)と[拡張の配置](/docs/native-ui-extensions#content-and-placement-are-independent)には追加のデバイス要件があります。

標準コントロールでは、使用するマークアップ向けのセットアップガイドに従ってください。IonicとHTMLのアダプターはimportが異なります。独自のネイティブコンテンツでは、[拡張ガイド](/docs/native-ui-extensions)から始めてください。

## リファレンス

- [対応するIonicコントロール](/docs/native-ui#supported-markup)とフォールバックの動作。
- [設定](/docs/configuration)：既定値、対象コントロール、レール専用モード、実行中の変更。
- [ライト／ダーク表示](/docs/appearance)：Webテーマの継承、独自HTMLの設定、レールで共有される表示。
- [Vertical Bars](/docs/vertical-bars)：対象条件、表示、ランタイムAPI。
- [移行](/docs/migration)：パッケージ名、import、ネイティブプロジェクトの更新。

## 開発

```sh
npm ci
npm run build
npm test
npm run test:packages
```

DOM とレンダラーの共通実装は、ローカルの `packages/native-ui-core` ワークスペースで管理します。このリポジトリは Capacitor の登録とホストアダプターを担当します。`android/src/main/java/shared-core` は `npm run sync:core` によってローカルの Core ソースから生成されます。このコピーではなく Core を編集してください。SwiftPM と CocoaPods は `packages/native-ui-core/ios/Sources` の共有 Swift ソースを直接コンパイルします。Git ベースの SwiftPM 利用者には Node.js は不要です。アプリ内拡張向けの既存のネイティブモジュール名と Kotlin シンボル名は維持されます。

リポジトリルートは引き続き npm プラグインであり、`src`、`ios`、`android`、`package.json` が同じ場所にあります。TypeScript のユニットテストは `tests` にあり、Swift と Android のテストはプラグインとともに配置します。`examples/native-ui-html` は Ionic テーマを使わない利用例です。

ビルドは Capacitor プラグインの構成に従います。TypeScript が `src/index.ts` を `dist/esm` へコンパイルし、Rollup がブラウザーバンドル（`dist/plugin.js`）と CommonJS バンドル（`dist/plugin.cjs`）を生成します。このパッケージは `type: module` を使うため、`.cjs` 拡張子が必要です。公開 ESM サブパスは `dist/esm` の同じモジュールを共有します。TypeScript の変更を再ビルドするには `npm run watch`、Web の検証には `npm run verify:web` を実行します。

## Ionic テーマでテストする

Ionic の完全なデモ、スクリーンショットテスト、テーマの遷移テスト、シミュレーター連携フィクスチャは [ionic-theme-ios27](https://github.com/webview-native-ui/ionic-theme-ios27) に残っています。これらは、このプラグインを npm 依存関係としてインストールします。デモをここへ複製しないでください。

未公開の変更をテストするには、このリポジトリをビルドしてパッケージ化します：

```sh
npm run build
npm pack --ignore-scripts --pack-destination /tmp
```

移行済みのテーマのチェックアウトから、`npm run test:native-candidate -- /tmp/rdlabo-capacitor-native-ui-VERSION.tgz --e2e` を実行します。このコマンドは隔離したコピーを作成し、テーマとデモの両方にアーカイブをインストールして、パッケージ検証、連携ユニットテスト、本番ビルド、ブラウザーテストを実行します。既存のシミュレータースイートを実行するには `--simulator=UDID` を追加します。元のチェックアウトとロックファイルは維持され、一時コピーは診断用に残ります。

## リリース

プラグインのバージョンはテーマから独立しています。公開が承認されている場合、最新の main から `npm run release` を実行します。`vVERSION` タグのワークフローは、このプラグインだけを公開します（プレリリースは `next`、安定版は `latest`）。

両方の npm マニフェスト、`Package.swift`、podspec、Android Gradle の依存関係で Engine を同一の厳密なバージョンに固定し、ロックファイルも一緒に更新します。npm の可変範囲は、ネイティブ依存関係より新しい Engine を解決し、インストールを壊すおそれがあります。

初回リリースの前に、`webview-native-ui/capacitor-plugin`、ワークフロー `release.yml`、環境 `npm` に対する npm trusted publisher を設定します。必要に応じて、その GitHub 環境のレビュアーポリシーを設定してください。公開済みのバージョンは再公開できないため、このリポジトリからの初回リリースには新しいバージョンを選びます。

このリポジトリは `webview-native-ui/ionic-theme-ios27` のコミット `1831bde5` から分離されました。それ以前の履歴は元のリポジトリに残っています。

## 共有 Core の開発

Core は、このリポジトリの `packages/native-ui-core` にあります。リポジトリルートから `npm ci`、`npm run build`、`npm test` を実行します。Core を別途公開したり、チェックアウトしたりする必要はありません。ビルド時に Core の JavaScript と型宣言をプラグインのアーカイブへ組み込みます。Core は非公開ワークスペースであり、別途リリースされる npm 依存関係ではありません。

共有する TypeScript、Swift、Kotlin は `packages/native-ui-core` で編集します。`npm run sync:core` は Android のコピーを再生成し、`npm run check:core` は差分を検出します。共有レンダラーと DOM のテストは、ルートのテストコマンドで Capacitor アダプターのテストと一緒に実行します。ネイティブ Core のテストは、その `ios` と `android` ディレクトリ内に残ります。

Capacitor の移行は、このリポジトリルートから実行します。`package.json`、`Package.swift`、podspec、`android/` は標準の場所を維持します。SDK の移行後はネイティブビルドを検証してください。構成を維持しても、将来の移行ツールとの互換性が保証されるわけではありません。

### Swift Package の利用者

Xcode に `https://github.com/webview-native-ui/capacitor-plugin.git` を追加し、`NativeUICore` プロダクトを選ぶと、Capacitor アダプターをリンクせずに `import NativeUICore` を使えます。両プロダクトはリポジトリのリリースタグを共有します。SwiftPM はパッケージ依存関係の解決時に Capacitor を取得する場合があります。

Capacitor アプリは引き続き `RdlaboCapacitorNativeUi` プロダクトと `import NativeUIPlugin` を使います。このモジュールは Core を再エクスポートするため、既存の `NativeUI.register` 呼び出しもアダプターと同じ登録状態を使います。ルートマニフェストが両ターゲットを管理し、別の入れ子の Swift パッケージはありません。

CocoaPods は引き続きアダプターと共有ソースを既存のプラグイン pod へコンパイルします。この変更は、独立した Core pod の公開や Cordova アダプターの実装を行うものではありません。
