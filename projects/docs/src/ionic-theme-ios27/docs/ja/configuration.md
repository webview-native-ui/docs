---
title: iOS 27 テーマを設定する
---

# iOS 27 テーマを設定する

[セットアップ](setup.md)は、まとめたスタイルシートと `ios27ThemeConfig` を使用します。このガイドは、既定値、アプリの上書き、個別の CSS・アニメーション API を説明します。既存アプリは[任意の移行](migration.md#optional-simplify-the-setup)で設定を簡略化できます。

## ダークモード

スタイルシートを1つ選び、Ionic の基本 CSS の後にグローバルで読み込みます。対応する Ionic パレット、既定のテーマ変数、コンポーネント、Material Design 互換スタイル、ダーク設定が含まれます。

| 外観方針 | スタイルシート | 有効化 |
| --- | --- | --- |
| システム連動 | `@rdlabo/ionic-theme-ios27/styles/system.css` | システムの外観。 |
| 手動 | `@rdlabo/ionic-theme-ios27/styles/class.css` | ドキュメントルートの `ion-palette-dark`。 |
| 常時ダーク | `@rdlabo/ionic-theme-ios27/styles/always.css` | 常に有効。 |

クラスによる外観では、アプリが切替を管理します。

```ts
document.documentElement.classList.toggle('ion-palette-dark', dark);
```

同等の個別テーマ import と Ionic ダークパレットを、選択したスタイルシートに置き換え、重複読み込みを避けます。CSS 変数の上書きはスタイルシートの後に置きます。ネイティブコントロールは外観マーカーを継承します。[ネイティブ外観の継承](https://docs.rdlabo.dev/projects/capacitor-native-ui/docs/appearance)も参照してください。

## スタイルシートを個別に組み合わせる

個別の import も引き続き使用できます。システム連動ダークモードでは、Ionic の基本 CSS の後に次の順で読み込みます。

```css
@import '@ionic/core/css/palettes/dark.system.css';
@import '@rdlabo/ionic-theme-ios27/dist/css/default-variables.css';
@import '@rdlabo/ionic-theme-ios27/dist/css/ionic-theme-ios27.css';
@import '@rdlabo/ionic-theme-ios27/dist/css/md-remove-ios-class-effect.css';
@import '@rdlabo/ionic-theme-ios27/dist/css/ionic-theme-ios27-dark-system.css';
```

Ionic パレットとテーマのダーク設定は同じ方針で組み合わせます。

| 方針 | `@ionic/core/css/palettes/` の Ionic パレット | `@rdlabo/ionic-theme-ios27/dist/css/` のテーマ |
| --- | --- | --- |
| システム連動 | `dark.system.css` | `ionic-theme-ios27-dark-system.css` |
| 手動 | `dark.class.css` | `ionic-theme-ios27-dark-class.css` |
| 常時ダーク | `dark.always.css` | `ionic-theme-ios27-dark-always.css` |

互換スタイルは、iOS 固有のユーティリティクラスが Material Design のコンポーネントへ影響するのを防ぎます。条件付き iOS 26/27 や MD3 の併用には[適応テーマ](adaptive-themes.md)を使います。

## 設定の既定値と上書き

`ios27ThemeConfig` は、`mode: 'ios'`、`iosTransitionAnimation`、`popoverEnterAnimation`、`popoverLeaveAnimation` を含む型付き Ionic 設定です。描画前に設定へ展開します。スプレッドの後のプロパティは、明示した `undefined` も含めて既定値を上書きします。

```ts
import { ios27ThemeConfig } from '@rdlabo/ionic-theme-ios27';

const ionicConfig = {
  ...ios27ThemeConfig,
  animated: false, // アプリの設定を Ionic の既定値より優先します。
  popoverEnter: undefined, // Ionic 標準の popover 表示アニメーションを使用します。
};
```

スプレッドの後にアプリ独自のアニメーションを `navAnimation` として指定できます。共有オブジェクト自体を変更せず新しい設定オブジェクトを作り、ほかの利用箇所で既定値を維持してください。

既存の Ionic 初期化へ渡します。フレームワークに応じて `provideIonicAngular`、`setupIonicReact`、`app.use(IonicVue, ionicConfig)` を使います。import は[セットアップ](setup.md#3-pass-theme-configuration-to-ionic)を参照してください。

### プラットフォーム別のモード選択を維持する

設定には iOS モードと iOS アニメーションが含まれます。プラットフォームで外観を選ぶアプリは、Ionic 初期化前に設定全体を選びます。この例は iOS で iOS 27 テーマを使い、ほかでは Ionic 標準の Material Design を使います。

```ts
import { isPlatform } from '@ionic/core';
import { ios27ThemeConfig } from '@rdlabo/ionic-theme-ios27';

const ionicConfig = {
  ...(isPlatform('ios') ? ios27ThemeConfig : { mode: 'md' as const }),
  animated: false, // Optional application setting, applied on both platforms.
};
```

独自のモード選択方針がある場合はそれを維持します。スプレッドの後に `mode` だけを変更すると iOS アニメーションは残るため、モードとアニメーションの両方を変える場合は設定全体を選んでください。ブラウザー機能や複数テーマによる選択には[適応設定](adaptive-themes.md)を引き続き使えます。

## アニメーションを個別に接続する

個別のアニメーション export も使用できます。

```ts
import { iosTransitionAnimation, popoverEnterAnimation, popoverLeaveAnimation } from '@rdlabo/ionic-theme-ios27';

const ionicConfig = {
  mode: 'ios' as const,
  navAnimation: iosTransitionAnimation,
  popoverEnter: popoverEnterAnimation,
  popoverLeave: popoverLeaveAnimation,
  // animated: false,
};
```

テーマの画面遷移は、有効な Native UI と既に連携します。独自の画面遷移には[画面遷移アダプターの手順](https://docs.rdlabo.dev/projects/capacitor-native-ui/docs/migration#native-ui-transition-adapter)を使用できます。追加のタブ・segment・検索の効果は[アニメーション](animation.md)を参照してください。
