---
title: '移行'
code: []
scrollActiveLine: []
---

現在インストールしているバージョンより新しい節を、バージョンの昇順にすべて確認してください。例えば、1.x から 9.0.0 に更新する場合は、2.0.0 と 3.0.0 の移行手順を終えてから 9.0.0 の節を確認します。

任意のセットアップ節では、設定を簡略化するための導入手順を説明します。バージョン別の節には、更新時の変更点と互換性の注意事項を記載しています。

## 任意: セットアップを簡略化する

既存の個別 CSS パスとアニメーションのエクスポートは引き続き使用できます。設定を簡略化するときに、`ios26ThemeConfig` とまとめたテーマスタイルシートを導入できます。新しいアプリは[セットアップ](setup.md)を参照してください。

手動のテーマ import と Ionic ダークパレットの import を、現在のダークモード方針に合うスタイルシートへ置き換えます。システム連動ダークモードのアプリでは、Ionic の基本 CSS の後、アプリ独自の上書きの前で、次のように変更します。

```diff
- @import '@ionic/core/css/palettes/dark.system.css';
- @import '@rdlabo/ionic-theme-ios26/dist/css/default-variables.css';
- @import '@rdlabo/ionic-theme-ios26/dist/css/ionic-theme-ios26.css';
- @import '@rdlabo/ionic-theme-ios26/dist/css/md-remove-ios-class-effect.css';
- @import '@rdlabo/ionic-theme-ios26/dist/css/ionic-theme-ios26-dark-system.css';
+ @import '@rdlabo/ionic-theme-ios26/styles/system.css';
```

手動のダークモードには `styles/class.css` を使い、ドキュメントルートの `ion-palette-dark` の切替を維持します。常時ダークには `styles/always.css` を使います。対応する Ionic パレットも含まれます。`md-ion-list-inset.css` など、必要なスタイルを追加で読み込んでいる場合は、アプリの既存の要件に応じて維持してください。

手動で組み立てた設定を、テーマ設定のスプレッドに置き換えます。次の例は、具体的なアプリの設定である `animated: false` をテーマ設定の後に残します。

```diff
- import { iosTransitionAnimation, popoverEnterAnimation, popoverLeaveAnimation } from '@rdlabo/ionic-theme-ios26';
+ import { ios26ThemeConfig } from '@rdlabo/ionic-theme-ios26';

 const ionicConfig = {
-   mode: 'ios',
-   navAnimation: iosTransitionAnimation,
-   popoverEnter: popoverEnterAnimation,
-   popoverLeave: popoverLeaveAnimation,
+   ...ios26ThemeConfig,
   animated: false,
 };
```

アプリが既に使っている `provideIonicAngular`、`setupIonicReact`、`app.use(IonicVue, ...)` の呼び出しに、このオブジェクトを渡します。スプレッドの後のプロパティがテーマ設定より優先されます。独自のアニメーションや、明示した `undefined` も同様です。アプリ独自のオプションはスプレッドの後に維持してください。

設定には `mode: 'ios'` と iOS アニメーションが含まれます。プラットフォーム別のモード選択を維持するには、実効モードが iOS の場合だけテーマ設定を展開します。次の例では、アプリの既存のプラットフォーム判定を維持します。

```diff
 import { isPlatform, type IonicConfig } from '@ionic/core';
- import { iosTransitionAnimation, popoverEnterAnimation, popoverLeaveAnimation } from '@rdlabo/ionic-theme-ios26';
+ import { ios26ThemeConfig } from '@rdlabo/ionic-theme-ios26';

 const mode = isPlatform('ios') ? 'ios' : 'md';
 const ionicConfig: IonicConfig = {
-   ...(mode === 'ios'
-     ? { navAnimation: iosTransitionAnimation, popoverEnter: popoverEnterAnimation, popoverLeave: popoverLeaveAnimation }
-     : {}),
+   ...(mode === 'ios' ? ios26ThemeConfig : {}),
   mode,
 };
```

無条件で展開した後に `mode` を変更しても、テーマ設定のアニメーション関数は残ります。Ionic の初期化前に設定とモードを一緒に選んでください。まとめたテーマスタイルシートを選ぶときも、既存のダークモード方針を維持します。個別の CSS・アニメーション設定や複数テーマの組み合わせは、[設定ガイド](configuration.md)を参照してください。

