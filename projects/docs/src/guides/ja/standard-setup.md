---
title: 'Ionicアプリに導入する'
sourceRevision: 'b506eab74252bcd05a928532b54bd643b0d0c60820256d5eed3aba78a61cc385'
headingAliases:
  'verify-installation': '5.-%E5%B0%8E%E5%85%A5%E7%B5%90%E6%9E%9C%E3%82%92%E7%A2%BA%E8%AA%8D%E3%81%99%E3%82%8B'
  '%E5%90%84%E3%83%97%E3%83%A9%E3%83%83%E3%83%88%E3%83%95%E3%82%A9%E3%83%BC%E3%83%A0%E3%81%A7%E7%B5%90%E6%9E%9C%E3%82%92%E7%A2%BA%E8%AA%8D%E3%81%99%E3%82%8B': '5.-%E5%B0%8E%E5%85%A5%E7%B5%90%E6%9E%9C%E3%82%92%E7%A2%BA%E8%AA%8D%E3%81%99%E3%82%8B'
  '%E5%B0%8E%E5%85%A5%E5%BE%8C%E3%81%AB%E9%80%B2%E3%82%80': '%E5%B0%8E%E5%85%A5%E5%AE%8C%E4%BA%86'
---

# Ionicアプリに導入する

既存の Ionic + Capacitor アプリに、iOS の基本となる iOS 26 テーマ、対応ブラウザー向けの iOS 27 テーマ、Android 向けの Material Design 3 を設定します。iOS のネイティブコントロール、iPhone Duo / Vertical Bars、Android Dynamic Color も、この手順で接続します。

## 導入前に確認する

この組み合わせの導入手順は、Ionicのdark.system.cssを使い、OSのライト・ダークへ追従しているアプリから始めます。スタイル差分の削除行はその開始方針そのもので、任意のダークパレットを表す仮の行ではありません。class・always方針を使うアプリは動作を維持し、[既存テーマの統合](/projects/capacitor-native-ui/docs/ionic-vertical-bars)、テーマの[設定](/projects/ionic-theme-ios27/docs/configuration)、更新時の[移行手順](/guides/migration)を使います。そのアプリをsystemへ変更すると動作が変わるため、この導入の範囲には含めません。

Capacitor 8と、バージョン8の8.5以降のFoldableを使う既存のIonic 9アプリを対象にします。まず対象をiOS・Android・両方から選びます。Webビルドが成功し、選んだ対象のネイティブプロジェクトがある状態から始めてください。対象外のネイティブプロジェクトは不要です。既存のルートとイベント処理は維持します。

