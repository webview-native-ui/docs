---
md3Headings: ['Eckige Schaltflächen']
title: 'Spezielles Markup und Klassen'
sourceRevision: '0edc4ad914ae8784dac7a83094b9e108d092127f50549ff4e41b2104b74cff88'
---

# Spezielles Markup und Klassen

Vergleichen Sie dasselbe HTML mit den Themes für iOS 26, iOS 27 und Material Design 3. Wechseln Sie das Theme über dem jeweiligen Beispiel.

## Primäre Schaltflächen

Verwenden Sie für Formulare einen Submit-Button. Die Klasse button-submit gibt einer anderen Aktion dasselbe Aussehen. Unter iOS 26 legt die CSS-Variable die Glanzfarbe für Text und Rand fest.

```html
<style>
  :root {
    --ion-color-primary-brightness: #96feff;
  }
</style>

<ion-button type="submit" color="primary">Submit</ion-button>
<ion-button class="button-submit" color="primary">Continue</ion-button>
```

## Badges in der Werkzeugleiste

Platzieren Sie das Badge im Button. Ein leeres Badge kennzeichnet ungelesene Nachrichten.

```html
<ion-toolbar>
  <ion-button>Mail<ion-badge></ion-badge></ion-button>
  <ion-button>Messages<ion-badge>3</ion-badge></ion-button>
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
  <ion-segment-button value="photos">Photos</ion-segment-button>
  <ion-segment-button value="albums">Albums</ion-segment-button>
</ion-segment>
```

## Den Ionic-Standardbutton verwenden

Verwenden Sie ios-theme-disabled für iOS 26 und 27 und md3-disabled für MD3. Mit beiden Klassen behält der Button in jedem Theme sein Ionic-Standarddesign.

```html
<ion-button>Themed</ion-button>
<ion-button class="ios-theme-disabled md3-disabled">Standard Ionic</ion-button>
```

## Eckige Schaltflächen

Unter MD3 verändert button-square die Ecken. Vergleichen Sie die Form mit dem Standardbutton.

```html
<ion-button>Default</ion-button> <ion-button class="button-square">Square</ion-button>
```

Die Themes lassen sich mit der [Ionic-Anleitung](/standard-setup) einrichten.
