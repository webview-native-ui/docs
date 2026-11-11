---
title: iOS 26 テーマを設定する
---

# iOS 26 テーマを設定する

テーマをカスタマイズする場合は、個別のスタイルシートとアニメーションの export を利用できます。短い導入手順は[セットアップ](setup.md)を参照してください。

## スタイルを個別に読み込む

Ionic の基本スタイルを先に読み込み、Ionic パレットとテーマを次の順で読み込みます。この例はシステムのダーク設定に従います。

```css
@import '@ionic/core/css/palettes/dark.system.css';
@import '@rdlabo/ionic-theme-ios26/dist/css/default-variables.css';
@import '@rdlabo/ionic-theme-ios26/dist/css/ionic-theme-ios26.css';
@import '@rdlabo/ionic-theme-ios26/dist/css/md-remove-ios-class-effect.css';
@import '@rdlabo/ionic-theme-ios26/dist/css/ionic-theme-ios26-dark-system.css';
```

`md-remove-ios-class-effect.css` は、Material Design モードで iOS 固有のユーティリティクラスの影響を抑えます。アプリ独自の上書きはこれらの import の後に置きます。Android で inset グループリストを使う場合は、必要に応じて `@rdlabo/ionic-theme-ios26/dist/css/md-ion-list-inset.css` を追加します。MD3 にはこのリストスタイルが含まれています。

Ionic パレットと、同じ方針のテーマを1組選びます。

| 方針 | `@ionic/core/css/palettes/` の Ionic パレット | `dist/css/` のテーマ | まとめたスタイルシート |
| --- | --- | --- | --- |
| システム連動 | `dark.system.css` | `ionic-theme-ios26-dark-system.css` | `styles/system.css` |
| 手動 | `dark.class.css` | `ionic-theme-ios26-dark-class.css` | `styles/class.css` |
| 常時ダーク | `dark.always.css` | `ionic-theme-ios26-dark-always.css` | `styles/always.css` |

手動のダークモードでは、`document.documentElement` に `ion-palette-dark` を設定します。まとめた各スタイルシートには、対応する Ionic パレットと上記5つの import が含まれます。導入時は、対応する個別 import を置き換えてください。

## アニメーションを個別に設定する

Ionic の初期化前にアプリのモードを決め、そのモードに合うアニメーションを渡します。この例は、iOS 以外で Material Design モードを維持します。

```ts
import { isPlatform, type IonicConfig } from '@ionic/core';
import { iosTransitionAnimation, popoverEnterAnimation, popoverLeaveAnimation } from '@rdlabo/ionic-theme-ios26';

const mode = isPlatform('ios') ? 'ios' : 'md';
const ionicConfig: IonicConfig = {
  ...(mode === 'ios'
    ? { navAnimation: iosTransitionAnimation, popoverEnter: popoverEnterAnimation, popoverLeave: popoverLeaveAnimation }
    : {}),
  mode,
  // animated: false,
};
```

このオブジェクトへアプリ固有の Ionic オプションを追加し、既存のフレームワーク初期化へ `ionicConfig` を渡します。

| フレームワーク | 初期化 | import |
| --- | --- | --- |
| Angular / Ionic 9 | `provideIonicAngular(ionicConfig)` | `@ionic/angular` |
| Angular / Ionic 8 | `provideIonicAngular(ionicConfig)` | `@ionic/angular/standalone` |
| React | `setupIonicReact(ionicConfig)` | `@ionic/react` |
| Vue | `app.use(IonicVue, ionicConfig)` | `@ionic/vue` |

## テーマ設定とカスタマイズ

`ios26ThemeConfig` は、`mode: 'ios'`、iOS の画面遷移、popover アニメーションを含む型付き Ionic 設定です。Ionic のオプションへ展開した後、上書きを追加します。

```ts
import { ios26ThemeConfig } from '@rdlabo/ionic-theme-ios26';

const ionicConfig = {
  ...ios26ThemeConfig,
  // animated: false,
};
```

スプレッドの後のプロパティが優先されます。独自の `navAnimation`、`popoverEnter`、`popoverLeave` も同様です。明示した `undefined` も通常の JavaScript のオブジェクト展開と同じように既定値を上書きします。このオブジェクトはブラウザーのグローバル変数を参照しないため、サーバー描画するアプリでも import できます。

プラットフォームでモードを選ぶ場合は、実効モードが iOS のときだけ展開してください。`mode` だけを後から変えると、展開したアニメーションは残ります。Ionic の初期化前に、設定とモードを一緒に選びます。

```ts
import { isPlatform, type IonicConfig } from '@ionic/core';
import { ios26ThemeConfig } from '@rdlabo/ionic-theme-ios26';

const mode = isPlatform('ios') ? 'ios' : 'md';
const ionicConfig: IonicConfig = {
  ...(mode === 'ios' ? ios26ThemeConfig : {}),
  mode,
  // animated: false,
};
```

既存の手動設定の置換は[任意の簡略化](migration.md#optional-simplify-the-setup)を参照してください。

## 任意: iOS 26 と MD3 のテーマを併用する

同じアプリで両方の Ionic モードをスタイリングするには MD3 をインストールします。両テーマとも `@ionic/core` 8.8.1 以降が必要です。

```sh
npm install @rdlabo/ionic-theme-ios26 @rdlabo/ionic-theme-md3
```

グローバルスタイルシートに Sass を使う場合は、この順でテーマを読み込みます。例はクラスによるダークモードです。システム連動や常時ダークでは、Ionic パレットと iOS 26 の両方で対応する種類を選んでください。

```scss
@use '@ionic/core/css/palettes/dark.class.css';
@use '@rdlabo/ionic-theme-ios26/src/styles/default-variables.scss' as ios26-vars;
@use '@rdlabo/ionic-theme-ios26/src/styles/ionic-theme-ios26.scss';
@use '@rdlabo/ionic-theme-ios26/src/styles/ionic-theme-ios26-dark-class.scss';
@use '@rdlabo/ionic-theme-ios26/src/styles/md-remove-ios-class-effect.scss';
@use '@rdlabo/ionic-theme-md3/dist/css/default-variables.css' as md3-vars;
@use '@rdlabo/ionic-theme-md3/dist/css/ionic-theme-md3.css';
```

明示した `ios26-vars` と `md3-vars` の名前空間により、変数モジュールの既定の名前空間の衝突を防ぎます。inset リストスタイルは MD3 が提供します。Ionic の初期化前に、対応する画面遷移を設定します。

```ts
import { isPlatform, type IonicConfig } from '@ionic/core';
import { iosTransitionAnimation, popoverEnterAnimation, popoverLeaveAnimation } from '@rdlabo/ionic-theme-ios26';
import { mdTransitionAnimation } from '@rdlabo/ionic-theme-md3';

const mode = isPlatform('ios') ? 'ios' : 'md';
const ios = mode === 'ios';
const ionicConfig: IonicConfig = {
  navAnimation: ios ? iosTransitionAnimation : mdTransitionAnimation,
  popoverEnter: ios ? popoverEnterAnimation : undefined,
  popoverLeave: ios ? popoverLeaveAnimation : undefined,
  mode,
  // animated: false,
};
```

上の表に従い、このオブジェクトをフレームワークの初期化へ渡してください。
