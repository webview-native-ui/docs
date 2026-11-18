---
title: iOS 27 テーマをセットアップする
sourceRevision: '6e176dd4cad5bda623d1cbefafc9395dd6d76e0dda737324a9ba8afcc0809375'
headingAliases:
  '%E6%AC%A1%E3%81%AE%E6%89%8B%E9%A0%86': '%E5%BF%85%E8%A6%81%E3%81%AB%E5%BF%9C%E3%81%98%E3%81%A6%E8%BF%BD%E5%8A%A0%E3%81%99%E3%82%8B'
  '1.-%E3%83%86%E3%83%BC%E3%83%9E%E3%81%A8-foldable-%E3%82%92%E3%82%A4%E3%83%B3%E3%82%B9%E3%83%88%E3%83%BC%E3%83%AB%E3%81%99%E3%82%8B': '1.-%E3%83%86%E3%83%BC%E3%83%9E%E3%82%92%E3%82%A4%E3%83%B3%E3%82%B9%E3%83%88%E3%83%BC%E3%83%AB%E3%81%99%E3%82%8B'
---

iOS 27テーマは、Angular・React・VueのIonic 9アプリで使用できます。テーマのスタイルと初期化設定を追加すると、既存の画面とルーターを使ってブラウザーで表示と画面遷移を確認できます。

以下の例は、dark.system.cssでOSの明暗に追従する構成です。クラスで切り替えるアプリや常時ダークのアプリでは、現在の方式を維持してください。スタイルはアプリが読み込むグローバルスタイルシート（Angularでは通常src/global.scss）に追加します。

## 始める前に

Ionicの基本CSSは維持します。下から使っているフレームワークの例を一つ選び、既存のテーマ初期化を置き換えてください。Ionicを二重に初期化しません。

## 1. テーマをインストールする

アプリのディレクトリでパッケージをインストールします。

```sh
npm install @rdlabo/ionic-theme-ios27
```

## 2. スタイルシートを1つ読み込む

Ionicの基本CSSの後で、既存テーマとダークパレットのimportを次のスタイルシートへ置き換えます。OSに連動した明暗切り替えと互換スタイルが含まれます。

```diff:src/global.css
@@
 @import '@ionic/core/css/core.css';
 @import '@ionic/core/css/structure.css';
- @import '@ionic/core/css/palettes/dark.system.css';
+ @import '@rdlabo/ionic-theme-ios27/styles/system.css';

 :root { --app-content-width: 72rem; }
```

クラスで明暗を切り替える場合はstyles/class.css、常時ダークならstyles/always.cssを使います。

## 3. テーマ設定を Ionic へ渡す

使っているフレームワークの例に沿って、Ionicへプリセットを渡します。

テーマ設定のプリセットは、Ionicへ渡す設定オブジェクトです。テーマに合うモードと画面遷移のアニメーションをまとめて指定できます。アプリ固有のオプションはプリセットを展開した後に置きます。モードをプラットフォーム別に選んでいる場合は、該当するモードにだけ適用してください。

### Angular

src/app/app.config.tsのprovideIonicAngularへプリセットを渡します。ほかのproviderは残します。

```diff:src/app/app.config.ts
@@
 import { ApplicationConfig } from '@angular/core';
 import { provideIonicAngular } from '@ionic/angular';
+ import { ios27ThemeConfig } from '@rdlabo/ionic-theme-ios27';
 import { provideRouter } from '@angular/router';
 import { routes } from './app.routes';

 export const appConfig: ApplicationConfig = {
   providers: [
     provideRouter(routes),
-     provideIonicAngular(),
+     provideIonicAngular({ ...ios27ThemeConfig }),
     provideHttpClient(),
   ],
 };
```

### React

src/main.tsxで、Reactの描画前にsetupIonicReactへプリセットを渡します。

```diff:src/main.tsx
@@
 import { setupIonicReact } from '@ionic/react';
+ import { ios27ThemeConfig } from '@rdlabo/ionic-theme-ios27';
 import { createRoot } from 'react-dom/client';
 import App from './App';
 import './global.css';

- setupIonicReact();
+ setupIonicReact({ ...ios27ThemeConfig });

 createRoot(document.getElementById('root')!).render(<App />);
```

### Vue

src/main.tsで、mount前にIonicVueへプリセットを渡します。

```diff:src/main.ts
@@
 import { createApp } from 'vue';
 import { IonicVue } from '@ionic/vue';
+ import { ios27ThemeConfig } from '@rdlabo/ionic-theme-ios27';
 import App from './App.vue';
 import router from './router';
@@

 const app = createApp(App);
- app.use(IonicVue);
+ app.use(IonicVue, { ...ios27ThemeConfig });
 app.use(router);
 router.isReady().then(() => app.mount('#app'));
```

## 4. 最初の画面をプレビューする

開発サーバーを起動し、ボタンやリストのある既存ページを開きます。iOS 27の見た目、設定した明暗の動作、ボタン操作と画面遷移を確認できれば導入完了です。

## 必要に応じて追加する

端末に応じた配置は[レイアウト連携](vertical-bars-layout.md#read-the-device-layout)、ネイティブコントロールは[Native UIの導入](add-native-ui.md)で追加できます。

スタイルの調整は[設定ガイド](configuration.md)、既存設定の更新は[移行ガイド](migration.md)を参照してください。
