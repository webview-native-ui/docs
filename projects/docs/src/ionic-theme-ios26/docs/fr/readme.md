---
title: "Premiers pas"
sourceRevision: "3f6cb5f433af923f336fdbb6cf3bbf04c75438e7c53e49edb60efec560549455"
---
# Ionic Theme iOS26

Bibliothèque de thème CSS/JS qui applique le système de design iOS26 aux applications Ionic.

<!-- rdlabo-docs-pick -->

![Écrans Ionic au thème iOS 26 avec barre d’onglets Liquid Glass, listes et contrôles](https://raw.githubusercontent.com/webview-native-ui/ionic-theme-ios27/ios26-v9.4.3/screenshots/ios26.png)

<!-- /rdlabo-docs-pick -->

Démonstration : https://ionic-theme-ios26.rdlabo.dev/

## Installation

```sh
npm install @rdlabo/ionic-theme-ios26
```

Après le CSS de base d’Ionic, ajoutez la feuille de style sombre système à votre feuille de style globale.

```css
@import '@rdlabo/ionic-theme-ios26/styles/system.css';
```

Déployez `ios26ThemeConfig` par spread dans les options de votre initialiseur Ionic existant. La configuration fournit le mode iOS et les animations du thème.

```ts
import { ios26ThemeConfig } from '@rdlabo/ionic-theme-ios26';

const ionicConfig = {
  ...ios26ThemeConfig,
  // animated: false,
};
```

Suivez [Installer le thème](/docs/setup) pour les exemples Angular, React et Vue, le choix du mode sombre et un aperçu. Utilisez la [configuration](/docs/configuration) pour les exports individuels de CSS et d’animation, les options personnalisées et la combinaison iOS 26 avec MD3. Les applications existantes peuvent adopter les wrappers à l’aide de la [migration](/docs/migration).

## Documentation

- [Utiliser ion-item-group](https://docs.rdlabo.dev/projects/ionic-theme-ios26/docs/using-ion-item-group) — balisage requis pour les listes en retrait.
- [Balisage et classes particuliers](https://docs.rdlabo.dev/projects/ionic-theme-ios26/docs/special-markup) — balisage à activer explicitement et classes utilitaires du thème.
- [ESLint](https://docs.rdlabo.dev/projects/ionic-theme-ios26/docs/eslint) — vérifier la structure des listes avec les règles ESLint.
- [Fonctionnalités](https://docs.rdlabo.dev/projects/ionic-theme-ios26/docs/features) — variables CSS, Liquid Glass, importations sélectives et mode sombre.
- [Animation expérimentale](https://docs.rdlabo.dev/projects/ionic-theme-ios26/docs/experimental-animation) — effets de barre d’onglets et de recherche.
- [iOS 18](https://docs.rdlabo.dev/projects/ionic-theme-ios26/docs/ios-18) — charger le thème uniquement sur iOS 26.
- [Migration](/docs/migration) — adoption facultative des wrappers et étapes de mise à niveau propres à chaque version.

<!-- rdlabo-docs-omit -->

**Documentation complète :** [https://docs.rdlabo.dev/projects/ionic-theme-ios26](https://docs.rdlabo.dev/projects/ionic-theme-ios26)

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

- [Démonstration Ionic 9](https://ionic-theme-ios26.rdlabo.dev) — version de référence
- [Démonstration Ionic 8](https://ionic8-theme-ios26.rdlabo.dev) — compatibilité

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

# Mettre à jour les captures de référence (modification volontaire de l’interface)
npm run test:e2e:update
```

### Canaux de préversion

Une pull request ouverte, non marquée comme brouillon, peut être publiée sous le dist-tag npm `beta` après la réussite de ses workflows `Lint`, `E2E Screenshot Tests Pull Request` et `Package Candidate`. Un propriétaire ou mainteneur du dépôt doit ajouter un commentaire dont le corps complet est :

```text
/beta
```

La demande autorise uniquement le SHA de tête et la branche de base de la pull request présents lors de l’ajout du commentaire. Le workflow vérifie de nouveau l’autorisation du propriétaire ou mainteneur, le SHA de tête et la branche de base juste avant la publication. Tout nouveau commit ou changement de cible invalide la demande ; le nouvel état doit réussir la CI et recevoir un nouveau commentaire `/beta` d’un propriétaire ou mainteneur. Les pull requests issues de forks sont prises en charge. Celles qui modifient un workflow conditionnant les versions ne peuvent pas être publiées en bêta avant l’intégration de ces changements dans leur branche cible.

Les versions bêta utilisent `<base>-beta.pr<PR number>.sha<12-character SHA>`. La pull request reçoit un commentaire contenant la version immuable et la commande `npm install` exacte.

Lorsqu’une pull request est fusionnée dans `main` ou `ios26`, elle est automatiquement publiée sous le dist-tag npm `beta` uniquement après la réussite de `Lint`, `E2E Screenshot Tests` et `Package Candidate` pour ce commit de fusion exact. Les pushes directs ne publient pas de candidat. Les candidats de fusion utilisent `<base>-beta.pr<PR number>.sha<12-character SHA>`, et la pull request fusionnée reçoit la commande d’installation exacte.

Le code candidat est construit dans un workflow en lecture seule sans identifiants de publication npm. Le workflow de publication privilégié ne récupère ni n’exécute jamais le code de la pull request ; il vérifie de nouveau le workflow source et l’identité du package, puis publie uniquement l’artefact immuable empaqueté, avec les scripts de cycle de vie désactivés. Le commentaire contenant la commande d’installation est une notification distincte fournie au mieux et ne peut pas invalider une publication npm réussie.

Seul `npm run release` peut créer un tag de version. Les tags stables `ios26-vX.Y.Z`, pour les versions majeures, mineures ou correctives, sont publiés sous npm `latest` ; les tags de révision ou de préversion sont publiés sous `next`. Ni les publications `beta` ni les publications `next` ne modifient le dist-tag npm `latest`.

<!-- /rdlabo-docs-omit -->

<!-- rdlabo-docs-omit -->

## Mainteneurs

- [rdlabo](https://rdlabo.dev/)
<!-- /rdlabo-docs-omit -->
