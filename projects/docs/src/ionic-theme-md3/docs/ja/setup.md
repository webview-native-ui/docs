---
title: MD3 テーマをセットアップする
---

# MD3 テーマをセットアップする

Ionic `>=8.8.0 <10` を使う既存の Ionic Angular・React・Vue アプリを使用します。

## テーマをインストールする

```sh
npm install @rdlabo/ionic-theme-md3
```

## テーマのスタイルシートを読み込む

Ionic の基本 CSS と選択したダークパレットの後に、グローバルスタイルシートへ次の import を追加します。

```css
@import '@rdlabo/ionic-theme-md3/styles/theme.css';
```

このスタイルシートは、既定の変数と MD3 コンポーネントスタイルをまとめたものです。既存アプリへ導入する場合は、MD3 の個別スタイルシート import を置き換えます。`@ionic/core/css/palettes/dark.system.css` など、選択済みの Ionic ダークパレットは維持し、アプリ独自の上書きをテーマの後に置きます。MD3 はすべての外観で同じスタイルシートを使用します。[Dynamic Colors](dynamic-colors.md) では Ionic の `dark.class.css` を選んでください。

## Ionic を設定する

コンポーネントを描画する前に、アプリで既に使っている Ionic 初期化のオプションへ `md3ThemeConfig` を展開します。使用するフレームワークの例を選んでください。

### Angular

```ts
import { provideIonicAngular } from '@ionic/angular'; // Ionic 9
// Ionic 8: import { provideIonicAngular } from '@ionic/angular/standalone';
import { md3ThemeConfig } from '@rdlabo/ionic-theme-md3';

provideIonicAngular({
  ...md3ThemeConfig,
  // animated: false,
});
```

### React

```ts
import { setupIonicReact } from '@ionic/react';
import { md3ThemeConfig } from '@rdlabo/ionic-theme-md3';

setupIonicReact({
  ...md3ThemeConfig,
  // animated: false,
});
```

### Vue

```ts
import { IonicVue } from '@ionic/vue';
import { md3ThemeConfig } from '@rdlabo/ionic-theme-md3';

app.use(IonicVue, {
  ...md3ThemeConfig,
  // animated: false,
});
```

設定には `mode: 'md'` と MD3 の画面遷移が含まれます。既定値を上書きするアプリ固有のオプションは、スプレッドの後に置きます。プラットフォーム別の外観では、[設定ガイド](configuration.md#preserve-existing-mode-selection)のようにモードに対応する設定を選んでください。この設定オブジェクトはサーバー描画時にも import できます。

## 画面をプレビューする

通常の開発サーバーを起動します。フレームワークのコンポーネント構文に合わせ、次のマークアップを含むページを開きます。

```html
<ion-list inset="true">
  <ion-item-group>
    <ion-item><ion-label>Notifications</ion-label></ion-item>
    <ion-item><ion-label>Appearance</ion-label></ion-item>
  </ion-item-group>
</ion-list>
```

グループリスト、ページ遷移、選択した Ionic ダークパレットによる外観切替を確認します。想定するグループ構造は[リストの構造](using-ion-item-group.md)、個別のスタイルシートやアニメーション、既存のプラットフォーム別モード選択は[設定ガイド](configuration.md)を参照してください。
