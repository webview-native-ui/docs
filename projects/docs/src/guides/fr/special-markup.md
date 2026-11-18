---
md3Headings: ['Boutons carrés']
title: 'Balisage et classes spécifiques'
sourceRevision: 'be896c36cfe2a17a3d0ea84d8a7da488bb7fef2723ec2eceaf28e08b8127f2c1'
---

# Balisage et classes spécifiques

Comparez le même HTML avec les thèmes iOS 26, iOS 27 et Material Design 3. Changez de thème au-dessus de chaque exemple.

## Désactiver le thème pour un composant

Pour conserver l’apparence Ionic standard d’un composant, ajoutez-lui `ios-theme-disabled` pour iOS 26 et 27 ou `md3-disabled` pour MD3.

```html
<ion-button>Themed</ion-button>
<ion-button class="ios-theme-disabled md3-disabled">Standard Ionic</ion-button>
```

## Boutons principaux

Utilisez un bouton de soumission pour les formulaires. La classe button-submit applique la même apparence à une autre action. Sous iOS 26, la variable CSS définit la couleur du texte et du liseré lumineux.

```html
<style>
  :root {
    --ion-color-primary-brightness: #96feff;
  }
</style>

<ion-button type="submit" color="primary">Submit</ion-button>
<ion-button class="button-submit" color="primary">Continue</ion-button>
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

```html
<ion-segment class="segment-style-glass" value="photos">
  <ion-segment-button value="photos">Photos</ion-segment-button>
  <ion-segment-button value="albums">Albums</ion-segment-button>
</ion-segment>
```

## Boutons carrés

La classe button-square modifie les angles sous MD3. Comparez avec le bouton standard.

```html
<ion-button>Default</ion-button> <ion-button class="button-square">Square</ion-button>
```

Pour appliquer les thèmes, consultez le [guide Ionic](/standard-setup).
