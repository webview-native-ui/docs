---
title: iOS 27 テーマをセットアップする
---

# iOS 27 テーマをセットアップする

スタイルシート1つとテーマ設定1つで、既存の Ionic アプリに iOS 27 の外観を適用します。このガイドは、単独の iOS 27 テーマとシステム連動のダークモードを使います。ブラウザーによる iOS 26/27 の切替や MD3 との併用には[適応テーマ](https://docs.rdlabo.dev/projects/ionic-theme-ios27/docs/adaptive-themes)を使用してください。

## 始める前に

Ionic `>=8.8.1 <10` の既存の Ionic Angular・React・Vue アプリを使用し、Ionic の基本 CSS を維持します。ブラウザー専用アプリにネイティブ Capacitor プロジェクトは不要です。これは単独テーマパッケージの標準設定です。Cordova アプリは任意の [Cordova セットアップ](cordova.md)を使用します。

## 1. テーマと Foldable をインストールする

```sh
npm install @rdlabo/ionic-theme-ios27 @erkamyaman/capacitor-foldable
```

Foldable はデバイスの配置と姿勢を提供します。[デバイスレイアウト](vertical-bars-layout.md#read-the-device-layout)に従って、初期値と変更イベントを接続してください。

## 2. スタイルシートを1つ読み込む

グローバルスタイルシートで、Ionic の基本 CSS の後に追加します。既存の Ionic ダークパレットとテーマの import をこの1つに置き換え、重複読み込みを避けてください。

```css
@import '@rdlabo/ionic-theme-ios27/styles/system.css';
```

対応する Ionic ダークパレットとテーマスタイルが含まれます。手動・常時ダーク、個別の組み合わせ、アプリ独自の上書きは[設定ガイド](configuration.md#dark-mode)を参照してください。

## 3. テーマ設定を Ionic へ渡す

```ts
import { ios27ThemeConfig } from '@rdlabo/ionic-theme-ios27';

const ionicConfig = {
  ...ios27ThemeConfig,
  // animated: false,
};
```

設定は `mode: 'ios'`、画面遷移、popover のアニメーションを提供します。描画前に既存の Ionic 初期化へ渡し、アプリ固有のオプションはスプレッドの後に追加します。

| フレームワーク | オプションの適用先 |
| --- | --- |
| Angular / Ionic 8 | `@ionic/angular/standalone` の `provideIonicAngular(ionicConfig)` |
| Angular / Ionic 9 | `@ionic/angular` の `provideIonicAngular(ionicConfig)` |
| React | `@ionic/react` の `setupIonicReact(ionicConfig)` |
| Vue | `@ionic/vue` の `IonicVue` と `app.use(IonicVue, ionicConfig)` |

既存アプリは[任意の設定移行](migration.md#optional-simplify-the-setup)で、プラットフォーム別モードや独自アニメーションを維持できます。個別の CSS とアニメーション API は[設定ガイド](configuration.md)を参照してください。

## 4. 最初の画面をプレビューする

通常の開発サーバーで既存ページを開き、フレームワークの構文に合わせて `ion-content` 内に追加します。

```html
<ion-list inset="true">
  <ion-item-group>
    <ion-item><ion-label>Notifications</ion-label></ion-item>
    <ion-item><ion-label>Appearance</ion-label></ion-item>
  </ion-item-group>
</ion-list>
```

角丸の inset グループを確認します。システムのライト・ダークを切り替え、ページ遷移のアニメーションも確認してください。構造は [ion-item-group の使い方](https://docs.rdlabo.dev/projects/ionic-theme-ios27/docs/using-ion-item-group)を参照します。

| 表示の問題 | 確認事項 |
| --- | --- |
| デスクトップで Material Design の外観になる | 既存の Ionic 初期化で `mode: 'ios'` を設定する。 |
| スタイルが適用されない | Ionic の基本スタイルの後にテーマをグローバルに読み込む。 |
| ライトとダークが混在する | Ionic パレットとテーマのダーク設定を一致させる。 |
| 標準の画面遷移になる | Ionic 初期化前にアニメーションを渡す。 |

## 次の手順

- [スタイルとコンポーネントのカスタマイズ](https://docs.rdlabo.dev/projects/ionic-theme-ios27/docs/features)。
- Capacitor iOS の対応コントロールへ [Native UI を追加](https://docs.rdlabo.dev/projects/ionic-theme-ios27/docs/add-native-ui)。テーマ導入だけではネイティブコントロールは有効になりません。
- [既存テーマを維持して Vertical Bars を追加](https://docs.rdlabo.dev/projects/capacitor-native-ui/docs/ionic-vertical-bars)。
- [既存アプリの移行](https://docs.rdlabo.dev/projects/ionic-theme-ios27/docs/migration)。
