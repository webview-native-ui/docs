---
title: 'Ionicアプリに導入する'
sourceRevision: 'a67ad0f183afb251096333b5a893f0b52af2159adc4999ccb9fdeea10c4cbcbb'
headingAliases:
  '%E5%85%A8%E5%AF%BE%E8%B1%A1%EF%BC%9A%E5%B0%8E%E5%85%A5%E5%AE%8C%E4%BA%86%E3%81%AE%E7%A2%BA%E8%AA%8D': '%E7%AB%AF%E6%9C%AB%E3%81%94%E3%81%A8%E3%81%AE%E5%8B%95%E4%BD%9C'
  '5.-%E5%B0%8E%E5%85%A5%E7%B5%90%E6%9E%9C%E3%82%92%E7%A2%BA%E8%AA%8D%E3%81%99%E3%82%8B': '5.-%E3%83%86%E3%83%BC%E3%83%9E%E3%81%A8%E3%82%B3%E3%83%B3%E3%83%88%E3%83%AD%E3%83%BC%E3%83%AB%E3%81%AE%E5%8B%95%E4%BD%9C%E3%82%92%E7%A2%BA%E8%AA%8D%E3%81%99%E3%82%8B'
  '%E5%B0%8E%E5%85%A5%E5%89%8D%E3%81%AB%E7%A2%BA%E8%AA%8D%E3%81%99%E3%82%8B': '1.-%E3%83%91%E3%83%83%E3%82%B1%E3%83%BC%E3%82%B8%E3%82%92%E3%82%A4%E3%83%B3%E3%82%B9%E3%83%88%E3%83%BC%E3%83%AB%E3%81%99%E3%82%8B'
  '3.-%E3%82%A2%E3%83%97%E3%83%AA%E3%82%B7%E3%82%A7%E3%83%AB%E3%81%AE%E6%8F%8F%E7%94%BB%E5%BE%8C%E3%81%AB%E8%B5%B7%E5%8B%95%E3%81%99%E3%82%8B': '3.-%E3%82%A2%E3%83%97%E3%83%AA%E3%81%AE%E6%8F%8F%E7%94%BB%E5%BE%8C%E3%81%AB%E8%B5%B7%E5%8B%95%E5%87%A6%E7%90%86%E3%82%92%E5%91%BC%E3%81%B6'
  '2.-%E4%B8%A1%E6%96%B9%E3%81%AE%E3%83%86%E3%83%BC%E3%83%9E%E3%82%92%E8%A8%AD%E5%AE%9A%E3%81%99%E3%82%8B': '2.-%E3%83%86%E3%83%BC%E3%83%9E%E3%82%92%E8%A8%AD%E5%AE%9A%E3%81%99%E3%82%8B'
  'verify-installation': '5.-%E3%83%86%E3%83%BC%E3%83%9E%E3%81%A8%E3%82%B3%E3%83%B3%E3%83%88%E3%83%AD%E3%83%BC%E3%83%AB%E3%81%AE%E5%8B%95%E4%BD%9C%E3%82%92%E7%A2%BA%E8%AA%8D%E3%81%99%E3%82%8B'
  '%E5%90%84%E3%83%97%E3%83%A9%E3%83%83%E3%83%88%E3%83%95%E3%82%A9%E3%83%BC%E3%83%A0%E3%81%A7%E7%B5%90%E6%9E%9C%E3%82%92%E7%A2%BA%E8%AA%8D%E3%81%99%E3%82%8B': '5.-%E3%83%86%E3%83%BC%E3%83%9E%E3%81%A8%E3%82%B3%E3%83%B3%E3%83%88%E3%83%AD%E3%83%BC%E3%83%AB%E3%81%AE%E5%8B%95%E4%BD%9C%E3%82%92%E7%A2%BA%E8%AA%8D%E3%81%99%E3%82%8B'
  '%E5%B0%8E%E5%85%A5%E5%BE%8C%E3%81%AB%E9%80%B2%E3%82%80': '%E5%B0%8E%E5%85%A5%E5%AE%8C%E4%BA%86'
