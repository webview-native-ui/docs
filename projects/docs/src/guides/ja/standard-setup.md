---
title: 'WebView Native UI 標準導入'
sourceRevision: '2d07f86743b5fd6d41c2e37b6a6d08966595e2ff8911c5f00f8ac30572c39519'
---

# WebView Native UI 標準導入

標準の Ionic 構成では、iPhone Duo / Vertical Bars を含む iOS のネイティブコントロールと、Android の Dynamic Color をまとめて設定します。アプリの状態、ルート、イベントハンドラーはそのまま使います。

## 導入前に確認する

Capacitor 8 の既存の Ionic アプリを使います。Foldable はバージョン8の8.5以降が必要です。

iOS のネイティブコントロールは iOS 26 以降と Xcode 26 以降が必要です。Android Dynamic Color は Android 12 以降で利用でき、古い端末は既定の配色を維持します。ネイティブレールには追加の[対応端末と OS](/projects/capacitor-native-ui/docs/vertical-bars#native-rendering)が必要です。

別の構成では、[Ionicを使わないHTML](/projects/capacitor-native-ui/docs/framework-independent)、[Cordova](/projects/cordova-native-ui/docs/readme)、[テーマだけの導入](/guides/appearance)を参照してください。

## 1. パッケージをインストールする

```sh
npm install @rdlabo/capacitor-native-ui @rdlabo/ionic-theme-ios27 @rdlabo/ionic-theme-md3 @erkamyaman/capacitor-foldable
```

## 2. 両方のテーマを設定する

Ionic の基本 CSS は維持し、次のテーマスタイルシートを使います。iOS のエントリーにはクラス方式のダークパレットと Vertical Bars の配置が含まれます。既存のシステム追従・常時ダークのパレット読み込みは、このエントリーへ置き換えます。

```css
@import '@rdlabo/ionic-theme-ios27/styles/class.css';
@import '@rdlabo/ionic-theme-md3/styles/theme.css';
```

既存の Ionic 初期化処理へ、プラットフォームに合うプリセットを渡します。

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

Web アセットをビルドして同期し、各ネイティブアプリを再ビルド・実行します。

```sh
npx cap sync
```

SwiftPM は Engine を自動解決します。既存の CocoaPods 構成は[ネイティブプロジェクト設定](/projects/capacitor-native-ui/docs/configuration#native-project-setup)を参照してください。

## 個別のオプション

これらのテーマを使わない Native UI は[既存テーマの設定](/projects/capacitor-native-ui/docs/ionic-vertical-bars)または [HTML の設定](/projects/capacitor-native-ui/docs/framework-independent)を使います。明暗設定・配色変換は [Dynamic Color](/projects/capacitor-native-ui/docs/dynamic-colors)、Native UI のオプションは[設定](/projects/capacitor-native-ui/docs/configuration)、既存構成からの移行は[移行ガイド](/projects/capacitor-native-ui/docs/migration)を参照してください。
