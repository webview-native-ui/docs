---
title: 'Balisage et classes spécifiques'
sourceRevision: 'df7c4aa52eb4addefec5d375025f5b5e9a05956f274bcedaa062aaff7337f963'
---

# Balisage et classes spécifiques

Comparez le même HTML avec les thèmes iOS 26, iOS 27 et Material Design 3. Changez de thème au-dessus de chaque exemple.

## Boutons principaux

Utilisez un bouton de soumission pour les formulaires. La classe button-submit applique la même apparence à une autre action.

```html
<ion-button type="submit" fill="solid">Submit</ion-button>
<ion-button type="button" class="button-submit" fill="solid">Continue</ion-button>
```

## Badges de barre d’outils

Placez le badge dans le bouton. Un badge vide indique une notification non lue.

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
  <ion-segment-button value="photos"><ion-label>Photos</ion-label></ion-segment-button>
  <ion-segment-button value="albums"><ion-label>Albums</ion-label></ion-segment-button>
</ion-segment>
```

## Conserver le bouton Ionic standard

Appliquez ios-theme-disabled pour iOS 26 et 27 et md3-disabled pour MD3. Avec ces deux classes, le bouton conserve son apparence Ionic standard dans chaque thème.

```html
<ion-button fill="solid">Themed</ion-button>
<ion-button fill="solid" class="ios-theme-disabled md3-disabled">Standard Ionic</ion-button>
```

## Boutons carrés

La classe button-square modifie les angles sous MD3. Comparez avec le bouton standard.

```html
<ion-button fill="solid">Default</ion-button>
<ion-button fill="solid" class="button-square">Square</ion-button>
```

Pour appliquer les thèmes, consultez le [guide Ionic](/standard-setup).
