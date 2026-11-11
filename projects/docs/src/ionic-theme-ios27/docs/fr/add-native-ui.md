---
title: "Ajouter Native UI à votre thème"
sourceRevision: "c96f45ac9a6826b673cdac04e1df2b27f0ee77fa8f41e403da57047a28d10da1"
---

# Ajouter Native UI à votre thème

Pour configurer ensemble iOS Native UI et Android Dynamic Color, utilisez la [configuration standard WebView Native UI](https://webview-native-ui.com/standard-setup). Cette page ajoute Native UI à un thème iOS existant.

Vous utilisez déjà `@rdlabo/ionic-theme-ios27` dans une application Capacitor ? Ajoutez des contrôles natifs sur iOS en conservant les styles du thème, le contenu Web et le routage. Les contrôles non pris en charge, les navigateurs et Android conservent leur apparence Web.

Commencez par la [configuration du thème](setup.md) si vous ne l’avez pas encore configuré. Si vous utilisez une autre apparence Web, suivez la [configuration de Native UI](../../capacitor-native-ui/docs/ionic-vertical-bars.md).

Consultez le [fonctionnement de la projection](../../capacitor-native-ui/docs/native-ui.md) pour comprendre comment les contrôles natifs restent reliés à votre DOM Web et à vos gestionnaires.

## 1. Installer le plugin natif

Ce guide suppose une application Capacitor 8 avec un projet iOS. Pour Cordova, suivez la [configuration Cordova](cordova.md) distincte. Le thème Web seul peut être utilisé sans Capacitor ; l’ajout de contrôles iOS natifs nécessite d’abord la création de ce projet natif. Consultez les [prérequis de Native UI](https://webview-native-ui.com/projects/capacitor-native-ui/docs/readme#requirements) pour les versions d’Ionic, d’iOS et de Xcode prises en charge.

Le thème et Native UI sont versionnés indépendamment. Installez une version de Native UI compatible avec la dépendance pair déclarée par le thème, ainsi que Foldable comme dépendance distincte de l’application :

```sh
npm install @rdlabo/ionic-theme-ios27 @rdlabo/capacitor-native-ui @erkamyaman/capacitor-foldable
```

La découverte standard des plugins Capacitor nécessite une dépendance directe ; la copie installée uniquement par le thème n’enregistre pas le plugin natif.

Conservez la feuille de style de la [configuration du thème](setup.md), qui comprend la disposition Vertical Bars. Utilisez Foldable 8.5 ou ultérieur dans la version majeure 8.

## 2. Activer les contrôles natifs

Exécutez ce code une fois après le rendu de `ion-app`. Les contrôles ordinaires et Vertical Bars sont activés par défaut. Abonnez-vous aux changements avant d’appliquer la disposition initiale :

```ts
import { enableNativeUI } from '@rdlabo/capacitor-native-ui';
import { Foldable } from '@erkamyaman/capacitor-foldable';
import { resolveVerticalBarsLayout } from '@rdlabo/capacitor-native-ui/integration';
import { setVerticalBarsLayout } from '@rdlabo/ionic-theme-ios27';

await enableNativeUI();

const updateLayout = async () => {
  setVerticalBarsLayout(await resolveVerticalBarsLayout(Foldable));
};

void Foldable.addListener('layoutChange', () => void updateLayout().catch(console.error))
  .then(updateLayout)
  .catch(console.error);
```

Pour Angular, placez ce code de démarrage dans le callback `afterNextRender` du shell. Pour React ou Vue, exécutez les deux après le montage du shell. Le thème applique l’espacement de l’appareil ; Native UI gère la projection native. Un edge null rétablit la disposition ordinaire.

Conservez `navAnimation: iosTransitionAnimation` du package de thème. Cette animation coordonne déjà les contrôles natifs pendant les transitions de page et les gestes de retour ; ne l’enveloppez pas à nouveau. Avec une animation personnalisée, suivez les [instructions de l’adaptateur de transition](../../capacitor-native-ui/docs/migration.md#native-ui-transition-adapter).

Installer le plugin ou configurer les animations du thème n’active pas les contrôles natifs. L’application les active avec l’appel de démarrage ci-dessus.

## 3. Synchroniser et exécuter sur iOS

Pour les projets CocoaPods, effectuez d’abord la [configuration Podfile de l’Engine](https://webview-native-ui.com/projects/capacitor-native-ui/docs/configuration#native-project-setup). SwiftPM résout l’Engine automatiquement. Compilez vos ressources Web, puis exécutez :

```sh
npx cap sync ios
```

Exécutez l’application sur un appareil ou simulateur iOS pris en charge. Les contrôles fixes admissibles doivent adopter la présentation native tout en invoquant leurs gestionnaires existants. Naviguez dans les deux sens, puis vérifiez la même application dans un navigateur pour confirmer le repli Web. Si tout reste Web sur un iOS compatible, vérifiez la dépendance directe, l’appel de démarrage, la synchronisation et la recompilation native. Consultez les [contrôles pris en charge](../../capacitor-native-ui/docs/native-ui.md#supported-markup) pour le balisage admissible et le repli Web. Conservez les styles du thème pour le contenu Web et les contrôles non projetés.

## Mettre à niveau une intégration native existante

Si vous importiez auparavant les API natives depuis le thème, suivez la [migration des imports natifs](../../capacitor-native-ui/docs/migration.md#2-replace-native-imports) et la [migration du projet natif](../../capacitor-native-ui/docs/migration.md#3-sync-the-native-project). Conservez les imports et feuilles de style ordinaires du thème.