iOS のネイティブコントロールは iOS 26 以降と Xcode 26 以降が必要です。Android Dynamic Color は Android 12 以降で利用でき、古い端末は既定の配色を維持します。ネイティブレールには追加の[対応端末と OS](/projects/capacitor-native-ui/docs/vertical-bars#native-rendering)が必要です。

テーマだけなら[iOS 26](/projects/ionic-theme-ios26/docs/setup)・[iOS 27](/projects/ionic-theme-ios27/docs/setup)・[MD3](/projects/ionic-theme-md3/docs/setup)の導入手順を選びます。[既存テーマにNative UIを追加する場合](/projects/capacitor-native-ui/docs/ionic-vertical-bars)、[Ionicを使わないHTML](/projects/capacitor-native-ui/docs/framework-independent)、[Cordova](/projects/cordova-native-ui/docs/readme)も、それぞれの手順から始めてください。

差分のパスは、既存ファイルの役割を示す基準例です。アプリで使っているentry・root・page・グローバルスタイルシートへ対応させて適用します。Angularでは通常src/global.scssなどが該当します。captionに合わせてsrc/global.cssを新設しても、読み込まれないファイルには効果がありません。新規作成すると明記したファイルだけを作り、表示されていない既存コードは維持してください。

## 1. パッケージをインストールする

開始時点では既存アプリのWebビルドが動き、今回のパッケージは未導入です。アプリのディレクトリでコマンドを実行します。npmが成功して依存関係とlockfileが更新されれば、この手順は完了です。この時点ではUIはまだ有効になっていません。

```sh
npm install @rdlabo/capacitor-native-ui @rdlabo/ionic-theme-ios26 \
  @rdlabo/ionic-theme-ios27 @rdlabo/ionic-theme-md3 \
  @erkamyaman/capacitor-foldable@8
```

## 2. 両方のテーマを設定する

パッケージ導入後に、スタイルシートの差分と、使っているフレームワークの初期化差分だけを適用します。空白で始まる行は既存の文脈で、削除・置換する指示ではありません。表示していないprovider・ルーター・アプリのオプションも維持します。ここでテーマとIonic設定がそろいますが、ネイティブの起動はまだ接続していません。

スタイルの差分は既存のsrc/global.cssを例にしています。global.scssなど別のグローバルファイルを使うアプリでは、そのファイルへ適用し、別のスタイルシートを増やしません。削除するdark.system.cssは、この手順の開始状態そのものです。class・alwaysのパレットへ読み替えて削除しません。

このsystemプリセットは、OSのライト・ダークへ追従する既存の方針を維持します。テーマを導入するだけで、アプリから明暗を上書きする方針には変更しません。classプリセットへ切り替えるのは、[外観設定の使い方](/guides/appearance)で上書きを追加するときだけです。起動時のコントローラーも既定のsystemモードのまま使います。

<!-- prettier-ignore -->
```diff:src/global.css
@@
 @import '@ionic/core/css/core.css';
 @import '@ionic/core/css/structure.css';
- @import '@ionic/core/css/palettes/dark.system.css';
+ @import '@rdlabo/ionic-theme-ios26/styles/system.css' supports(not (overflow-anchor: auto));
+ @import '@rdlabo/ionic-theme-ios27/styles/system.css' supports(overflow-anchor: auto);
+ @import '@rdlabo/ionic-theme-ios27/dist/css/vertical-bars.css' supports(not (overflow-anchor: auto));
+ @import '@rdlabo/ionic-theme-md3/styles/theme.css';

 :root { --app-content-width: 72rem; }
```

CSSでiOS 26を基本に、`overflow-anchor: auto` 対応ブラウザーではiOS 27を使います。Material DesignモードはMD3です。iOSの両方の見た目には、ネイティブ遷移の同期を含む共通の `ios27ThemeConfig` を使います。既存のIonic初期化処理へ、プラットフォームに合うプリセットを渡します。

使っているフレームワークの例を一つ選び、既存のIonic初期化処理を置き換えます。Ionicの初期化は一度だけ行います。

### Angular / Ionic 9

既存のアプリ設定で、Ionicのproviderにプリセットを渡します。providers配列にあるルーターやHTTPなど、ほかの設定は残してください。

<!-- prettier-ignore -->
```diff:src/app/app.config.ts
@@
 import { provideIonicAngular } from '@ionic/angular';
 import { provideRouter } from '@angular/router';
 import { routes } from './app.routes';
+ import { Capacitor } from '@capacitor/core';
+ import { ios27ThemeConfig } from '@rdlabo/ionic-theme-ios27';
+ import { md3ThemeConfig } from '@rdlabo/ionic-theme-md3';
+ 
+ const ionicConfig = Capacitor.getPlatform() === 'ios' ? ios27ThemeConfig : md3ThemeConfig;

 export const appConfig: ApplicationConfig = {
   providers: [
     provideRouter(routes),
-     provideIonicAngular(),
+     provideIonicAngular(ionicConfig),
     provideHttpClient(),
   ],
 };
```

### React

既存のエントリーファイルで、ルートコンポーネントのrenderより前に実行します。Reactのルート、ルーティング、CSSの読み込みはそのまま残してください。

<!-- prettier-ignore -->
```diff:src/main.tsx
@@
 import { setupIonicReact } from '@ionic/react';
+ import { Capacitor } from '@capacitor/core';
+ import { ios27ThemeConfig } from '@rdlabo/ionic-theme-ios27';
+ import { md3ThemeConfig } from '@rdlabo/ionic-theme-md3';
 import { createRoot } from 'react-dom/client';
 import App from './App';
 import './global.css';

- setupIonicReact();
+ const ionicConfig = Capacitor.getPlatform() === 'ios' ? ios27ThemeConfig : md3ThemeConfig;
+ 
+ setupIonicReact(ionicConfig);

 createRoot(document.getElementById('root')!).render(<App />);
```

### Vue

既存のエントリーファイルで、mountする前のIonicVue登録時にプリセットを渡します。既存のルーターやほかのプラグインの登録は、アプリ作成からmountまでの間に残してください。

<!-- prettier-ignore -->
```diff:src/main.ts
@@
 import { createApp } from 'vue';
 import { IonicVue } from '@ionic/vue';
+ import { Capacitor } from '@capacitor/core';
+ import { ios27ThemeConfig } from '@rdlabo/ionic-theme-ios27';
+ import { md3ThemeConfig } from '@rdlabo/ionic-theme-md3';
 import App from './App.vue';
 import router from './router';
 import './global.css';

+ const ionicConfig = Capacitor.getPlatform() === 'ios' ? ios27ThemeConfig : md3ThemeConfig;
+ 
 const app = createApp(App);
- app.use(IonicVue);
+ app.use(IonicVue, ionicConfig);
 app.use(router);
 router.isReady().then(() => app.mount('#app'));
```

## 3. アプリシェルの描画後に起動する

テーマ設定まで済んだ状態から始めます。全行が追加の差分で共通モジュールを新規作成し、既存のアプリルートには自分のフレームワークの差分だけを適用します。現在のテンプレートとルーターは維持します。描画後に起動処理が呼ばれる状態になりますが、ネイティブでのビルドと確認はこれからです。

<!-- prettier-ignore -->
```diff:src/native-ui.ts
+ import { Capacitor } from '@capacitor/core';
+ import { enableNativeUI, getDynamicColorScheme, addDynamicColorListener } from '@rdlabo/capacitor-native-ui';
+ import { Foldable } from '@erkamyaman/capacitor-foldable';
+ import { resolveVerticalBarsLayout } from '@rdlabo/capacitor-native-ui/integration';
+ import { setVerticalBarsLayout } from '@rdlabo/ionic-theme-ios27';
+ import { enableDynamicColors } from '@rdlabo/ionic-theme-md3/dynamic-colors';
+ 
+ let startup: Promise<void> | undefined;
+ 
+ export function startNativeUI(): Promise<void> {
+   return (startup ??= connectNativeUI());
+ }
+ 
+ async function connectNativeUI(): Promise<void> {
+   await enableDynamicColors({
+     getScheme: getDynamicColorScheme,
+     listen: addDynamicColorListener,
+   });
+ 
+   if (Capacitor.getPlatform() === 'ios') {
+     await enableNativeUI();
+ 
+     const updateLayout = async () => {
+       setVerticalBarsLayout(await resolveVerticalBarsLayout(Foldable));
+     };
+ 
+     void Foldable.addListener('layoutChange', () => void updateLayout().catch(console.error))
+       .then(updateLayout)
+       .catch(console.error);
+   }
+ }
```

### Angular

既存ルートコンポーネントへこの差分を適用します。文脈として示したテンプレートとコンポーネントimportはそのまま維持し、元のメニューとルーターも残します。

<!-- prettier-ignore -->
```diff:src/app/app.component.ts
@@
- import { Component } from '@angular/core';
+ import { Component, afterNextRender } from '@angular/core';
 import { IonApp, IonRouterOutlet } from '@ionic/angular';
+ import { startNativeUI } from '../native-ui';

 @Component({
   selector: 'app-root',
   imports: [IonApp, IonRouterOutlet],
   template: '<ion-app><ion-router-outlet /></ion-app>',
 })
- export class AppComponent {}
+ export class AppComponent {
+   constructor() {
+     afterNextRender(() => {
+       void startNativeUI().catch(console.error);
+     });
+   }
+ }
```

### React

既存のAppコンポーネントへこの差分を適用します。ExistingRouterはもともと描画しているルーターを表し、そのルーターとルートは維持します。

<!-- prettier-ignore -->
```diff:src/App.tsx
@@
+ import { useEffect } from 'react';
+ import { startNativeUI } from './native-ui';
 import { IonApp } from '@ionic/react';
 import { ExistingRouter } from './router';

 export default function App() {
+   useEffect(() => {
+     void startNativeUI().catch(console.error);
+   }, []);
+ 
   return <IonApp><ExistingRouter /></IonApp>;
 }
```

### Vue

既存のApp.vueのscriptへこの差分を適用します。現在のテンプレート、ルーターの表示位置、メニューはそのまま維持します。

<!-- prettier-ignore -->
```diff:src/App.vue
@@
 <script setup lang="ts">
+ import { onMounted } from 'vue';
 import { IonApp, IonRouterOutlet } from '@ionic/vue';
+ import { startNativeUI } from './native-ui';
+ 
+ onMounted(() => {
+   void startNativeUI().catch(console.error);
+ });
 </script>

 <template>
```

## 4. ビルド・同期・実行する

起動処理の接続後、アプリのディレクトリでWebをビルドし、対象OSのコマンドだけを実行します。開いたプロジェクトをXcodeまたはAndroid Studioでビルド・起動します。新しいWebアセットとプラグインを含むアプリを実行できれば、この手順は完了です。導入の合否は手順5で確認します。

```sh
npm run build
```

### iOS

```sh
npx cap sync ios
npx cap open ios
```

### Android

```sh
npx cap sync android
npx cap open android
```

SwiftPMはEngineを自動解決します。既存のCocoaPods構成は[ネイティブプロジェクト設定](/projects/capacitor-native-ui/docs/configuration#native-project-setup)を使います。

## 5. 導入結果を確認する

対応するIonicコントロールのネイティブ表示と、端末レイアウト変更への追従は、ここまでの導入で有効になっています。既存の画面と操作を使って以下を確認します。確認のためにツールバーの操作や独自コンポーネント、レイアウトのプレビューコードを追加する必要はありません。

更新したアプリを起動した状態から確認します。Androidのみのアプリと、ネイティブ対応条件より古いiOSは、下のiOS限定2区画を丸ごとスキップします。Safari操作・一時フックの追加と撤去・iOSの再ビルドと同期も不要です。対象OSの完了確認表を確認して「導入完了」へ進んでください。一時診断と撤去を実施するのは、iOS 26以降へXcode 26以降でビルドする場合だけです。

### iOS 26以降・Xcode 26以降のみ：一時診断を追加する

iOS 26以降・Xcode 26以降では、確認時に一度だけ既存ランタイムの状態を調べます。src/native-ui.tsのiOS分岐にある既存のawait enableNativeUI()を、一時的に次の2行へ置き換えます。同じハンドルを読むための確認用フックで、別のランタイムは起動しません。

<!-- prettier-ignore -->
```diff:src/native-ui.ts (iOS verification)
@@
-     await enableNativeUI();
+     const shell = await enableNativeUI();
+     Object.assign(window, { inspectNativeUI: () => shell.getStatus() });
```

手順4で開発アプリを再ビルド・iOSへ同期し、SafariのWebインスペクタでこのアプリのWebViewを開きます。対応するツールバーボタンやタブバーがある既存画面を表示し、描画後にコンソールで次を実行します。

```js
window.inspectNativeUI();
```

対応コントロールではstateがnative、projectedが正数になり、操作すると元のWeb処理が一度だけ動くことを確認します。投影は非同期なので、最初にprojectedが0なら画面の表示を待って再確認します。0のままではネイティブ表示を確認できていません。対応iOSのビルドでstateがwebのままなら、reasonとネイティブの同期・再ビルド、コントロールの対応条件を確認してから完了とします。非対応OSではWebへのフォールバックが期待結果で、元のWeb操作が動けば正常です。確認後は一時フックを除去し、元のawait enableNativeUI()へ戻します。

### 全対象：導入完了の確認

| 対象                     | 確認する操作                                                           | 完了条件                                                                                                                       |
| ------------------------ | ---------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| 全対象                   | 既存画面を開き、画面遷移とライト・ダークを試す                         | 元のルート・イベント処理と、読みやすいWeb表示が動く                                                                            |
| iOS                      | Xcode 26以降でiOS 26以降へ実行し、対応コントロールを確認する           | 既存の対応コントロールがネイティブ表示され、操作すると元のWebの処理が一度だけ実行される。古いOSでは操作できるWeb表示が期待結果 |
| Android                  | ネイティブアプリを開く。Android 12以降では端末の配色を変更して開き直す | 対応端末ではMD3に端末配色が反映され、非対応端末では既定色のWebコントロールで操作できる                                         |
| ネイティブレール対応端末 | レイアウトを変更し、元に戻す                                           | 通知された配置にVertical Barsが追従し、領域がなくなれば余白も戻る。他の端末では通常配置が期待結果                              |
| ブラウザー               | テーマを表示して元の操作を試す                                         | Webの見た目と処理が動く。ネイティブ表示・端末配色・レールの確認とは区別する                                                    |

### iOS 26以降・Xcode 26以降のみ：一時診断を撤去する

上の対応iOS向け診断を実施した場合だけ、この撤去差分を適用します。Androidのみ・古いiOSの場合は、コマンドを含めこの区画全体をスキップして「導入完了」へ進みます。

<!-- prettier-ignore -->
```diff:src/native-ui.ts (iOS verification)
@@
-     const shell = await enableNativeUI();
-     Object.assign(window, { inspectNativeUI: () => shell.getStatus() });
+     await enableNativeUI();
```

アプリのディレクトリで下のビルド・同期を実行し、実行中のiOSアプリを終了して起動し直します。Safari Web Inspectorを開き直してコンソールの式を実行し、undefinedになることを確認します。通常のコントロールと元の処理も動くことを確認してください。ソースからの撤去だけでなく、以前のwindowフックもこれで消えます。

```sh
npm run build
npx cap sync ios
```

```js
typeof window.inspectNativeUI;
```

## 導入完了

選んだ対象で上の確認ができれば、導入は完了です。機能を追加する場合に、[外観設定](/guides/appearance)または[独自のネイティブUI](/guides/extensions)の手順を選んでください。

## 個別のオプション

これらのテーマを使わない Native UI は[既存テーマの設定](/projects/capacitor-native-ui/docs/ionic-vertical-bars)または [HTML の設定](/projects/capacitor-native-ui/docs/framework-independent)を使います。明暗設定・配色変換は [Dynamic Color](/projects/capacitor-native-ui/docs/dynamic-colors)、Native UI のオプションは[設定](/projects/capacitor-native-ui/docs/configuration)、既存構成からの移行は[移行ガイド](/projects/capacitor-native-ui/docs/migration)を参照してください。
