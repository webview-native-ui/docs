---
md3Headings: ['Square buttons']
title: 'Special markup and classes'
---

# Special markup and classes

Preview Ionic markup with the iOS 26, iOS 27 and Material Design 3 themes. Switch themes above each example to compare the same HTML.

## Primary buttons

Use a submit button for forms. The button-submit class gives another action the same appearance. On iOS 26, the brightness color sets the highlight on the text and border.

```html
<style>
  :root {
    --ion-color-primary-brightness: #96feff;
  }
</style>

<ion-button type="submit" color="primary">Submit</ion-button>
<ion-button class="button-submit" color="primary">Continue</ion-button>
```

## Toolbar badges

Place a badge inside its toolbar button. An empty badge marks unread activity.

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

## Two-line list items

Place the note immediately after the label to display a second line inside an inset group.

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

## Full-width segments

Select a segment. The segment-style-glass class applies the glass style on iOS 26 and 27.

```html
<ion-segment class="segment-style-glass" value="photos">
  <ion-segment-button value="photos">Photos</ion-segment-button>
  <ion-segment-button value="albums">Albums</ion-segment-button>
</ion-segment>
```

## Use the standard Ionic button

Use ios-theme-disabled for iOS 26 and 27, and md3-disabled for MD3. Both classes can be applied to the same button to keep its standard Ionic appearance across themes.

```html
<ion-button>Themed</ion-button>
<ion-button class="ios-theme-disabled md3-disabled">Standard Ionic</ion-button>
```

## Square buttons

The button-square class changes the corner shape on MD3. Compare it with the default button.

```html
<ion-button>Default</ion-button> <ion-button class="button-square">Square</ion-button>
```

Apply the themes to your app with the [Ionic setup guide](/standard-setup).
