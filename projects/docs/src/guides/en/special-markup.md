---
iosOnlyHeadings:
  [
    'Submit buttons',
    'Full-width segments',
    'Tab bar position',
    'Classic search bar in a collapsing header',
  ]
ios26OnlyHeadings: ['Search-bar toolbars']
md3OnlyHeadings: ['Square buttons', 'Android Settings controls']
title: 'Special markup and classes'
---

# Special markup and classes

Preview Ionic markup with the iOS 26, iOS 27 and Material Design 3 themes. Switch themes above each example to compare the same HTML.

## Disable the theme for a component

To use the standard Ionic appearance on a component, add `ios-theme-disabled` for iOS 26 and 27 or `md3-disabled` for MD3.

```html
<ion-button>Themed</ion-button>
<ion-button class="ios-theme-disabled md3-disabled">Standard Ionic</ion-button>
```

## Submit buttons

Use `type="submit"` to submit a form or `button-submit` to give another action the same appearance. On iOS 26, set the text and border highlight for each button color. For example, `color="danger"` uses `--ion-color-danger-brightness`.

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

## Preferred overlay actions

Set the role on a button in the overlay’s `buttons` array. Use `preferred` for the recommended action, `destructive` for a destructive action and `cancel` to cancel. A button without a role uses the default style. The theme highlights `preferred` without invoking it automatically. Choosing Save in this example dismisses the overlay with the role `preferred`.

On iOS, the preferred button has a filled background in both overlays. MD3 fills the preferred alert button and emphasizes the action sheet row with its text color and weight.

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

Use `segment-expand` to give the buttons equal widths. On iOS 27 this also keeps the segment compact inside a toolbar.

```html
<ion-segment class="segment-style-glass segment-expand" value="photos">
  <ion-segment-button value="photos">Photos</ion-segment-button>
  <ion-segment-button value="albums">Albums</ion-segment-button>
</ion-segment>
```

## Square buttons

The button-square class changes the corner shape on MD3. Compare it with the default button.

```html
<ion-button>Default</ion-button> <ion-button class="button-square">Square</ion-button>
```

## Tab bar position

Set `tab-bar-position-start`, `tab-bar-position-center` or `tab-bar-position-end` on the bar. Start and end follow the reading direction. The classes work in both the top and bottom slots.

<!-- prettier-ignore -->
```html
<ion-tab-bar slot="bottom" class="tab-bar-position-start">
  <ion-tab-button tab="home">Home</ion-tab-button>
  <ion-tab-button tab="library">Library</ion-tab-button>
</ion-tab-bar>
```

## Inset-list section headers

Place an `item-group-header` group before the group of list items to introduce a section with an icon, title and description.

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

## Classic search bar in a collapsing header

Place `searchbar-classic` inside the collapsing header. Give its toolbar a color for the field background. Scroll the example to collapse the large title and search field together.

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

## Search-bar toolbars

On iOS 26, `toolbar-searchbar` aligns the search field with buttons in the start or end slot.

<!-- prettier-ignore -->
```html
<ion-toolbar class="toolbar-searchbar">
  <ion-buttons slot="start"><ion-button>Cancel</ion-button></ion-buttons>
  <ion-searchbar></ion-searchbar>
</ion-toolbar>
```

## Android Settings controls

MD3 toggles have no on/off symbols by default. Enable them with the Ionic `enableOnOffLabels` property.

<!-- prettier-ignore -->
```html
<ion-toggle enable-on-off-labels="true">Notifications</ion-toggle>
```

## Device-specific layouts

On iPad with the iOS 27 theme, setting `expandToScroll` to `false` on a sheet modal lets its content scroll at the current breakpoint and leaves a gap below the sheet. Drag the handle to resize it.

For the iPhone Duo hinge and vertical rail, see [Device layout and split panes](/projects/ionic-theme-ios27/docs/vertical-bars-layout).

Apply the themes to your app with the [Ionic setup guide](/standard-setup).
