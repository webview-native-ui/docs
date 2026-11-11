---
title: '移行'
code: []
scrollActiveLine: []
---

現在インストールしているバージョンより新しい節を、バージョンの昇順にすべて確認してください。例えば、1.x から 9.0.0 に更新する場合は、2.0.0 の移行手順を終えてから 9.0.0 の節を確認します。

バージョン別の節には、アプリケーションのコードまたは設定の変更が必要な項目を記載しています。次のセットアップの簡略化は任意です。

## 任意: セットアップを簡略化する

テーマスタイルシートと `md3ThemeConfig` を使うと、設定を簡略化できます。既存の個別スタイルシートのパスとアニメーションのエクスポートも引き続き使用できます。まとめたスタイルシートと設定オブジェクトは、それぞれ独立して導入できます。

### テーマスタイルシートの import を置き換える

```diff
 @import '@ionic/core/css/palettes/dark.system.css';
- @import '@rdlabo/ionic-theme-md3/dist/css/default-variables.css';
- @import '@rdlabo/ionic-theme-md3/dist/css/ionic-theme-md3.css';
+ @import '@rdlabo/ionic-theme-md3/styles/theme.css';
```

アプリで既に選択している Ionic ダークパレットは維持してください。例はシステム連動ですが、クラスによる制御や常時ダークのアプリは、それぞれに対応するパレットを維持します。Ionic の基本スタイルをこれらの import の前、アプリ独自の上書きを後に置きます。MD3 は、これらのモードで共通のテーマスタイルシートを使用します。

### アニメーションの設定を置き換える

既に Material Design モードを使用しているアプリでは、手動の設定を次のように置き換えます。

```diff
- import { mdTransitionAnimation } from '@rdlabo/ionic-theme-md3';
+ import { md3ThemeConfig } from '@rdlabo/ionic-theme-md3';

- const ionicConfig = {
-   mode: 'md' as const,
-   navAnimation: mdTransitionAnimation,
- };
+ const ionicConfig = {
+   ...md3ThemeConfig,
+   // animated: false,
+ };
```

既存のフレームワーク初期化へ、このオブジェクトを渡します。テーマ設定は `mode: 'md'` と MD3 の画面遷移を指定します。プラットフォーム別に外観を選ぶアプリでは、選択したモードに対応する設定を選びます。

```ts
import { isPlatform } from '@ionic/core';
import { md3ThemeConfig } from '@rdlabo/ionic-theme-md3';

const ionicConfig = {
  ...(isPlatform('ios') ? { mode: 'ios' as const } : md3ThemeConfig),
  // animated: false,
};
```

モードの選択はアプリが担当します。明示していたモードに対応するテーマ設定を選ぶことで、既存のモードを維持できます。アプリ独自の設定をスプレッドの後に置き、独自のアニメーションを優先してください。Ionic 標準の画面遷移を使うための、明示的な `navAnimation: undefined` も指定できます。フレームワーク別の import は[セットアップ](setup.md)、個別 API とテーマの併用は[設定ガイド](configuration.md)を参照してください。Dynamic Colors は、引き続き Ionic の[クラスによるパレット](dynamic-colors.md)を使用します。

## 9.2.0 への移行: Android Settings への整合

テンプレートの移行は不要です。この更新を適用する前に、以前のテーマ寸法を補正しているアプリの CSS を確認してください。

| コンポーネント | 以前のテーマ | 更新後のテーマ |
| --- | --- | --- |
| 標準トグル | トラック 52×32px、つまみ 24px | トラック 52×28px、つまみ 20px |
| 通常のツールバーのタイトル | 20px、開始側コントロールの隣に 4px の開始側パディング | 22px／行高 28px、開始側パディング 12px |
| 2行のインセット項目のタイトル | 18.4px、太さ 500 | 16px、太さ 400、注記 14px |
| グループ化した項目の最小高さ | 48px | 56px、ラジオコントロールを含む行は 72px |
| 見出し付きインセットリスト | 追加のリストのマージン／パディング | 見出し 56px、追加のブロック方向のマージン／パディングなし |

これらはテーマの既定値であり、内容の高さを固定するものではありません。折り返しやアプリ側のサイズ上書きは引き続き可能です。例は[リストのサイズ設定](using-ion-item-group.md#sizing-and-overrides)と [Android Settings の外観](android-settings.md)を参照してください。

デモはバツ／チェックのアイコンを自動では付けなくなりました。`applyToggleStateIcons` を明示的に呼ぶアプリでは、その動作を維持します。アイコンなしにしたい場合は呼び出しを削除し、クリーンアップを実行してください。Ionic の `enableOnOffLabels` は引き続き対応しています。

メインテーマの CSS に MD の既定フォントが含まれるようになりました。Ionic のコアスタイルの後に読み込んでください。既存の `--ion-font-family` の上書きが優先されます。アプリがフォントを指定しない場合は、ローカルの Google Sans Flex があれば使い、その後は通常のフォールバックへ進みます。TypeScript のフォントヘルパーや追加スタイルシートは不要です。フォントは同梱されないため、対応する端末と言語でテキストの折り返しを確認してください。

戻るアイコンは引き続き Ionic が管理します。名前付きの色、Material You の対応付け、ボタンごとのアイコン上書きの意味は変わりません。

## 9.0.0への移行

バージョン 9 では、テーマのメジャーバージョンを Ionic Framework 9 に揃えています。それ以前の移行手順に記載されたもの以外に、新たな破壊的変更はありません。

Ionic 8 と Ionic 9 の両方を引き続きサポートします。バージョン 9 には `@ionic/core >=8.8.0 <10` が必要です。

## 2.0.0への移行

### `.header-item-group` を `.item-group-header` に変更する

section headerとして使う `ion-item-group` のclass名を、対象elementとの一貫性を保つため変更しました。アプリケーションのtemplateとstyleにある `.header-item-group` をすべて置き換えてください。

```diff
- <ion-item-group class="header-item-group">
+ <ion-item-group class="item-group-header">
    ...
  </ion-item-group>
```

旧classはthemeでstyleされなくなりました。この変更は、`@rdlabo/ionic-theme-ios26` と共有するmarkupにも適用されます。
