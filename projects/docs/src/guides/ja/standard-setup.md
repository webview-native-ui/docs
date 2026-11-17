---
title: 'WebView Native UI 標準導入'
sourceRevision: 'd464340cef90f89bc2de11fddf7c1d14ee8d4cf989b4e08fcac1c9240e1e4a80'
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

```ts
import { Capacitor } from '@capacitor/core';
import { ios27ThemeConfig } from '@rdlabo/ionic-theme-ios27';
import { md3ThemeConfig } from '@rdlabo/ionic-theme-md3';

const ionicConfig = Capacitor.getPlatform() === 'ios' ? ios27ThemeConfig : md3ThemeConfig;
```

| Framework         | Ionic initializer                                                   |
| ----------------- | ------------------------------------------------------------------- |
| Angular / Ionic 8 | `provideIonicAngular(ionicConfig)` from `@ionic/angular/standalone` |
| Angular / Ionic 9 | `provideIonicAngular(ionicConfig)` from `@ionic/angular`            |
| React             | `setupIonicReact(ionicConfig)` from `@ionic/react`                  |
| Vue               | `app.use(IonicVue, ionicConfig)` with `IonicVue` from `@ionic/vue`  |

デスクトップでiOSの見た目を確認する場合は、既存の初期化処理に `ios27ThemeConfig` を使います。テーマだけではネイティブコントロールは有効になりません。

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

- ライト・ダーク表示と画面遷移を確認します。iOS 27の遷移プリセットは、両方のiOSテーマで共通です。
- iOS 26以降では、対応するコントロールがネイティブ表示になり、既存のWebイベントハンドラーで動作します。残りのWebコンテンツにはiOSテーマが適用されます。
- Android 12以降では、Material Design 3に端末のDynamic Colorが反映されます。コントロールはWebのままです。古いAndroidではテーマの既定色を使います。
- ネイティブレールに対応するデバイスでは、配置の変更にVertical Barsが追従します。それ以外のデバイスでは通常のWebレイアウトを維持します。
- ブラウザーで確認できるのはWebテーマとアプリの動作です。ネイティブコントロール、端末の配色、デバイスに応じたレールはネイティブアプリで確認してください。

## 導入後に進む

上の確認ができたら、[見た目の調整](/guides/appearance)、[ネイティブコントロールの設定](/guides/native-ui)、[デバイスレイアウトへの対応](/guides/device-layout)へ進みます。テーマだけを導入する場合は、[iOS 26 のセットアップ](/projects/ionic-theme-ios26/docs/setup)、[iOS 27 のセットアップ](/projects/ionic-theme-ios27/docs/setup)、[MD3 のセットアップ](/projects/ionic-theme-md3/docs/setup)を使います。

## 個別のオプション

これらのテーマを使わない Native UI は[既存テーマの設定](/projects/capacitor-native-ui/docs/ionic-vertical-bars)または [HTML の設定](/projects/capacitor-native-ui/docs/framework-independent)を使います。明暗設定・配色変換は [Dynamic Color](/projects/capacitor-native-ui/docs/dynamic-colors)、Native UI のオプションは[設定](/projects/capacitor-native-ui/docs/configuration)、既存構成からの移行は[移行ガイド](/projects/capacitor-native-ui/docs/migration)を参照してください。
