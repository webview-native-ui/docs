---
title: "Premiers pas"
sourceRevision: "6584c761ae6c6037a19ddd7567803500ce5b2cf8a33df543992228ac18c5368a"
---

# Ionic Theme Material Design 3

Thème CSS/JS pour les applications Ionic, qui prend Android Settings comme référence visuelle tout en préservant les API des composants et la sémantique des couleurs Ionic.

<!-- rdlabo-docs-pick -->

![Thème Ionic MD3 avec la palette Ionic par défaut sur Android 17](https://raw.githubusercontent.com/webview-native-ui/ionic-theme-md3/v9.2.1/screenshots/md3.png)

<!-- /rdlabo-docs-pick -->

Démonstration : https://ionic-theme-md3.rdlabo.dev/

Conçu pour être compatible avec `@rdlabo/ionic-theme-ios27`, afin qu’un même arbre de balisage permette de styliser les deux modes Ionic.

## Installation

Utilisez le [guide d’installation](/docs/setup) pour installer le package, importer `@rdlabo/ionic-theme-md3/styles/theme.css` et déployer `md3ThemeConfig` par spread dans les options de votre initialiseur Ionic existant. Ionic `>=8.8.0 <10` est pris en charge. Les applications utilisant une ancienne version d’Ionic peuvent utiliser `@rdlabo/ionic-theme-md3@1.0.2`.

Pour les applications existantes, suivez la [simplification facultative de la configuration](/docs/migration#optional-simplify-the-setup). Pour les fichiers CSS individuels et les réglages d’animation, utilisez la [configuration](/docs/configuration).

### Apparence Android Settings

Le thème conserve la sémantique des couleurs Ionic et les polices définies par l’application. Les interrupteurs standard sont sans icônes. La police MD par défaut utilise Google Sans Flex local sur l’appareil lorsqu’il est disponible, avec les polices de repli standard ; elle est incluse dans le CSS du thème. Aucun code d’initialisation de police ni plugin Capacitor n’est requis. Les icônes de retour restent gérées par Ionic.

Consultez [Apparence Android Settings](/docs/android-settings) pour l’installation, les polices de repli et les personnalisations des composants. Les utilisateurs existants doivent lire les [notes de migration 9.2.0](/docs/migration#migrating-to-9.2.0%3A-android-settings-alignment) concernant les dimensions des barres d’outils, listes et interrupteurs.

### Facultatif : utiliser les thèmes MD3 et iOS 27 ensemble

Suivez la [configuration combinée des thèmes](/docs/configuration#use-md3-and-ios-27-together) pour l’ordre des feuilles de style et la sélection des animations selon la plateforme.

## Documentation

- [Installation](/docs/setup) — installer et configurer le thème avec sa feuille de style et son objet de configuration.
- [Configuration](/docs/configuration) — feuilles de style individuelles, animations et maintien de la sélection existante du mode.

- [Couleurs dynamiques Android](/docs/dynamic-colors) — configuration facultative Material You, apparence claire/sombre, cycle de vie et correspondance des rôles.
- [Système de couleurs](/docs/color-system) — palette Ionic par défaut, rôles Material facultatifs et attribution des couleurs aux composants.
- [Apparence Android Settings](/docs/android-settings) — géométrie et polices CSS par défaut, personnalisation Ionic.
- [Utiliser ion-item-group](https://docs.rdlabo.dev/projects/ionic-theme-md3/docs/using-ion-item-group) — balisage commun des listes en retrait pour iOS 27 et MD3.
- [Balisage particulier](https://docs.rdlabo.dev/projects/ionic-theme-md3/docs/special-markup) — combinaisons facultatives de composants utilisées par la démo.
- [ESLint](https://docs.rdlabo.dev/projects/ionic-theme-md3/docs/eslint) — vérifier la structure des listes avec les règles ESLint.
- [Migration](/docs/migration) — simplification facultative de la configuration et étapes de mise à niveau propres à chaque version.

## Projets connexes

Si vous avez besoin d’une implémentation plus complète de Material Design 3, ce projet peut aussi vous intéresser :

- **[md3-for-ionic](https://github.com/danielkleebinder/md3-for-ionic)** de danielkleebinder

> **Remarque :** ce thème vise la compatibilité avec l’approche de conception d’Ionic et `@rdlabo/ionic-theme-ios27` ; il ne cherche pas à reproduire MD3 intégralement et strictement.

<!-- rdlabo-docs-omit -->

**Documentation complète :** [https://docs.rdlabo.dev/projects/ionic-theme-md3](https://docs.rdlabo.dev/projects/ionic-theme-md3)

## Développement et tests

### Compilation des modules JavaScript

Conservez les imports relatifs sans extension dans le code source TypeScript, conformément au
style du code source d’Ionic. La CLI partagée `rdlabo-build-theme` de `@rdlabo/ionic-theme-utils` utilise
tsdown pour résoudre les imports lors de la génération du JavaScript ESM et des déclarations de types.
Les dépendances restent externes et les fichiers sources ne sont pas réécrits.

Exécutez `npm run build && npm run test:esm` pour compiler et vérifier l’archive npm avec
la CLI partagée `rdlabo-check-esm`. Les points d’entrée JavaScript publics peuvent être importés
dans Node.js sans DOM ; les opérations d’interface nécessitent toujours un navigateur ou un environnement
natif pris en charge. Le package est distribué uniquement au format ESM.

### Application de démonstration

La même démonstration est déployée avec les deux versions d’Ionic prises en charge :

- [Démonstration Ionic 9](https://ionic-theme-md3.rdlabo.dev) — version de référence
- [Démonstration Ionic 8](https://ionic8-theme-md3.rdlabo.dev) — compatibilité

Le répertoire `demo/` contient l’application Angular utilisée par les deux déploiements. Pour l’exécuter localement :

```bash
cd demo
npm install
npm start
```

### Tests de régression visuelle

Nous utilisons Playwright pour les tests de régression visuelle afin d’assurer des styles cohérents sur tous les composants. La suite capture automatiquement toutes les routes en mode clair et en mode sombre.

#### Exécuter les tests

```bash
cd demo

# Exécuter tous les tests E2E
npm run test:e2e

# Exécuter les tests en mode UI (interactif)
npm run test:e2e:ui

# Déboguer les tests
npm run test:e2e:debug

# Pour une PR, demandez la mise à jour des références avec un commentaire /update-screenshots.
# Examinez les changements générés par la CI avant de les accepter.
```

### Canaux de préversion

Une pull request ouverte, non marquée comme brouillon, peut être publiée sous le dist-tag npm `beta` après la réussite de ses workflows `Lint`, `E2E Screenshot Tests Pull Request` et `Package Candidate`. Un propriétaire ou mainteneur du dépôt doit ajouter un commentaire dont le corps complet est :

```text
/beta
```

La demande autorise uniquement le SHA de tête de la pull request présent lors de l’ajout du commentaire. Le workflow vérifie de nouveau l’autorisation du propriétaire ou mainteneur et le SHA de tête juste avant la publication. Tout nouveau commit invalide la demande, quel que soit son auteur ; le nouveau SHA doit réussir la CI et recevoir un nouveau commentaire `/beta` d’un propriétaire ou mainteneur. Les pull requests issues de forks sont prises en charge. Celles qui modifient un workflow conditionnant les versions ne peuvent pas être publiées en bêta avant l’intégration de ces changements dans `main`.

Les versions bêta utilisent `<base>-beta.pr<PR number>.sha<12-character SHA>`. La pull request reçoit un commentaire contenant la version immuable et la commande `npm install` exacte.

Lorsqu’une pull request est fusionnée dans `main`, elle est automatiquement publiée sous le dist-tag npm `beta` uniquement après la réussite de `Lint`, `E2E Screenshot Tests` et `Package Candidate` pour ce commit de fusion exact. Les pushes directs vers `main` ne publient pas de candidat. Les candidats de fusion utilisent `<base>-beta.pr<PR number>.sha<12-character SHA>`, et la pull request fusionnée reçoit la commande d’installation exacte.

Le code candidat est construit dans un workflow en lecture seule sans identifiants de publication npm. Le workflow de publication privilégié ne récupère ni n’exécute jamais le code de la pull request ; il vérifie de nouveau le workflow source et l’identité du package, puis publie uniquement l’artefact immuable empaqueté, avec les scripts de cycle de vie désactivés. Le commentaire contenant la commande d’installation est une notification distincte fournie au mieux et ne peut pas invalider une publication npm réussie.

Seul `npm run release` peut créer un tag de version. Les tags stables `vX.Y.Z`, pour les versions majeures, mineures ou correctives, sont publiés sous npm `latest` ; les tags de révision ou de préversion sont publiés sous `next`. Ni les publications `beta` ni les publications `next` ne modifient le dist-tag npm `latest`.

<!-- /rdlabo-docs-omit -->

<!-- rdlabo-docs-omit -->

## Mainteneurs

- [rdlabo](https://rdlabo.dev/)
<!-- /rdlabo-docs-omit -->
