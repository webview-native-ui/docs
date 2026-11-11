---
title: "Configurer le thème iOS 26"
sourceRevision: "36061e46f2985d65dcea4943c29d94916962f784c7c91f1a11fd8bba6e2ba08d"
---

# Configurer le thème iOS 26

Utilisez ces feuilles de style et exports d’animation individuels pour personnaliser le thème. Pour une introduction courte à l’installation, suivez [Installer le thème](setup.md).

## Charger les styles individuellement

Conservez les styles de base d’Ionic en premier, puis chargez la palette Ionic et les fichiers du thème dans cet ordre. Cet exemple suit l’apparence sombre du système.

```css
@import '@ionic/core/css/palettes/dark.system.css';
@import '@rdlabo/ionic-theme-ios26/dist/css/default-variables.css';
@import '@rdlabo/ionic-theme-ios26/dist/css/ionic-theme-ios26.css';
@import '@rdlabo/ionic-theme-ios26/dist/css/md-remove-ios-class-effect.css';
@import '@rdlabo/ionic-theme-ios26/dist/css/ionic-theme-ios26-dark-system.css';
```

`md-remove-ios-class-effect.css` traite les classes utilitaires propres à iOS lorsque l’application utilise le mode Material Design. Chargez les personnalisations de l’application après ces imports. Pour les listes groupées en retrait sur Android, ajoutez facultativement `@rdlabo/ionic-theme-ios26/dist/css/md-ion-list-inset.css`. MD3 inclut déjà ces styles de liste.

Associez une palette Ionic à la variante correspondante du thème.

| Politique | Palette Ionic sous `@ionic/core/css/palettes/` | Thème sous `dist/css/` | Feuille de style groupée |
| --- | --- | --- | --- |
| Système | `dark.system.css` | `ionic-theme-ios26-dark-system.css` | `styles/system.css` |
| Manuelle | `dark.class.css` | `ionic-theme-ios26-dark-class.css` | `styles/class.css` |
| Toujours sombre | `dark.always.css` | `ionic-theme-ios26-dark-always.css` | `styles/always.css` |

Le mode sombre manuel utilise `ion-palette-dark` sur `document.documentElement`. Chaque feuille de style groupée inclut sa palette Ionic correspondante et les cinq imports ci-dessus. Remplacez les imports individuels correspondants lorsque vous adoptez une feuille de style groupée.

## Configurer les animations individuellement

Déterminez le mode de l’application avant l’initialisation d’Ionic et fournissez les animations de ce mode. Cet exemple conserve le mode Material Design sur les autres plateformes.

```ts
import { isPlatform, type IonicConfig } from '@ionic/core';
import { iosTransitionAnimation, popoverEnterAnimation, popoverLeaveAnimation } from '@rdlabo/ionic-theme-ios26';

const mode = isPlatform('ios') ? 'ios' : 'md';
const ionicConfig: IonicConfig = {
  ...(mode === 'ios'
    ? { navAnimation: iosTransitionAnimation, popoverEnter: popoverEnterAnimation, popoverLeave: popoverLeaveAnimation }
    : {}),
  mode,
  // animated: false,
};
```

Ajoutez à cet objet les options Ionic propres à l’application. Transmettez `ionicConfig` à l’initialiseur existant de votre framework.

| Framework | Initialiseur | Import |
| --- | --- | --- |
| Angular / Ionic 9 | `provideIonicAngular(ionicConfig)` | `@ionic/angular` |
| Angular / Ionic 8 | `provideIonicAngular(ionicConfig)` | `@ionic/angular/standalone` |
| React | `setupIonicReact(ionicConfig)` | `@ionic/react` |
| Vue | `app.use(IonicVue, ionicConfig)` | `@ionic/vue` |

## Configuration du thème et personnalisation

`ios26ThemeConfig` est un objet de configuration Ionic typé contenant `mode: 'ios'` et les animations iOS de navigation et de popover. Déployez-le par spread dans vos options Ionic, puis ajoutez les personnalisations.

```ts
import { ios26ThemeConfig } from '@rdlabo/ionic-theme-ios26';

const ionicConfig = {
  ...ios26ThemeConfig,
  // animated: false,
};
```

Les propriétés après le spread sont prioritaires, notamment les fonctions personnalisées `navAnimation`, `popoverEnter` et `popoverLeave`. Une propriété `undefined` explicite remplace aussi la valeur de configuration selon la sémantique normale du spread d’objet JavaScript. L’objet ne lit aucune variable globale du navigateur et peut être importé dans une application rendue côté serveur.

Pour sélectionner le mode selon la plateforme, ne déployez la configuration que lorsque le mode effectif est iOS. Modifier uniquement `mode` conserve les fonctions d’animation déployées : choisissez donc la configuration et le mode ensemble avant l’initialisation d’Ionic.

```ts
import { isPlatform, type IonicConfig } from '@ionic/core';
import { ios26ThemeConfig } from '@rdlabo/ionic-theme-ios26';

const mode = isPlatform('ios') ? 'ios' : 'md';
const ionicConfig: IonicConfig = {
  ...(mode === 'ios' ? ios26ThemeConfig : {}),
  mode,
  // animated: false,
};
```

Pour remplacer une configuration manuelle existante, consultez l’[adoption facultative des wrappers](migration.md#optional-simplify-the-setup).

## Facultatif : utiliser ensemble les thèmes iOS 26 et MD3

Installez MD3 pour habiller les deux modes Ionic dans la même application. Les deux thèmes nécessitent `@ionic/core` 8.8.1 ou ultérieur.

```sh
npm install @rdlabo/ionic-theme-ios26 @rdlabo/ionic-theme-md3
```

Si la feuille de style globale utilise Sass, chargez les thèmes dans cet ordre. Cet exemple utilise le mode sombre par classe. Pour une apparence système ou toujours sombre, sélectionnez la variante correspondante pour la palette Ionic et le thème iOS 26.

```scss
@use '@ionic/core/css/palettes/dark.class.css';
@use '@rdlabo/ionic-theme-ios26/src/styles/default-variables.scss' as ios26-vars;
@use '@rdlabo/ionic-theme-ios26/src/styles/ionic-theme-ios26.scss';
@use '@rdlabo/ionic-theme-ios26/src/styles/ionic-theme-ios26-dark-class.scss';
@use '@rdlabo/ionic-theme-ios26/src/styles/md-remove-ios-class-effect.scss';
@use '@rdlabo/ionic-theme-md3/dist/css/default-variables.css' as md3-vars;
@use '@rdlabo/ionic-theme-md3/dist/css/ionic-theme-md3.css';
```

Les espaces de noms explicites `ios26-vars` et `md3-vars` empêchent les modules de variables d’utiliser le même espace de noms par défaut. MD3 fournit ses styles de listes en retrait. Configurez les transitions correspondantes avant l’initialisation d’Ionic.

```ts
import { isPlatform, type IonicConfig } from '@ionic/core';
import { iosTransitionAnimation, popoverEnterAnimation, popoverLeaveAnimation } from '@rdlabo/ionic-theme-ios26';
import { mdTransitionAnimation } from '@rdlabo/ionic-theme-md3';

const mode = isPlatform('ios') ? 'ios' : 'md';
const ios = mode === 'ios';
const ionicConfig: IonicConfig = {
  navAnimation: ios ? iosTransitionAnimation : mdTransitionAnimation,
  popoverEnter: ios ? popoverEnterAnimation : undefined,
  popoverLeave: ios ? popoverLeaveAnimation : undefined,
  mode,
  // animated: false,
};
```

Transmettez cet objet à l’initialiseur de votre framework à l’aide du tableau ci-dessus.
