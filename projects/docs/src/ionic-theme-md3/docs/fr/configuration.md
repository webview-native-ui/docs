---
title: "Configuration du thème"
sourceRevision: "2d57f4924684edd7bb61d1d6a98d9a46dc779f6cbc984b04dc663b35a0ec7b52"
---

# Configuration du thème

Le [guide d’installation](setup.md) utilise la feuille de style groupée du thème MD3 et `md3ThemeConfig`. Les feuilles de style et exports d’animation individuels permettent une composition personnalisée.

## Charger les feuilles de style individuelles

Placez ces imports après le CSS de base d’Ionic et la palette sombre Ionic choisie :

```css
@import '@rdlabo/ionic-theme-md3/dist/css/default-variables.css';
@import '@rdlabo/ionic-theme-md3/dist/css/ionic-theme-md3.css';
```

Ces deux fichiers constituent `styles/theme.css`. Utilisez soit la feuille de style du thème, soit les imports individuels. Placez les personnalisations CSS de l’application après le thème.

Ionic gère la sélection de la palette sombre. Choisissez `dark.system.css`, `dark.class.css` ou `dark.always.css` dans `@ionic/core/css/palettes/` selon la politique d’apparence de votre application. [Dynamic Colors](dynamic-colors.md) gère `ion-palette-dark` et utilise `dark.class.css`.

## Configurer directement les animations

Utilisez la transition MD3 pour le mode Material Design d’Ionic dans votre initialiseur existant :

```ts
import { isPlatform } from '@ionic/core';
import { mdTransitionAnimation } from '@rdlabo/ionic-theme-md3';

const ionicConfig = {
  navAnimation: isPlatform('ios') ? undefined : mdTransitionAnimation,
};
```

Transmettez cet objet à `provideIonicAngular(ionicConfig)` d’Angular, `setupIonicReact(ionicConfig)` de React ou `app.use(IonicVue, ionicConfig)` de Vue. Angular importe `provideIonicAngular` depuis `@ionic/angular` avec Ionic 9 et depuis `@ionic/angular/standalone` avec Ionic 8. React importe `setupIonicReact` depuis `@ionic/react`, et Vue importe `IonicVue` depuis `@ionic/vue`.

La [configuration combinée des thèmes](#use-md3-and-ios-27-together) montre les transitions selon la plateforme lorsque les deux thèmes sont installés.

## Conserver la sélection existante du mode

`md3ThemeConfig` inclut `mode: 'md'` et la transition MD3. Sélectionnez sa configuration lorsque l’application choisit le mode Material Design :

```ts
import { isPlatform } from '@ionic/core';
import { md3ThemeConfig } from '@rdlabo/ionic-theme-md3';

const ionicConfig = {
  ...(isPlatform('ios') ? { mode: 'ios' as const } : md3ThemeConfig),
  // animated: false,
};
```

La branche iOS utilise l’apparence et les animations iOS standard d’Ionic. Les options après le spread remplacent les valeurs par défaut choisies, y compris un `navAnimation: undefined` explicite pour la transition par défaut d’Ionic. Consultez la [migration](migration.md#optional-simplify-the-setup) pour un exemple avant/après.

## Utiliser MD3 et iOS 27 ensemble

Installez le thème iOS 27 pour habiller les deux modes Ionic depuis la même application.

Les versions actuelles des deux thèmes nécessitent `@ionic/core` 8.8.1 ou ultérieur. Mettez Ionic à niveau avant d’utiliser cette configuration si l’application utilise la version 8.8.0 ou une version antérieure.

```bash
npm install @rdlabo/ionic-theme-ios27
```

Si votre feuille de style globale utilise Sass, initialisez les thèmes dans cet ordre :

```scss
@use '@rdlabo/ionic-theme-ios27/src/styles/default-variables.scss' as ios27-vars;
@use '@rdlabo/ionic-theme-ios27/src/styles/ionic-theme-ios27.scss';
@use '@rdlabo/ionic-theme-ios27/src/styles/ionic-theme-ios27-dark-class.scss';
@use '@rdlabo/ionic-theme-ios27/src/styles/md-remove-ios-class-effect.scss';
@use '@rdlabo/ionic-theme-md3/dist/css/default-variables.css' as md3-vars;
@use '@rdlabo/ionic-theme-md3/dist/css/ionic-theme-md3.css';
```

L’exemple utilise le mode sombre par classe d’Ionic. Votre feuille de style globale doit aussi charger la palette sombre correspondante, par exemple `@ionic/angular/css/palettes/dark.class.css` pour Angular. Si vous utilisez `dark-system` ou `dark-always`, sélectionnez la même variante pour la palette Ionic et le thème iOS 27. Consultez la [documentation du mode sombre d’Ionic](https://ionicframework.com/docs/theming/dark-mode). Les espaces de noms explicites `ios27-vars` et `md3-vars` empêchent les deux modules de variables d’utiliser le même espace de noms par défaut.

Configurez les deux implémentations de transition lorsque les deux thèmes sont installés :

```ts
import { isPlatform } from '@ionic/core';
import { iosTransitionAnimation, popoverEnterAnimation, popoverLeaveAnimation } from '@rdlabo/ionic-theme-ios27';
import { mdTransitionAnimation } from '@rdlabo/ionic-theme-md3';

const ios = isPlatform('ios');
const ionicConfig = {
  // Add application options here.
  navAnimation: ios ? iosTransitionAnimation : mdTransitionAnimation,
  popoverEnter: ios ? popoverEnterAnimation : undefined,
  popoverLeave: ios ? popoverLeaveAnimation : undefined,
};
```

Transmettez cet objet à votre initialiseur de framework existant avec les imports décrits dans [Configurer directement les animations](#configure-animations-directly).

Les objets de configuration de thème exportés peuvent aussi sélectionner les deux modes :

```ts
import { isPlatform } from '@ionic/core';
import { ios27ThemeConfig } from '@rdlabo/ionic-theme-ios27';
import { md3ThemeConfig } from '@rdlabo/ionic-theme-md3';

const ionicConfig = {
  ...(isPlatform('ios') ? ios27ThemeConfig : md3ThemeConfig),
  // animated: false,
};
```
