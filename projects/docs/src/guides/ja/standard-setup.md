---
title: 'Ionicアプリに導入する'
sourceRevision: 'c9537c6c26d13c92845d732c8b7d42316125570eb1dfd3a3b8ce0ca6ba7f3d06'
---

# Ionicアプリに導入する

既存の Ionic + Capacitor アプリに、iOS の基本となる iOS 26 テーマ、対応ブラウザー向けの iOS 27 テーマ、Android 向けの Material Design 3 を設定します。iOS のネイティブコントロール、iPhone Duo / Vertical Bars、Android Dynamic Color も、この手順で接続します。

## 導入前に確認する

Capacitor 8と、バージョン8の8.5以降のFoldableを使う既存のIonic 9アプリを対象にします。まず対象をiOS・Android・両方から選びます。Webビルドが成功し、選んだ対象のネイティブプロジェクトがある状態から始めてください。対象外のネイティブプロジェクトは不要です。既存のルートとイベント処理は維持します。

iOS のネイティブコントロールは iOS 26 以降と Xcode 26 以降が必要です。Android Dynamic Color は Android 12 以降で利用でき、古い端末は既定の配色を維持します。ネイティブレールには追加の[対応端末と OS](/projects/capacitor-native-ui/docs/vertical-bars#native-rendering)が必要です。

テーマだけなら[iOS 26](/projects/ionic-theme-ios26/docs/setup)・[iOS 27](/projects/ionic-theme-ios27/docs/setup)・[MD3](/projects/ionic-theme-md3/docs/setup)の導入手順を選びます。[既存テーマにNative UIを追加する場合](/projects/capacitor-native-ui/docs/ionic-vertical-bars)、[Ionicを使わないHTML](/projects/capacitor-native-ui/docs/framework-independent)、[Cordova](/projects/cordova-native-ui/docs/readme)も、それぞれの手順から始めてください。

## 1. パッケージをインストールする

```sh
npm install @rdlabo/capacitor-native-ui @rdlabo/ionic-theme-ios26 \
  @rdlabo/ionic-theme-ios27 @rdlabo/ionic-theme-md3 \
  @erkamyaman/capacitor-foldable@8
```

## 2. 両方のテーマを設定する

グローバルスタイルシートで、Ionicの基本CSSの後に読み込みます。既存のテーマとIonicダークパレットのインポートを置き換えてください。プリセットにダークパレットと互換スタイルが含まれるため、Sassの追加設定は不要です。

```css
@import '@rdlabo/ionic-theme-ios26/styles/class.css' supports(not (overflow-anchor: auto));
@import '@rdlabo/ionic-theme-ios27/styles/class.css' supports(overflow-anchor: auto);
@import '@rdlabo/ionic-theme-ios27/dist/css/vertical-bars.css' supports(not (overflow-anchor: auto));
@import '@rdlabo/ionic-theme-md3/styles/theme.css';
```

CSSでiOS 26を基本に、`overflow-anchor: auto` 対応ブラウザーではiOS 27を使います。Material DesignモードはMD3です。iOSの両方の見た目には、ネイティブ遷移の同期を含む共通の `ios27ThemeConfig` を使います。既存のIonic初期化処理へ、プラットフォームに合うプリセットを渡します。

使っているフレームワークの例を一つ選び、既存のIonic初期化処理を置き換えます。Ionicの初期化は一度だけ行います。

### Angular / Ionic 9

既存のアプリ設定で、Ionicのproviderにプリセットを渡します。providers配列にあるルーターやHTTPなど、ほかの設定は残してください。

```ts:src/app/app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideIonicAngular } from '@ionic/angular';
import { Capacitor } from '@capacitor/core';
import { ios27ThemeConfig } from '@rdlabo/ionic-theme-ios27';
import { md3ThemeConfig } from '@rdlabo/ionic-theme-md3';

const ionicConfig = Capacitor.getPlatform() === 'ios' ? ios27ThemeConfig : md3ThemeConfig;

export const appConfig: ApplicationConfig = {
  providers: [provideIonicAngular(ionicConfig)],
};
```

### React

既存のエントリーファイルで、ルートコンポーネントのrenderより前に実行します。Reactのルート、ルーティング、CSSの読み込みはそのまま残してください。

```ts:src/main.tsx
import { setupIonicReact } from '@ionic/react';
import { Capacitor } from '@capacitor/core';
import { ios27ThemeConfig } from '@rdlabo/ionic-theme-ios27';
import { md3ThemeConfig } from '@rdlabo/ionic-theme-md3';

const ionicConfig = Capacitor.getPlatform() === 'ios' ? ios27ThemeConfig : md3ThemeConfig;

setupIonicReact(ionicConfig);
```

### Vue

既存のエントリーファイルで、mountする前のIonicVue登録時にプリセットを渡します。既存のルーターやほかのプラグインの登録は、アプリ作成からmountまでの間に残してください。

```ts:src/main.ts
import { createApp } from 'vue';
import { IonicVue } from '@ionic/vue';
import { Capacitor } from '@capacitor/core';
import { ios27ThemeConfig } from '@rdlabo/ionic-theme-ios27';
import { md3ThemeConfig } from '@rdlabo/ionic-theme-md3';
import App from './App.vue';

const ionicConfig = Capacitor.getPlatform() === 'ios' ? ios27ThemeConfig : md3ThemeConfig;

const app = createApp(App);
app.use(IonicVue, ionicConfig);
app.mount('#app');
```

## 3. アプリシェルの描画後に起動する

src/native-ui.tsを作り、共通の起動処理を置きます。複数回呼ばれても同じ起動Promiseを返すため、Reactのeffectが再実行されても配色コントローラーを二重に起動しません。使っているフレームワークの例を一つ選び、アプリシェルの描画後に呼びます。

```ts:src/native-ui.ts
import { Capacitor } from '@capacitor/core';
import { enableNativeUI, getDynamicColorScheme, addDynamicColorListener } from '@rdlabo/capacitor-native-ui';
import { Foldable } from '@erkamyaman/capacitor-foldable';
import { resolveVerticalBarsLayout } from '@rdlabo/capacitor-native-ui/integration';
import { setVerticalBarsLayout } from '@rdlabo/ionic-theme-ios27';
import { enableDynamicColors } from '@rdlabo/ionic-theme-md3/dynamic-colors';

let startup: Promise<void> | undefined;

export function startNativeUI(): Promise<void> {
  return (startup ??= connectNativeUI());
}

async function connectNativeUI(): Promise<void> {
  await enableDynamicColors({
    getScheme: getDynamicColorScheme,
    listen: addDynamicColorListener,
  });

  if (Capacitor.getPlatform() === 'ios') {
    await enableNativeUI();

    const updateLayout = async () => {
      setVerticalBarsLayout(await resolveVerticalBarsLayout(Foldable));
    };

    void Foldable.addListener('layoutChange', () => void updateLayout().catch(console.error))
      .then(updateLayout)
      .catch(console.error);
  }
}
```

### Angular

既存のルートコンポーネントにimportとafterNextRenderを追加します。下の最小シェルは配置場所を示す例です。既存のコンポーネントのimport、テンプレート、メニュー、ルーターは維持してください。

```ts:src/app/app.component.ts
import { Component, afterNextRender } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular';
import { startNativeUI } from '../native-ui';

@Component({
  selector: 'app-root',
  imports: [IonApp, IonRouterOutlet],
  template: '<ion-app><ion-router-outlet /></ion-app>',
})
export class AppComponent {
  constructor() {
    afterNextRender(() => {
      void startNativeUI().catch(console.error);
    });
  }
}
```

### React

既存のAppコンポーネントにimportとeffectを追加します。IonApp内のJSXのルーターと画面はそのまま残してください。

```tsx:src/App.tsx
import { useEffect } from 'react';
import { IonApp } from '@ionic/react';
import { startNativeUI } from './native-ui';

export default function App() {
  useEffect(() => {
    void startNativeUI().catch(console.error);
  }, []);

  return <IonApp>{/* Keep your existing router and pages here. */}</IonApp>;
}
```

### Vue

既存のApp.vueのscriptにimportとonMountedを追加します。現在のテンプレート、ルート、メニューは維持してください。

```vue:src/App.vue
<script setup lang="ts">
import { onMounted } from 'vue';
import { IonApp, IonRouterOutlet } from '@ionic/vue';
import { startNativeUI } from './native-ui';

onMounted(() => {
  void startNativeUI().catch(console.error);
});
</script>

<template>
  <ion-app><ion-router-outlet /></ion-app>
</template>
```

## 4. ビルド・同期・実行する

Webアプリをビルドし、選んだ対象のコマンドだけ実行します。開いたプロジェクトをXcodeまたはAndroid Studioでビルド・起動してください。両方を対象にする場合だけ、両グループを実行します。

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

## 各プラットフォームで結果を確認する

選んだ対象の行だけ確認します。その端末で利用できない機能は、記載されたフォールバックが動けば完了です。対象外のOSやレール対応端末を用意する必要はありません。

| 対象                     | 確認する操作                                                           | 完了条件                                                                                                                                |
| ------------------------ | ---------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| 全対象                   | 既存画面を開き、画面遷移とライト・ダークを試す                         | 元のルート・イベント処理と、読みやすいWeb表示が動く                                                                                     |
| iOS                      | Xcode 26以降でiOS 26以降へ実行し、対応コントロールを確認する           | ネイティブ表示と元のWebの処理が動く。投影状態は[コントロールの手順](/guides/native-ui)で確認する。古いOSでは操作できるWeb表示が期待結果 |
| Android                  | ネイティブアプリを開く。Android 12以降では端末の配色を変更して開き直す | 対応端末ではMD3に端末配色が反映され、非対応端末では既定色のWebコントロールで操作できる                                                  |
| ネイティブレール対応端末 | レイアウトを変更し、元に戻す                                           | 通知された配置にVertical Barsが追従し、領域がなくなれば余白も戻る。他の端末では通常配置が期待結果                                       |
| ブラウザー               | テーマを表示して元の操作を試す                                         | Webの見た目と処理が動く。ネイティブ表示・端末配色・レールの確認とは区別する                                                             |

## 導入後に進む

上の確認ができたら、[見た目の調整](/guides/appearance)、[ネイティブコントロールの設定](/guides/native-ui)、[デバイスレイアウトへの対応](/guides/device-layout)へ進みます。テーマだけを導入する場合は、[iOS 26 のセットアップ](/projects/ionic-theme-ios26/docs/setup)、[iOS 27 のセットアップ](/projects/ionic-theme-ios27/docs/setup)、[MD3 のセットアップ](/projects/ionic-theme-md3/docs/setup)を使います。

## 個別のオプション

これらのテーマを使わない Native UI は[既存テーマの設定](/projects/capacitor-native-ui/docs/ionic-vertical-bars)または [HTML の設定](/projects/capacitor-native-ui/docs/framework-independent)を使います。明暗設定・配色変換は [Dynamic Color](/projects/capacitor-native-ui/docs/dynamic-colors)、Native UI のオプションは[設定](/projects/capacitor-native-ui/docs/configuration)、既存構成からの移行は[移行ガイド](/projects/capacitor-native-ui/docs/migration)を参照してください。
