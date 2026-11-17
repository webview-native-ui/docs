---
title: MD3 テーマをセットアップする
sourceRevision: '91bbdd037b94a24267e0e6b1d91a32cc2fff91a7894ae1b9bd0129c2594e2ccc'
---

既存のIonic 9 Angular・React・VueアプリへMaterial Design 3テーマを適用します。このページはテーマだけの導入手順です。Native UIの起動、Capacitorのネイティブプロジェクト、Foldableの設定は不要です。既存のルートとイベント処理を維持します。

## テーマをインストールする

アプリのディレクトリでパッケージをインストールします。

```sh
npm install @rdlabo/ionic-theme-md3
```

## テーマのスタイルシートを読み込む

グローバルスタイルシートでIonicの基本CSSと選択済みのIonicダークパレットを維持し、その後にMD3を読み込みます。例はシステム連動ダークモードです。別のパレットを設定済みなら、それを維持して二つ目を追加しません。MD3の個別スタイルのimportは、この一つのテーマimportへ置き換えます。

```css
@import '@ionic/core/css/palettes/dark.system.css';
@import '@rdlabo/ionic-theme-md3/styles/theme.css';
```

## Ionic を設定する

使っているフレームワークの例を一つ選びます。プリセットはブラウザーのプレビューを含め、テーマのモードとアニメーションを設定します。既存のアプリ固有オプションはスプレッドの後へ置いて維持します。プラットフォームでモードを選ぶアプリでは、その選択を維持し、対応するモードの場合だけこのプリセットを適用します。

### Angular

src/app/app.config.tsで、既存のIonic providerへプリセットを渡します。例はIonic providerの配置を示します。ルーターやHTTPなど、配列にあるほかのproviderは維持してください。

```ts:src/app/app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideIonicAngular } from '@ionic/angular';
import { md3ThemeConfig } from '@rdlabo/ionic-theme-md3';

export const appConfig: ApplicationConfig = {
  providers: [provideIonicAngular({ ...md3ThemeConfig })],
};
```

### React

src/main.tsxで、既存のsetupIonicReactを次の呼び出しへ置き換え、既存のReactルートを描画する前に実行します。ルートの描画、ルーティング、CSSのimportは維持します。

```ts:src/main.tsx
import { setupIonicReact } from '@ionic/react';
import { md3ThemeConfig } from '@rdlabo/ionic-theme-md3';

setupIonicReact({ ...md3ThemeConfig });
```

### Vue

src/main.tsで、既存アプリのIonicVue登録時にプリセットを渡し、mountより前に実行します。例は登録位置を示します。ルーター、ほかのプラグイン、既存のmount手順は維持してください。

```ts:src/main.ts
import { createApp } from 'vue';
import { IonicVue } from '@ionic/vue';
import { md3ThemeConfig } from '@rdlabo/ionic-theme-md3';
import App from './App.vue';

const app = createApp(App);
app.use(IonicVue, { ...md3ThemeConfig });
app.mount('#app');
```

## 画面をプレビューする

通常の開発サーバーを起動し、Ionicのボタンやリストがある既存ページを開きます。Material Design 3の外観、システムのライト・ダーク切替、既存ページ間の遷移を確認します。手動・常時ダークを選んだ場合はその方針を確認します。テーマが適用され、元の操作と画面遷移が動き、選択した外観方針に従えば導入完了です。この確認にネイティブビルドやレール対応端末は不要です。

個別のスタイルとアプリ独自の上書きは[設定ガイド](configuration.md)、既存の導入設定を更新する場合は[移行ガイド](migration.md)を使います。
