---
title: "Configurer Native UI dans une application Ionic"
sourceRevision: "a1bfa6fa974d08d4b344fcfe2ab79aef6ba5177bd932e2dede4f56a114376f54"
---

# Configurer Native UI dans une application Ionic

Installez les packages, configurez le thème et démarrez Native UI. Les contrôles ordinaires et **Vertical Bars sont activés par défaut** ; l’appareil détermine si un rail natif est disponible.

## 1. Installer les packages

```sh
npm install @rdlabo/capacitor-native-ui @rdlabo/ionic-theme-ios27 @erkamyaman/capacitor-foldable
```

Utilisez une application Ionic existante avec Capacitor 8 et un projet iOS. La configuration standard utilise le préréglage du thème iOS 27 et Foldable 8.5 ou ultérieur dans la version majeure 8.

## 2. Configurer le thème

Conservez le CSS de base d’Ionic. Utilisez cet unique point d’entrée comme feuille de style du thème et de la palette sombre de l’application :

```css
@import '@rdlabo/ionic-theme-ios27/styles/system.css';
```

Transmettez le préréglage à l’initialisation Ionic de l’application avant le rendu :

```ts
import { ios27ThemeConfig } from '@rdlabo/ionic-theme-ios27';

const ionicConfig = {
  ...ios27ThemeConfig,
};
```

| Framework | Initialisation Ionic |
| --- | --- |
| Angular / Ionic 8 | `provideIonicAngular(ionicConfig)` depuis `@ionic/angular/standalone` |
| Angular / Ionic 9 | `provideIonicAngular(ionicConfig)` depuis `@ionic/angular` |
| React | `setupIonicReact(ionicConfig)` depuis `@ionic/react` |
| Vue | `app.use(IonicVue, ionicConfig)` avec `IonicVue` depuis `@ionic/vue` |

La feuille de style comprend la disposition du rail et la palette sombre système. Le préréglage fournit le mode et les animations Ionic, y compris la coordination de navigation Native UI.

## 3. Démarrer Native UI

Après le montage de la structure de l’application, démarrez le runtime par défaut :

```ts
import { enableNativeUI } from '@rdlabo/capacitor-native-ui';

await enableNativeUI();
```


Avec Angular, appelez cette fonction après la résolution de `bootstrapApplication`. Avec React ou Vue, appelez-la après le rendu de la coque. Raccordez la disposition initiale de Foldable et les notifications `layoutChange` via `resolveVerticalBarsLayout` et `setVerticalBarsLayout` du thème ; voir les [exemples de démarrage et de disposition](device-layout.md).

## 4. Compiler, synchroniser et exécuter

Compilez les ressources Web de l’application, puis synchronisez le projet natif :

```sh
npx cap sync ios
```

Recompilez et exécutez dans Xcode sur iOS 26+ avec Xcode 26+. Le rendu natif du rail nécessite aussi [l’appareil et le système compatibles](vertical-bars.md#native-rendering) ; les autres appareils conservent la disposition ordinaire. SwiftPM résout Engine automatiquement. Les applications CocoaPods existantes utilisent la [configuration du projet natif](configuration.md#native-project-setup).

Vérifiez que les actions de barre d’outils et les onglets existants appellent leurs gestionnaires d’origine. Naviguez vers l’avant et l’arrière, annulez un geste de retour et changez l’écran actif sur un appareil avec rail. Vérifiez le repli Web dans le navigateur.

## Étapes suivantes

- [Utiliser un thème Web existant](ionic-vertical-bars.md) au lieu du préréglage standard.
- [Utiliser du HTML sans Ionic](framework-independent.md).
- [Configurer l’apparence et les personnalisations de l’application](https://webview-native-ui.com/projects/ionic-theme-ios27/docs/configuration).
- [Contrôles pris en charge](native-ui.md) et [référence de configuration](configuration.md).
- [Mettre à jour une intégration antérieure](migration.md#simplify-an-existing-ios-setup).
