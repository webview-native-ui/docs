---
title: テーマの設定
---

# テーマの設定

[セットアップ](setup.md)では、まとめた MD3 スタイルシートと `md3ThemeConfig` を使います。個別のスタイルシートとアニメーションを使って独自に構成することもできます。

## スタイルシートを個別に読み込む

Ionic の基本 CSS と選択したダークパレットの後に、次の import を置きます。

```css
@import '@rdlabo/ionic-theme-md3/dist/css/default-variables.css';
@import '@rdlabo/ionic-theme-md3/dist/css/ionic-theme-md3.css';
```

これら2ファイルをまとめたものが `styles/theme.css` です。まとめたスタイルシートと個別 import のどちらかを使い、アプリ独自の上書きはテーマの後に置いてください。

ダークパレットの選択は Ionic が担当します。アプリの外観方針に合わせ、`@ionic/core/css/palettes/` の `dark.system.css`、`dark.class.css`、`dark.always.css` を選びます。[Dynamic Colors](dynamic-colors.md) は `ion-palette-dark` を管理し、`dark.class.css` を使用します。

## アニメーションを直接設定する

既存の初期化で、Ionic の Material Design モードに MD3 の画面遷移を指定します。

```ts
import { isPlatform } from '@ionic/core';
import { mdTransitionAnimation } from '@rdlabo/ionic-theme-md3';

const ionicConfig = {
  navAnimation: isPlatform('ios') ? undefined : mdTransitionAnimation,
};
```

このオブジェクトを Angular の `provideIonicAngular(ionicConfig)`、React の `setupIonicReact(ionicConfig)`、Vue の `app.use(IonicVue, ionicConfig)` へ渡します。Angular では Ionic 9 の `provideIonicAngular` は `@ionic/angular`、Ionic 8 では `@ionic/angular/standalone` から import します。React の `setupIonicReact` は `@ionic/react`、Vue の `IonicVue` は `@ionic/vue` から import します。

両テーマ導入時のプラットフォーム別の画面遷移は[テーマの組み合わせ](#use-md3-and-ios-27-together)を参照してください。

## 既存のモード選択を維持する

`md3ThemeConfig` は `mode: 'md'` と MD3 の画面遷移を含みます。アプリが Material Design モードを選ぶ場合に、この設定を選択します。

```ts
import { isPlatform } from '@ionic/core';
import { md3ThemeConfig } from '@rdlabo/ionic-theme-md3';

const ionicConfig = {
  ...(isPlatform('ios') ? { mode: 'ios' as const } : md3ThemeConfig),
  // animated: false,
};
```

iOS 側では Ionic 標準の iOS 外観とアニメーションを使用します。スプレッドの後のオプションで選択した既定値を上書きできます。Ionic 標準の画面遷移を使うための `navAnimation: undefined` も含みます。変更前後の比較は[移行ガイド](migration.md#optional-simplify-the-setup)を参照してください。

## MD3 と iOS 27 を併用する

同じアプリで両方の Ionic モードをスタイリングするには、iOS 27 テーマをインストールします。

現在の両テーマには `@ionic/core` 8.8.1 以降が必要です。8.8.0 以前のアプリは、この設定を使う前に Ionic を更新してください。

```bash
npm install @rdlabo/ionic-theme-ios27
```

グローバルスタイルシートで Sass を使う場合は、次の順で初期化します。

```scss
@use '@rdlabo/ionic-theme-ios27/src/styles/default-variables.scss' as ios27-vars;
@use '@rdlabo/ionic-theme-ios27/src/styles/ionic-theme-ios27.scss';
@use '@rdlabo/ionic-theme-ios27/src/styles/ionic-theme-ios27-dark-class.scss';
@use '@rdlabo/ionic-theme-ios27/src/styles/md-remove-ios-class-effect.scss';
@use '@rdlabo/ionic-theme-md3/dist/css/default-variables.css' as md3-vars;
@use '@rdlabo/ionic-theme-md3/dist/css/ionic-theme-md3.css';
```

この例はクラスによるダークモードです。Angular の `@ionic/angular/css/palettes/dark.class.css` など、対応する Ionic パレットもグローバルスタイルシートへ読み込みます。`dark-system` や `dark-always` を使う場合は、Ionic パレットと iOS 27 テーマで同じ種類を選びます。[Ionic の Dark Mode](https://ionicframework.com/docs/theming/dark-mode)も参照してください。明示した `ios27-vars` と `md3-vars` によって変数モジュールの既定の名前空間の衝突を防ぎます。

両テーマの導入時は、両方の画面遷移を設定します。

```ts
import { isPlatform } from '@ionic/core';
import { iosTransitionAnimation, popoverEnterAnimation, popoverLeaveAnimation } from '@rdlabo/ionic-theme-ios27';
import { mdTransitionAnimation } from '@rdlabo/ionic-theme-md3';

const ios = isPlatform('ios');
const ionicConfig = {
  // アプリ固有のオプションをここへ追加します。
  navAnimation: ios ? iosTransitionAnimation : mdTransitionAnimation,
  popoverEnter: ios ? popoverEnterAnimation : undefined,
  popoverLeave: ios ? popoverLeaveAnimation : undefined,
};
```

[アニメーションの直接設定](#configure-animations-directly)で説明した import を使い、このオブジェクトを既存のフレームワーク初期化へ渡します。

export されたテーマ設定オブジェクトを使って、両モードを選ぶこともできます。

```ts
import { isPlatform } from '@ionic/core';
import { ios27ThemeConfig } from '@rdlabo/ionic-theme-ios27';
import { md3ThemeConfig } from '@rdlabo/ionic-theme-md3';

const ionicConfig = {
  ...(isPlatform('ios') ? ios27ThemeConfig : md3ThemeConfig),
  // animated: false,
};
```
