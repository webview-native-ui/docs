---
title: 'Configurer une application Ionic'
sourceRevision: 'a67ad0f183afb251096333b5a893f0b52af2159adc4999ccb9fdeea10c4cbcbb'
headingAliases:
  'avant-de-commencer': '1.-installer-les-paquets'
  'verify-installation': '5.-v%C3%A9rifier-l%E2%80%99int%C3%A9gration'
  'v%C3%A9rifier-le-r%C3%A9sultat-sur-chaque-plateforme': '5.-v%C3%A9rifier-l%E2%80%99int%C3%A9gration'
  'apr%C3%A8s-la-configuration': 'configuration-termin%C3%A9e'
---

# Configurer une application Ionic

Configurez une application Ionic + Capacitor existante avec iOS 26 comme thème iOS de base, iOS 27 sur les navigateurs compatibles et Material Design 3 sur Android. Ce guide raccorde aussi les contrôles natifs iOS, iPhone Duo / Vertical Bars et Dynamic Color Android.

## 1. Installer les paquets

```sh
npm install @rdlabo/capacitor-native-ui @rdlabo/ionic-theme-ios26 \
  @rdlabo/ionic-theme-ios27 @rdlabo/ionic-theme-md3 \
  @erkamyaman/capacitor-foldable@8
```

Pour le positionnement des barres, utilisez Foldable 8.5 ou une version 8.x ultérieure.

## 2. Configurer les deux thèmes

Les paquets sont installés. Appliquez le diff du stylesheet et uniquement celui de votre framework. Les lignes de contexte restent en place ; conservez providers, routeur et options non affichés. Les thèmes et options Ionic sont alors configurés, mais pas encore le démarrage natif.

Le diff de style utilise le fichier global existant src/global.css. Si l’application utilise global.scss ou un autre fichier, modifiez celui-ci sans créer un autre stylesheet. La palette retirée est précisément dark.system.css ; ne remplacez pas cette ligne par une palette class ou always.

Ces préréglages system conservent la politique existante de suivi clair/sombre du système. Installer un thème n’ajoute pas de priorité d’apparence pilotée par l’application. Passez aux préréglages class uniquement en ajoutant cette possibilité dans la [tâche d’apparence](/guides/appearance). Le contrôleur conserve son mode system par défaut.

<!-- prettier-ignore -->
```diff:src/global.css
@@
 @import '@ionic/core/css/core.css';
 @import '@ionic/core/css/structure.css';
- @import '@ionic/core/css/palettes/dark.system.css';
+ @import '@rdlabo/ionic-theme-ios26/styles/system.css' supports(not (overflow-anchor: auto));
+ @import '@rdlabo/ionic-theme-ios27/styles/system.css' supports(overflow-anchor: auto);
+ @import '@rdlabo/ionic-theme-md3/styles/theme.css';

 :root { --app-content-width: 72rem; }
```

Le CSS choisit iOS 26 par défaut et iOS 27 si le navigateur prend en charge `overflow-anchor: auto`. Le mode Material Design utilise MD3. Les deux styles iOS partagent `ios27ThemeConfig`, qui inclut la synchronisation des transitions natives. Passez le préréglage de la plateforme à votre initialisation Ionic existante :

Choisissez l’exemple de votre framework et remplacez l’initialisation Ionic existante. Initialisez Ionic une seule fois.

### Angular / Ionic 9

Dans la configuration existante, passez le préréglage au provider Ionic. Conservez les autres providers, notamment le routeur et HTTP.

<!-- prettier-ignore -->
```diff:src/app/app.config.ts
@@
 import { provideIonicAngular } from '@ionic/angular';
 import { provideRouter } from '@angular/router';
 import { routes } from './app.routes';
+ import { Capacitor } from '@capacitor/core';
+ import { ios27ThemeConfig } from '@rdlabo/ionic-theme-ios27';
+ import { md3ThemeConfig } from '@rdlabo/ionic-theme-md3';
+ 
+ const ionicConfig = Capacitor.getPlatform() === 'ios' ? ios27ThemeConfig : md3ThemeConfig;

 export const appConfig: ApplicationConfig = {
   providers: [
     provideRouter(routes),
-     provideIonicAngular(),
+     provideIonicAngular(ionicConfig),
     provideHttpClient(),
   ],
 };
```

