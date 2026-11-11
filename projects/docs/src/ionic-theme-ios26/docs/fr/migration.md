---
title: "Migration"
sourceRevision: "ffdf5f0b3f847737ba5f52689f4435990c3a8abab0a1c6b8a6b77e91fe560811"
---
# Migration

Examinez chaque section plus récente que la version actuellement installée, dans l’ordre croissant. Par exemple, pour passer de 1.x à 9.0.0, effectuez les étapes de migration 2.0.0 et 3.0.0 avant d’examiner 9.0.0.

La section de configuration facultative explique comment adopter les wrappers. Les sections versionnées documentent les changements de mise à niveau et les conseils de compatibilité.


## Facultatif : simplifier la configuration

Les chemins CSS individuels et exports d’animation existants restent pris en charge. Vous pouvez adopter `ios26ThemeConfig` et une feuille de style groupée pour simplifier votre configuration. Les nouvelles applications peuvent suivre [Installer le thème](setup.md).

Remplacez les imports manuels du thème et de la palette sombre Ionic par la feuille de style correspondant à votre politique actuelle de mode sombre. Pour une application en mode sombre système, appliquez ce changement après le CSS de base d’Ionic et avant les personnalisations de l’application.

```diff
- @import '@ionic/core/css/palettes/dark.system.css';
- @import '@rdlabo/ionic-theme-ios26/dist/css/default-variables.css';
- @import '@rdlabo/ionic-theme-ios26/dist/css/ionic-theme-ios26.css';
- @import '@rdlabo/ionic-theme-ios26/dist/css/md-remove-ios-class-effect.css';
- @import '@rdlabo/ionic-theme-ios26/dist/css/ionic-theme-ios26-dark-system.css';
+ @import '@rdlabo/ionic-theme-ios26/styles/system.css';
```

Pour le mode sombre manuel, utilisez `styles/class.css` et conservez le basculement `ion-palette-dark` sur la racine du document. Pour une apparence toujours sombre, utilisez `styles/always.css`. La feuille de style inclut la palette Ionic correspondante. Conservez les styles sélectifs supplémentaires, comme `md-ion-list-inset.css`, selon les besoins actuels de votre application.

Remplacez la configuration assemblée manuellement par un spread de configuration. Cet exemple conserve une option concrète de l’application, `animated: false`, après la configuration.

```diff
- import { iosTransitionAnimation, popoverEnterAnimation, popoverLeaveAnimation } from '@rdlabo/ionic-theme-ios26';
+ import { ios26ThemeConfig } from '@rdlabo/ionic-theme-ios26';

 const ionicConfig = {
-   mode: 'ios',
-   navAnimation: iosTransitionAnimation,
-   popoverEnter: popoverEnterAnimation,
-   popoverLeave: popoverLeaveAnimation,
+   ...ios26ThemeConfig,
   animated: false,
 };
```

Transmettez l’objet au même appel `provideIonicAngular`, `setupIonicReact` ou `app.use(IonicVue, ...)` que l’application utilise déjà. Les propriétés après le spread sont prioritaires sur la configuration, y compris les animations personnalisées et les valeurs `undefined` explicitement fournies. Conservez vos options personnalisées après le spread.

La configuration définit `mode: 'ios'` et inclut les animations iOS. Conservez une politique de mode selon la plateforme en ne déployant la configuration que pour le mode iOS effectif. Cet exemple conserve la sélection de plateforme existante de l’application.

```diff
 import { isPlatform, type IonicConfig } from '@ionic/core';
- import { iosTransitionAnimation, popoverEnterAnimation, popoverLeaveAnimation } from '@rdlabo/ionic-theme-ios26';
+ import { ios26ThemeConfig } from '@rdlabo/ionic-theme-ios26';

 const mode = isPlatform('ios') ? 'ios' : 'md';
 const ionicConfig: IonicConfig = {
-   ...(mode === 'ios'
-     ? { navAnimation: iosTransitionAnimation, popoverEnter: popoverEnterAnimation, popoverLeave: popoverLeaveAnimation }
-     : {}),
+   ...(mode === 'ios' ? ios26ThemeConfig : {}),
   mode,
 };
```

Modifier `mode` après un spread inconditionnel conserve ses fonctions d’animation. Sélectionnez la configuration et le mode ensemble avant l’initialisation d’Ionic. Conservez votre politique actuelle de mode sombre lorsque vous choisissez la feuille de style groupée. Pour les options individuelles de CSS et d’animation et les recettes combinant les thèmes, consultez la [configuration](configuration.md).

