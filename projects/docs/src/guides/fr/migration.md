---
title: 'Migrer une application existante'
sourceRevision: 'e3002de686a3989a3cd3e9ffcd213d9d5c8bcacb0cf2a27956e4448d61a833ae'
---

# Migrer une application existante

Mettez à jour l’intégration sans remplacer routes, état ni événements. Vérifiez les paquets, mettez à jour ceux utilisés, remplacez l’ancien câblage puis vérifiez les mêmes écrans après rebuild natif.

## 1. Relever les paquets installés

Exécutez ceci dans l’app et notez les versions. Une entrée absente signifie que la fonction n’est pas installée : n’ajoutez pas Native UI pour migrer un thème seul. Cette page utilise Ionic 9 et Capacitor 8. Cordova suit la migration de son plugin groupé.

```sh
npm ls @ionic/core @capacitor/core @rdlabo/ionic-theme-ios26 @rdlabo/ionic-theme-ios27 @rdlabo/ionic-theme-md3 @rdlabo/capacitor-native-ui
```

## 2. Mettre à jour les paquets utilisés

Pour l’app Ionic + Capacitor, mettez ces paquets à jour ensemble en gardant Foldable en version majeure 8. Pour un thème seul, mettez à jour uniquement le thème installé. Conservez le lockfile et n’exécutez pas toutes les variantes de commande.

```sh
npm install @rdlabo/ionic-theme-ios26@latest @rdlabo/ionic-theme-ios27@latest   @rdlabo/ionic-theme-md3@latest @rdlabo/capacitor-native-ui@latest   @erkamyaman/capacitor-foldable@8
```

## 3. Remplacer imports et démarrage anciens

Seules les apps utilisant l’ancien Native UI intégré au thème ont besoin de ce changement. Recherchez l’ancienne entrée native et enableNativeUIShell puis remplacez l’appel dans le shell, avec un seul runtime et les mêmes événements. Si les noms sont absents, passez à la suite.

```diff
- import { enableNativeUIShell } from '@rdlabo/ionic-theme-ios27/native';
+ import { enableNativeUI } from '@rdlabo/capacitor-native-ui';

- await enableNativeUIShell();
+ await enableNativeUI();
```

## 4. Garder l’apparence et simplifier les imports

Une app utilisant déjà la palette iOS 27 par classe peut remplacer ce groupe par un préréglage. Gardez system.css pour le thème seul lié au système ou always.css pour le sombre permanent. Pour iOS 26/27 + MD3, gardez les quatre imports et le préréglage iOS de la [configuration](/standard-setup), sans ajouter cet import iOS 27 seul.

```diff
- @import '@ionic/core/css/palettes/dark.class.css';
- @import '@rdlabo/ionic-theme-ios27/dist/css/default-variables.css';
- @import '@rdlabo/ionic-theme-ios27/dist/css/ionic-theme-ios27.css';
- @import '@rdlabo/ionic-theme-ios27/dist/css/ionic-theme-ios27-dark-class.css';
- @import '@rdlabo/ionic-theme-ios27/dist/css/md-remove-ios-class-effect.css';
+ @import '@rdlabo/ionic-theme-ios27/styles/class.css';
```

## 5. Mettre à jour le gestionnaire de disposition

Si l’app convertit directement getBarPlacement en edge/inset, remplacez cette conversion dans le gestionnaire layoutChange existant. Le résolveur inclut toolbarTop. N’ajoutez ni abonnement, ni sélection de préréglage par génération, ni wrapper manuel autour de la transition du préréglage iOS partagé. Gardez le démarrage au shell.

Ignorez cette étape si l’application n’intègre pas le layout de l’appareil.

```ts
import { Foldable } from '@erkamyaman/capacitor-foldable';
import { resolveVerticalBarsLayout } from '@rdlabo/capacitor-native-ui/integration';
import { setVerticalBarsLayout } from '@rdlabo/ionic-theme-ios27';

const updateLayout = async () => {
  setVerticalBarsLayout(await resolveVerticalBarsLayout(Foldable));
};

void Foldable.addListener('layoutChange', () => void updateLayout().catch(console.error))
  .then(updateLayout)
  .catch(console.error);
```

## 6. Recompiler et vérifier les régressions

Pour une application Web ou avec thème seul, compilez le Web et vérifiez le thème, la politique clair/sombre et la navigation. La migration est alors terminée ; ignorez les étapes Native UI et layout si ces fonctions sont absentes. Aucun projet natif ni appareil à rail n’est requis.

Avec des fonctions natives, compilez le Web puis exécutez uniquement les commandes de chaque cible existante. Vérifiez les fonctions réellement utilisées, les actions Web et la navigation avec annulation. Testez couleurs et rails uniquement s’ils sont installés et compatibles ; sinon vérifiez le repli sur l’appareil disponible. Les extensions personnalisées ne sont pas requises.

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

Pour [Native UI avec un thème existant](/projects/capacitor-native-ui/docs/ionic-vertical-bars), [HTML sans Ionic](/projects/capacitor-native-ui/docs/framework-independent) ou [Cordova](/projects/cordova-native-ui/docs/readme), utilisez l’intégration correspondante. [Choisissez votre intégration](/#choose-setup) avant de modifier l’application.
