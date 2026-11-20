---
iosOnlyHeadings:
  [
    'Boutons de soumission',
    'Segments pleine largeur',
    'Position de la barre d’onglets',
    'Recherche sous un grand titre repliable',
  ]
ios26OnlyHeadings: ['Barre d’outils avec recherche']
md3OnlyHeadings: ['Boutons carrés', 'Interrupteurs des paramètres Android']
title: 'Balisage et classes spécifiques'
sourceRevision: 'bcabd77a20589bfe71b552a3b3a0ee4f4a26b1126ba780711b1a938703337e30'
---

# Balisage et classes spécifiques

Comparez le même HTML avec les thèmes iOS 26, iOS 27 et Material Design 3. Changez de thème au-dessus de chaque exemple.

## Désactiver le thème pour un composant

Pour conserver l’apparence Ionic standard d’un composant, ajoutez-lui `ios-theme-disabled` pour iOS 26 et 27 ou `md3-disabled` pour MD3.

```html
<ion-button>Themed</ion-button>
<ion-button class="ios-theme-disabled md3-disabled">Standard Ionic</ion-button>
```

## Boutons de soumission

Utilisez `type="submit"` pour envoyer un formulaire ou `button-submit` pour donner la même apparence à une autre action. Sous iOS 26, la couleur du texte et du liseré lumineux se règle pour chaque couleur de bouton. Par exemple, `color="danger"` utilise `--ion-color-danger-brightness`.

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

## Actions recommandées dans les overlays

Définissez le rôle de chaque bouton dans le tableau `buttons` : `preferred` pour l’action recommandée, `destructive` pour une action destructive et `cancel` pour annuler. Sans rôle, le bouton conserve son style normal. Le rôle `preferred` met l’action en évidence sans la déclencher automatiquement. Dans cet exemple, sélectionner « Save » ferme la fenêtre avec le rôle `preferred`.

Sur iOS, le bouton recommandé a un fond plein dans les deux composants. Sur MD3, il a un fond plein dans une alerte ; dans une feuille d’actions, la couleur et la graisse du texte le distinguent.

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

## Badges de barre d’outils

Placez le badge dans le bouton. Un badge vide indique une notification non lue.

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

## Éléments de liste sur deux lignes

Placez la note après le libellé pour afficher une seconde ligne.

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

## Segments pleine largeur

Sélectionnez un segment. La classe segment-style-glass active le style verre sous iOS 26 et 27.

Utilisez `segment-expand` pour donner la même largeur aux boutons. Sous iOS 27, le segment reste également compact dans une barre d’outils.

```html
<ion-segment class="segment-style-glass segment-expand" value="photos">
  <ion-segment-button value="photos">Photos</ion-segment-button>
  <ion-segment-button value="albums">Albums</ion-segment-button>
</ion-segment>
```

## Boutons carrés

La classe button-square modifie les angles sous MD3. Comparez avec le bouton standard.

```html
<ion-button>Default</ion-button> <ion-button class="button-square">Square</ion-button>
```

## Position de la barre d’onglets

Appliquez `tab-bar-position-start`, `tab-bar-position-center` ou `tab-bar-position-end` à la barre. Le début et la fin suivent le sens de lecture, en haut comme en bas.

<!-- prettier-ignore -->
```html
<ion-tab-bar slot="bottom" class="tab-bar-position-start">
  <ion-tab-button tab="home">Home</ion-tab-button>
  <ion-tab-button tab="library">Library</ion-tab-button>
</ion-tab-bar>
```

## En-têtes des listes en retrait

Placez un groupe `item-group-header` avant les éléments de liste pour présenter la section avec une icône, un titre et une description.

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

## Recherche sous un grand titre repliable

Placez `searchbar-classic` dans l’en-tête repliable et donnez une couleur à sa barre d’outils pour définir le fond du champ. Faites défiler pour replier le titre et le champ ensemble.

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

## Barre d’outils avec recherche

Sous iOS 26, `toolbar-searchbar` aligne le champ de recherche avec les boutons placés au début ou à la fin.

<!-- prettier-ignore -->
```html
<ion-toolbar class="toolbar-searchbar">
  <ion-buttons slot="start"><ion-button>Cancel</ion-button></ion-buttons>
  <ion-searchbar></ion-searchbar>
</ion-toolbar>
```

## Interrupteurs des paramètres Android

Les interrupteurs MD3 masquent les symboles marche/arrêt par défaut. Activez la propriété Ionic `enableOnOffLabels` pour les afficher.

<!-- prettier-ignore -->
```html
<ion-toggle enable-on-off-labels="true">Notifications</ion-toggle>
```

## Dispositions propres aux appareils

Sur iPad avec le thème iOS 27, régler `expandToScroll` sur `false` permet de faire défiler le contenu sans agrandir la fenêtre modale et laisse un espace sous celle-ci. Faites glisser la poignée pour ajuster sa hauteur.

Pour la charnière et le rail de l’iPhone Duo, consultez [Disposition et panneaux](/projects/ionic-theme-ios27/docs/vertical-bars-layout).

Pour appliquer les thèmes, consultez le [guide Ionic](/standard-setup).
