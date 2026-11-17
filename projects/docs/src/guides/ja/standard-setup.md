---
title: 'WebView Native UI 標準導入'
sourceRevision: '40aa2500ec14dae99b759ce8471ff7d4bf02906105beae57bb8aac7868ba4427'
---

# WebView Native UI 標準導入

既存の Ionic + Capacitor アプリに、iOS の基本となる iOS 26 テーマ、対応ブラウザー向けの iOS 27 テーマ、Android 向けの Material Design 3 を設定します。iOS のネイティブコントロール、iPhone Duo / Vertical Bars、Android Dynamic Color も、この手順で接続します。

## 導入前に確認する

Ionic 8 または 9 の 8.8.1 以降、Capacitor 8、バージョン8の8.5以降の Foldable を使います。Web ビルドが成功し、iOS と Android のネイティブプロジェクトを追加済みのアプリから始めます。既存のルートとイベントハンドラーはそのまま使います。

iOS のネイティブコントロールは iOS 26 以降と Xcode 26 以降が必要です。Android Dynamic Color は Android 12 以降で利用でき、古い端末は既定の配色を維持します。ネイティブレールには追加の[対応端末と OS](/projects/capacitor-native-ui/docs/vertical-bars#native-rendering)が必要です。

別の構成では、[Ionicを使わないHTML](/projects/capacitor-native-ui/docs/framework-independent)、[Cordova](/projects/cordova-native-ui/docs/readme)、[テーマだけの導入](/guides/appearance)を参照してください。

## 1. パッケージをインストールする

```sh
npm install @rdlabo/capacitor-native-ui @rdlabo/ionic-theme-ios26 \
  @rdlabo/ionic-theme-ios27 @rdlabo/ionic-theme-md3 \
  @erkamyaman/capacitor-foldable@8
npm install --save-dev sass
```

## 2. 両方のテーマを設定する

`src/global.scss` などのグローバル Sass ファイルを編集し、Ionic の基本スタイルの後にテーマを読み込みます。`@use 'sass:meta'` はファイルの先頭に置きます。既存の Ionic ダークパレットとテーマのインポートをこの構成に置き換え、アプリ独自の上書きはテーマの後に残します。`ion-palette-dark` クラスは手順3の配色コントローラーが管理します。

```scss:src/global.scss
@use 'sass:meta';

@include meta.load-css('@ionic/core/css/palettes/dark.class.css');

@supports not (overflow-anchor: auto) {
  @include meta.load-css('@rdlabo/ionic-theme-ios26/src/styles/default-variables');
  @include meta.load-css('@rdlabo/ionic-theme-ios26/src/styles/ionic-theme-ios26');
  @include meta.load-css('@rdlabo/ionic-theme-ios26/src/styles/ionic-theme-ios26-dark-class');
  @include meta.load-css('@rdlabo/ionic-theme-ios26/src/styles/md-remove-ios-class-effect');
  @include meta.load-css('@rdlabo/ionic-theme-ios27/src/styles/vertical-bars');
}

@supports (overflow-anchor: auto) {
  @include meta.load-css('@rdlabo/ionic-theme-ios27/src/styles/default-variables');
  @include meta.load-css('@rdlabo/ionic-theme-ios27/src/styles/ionic-theme-ios27');
  @include meta.load-css('@rdlabo/ionic-theme-ios27/src/styles/ionic-theme-ios27-dark-class');
  @include meta.load-css('@rdlabo/ionic-theme-ios27/src/styles/md-remove-ios-class-effect');
}

@include meta.load-css('@rdlabo/ionic-theme-md3/dist/styles/theme.css');
```

Sass が `node_modules` のパッケージを参照できるようにします。Angular では `angular.json` のアプリのビルドオプションに次を追加します。別のビルドツールでは、同等の Sass 読み込みパスを設定してください。

```json
"stylePreprocessorOptions": {
  "includePaths": ["node_modules"]
}
```

iOS の基本は iOS 26 テーマです。`overflow-anchor: auto` に対応するブラウザーでは iOS 27 に切り替えます。OS のバージョン判定ではなく、ブラウザーの機能判定です。Material Design モードでは MD3 を使います。Vertical Bars のレイアウトスタイルは両方の iOS 構成に含めています。

既存の Ionic 初期化処理を実行する前に、対応するプリセットを選びます。アプリ独自の Ionic オプションも維持して適用してください。

```ts
import { Capacitor } from '@capacitor/core';
import { ios26ThemeConfig } from '@rdlabo/ionic-theme-ios26';
import { ios27ThemeConfig } from '@rdlabo/ionic-theme-ios27';
import { md3ThemeConfig } from '@rdlabo/ionic-theme-md3';

const iosConfig =
  typeof CSS !== 'undefined' && CSS.supports('overflow-anchor: auto')
    ? ios27ThemeConfig
    : ios26ThemeConfig;
const ionicConfig = Capacitor.getPlatform() === 'ios' ? iosConfig : md3ThemeConfig;
```

| Framework         | Ionic initializer                                                   |
| ----------------- | ------------------------------------------------------------------- |
| Angular / Ionic 8 | `provideIonicAngular(ionicConfig)` from `@ionic/angular/standalone` |
| Angular / Ionic 9 | `provideIonicAngular(ionicConfig)` from `@ionic/angular`            |
| React             | `setupIonicReact(ionicConfig)` from `@ionic/react`                  |
| Vue               | `app.use(IonicVue, ionicConfig)` with `IonicVue` from `@ionic/vue`  |

ブラウザーでは、この例は MD3 を選びます。デスクトップで iOS の見た目を確認する場合は、既存の初期化設定に `mode: 'ios'` を指定し、対応する iOS プリセットを使います。テーマの導入だけではネイティブコントロールは有効になりません。

## 3. アプリシェルの描画後に起動する

`ion-app` を含むアプリシェルの描画後に、一度実行します。両機能と、必須のデバイス配置通知を接続します。

```ts
import { Capacitor } from '@capacitor/core';
import {
  enableNativeUI,
  getDynamicColorScheme,
  addDynamicColorListener,
} from '@rdlabo/capacitor-native-ui';
import { Foldable } from '@erkamyaman/capacitor-foldable';
import { resolveVerticalBarsLayout } from '@rdlabo/capacitor-native-ui/integration';
import { setVerticalBarsLayout } from '@rdlabo/ionic-theme-ios27';
import { enableDynamicColors } from '@rdlabo/ionic-theme-md3/dynamic-colors';

await enableDynamicColors({
  getScheme: getDynamicColorScheme,
  listen: addDynamicColorListener,
  mode: 'system',
  onError: console.error,
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
```

テーマのコントローラーがシステムの明暗に追従し、対応する Android では端末の配色を適用します。それ以外のプラットフォームや未対応 Android はテーマの既定色を維持します。iOS では通常のコントロールと Vertical Bars を有効にして起動し、配置購読が初期配置とディスプレイの変更を反映します。

Angular ではアプリシェルの `afterNextRender` コールバック、React や Vue ではマウント後のアプリ起動処理へ置きます。アプリが独自の明暗設定を管理する場合は、外観コントローラーを二重に作らず、[Dynamic Color ガイド](/projects/capacitor-native-ui/docs/dynamic-colors#apply-to-ionic)に従って既存設定へ接続します。

## 4. ビルド・同期・実行する

先にアプリの Web ビルドを実行します。下の例は既存の `build` スクリプトを使います。同期後、それぞれの追加済みネイティブプロジェクトを開き、シミュレーターまたは端末向けにビルドして起動します。

```sh
npm run build
npx cap sync
npx cap open ios
npx cap open android
```

SwiftPM は Engine を自動解決します。既存の CocoaPods 構成は[ネイティブプロジェクト設定](/projects/capacitor-native-ui/docs/configuration#native-project-setup)を参照してください。

## 各プラットフォームで結果を確認する

- iOS では、基本の iOS 26 テーマと、対応機能に応じた iOS 27 テーマを確認します。ライト・ダーク表示を切り替え、ページ遷移とポップオーバーで対応するアニメーションも確認します。
- iOS 26以降では、対応するコントロールがネイティブ表示になり、既存のWebイベントハンドラーで動作します。残りのWebコンテンツにはiOSテーマが適用されます。
- Android 12以降では、Material Design 3に端末のDynamic Colorが反映されます。コントロールはWebのままです。古いAndroidではテーマの既定色を使います。
- ネイティブレールに対応するデバイスでは、配置の変更にVertical Barsが追従します。それ以外のデバイスでは通常のWebレイアウトを維持します。
- ブラウザーで確認できるのはWebテーマとアプリの動作です。ネイティブコントロール、端末の配色、デバイスに応じたレールはネイティブアプリで確認してください。

## 導入後に進む

上の確認ができたら、[見た目の調整](/guides/appearance)、[ネイティブコントロールの設定](/guides/native-ui)、[デバイスレイアウトへの対応](/guides/device-layout)へ進みます。テーマだけを導入する場合は、[iOS 26 のセットアップ](/projects/ionic-theme-ios26/docs/setup)、[iOS 27 のセットアップ](/projects/ionic-theme-ios27/docs/setup)、[MD3 のセットアップ](/projects/ionic-theme-md3/docs/setup)を使います。

## 個別のオプション

これらのテーマを使わない Native UI は[既存テーマの設定](/projects/capacitor-native-ui/docs/ionic-vertical-bars)または [HTML の設定](/projects/capacitor-native-ui/docs/framework-independent)を使います。明暗設定・配色変換は [Dynamic Color](/projects/capacitor-native-ui/docs/dynamic-colors)、Native UI のオプションは[設定](/projects/capacitor-native-ui/docs/configuration)、既存構成からの移行は[移行ガイド](/projects/capacitor-native-ui/docs/migration)を参照してください。
