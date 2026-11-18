---
title: 'Special markup and classes'
---

# Special markup and classes

Preview Ionic markup with the iOS 26, iOS 27 and Material Design 3 themes. Switch themes above each example to compare the same HTML.

## Primary buttons

Use a submit button for forms. The button-submit class gives another action the same appearance.

```html
<ion-button type="submit" fill="solid">Submit</ion-button>
<ion-button type="button" class="button-submit" fill="solid">Continue</ion-button>
```

## Toolbar badges

Place a badge inside its toolbar button. An empty badge marks unread activity.

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
  <ion-segment-button value="photos"><ion-label>Photos</ion-label></ion-segment-button>
  <ion-segment-button value="albums"><ion-label>Albums</ion-label></ion-segment-button>
</ion-segment>
```

## Use the standard Ionic button

Use ios-theme-disabled for iOS 26 and 27, and md3-disabled for MD3. Both classes can be applied to the same button to keep its standard Ionic appearance across themes.

```html
<ion-button fill="solid">Themed</ion-button>
<ion-button fill="solid" class="ios-theme-disabled md3-disabled">Standard Ionic</ion-button>
```

## Square buttons

The button-square class changes the corner shape on MD3. Compare it with the default button.

```html
<ion-button fill="solid">Default</ion-button>
<ion-button fill="solid" class="button-square">Square</ion-button>
```

Apply the themes to your app with the [Ionic setup guide](/standard-setup).
