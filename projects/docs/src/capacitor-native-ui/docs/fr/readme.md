---
title: "Capacitor Native UI"
sourceRevision: "00f6528542dd4a1a7d25155d5b882f1fcba0f952002c4bfa21b745c83434594b"
---

# Capacitor Native UI

Capacitor Native UI fournit des contrôles natifs, les couleurs de l’appareil et du contenu natif personnalisé aux applications WebView.

## Configuration standard : Native UI iOS et Dynamic Color Android

Commencez par configurer les deux fonctionnalités dans une application Ionic. La configuration standard comprend iPhone Duo / Vertical Bars et les changements de disposition sur iOS, ainsi que les couleurs Material You sur les appareils Android compatibles.

```sh
npm install @rdlabo/capacitor-native-ui @rdlabo/ionic-theme-ios27 @rdlabo/ionic-theme-md3 @erkamyaman/capacitor-foldable
```

La [configuration standard](setup.md) regroupe les préréglages, les stylesheets et le code de démarrage complet.

## Guides individuels

### 1. Utiliser Native UI du plugin

Le plugin affiche nativement les contrôles Ionic et HTML pris en charge sur iOS. L’application conserve son état, son routage et ses gestionnaires.

| Votre application | Guide |
| --- | --- |
| Ionic avec le thème iOS 27 standard | [Configuration standard](setup.md) |
| Ionic avec un thème Web existant | [Configuration du thème existant](ionic-vertical-bars.md) |
| HTML sans Ionic | [Configuration HTML](framework-independent.md) |

#### Fonctionnement de la projection

Native UI présente le contrôle Web d’origine nativement en conservant son état et ses gestionnaires. Voir les [contrôles pris en charge et la projection](native-ui.md).

### 2. Utiliser Dynamic Color

Lisez la palette Android et appliquez-la via le thème. Consultez le [guide Dynamic Color](dynamic-colors.md) pour cette fonctionnalité seule, les préférences d’apparence et le mappage des couleurs.

### 3. Créer votre propre Native UI

Affichez votre contenu SwiftUI ou Android Compose via les [extensions locales à l’application](native-ui-extensions.md). Cette fonctionnalité est expérimentale.

## Prérequis