### React

Dans le point d’entrée existant, exécutez ceci avant le rendu de la racine. Conservez la racine React, les routes et les imports CSS.

<!-- prettier-ignore -->
```diff:src/main.tsx
@@
 import { setupIonicReact } from '@ionic/react';
+ import { Capacitor } from '@capacitor/core';
+ import { ios27ThemeConfig } from '@rdlabo/ionic-theme-ios27';
+ import { md3ThemeConfig } from '@rdlabo/ionic-theme-md3';
 import { createRoot } from 'react-dom/client';
 import App from './App';
 import './global.css';

- setupIonicReact();
+ const ionicConfig = Capacitor.getPlatform() === 'ios' ? ios27ThemeConfig : md3ThemeConfig;
+ 
+ setupIonicReact(ionicConfig);

 createRoot(document.getElementById('root')!).render(<App />);
```

### Vue

Dans le point d’entrée existant, passez le préréglage lors de l’enregistrement d’IonicVue, avant le montage. Conservez le routeur et les autres plugins entre la création et le montage.

<!-- prettier-ignore -->
```diff:src/main.ts
@@
 import { createApp } from 'vue';
 import { IonicVue } from '@ionic/vue';
+ import { Capacitor } from '@capacitor/core';
+ import { ios27ThemeConfig } from '@rdlabo/ionic-theme-ios27';
+ import { md3ThemeConfig } from '@rdlabo/ionic-theme-md3';
 import App from './App.vue';
 import router from './router';
 import './global.css';

+ const ionicConfig = Capacitor.getPlatform() === 'ios' ? ios27ThemeConfig : md3ThemeConfig;
+ 
 const app = createApp(App);
- app.use(IonicVue);
+ app.use(IonicVue, ionicConfig);
 app.use(router);
 router.isReady().then(() => app.mount('#app'));
```

## 3. Démarrer après le rendu de la coque

Les thèmes sont configurés. Créez le module partagé avec le diff entièrement ajouté, puis modifiez la racine existante avec le seul diff de votre framework. Conservez template et routeur. Le démarrage sera appelé après rendu ; le comportement natif reste à compiler et vérifier.

<!-- prettier-ignore -->
```diff:src/native-ui.ts
+ import { Capacitor } from '@capacitor/core';
+ import { enableNativeUI, getDynamicColorScheme, addDynamicColorListener } from '@rdlabo/capacitor-native-ui';
+ import { Foldable } from '@erkamyaman/capacitor-foldable';
+ import { resolveVerticalBarsLayout } from '@rdlabo/capacitor-native-ui/integration';
+ import { setVerticalBarsLayout } from '@rdlabo/ionic-theme-ios27';
+ import { enableDynamicColors } from '@rdlabo/ionic-theme-md3/dynamic-colors';
+ 
+ let startup: Promise<void> | undefined;
+ 
+ export function startNativeUI(): Promise<void> {
+   return (startup ??= connectNativeUI());
+ }
+ 
+ async function connectNativeUI(): Promise<void> {
+   await enableDynamicColors({
+     getScheme: getDynamicColorScheme,
+     listen: addDynamicColorListener,
+   });
+ 
+   if (Capacitor.getPlatform() === 'ios') {
+     await enableNativeUI();
+ 
+     const updateLayout = async () => {
+       setVerticalBarsLayout(await resolveVerticalBarsLayout(Foldable));
+     };
+ 
+     void Foldable.addListener('layoutChange', () => void updateLayout().catch(console.error))
+       .then(updateLayout)
+       .catch(console.error);
+   }
+ }
```

