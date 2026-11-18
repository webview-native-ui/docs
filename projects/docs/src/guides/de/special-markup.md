---
title: 'Spezielles Markup und Klassen'
sourceRevision: 'df7c4aa52eb4addefec5d375025f5b5e9a05956f274bcedaa062aaff7337f963'
---

# Spezielles Markup und Klassen

Vergleichen Sie dasselbe HTML mit den Themes für iOS 26, iOS 27 und Material Design 3. Wechseln Sie das Theme über dem jeweiligen Beispiel.

## Primäre Schaltflächen

Verwenden Sie für Formulare einen Submit-Button. Die Klasse button-submit gibt einer anderen Aktion dasselbe Aussehen.

```html
<ion-button type="submit" fill="solid">Submit</ion-button>
<ion-button type="button" class="button-submit" fill="solid">Continue</ion-button>
```

## Badges in der Werkzeugleiste

Platzieren Sie das Badge im Button. Ein leeres Badge kennzeichnet ungelesene Nachrichten.

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

## Zweizeilige Listeneinträge

Platzieren Sie die Notiz direkt hinter dem Label, um eine zweite Zeile anzuzeigen.

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

## Segmente in voller Breite

Wählen Sie ein Segment aus. Unter iOS 26 und 27 aktiviert segment-style-glass die Glasoptik.

```html
<ion-segment class="segment-style-glass" value="photos">
  <ion-segment-button value="photos"><ion-label>Photos</ion-label></ion-segment-button>
  <ion-segment-button value="albums"><ion-label>Albums</ion-label></ion-segment-button>
</ion-segment>
```

## Den Ionic-Standardbutton verwenden

Verwenden Sie ios-theme-disabled für iOS 26 und 27 und md3-disabled für MD3. Mit beiden Klassen behält der Button in jedem Theme sein Ionic-Standarddesign.

```html
<ion-button fill="solid">Themed</ion-button>
<ion-button fill="solid" class="ios-theme-disabled md3-disabled">Standard Ionic</ion-button>
```

## Eckige Schaltflächen

Unter MD3 verändert button-square die Ecken. Vergleichen Sie die Form mit dem Standardbutton.

```html
<ion-button fill="solid">Default</ion-button>
<ion-button fill="solid" class="button-square">Square</ion-button>
```

Die Themes lassen sich mit der [Ionic-Anleitung](/standard-setup) einrichten.
