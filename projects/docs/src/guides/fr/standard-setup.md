---
title: 'Configuration standard WebView Native UI'
sourceRevision: '5481aa83039b3ce45afc79b52611c20a1dad86b2e932b6d8b7caff54da5deec8'
---

# Configuration standard WebView Native UI

Configurez une application Ionic + Capacitor existante avec iOS 26 comme thème iOS de base, iOS 27 sur les navigateurs compatibles et Material Design 3 sur Android. Ce guide raccorde aussi les contrôles natifs iOS, iPhone Duo / Vertical Bars et Dynamic Color Android.

## Avant de commencer

Utilisez Ionic 8 ou 9 à partir de 8.8.1, Capacitor 8 et Foldable 8.5 ou ultérieur dans la version 8. Partez d’une application dont la compilation Web fonctionne et dont les projets natifs iOS et Android sont déjà ajoutés. Conservez les routes et gestionnaires existants.

Les contrôles iOS exigent iOS 26+ et Xcode 26+. Dynamic Color Android nécessite Android 12+ ; les appareils plus anciens conservent la palette par défaut. Le rail natif exige aussi un [appareil et un OS compatibles](/projects/capacitor-native-ui/docs/vertical-bars#native-rendering).

Pour les autres intégrations, choisissez [HTML sans Ionic](/projects/capacitor-native-ui/docs/framework-independent), [Cordova](/projects/cordova-native-ui/docs/readme) ou [les thèmes seuls](/guides/appearance).

## 1. Installer les paquets

```sh
npm install @rdlabo/capacitor-native-ui @rdlabo/ionic-theme-ios26 \
  @rdlabo/ionic-theme-ios27 @rdlabo/ionic-theme-md3 \
  @erkamyaman/capacitor-foldable@8
npm install --save-dev sass
```

## 2. Configurer les deux thèmes

Modifiez le fichier Sass global, par exemple `src/global.scss`, après les styles de base Ionic. Placez `@use 'sass:meta'` en tête du fichier. Remplacez les imports existants des palettes sombres Ionic et des thèmes par cette composition ; gardez les personnalisations de l’application après les thèmes. Le contrôleur d’apparence de l’étape 3 gère la classe `ion-palette-dark`.

```scss:src/global.scss
@use 'sass:meta';

@include meta.load-css('@ionic/core/css/palettes/dark.class.css');

@supports not (overflow-anchor: auto) {
  @include meta.load-css('@rdlabo/ionic-theme-ios26/src/styles/default-variables');
  @include meta.load-css('@rdlabo/ionic-theme-ios26/src/styles/ionic-theme-ios26');
  @include meta.load-css('@rdlabo/ionic-theme-ios26/src/styles/ionic-theme-ios26-dark-class');
  @include meta.load-css('@rdlabo/ionic-theme-ios26/src/styles/md-remove-ios-class-effect');
  @include meta.load-css('@rdlabo/ionic-theme-ios27/src/styles/vertical-bars');
}

@supports (overflow-anchor: auto) {
  @include meta.load-css('@rdlabo/ionic-theme-ios27/src/styles/default-variables');
  @include meta.load-css('@rdlabo/ionic-theme-ios27/src/styles/ionic-theme-ios27');
  @include meta.load-css('@rdlabo/ionic-theme-ios27/src/styles/ionic-theme-ios27-dark-class');
  @include meta.load-css('@rdlabo/ionic-theme-ios27/src/styles/md-remove-ios-class-effect');
}

@include meta.load-css('@rdlabo/ionic-theme-md3/dist/styles/theme.css');
```

Sass doit résoudre les paquets depuis `node_modules`. Avec Angular, ajoutez ceci aux options de compilation de l’application dans `angular.json`. Configurez le chemin Sass équivalent avec un autre outil.

```json
"stylePreprocessorOptions": {
  "includePaths": ["node_modules"]
}
```

La branche iOS par défaut utilise le thème iOS 26. Les navigateurs prenant en charge `overflow-anchor: auto` utilisent iOS 27 ; il s’agit d’un test de capacité, pas de version du système. Le mode Material Design utilise MD3. Les deux branches iOS incluent les styles de disposition Vertical Bars.

Choisissez le préréglage correspondant avant l’initialisation Ionic existante. Conservez aussi vos autres options Ionic :

```ts
import { Capacitor } from '@capacitor/core';
import { ios26ThemeConfig, iosTransitionAnimation as ios26TransitionAnimation } from '@rdlabo/ionic-theme-ios26';
import { ios27ThemeConfig, withNativeUITransition } from '@rdlabo/ionic-theme-ios27';
import { md3ThemeConfig } from '@rdlabo/ionic-theme-md3';

const iosConfig =
  typeof CSS !== 'undefined' && CSS.supports('overflow-anchor: auto')
    ? ios27ThemeConfig
    : {
        ...ios26ThemeConfig,
        navAnimation: withNativeUITransition(ios26TransitionAnimation),
      };
const ionicConfig = Capacitor.getPlatform() === 'ios' ? iosConfig : md3ThemeConfig;
```

L’animation de navigation iOS 26 utilise `withNativeUITransition` pour synchroniser le Web et les contrôles natifs. `ios27ThemeConfig` inclut déjà cet adaptateur. Conservez les animations de popover fournies par chaque préréglage.

| Framework         | Ionic initializer                                                   |
| ----------------- | ------------------------------------------------------------------- |
| Angular / Ionic 8 | `provideIonicAngular(ionicConfig)` from `@ionic/angular/standalone` |
| Angular / Ionic 9 | `provideIonicAngular(ionicConfig)` from `@ionic/angular`            |
| React             | `setupIonicReact(ionicConfig)` from `@ionic/react`                  |
| Vue               | `app.use(IonicVue, ionicConfig)` with `IonicVue` from `@ionic/vue`  |

Dans un navigateur, cet exemple choisit MD3. Pour prévisualiser iOS sur ordinateur, définissez `mode: 'ios'` dans l’initialisation existante avec le préréglage iOS correspondant. Le thème seul n’active pas les contrôles natifs.

## 3. Démarrer après le rendu de la coque

Exécutez ceci une fois après le rendu de la coque, y compris `ion-app`. Les deux fonctionnalités et les notifications de disposition requises sont raccordées :

```ts
import { Capacitor } from '@capacitor/core';
import {
  enableNativeUI,
  getDynamicColorScheme,
  addDynamicColorListener,
} from '@rdlabo/capacitor-native-ui';
import { Foldable } from '@erkamyaman/capacitor-foldable';
import { resolveVerticalBarsLayout } from '@rdlabo/capacitor-native-ui/integration';
import { setVerticalBarsLayout } from '@rdlabo/ionic-theme-ios27';
import { enableDynamicColors } from '@rdlabo/ionic-theme-md3/dynamic-colors';

await enableDynamicColors({
  getScheme: getDynamicColorScheme,
  listen: addDynamicColorListener,
  mode: 'system',
  onError: console.error,
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
```

Le contrôleur du thème suit l’apparence système et applique la palette Android lorsqu’elle est disponible. Les autres plateformes et les appareils Android non compatibles conservent les couleurs de repli. Sur iOS, Native UI active les contrôles ordinaires et Vertical Bars ; l’abonnement applique la disposition initiale et les changements d’écran.

Avec Angular, utilisez le callback `afterNextRender` de la coque. Avec React ou Vue, utilisez le démarrage après le montage. Si votre application gère sa propre préférence d’apparence, raccordez-la selon le [guide Dynamic Color](/projects/capacitor-native-ui/docs/dynamic-colors#apply-to-ionic), sans créer un second contrôleur d’apparence.

## 4. Compiler, synchroniser et exécuter

Compilez d’abord les ressources Web ; la commande suppose un script `build` existant. Synchronisez, puis ouvrez chaque projet natif existant et compilez/exécutez-le pour un simulateur ou appareil :

```sh
npm run build
npx cap sync
npx cap open ios
npx cap open android
```

SwiftPM résout Engine automatiquement ; les projets CocoaPods existants suivent la [configuration native](/projects/capacitor-native-ui/docs/configuration#native-project-setup).

## Vérifier le résultat sur chaque plateforme

- Sur iOS, vérifiez le thème de base iOS 26 et le thème iOS 27 sélectionné selon les capacités. Changez d’apparence claire/sombre, naviguez et ouvrez un popover pour vérifier les animations correspondantes.
- Sur iOS 26 ou ultérieur, les contrôles pris en charge sont natifs et conservent les gestionnaires Web existants. Le thème iOS habille le contenu Web restant.
- Sur Android 12 ou ultérieur, Material Design 3 utilise la palette Dynamic Color de l’appareil. Les contrôles restent Web. Les versions Android antérieures utilisent la palette du thème.
- Sur les appareils compatibles avec les rails natifs, les changements de disposition mettent à jour Vertical Bars. Les autres appareils conservent la disposition Web habituelle.
- Le navigateur permet de vérifier les thèmes Web et le comportement de l’application. Vérifiez les contrôles natifs, les couleurs de l’appareil et les rails adaptatifs dans les applications natives.

## Après la configuration

Après ces vérifications, [personnalisez l’apparence](/guides/appearance), [configurez les contrôles natifs](/guides/native-ui) ou [adaptez la disposition](/guides/device-layout). Pour un thème seul, suivez la [configuration iOS 26](/projects/ionic-theme-ios26/docs/setup), [iOS 27](/projects/ionic-theme-ios27/docs/setup) ou [MD3](/projects/ionic-theme-md3/docs/setup).

## Options individuelles

Pour Native UI sans ces thèmes, utilisez la [configuration du thème existant](/projects/capacitor-native-ui/docs/ionic-vertical-bars) ou la [configuration HTML](/projects/capacitor-native-ui/docs/framework-independent). Consultez [Dynamic Color](/projects/capacitor-native-ui/docs/dynamic-colors) pour l’apparence et le mappage, la [configuration](/projects/capacitor-native-ui/docs/configuration) pour les options Native UI et la [migration](/projects/capacitor-native-ui/docs/migration) pour une intégration existante.