### Angular

Appliquez ce diff à la racine existante. Le template et les imports affichés en contexte restent présents, avec votre menu et routeur.

<!-- prettier-ignore -->
```diff:src/app/app.component.ts
@@
- import { Component } from '@angular/core';
+ import { Component, afterNextRender } from '@angular/core';
 import { IonApp, IonRouterOutlet } from '@ionic/angular';
+ import { startNativeUI } from '../native-ui';

 @Component({
   selector: 'app-root',
   imports: [IonApp, IonRouterOutlet],
   template: '<ion-app><ion-router-outlet /></ion-app>',
 })
- export class AppComponent {}
+ export class AppComponent {
+   constructor() {
+     afterNextRender(() => {
+       void startNativeUI().catch(console.error);
+     });
+   }
+ }
```

### React

Appliquez ce diff au composant App existant. ExistingRouter représente le routeur déjà rendu par l’application ; gardez-le ainsi que ses routes.

<!-- prettier-ignore -->
```diff:src/App.tsx
@@
+ import { useEffect } from 'react';
+ import { startNativeUI } from './native-ui';
 import { IonApp } from '@ionic/react';
 import { ExistingRouter } from './router';

 export default function App() {
+   useEffect(() => {
+     void startNativeUI().catch(console.error);
+   }, []);
+ 
   return <IonApp><ExistingRouter /></IonApp>;
 }
```

### Vue

Appliquez ce diff au script App.vue existant. Template, outlet du routeur et menu restent inchangés.

<!-- prettier-ignore -->
```diff:src/App.vue
@@
 <script setup lang="ts">
+ import { onMounted } from 'vue';
 import { IonApp, IonRouterOutlet } from '@ionic/vue';
+ import { startNativeUI } from './native-ui';
+ 
+ onMounted(() => {
+   void startNativeUI().catch(console.error);
+ });
 </script>

 <template>
```

## 4. Compiler, synchroniser et exécuter

Le démarrage est raccordé. Depuis le répertoire de l’application, compilez le Web puis exécutez uniquement les commandes de la cible. Compilez et lancez le projet dans Xcode ou Android Studio. L’application contient alors les nouveaux assets et le plugin ; l’acceptation vient à l’étape 5.

```sh
npm run build
```

### iOS

```sh
npx cap sync ios
npx cap open ios
```

### Android

```sh
npx cap sync android
npx cap open android
```

