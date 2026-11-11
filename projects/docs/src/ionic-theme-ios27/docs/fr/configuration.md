---
title: "Configurer le thème iOS 27"
sourceRevision: "bf27925774e3a25244c80e7c755c8e8e8731ead247ee37c373f2458d35910492"
---

# Configurer le thème iOS 27

Le [guide d’installation](setup.md) utilise une feuille de style groupée et `ios27ThemeConfig`. Ce guide décrit leurs valeurs par défaut, les personnalisations de l’application et les API individuelles de CSS et d’animation. Les applications existantes peuvent simplifier leur configuration grâce à la [migration facultative](migration.md#optional-simplify-the-setup).

## Mode sombre

Choisissez une feuille de style et chargez-la globalement après le CSS de base d’Ionic. Chaque feuille de style inclut la palette Ionic correspondante, les variables par défaut du thème, les styles des composants, les styles de compatibilité Material Design et la variante sombre du thème.

| Politique d’apparence | Feuille de style | Activation |
| --- | --- | --- |
| Système | `@rdlabo/ionic-theme-ios27/styles/system.css` | Apparence système. |
| Manuelle | `@rdlabo/ionic-theme-ios27/styles/class.css` | `ion-palette-dark` sur la racine du document. |
| Toujours sombre | `@rdlabo/ionic-theme-ios27/styles/always.css` | Toujours active. |

Pour l’apparence pilotée par classe, l’application gère le basculement de la classe.

```ts
document.documentElement.classList.toggle('ion-palette-dark', dark);
```

Remplacez les imports individuels équivalents du thème et l’import de palette sombre Ionic par la feuille de style sélectionnée pour ne charger chacune qu’une fois. Placez les personnalisations des variables CSS de l’application après la feuille de style. Les contrôles natifs héritent du marqueur d’apparence résultant. Consultez l’[héritage de l’apparence native](https://docs.rdlabo.dev/projects/capacitor-native-ui/docs/appearance).

## Composer les feuilles de style individuelles

Les imports individuels de feuilles de style restent pris en charge. Par exemple, le mode sombre système utilise l’ordre suivant après le CSS de base d’Ionic.

```css
@import '@ionic/core/css/palettes/dark.system.css';
@import '@rdlabo/ionic-theme-ios27/dist/css/default-variables.css';
@import '@rdlabo/ionic-theme-ios27/dist/css/ionic-theme-ios27.css';
@import '@rdlabo/ionic-theme-ios27/dist/css/md-remove-ios-class-effect.css';
@import '@rdlabo/ionic-theme-ios27/dist/css/ionic-theme-ios27-dark-system.css';
```

Associez la palette Ionic et la variante sombre du thème selon la même politique.

| Politique | Palette Ionic sous `@ionic/core/css/palettes/` | Variante du thème sous `@rdlabo/ionic-theme-ios27/dist/css/` |
| --- | --- | --- |
| Système | `dark.system.css` | `ionic-theme-ios27-dark-system.css` |
| Manuelle | `dark.class.css` | `ionic-theme-ios27-dark-class.css` |
| Toujours sombre | `dark.always.css` | `ionic-theme-ios27-dark-always.css` |

La feuille de compatibilité empêche les classes utilitaires propres à iOS d’affecter les composants Material Design. Pour les styles iOS 26/27 conditionnels et les combinaisons avec MD3, utilisez la [composition adaptative des thèmes](adaptive-themes.md) existante.

## Valeurs de configuration et personnalisations

`ios27ThemeConfig` est un objet de configuration Ionic typé contenant `mode: 'ios'`, `iosTransitionAnimation`, `popoverEnterAnimation` et `popoverLeaveAnimation`. Déployez-le par spread dans la configuration Ionic de l’application avant le rendu. Les propriétés ajoutées après le spread remplacent les valeurs correspondantes, y compris les valeurs `undefined` explicites.

```ts
import { ios27ThemeConfig } from '@rdlabo/ionic-theme-ios27';

const ionicConfig = {
  ...ios27ThemeConfig,
  animated: false, // Application preference overrides Ionic's default.
  popoverEnter: undefined, // Use Ionic's default popover enter animation.
};
```

Une transition personnalisée peut remplacer `navAnimation` après le spread avec la fonction d’animation de l’application. Créez un nouvel objet de configuration pour les options applicatives, afin que les autres utilisateurs de la configuration partagée conservent ses valeurs par défaut.

Transmettez cet objet à l’initialiseur Ionic existant de l’application. Utilisez `provideIonicAngular`, `setupIonicReact` ou `app.use(IonicVue, ionicConfig)` selon le framework. Le [guide d’installation](setup.md#3-pass-theme-configuration-to-ionic) répertorie les imports des frameworks.

### Conserver la sélection du mode selon la plateforme

La configuration contient le mode iOS et les animations iOS. Une application qui sélectionne son apparence selon la plateforme doit choisir la configuration entière avant l’initialisation d’Ionic. Cet exemple utilise le thème iOS 27 sur iOS et les valeurs Material Design par défaut d’Ionic ailleurs.

```ts
import { isPlatform } from '@ionic/core';
import { ios27ThemeConfig } from '@rdlabo/ionic-theme-ios27';

const ionicConfig = {
  ...(isPlatform('ios') ? ios27ThemeConfig : { mode: 'md' as const }),
  animated: false, // Optional application setting, applied on both platforms.
};
```

Conservez la politique de sélection du mode de l’application si elle diffère de cet exemple. Modifier uniquement `mode` après le spread conserve les propriétés d’animation iOS. Sélectionnez la configuration appropriée dans son ensemble lorsque le mode et les animations doivent tous deux changer. Les conditions basées sur les capacités du navigateur et la sélection multithème peuvent conserver leur [configuration adaptative](adaptive-themes.md).

## Raccorder les animations individuellement

Les exports individuels d’animation restent disponibles pour une configuration manuelle.

```ts
import { iosTransitionAnimation, popoverEnterAnimation, popoverLeaveAnimation } from '@rdlabo/ionic-theme-ios27';

const ionicConfig = {
  mode: 'ios' as const,
  navAnimation: iosTransitionAnimation,
  popoverEnter: popoverEnterAnimation,
  popoverLeave: popoverLeaveAnimation,
  // animated: false,
};
```

La transition du thème coordonne déjà Native UI lorsqu’il est activé. Les applications utilisant une transition personnalisée peuvent suivre les [instructions de l’adaptateur de transition](https://docs.rdlabo.dev/projects/capacitor-native-ui/docs/migration#native-ui-transition-adapter). Les effets supplémentaires d’onglets, de segments et de recherche sont décrits dans les [animations](animation.md).
