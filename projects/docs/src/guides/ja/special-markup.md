---
md3Headings: ['角を立てたボタン']
title: '特別なマークアップとクラス'
sourceRevision: '0edc4ad914ae8784dac7a83094b9e108d092127f50549ff4e41b2104b74cff88'
---

# 特別なマークアップとクラス

同じHTMLをiOS 26、iOS 27、Material Design 3で表示します。各例の上部でテーマを切り替えて、形や配置、操作感を比べられます。

## 主な送信ボタン

フォームの送信にはsubmitボタンを使います。ほかの操作にも同じ外観を使う場合はbutton-submitを指定します。 iOS 26では、CSS変数で文字と縁のハイライト色を指定します。

```html
<style>
  :root {
    --ion-color-primary-brightness: #96feff;
  }
</style>

<ion-button type="submit" color="primary">Submit</ion-button>
<ion-button class="button-submit" color="primary">Continue</ion-button>
```

## ツールバーボタンのバッジ

ツールバーのボタン内にバッジを置きます。空のバッジは未読の印、数字を入れたバッジは件数を表示します。

```html
<ion-toolbar>
  <ion-button>Mail<ion-badge></ion-badge></ion-button>
  <ion-button>Messages<ion-badge>3</ion-badge></ion-button>
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

## ボタン単位でテーマを外す

iOS 26・27ではios-theme-disabled、MD3ではmd3-disabledを指定します。両方を付けた右のボタンは、どのテーマでもIonic標準の外観になります。

```html
<ion-button>Themed</ion-button>
<ion-button class="ios-theme-disabled md3-disabled">Standard Ionic</ion-button>
```

## 角を立てたボタン

MD3ではbutton-squareでボタンの角を立てられます。標準のボタンと並べて比較できます。

```html
<ion-button>Default</ion-button> <ion-button class="button-square">Square</ion-button>
```

アプリへのテーマの適用は[Ionicアプリに導入する](/standard-setup)を参照してください。
