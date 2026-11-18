---
iosOnlyHeadings: ['送信ボタン', '全幅のセグメント']
md3OnlyHeadings: ['角を立てたボタン']
title: '特別なマークアップとクラス'
sourceRevision: '150c1bfb9b95ca9971ebd9508f5e7d7d895089d8b4e557f17d63fbbdd94f7a60'
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

```html
<ion-segment class="segment-style-glass" value="photos">
  <ion-segment-button value="photos">Photos</ion-segment-button>
  <ion-segment-button value="albums">Albums</ion-segment-button>
</ion-segment>
```

## 角を立てたボタン

MD3ではbutton-squareでボタンの角を立てられます。標準のボタンと並べて比較できます。

```html
<ion-button>Default</ion-button> <ion-button class="button-square">Square</ion-button>
```

アプリへのテーマの適用は[Ionicアプリに導入する](/standard-setup)を参照してください。