---

# Ionicアプリに導入する

Ionic 9・Capacitor 8のアプリに、iOSとAndroidのテーマを追加します。iOSでは対応するボタンやタブをネイティブ表示し、Androidでは端末の配色を使えます。

## 1. パッケージをインストールする

```sh
npm install @rdlabo/capacitor-native-ui @rdlabo/ionic-theme-ios26 \
  @rdlabo/ionic-theme-ios27 @rdlabo/ionic-theme-md3 \
  @erkamyaman/capacitor-foldable@8
```

バーの配置を取得するFoldableは8.5以降の8.xを使用します。

## 2. テーマを設定する

グローバルスタイル（Angularでは通常src/global.scss）のdark.system.cssを、次のテーマに置き換えます。OSの明暗に追従する構成の例です。クラス切り替え・常時ダークのアプリでは、[現在の方式に合うプリセット](/projects/ionic-theme-ios27/docs/configuration)を使います。

<!-- prettier-ignore -->
```diff:src/global.css
@@
 @import '@ionic/core/css/core.css';
 @import '@ionic/core/css/structure.css';
- @import '@ionic/core/css/palettes/dark.system.css';
+ @import '@rdlabo/ionic-theme-ios26/styles/system.css' supports(not (overflow-anchor: auto));
+ @import '@rdlabo/ionic-theme-ios27/styles/system.css' supports(overflow-anchor: auto);
+ @import '@rdlabo/ionic-theme-md3/styles/theme.css';

 :root { --app-content-width: 72rem; }
```

iOS 26を基本に、`overflow-anchor: auto` 対応ブラウザーではiOS 27を表示します。Material DesignモードにはMD3を使います。

既存のIonic初期化処理に、対象OSのプリセットを渡します。iOS 26／27は、ネイティブの画面遷移を同期する `ios27ThemeConfig` を共用します。

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

SwiftPMではEngineが自動解決されます。CocoaPodsを使う場合は[ネイティブプロジェクト設定](/projects/capacitor-native-ui/docs/configuration#native-project-setup)に沿って設定します。

### Android

```sh
npx cap sync android
npx cap open android
```

## 5. テーマとコントロールの動作を確認する

既存画面でライト・ダークを切り替え、どちらでも文字が読めることを確認します。

### 端末ごとの動作

- **iOS** — Xcode 26以降でビルドし、iOS 26以降で開くと、対応するボタンやタブがネイティブ表示されます。タップすると元のWeb側の処理が1回だけ動きます。古いiOSではWebコントロールを使います。
- **Android** — Android 12以降で端末の配色を変更し、アプリを開き直すとMD3テーマの色が変わります。端末配色に非対応の機種ではテーマの既定色を使います。
- **縦型レール** — [対応端末](/projects/capacitor-native-ui/docs/vertical-bars#native-rendering)でレイアウトを変更すると、バーと余白が新しい配置に追従し、元に戻すと余白も戻ります。
- **ブラウザー** — ツールバーのボタンやタブを操作すると、導入前と同じ画面に移動できます。

### iOS 26以降・Xcode 26以降のみ：一時診断を追加する

ボタンやタブがネイティブ表示されないときは、src/native-ui.ts の await enableNativeUI() を一時的に置き換え、表示状態を調べられます。

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

[設定画面に外観の切り替えを追加する](/guides/appearance) · [SwiftUIやComposeで独自のコントロールを作る](/guides/extensions)

## 個別のオプション

配色の詳細は[Dynamic Color](/projects/capacitor-native-ui/docs/dynamic-colors)、Native UIのオプションは[設定](/projects/capacitor-native-ui/docs/configuration)、既存設定の更新は[移行ガイド](/projects/capacitor-native-ui/docs/migration)を参照してください。
