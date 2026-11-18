---
title: Ionic Theme Material Design 3
---

# Ionic Theme Material Design 3

iOSテーマと同じマークアップで、IonicコンポーネントにMaterial Design 3の外観を適用します。

[セットアップ](setup.md) · [ブラウザーで試す](https://ionic-theme-md3.rdlabo.dev/)

セットアップ例はIonic 9向けです。Ionic 8のAngularアプリでは、`provideIonicAngular` を `@ionic/angular/standalone` からインポートします。

<!-- rdlabo-docs-pick -->

![Android 17 で Ionic 標準パレットを使った MD3 テーマ](https://raw.githubusercontent.com/webview-native-ui/ionic-theme-md3/v9.3.0/screenshots/md3.png)

<!-- /rdlabo-docs-pick -->

## インストール

[セットアップ](/docs/setup)に従って導入し、`@rdlabo/ionic-theme-md3/styles/theme.css` を読み込み、既存の Ionic 初期化オプションへ `md3ThemeConfig` を展開します。Ionic `>=8.8.0 <10` に対応します。古い Ionic には `@rdlabo/ionic-theme-md3@1.0.2` を使用できます。

既存アプリは[任意の設定簡略化](/docs/migration#optional-simplify-the-setup)、個別の CSS とアニメーションは[設定](/docs/configuration)を参照してください。

<a id="android-settings-%E3%81%AE%E5%A4%96%E8%A6%B3"></a><a id="%E4%BB%BB%E6%84%8F%3A-md3-%E3%81%A8-ios-27-%E3%82%92%E4%BD%B5%E7%94%A8%E3%81%99%E3%82%8B"></a><a id="android-settings-appearance"></a>
<a id="optional%3A-use-the-md3-and-ios-27-themes-together"></a>
<a id="optional-use-the-md3-and-ios-27-themes-together"></a>

## ドキュメント

- [MD3とiOS 27を併用する](configuration.md#use-md3-and-ios-27-together)
- [設定](/docs/configuration): 個別 CSS、アニメーション、既存のモード選択。
- [Android Dynamic Color](/docs/dynamic-colors): Material You の導入、外観、ライフサイクル、ロール対応。
- [カラーシステム](/docs/color-system): Ionic パレットの既定値、Material ロール、コンポーネントの色。
- [Android Settings の外観](/docs/android-settings): 標準寸法、フォント、Ionic のカスタマイズ。
- [ion-item-group](https://webview-native-ui.com/projects/ionic-theme-md3/docs/using-ion-item-group): iOS 27 と共有する inset リスト構造。
- [特殊なマークアップ](https://webview-native-ui.com/projects/ionic-theme-md3/docs/special-markup): デモで使う明示的な組み合わせ。
- [ESLint](https://webview-native-ui.com/projects/ionic-theme-md3/docs/eslint): リスト構造の検査。
- [移行](/docs/migration): 任意の設定簡略化とバージョン別の手順。

## 関連プロジェクト

より包括的な Material Design 3 の実装を探している場合は、次のプロジェクトも参考になります。

- danielkleebinder による **[md3-for-ionic](https://github.com/danielkleebinder/md3-for-ionic)**

> このテーマは Ionic の設計と `@rdlabo/ionic-theme-ios27` との互換性を目的としており、MD3 全体を厳密に再現するものではありません。