## 9.2.0への移行

### バージョンに依存しないテーマ名

テーマの適用を除外するクラスとCSS変数を、OSのバージョンに依存しない名前に変更しました。iOS 27版と共通の名前を使い、今後の移行に備えられます。旧名はdeprecatedです。新しいコードでは新名を使い、既存のカスタマイズは都合のよいタイミングで移行してください。

| 非推奨の名前 | 新しい名前 |
| --- | --- |
| `ios26-disabled` | `ios-theme-disabled` |
| `--ios26-content-box-shadow-rgb` | `--ios-theme-content-box-shadow-rgb` |
| `--ios26-*`（その他のテーマ変数） | `--ios-theme-*`（同じ接尾辞） |

```diff
- <ion-button class="ios26-disabled">Standard Ionic button</ion-button>
+ <ion-button class="ios-theme-disabled">Standard Ionic button</ion-button>
```

```diff
ion-content {
-  --ios26-content-box-shadow-rgb: 255, 255, 255;
+  --ios-theme-content-box-shadow-rgb: 255, 255, 255;
}
```

`ios26-disabled` は互換名として引き続き利用できます。旧CSS変数もフォールバックとして利用でき、両方を指定した場合は新名が優先されます。パッケージ名とスタイルシートのパスは変わりません。

## 9.0.0への移行

テーマのメジャーバージョンをIonic Framework 9に合わせました。以前の移行項目以外に、新たな破壊的変更はありません。

Ionic 8とIonic 9の両方を引き続きサポートします。必要なバージョンは `@ionic/core >=8.8.1 <10` です。

## 3.0.0への移行

### `.header-item-group` を `.item-group-header` に変更する

section headerとして使う `ion-item-group` のclass名を、対象elementとの一貫性を保つため変更しました。アプリケーションのtemplateとstyleにある `.header-item-group` をすべて置き換えてください。

```diff
- <ion-item-group class="header-item-group">
+ <ion-item-group class="item-group-header">
    ...
  </ion-item-group>
```

旧classはthemeでstyleされなくなりました。この変更は、`@rdlabo/ionic-theme-md3` と共有するmarkupにも適用されます。

## 2.0.0への移行

### `iosTransitionAnimation` を設定する

version 2ではpackageのnavigation transitionが必要です。このtransitionは、Large Titleをback buttonのlabelへ動かしていた古い `animateBackButton()` の挙動を除き、Ionicのdefault iOS transitionに従います。

```ts
import { isPlatform } from '@ionic/core'; // or @ionic/angular/standalone, @ionic/react, @ionic/vue
import { iosTransitionAnimation } from '@rdlabo/ionic-theme-ios26';

// Angular
provideIonicAngular({
  // ...
  navAnimation: isPlatform('ios') ? iosTransitionAnimation : undefined,
});

// React
setupIonicReact({
  // ...
  navAnimation: isPlatform('ios') ? iosTransitionAnimation : undefined,
});

// Vue
createApp(App).use(IonicVue, {
  // ...
  navAnimation: isPlatform('ios') ? iosTransitionAnimation : undefined,
});
```

このtransitionを設定すると、旧animationによる不要なtransitionの副作用なしに `<ion-buttons><ion-back-button></ion-back-button></ion-buttons>` を利用できます。

## 1.0.0への移行

### SCSSのimport pathを更新する

JavaScript fileがpackageに追加された際、source fileは `src/styles` 以下へ移動しました。

```diff
- @import '@rdlabo/ionic-theme-ios26/src/default-variables.scss';
+ @import '@rdlabo/ionic-theme-ios26/src/styles/default-variables.scss';
```

`dist` 以下の生成済みCSS pathは変更されていません。

### `--ios26-color-background-rgb` の名前を変更する

```diff
  :root {
-   --ios26-color-background-rgb: 255, 255, 255;
+   --ios26-content-box-shadow-rgb: 255, 255, 255;
  }
```

### brightness変数の名前を変更する

各 `--ion-color-*-brightness-rgb` 変数を `--ion-color-*-brightness` に置き換え、RGB channel listではなくcolor valueを指定してください。

```diff
  :root {
-   --ion-color-primary-brightness-rgb: 130, 255, 255;
+   --ion-color-primary-brightness: #96feff;
  }
```
