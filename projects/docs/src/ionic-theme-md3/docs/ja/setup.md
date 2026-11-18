---
title: MD3 テーマをセットアップする
sourceRevision: '4bb3ca73de2c3058aaaad70af3a9155293f579b4b9675405076d8a4708cc1d6d'
---

Material Design 3テーマは、Angular・React・VueのIonic 9アプリで使用できます。テーマのスタイルと初期化設定を追加すると、既存の画面とルーターを使ってブラウザーで表示と画面遷移を確認できます。

以下の例は、dark.system.cssでOSの明暗に追従する構成です。クラスで切り替えるアプリや常時ダークのアプリでは、現在の方式を維持してください。スタイルはアプリが読み込むグローバルスタイルシート（Angularでは通常src/global.scss）に追加します。

## テーマをインストールする

アプリのディレクトリでパッケージをインストールします。

```sh
npm install @rdlabo/ionic-theme-md3
```

## テーマのスタイルシートを読み込む

Ionicの基本CSSと現在のダークパレットの後に、MD3テーマを読み込みます。個別のMD3スタイルを使っている場合は、このimportへまとめます。

```diff:src/global.css
@@
 @import '@ionic/core/css/structure.css';
 @import '@ionic/core/css/palettes/dark.system.css';
+ @import '@rdlabo/ionic-theme-md3/styles/theme.css';

 :root { --app-content-width: 72rem; }
```

## Ionic を設定する

使っているフレームワークの例に沿って、Ionicへプリセットを渡します。

テーマ設定のプリセットは、Ionicへ渡す設定オブジェクトです。テーマに合うモードと画面遷移のアニメーションをまとめて指定できます。アプリ固有のオプションはプリセットを展開した後に置きます。モードをプラットフォーム別に選んでいる場合は、該当するモードにだけ適用してください。

### Angular

src/app/app.config.tsのprovideIonicAngularへプリセットを渡します。ほかのproviderは残します。

```diff:src/app/app.config.ts
@@
 import { ApplicationConfig } from '@angular/core';
 import { provideIonicAngular } from '@ionic/angular';
+ import { md3ThemeConfig } from '@rdlabo/ionic-theme-md3';
 import { provideRouter } from '@angular/router';
 import { routes } from './app.routes';

 export const appConfig: ApplicationConfig = {
   providers: [
     provideRouter(routes),
-     provideIonicAngular(),
+     provideIonicAngular({ ...md3ThemeConfig }),
     provideHttpClient(),
   ],
 };
```

### React

src/main.tsxで、Reactの描画前にsetupIonicReactへプリセットを渡します。

```diff:src/main.tsx
@@
 import { setupIonicReact } from '@ionic/react';
+ import { md3ThemeConfig } from '@rdlabo/ionic-theme-md3';
 import { createRoot } from 'react-dom/client';
 import App from './App';
 import './global.css';

- setupIonicReact();
+ setupIonicReact({ ...md3ThemeConfig });

 createRoot(document.getElementById('root')!).render(<App />);
```

### Vue

src/main.tsで、mount前にIonicVueへプリセットを渡します。

```diff:src/main.ts
@@
 import { createApp } from 'vue';
 import { IonicVue } from '@ionic/vue';
+ import { md3ThemeConfig } from '@rdlabo/ionic-theme-md3';
 import App from './App.vue';
 import router from './router';
@@

 const app = createApp(App);
- app.use(IonicVue);
+ app.use(IonicVue, { ...md3ThemeConfig });
 app.use(router);
 router.isReady().then(() => app.mount('#app'));
```

## 画面をプレビューする

開発サーバーを起動し、ボタンやリストのある既存ページを開きます。Material Design 3の見た目、設定した明暗の動作、ボタン操作と画面遷移を確認できれば導入完了です。

スタイルの調整は[設定ガイド](configuration.md)、既存設定の更新は[移行ガイド](migration.md)を参照してください。