## Migrer vers 9.2.0

### Noms du thème indépendants de la version

La classe de désactivation du thème et les variables CSS ont été renommées pour retirer la version de l’OS de leurs noms publics. Les anciens noms sont obsolètes ; utilisez les nouveaux dans le nouveau code et migrez les personnalisations existantes quand cela vous convient.

| Nom obsolète | Nouveau nom |
| --- | --- |
| `ios26-disabled` | `ios-theme-disabled` |
| `--ios26-content-box-shadow-rgb` | `--ios-theme-content-box-shadow-rgb` |
| `--ios26-*` (autres variables du thème) | `--ios-theme-*` (même suffixe) |

```diff
- <ion-button class="ios26-disabled">Standard Ionic button</ion-button>
+ <ion-button class="ios-theme-disabled">Standard Ionic button</ion-button>
```

```diff
ion-content {
-  --ios26-content-box-shadow-rgb: 255, 255, 255;
+  --ios-theme-content-box-shadow-rgb: 255, 255, 255;
}
```

`ios26-disabled` reste pris en charge comme alias. Les anciennes variables CSS restent acceptées comme valeurs de repli, et la nouvelle variable est prioritaire lorsque les deux sont définies. Les applications existantes peuvent donc continuer à utiliser les noms obsolètes pendant la migration. Les noms des packages et les chemins des feuilles de style restent inchangés.

## Migrer vers 9.0.0

La version 9 aligne la version majeure du thème sur Ionic Framework 9. Elle n’introduit aucun changement incompatible supplémentaire au-delà de ceux décrits dans les sections de migration précédentes.

Ionic 8 et Ionic 9 restent tous deux pris en charge. La version 9 nécessite `@ionic/core >=8.8.1 <10`.

## Migrer vers 3.0.0

### Renommer `.header-item-group` en `.item-group-header`

La classe d’un `ion-item-group` utilisé comme en-tête de section a été renommée pour correspondre à l’élément qu’elle modifie. Remplacez chaque occurrence de `.header-item-group` dans les templates et styles de l’application.

```diff
- <ion-item-group class="header-item-group">
+ <ion-item-group class="item-group-header">
    ...
  </ion-item-group>
```

L’ancienne classe n’est plus stylisée par le thème. Ce renommage s’applique également au balisage partagé avec `@rdlabo/ionic-theme-md3`.

## Migrer vers 2.0.0

### Configurer `iosTransitionAnimation`

La version 2 nécessite la transition de navigation du package. Elle suit la transition iOS par défaut d’Ionic sans l’ancien comportement `animateBackButton()`, qui animait un grand titre vers le libellé du bouton Retour.

```ts
import { isPlatform } from '@ionic/core'; // ou @ionic/angular/standalone, @ionic/react, @ionic/vue
import { iosTransitionAnimation } from '@rdlabo/ionic-theme-ios26';

// Angular
provideIonicAngular({
  // ...
  navAnimation: isPlatform('ios') ? iosTransitionAnimation : undefined,
});

// React
setupIonicReact({
  // ...
  navAnimation: isPlatform('ios') ? iosTransitionAnimation : undefined,
});

// Vue
createApp(App).use(IonicVue, {
  // ...
  navAnimation: isPlatform('ios') ? iosTransitionAnimation : undefined,
});
```

Avec cette transition configurée, `<ion-buttons><ion-back-button></ion-back-button></ion-buttons>` peut être utilisé sans les effets de transition indésirables de l’ancienne animation.

## Migrer vers 1.0.0

### Mettre à jour les chemins d’importation SCSS

Les fichiers sources ont été déplacés dans `src/styles` lors de l’ajout des fichiers JavaScript au package.

```diff
- @import '@rdlabo/ionic-theme-ios26/src/default-variables.scss';
+ @import '@rdlabo/ionic-theme-ios26/src/styles/default-variables.scss';
```

Les chemins CSS générés dans `dist` n’ont pas changé.

### Renommer `--ios26-color-background-rgb`

```diff
  :root {
-   --ios26-color-background-rgb: 255, 255, 255;
+   --ios26-content-box-shadow-rgb: 255, 255, 255;
  }
```

### Renommer les variables de luminosité

Remplacez chaque variable `--ion-color-*-brightness-rgb` par `--ion-color-*-brightness` et utilisez une valeur de couleur plutôt qu’une liste de canaux RGB.

```diff
  :root {
-   --ion-color-primary-brightness-rgb: 130, 255, 255;
+   --ion-color-primary-brightness: #96feff;
  }
```
