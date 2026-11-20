---
iosOnlyHeadings:
  [
    'Senden-Schaltflächen',
    'Segmente in voller Breite',
    'Position der Tableiste',
    'Suchleiste unter einem einklappbaren Titel',
  ]
ios26OnlyHeadings: ['Werkzeugleiste mit Suchfeld']
md3OnlyHeadings: ['Eckige Schaltflächen', 'Schalter in den Android-Einstellungen']
title: 'Spezielles Markup und Klassen'
sourceRevision: 'bcabd77a20589bfe71b552a3b3a0ee4f4a26b1126ba780711b1a938703337e30'
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

## Empfohlene Aktionen in Overlays

Geben Sie die Rolle im Array `buttons` an: `preferred` für die empfohlene Aktion, `destructive` für eine destruktive Aktion und `cancel` zum Abbrechen. Ohne Rolle gilt der Standardstil. Die Hervorhebung mit `preferred` löst die Aktion nicht automatisch aus. Wenn Sie im Beispiel „Save“ wählen, schließt sich das Overlay mit der Rolle `preferred`.

Unter iOS ist die empfohlene Aktion in beiden Komponenten farbig hinterlegt. MD3 verwendet im Alert einen gefüllten Button und hebt die Zeile im Action Sheet durch Textfarbe und Schriftstärke hervor.

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

Mit `segment-expand` werden die Schaltflächen gleich breit. Unter iOS 27 bleibt das Segment damit auch in einer Werkzeugleiste kompakt.

```html
<ion-segment class="segment-style-glass segment-expand" value="photos">
  <ion-segment-button value="photos">Photos</ion-segment-button>
  <ion-segment-button value="albums">Albums</ion-segment-button>
</ion-segment>
```

## Eckige Schaltflächen

Unter MD3 verändert button-square die Ecken. Vergleichen Sie die Form mit dem Standardbutton.

```html
<ion-button>Default</ion-button> <ion-button class="button-square">Square</ion-button>
```

## Position der Tableiste

Setzen Sie `tab-bar-position-start`, `tab-bar-position-center` oder `tab-bar-position-end` auf die Leiste. Anfang und Ende folgen der Leserichtung. Das gilt für Leisten am oberen und unteren Rand.

<!-- prettier-ignore -->
```html
<ion-tab-bar slot="bottom" class="tab-bar-position-start">
  <ion-tab-button tab="home">Home</ion-tab-button>
  <ion-tab-button tab="library">Library</ion-tab-button>
</ion-tab-bar>
```

## Abschnittsköpfe in eingerückten Listen

Setzen Sie eine Gruppe mit `item-group-header` vor die Listeneinträge, um den Abschnitt mit Symbol, Titel und Beschreibung einzuleiten.

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

## Suchleiste unter einem einklappbaren Titel

Setzen Sie `searchbar-classic` im einklappbaren Kopfbereich ein. Die Farbe der Werkzeugleiste bestimmt den Feldhintergrund. Beim Scrollen klappen Titel und Suchfeld gemeinsam ein.

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

## Werkzeugleiste mit Suchfeld

Unter iOS 26 richtet `toolbar-searchbar` das Suchfeld an den Schaltflächen am Anfang oder Ende der Werkzeugleiste aus.

<!-- prettier-ignore -->
```html
<ion-toolbar class="toolbar-searchbar">
  <ion-buttons slot="start"><ion-button>Cancel</ion-button></ion-buttons>
  <ion-searchbar></ion-searchbar>
</ion-toolbar>
```

## Schalter in den Android-Einstellungen

MD3-Schalter zeigen standardmäßig keine Ein/Aus-Symbole. Mit der Ionic-Eigenschaft `enableOnOffLabels` blenden Sie diese ein.

<!-- prettier-ignore -->
```html
<ion-toggle enable-on-off-labels="true">Notifications</ion-toggle>
```

## Gerätespezifische Layouts

Auf dem iPad mit dem iOS-27-Theme lässt sich der Inhalt eines modalen Sheets bei gleicher Höhe scrollen, wenn `expandToScroll` auf `false` steht. Unter dem Sheet bleibt ein Abstand. Ziehen Sie den Griff, um die Höhe zu ändern.

Scharnier und Navigationsleiste des iPhone Duo sind unter [Gerätelayout und geteilte Ansichten](/projects/ionic-theme-ios27/docs/vertical-bars-layout) beschrieben.

Die Themes lassen sich mit der [Ionic-Anleitung](/standard-setup) einrichten.
