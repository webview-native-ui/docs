---
title: 'Migrer vers la configuration recommandée'
sourceRevision: '0b3b1fd5d4b6c09c3e577c41aeb23c69815275559949b73d7d9a600a914aa5c8'
---

# Migrer vers la configuration recommandée

Les versions précédentes demandaient de configurer chaque paquet séparément dans l’application. Ce guide explique comment remplacer ces réglages par la configuration recommandée pour les thèmes et les fonctions natives que votre application Ionic utilise déjà.

## 1. Relever les paquets installés

Dans une application Ionic 9 et Capacitor 8, listez les thèmes et plugins installés pour choisir les paquets à mettre à jour à l’étape 2. Pour Cordova, consultez le [guide du plugin Cordova](/projects/cordova-native-ui/docs/readme).

```sh
npm ls @rdlabo/ionic-theme-ios26 @rdlabo/ionic-theme-ios27 @rdlabo/ionic-theme-md3 @rdlabo/capacitor-native-ui @erkamyaman/capacitor-foldable
```

## 2. Mettre à jour les paquets utilisés

Actualisez seulement les paquets utilisés selon cet inventaire. La commande groupée concerne uniquement cette configuration. Les dépendances et le lockfile sont alors actualisés ; le raccordement source reste inchangé.

Pour l’app Ionic + Capacitor, mettez ces paquets à jour ensemble en gardant Foldable en version majeure 8. Pour un thème seul, mettez à jour uniquement le thème installé. Conservez le lockfile et n’exécutez pas toutes les variantes de commande.

```sh
npm install @rdlabo/ionic-theme-ios26@latest @rdlabo/ionic-theme-ios27@latest   @rdlabo/ionic-theme-md3@latest @rdlabo/capacitor-native-ui@latest   @erkamyaman/capacitor-foldable@8
```

Si votre application utilise Native UI intégré à une ancienne version du thème iOS 27, suivez le [guide de migration du paquet](/projects/ionic-theme-ios27/docs/migration#native-ui-package-separation).

## 3. Garder l’apparence et simplifier les imports

Appliquez ce diff seulement si l’ancien groupe class correspond. Conservez plutôt la politique system/always si elle était choisie. La politique reste identique, seule la composition des imports est simplifiée.

Une app utilisant déjà la palette iOS 27 par classe peut remplacer ce groupe par un préréglage. Gardez system.css pour le thème seul lié au système ou always.css pour le sombre permanent. Pour iOS 26/27 + MD3, gardez les imports et le préréglage iOS de la [configuration](/standard-setup), sans ajouter cet import iOS 27 seul.

La configuration combinée garde par défaut les imports system des deux thèmes iOS pour suivre le mode clair/sombre du système. Conservez-les lors d’une simple mise à jour du thème. Seule la [tâche d’apparence](/guides/appearance) passe à class pour ajouter une priorité pilotée par l’application, indépendamment du choix des couleurs. Le diff de l’ancienne palette class ci-dessous conserve sa politique manuelle existante.

<!-- prettier-ignore -->
```diff:src/global.css
@@
 @import '@ionic/core/css/core.css';
- @import '@ionic/core/css/palettes/dark.class.css';
- @import '@rdlabo/ionic-theme-ios27/dist/css/default-variables.css';
- @import '@rdlabo/ionic-theme-ios27/dist/css/ionic-theme-ios27.css';
- @import '@rdlabo/ionic-theme-ios27/dist/css/ionic-theme-ios27-dark-class.css';
- @import '@rdlabo/ionic-theme-ios27/dist/css/md-remove-ios-class-effect.css';
+ @import '@rdlabo/ionic-theme-ios27/styles/class.css';
```

## 4. Mettre à jour le gestionnaire de disposition

Si un ancien callback de disposition existe, modifiez seulement l’import et la conversion du resolver. L’écouteur affiché est du contexte existant. Sinon, passez l’étape. L’unique abonnement applique alors le résultat du resolver.

Si l’app convertit directement getBarPlacement en edge/inset, remplacez cette conversion dans le gestionnaire layoutChange existant. Le résolveur inclut toolbarTop. N’ajoutez ni abonnement, ni sélection de préréglage par génération, ni wrapper manuel autour de la transition du préréglage iOS partagé. Gardez le démarrage au shell.

Ignorez cette étape si l’application n’intègre pas le layout de l’appareil.

<!-- prettier-ignore -->
```diff:src/native-ui.ts
@@
 import { enableNativeUI } from '@rdlabo/capacitor-native-ui';
 import { Foldable } from '@erkamyaman/capacitor-foldable';
+ import { resolveVerticalBarsLayout } from '@rdlabo/capacitor-native-ui/integration';
 import { setVerticalBarsLayout } from '@rdlabo/ionic-theme-ios27';

 export async function startLegacyUI(): Promise<void> {
   await enableNativeUI();
   const updateLayout = async () => {
-     const placement = await Foldable.getBarPlacement();
-     setVerticalBarsLayout({ edge: placement.edge, inset: placement.inset });
+     setVerticalBarsLayout(await resolveVerticalBarsLayout(Foldable));
   };
   void Foldable.addListener('layoutChange', () => void updateLayout().catch(console.error))
     .then(updateLayout)
```

## 5. Recompiler et vérifier les régressions

Les changements applicables sont faits. Compilez dans le répertoire de l’application et exécutez seulement les commandes des fonctions natives existantes. Une application navigateur/thème seul termine avec les vérifications Web. Les applications natives terminent après rebuild, synchronisation, relancement et contrôle des fonctions utilisées, sans nouveau prérequis de rail ou extension.

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
