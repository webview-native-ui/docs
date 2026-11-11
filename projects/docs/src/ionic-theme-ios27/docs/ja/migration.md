---
title: テーマの移行
---

# テーマの移行

このガイドは独立したテーマと Capacitor 連携を更新するためのものです。Cordova 同梱のテーマを採用する場合は、[既存のテーマアプリを Cordova へ移行する](cordova.md#moving-an-existing-theme-app-to-this-integration)を参照してください。


## 任意: セットアップを簡略化する

まとめたテーマスタイルと `ios27ThemeConfig` は、既存の API に追加された便利な設定方法です。導入は任意で、既存の個別 CSS パスとアニメーションのエクスポートも引き続き使用できます。新しいアプリは[セットアップ](setup.md)、個別の設定は[設定ガイド](configuration.md)を参照してください。

### 対応するスタイルシートの組み合わせを置き換える

スタイルシートを選ぶときは、アプリの既存の外観方針を維持します。たとえば、クラスによるダークモードを使うアプリでは、Ionic の基本 CSS の後の import を次のように置き換えられます。

```diff
- @import '@ionic/core/css/palettes/dark.class.css';
- @import '@rdlabo/ionic-theme-ios27/dist/css/default-variables.css';
- @import '@rdlabo/ionic-theme-ios27/dist/css/ionic-theme-ios27.css';
- @import '@rdlabo/ionic-theme-ios27/dist/css/md-remove-ios-class-effect.css';
- @import '@rdlabo/ionic-theme-ios27/dist/css/ionic-theme-ios27-dark-class.css';
+ @import '@rdlabo/ionic-theme-ios27/styles/class.css';
```

既存のシステム連動ダークモードには `styles/system.css`、常時ダークには `styles/always.css` を使用します。Ionic の基本 CSS とアプリ独自の変数の上書きは維持し、上書きはスタイルシートの後に置いてください。クラスによる制御では、既存の `ion-palette-dark` の切替を維持します。対応する import をまとめて置き換え、パレットやテーマスタイルを重複して読み込まないようにします。必要なスタイルだけを独自に組み合わせているアプリは、[個別 import](configuration.md#compose-individual-stylesheets)を引き続き使用できます。

### アニメーションの既定値を置き換え、アプリのオプションを維持する

手動で組み立てたアニメーションの既定値を、テーマ設定のスプレッドに置き換えます。具体的なアプリの設定はスプレッドの後に残し、優先されるようにしてください。

```diff
- import { iosTransitionAnimation, popoverEnterAnimation, popoverLeaveAnimation } from '@rdlabo/ionic-theme-ios27';
+ import { ios27ThemeConfig } from '@rdlabo/ionic-theme-ios27';

 const ionicConfig = {
-   mode: 'ios' as const,
-   navAnimation: iosTransitionAnimation,
-   popoverEnter: popoverEnterAnimation,
-   popoverLeave: popoverLeaveAnimation,
+   ...ios27ThemeConfig,
   animated: false, // Keep this application's reduced-motion setting.
 };
```

この設定は、どのプラットフォームでも iOS モードを適用します。従来プラットフォーム別にモードを選んでいたアプリは、展開する前に設定全体を選びます。これにより、iOS 以外では Ionic 標準の Material Design 設定を維持できます。

```ts
import { isPlatform } from '@ionic/core';
import { ios27ThemeConfig } from '@rdlabo/ionic-theme-ios27';

const ionicConfig = {
  ...(isPlatform('ios') ? ios27ThemeConfig : { mode: 'md' as const }),
  animated: false, // 両プラットフォームに適用する任意のアプリ設定です。
};
```

独自のモード選択方針がある場合は、アプリの既存の判定関数を使用してください。スプレッドの後で `mode` だけを変えても、テーマ設定のアニメーションは残ります。既存のフレームワーク初期化を維持し、描画前に組み立てた設定を渡します。

独自のアニメーションや、明示的な `undefined` もスプレッドの後に指定できます。たとえば、次の設定は popover の表示アニメーションの選択を Ionic に任せます。

```ts
const ionicConfig = {
  ...ios27ThemeConfig,
  popoverEnter: undefined, // Ionic 標準の表示アニメーションを使用します。
  // navAnimation: myNavigationAnimation, // アプリ独自の画面遷移です。
};
```

導入時は、従来のテーマ既定値の代入をスプレッドに置き換えます。意図的なアプリ独自の上書きは、その後に維持します。ブラウザー機能の条件分岐や複数テーマの選択は、既存の[適応設定](adaptive-themes.md)を引き続き使えます。

導入後は、従来サポートしていたモードとライト・ダークを確認し、画面遷移と popover も検証してください。デバイスレイアウトと Native UI の起動は、それぞれの API を引き続き使用します。

## 2.1.0 からの更新

この節はテーマと Native UI の両ガイドで同じ更新を説明しています。どちらか一方に従えば十分です。既存のテーマのインポート、スタイルシート、アニメーション設定を維持してください。Native UI は引き続き任意です。有効にしている場合は、既存の `enableNativeUI()` 呼び出し、コントロールの選択、アプリルートのランタイムを維持します。以下にある以前のパッケージ分離の移行を繰り返す必要はありません。

### 依存関係の更新

テーマだけを使うアプリでは、テーマを更新します。

```sh
npm install @rdlabo/ionic-theme-ios27@latest
```

デバイスのレール寸法や Native UI を使うアプリでは、Foldable を含む3つのパッケージをすべて更新します。これらは独立してバージョン管理されています。テーマの peer dependency に従って互換性のあるバージョンを使ってください。

```sh
npm install @rdlabo/ionic-theme-ios27@latest @rdlabo/capacitor-native-ui@latest @erkamyaman/capacitor-foldable@latest
```

以下のリゾルバーのインポートは、ネイティブ投影を有効にせずレイアウト値を取得します。デバイスのレールを使わないテーマ専用アプリでは、デバイス寸法の手順を省略できます。

### デバイス寸法の更新

アプリで `getBarPlacement()` を直接 `setVerticalBarsLayout({ edge, inset })` に対応付けている場合は、リゾルバーを使い、予約領域から取得したツールバーの起点も含めます。

```diff
- import { Foldable, type BarPlacement } from '@erkamyaman/capacitor-foldable';
+ import { Foldable } from '@erkamyaman/capacitor-foldable';
+ import { resolveVerticalBarsLayout } from '@rdlabo/capacitor-native-ui/integration';
 import { setVerticalBarsLayout } from '@rdlabo/ionic-theme-ios27';

- const applyPlacement = ({ verticalBarEdge, inset }: BarPlacement) =>
-   setVerticalBarsLayout({ edge: verticalBarEdge, inset });
- const listener = await Foldable.addListener('barPlacementChange', applyPlacement);
- applyPlacement(await Foldable.getBarPlacement());
+ const updateLayout = async () => {
+   setVerticalBarsLayout(await resolveVerticalBarsLayout(Foldable));
+ };
+ const listener = await Foldable.addListener('layoutChange', () => void updateLayout());
+ await updateLayout();
```

2つ目の更新経路を追加せず、古い配置リスナーを置き換えます。既存のアプリ終了処理にある `await listener.remove()` は維持します。すでに `layoutChange` ハンドラーがある場合は、そこでリゾルバーを呼び出してください。姿勢に対応する既存の `foldStateChange` / `applyFoldStateClasses` の配線は維持します。リゾルバーが提供するのはレールの寸法だけです。

報告されたレールのレイアウトをそのまま使い、`isDeviceFoldable()`、デバイス名、ビューポートサイズの推測で適用を制限しないでください。デバイス寸法を模倣するための固定ツールバー起点の回避策は削除します。意図したアプリの CSS オーバーライドは引き続き対応しています。既定値はリゾルバーではなく、テーマの `setVerticalBarsLayout` にあります。テーマの外側ディスプレイ向け既定値は 174px で、デバイスが報告する寸法から内側ディスプレイの起点 124px を取得できます。[レイアウト値とフォールバックの動作](https://docs.rdlabo.dev/projects/ionic-theme-ios27/docs/vertical-bars-layout#apply-device-layout-values)を参照してください。

### モーダルの修正と送信ボタンの外観

フローティングカードとシートは計測した境界を使って Duo のレールとの重なりを避けるようになり、Native UI もレールに重なるフローティングダイアログを正しく認識します。モーダルのレイアウトとネイティブコントロールの処理を修正するもので、アプリのコード変更は不要です。この不具合を回避するためだけに全幅を強制する CSS を追加していた場合、その回避策を削除できます。製品の要件として全画面が必要な場合は、明示したサイズを維持してください。`ion-app` に `ios-theme-vertical-bars` または `ios-theme-fold-expanded` があると、フローティングカードとシートは左右に最低 8px の余白を残します。高さ 600px 以上のビューポートでは幅の上限が 653px、それより低いビューポートでは利用可能な幅から 16px を引いた幅になります。上部余白はセーフエリアに従い、最低 8px を確保します。シートのブレークポイントは引き続き表示の高さを制御します。`--width`、`--max-width`、`--height` によるアプリ側のサイズ設定も維持されます。どちらのレイアウトクラスも有効でない場合、通常のスマートフォンとタブレットの既定値は変わりません。

塗りつぶしの Ionic 送信ボタンは、自動で目立つネイティブのガラス表現を使います。

```html
<ion-button type="submit" fill="solid">Save</ion-button>
```

同じ外観は、塗りつぶしを使う既存の `.button-submit` アクションにも適用されます。このクラスはスタイルを提供するだけで、フォームを送信しません。clear と outline の fill には送信の強調を適用しません。既存の明示的な `data-native-ui="button-submit"` 宣言も引き続き対応しています。

ネイティブコントロールは、ナビゲーション、モーダルのアニメーション、画像へのハンドオフ中も所有権を維持します。WebView に表示される画像もネイティブ投影の表示であり、元の Web ボタンへ戻ったわけではありません。これらのコントロールを強制的に Web へ戻す、遷移専用の回避策は再検証して削除してください。意図した適用除外や、未対応のコントロール・ネイティブエラーへの対処は維持します。追加のアニメーションフラグや2つ目のランタイムは不要です。

左右両側のレール、レールの消失、折りたたみと回転、カード・シート・全画面の表示、塗りつぶしの送信アクションを確認してください。通常の iPhone とブラウザーのフォールバックも確認します。Cordova では[同梱の連携](https://github.com/webview-native-ui/cordova-plugin)を使用します。固定されたテーマとネイティブの変更は、これらの Capacitor のインストールコマンドではなく、Cordova プラグインのリリースで提供されます。

## Native UI パッケージの分離

テーマのスタイルと通常のテーマ API のインポートは引き続き利用できます。このパッケージ経由でネイティブコントロールを使用していた場合、`/native` と `/vertical-bars` エントリーは削除されています。

| 以前のインポート | 置き換え先 |
| ----------------------------------------- | ------------------------------------------- |
| `@rdlabo/ionic-theme-ios27/native`        | `@rdlabo/capacitor-native-ui`               |
| `@rdlabo/ionic-theme-ios27/vertical-bars` | `@rdlabo/capacitor-native-ui/vertical-bars` |

ネイティブパッケージをアプリの直接依存に追加し、インポートを更新して Web アセットを再ビルドし、`npx cap sync ios` を実行します。1.2.1 の起動設定とネイティブプロジェクトの変更は [Native UI 移行ガイド](/capacitor-native-ui/docs/migration)に従ってください。テーマだけを使用するアプリにはネイティブの起動やプラグインの設定は不要です。

## 2.0 のデバイスレイアウト

標準セットアップの一部として、テーマと一緒に Foldable をインストールします。

```sh
npm install @rdlabo/ionic-theme-ios27 @erkamyaman/capacitor-foldable
```

従来のデバイスレイアウト API を Foldable の購読に置き換えます。

| 以前の API | 置き換え先 |
| ------------------------------------ | ----------------------------------------------------------------------------------- |
| `DeviceLayout`、`HingeStatus` | `@erkamyaman/capacitor-foldable` の `BarPlacement`、`FoldState`、`HingeStatus` |
| `getDeviceLayout()` | `Foldable.getBarPlacement()` と `Foldable.getFoldState()` |
| `deviceLayoutChange` | `barPlacementChange` と `foldStateChange` のリスナー |
| デバイスレイアウト監視の開始・停止 | `addListener()` で購読し、終了時に各リスナーを削除 |
| WebView の角丸半径の単発取得 | Native UI の `getWebViewMetrics()` |

テーマからインポートした `setVerticalBarsLayout` で配置を、`applyFoldStateClasses` で折りたたみ状態を適用します。変更の購読に加えて初期状態も取得してください。現在の設定は[デバイスレイアウトと分割ペイン](vertical-bars-layout.md#read-the-device-layout)および[レールへの投影](../../capacitor-native-ui/docs/vertical-bars.md#use-with-capacitor-foldable)を参照してください。パッケージをインストールするだけでは、デバイスイベントの購読や投影は有効になりません。

## iOS 26 テーマからの移行

`@rdlabo/ionic-theme-ios26` を使用するアプリでは、そのパッケージを維持して `@rdlabo/ionic-theme-ios27` を追加する移行を推奨します。[環境に応じたテーマ設定](adaptive-themes.md)は、ブラウザーの機能で iOS 27/26 のスタイルを選択し、古いブラウザーでは Ionic 標準の iOS 外観を維持します。

### 1. 新しいパッケージを追加する

iOS 26 パッケージを残して iOS 27 を追加します。新しいテーマには `@ionic/core` 8.8.1 以降（Ionic 8 または 9）が必要です。

```bash
npm install @rdlabo/ionic-theme-ios27 @erkamyaman/capacitor-foldable
```

### 2. スタイルを環境に応じて切り替える

グローバル Sass スタイルシートの無条件の iOS 26 インポートを、互いに排他的な 2 つの分岐へ置き換えます。この例はクラス方式のダークモードです。

```diff
+ @use 'sass:meta';
+
- @use '@rdlabo/ionic-theme-ios26/src/styles/default-variables.scss';
- @use '@rdlabo/ionic-theme-ios26/src/styles/ionic-theme-ios26.scss';
- @use '@rdlabo/ionic-theme-ios26/src/styles/ionic-theme-ios26-dark-class.scss';
- @use '@rdlabo/ionic-theme-ios26/src/styles/md-remove-ios-class-effect.scss';
+ @supports (overflow-anchor: auto) {
+  @include meta.load-css('@rdlabo/ionic-theme-ios27/src/styles/default-variables');
+  @include meta.load-css('@rdlabo/ionic-theme-ios27/src/styles/ionic-theme-ios27');
+  @include meta.load-css('@rdlabo/ionic-theme-ios27/src/styles/ionic-theme-ios27-dark-class');
+  @include meta.load-css('@rdlabo/ionic-theme-ios27/src/styles/md-remove-ios-class-effect');
+ }
+
+ @supports (text-wrap: pretty) and (not (overflow-anchor: auto)) {
+  @include meta.load-css('@rdlabo/ionic-theme-ios26/src/styles/default-variables');
+  @include meta.load-css('@rdlabo/ionic-theme-ios26/src/styles/ionic-theme-ios26');
+  @include meta.load-css('@rdlabo/ionic-theme-ios26/src/styles/ionic-theme-ios26-dark-class');
+  @include meta.load-css('@rdlabo/ionic-theme-ios26/src/styles/md-remove-ios-class-effect');
+ }
```

対応する Ionic のダークパレットは維持します。システム連動または常時ダークモードでは、両方の `-dark-class` を対応するバリアントに置き換えます。`md-ion-list-inset` を使用する場合は各分岐内で対応パッケージのスタイルシートを読み込んでください。どちらの機能にも非対応のブラウザーでは Ionic 標準のスタイルを維持します。

### 3. アニメーションを切り替える

iOS 26 のアニメーションインポートを置き換え、同じブラウザー機能を条件に iOS 27 のアニメーションを有効にします。Ionic の初期化前にオプションを決定してください。

```diff
- import { iosTransitionAnimation, popoverEnterAnimation, popoverLeaveAnimation } from '@rdlabo/ionic-theme-ios26';
+ import { iosTransitionAnimation, popoverEnterAnimation, popoverLeaveAnimation } from '@rdlabo/ionic-theme-ios27';
+
+ function loadIOSAnimations() {
+  if (typeof CSS === 'undefined') return {};
+  if (!CSS.supports('overflow-anchor: auto') && !CSS.supports('text-wrap: pretty')) return {};
+
+  return {
+    navAnimation: iosTransitionAnimation,
+    popoverEnter: popoverEnterAnimation,
+    popoverLeave: popoverLeaveAnimation,
+  };
+ }

  provideIonicAngular({
-  navAnimation: isPlatform('ios') ? iosTransitionAnimation : undefined,
-  popoverEnter: isPlatform('ios') ? popoverEnterAnimation : undefined,
-  popoverLeave: isPlatform('ios') ? popoverLeaveAnimation : undefined,
+  ...(isPlatform('ios') ? loadIOSAnimations() : {}),
  });
```

iOS 27 の画面遷移とポップオーバーのアニメーションを両世代のテーマで使用します。古いブラウザーは Ionic の既定値を維持します。この例は Angular ですが、React の `setupIonicReact` や Vue の `IonicVue` にも同じオプションを渡します。

### 4. カスタマイズを更新する

アプリのテーマ変数と適用除外クラスを改名します。例:

```diff
  ion-content {
-  --ios26-content-box-shadow-rgb: 0, 0, 0;
+  --ios-theme-content-box-shadow-rgb: 0, 0, 0;
  }

- <ion-button class="ios26-disabled">Standard Ionic button</ion-button>
+ <ion-button class="ios-theme-disabled">Standard Ionic button</ion-button>
```

以前の名前は非推奨のフォールバックとして残ります。対応ブラウザーのライト・ダーク両モードで画面を確認してください。

### iOS 27 のみを使う

iOS 27 へ完全に切り替えるには、iOS 26 パッケージを削除してスタイルシートとアニメーションのインポートを置き換えます。スタイルシートの変更は次のとおりです。

```diff
- @use '@rdlabo/ionic-theme-ios26/src/styles/default-variables.scss';
- @use '@rdlabo/ionic-theme-ios26/src/styles/ionic-theme-ios26.scss';
- @use '@rdlabo/ionic-theme-ios26/src/styles/ionic-theme-ios26-dark-class.scss';
- @use '@rdlabo/ionic-theme-ios26/src/styles/md-remove-ios-class-effect.scss';
+ @use '@rdlabo/ionic-theme-ios27/src/styles/default-variables.scss';
+ @use '@rdlabo/ionic-theme-ios27/src/styles/ionic-theme-ios27.scss';
+ @use '@rdlabo/ionic-theme-ios27/src/styles/ionic-theme-ios27-dark-class.scss';
+ @use '@rdlabo/ionic-theme-ios27/src/styles/md-remove-ios-class-effect.scss';
```

アニメーションのインポートを `@rdlabo/ionic-theme-ios26` から `@rdlabo/ionic-theme-ios27` に変更します。既存の `isPlatform('ios')` 設定は維持できます。[iOS 27 のセットアップ](setup.md)を参照してください。無条件のインポートは Ionic の iOS モードを使うすべてのブラウザーに新しいスタイルを適用します。

## iOS 27 の命名

iOS 27 分岐または iOS 27 専用アプリでは `@rdlabo/ionic-theme-ios27` を使います。スタイルシートは `ionic-theme-ios27.scss` または `ionic-theme-ios27.css` と、`-dark-always`、`-dark-system`、`-dark-class` の各バリアントです。環境に応じた設定の iOS 26 分岐では iOS 26 のファイル名を維持してください。

| カスタマイズ | 現在の名前 | 以前の名前の動作 |
| ------------------- | ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| CSS 変数 | `--ios-theme-*`（例: `--ios-theme-content-box-shadow-rgb`） | 対応する `--ios26-*` は非推奨のフォールバックとして残ります。両方を指定した場合は現在の名前が優先されます。 |
| テーマ適用除外クラス | `ios-theme-disabled` | `ios26-disabled` は非推奨の別名として残ります。適宜既存のマークアップを移行してください。 |

新しいカスタマイズにはバージョンに依存しない名前を使用してください。

現在の名前は[特別なマークアップとクラス](special-markup.md)と[既定の変数](../src/styles/default-variables.scss)を参照してください。

以前の移行メモは [iOS 26 移行ガイド](https://docs.rdlabo.dev/projects/ionic-theme-ios26/docs/migration)に残しています。

## 送信ボタンの外観

送信ボタンは各 Ionic カラーの標準のコントラスト値と、iOS 27 の方向性のある縁の表現を使用するようになりました。テーマ固有の明るさの変数は削除してください。

```diff
  :root {
-  --ion-color-primary-brightness-rgb: 130, 255, 255;
-  --ion-color-primary-brightness: #96feff;
  }
```
