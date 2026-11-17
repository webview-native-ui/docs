---
title: Installer le thème MD3
sourceRevision: '4bb3ca73de2c3058aaaad70af3a9155293f579b4b9675405076d8a4708cc1d6d'
---

Appliquez le thème Material Design 3 à une application Ionic 9 Angular, React ou Vue existante. Cette page installe uniquement le thème. Le démarrage Native UI, un projet natif Capacitor et la configuration Foldable ne sont pas nécessaires. Conservez les routes et gestionnaires existants.


Les différences partent d’une application existante dont l’initialisation Ionic n’a pas d’argument. Conservez routes, providers et rendu non affichés. Si des options existent, placez le préréglage avant elles pour conserver les surcharges. src/global.css désigne la feuille globale existante, par exemple src/global.scss sous Angular ; ne créez pas une seconde feuille.


Le diff part de dark.system.css et conserve le suivi de l’apparence du système. Si l’application utilise déjà des classes ou un mode toujours sombre, conservez cette politique et choisissez le préréglage correspondant plutôt que de passer à System.

## Installer le thème

Après npm, seules les dépendances sont installées ; styles et initialisation restent à configurer.

Installez le paquet depuis le répertoire de l’application :

```sh
npm install @rdlabo/ionic-theme-md3
```

## Charger la feuille de style du thème

Après ce diff, la feuille du thème est chargée ; l’initialisation Ionic reste à modifier.

Dans la feuille globale, conservez le CSS de base Ionic et la palette sombre Ionic choisie, puis chargez MD3. L’exemple utilise le mode sombre système. Si une autre palette est déjà configurée, conservez-la sans ajouter de seconde palette. Remplacez les imports individuels MD3 par cet import unique.

```diff:src/global.css
@@
 @import '@ionic/core/css/structure.css';
 @import '@ionic/core/css/palettes/dark.system.css';
+ @import '@rdlabo/ionic-theme-md3/styles/theme.css';

 :root { --app-content-width: 72rem; }
```

## Configurer Ionic

Appliquez uniquement le diff de votre framework. Styles et initialisation sont alors configurés ; la vérification navigateur reste à faire.

Choisissez l’exemple de votre framework. Le préréglage fournit le mode et les animations du thème, y compris dans le navigateur. Conservez les options propres à l’application après le spread. Si l’application sélectionne volontairement différents modes par plateforme, gardez cette sélection et n’appliquez le préréglage qu’au mode correspondant.

### Angular

Dans src/app/app.config.ts, passez le préréglage au provider Ionic existant. L’exemple montre ce provider ; conservez les autres providers du tableau, notamment le routeur et HTTP.

```diff:src/app/app.config.ts
@@
 import { ApplicationConfig } from '@angular/core';
 import { provideIonicAngular } from '@ionic/angular';
+ import { md3ThemeConfig } from '@rdlabo/ionic-theme-md3';
 import { provideRouter } from '@angular/router';
 import { routes } from './app.routes';

 export const appConfig: ApplicationConfig = {
   providers: [
     provideRouter(routes),
-     provideIonicAngular(),
+     provideIonicAngular({ ...md3ThemeConfig }),
     provideHttpClient(),
   ],
 };
```

### React

Dans src/main.tsx, remplacez l’appel setupIonicReact existant par celui-ci avant le rendu de la racine React. Conservez le rendu, les routes et les imports CSS.

```diff:src/main.tsx
@@
 import { setupIonicReact } from '@ionic/react';
+ import { md3ThemeConfig } from '@rdlabo/ionic-theme-md3';
 import { createRoot } from 'react-dom/client';
 import App from './App';
 import './global.css';

- setupIonicReact();
+ setupIonicReact({ ...md3ThemeConfig });

 createRoot(document.getElementById('root')!).render(<App />);
```

### Vue

Dans src/main.ts, passez le préréglage lors de l’enregistrement IonicVue sur l’application existante, avant le montage. L’exemple montre cet emplacement ; conservez le routeur, les autres plugins et la séquence de montage existante.

```diff:src/main.ts
@@
 import { createApp } from 'vue';
 import { IonicVue } from '@ionic/vue';
+ import { md3ThemeConfig } from '@rdlabo/ionic-theme-md3';
 import App from './App.vue';
 import router from './router';
@@

 const app = createApp(App);
- app.use(IonicVue);
+ app.use(IonicVue, { ...md3ThemeConfig });
 app.use(router);
 router.isReady().then(() => app.mount('#app'));
```

## Prévisualiser un écran

Démarrez le serveur de développement habituel et ouvrez une page existante contenant des boutons ou listes Ionic. Vérifiez l’apparence Material Design 3, le passage clair/sombre du système et la navigation entre les pages. En mode sombre manuel ou permanent, vérifiez plutôt la politique choisie. L’installation est terminée lorsque le style est appliqué, que les contrôles et la navigation fonctionnent et que la politique d’apparence est respectée. Aucune compilation native ni appareil avec rail n’est nécessaire.

Pour les styles individuels et les personnalisations, consultez [la configuration](configuration.md). Pour actualiser une intégration existante, consultez [la migration](migration.md).
