---
title: iOS 26 テーマをセットアップする
sourceRevision: '5a0170e657821e3a2014ce51612a5dd29e2b6b543f2cb3bfbe401f003a830056'
---

既存のIonic 9 Angular・React・VueアプリへiOS 26テーマを適用します。このページはテーマだけの導入手順です。Native UIの起動、Capacitorのネイティブプロジェクト、Foldableの設定は不要です。既存のルートとイベント処理を維持します。


差分はIonicの初期化が引数なしの既存アプリを例にしています。省略されたルーター・provider・描画処理は残します。アプリ固有の設定を渡している場合は、その前にプリセットを展開して既存の上書きを保ってください。差分のsrc/global.cssは既存のグローバルスタイル（Angularのsrc/global.scssなど）を指す例名で、別ファイルを新規作成する意味ではありません。


スタイルの差分はdark.system.cssから始め、OSの明暗に従う方針を維持します。すでにクラス制御や常時ダークを使うアプリは、その方針に合うプリセットを選び、Systemへ変更しないでください。

## 1. インストールする

npmが成功した時点ではパッケージだけが導入済みで、スタイルと初期化の設定は未完了です。

アプリのディレクトリでパッケージをインストールします。

```sh
npm install @rdlabo/ionic-theme-ios26
```

## 2. スタイルシートを1つ読み込む

この差分の適用後はスタイルを読込済みになり、Ionic初期化の設定はまだ残ります。

グローバルスタイルシートで、既存テーマと対応するIonicダークパレットのimportを、Ionicの基本CSSの後に置く次のimportへ置き換えます。システム連動ダークモードと互換スタイルが含まれます。Sassの設定は不要です。

```diff:src/global.css
@@
 @import '@ionic/core/css/core.css';
 @import '@ionic/core/css/structure.css';
- @import '@ionic/core/css/palettes/dark.system.css';
+ @import '@rdlabo/ionic-theme-ios26/styles/system.css';

 :root { --app-content-width: 72rem; }
```

手動ダークモードではstyles/class.cssを選び、既存のion-palette-darkクラス操作を維持します。常時ダークではstyles/always.cssを選びます。読み込むプリセットは一つです。

## 3. Ionic を設定する

自分のフレームワークの差分だけを適用します。ここまででスタイルと初期化が設定済みになり、最後にブラウザーで確認します。

使っているフレームワークの例を一つ選びます。プリセットはブラウザーのプレビューを含め、テーマのモードとアニメーションを設定します。既存のアプリ固有オプションはスプレッドの後へ置いて維持します。プラットフォームでモードを選ぶアプリでは、その選択を維持し、対応するモードの場合だけこのプリセットを適用します。

### Angular

src/app/app.config.tsで、既存のIonic providerへプリセットを渡します。例はIonic providerの配置を示します。ルーターやHTTPなど、配列にあるほかのproviderは維持してください。

```diff:src/app/app.config.ts
@@
 import { ApplicationConfig } from '@angular/core';
 import { provideIonicAngular } from '@ionic/angular';
+ import { ios26ThemeConfig } from '@rdlabo/ionic-theme-ios26';
 import { provideRouter } from '@angular/router';
 import { routes } from './app.routes';

 export const appConfig: ApplicationConfig = {
   providers: [
     provideRouter(routes),
-     provideIonicAngular(),
+     provideIonicAngular({ ...ios26ThemeConfig }),
     provideHttpClient(),
   ],
 };
```

### React

src/main.tsxで、既存のsetupIonicReactを次の呼び出しへ置き換え、既存のReactルートを描画する前に実行します。ルートの描画、ルーティング、CSSのimportは維持します。

```diff:src/main.tsx
@@
 import { setupIonicReact } from '@ionic/react';
+ import { ios26ThemeConfig } from '@rdlabo/ionic-theme-ios26';
 import { createRoot } from 'react-dom/client';
 import App from './App';
 import './global.css';

- setupIonicReact();
+ setupIonicReact({ ...ios26ThemeConfig });

 createRoot(document.getElementById('root')!).render(<App />);
```

### Vue

src/main.tsで、既存アプリのIonicVue登録時にプリセットを渡し、mountより前に実行します。例は登録位置を示します。ルーター、ほかのプラグイン、既存のmount手順は維持してください。

```diff:src/main.ts
@@
 import { createApp } from 'vue';
 import { IonicVue } from '@ionic/vue';
+ import { ios26ThemeConfig } from '@rdlabo/ionic-theme-ios26';
 import App from './App.vue';
 import router from './router';
@@

 const app = createApp(App);
- app.use(IonicVue);
+ app.use(IonicVue, { ...ios26ThemeConfig });
 app.use(router);
 router.isReady().then(() => app.mount('#app'));
```

## 4. プレビューする

通常の開発サーバーを起動し、Ionicのボタンやリストがある既存ページを開きます。iOSの外観、システムのライト・ダーク切替、既存ページ間の遷移を確認します。手動・常時ダークを選んだ場合はその方針を確認します。テーマが適用され、元の操作と画面遷移が動き、選択した外観方針に従えば導入完了です。この確認にネイティブビルドやレール対応端末は不要です。

個別のスタイルとアプリ独自の上書きは[設定ガイド](configuration.md)、既存の導入設定を更新する場合は[移行ガイド](migration.md)を使います。
