---
md3Headings: ['Boutons carrés']
title: 'Balisage et classes spécifiques'
sourceRevision: '0edc4ad914ae8784dac7a83094b9e108d092127f50549ff4e41b2104b74cff88'
---

# Balisage et classes spécifiques

Comparez le même HTML avec les thèmes iOS 26, iOS 27 et Material Design 3. Changez de thème au-dessus de chaque exemple.

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

```html
<ion-toolbar>
  <ion-button>Mail<ion-badge></ion-badge></ion-button>
  <ion-button>Messages<ion-badge>3</ion-badge></ion-button>
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

## Conserver le bouton Ionic standard

Appliquez ios-theme-disabled pour iOS 26 et 27 et md3-disabled pour MD3. Avec ces deux classes, le bouton conserve son apparence Ionic standard dans chaque thème.

```html
<ion-button>Themed</ion-button>
<ion-button class="ios-theme-disabled md3-disabled">Standard Ionic</ion-button>
```

## Boutons carrés

La classe button-square modifie les angles sous MD3. Comparez avec le bouton standard.

```html
<ion-button>Default</ion-button> <ion-button class="button-square">Square</ion-button>
```

Pour appliquer les thèmes, consultez le [guide Ionic](/standard-setup).
