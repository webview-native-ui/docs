---
title: 'Configurer une application Ionic'
sourceRevision: 'c9537c6c26d13c92845d732c8b7d42316125570eb1dfd3a3b8ce0ca6ba7f3d06'
---

# Configurer une application Ionic

Configurez une application Ionic + Capacitor existante avec iOS 26 comme thème iOS de base, iOS 27 sur les navigateurs compatibles et Material Design 3 sur Android. Ce guide raccorde aussi les contrôles natifs iOS, iPhone Duo / Vertical Bars et Dynamic Color Android.

## Avant de commencer

Utilisez une application Ionic 9 existante avec Capacitor 8 et Foldable 8.5 ou ultérieur dans la version 8. Choisissez iOS, Android ou les deux. Partez d’une compilation Web fonctionnelle et d’un projet natif pour chaque plateforme choisie ; aucun autre projet natif n’est nécessaire. Conservez les routes et gestionnaires existants.

Les contrôles iOS exigent iOS 26+ et Xcode 26+. Dynamic Color Android nécessite Android 12+ ; les appareils plus anciens conservent la palette par défaut. Le rail natif exige aussi un [appareil et un OS compatibles](/projects/capacitor-native-ui/docs/vertical-bars#native-rendering).

Pour un thème seul, choisissez l’installation [iOS 26](/projects/ionic-theme-ios26/docs/setup), [iOS 27](/projects/ionic-theme-ios27/docs/setup) ou [MD3](/projects/ionic-theme-md3/docs/setup). Pour [Native UI avec un thème existant](/projects/capacitor-native-ui/docs/ionic-vertical-bars), [HTML sans Ionic](/projects/capacitor-native-ui/docs/framework-independent) ou [Cordova](/projects/cordova-native-ui/docs/readme), suivez l’intégration correspondante.

## 1. Installer les paquets

```sh
npm install @rdlabo/capacitor-native-ui @rdlabo/ionic-theme-ios26 \
  @rdlabo/ionic-theme-ios27 @rdlabo/ionic-theme-md3 \
  @erkamyaman/capacitor-foldable@8
```

## 2. Configurer les deux thèmes

Ajoutez ces imports à la feuille globale après le CSS de base Ionic. Remplacez les imports existants des thèmes et de la palette sombre Ionic. Les préréglages incluent la palette et les styles de compatibilité ; aucune configuration Sass supplémentaire n’est nécessaire.

```css
@import '@rdlabo/ionic-theme-ios26/styles/class.css' supports(not (overflow-anchor: auto));
@import '@rdlabo/ionic-theme-ios27/styles/class.css' supports(overflow-anchor: auto);
@import '@rdlabo/ionic-theme-ios27/dist/css/vertical-bars.css' supports(not (overflow-anchor: auto));
@import '@rdlabo/ionic-theme-md3/styles/theme.css';
```

Le CSS choisit iOS 26 par défaut et iOS 27 si le navigateur prend en charge `overflow-anchor: auto`. Le mode Material Design utilise MD3. Les deux styles iOS partagent `ios27ThemeConfig`, qui inclut la synchronisation des transitions natives. Passez le préréglage de la plateforme à votre initialisation Ionic existante :

Choisissez l’exemple de votre framework et remplacez l’initialisation Ionic existante. Initialisez Ionic une seule fois.

### Angular / Ionic 9

Dans la configuration existante, passez le préréglage au provider Ionic. Conservez les autres providers, notamment le routeur et HTTP.

```ts:src/app/app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideIonicAngular } from '@ionic/angular';
import { Capacitor } from '@capacitor/core';
import { ios27ThemeConfig } from '@rdlabo/ionic-theme-ios27';
import { md3ThemeConfig } from '@rdlabo/ionic-theme-md3';

const ionicConfig = Capacitor.getPlatform() === 'ios' ? ios27ThemeConfig : md3ThemeConfig;

export const appConfig: ApplicationConfig = {
  providers: [provideIonicAngular(ionicConfig)],
};
```

### React

Dans le point d’entrée existant, exécutez ceci avant le rendu de la racine. Conservez la racine React, les routes et les imports CSS.

```ts:src/main.tsx
import { setupIonicReact } from '@ionic/react';
import { Capacitor } from '@capacitor/core';
import { ios27ThemeConfig } from '@rdlabo/ionic-theme-ios27';
import { md3ThemeConfig } from '@rdlabo/ionic-theme-md3';

const ionicConfig = Capacitor.getPlatform() === 'ios' ? ios27ThemeConfig : md3ThemeConfig;

setupIonicReact(ionicConfig);
```

### Vue

Dans le point d’entrée existant, passez le préréglage lors de l’enregistrement d’IonicVue, avant le montage. Conservez le routeur et les autres plugins entre la création et le montage.

```ts:src/main.ts
import { createApp } from 'vue';
import { IonicVue } from '@ionic/vue';
import { Capacitor } from '@capacitor/core';
import { ios27ThemeConfig } from '@rdlabo/ionic-theme-ios27';
import { md3ThemeConfig } from '@rdlabo/ionic-theme-md3';
import App from './App.vue';

const ionicConfig = Capacitor.getPlatform() === 'ios' ? ios27ThemeConfig : md3ThemeConfig;

const app = createApp(App);
app.use(IonicVue, ionicConfig);
app.mount('#app');
```

## 3. Démarrer après le rendu de la coque

Créez src/native-ui.ts pour ce démarrage partagé. Les appels répétés renvoient la même promesse afin qu’un effet React répété ne démarre pas deux contrôleurs d’apparence. Appelez-le après le rendu du shell avec l’exemple de votre framework.

```ts:src/native-ui.ts
import { Capacitor } from '@capacitor/core';
import { enableNativeUI, getDynamicColorScheme, addDynamicColorListener } from '@rdlabo/capacitor-native-ui';
import { Foldable } from '@erkamyaman/capacitor-foldable';
import { resolveVerticalBarsLayout } from '@rdlabo/capacitor-native-ui/integration';
import { setVerticalBarsLayout } from '@rdlabo/ionic-theme-ios27';
import { enableDynamicColors } from '@rdlabo/ionic-theme-md3/dynamic-colors';

let startup: Promise<void> | undefined;

export function startNativeUI(): Promise<void> {
  return (startup ??= connectNativeUI());
}

async function connectNativeUI(): Promise<void> {
  await enableDynamicColors({
    getScheme: getDynamicColorScheme,
    listen: addDynamicColorListener,
  });

  if (Capacitor.getPlatform() === 'ios') {
    await enableNativeUI();

    const updateLayout = async () => {
      setVerticalBarsLayout(await resolveVerticalBarsLayout(Foldable));
    };

    void Foldable.addListener('layoutChange', () => void updateLayout().catch(console.error))
      .then(updateLayout)
      .catch(console.error);
  }
}
```

### Angular

Ajoutez l’import et afterNextRender au composant racine existant. Le shell minimal montre l’emplacement ; conservez imports, template, menu et routeur.

```ts:src/app/app.component.ts
import { Component, afterNextRender } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular';
import { startNativeUI } from '../native-ui';

@Component({
  selector: 'app-root',
  imports: [IonApp, IonRouterOutlet],
  template: '<ion-app><ion-router-outlet /></ion-app>',
})
export class AppComponent {
  constructor() {
    afterNextRender(() => {
      void startNativeUI().catch(console.error);
    });
  }
}
```

### React

Ajoutez l’import et l’effet au composant App existant. Gardez vos routes et pages JSX dans IonApp.

```tsx:src/App.tsx
import { useEffect } from 'react';
import { IonApp } from '@ionic/react';
import { startNativeUI } from './native-ui';

export default function App() {
  useEffect(() => {
    void startNativeUI().catch(console.error);
  }, []);

  return <IonApp>{/* Keep your existing router and pages here. */}</IonApp>;
}
```

### Vue

Ajoutez l’import et onMounted au script App.vue existant. Gardez le template, les routes et le menu.

```vue:src/App.vue
<script setup lang="ts">
import { onMounted } from 'vue';
import { IonApp, IonRouterOutlet } from '@ionic/vue';
import { startNativeUI } from './native-ui';

onMounted(() => {
  void startNativeUI().catch(console.error);
});
</script>

<template>
  <ion-app><ion-router-outlet /></ion-app>
</template>
```

## 4. Compiler, synchroniser et exécuter

Compilez l’application Web, puis exécutez uniquement les commandes de la plateforme choisie. Compilez et lancez ce projet dans Xcode ou Android Studio. Exécutez les deux groupes uniquement si vous ciblez les deux plateformes.

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

## Vérifier le résultat sur chaque plateforme

Vérifiez uniquement les lignes des plateformes choisies. Une fonctionnalité indisponible est validée lorsque son repli fonctionne ; aucun autre OS ni appareil à rail n’est requis.

| Cible                 | Action                                                                      | Résultat attendu                                                                                                                                                 |
| --------------------- | --------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Toutes                | Ouvrir les pages, naviguer et changer le mode clair/sombre.                 | Routes, actions et contrôles Web lisibles fonctionnent.                                                                                                          |
| iOS                   | Exécuter sous iOS 26+ avec Xcode 26+ et observer les contrôles compatibles. | Présentation native et action Web fonctionnent. Le [guide des contrôles](/guides/native-ui) détaille le diagnostic. Les anciens OS conservent les contrôles Web. |
| Android               | Ouvrir l’application ; sous Android 12+, changer la palette et rouvrir.     | MD3 utilise les couleurs disponibles ; sinon, palette de repli et contrôles Web utilisables.                                                                     |
| Appareil à rail natif | Modifier puis restaurer sa disposition.                                     | Vertical Bars suit le rapport et retire l’espace. Les autres appareils gardent la disposition ordinaire.                                                         |
| Navigateur            | Prévisualiser les thèmes et utiliser les actions.                           | Apparence et comportement Web fonctionnent, sans prouver le rendu natif, les couleurs ou les rails.                                                              |

## Après la configuration

Après ces vérifications, [personnalisez l’apparence](/guides/appearance), [configurez les contrôles natifs](/guides/native-ui) ou [adaptez la disposition](/guides/device-layout). Pour un thème seul, suivez la [configuration iOS 26](/projects/ionic-theme-ios26/docs/setup), [iOS 27](/projects/ionic-theme-ios27/docs/setup) ou [MD3](/projects/ionic-theme-md3/docs/setup).

## Options individuelles

Pour Native UI sans ces thèmes, utilisez la [configuration du thème existant](/projects/capacitor-native-ui/docs/ionic-vertical-bars) ou la [configuration HTML](/projects/capacitor-native-ui/docs/framework-independent). Consultez [Dynamic Color](/projects/capacitor-native-ui/docs/dynamic-colors) pour l’apparence et le mappage, la [configuration](/projects/capacitor-native-ui/docs/configuration) pour les options Native UI et la [migration](/projects/capacitor-native-ui/docs/migration) pour une intégration existante.
