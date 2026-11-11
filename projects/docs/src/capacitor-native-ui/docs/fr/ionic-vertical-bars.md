---
title: "Vertical Bars avec votre thème existant"
sourceRevision: "21e5bb8f36ac3e48f01de53362d670dd6321517e71879538c5e6c2bd2eeec47c"
---

# Vertical Bars avec votre thème existant

Vertical Bars fait partie de la configuration Native UI par défaut. Utilisez ce guide pour conserver le thème Web existant de votre application au lieu d’adopter le préréglage standard du thème iOS 27. Choisissez la configuration correspondant aux composants de votre application, que vous utilisiez Angular, React, Vue ou un autre framework.

Consultez le [fonctionnement de la projection](../README.md#how-projection-works) pour comprendre la relation entre DOM source, contrôles projetés et actions. Choisissez ensuite votre configuration ci-dessous.

## Choisir votre configuration

| Votre application | Commencer ici | Ce que vous ajoutez |
| --- | --- | --- |
| Composants Ionic avec votre propre thème, les styles Ionic par défaut ou un autre thème | [Configuration Ionic ci-dessous](#try-it-in-your-existing-ionic-app) | Placement de l’appareil avec Foldable, CSS de rail autonome et adaptateur Ionic Native UI. Conservez votre thème existant. |
| Aucun composant Ionic (HTML simple, React, Vue, Angular, etc.) | [Configuration HTML](https://webview-native-ui.com/projects/capacitor-native-ui/docs/framework-independent), puis sa [configuration du rail de l’appareil](https://webview-native-ui.com/projects/capacitor-native-ui/docs/framework-independent#device-placement-for-vertical-bars) | `@rdlabo/capacitor-native-ui/core` et Foldable. Votre application fournit la disposition du rail ; aucun package de thème. |
| Thème iOS 27 et Native UI déjà en place | [Connecter le placement de l’appareil](https://webview-native-ui.com/projects/capacitor-native-ui/docs/vertical-bars#use-with-capacitor-foldable) | Réutilisez le runtime existant. N’en démarrez pas un autre. |

**Sans Ionic, suivez le guide HTML plutôt que les étapes ci-dessous.** Vous n’avez besoin ni de `@rdlabo/ionic-theme-ios27`, ni de `vertical-bars.css`, ni de `ion-app`, ni des animations de navigation Ionic. Les boutons HTML et boutons de retour explicitement marqués sont pris en charge ; les onglets HTML arbitraires ne sont pas convertis automatiquement. Un aperçu dans le navigateur nécessite un `webHost` stylé par l’application ; le rail natif nécessite aussi du matériel et des logiciels iOS compatibles.

La suite concerne les **applications Ionic**. Les modes `ios` et `md` sont pris en charge. Les onglets et actions de barre d’outils compatibles se déplacent sur le côté ; le contenu et les contrôles horizontaux conservent leur apparence.

La prise en charge d’iPhone Duo et Vertical Bars est stable à partir de la version 2.0.0.

## Essayer dans votre application Ionic existante

### 1. Installer et charger la feuille de style autonome

Partez de votre application Ionic existante (Ionic `>=8.8.1 <10`, Capacitor 8). Les installations Foldable existantes doivent respecter [la version requise de l’API de disposition de l’appareil](https://webview-native-ui.com/projects/capacitor-native-ui/docs/vertical-bars#use-with-capacitor-foldable) : version 8.5 ou ultérieure dans la version majeure 8. Installez ensemble Native UI, le package de feuille de style de disposition et le plugin requis pour l’état de l’appareil :

```bash
npm install @rdlabo/ionic-theme-ios27 @rdlabo/capacitor-native-ui @erkamyaman/capacitor-foldable
```

Conservez vos imports de thème existants. Ajoutez ceci à votre fichier Sass global :

```scss
@use '@rdlabo/ionic-theme-ios27/dist/css/vertical-bars.css';
```

Les feuilles de style complètes du thème iOS 27 ne sont pas nécessaires. Conservez cette feuille à la place de `ionic-tabs.css` de Foldable ; charger les deux repositionnerait les mêmes onglets.

Nous adoptons [Capacitor Foldable](https://github.com/erkamyaman/capacitor-foldable) comme intégration standard de l’appareil, car il expose le placement, la posture et leurs changements tout en laissant les décisions de disposition à votre application. Résolvez son rapport avec `resolveVerticalBarsLayout(Foldable)` et transmettez le bord, le retrait et l’origine de la barre d’outils retournés au helper de disposition du thème. Native UI vérifie indépendamment la disponibilité du rail natif.

### 2. Raccorder votre animation de navigation

Configurez `navAnimation` avant l’initialisation d’Ionic. Démarrer l’environnement du rail n’enregistre pas cette option. L’adaptateur prépare les contrôles natifs et coordonne la progression de la navigation et l’annulation tout en conservant votre animation de page existante.

#### Garder l’animation par défaut d’Ionic

Si vous n’avez pas configuré `navAnimation`, enveloppez les générateurs standard d’Ionic. Sélectionnez le générateur selon le `mode` de transition Ionic pour que `ios` et `md` gardent leur animation habituelle :

```ts
import { iosTransitionAnimation, mdTransitionAnimation, type AnimationBuilder } from '@ionic/core';
import { withNativeUITransition } from '@rdlabo/ionic-theme-ios27';

const defaultTransition: AnimationBuilder = (baseEl, opts) =>
  (opts.mode === 'ios' ? iosTransitionAnimation : mdTransitionAnimation)(baseEl, opts);

const ionicConfig = {
  navAnimation: withNativeUITransition(defaultTransition),
};
```

Fusionnez cette option avec votre configuration Ionic existante avant l’initialisation : passez-la à `provideIonicAngular()` d’Angular, à `setupIonicReact()` de React ou aux options du plugin `IonicVue` de Vue. Conservez vos imports de feuilles de style de thème. Aucune feuille de style du thème iOS 27 n’est requise.

#### Utiliser l’animation iOS du thème

Si vous utilisez déjà la transition iOS 27, conservez cette configuration. Elle inclut l’adaptateur natif et exclut l’effet horizontal du bouton de retour dans les dispositions verticales ; aucune enveloppe supplémentaire n’est nécessaire. Importer ce point d’entrée JavaScript ne charge pas les feuilles de style du thème.

```ts
import { iosTransitionAnimation } from '@rdlabo/ionic-theme-ios27';

const ionicConfig = {
  navAnimation: iosTransitionAnimation,
};
```

Appliquez cette option à votre configuration existante en mode iOS et conservez votre configuration MD.

#### Garder votre animation personnalisée

Si votre application utilise un autre générateur pour `navAnimation`, enveloppez-le :

```ts
import type { AnimationBuilder } from '@ionic/core';
import { withNativeUITransition } from '@rdlabo/ionic-theme-ios27';

// Transmettre le constructeur d’animation déjà utilisé par l’application.
const configureNavigation = (existingTransition: AnimationBuilder) => ({
  navAnimation: withNativeUITransition(existingTransition),
});
```

L’adaptateur renvoie l’`Animation` d’origine, en conservant ses effets, sa durée et sa courbe d’accélération. Utilisez-le seulement pour la navigation, pas pour les animations de modales ou de popovers. Le générateur doit renvoyer une nouvelle `Animation` à chaque navigation ; Ionic la détruit après la transition. Conservez les événements de cycle de vie pour l’enregistrement des contrôles et les transitions sans animation.

L’adaptateur conserve les cibles d’animation du générateur, y compris tout effet horizontal du bouton de retour. Si vous voulez la transition iOS 27 avec cet effet exclu dans les dispositions verticales, utilisez plutôt `iosTransitionAnimation` de `@rdlabo/ionic-theme-ios27` comme `navAnimation`. Elle inclut déjà l’adaptateur ; aucune enveloppe n’est donc nécessaire.

### 3. Raccorder le placement de l’appareil et démarrer les contrôles

Utilisez le [démarrage de l’application et la disposition de l’appareil](device-layout.md) pour démarrer le runtime `enableNativeUI()` par défaut et connecter la disposition initiale de Foldable et les événements `layoutChange`. Appliquez la feuille de style et l’animation Ionic des étapes 1 et 2 comme configuration du thème de cette application.

Démarrez une fois après le rendu de la coque. Transmettez la disposition au thème ; Native UI gère la projection. Un bord nul rétablit la disposition ordinaire.

### Moment de la disposition initiale

Exécutez l’étape 3 après le rendu de `ion-app`. `setVerticalBarsLayout()` exige un élément monté. Utilisez les [exemples de démarrage et de disposition](device-layout.md), sans attendre les requêtes de données des pages.

Le démarrage natif, le placement et le rendu sont asynchrones. La résolution de `enableNativeUI()` fournit le handle du runtime, sans garantir que les contrôles sont déjà projetés. Démarrer rapidement évite une attente ajoutée par l’application, mais la disposition Web initiale peut rester visible avant la projection native.

### 4. Compiler, synchroniser et exécuter sur iPhone Duo

Compilez les ressources Web de l’application, puis synchronisez le projet natif :

```sh
npx cap sync ios
```

Compilez avec Xcode 27.1 ou ultérieur et exécutez sur iPhone Duo sous iOS 27.1 ou ultérieur. Conservez votre intégration SPM ou CocoaPods ; consultez la [configuration Native UI](setup.md#4-build-sync-and-run).

**Résultat attendu lorsque l’appareil signale un rail :** la barre d’onglets existante et les actions admissibles des barres d’outils fixes passent sur le côté. Le contenu conserve son thème et réserve le retrait mesuré. Les rails iOS compatibles utilisent SwiftUI ; sinon, le rail Web reste affiché. Les appareils signalant un bord null conservent leur disposition ordinaire. Utilisez l’[aperçu facultatif dans le navigateur](#optional-browser-preview) pour simuler un rail sans signalement de l’appareil.

Conservez vos gestionnaires de clic, votre routage et vos associations de formulaire. Par défaut, les actions nécessitent un `ion-icon` ou SVG avec `slot="icon-only"` dans une barre d’outils fixe. Tous les remplissages (`default`, `clear`, `solid`, `outline`) suivent cette règle, y compris les boutons d’envoi. Les autres actions restent horizontales. Utilisez `.ios-theme-horizontal-only` sur un groupe `ion-buttons` ou un `ion-button` individuel pour garder une action horizontale.

### Facultatif : choisir l’apparence native des boutons

Consultez [Choisir l’apparence des boutons](vertical-bars.md#choose-button-appearance) pour les réglages et remplacements locaux.

La valeur par défaut est `system` : SwiftUI définit le style des boutons verticaux et teinte leurs icônes. Si votre thème existant doit fournir leur remplissage et leurs couleurs, définissez les options sur l’appel de démarrage existant de l’application ; conservez la connexion à l’appareil :

```ts
const shell = await enableNativeUI({
  ionic: { verticalBars: { buttonProjection: 'source', buttonDefaultFill: 'solid' } },
});
```

La valeur par défaut `solid` convient aux boutons Ionic ordinaires. Les boutons dans `ion-buttons` restent sans remplissage par défaut ; définissez explicitement `fill="solid"` pour projeter leur fond. Pour les exceptions ponctuelles, utilisez [les réglages locaux de projection](vertical-bars.md#override-individual-buttons-or-groups). Ces réglages affectent uniquement les boutons verticaux natifs ; les clones Web conservent leur apparence existante.

### Si le rail n’apparaît pas

| Ce que vous voyez | Ce qu’il faut vérifier |
| --- | --- |
| Disposition ordinaire | Vérifiez le bord signalé par Foldable. Un bord nul conserve volontairement la disposition ordinaire. |
| Bord signalé, mais aucun espacement latéral | Chargez `vertical-bars.css` et appliquez la disposition initiale et les événements `layoutChange` après le montage de `ion-app`. |
| L’espace apparaît, mais les contrôles restent horizontaux | Démarrez le runtime une seule fois. Utilisez des onglets existants ou des actions `slot="icon-only"` compatibles dans une barre d’outils fixe d’en-tête ou de pied de page. |
| Une action reste horizontale | Vérifiez l’emplacement de l’icône, le placement fixe et les exclusions. Consultez les [conditions applicables aux contrôles](https://webview-native-ui.com/projects/capacitor-native-ui/docs/vertical-bars#toolbar-actions). |

## Aperçu facultatif dans le navigateur

Pour tester localement la disposition sans signalement de l’appareil, omettez temporairement l’abonnement Foldable de l’étape 3 et appliquez un placement simulé après montage de `ion-app` :

```ts
setVerticalBarsLayout({ edge: 'trailing', inset: 80 });
```

Conservez la même feuille de style et un seul runtime Native UI. Utilisez `leading` pour prévisualiser l’autre bord logique, ou `null` pour restaurer la disposition ordinaire. L’utilitaire gère `ios-theme-vertical-bars` et sa variante gauche physique ; les classes manuelles ne font pas partie de la configuration de l’appareil. Consultez les [classes de disposition](../../theme-ios27/docs/vertical-bars-layout.md#reserve-the-vertical-rail) pour les aperçus uniquement CSS.

Les onglets du rail Web affichent leurs icônes et révèlent leurs libellés pendant l’appui et le glissement. L’aperçu navigateur vérifie la disposition et les actions Web, pas l’apparence SwiftUI native. Restaurez l’abonnement Foldable avant la compilation pour l’appareil.

## Utiliser la posture de charnière sans projeter de contrôles

Si votre thème existant a seulement besoin d’un panneau divisé piloté par la posture ou d’un changement de disposition, ne démarrez pas d’environnement de projection et n’ajoutez pas `.ios-theme-vertical-bars`. Transmettez les résultats de `Foldable.getFoldState()` et les événements `foldStateChange` à `applyFoldStateClasses(root, fold)`, puis supprimez l’écouteur une fois terminé. Il n’y a pas d’appel de surveillance distinct pour démarrer ou arrêter.

Consultez [Lire la disposition de l’appareil](../../theme-ios27/docs/vertical-bars-layout.md#read-the-device-layout) pour l’exemple d’abonnement, les valeurs null et la durée de vie de la surveillance. Consultez [Adapter le panneau divisé](../../theme-ios27/docs/vertical-bars-layout.md#adapt-the-split-pane) pour les règles de largeur à activer et l’état à moitié ouvert.

## Règles de disposition partagées et API

La gestion des zones de sécurité, superpositions, RTL, admissibilité, simulation Web et API du handle est décrite dans [Vertical Bars](vertical-bars.md). Consultez cette référence pour personnaliser la configuration ; ce n’est pas une étape d’installation supplémentaire.

## Résoudre la disposition de l’appareil

L’étape 3 connecte déjà le résolveur ; n’ajoutez pas un autre abonnement à l’appareil ici. Conservez cette connexion dans un service ou module d’intégration appartenant à l’application, initialisé après le montage de `ion-app`. Les pages routées conservent leur balisage et leurs gestionnaires métier d’origine.

Foldable signale la géométrie de l’appareil. `resolveVerticalBarsLayout` est un adaptateur sans dépendance à un SDK qui retourne `edge`, `inset` et `toolbarTop` ; il ne démarre pas Native UI, ne crée pas d’abonnement et n’écrit pas de CSS. Le helper `setVerticalBarsLayout` du thème possède la disposition Web et ses valeurs par défaut ; Native UI possède la projection et vérifie indépendamment la disponibilité native. `layoutChange` couvre les changements d’écran qui ne modifient ni le bord ni le retrait. Abonnez-vous avant la lecture initiale et retirez l’écouteur lors de la destruction de l’application.

Les lectures absentes ou en échec restent non définies afin que le thème qui les applique conserve ses valeurs par défaut. Les rectangles et retraits du fournisseur utilisent les pixels CSS du viewport du navigateur. Les points de Foldable correspondent au viewport habituel device-width, initial-scale=1 ; les autres échelles nécessitent un fournisseur normalisé. L’attribut `dir` le plus proche sur `ion-app` ou ses ancêtres détermine le côté physique du rail, comme dans le thème.
