---
title: 'Configuration standard WebView Native UI'
sourceRevision: '7fcf8d7e1460bbd5798e4542392a783f93f1e248c800994b3031a6407b21d95c'
---

# Configuration standard WebView Native UI

Cette configuration Ionic standard associe les contrôles natifs iOS, y compris iPhone Duo / Vertical Bars, à Dynamic Color Android. L’application conserve son état, ses routes et ses gestionnaires.

## Avant de commencer

Utilisez une application Ionic existante avec Capacitor 8 et Foldable 8.5 ou ultérieur dans la version 8.

Les contrôles iOS exigent iOS 26+ et Xcode 26+. Dynamic Color Android nécessite Android 12+ ; les appareils plus anciens conservent la palette par défaut. Le rail natif exige aussi un [appareil et un OS compatibles](/projects/capacitor-native-ui/docs/vertical-bars#native-rendering).

Pour les autres intégrations, choisissez [HTML sans Ionic](/projects/capacitor-native-ui/docs/framework-independent), [Cordova](/projects/cordova-native-ui/docs/readme) ou [les thèmes seuls](/guides/appearance).

## 1. Installer les paquets

```sh
npm install @rdlabo/capacitor-native-ui @rdlabo/ionic-theme-ios27 @rdlabo/ionic-theme-md3 @erkamyaman/capacitor-foldable
```

## 2. Configurer les deux thèmes

Conservez le CSS de base Ionic et utilisez ces feuilles de style. L’entrée iOS inclut la palette sombre par classe et la disposition Vertical Bars. Remplacez tout import de palette sombre système ou permanente par cette entrée.

```css
@import '@rdlabo/ionic-theme-ios27/styles/class.css';
@import '@rdlabo/ionic-theme-md3/styles/theme.css';
```

Transmettez le préréglage adapté à votre initialisation Ionic existante :

```ts
import { Capacitor } from '@capacitor/core';
import { ios27ThemeConfig } from '@rdlabo/ionic-theme-ios27';
import { md3ThemeConfig } from '@rdlabo/ionic-theme-md3';

const ionicConfig = Capacitor.getPlatform() === 'ios' ? ios27ThemeConfig : md3ThemeConfig;
```

| Framework         | Ionic initializer                                                   |
| ----------------- | ------------------------------------------------------------------- |
| Angular / Ionic 8 | `provideIonicAngular(ionicConfig)` from `@ionic/angular/standalone` |
| Angular / Ionic 9 | `provideIonicAngular(ionicConfig)` from `@ionic/angular`            |
| React             | `setupIonicReact(ionicConfig)` from `@ionic/react`                  |
| Vue               | `app.use(IonicVue, ionicConfig)` with `IonicVue` from `@ionic/vue`  |

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

Compilez les ressources Web, synchronisez, puis recompilez et lancez chaque application native :

```sh
npx cap sync
```

SwiftPM résout Engine automatiquement ; les projets CocoaPods existants suivent la [configuration native](/projects/capacitor-native-ui/docs/configuration#native-project-setup).

## Vérifier le résultat sur chaque plateforme

- Sur iOS 26 ou ultérieur, les contrôles pris en charge sont natifs et conservent les gestionnaires Web existants. Le thème iOS habille le contenu Web restant.
- Sur Android 12 ou ultérieur, Material Design 3 utilise la palette Dynamic Color de l’appareil. Les contrôles restent Web. Les versions Android antérieures utilisent la palette du thème.
- Sur les appareils compatibles avec les rails natifs, les changements de disposition mettent à jour Vertical Bars. Les autres appareils conservent la disposition Web habituelle.
- Le navigateur permet de vérifier les thèmes Web et le comportement de l’application. Vérifiez les contrôles natifs, les couleurs de l’appareil et les rails adaptatifs dans les applications natives.

## Options individuelles

Pour Native UI sans ces thèmes, utilisez la [configuration du thème existant](/projects/capacitor-native-ui/docs/ionic-vertical-bars) ou la [configuration HTML](/projects/capacitor-native-ui/docs/framework-independent). Consultez [Dynamic Color](/projects/capacitor-native-ui/docs/dynamic-colors) pour l’apparence et le mappage, la [configuration](/projects/capacitor-native-ui/docs/configuration) pour les options Native UI et la [migration](/projects/capacitor-native-ui/docs/migration) pour une intégration existante.
