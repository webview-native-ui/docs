---
title: Installer le thème iOS 27
sourceRevision: '5f713abce856fca7f17d1960ccba189941b8b99b01ddd439ce3b2f00e4ef968c'
headingAliases:
  '1.-installer-le-th%C3%A8me-et-foldable': '1.-installer-le-th%C3%A8me'
---

Appliquez le thème iOS 27 à une application Ionic 9 Angular, React ou Vue existante. Cette page installe uniquement le thème. Le démarrage Native UI, un projet natif Capacitor et la configuration Foldable ne sont pas nécessaires. Conservez les routes et gestionnaires existants.

## Avant de commencer

Conservez le CSS de base Ionic. Choisissez l’exemple de votre framework ci-dessous et remplacez l’initialisation existante du thème, sans initialiser Ionic une seconde fois.

## 1. Installer le thème

Installez le paquet depuis le répertoire de l’application :

```sh
npm install @rdlabo/ionic-theme-ios27
```

## 2. Charger une feuille de style

Dans la feuille globale, remplacez les imports du thème existant et de sa palette sombre Ionic par cet import après le CSS de base Ionic. Le préréglage inclut le mode sombre système et les styles de compatibilité. Aucune configuration Sass n’est nécessaire.

```css
@import '@rdlabo/ionic-theme-ios27/styles/system.css';
```

Pour le mode sombre manuel, choisissez styles/class.css et conservez le contrôle existant de la classe ion-palette-dark. Pour une application toujours sombre, choisissez styles/always.css. Ne chargez qu’un seul de ces préréglages.

## 3. Transmettre la configuration du thème à Ionic

Choisissez l’exemple de votre framework. Le préréglage fournit le mode et les animations du thème, y compris dans le navigateur. Conservez les options propres à l’application après le spread. Si l’application sélectionne volontairement différents modes par plateforme, gardez cette sélection et n’appliquez le préréglage qu’au mode correspondant.

### Angular

Dans src/app/app.config.ts, passez le préréglage au provider Ionic existant. L’exemple montre ce provider ; conservez les autres providers du tableau, notamment le routeur et HTTP.

```ts:src/app/app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideIonicAngular } from '@ionic/angular';
import { ios27ThemeConfig } from '@rdlabo/ionic-theme-ios27';

export const appConfig: ApplicationConfig = {
  providers: [provideIonicAngular({ ...ios27ThemeConfig })],
};
```

### React

Dans src/main.tsx, remplacez l’appel setupIonicReact existant par celui-ci avant le rendu de la racine React. Conservez le rendu, les routes et les imports CSS.

```ts:src/main.tsx
import { setupIonicReact } from '@ionic/react';
import { ios27ThemeConfig } from '@rdlabo/ionic-theme-ios27';

setupIonicReact({ ...ios27ThemeConfig });
```

### Vue

Dans src/main.ts, passez le préréglage lors de l’enregistrement IonicVue sur l’application existante, avant le montage. L’exemple montre cet emplacement ; conservez le routeur, les autres plugins et la séquence de montage existante.

```ts:src/main.ts
import { createApp } from 'vue';
import { IonicVue } from '@ionic/vue';
import { ios27ThemeConfig } from '@rdlabo/ionic-theme-ios27';
import App from './App.vue';

const app = createApp(App);
app.use(IonicVue, { ...ios27ThemeConfig });
app.mount('#app');
```

## 4. Prévisualiser votre premier écran

Démarrez le serveur de développement habituel et ouvrez une page existante contenant des boutons ou listes Ionic. Vérifiez l’apparence iOS, le passage clair/sombre du système et la navigation entre les pages. En mode sombre manuel ou permanent, vérifiez plutôt la politique choisie. L’installation est terminée lorsque le style est appliqué, que les contrôles et la navigation fonctionnent et que la politique d’apparence est respectée. Aucune compilation native ni appareil avec rail n’est nécessaire.

## Étapes suivantes

Le placement suivant l’appareil et les contrôles natifs sont des ajouts facultatifs. Pour suivre les rails signalés par l’appareil, utilisez [le guide de disposition](vertical-bars-layout.md#read-the-device-layout) et installez Foldable à cette étape. Pour les contrôles natifs, utilisez [l’intégration Native UI](add-native-ui.md). Le thème seul n’active pas les contrôles natifs.

Pour les styles individuels et les personnalisations, consultez [la configuration](configuration.md). Pour actualiser une intégration existante, consultez [la migration](migration.md).