SwiftPM résout Engine automatiquement. Pour CocoaPods, consultez la [configuration native](/projects/capacitor-native-ui/docs/configuration#native-project-setup).

## 5. Vérifier l’intégration

Les contrôles iOS exigent iOS 26+ et Xcode 26+. Dynamic Color Android nécessite Android 12+ ; les appareils plus anciens conservent la palette par défaut. Le rail natif exige aussi un [appareil et un OS compatibles](/projects/capacitor-native-ui/docs/vertical-bars#native-rendering).

La présentation native des contrôles Ionic pris en charge et les mises à jour de disposition sont déjà activées. Vérifiez-les ci-dessous avec vos écrans et gestionnaires existants ; aucune action de barre d’outils, composant personnalisé ou code de prévisualisation n’est à ajouter.

### Toutes les cibles : vérifications de fin

| Cible                 | Action                                                                      | Résultat attendu                                                                                                                                                          |
| --------------------- | --------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Toutes                | Ouvrir les pages, naviguer et changer le mode clair/sombre.                 | Routes, actions et contrôles Web lisibles fonctionnent.                                                                                                                   |
| iOS                   | Exécuter sous iOS 26+ avec Xcode 26+ et observer les contrôles compatibles. | Le contrôle existant compatible s’affiche nativement et son activation appelle une seule fois le gestionnaire Web d’origine. Les anciens OS conservent les contrôles Web. |
| Android               | Ouvrir l’application ; sous Android 12+, changer la palette et rouvrir.     | MD3 utilise les couleurs disponibles ; sinon, palette de repli et contrôles Web utilisables.                                                                              |
| Appareil à rail natif | Modifier puis restaurer sa disposition.                                     | Vertical Bars suit le rapport et retire l’espace. Les autres appareils gardent la disposition ordinaire.                                                                  |
| Navigateur            | Prévisualiser les thèmes et utiliser les actions.                           | Apparence et comportement Web fonctionnent, sans prouver le rendu natif, les couleurs ou les rails.                                                                       |

### iOS 26+ / Xcode 26+ seulement : ajouter l’inspection temporaire

Si un contrôle iOS conserve son apparence Web, vous pouvez examiner son état dans Safari.

Sous iOS 26+ avec Xcode 26+, inspectez une fois le runtime existant pendant la vérification. Dans la branche iOS de src/native-ui.ts, remplacez temporairement await enableNativeUI() par ces deux lignes. Le point de diagnostic lit le même handle et ne démarre pas un autre runtime.

<!-- prettier-ignore -->
```diff:src/native-ui.ts (iOS verification)
@@
-     await enableNativeUI();
+     const shell = await enableNativeUI();
+     Object.assign(window, { inspectNativeUI: () => shell.getStatus() });
```

Recompilez l’application de développement et synchronisez iOS selon l’étape 4. Ouvrez sa WebView dans Safari Web Inspector. Affichez une page existante avec un bouton de barre d’outils ou une barre d’onglets compatible, puis exécutez ceci dans la console après le rendu :

```js
window.inspectNativeUI();
```

Pour les contrôles compatibles, state doit être native et projected positif ; l’action appelle son gestionnaire Web une seule fois. La projection est asynchrone : si projected vaut initialement 0, attendez l’affichage et vérifiez à nouveau. Un 0 persistant ne valide pas le rendu natif. Si state reste web sur un build iOS compatible, examinez reason, la synchronisation/recompilation native et la compatibilité du contrôle avant de terminer. Sur les systèmes non compatibles, le repli Web est attendu et les contrôles doivent rester utilisables. Après vérification, retirez le diagnostic temporaire et restaurez await enableNativeUI().

### iOS 26+ / Xcode 26+ seulement : retirer l’inspection temporaire

Appliquez ce retrait uniquement après l’inspection iOS compatible ci-dessus. Android seul et ancien iOS ignorent toute cette section, commandes comprises, puis passent à Configuration terminée.

<!-- prettier-ignore -->
```diff:src/native-ui.ts (iOS verification)
@@
-     const shell = await enableNativeUI();
-     Object.assign(window, { inspectNativeUI: () => shell.getStatus() });
+     await enableNativeUI();
```

Depuis le répertoire de l’application, compilez et synchronisez avec les commandes ci-dessous, arrêtez l’application iOS puis relancez-la. Rouvrez Safari Web Inspector : l’expression doit renvoyer undefined. Les contrôles et gestionnaires habituels doivent encore fonctionner. Cela supprime aussi l’ancien hook de window en mémoire.

```sh
npm run build
npx cap sync ios
```

```js
typeof window.inspectNativeUI;
```

## Configuration terminée

Lorsque les plateformes choisies passent ces vérifications, la configuration est terminée. Choisissez une tâche facultative seulement pour ajouter une fonction : [réglages d’apparence](/guides/appearance) ou [interface native personnalisée](/guides/extensions).

## Options individuelles

Pour Native UI sans ces thèmes, utilisez la [configuration du thème existant](/projects/capacitor-native-ui/docs/ionic-vertical-bars) ou la [configuration HTML](/projects/capacitor-native-ui/docs/framework-independent). Consultez [Dynamic Color](/projects/capacitor-native-ui/docs/dynamic-colors) pour l’apparence et le mappage, la [configuration](/projects/capacitor-native-ui/docs/configuration) pour les options Native UI et la [migration](/projects/capacitor-native-ui/docs/migration) pour une intégration existante.
