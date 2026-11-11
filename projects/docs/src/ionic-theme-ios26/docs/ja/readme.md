---
title: Ionic Theme iOS26
---

# Ionic Theme iOS26

Ionic アプリに iOS26 のデザインを適用する CSS・JavaScript テーマです。

<!-- rdlabo-docs-pick -->

![Liquid Glass のタブバー、リスト、コントロールを使う iOS 26 テーマ](https://raw.githubusercontent.com/webview-native-ui/ionic-theme-ios27/ios26-v9.4.3/screenshots/ios26.png)

<!-- /rdlabo-docs-pick -->

[デモ](https://ionic-theme-ios26.rdlabo.dev/)を確認できます。

## インストール

```sh
npm install @rdlabo/ionic-theme-ios26
```

Ionic の基本 CSS の後に、システム連動ダーク用のスタイルシートをグローバルに追加します。

```css
@import '@rdlabo/ionic-theme-ios26/styles/system.css';
```

既存の Ionic 初期化のオプションへ `ios26ThemeConfig` を展開します。iOS モードとテーマのアニメーションが設定されます。

```ts
import { ios26ThemeConfig } from '@rdlabo/ionic-theme-ios26';

const ionicConfig = {
  ...ios26ThemeConfig,
  // animated: false,
};
```

Angular・React・Vue、ダークモードの選択、プレビューは[セットアップ](/docs/setup)を参照してください。個別の CSS、アニメーション、独自オプション、MD3 との併用は[設定](/docs/configuration)、既存アプリへの導入は[移行](/docs/migration)を参照します。

## ドキュメント

- [ion-item-group](https://docs.rdlabo.dev/projects/ionic-theme-ios26/docs/using-ion-item-group): inset リストに必要な構造。
- [特殊なマークアップとクラス](https://docs.rdlabo.dev/projects/ionic-theme-ios26/docs/special-markup): 明示的に使う構造とユーティリティ。
- [ESLint](https://docs.rdlabo.dev/projects/ionic-theme-ios26/docs/eslint): リスト構造の検査。
- [機能](https://docs.rdlabo.dev/projects/ionic-theme-ios26/docs/features): CSS 変数、Liquid Glass、個別読み込み、ダークモード。
- [Experimental Animation](https://docs.rdlabo.dev/projects/ionic-theme-ios26/docs/experimental-animation): タブバーと検索の効果。
- [iOS 18](https://docs.rdlabo.dev/projects/ionic-theme-ios26/docs/ios-18): iOS 26 だけでテーマを読み込む設定。
- [移行](/docs/migration): 任意の設定簡略化とバージョン別の更新手順。
