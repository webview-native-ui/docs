---
title: Installer le thème MD3
sourceRevision: '91bbdd037b94a24267e0e6b1d91a32cc2fff91a7894ae1b9bd0129c2594e2ccc'
---

Appliquez le thème Material Design 3 à une application Ionic 9 Angular, React ou Vue existante. Cette page installe uniquement le thème. Le démarrage Native UI, un projet natif Capacitor et la configuration Foldable ne sont pas nécessaires. Conservez les routes et gestionnaires existants.

## Installer le thème

Installez le paquet depuis le répertoire de l’application :

```sh
npm install @rdlabo/ionic-theme-md3
```

## Charger la feuille de style du thème

Dans la feuille globale, conservez le CSS de base Ionic et la palette sombre Ionic choisie, puis chargez MD3. L’exemple utilise le mode sombre système. Si une autre palette est déjà configurée, conservez-la sans ajouter de seconde palette. Remplacez les imports individuels MD3 par cet import unique.

```css
@import '@ionic/core/css/palettes/dark.system.css';
@import '@rdlabo/ionic-theme-md3/styles/theme.css';
```

## Configurer Ionic

Choisissez l’exemple de votre framework. Le préréglage fournit le mode et les animations du thème, y compris dans le navigateur. Conservez les options propres à l’application après le spread. Si l’application sélectionne volontairement différents modes par plateforme, gardez cette sélection et n’appliquez le préréglage qu’au mode correspondant.

### Angular

Dans src/app/app.config.ts, passez le préréglage au provider Ionic existant. L’exemple montre ce provider ; conservez les autres providers du tableau, notamment le routeur et HTTP.

```ts:src/app/app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideIonicAngular } from '@ionic/angular';
import { md3ThemeConfig } from '@rdlabo/ionic-theme-md3';

export const appConfig: ApplicationConfig = {
  providers: [provideIonicAngular({ ...md3ThemeConfig })],
};
```

### React

Dans src/main.tsx, remplacez l’appel setupIonicReact existant par celui-ci avant le rendu de la racine React. Conservez le rendu, les routes et les imports CSS.

```ts:src/main.tsx
import { setupIonicReact } from '@ionic/react';
import { md3ThemeConfig } from '@rdlabo/ionic-theme-md3';

setupIonicReact({ ...md3ThemeConfig });
```

### Vue

Dans src/main.ts, passez le préréglage lors de l’enregistrement IonicVue sur l’application existante, avant le montage. L’exemple montre cet emplacement ; conservez le routeur, les autres plugins et la séquence de montage existante.

```ts:src/main.ts
import { createApp } from 'vue';
import { IonicVue } from '@ionic/vue';
import { md3ThemeConfig } from '@rdlabo/ionic-theme-md3';
import App from './App.vue';

const app = createApp(App);
app.use(IonicVue, { ...md3ThemeConfig });
app.mount('#app');
```

## Prévisualiser un écran

Démarrez le serveur de développement habituel et ouvrez une page existante contenant des boutons ou listes Ionic. Vérifiez l’apparence Material Design 3, le passage clair/sombre du système et la navigation entre les pages. En mode sombre manuel ou permanent, vérifiez plutôt la politique choisie. L’installation est terminée lorsque le style est appliqué, que les contrôles et la navigation fonctionnent et que la politique d’apparence est respectée. Aucune compilation native ni appareil avec rail n’est nécessaire.

Pour les styles individuels et les personnalisations, consultez [la configuration](configuration.md). Pour actualiser une intégration existante, consultez [la migration](migration.md).
