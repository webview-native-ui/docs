---
title: '特別なマークアップとクラス'
sourceRevision: 'df7c4aa52eb4addefec5d375025f5b5e9a05956f274bcedaa062aaff7337f963'
---

# 特別なマークアップとクラス

同じHTMLをiOS 26、iOS 27、Material Design 3で表示します。各例の上部でテーマを切り替えて、形や配置、操作感を比べられます。

## 主な送信ボタン

フォームの送信にはsubmitボタンを使います。ほかの操作にも同じ外観を使う場合はbutton-submitを指定します。

```html
<ion-button type="submit" fill="solid">Submit</ion-button>
<ion-button type="button" class="button-submit" fill="solid">Continue</ion-button>
```

## ツールバーボタンのバッジ

ツールバーのボタン内にバッジを置きます。空のバッジは未読の印、数字を入れたバッジは件数を表示します。

```html
<ion-toolbar>
  <ion-buttons slot="end">
    <ion-button aria-label="Unread"
      ><ion-icon name="mail"></ion-icon><ion-badge></ion-badge
    ></ion-button>
    <ion-button aria-label="3 messages"
      ><ion-icon name="chatbubble"></ion-icon><ion-badge>3</ion-badge></ion-button
    >
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
  <ion-segment-button value="photos"><ion-label>Photos</ion-label></ion-segment-button>
  <ion-segment-button value="albums"><ion-label>Albums</ion-label></ion-segment-button>
</ion-segment>
```

## ボタン単位でテーマを外す

iOS 26・27ではios-theme-disabled、MD3ではmd3-disabledを指定します。両方を付けた右のボタンは、どのテーマでもIonic標準の外観になります。

```html
<ion-button fill="solid">Themed</ion-button>
<ion-button fill="solid" class="ios-theme-disabled md3-disabled">Standard Ionic</ion-button>
```

## 角を立てたボタン

MD3ではbutton-squareでボタンの角を立てられます。標準のボタンと並べて比較できます。

```html
<ion-button fill="solid">Default</ion-button>
<ion-button fill="solid" class="button-square">Square</ion-button>
```

アプリへのテーマの適用は[Ionicアプリに導入する](/standard-setup)を参照してください。
