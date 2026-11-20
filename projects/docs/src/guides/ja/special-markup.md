---
iosOnlyHeadings:
  ['送信ボタン', '全幅のセグメント', 'タブバーの配置', '大見出しと一緒に折りたたむ検索バー']
ios26OnlyHeadings: ['検索バーとツールバーボタン']
md3OnlyHeadings: ['角を立てたボタン', 'Android 設定画面のトグル']
title: '特別なマークアップとクラス'
sourceRevision: 'bcabd77a20589bfe71b552a3b3a0ee4f4a26b1126ba780711b1a938703337e30'
---

# 特別なマークアップとクラス

同じHTMLをiOS 26、iOS 27、Material Design 3で表示します。各例の上部でテーマを切り替えて、形や配置、操作感を比べられます。

## コンポーネントごとにテーマを無効にする

Ionic標準の外観を使いたいコンポーネントに、iOS 26・27では `ios-theme-disabled`、MD3では `md3-disabled` を付けます。

```html
<ion-button>Themed</ion-button>
<ion-button class="ios-theme-disabled md3-disabled">Standard Ionic</ion-button>
```

## 送信ボタン

フォームの送信には `type="submit"` を使います。ほかの操作にも同じ外観を使うには `button-submit` を付けます。iOS 26では文字と縁のハイライトをボタンの色ごとに指定できます。例えば `color="danger"` には `--ion-color-danger-brightness` を設定します。

```html
<style>
  :root {
    --ion-color-primary-brightness: #96feff;
    --ion-color-danger-brightness: #ffe3e5;
  }
</style>

<ion-button type="submit" fill="solid" color="primary">Submit</ion-button>
<ion-button class="button-submit" fill="solid" color="danger">Delete</ion-button>
```

## オーバーレイの推奨アクション

各ボタンの役割は、オーバーレイの `buttons` 配列で指定します。推奨する操作には `preferred`、削除などの取り消せない操作には `destructive`、キャンセルには `cancel` を使います。省略すると通常のボタンになります。`preferred` は操作を強調する指定です。この例で「Save」を押して閉じると、返されるロールは `preferred` になります。

iOS ではどちらも推奨ボタンが塗りつぶされます。MD3 ではアラートの推奨ボタンが塗りつぶされ、アクションシートでは文字の色と太さで強調されます。

<!-- prettier-ignore -->
```html
<ion-button id="open-alert">Alert</ion-button>
<ion-alert trigger="open-alert" header="Save changes?"></ion-alert>

<ion-button id="open-sheet">Action sheet</ion-button>
<ion-action-sheet trigger="open-sheet" header="Changes"></ion-action-sheet>

<script type="module">
  const buttons = [
    { text: 'Save', role: 'preferred' },
    { text: 'Discard', role: 'destructive' },
    { text: 'Cancel', role: 'cancel' },
  ];
  document.querySelector('ion-alert').buttons = buttons;
  document.querySelector('ion-action-sheet').buttons = buttons;
</script>
```

## ツールバーボタンのバッジ

アイコンとバッジをボタンの直下に並べます。封筒の右上に未読の点、吹き出しの右上にメッセージの件数が表示されます。

<!-- prettier-ignore -->
```html
<ion-toolbar>
  <ion-buttons slot="end">
    <ion-button title="Unread mail">
      <ion-icon slot="icon-only" name="mail-outline"></ion-icon>
      <ion-badge></ion-badge>
    </ion-button>
    <ion-button title="Messages">
      <ion-icon slot="icon-only" name="chatbubbles-outline"></ion-icon>
      <ion-badge>3</ion-badge>
    </ion-button>
  </ion-buttons>
</ion-toolbar>
```

## 2行のリスト項目

インセットリスト内でラベルの直後に注記を置くと、項目名の下に説明が表示されます。

```html
<ion-content color="light">
  <ion-list inset="true">
    <ion-item-group>
      <ion-item>
        <ion-label>Network</ion-label>
        <ion-note>Wi-Fi and mobile data</ion-note>
      </ion-item>
    </ion-item-group>
  </ion-list>
</ion-content>
```

