---
title: Ionic Theme Material Design 3
---

# Ionic Theme Material Design 3

Android Settings を視覚的な基準とし、Ionic のコンポーネント API と色の意味を維持する CSS・JavaScript テーマです。

<!-- rdlabo-docs-pick -->

![Android 17 で Ionic 標準パレットを使った MD3 テーマ](https://raw.githubusercontent.com/webview-native-ui/ionic-theme-md3/v9.2.1/screenshots/md3.png)

<!-- /rdlabo-docs-pick -->

[デモ](https://ionic-theme-md3.rdlabo.dev/)を確認できます。

`@rdlabo/ionic-theme-ios27` と互換性のある設計により、同じマークアップで両 Ionic モードをスタイリングできます。

## インストール

[セットアップ](/docs/setup)に従って導入し、`@rdlabo/ionic-theme-md3/styles/theme.css` を読み込み、既存の Ionic 初期化オプションへ `md3ThemeConfig` を展開します。Ionic `>=8.8.0 <10` に対応します。古い Ionic には `@rdlabo/ionic-theme-md3@1.0.2` を使用できます。

既存アプリは[任意の設定簡略化](/docs/migration#optional-simplify-the-setup)、個別の CSS とアニメーションは[設定](/docs/configuration)を参照してください。

### Android Settings の外観

Ionic の色の意味とアプリのフォント上書きを維持します。標準 toggle はアイコンを持ちません。MD の既定フォントには、利用可能なら端末内の Google Sans Flex を使い、標準フォールバックも指定します。フォント設定は CSS に含まれるため、初期化コードや Capacitor プラグインは不要です。戻るアイコンは Ionic が管理します。

導入、フォント、コンポーネントの上書きは [Android Settings の外観](/docs/android-settings)を参照してください。既存ユーザーは toolbar・list・toggle の寸法変更を [9.2.0 の移行手順](/docs/migration#migrating-to-920-android-settings-alignment)で確認してください。

### 任意: MD3 と iOS 27 を併用する

CSS の順序とプラットフォーム別のアニメーション選択は[テーマの組み合わせ](/docs/configuration#use-md3-and-ios-27-together)を参照してください。

## ドキュメント

- [セットアップ](/docs/setup): まとめた CSS と設定オブジェクトによる導入。
- [設定](/docs/configuration): 個別 CSS、アニメーション、既存のモード選択。
- [Android の Dynamic Colors](/docs/dynamic-colors): Material You の導入、外観、ライフサイクル、ロール対応。
- [カラーシステム](/docs/color-system): Ionic パレットの既定値、Material ロール、コンポーネントの色。
- [Android Settings の外観](/docs/android-settings): 標準寸法、フォント、Ionic のカスタマイズ。
- [ion-item-group](https://docs.rdlabo.dev/projects/ionic-theme-md3/docs/using-ion-item-group): iOS 27 と共有する inset リスト構造。
- [特殊なマークアップ](https://docs.rdlabo.dev/projects/ionic-theme-md3/docs/special-markup): デモで使う明示的な組み合わせ。
- [ESLint](https://docs.rdlabo.dev/projects/ionic-theme-md3/docs/eslint): リスト構造の検査。
- [移行](/docs/migration): 任意の設定簡略化とバージョン別の手順。

## 関連プロジェクト

より包括的な Material Design 3 の実装を探している場合は、次のプロジェクトも参考になります。

- danielkleebinder による **[md3-for-ionic](https://github.com/danielkleebinder/md3-for-ionic)**

> このテーマは Ionic の設計と `@rdlabo/ionic-theme-ios27` との互換性を目的としており、MD3 全体を厳密に再現するものではありません。
