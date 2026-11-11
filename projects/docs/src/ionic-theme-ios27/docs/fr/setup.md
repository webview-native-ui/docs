---
title: "Installer le thème iOS 27"
sourceRevision: "f0a32f142c76345cff225766112b4f44065d063ad5e42882f022c1c6e2dd6693"
---

# Installer le thème iOS 27

Donnez l’apparence iOS 27 à une application Ionic existante avec une feuille de style et un objet de configuration du thème. Ce guide utilise le thème iOS 27 seul et le mode sombre système. Pour choisir les styles iOS 26/27 selon le navigateur ou utiliser MD3, consultez plutôt les [thèmes adaptatifs](https://docs.rdlabo.dev/projects/ionic-theme-ios27/docs/adaptive-themes).

## Avant de commencer

Utilisez une application Ionic Angular, React ou Vue existante avec Ionic `>=8.8.1 <10`. Conservez les imports CSS de base d’Ionic. Les applications limitées au navigateur n’ont pas besoin de projet Capacitor natif. Il s’agit de la configuration standard du package de thème autonome ; les applications Cordova utilisent la [configuration Cordova](cordova.md) facultative.

## 1. Installer le thème et Foldable

```sh
npm install @rdlabo/ionic-theme-ios27 @erkamyaman/capacitor-foldable
```

Foldable fournit le placement et la posture de l’appareil. Raccordez ses valeurs initiales et ses événements de changement à l’aide du [guide de disposition de l’appareil](vertical-bars-layout.md#read-the-device-layout).

## 2. Charger une feuille de style

Ajoutez la feuille de style après le CSS de base d’Ionic dans votre feuille de style globale. Remplacez les imports existants du thème et de la palette sombre Ionic par cette feuille de style pour ne charger chacune qu’une fois.

```css
@import '@rdlabo/ionic-theme-ios27/styles/system.css';
```

La feuille de style inclut la palette sombre Ionic et les styles du thème correspondants. Pour une apparence manuelle ou toujours sombre, la composition des feuilles de style et les personnalisations de l’application, consultez la [configuration](configuration.md#dark-mode).

## 3. Transmettre la configuration du thème à Ionic

```ts
import { ios27ThemeConfig } from '@rdlabo/ionic-theme-ios27';

const ionicConfig = {
  ...ios27ThemeConfig,
  // animated: false,
};
```

La configuration fournit `mode: 'ios'` et les animations des transitions de page et des popovers. Transmettez-la à votre initialiseur Ionic existant avant le rendu. Ajoutez les options de l’application après le spread si nécessaire.

| Framework | Application des options |
| --- | --- |
| Angular / Ionic 8 | `provideIonicAngular(ionicConfig)` depuis `@ionic/angular/standalone` |
| Angular / Ionic 9 | `provideIonicAngular(ionicConfig)` depuis `@ionic/angular` |
| React | `setupIonicReact(ionicConfig)` depuis `@ionic/react` |
| Vue | `app.use(IonicVue, ionicConfig)` avec `IonicVue` depuis `@ionic/vue` |

Les applications existantes peuvent suivre la [migration facultative de la configuration](migration.md#optional-simplify-the-setup) pour conserver la sélection du mode selon la plateforme et les animations personnalisées. La [configuration](configuration.md) décrit les API individuelles de feuilles de style et d’animation.

## 4. Prévisualiser votre premier écran

Démarrez le serveur de développement habituel de l’application et ouvrez une page existante. Ajoutez ce balisage dans son `ion-content` en utilisant la syntaxe de composants de votre framework :

```html
<ion-list inset="true">
  <ion-item-group>
    <ion-item><ion-label>Notifications</ion-label></ion-item>
    <ion-item><ion-label>Appearance</ion-label></ion-item>
  </ion-item-group>
</ion-list>
```

Vous devriez voir un groupe en retrait aux bords arrondis. Passez le système du mode clair au mode sombre, puis naviguez entre les pages pour voir la transition du thème. Consultez [Utiliser ion-item-group](https://docs.rdlabo.dev/projects/ionic-theme-ios27/docs/using-ion-item-group) pour la structure des listes.

| Si vous voyez… | Vérifiez… |
| --- | --- |
| Des contrôles Material Design sur ordinateur | Définissez `mode: 'ios'` dans l’initialiseur Ionic existant. |
| Des contrôles sans styles | Chargez globalement la feuille de style du thème après les styles de base d’Ionic. |
| Des surfaces claires et sombres mélangées | Utilisez une seule paire correspondante de palette Ionic et de variante sombre du thème. |
| Les transitions de page par défaut | Transmettez les options d’animation avant l’initialisation d’Ionic. |

## Étapes suivantes

- [Personnaliser les styles et les composants](https://docs.rdlabo.dev/projects/ionic-theme-ios27/docs/features).
- [Ajouter Native UI](https://docs.rdlabo.dev/projects/ionic-theme-ios27/docs/add-native-ui) pour les contrôles pris en charge dans une application Capacitor iOS. L’installation du thème seule n’active pas les contrôles natifs.
- [Ajouter Vertical Bars avec un thème existant](https://docs.rdlabo.dev/projects/capacitor-native-ui/docs/ionic-vertical-bars).
- [Migrer une application existante](https://docs.rdlabo.dev/projects/ionic-theme-ios27/docs/migration).