## 全幅のセグメント

タブを選んで表示を切り替えてください。iOS 26・27ではsegment-style-glassで選択部分にガラスの表現を適用できます。

各ボタンを等幅にするには `segment-expand` を使います。iOS 27 ではツールバー内でもコンパクトな高さになります。

```html
<ion-segment class="segment-style-glass segment-expand" value="photos">
  <ion-segment-button value="photos">Photos</ion-segment-button>
  <ion-segment-button value="albums">Albums</ion-segment-button>
</ion-segment>
```

## 角を立てたボタン

MD3ではbutton-squareでボタンの角を立てられます。標準のボタンと並べて比較できます。

```html
<ion-button>Default</ion-button> <ion-button class="button-square">Square</ion-button>
```

## タブバーの配置

タブバーに `tab-bar-position-start`、`tab-bar-position-center`、`tab-bar-position-end` のいずれかを付けます。開始端と終了端は文字の向きに従います。上部・下部どちらのタブバーにも使えます。

<!-- prettier-ignore -->
```html
<ion-tab-bar slot="bottom" class="tab-bar-position-start">
  <ion-tab-button tab="home">Home</ion-tab-button>
  <ion-tab-button tab="library">Library</ion-tab-button>
</ion-tab-bar>
```

## インセットリストの見出し

項目のグループの前に `item-group-header` を付けたグループを置くと、アイコン、タイトル、説明をまとめて表示できます。

<!-- prettier-ignore -->
```html
<ion-content color="light">
  <ion-list inset="true">
    <ion-item-group class="item-group-header">
      <ion-item>
        <ion-label>
          <ion-icon name="mail-outline"></ion-icon>
          <h2>Mail</h2>
          <ion-text>Manage your accounts.</ion-text>
        </ion-label>
      </ion-item>
    </ion-item-group>
  </ion-list>
</ion-content>
```

## 大見出しと一緒に折りたたむ検索バー

折りたたみヘッダー内の検索バーに `searchbar-classic` を付けます。ツールバーに色を指定すると、検索欄の背景に反映されます。例をスクロールすると、大見出しと検索欄が一緒に折りたたまれます。

<!-- prettier-ignore -->
```html
<div class="ion-page">
  <ion-header translucent="true">
    <ion-toolbar color="light"><ion-title>Library</ion-title></ion-toolbar>
  </ion-header>
  <ion-content fullscreen="true" color="light">
    <ion-header collapse="condense">
      <ion-toolbar color="light"><ion-title size="large">Library</ion-title></ion-toolbar>
      <ion-toolbar color="light"><ion-searchbar class="searchbar-classic"></ion-searchbar></ion-toolbar>
    </ion-header>
    <div style="min-height: 100vh">Albums</div>
  </ion-content>
</div>
```

## 検索バーとツールバーボタン

iOS 26 では、ツールバーに `toolbar-searchbar` を付けると、検索欄とその両端のボタンの位置がそろいます。

<!-- prettier-ignore -->
```html
<ion-toolbar class="toolbar-searchbar">
  <ion-buttons slot="start"><ion-button>Cancel</ion-button></ion-buttons>
  <ion-searchbar></ion-searchbar>
</ion-toolbar>
```

## Android 設定画面のトグル

MD3 のトグルは標準でオン・オフの記号を表示しません。記号を表示するには Ionic の `enableOnOffLabels` を有効にします。

<!-- prettier-ignore -->
```html
<ion-toggle enable-on-off-labels="true">Notifications</ion-toggle>
```

## 端末ごとのレイアウト

iPad の iOS 27 テーマでは、シートモーダルの `expandToScroll` を `false` にすると、シートの下に余白ができ、現在の高さのまま内容をスクロールできます。高さを変えるにはハンドルをドラッグします。

iPhone Duo のヒンジと縦レールについては[端末レイアウトと分割ペイン](/projects/ionic-theme-ios27/docs/vertical-bars-layout)を参照してください。

アプリへのテーマの適用は[Ionicアプリに導入する](/standard-setup)を参照してください。
