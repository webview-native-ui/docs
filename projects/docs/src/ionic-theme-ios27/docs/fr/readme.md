---
title: "Premiers pas"
sourceRevision: "7340ece4c80437455dcad07cad5def0cdb3b564fba7a8717de8392e9719df36f"
---

Appliquez Liquid Glass et les animations d’iOS 27 aux composants Ionic.

[Installation](setup.md) · [Démo Web](https://ionic-theme-ios27.rdlabo.dev/)

Les exemples utilisent Ionic 9. Avec Ionic 8 et Angular, importez `provideIonicAngular` depuis `@ionic/angular/standalone`.

<!-- rdlabo-docs-pick -->

<p>
  <img src="https://raw.githubusercontent.com/webview-native-ui/ionic-theme-ios27/c70beb9d1e5b39de696b2b2c47a3d9bc5ffcdfbe/screenshots/ios27-settings.png" width="32%" alt="Thème iOS 27 : réglages en mode clair avec une barre de recherche Liquid Glass" />
  <img src="https://raw.githubusercontent.com/webview-native-ui/ionic-theme-ios27/c70beb9d1e5b39de696b2b2c47a3d9bc5ffcdfbe/screenshots/ios27-settings-dark.png" width="32%" alt="Thème iOS 27 : réglages en mode sombre" />
  <img src="https://raw.githubusercontent.com/webview-native-ui/ionic-theme-ios27/c70beb9d1e5b39de696b2b2c47a3d9bc5ffcdfbe/screenshots/ios27-library.png" width="32%" alt="Thème iOS 27 : bibliothèque avec boutons et barre d’onglets Liquid Glass" />
</p>

<!-- /rdlabo-docs-pick -->

<a id="premiers-pas"></a><a id="get-started"></a>

## Que souhaitez-vous faire ?

Avec Cordova, passez d’abord `ios27ThemeConfig` à Ionic, puis [configurez Cordova](cordova.md).

| Objectif | Guide |
| --- | --- |
| Habiller une application Ionic existante | [Premiers pas](https://webview-native-ui.com/projects/ionic-theme-ios27/docs/setup) |
| Choisir les styles iOS 26/27 et éventuellement MD3 | [Thèmes adaptatifs](https://webview-native-ui.com/projects/ionic-theme-ios27/docs/adaptive-themes) |
| Ajouter des contrôles iOS natifs à une application Capacitor | [Ajouter Native UI](https://webview-native-ui.com/projects/ionic-theme-ios27/docs/add-native-ui) |
| Ajouter un rail latéral à Ionic en conservant votre thème | [Vertical Bars pas à pas](https://webview-native-ui.com/projects/capacitor-native-ui/docs/ionic-vertical-bars) |
| Facultatif : utiliser le thème et Native UI avec Cordova | [Configuration Cordova](/docs/cordova) |
| Configurer individuellement les styles, le mode sombre et les animations | [Configuration](/docs/configuration) |
| Mettre à niveau une installation existante | [Migration](https://webview-native-ui.com/projects/ionic-theme-ios27/docs/migration) |

## Personnaliser votre application

Utilisez la [configuration](/docs/configuration) pour les réglages individuels de CSS et d’animation. Les applications existantes peuvent simplifier facultativement leur configuration à l’aide du [guide de migration](/docs/migration#optional-simplify-the-setup).

- [Fonctionnalités](/docs/features) : variables CSS, Liquid Glass et imports sélectifs de composants.
- [Balisage et classes spécifiques](/docs/special-markup) : comportements de composants à activer explicitement.
- [Utiliser ion-item-group](/docs/using-ion-item-group) : balisage des listes en retrait.
- [Animation](/docs/animation) : effets sur les onglets, segments et recherches.
- [ESLint](/docs/eslint) : détecter les structures de liste non prises en charge.
- [Disposition Vertical Bars](/docs/vertical-bars-layout) : espacement, RTL, placement, posture et panneaux divisés.

## Périmètre des dépôts

Le plugin Capacitor est maintenu dans [webview-native-ui/capacitor-plugin](https://github.com/webview-native-ui/capacitor-plugin). Ce dépôt gère le thème Ionic, la démo combinée, les captures du navigateur et les tests d’intégration sur simulateur. La démo installe `@rdlabo/capacitor-native-ui` depuis npm ; les publications du thème ne publient pas le plugin et n’en modifient pas la version.

Si votre application utilise le thème iOS, installez-le séparément. Consultez [Configurer le thème avec Cordova](cordova.md).

Pour vérifier une archive de plugin non publiée avec la démo réelle, exécutez :

```sh
npm run test:native-candidate -- /absolute/path/rdlabo-capacitor-native-ui-VERSION.tgz --e2e
```

Cette commande crée un checkout temporaire isolé sans modifier vos manifestes ni fichiers de verrouillage. Ajoutez `--shard=1/2` avec `--e2e` pour exécuter un shard Playwright ; exécutez tous les shards pour couvrir la suite complète. Chaque shard conserve les vérifications de package, les tests unitaires et le build de production. Ajoutez `--simulator=UDID` pour les suites sur simulateur d’interface native, de recherche et de bords. Les diagnostics et la démo temporaire sont conservés au chemin affiché. Les tests unitaires propres au plugin et les tests de bibliothèque native se trouvent dans son dépôt. Sa CI teste chaque archive candidate avec la branche main de ce dépôt.

## Maintenance

Publiez le package de thème racine avec `npm run release` depuis une branche `main` propre et à jour. Le workflow des tags `ios27-v…` publie uniquement le thème, avec `next` pour les préversions et `latest` pour les versions stables.

Les versions du thème et du plugin sont indépendantes. Pour le package autonome `@rdlabo/ionic-theme-ios27`, Capacitor Native UI est une dépendance pair obligatoire afin que le thème et l’application partagent une seule instance du plugin. npm 7+ l’installe automatiquement pour les applications utilisant seulement le thème ; les autres gestionnaires doivent installer les dépendances pairs obligatoires. Les applications avec des contrôles natifs doivent aussi déclarer directement le plugin pour sa détection par Capacitor. Une version npm publiée ne peut pas être écrasée.
