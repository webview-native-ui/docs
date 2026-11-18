---
title: 特別なマークアップとクラス
---

既存のIonicコンポーネントに属性やクラスを追加して、テーマ固有の外観を適用できます。

<a id="primary%E3%81%AEsubmit-button"></a><a id="primary-submit-buttons"></a>

## 送信ボタン

塗りつぶしの送信ボタンには、指定したIonicカラーのbrightness変数を使います。`color="danger"` の場合、前景色と縁の色を `--ion-color-danger-brightness` で設定します。

```css
:root {
  --ion-color-danger-brightness: #fff;
}
```

```html preview
<ion-button type="submit" color="danger">Submit</ion-button>
<ion-button class="button-submit" fill="solid" color="danger">Continue</ion-button>
```

buttonに `type="submit"` を指定できない場合に同じstyleを適用するには、`.button-submit` を使います。

## ツールバーボタンのバッジ

`ion-toolbar`内の`ion-button`の直下に`ion-badge`を配置します。単独のボタンと`ion-buttons`内のボタンの両方で使えます。空のバッジは未読インジケーター、`3`や`99+`のテキストは件数を表示します。インジケーターには、タグの間に空白や改行を入れず、完全に空の`<ion-badge></ion-badge>`を使います。

単独のツールバーボタン：

```html preview
<ion-toolbar>
  <ion-button slot="end" aria-label="Notifications">
    <ion-icon name="ellipsis-horizontal" slot="icon-only"></ion-icon>
    <ion-badge>3</ion-badge>
  </ion-button>
</ion-toolbar>
```

空・数値・幅広のバッジを持つボタングループ：

```html preview
<ion-toolbar>
  <ion-buttons slot="end">
    <ion-button aria-label="Unread notifications">
      <ion-icon name="ellipsis-horizontal" slot="icon-only"></ion-icon>
      <ion-badge></ion-badge>
    </ion-button>
    <ion-button aria-label="3 notifications">
      <ion-icon name="ellipsis-horizontal" slot="icon-only"></ion-icon>
      <ion-badge>3</ion-badge>
    </ion-button>
    <ion-button aria-label="99 or more notifications">
      <ion-icon name="ellipsis-horizontal" slot="icon-only"></ion-icon>
      <ion-badge>99+</ion-badge>
    </ion-button>
  </ion-buttons>
</ion-toolbar>
```

バッジの`color`プロパティでIonicの色を選びます。`hidden`または`display: none`を設定するか、バッジを削除すると、アクションのレイアウトを変えずに非表示にできます。通知の状態をアクションのアクセシブルなラベルにも含めてください。

対象はツールバーボタン直下のバッジに限られます。タブ、ツールバー外、別の子要素の中にあるバッジは既存のスタイルを維持します。ツールバー、グループ、ボタン、バッジでのテーマ無効化も引き続き使えます。

## 推奨するオーバーレイ操作

iOSのalertとaction sheetでは、ボタンに `role: 'preferred'` を設定すると、背景が `--ion-color-primary`、文字とアイコンが `--ion-color-primary-contrast` になります。押下中の背景は `--ion-color-primary-shade` です。Ionicのカスタムroleを使うテーマの規約であり、操作の自動選択・実行はしません。閉じた際のroleは `preferred` です。

```ts
const buttons = [
  { text: 'Cancel', role: 'cancel' },
  { text: 'Continue', role: 'preferred' },
];
```

roleなしと `default` は通常の文字色を使います。`cancel` はIonicのキャンセル処理、`selected` は選択状態を維持し、`destructive` は `--ios-theme-destructive-color` を使います。既存の `confirm` は推奨操作として扱いません。単に確定する操作ではなく、推奨する操作に `preferred` を使います。

テーマはiOS 26.1/26.5で計測した、中央表示でアンカーを持たない `UIAlertController` に従います。アンカー付きメニューには `ion-popover` を使ってください。`ios-theme-disabled` / `ios26-disabled` は元のIonic表示を維持します。長い内容はスクロールできます。任意の計測済みanimation builderは[実験的なアニメーション](/docs/experimental-animation)を参照してください。CSSだけではIonicのenter/leaveアニメーションを置き換えません。

## タブバーの配置

iOSの `ion-tab-bar` に `tab-bar-position-start`、`tab-bar-position-center`、`tab-bar-position-end` のいずれかを追加すると、safe area内でバー全体の配置を指定できます。`slot="top"` と `slot="bottom"` の両方で幅と押下アニメーションを維持します。startとendは文字方向に従い、RTLでは反転します。classなしの配置は変わりません。

```html
<ion-tab-bar slot="bottom" class="tab-bar-position-center">
  <ion-tab-button tab="home">Home</ion-tab-button>
  <ion-tab-button tab="settings">Settings</ion-tab-button>
</ion-tab-bar>
```

別の `ion-fab` の位置は変わらないため、そのスペースも確保してください。

## 2行のinset list item

slotを指定しない `ion-label` と `ion-note` を隣接させると、2行のitemとして表示します。iOS styleのinset list背景を使う場合はitemを `ion-item-group` で囲み、`ion-list-header` はgroupの外に置きます。

```html preview
<ion-list inset="true">
  <ion-list-header>
    <ion-label>Connections</ion-label>
  </ion-list-header>
  <ion-item-group>
    <ion-item>
      <ion-label>Network &amp; internet</ion-label>
      <ion-note>Mobile, Wi-Fi, hotspot</ion-note>
    </ion-item>
  </ion-item-group>
</ion-list>
```

