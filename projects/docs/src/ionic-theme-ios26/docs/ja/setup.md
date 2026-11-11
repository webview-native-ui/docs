---
title: iOS 26 テーマをセットアップする
---

# iOS 26 テーマをセットアップする

`@ionic/core >=8.8.1 <10` を使う既存の Ionic Angular・React・Vue アプリを使用します。

## 1. インストールする

```sh
npm install @rdlabo/ionic-theme-ios26
```

## 2. スタイルシートを1つ読み込む

Ionic の基本スタイルの後に、グローバルスタイルシートへ次の import を追加します。

```css
@import '@rdlabo/ionic-theme-ios26/styles/system.css';
```

このスタイルシートには、テーマ変数、コンポーネント、Material Design 互換スタイル、Ionic のシステム連動ダークパレット、対応するテーマのダークスタイルが含まれます。手動のダークモードではドキュメントルートの `ion-palette-dark` クラスと `styles/class.css` を使い、常時ダークには `styles/always.css` を使います。アプリの外観方針に合うものを選び、既存のテーマと Ionic ダークパレットの対応する import を置き換えてください。

## 3. Ionic を設定する

描画前に、既存のフレームワーク初期化へ `ios26ThemeConfig` を展開します。使用するフレームワークの例を選んでください。

Ionic 9 の Angular では `provideIonicAngular` を `@ionic/angular` から import します。Ionic 8 では `@ionic/angular/standalone` を使用します。

```ts
import { provideIonicAngular } from '@ionic/angular';
import { ios26ThemeConfig } from '@rdlabo/ionic-theme-ios26';

// アプリで既に使っている providers 配列内
provideIonicAngular({
  ...ios26ThemeConfig,
  // animated: false,
});
```

React の場合:

```ts
import { setupIonicReact } from '@ionic/react';
import { ios26ThemeConfig } from '@rdlabo/ionic-theme-ios26';

setupIonicReact({
  ...ios26ThemeConfig,
  // animated: false,
});
```

Vue ではアプリの既存の Vue app を使用します。

```ts
import { IonicVue } from '@ionic/vue';
import { ios26ThemeConfig } from '@rdlabo/ionic-theme-ios26';

app.use(IonicVue, {
  ...ios26ThemeConfig,
  // animated: false,
});
```

設定は `mode: 'ios'` を指定するため、デスクトップのプレビューでもテーマを確認できます。既定値を上書きする Ionic オプションは、スプレッドの後に追加します。プラットフォームでモードを選ぶアプリでは、iOS モードの場合だけ設定を展開してください。[設定ガイド](configuration.md#theme-configuration-and-customization)に例があります。

## 4. プレビューする

通常の開発サーバーを起動して既存ページを開きます。フレームワークのコンポーネント構文に合わせ、`ion-content` 内へ次のマークアップを追加します。

```html
<ion-list inset="true">
  <ion-item-group>
    <ion-item><ion-label>Notifications</ion-label></ion-item>
    <ion-item><ion-label>Appearance</ion-label></ion-item>
  </ion-item-group>
</ion-list>
```

角丸の inset グループ、ページ遷移、選択したダークモード方針を確認します。リスト構造は [ion-item-group の使い方](using-ion-item-group.md)、個別の CSS・アニメーション設定は[設定ガイド](configuration.md)を参照してください。[移行ガイド](migration.md)には、既存アプリでまとめた設定を導入する方法とバージョン別の更新手順があります。
