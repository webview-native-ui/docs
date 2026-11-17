---
title: 'Ionicアプリに導入する'
sourceRevision: 'b506eab74252bcd05a928532b54bd643b0d0c60820256d5eed3aba78a61cc385'
headingAliases:
  '3.-%E3%82%A2%E3%83%97%E3%83%AA%E3%82%B7%E3%82%A7%E3%83%AB%E3%81%AE%E6%8F%8F%E7%94%BB%E5%BE%8C%E3%81%AB%E8%B5%B7%E5%8B%95%E3%81%99%E3%82%8B': '3.-%E3%82%A2%E3%83%97%E3%83%AA%E3%81%AE%E6%8F%8F%E7%94%BB%E5%BE%8C%E3%81%AB%E8%B5%B7%E5%8B%95%E5%87%A6%E7%90%86%E3%82%92%E5%91%BC%E3%81%B6'
  '2.-%E4%B8%A1%E6%96%B9%E3%81%AE%E3%83%86%E3%83%BC%E3%83%9E%E3%82%92%E8%A8%AD%E5%AE%9A%E3%81%99%E3%82%8B': '2.-%E3%83%86%E3%83%BC%E3%83%9E%E3%82%92%E8%A8%AD%E5%AE%9A%E3%81%99%E3%82%8B'
  'verify-installation': '5.-%E5%B0%8E%E5%85%A5%E7%B5%90%E6%9E%9C%E3%82%92%E7%A2%BA%E8%AA%8D%E3%81%99%E3%82%8B'
  '%E5%90%84%E3%83%97%E3%83%A9%E3%83%83%E3%83%88%E3%83%95%E3%82%A9%E3%83%BC%E3%83%A0%E3%81%A7%E7%B5%90%E6%9E%9C%E3%82%92%E7%A2%BA%E8%AA%8D%E3%81%99%E3%82%8B': '5.-%E5%B0%8E%E5%85%A5%E7%B5%90%E6%9E%9C%E3%82%92%E7%A2%BA%E8%AA%8D%E3%81%99%E3%82%8B'
  '%E5%B0%8E%E5%85%A5%E5%BE%8C%E3%81%AB%E9%80%B2%E3%82%80': '%E5%B0%8E%E5%85%A5%E5%AE%8C%E4%BA%86'
---

# Ionicアプリに導入する

既存のIonic + Capacitorアプリに、iOS 26／27テーマとAndroid向けのMaterial Design 3を導入します。iOSのネイティブコントロール、端末に応じたレイアウト、Androidの端末配色も設定します。

## 導入前に確認する

この手順は、dark.system.cssでOSの明暗に追従しているアプリ向けです。クラスで明暗を切り替える場合や常時ダークの場合は、現在の方式に合う[テーマ設定](/projects/ionic-theme-ios27/docs/configuration)を使います。すでにテーマを設定しているアプリには、[Native UIだけを追加する手順](/projects/capacitor-native-ui/docs/ionic-vertical-bars)もあります。

対象はIonic 9・Capacitor 8・Foldable 8.5以降（メジャーバージョン8）のアプリです。Webビルドが成功し、導入先のiOSまたはAndroidプロジェクトがある状態から始めます。