通常の末尾noteとして表示したい場合は、`ion-note` に `slot="end"` を指定します。

## inset listのsection header

`.item-group-header` を `ion-item-group` に追加すると、component demo pageの先頭で使われている中央揃えのicon、title、descriptionを表示できます。

これは導入用のgroupです。通常のlist itemは、その後に置く別の `ion-item-group` に入れてください。

```html preview
<ion-list inset="true">
  <ion-item-group class="item-group-header">
    <ion-item>
      <ion-label>
        <ion-icon name="list" style="background: var(--ion-color-primary)"></ion-icon>
        <h2>Lists</h2>
        <ion-text>Inset-list examples</ion-text>
      </ion-label>
    </ion-item>
  </ion-item-group>
  <ion-item-group>
    <ion-item><ion-label>First item</ion-label></ion-item>
  </ion-item-group>
</ion-list>
```

## 幅いっぱいのsegment

`.segment-style-glass` を追加すると、タブバーと同じglass面と選択indicatorの処理を適用します。既存の寸法と文字色を維持し、スクロール可能なsegmentとIonicの公開 `--background` プロパティにも対応します。

```html
<ion-segment class="segment-style-glass" value="available">
  <ion-segment-button value="available">Available</ion-segment-button>
  <ion-segment-button value="away">Away</ion-segment-button>
</ion-segment>
```

segment buttonを利用可能な幅に均等配置する場合は `.segment-expand` を追加します。`registerSegmentEffect` を使う場合、このclassはLiquid Glass effectのsizeも変更します。

```html preview
<ion-segment class="segment-expand" value="new">
  <ion-segment-button value="new"><ion-label>New</ion-label></ion-segment-button>
  <ion-segment-button value="replied"><ion-label>Replied</ion-label></ion-segment-button>
</ion-segment>
```

## condense header内のclassic search bar

Themeはdefaultでsearch barにiOS 26の外観を適用します。`collapse="condense"` を指定した `ion-header` のlarge titleの下に表示するsearch fieldには、`.searchbar-classic` を追加します。従来の塗りつぶされたiOSの外観になり、固定headerに残らずlarge titleと一緒にcollapseします。

`color="light"` など、colorを指定したtoolbar内に配置してください。classic背景は、そのcolorのcontrast値から生成されます。

次の例はIonic標準のcollapse可能なlarge title構造です。previewをscrollするとlarge titleがcollapseし、固定headerが表示されます。

```html preview
<div class="ion-page">
  <ion-header translucent="true">
    <ion-toolbar color="light">
      <ion-title>Search</ion-title>
    </ion-toolbar>
  </ion-header>
  <ion-content color="light" fullscreen="true">
    <ion-header collapse="condense">
      <ion-toolbar color="light">
        <ion-title size="large">Search</ion-title>
      </ion-toolbar>
      <ion-toolbar color="light">
        <ion-searchbar class="searchbar-classic" placeholder="Filter results"></ion-searchbar>
      </ion-toolbar>
    </ion-header>
    <ion-list inset="true">
      <ion-item-group>
        <ion-item><ion-label>Recent item 1</ion-label></ion-item>
        <ion-item><ion-label>Recent item 2</ion-label></ion-item>
        <ion-item><ion-label>Recent item 3</ion-label></ion-item>
        <ion-item><ion-label>Recent item 4</ion-label></ion-item>
        <ion-item><ion-label>Recent item 5</ion-label></ion-item>
        <ion-item><ion-label>Recent item 6</ion-label></ion-item>
        <ion-item><ion-label>Recent item 7</ion-label></ion-item>
        <ion-item><ion-label>Recent item 8</ion-label></ion-item>
        <ion-item><ion-label>Recent item 9</ion-label></ion-item>
        <ion-item><ion-label>Recent item 10</ion-label></ion-item>
      </ion-item-group>
    </ion-list>
  </ion-content>
</div>
```

`.ion-page` wrapperによって、埋め込みpreviewが完全なrouted pageとして動作します。`ion-router-outlet` を使うapplicationでは通常、このpage containerは自動的に追加されます。Inset listとitemはscrollを実演するための十分なcontentを用意しているだけで、`.searchbar-classic` の必須要素ではありません。

## search barを含むtoolbar

search barとstartまたはend buttonを組み合わせる `ion-toolbar` には、`.toolbar-searchbar` を追加します。このclassはslot付きcontrolを中央揃えにし、search field周辺のspacingを調整します。

```html preview
<ion-toolbar class="toolbar-searchbar">
  <ion-buttons slot="start">
    <ion-button>Cancel</ion-button>
  </ion-buttons>
  <ion-searchbar></ion-searchbar>
</ion-toolbar>
```

<a id="theme%E3%82%92%E7%84%A1%E5%8A%B9%E3%81%AB%E3%81%99%E3%82%8B"></a><a id="opting-out"></a>

## コンポーネントごとにテーマを無効にする

個別の Ionic コンポーネントで標準の iOS スタイルを維持する場合は `.ios-theme-disabled` を追加します。

```html preview
<ion-button>iOS 26 theme</ion-button> <ion-button class="ios-theme-disabled">Standard Ionic button</ion-button>
```

Inset listの背景modelについては [ion-item-groupの使用方法](/docs/using-ion-item-group) を参照してください。

旧名の `ios26-disabled` と `--ios26-*` はdeprecatedの互換名・フォールバックとして利用できます。両方のCSS変数を指定した場合は `--ios-theme-*` が優先されます。詳しくは[移行ガイド](/docs/migration)を参照してください。
