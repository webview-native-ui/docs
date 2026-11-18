---
iosOnlyHeadings: ['Senden-Schaltflächen', 'Segmente in voller Breite']
md3OnlyHeadings: ['Eckige Schaltflächen']
title: 'Spezielles Markup und Klassen'
sourceRevision: '150c1bfb9b95ca9971ebd9508f5e7d7d895089d8b4e557f17d63fbbdd94f7a60'
---

# Spezielles Markup und Klassen

Vergleichen Sie dasselbe HTML mit den Themes für iOS 26, iOS 27 und Material Design 3. Wechseln Sie das Theme über dem jeweiligen Beispiel.

## Das Theme für eine Komponente deaktivieren

Für das Ionic-Standarddesign einer Komponente fügen Sie ihr unter iOS 26 und 27 `ios-theme-disabled` und unter MD3 `md3-disabled` hinzu.

```html
<ion-button>Themed</ion-button>
<ion-button class="ios-theme-disabled md3-disabled">Standard Ionic</ion-button>
```

## Senden-Schaltflächen

Verwenden Sie `type="submit"` zum Absenden eines Formulars oder `button-submit` für eine andere Aktion mit demselben Aussehen. Unter iOS 26 lässt sich die Glanzfarbe für Text und Rand je nach Schaltflächenfarbe festlegen. Für `color="danger"` verwenden Sie `--ion-color-danger-brightness`.

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

## Badges in der Werkzeugleiste

Platzieren Sie das Badge im Button. Ein leeres Badge kennzeichnet ungelesene Nachrichten.

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

## Eckige Schaltflächen

Unter MD3 verändert button-square die Ecken. Vergleichen Sie die Form mit dem Standardbutton.

```html
<ion-button>Default</ion-button> <ion-button class="button-square">Square</ion-button>
```

Die Themes lassen sich mit der [Ionic-Anleitung](/standard-setup) einrichten.