iOSのネイティブコントロールにはiOS 26以降とXcode 26以降、Androidの端末配色にはAndroid 12以降が必要です。古いOSではWebコントロールと既定の配色を使います。レール表示の条件は[対応端末とOS](/projects/capacitor-native-ui/docs/vertical-bars#native-rendering)を参照してください。

テーマだけの導入は[iOS 26](/projects/ionic-theme-ios26/docs/setup)・[iOS 27](/projects/ionic-theme-ios27/docs/setup)・[MD3](/projects/ionic-theme-md3/docs/setup)、Ionicを使わない場合は[HTML](/projects/capacitor-native-ui/docs/framework-independent)、Cordovaアプリは[Cordova](/projects/cordova-native-ui/docs/readme)の手順を使います。

差分は既存ファイルへ適用し、ファイル名はアプリの構成に合わせて読み替えてください。たとえばsrc/global.cssは、Angularではsrc/global.scssに当たります。新規作成するファイルは各手順で指定します。差分にないルートや設定はそのまま残します。

## 1. パッケージをインストールする

アプリのディレクトリで、必要なパッケージをインストールします。

```sh
npm install @rdlabo/capacitor-native-ui @rdlabo/ionic-theme-ios26 \
  @rdlabo/ionic-theme-ios27 @rdlabo/ionic-theme-md3 \
  @erkamyaman/capacitor-foldable@8
```

## 2. テーマを設定する

グローバルスタイルを変更し、使っているフレームワークの例に沿ってIonicを初期化します。

system.cssでOSの明暗追従を維持します。アプリ内で切り替える設定は、導入後に[外観設定](/guides/appearance)で追加できます。

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

iOS 26を基本に、`overflow-anchor: auto` 対応ブラウザーではiOS 27を表示します。Material DesignモードにはMD3を使います。

テーマ設定のプリセットは、Ionicのモードや画面遷移のアニメーションをまとめた設定オブジェクトです。iOS 26／27には、ネイティブ遷移との同期を含む共通の `ios27ThemeConfig` を渡します。

以下からフレームワークを一つ選び、既存のIonic初期化処理へプリセットを渡します。

### Angular / Ionic 9

src/app/app.config.tsのprovideIonicAngularへプリセットを渡します。ルーターやHTTPなど、ほかのproviderは残します。

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

src/main.tsxで、Reactの描画前にsetupIonicReactを呼びます。

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

src/main.tsで、mount前にIonicVueへプリセットを渡します。

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

## 3. アプリの描画後に起動処理を呼ぶ

Native UIは、描画されたIonicの対応要素を読み取ってネイティブコントロールを表示します。要素が画面にそろってから開始するため、ルートコンポーネントの描画後に呼び出します。

まずsrc/native-ui.tsを新規作成します。このファイルで次の3つを設定し、アプリ全体で一度だけ起動します。

| 機能                   | 起動時に行うこと                                       |
| ---------------------- | ------------------------------------------------------ |
| 端末の配色             | enableDynamicColorsで、端末の色をテーマへ反映する      |
| iOSのネイティブ表示    | enableNativeUIで、Ionicのコントロールを読み取る        |
| 端末レイアウトへの追従 | Foldableの変更通知を受け、配置と余白をテーマへ反映する |

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

既存のルートコンポーネントへ、afterNextRenderで起動する処理を追加します。

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

既存のAppコンポーネントへ、useEffectで起動する処理を追加します。ExistingRouterは、アプリで使っているルーターへ読み替えてください。

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

既存のApp.vueへ、onMountedで起動する処理を追加します。

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

アプリのディレクトリでWebをビルドし、導入先のOSへ同期します。続いて、XcodeまたはAndroid Studioでアプリをビルド・起動します。

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

SwiftPMではEngineが自動解決されます。CocoaPodsを使う場合は[ネイティブプロジェクト設定](/projects/capacitor-native-ui/docs/configuration#native-project-setup)に沿って設定します。

## 5. 導入結果を確認する

ネイティブ表示と端末レイアウトへの追従は、ここまでの設定で有効になります。既存の画面を開き、以下の項目を確認します。

次の一時診断はiOS 26以降向けです。Androidと古いiOSでは「全対象：導入完了の確認」へ進んでください。

### iOS 26以降・Xcode 26以降のみ：一時診断を追加する

src/native-ui.tsのawait enableNativeUI()を一時的に置き換え、表示状態を取得できるようにします。

<!-- prettier-ignore -->
```diff:src/native-ui.ts (iOS verification)
@@
-     await enableNativeUI();
+     const shell = await enableNativeUI();
+     Object.assign(window, { inspectNativeUI: () => shell.getStatus() });
```

Webを再ビルドしてiOSへ同期し、Xcodeで起動します。SafariのWebインスペクタでアプリのWebViewを開き、ツールバーボタンやタブバーのある画面を表示してから、次を実行します。

```js
window.inspectNativeUI();
```

stateがnative、projectedが正数で、ネイティブコントロールから元のWeb処理が一度だけ動けば正常です。projectedが0なら描画を待って再確認します。stateがwebのままなら、reasonを手がかりに対応条件やプラグインの同期・再ビルドを確認してください。

### 全対象：導入完了の確認

| 対象                     | 確認する操作                                                           | 完了条件                                                                                                                       |
| ------------------------ | ---------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| 全対象                   | 既存画面を開き、画面遷移とライト・ダークを試す                         | 元の画面へ移動でき、ライト・ダークのどちらでも文字が読める                                                                     |
| iOS                      | iOS 26以降で対応コントロールを操作する                                 | 既存の対応コントロールがネイティブ表示され、操作すると元のWebの処理が一度だけ実行される。古いOSでは操作できるWeb表示が期待結果 |
| Android                  | ネイティブアプリを開く。Android 12以降では端末の配色を変更して開き直す | 対応端末ではMD3に端末配色が反映され、非対応端末では既定色のWebコントロールで操作できる                                         |
| ネイティブレール対応端末 | レイアウトを変更し、元に戻す                                           | 通知された配置にVertical Barsが追従し、領域がなくなれば余白も戻る。他の端末では通常配置が期待結果                              |
| ブラウザー               | ツールバーのボタンを押すか、タブを切り替える                           | ブラウザーでもボタンの操作やタブ移動が導入前と同じように動く                                                                   |

### iOS 26以降・Xcode 26以降のみ：一時診断を撤去する

診断に使った一時フックを削除し、元の起動処理へ戻します。

<!-- prettier-ignore -->
```diff:src/native-ui.ts (iOS verification)
@@
-     const shell = await enableNativeUI();
-     Object.assign(window, { inspectNativeUI: () => shell.getStatus() });
+     await enableNativeUI();
```

以下を実行し、iOSアプリを終了して起動し直します。Safariのコンソールで一時フックがundefinedになることと、通常の操作が動くことを確認します。

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

配色の詳細は[Dynamic Color](/projects/capacitor-native-ui/docs/dynamic-colors)、Native UIのオプションは[設定](/projects/capacitor-native-ui/docs/configuration)、既存設定の更新は[移行ガイド](/projects/capacitor-native-ui/docs/migration)を参照してください。