Le démarrage natif nécessite Capacitor 8 et un projet iOS ou Android. Les extensions Android nécessitent l’API 24+ et Kotlin/Compose. Le rendu natif ordinaire nécessite iOS 26+ et Xcode 26+. L’adaptateur Ionic déclare la compatibilité avec Ionic `>=8.8.1 <10`, avec une validation E2E automatisée sur Ionic 9 ; l’adaptateur HTML `/core` ne nécessite ni Ionic ni paquet de thème. [Vertical Bars](/docs/vertical-bars) et le [placement des extensions](/docs/native-ui-extensions#content-and-placement-are-independent) ont des exigences supplémentaires pour l’appareil.

Pour les contrôles standard, suivez le guide correspondant à votre balisage ; les adaptateurs Ionic et HTML utilisent des imports différents. Pour du contenu natif personnalisé, commencez directement par le [guide des extensions](/docs/native-ui-extensions).

## Référence

- [Contrôles Ionic pris en charge](/docs/native-ui#supported-markup) et comportement de repli.
- [Configuration](/docs/configuration) : valeurs par défaut, sélection des contrôles, mode rail uniquement et modifications à chaud.
- [Apparence claire et sombre](/docs/appearance) : hériter du thème Web, configurer le HTML personnalisé et comprendre l’apparence du rail partagé.
- [Vertical Bars](/docs/vertical-bars) : admissibilité, apparence et API du runtime.
- [Migration](/docs/migration) : noms des packages, imports et mise à jour du projet natif.

## Développement

```sh
npm ci
npm run build
npm test
npm run test:packages
```

L’implémentation partagée du DOM et du moteur de rendu est maintenue dans l’espace de travail local `packages/native-ui-core`. Ce dépôt gère l’enregistrement Capacitor et les adaptateurs hôtes. `android/src/main/java/shared-core` est généré depuis les sources locales de Core par `npm run sync:core` ; modifiez Core, pas cette copie. SwiftPM et CocoaPods compilent directement les sources Swift partagées dans `packages/native-ui-core/ios/Sources`. Les utilisateurs de SwiftPM basé sur Git n’ont pas besoin de Node.js. Les noms existants des modules natifs et des symboles Kotlin sont conservés pour les extensions locales à l’application.

La racine du dépôt reste le plugin npm : `src`, `ios`, `android` et `package.json` cohabitent. Ses tests unitaires TypeScript sont dans `tests` ; les tests Swift et Android restent avec le plugin. `examples/native-ui-html` montre son utilisation sans thème Ionic.

La compilation suit la structure d’un plugin Capacitor : TypeScript compile `src/index.ts` vers `dist/esm`, puis Rollup génère le bundle navigateur (`dist/plugin.js`) et le bundle CommonJS (`dist/plugin.cjs`). L’extension `.cjs` est nécessaire parce que ce paquet utilise `type: module`. Les sous-chemins ESM publics partagent les mêmes modules dans `dist/esm`. Exécutez `npm run watch` pour recompiler les changements TypeScript ou `npm run verify:web` pour les vérifications Web.

## Tester avec le thème Ionic

La démo Ionic complète, les tests de captures d’écran, les tests de transition du thème et les fixtures d’intégration du simulateur restent dans [ionic-theme-ios27](https://github.com/webview-native-ui/ionic-theme-ios27). Ils installent ce plugin comme dépendance npm. Ne dupliquez pas la démo ici.

Pour tester des changements non publiés, compilez et créez l’archive de ce dépôt :

```sh
npm run build
npm pack --ignore-scripts --pack-destination /tmp
```

Depuis un checkout du thème déjà migré, exécutez `npm run test:native-candidate -- /tmp/rdlabo-capacitor-native-ui-VERSION.tgz --e2e`. La commande crée une copie isolée, installe l’archive pour le thème et la démo, puis exécute les vérifications des paquets, les tests unitaires d’intégration, le build de production et les tests navigateur. Ajoutez `--simulator=UDID` pour exécuter les suites existantes du simulateur. Le checkout d’origine et ses fichiers de verrouillage sont préservés ; la copie temporaire reste disponible pour le diagnostic.

## Publications

Le plugin possède une version indépendante du thème. Exécutez `npm run release` depuis une branche main à jour lorsque vous êtes autorisé à publier. Le workflow du tag `vVERSION` publie uniquement ce plugin (`next` pour les préversions, `latest` pour les versions stables).

Épinglez Engine à la même version exacte dans les deux manifestes npm, `Package.swift`, le podspec et la dépendance Android Gradle, et mettez à jour le fichier de verrouillage en même temps. Une plage npm flottante peut résoudre un Engine plus récent que les dépendances natives et empêcher l’installation.

Avant la première publication, configurez le trusted publisher npm pour `webview-native-ui/capacitor-plugin`, le workflow `release.yml` et l’environnement `npm`. Configurez selon vos besoins la politique de revue de cet environnement GitHub. Les versions déjà publiées ne peuvent pas être republiées ; choisissez une nouvelle version pour la première publication depuis ce dépôt.

Ce dépôt a été extrait du commit `1831bde5` de `webview-native-ui/ionic-theme-ios27`. L’historique antérieur reste dans ce dépôt d’origine.

## Développer Core partagé

Core réside dans `packages/native-ui-core` dans ce dépôt. Exécutez `npm ci`, `npm run build` et `npm test` depuis la racine ; aucune publication ni aucun checkout distinct de Core n’est nécessaire. La compilation incorpore le JavaScript et les déclarations de Core dans l’archive du plugin. Core est un espace de travail privé, pas une dépendance npm publiée séparément.

Modifiez le TypeScript, le Swift et le Kotlin partagés dans `packages/native-ui-core`. `npm run sync:core` régénère la copie Android ; `npm run check:core` détecte les écarts. Les tests partagés du moteur de rendu et du DOM s’exécutent avec les tests des adaptateurs Capacitor via la commande de test racine. Les tests natifs de Core restent dans ses répertoires `ios` et `android`.

Les migrations Capacitor s’exécutent depuis la racine de ce dépôt. `package.json`, `Package.swift`, le podspec et `android/` conservent leurs emplacements habituels. Validez les builds natifs après les migrations de SDK ; conserver cette structure ne garantit pas la compatibilité avec les futurs outils de migration.

### Utilisateurs de Swift Package

Ajoutez `https://github.com/webview-native-ui/capacitor-plugin.git` dans Xcode et sélectionnez le produit `NativeUICore` pour utiliser `import NativeUICore` sans lier l’adaptateur Capacitor. Les deux produits partagent les tags de version du dépôt ; SwiftPM peut néanmoins télécharger Capacitor pendant la résolution des dépendances du package.

Les applications Capacitor continuent d’utiliser le produit `RdlaboCapacitorNativeUi` et `import NativeUIPlugin`. Ce module réexporte Core ; les appels `NativeUI.register` existants utilisent donc le même état d’enregistrement que l’adaptateur. Le manifeste racine possède les deux cibles ; il n’existe pas de paquet Swift imbriqué distinct.

CocoaPods continue de compiler l’adaptateur et les sources partagées dans le pod existant du plugin. Ce changement ne publie pas de pod Core autonome et n’implémente pas d’adaptateur Cordova.
