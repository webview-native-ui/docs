---
title: "Premiers pas avec Cordova"
sourceRevision: "c9d494267c831a5f60d6ac5950069f416b8663e27c18e6c5dea492385838db46"
---

# Premiers pas avec Cordova

Utilisez la version publiée v0.1.1 de `@webview-native-ui/cordova-plugin` pour ajouter Native UI à une application Cordova. L’adaptateur partage Native UI Core avec le plugin Capacitor ; il ne nécessite pas le runtime JavaScript Capacitor. Le HTML standard est pris en charge via `/core`, tandis que la racine du package ajoute l’intégration Ionic.

## Prérequis et prise en charge

- Cordova CLI 13, avec cordova-ios 8.1+ utilisant Swift Package Manager, ou cordova-android 15+.
- Les contrôles iOS natifs nécessitent iOS 26+ et Xcode 26+. Les versions antérieures d’iOS conservent la présentation Web. CocoaPods et les anciennes versions de Cordova ne sont pas pris en charge.
- L’intégration Ionic et le thème fourni nécessitent `@ionic/core >=8.8.1 <10`. Le HTML standard via `/core` ne nécessite pas Ionic.
- Android nécessite l’API 24+, le SDK 36, JDK 21, Kotlin 2.2.20 et Compose. Les contrôles standard conservent la présentation Web ; les extensions Compose locales à l’application sont prises en charge séparément. Ne supposez pas une parité avec les barres d’outils ou la recherche iOS.

## Installer la même version dans les deux projets

Exécutez cette commande dans le projet Cordova :

```sh
cordova plugin add @webview-native-ui/cordova-plugin@0.1.1
```

Pour une application Web assemblée par un bundler, exécutez aussi cette commande dans le projet npm qui construit les ressources Web :

```sh
npm install --save-exact @webview-native-ui/cordova-plugin@0.1.1
```

La commande Cordova installe le plugin natif. La dépendance npm fournit les imports au bundler Web. Gardez leurs versions alignées. Conservez `<script src="cordova.js"></script>` dans le HTML d’entrée Cordova, construisez les ressources Web dans `www`, puis exécutez `cordova prepare` et reconstruisez l’application native. Recharger les ressources Web ne met pas à jour le code natif. L’installation directe par URL Git n’est pas prise en charge.

Ajoutez ces préférences à `config.xml` pour Android :

```xml
<preference name="GradlePluginKotlinEnabled" value="true" />
<preference name="GradlePluginKotlinVersion" value="2.2.20" />
<preference name="AndroidGradlePluginVersion" value="8.13.0" />
<preference name="AndroidJavaSourceCompatibility" value="21" />
<preference name="AndroidJavaTargetCompatibility" value="21" />
<preference name="AndroidKotlinJVMTarget" value="21" />
```

## Démarrer lorsque Cordova est prêt

Pour l’API navigateur fournie, conservez le handle et démarrez après `deviceready` :

```js
let nativeUI;

document.addEventListener('deviceready', async () => {
  nativeUI = await window.NativeUI.enableNativeUI();
}, { once: true });
```

Appelez `await nativeUI.destroy()` lorsque l’application cesse définitivement d’utiliser Native UI. Inspectez `nativeUI.getStatus()` pour diagnostiquer le repli Web. Sur iOS, prévoyez les espacements de zone sûre dans votre CSS, par exemple avec `env(safe-area-inset-top)` ; les retraits automatiques de la vue défilante sont désactivés.

Pour une application ESM, importez `enableNativeUI` depuis `@webview-native-ui/cordova-plugin/core` pour le HTML standard, ou depuis `@webview-native-ui/cordova-plugin` pour Ionic. Utilisez un seul type d’entrée du runtime. Ne mélangez pas le démarrage npm et le démarrage `window.NativeUI`.

## Thème Ionic fourni, facultatif

La version 0.1.1 inclut le thème iOS27 en version 2.1.0. Le thème autonome est publié indépendamment ; installer sa version la plus récente ne met pas à jour la copie fournie avec ce plugin Cordova. Utilisez les entrées `/theme` et `/theme/css/*` du plugin sans alias de bundler. Suivez la [configuration du thème Cordova](/ionic-theme-ios27/docs/cordova) pour raccorder les animations et les feuilles de style, et remplacez les anciens imports du thème au lieu de mélanger les deux intégrations.

Ne démarrez Native UI qu’après `deviceready` et le montage de `ion-app` par l’application. Importer ou appliquer les styles du thème n’active pas à lui seul les contrôles natifs. Capacitor est l’hôte principal ; le périmètre de prise en charge de Cordova est plus réduit, et la réussite des builds ne garantit pas une parité complète des routeurs de framework ou des gestes.

## Étapes suivantes

- Les [concepts et limites d’Engine](/webview-native-ui-engine/docs/concepts) expliquent le modèle de présentation partagé.
- Le [README du package](https://github.com/webview-native-ui/cordova-plugin/blob/5ac3c7e2754c55c3ffde2e90b3d54ad10152362a/README.md) couvre les archives locales, le dépannage, le code partagé et les vérifications de développement.
- Signalez les problèmes d’installation Cordova, de callbacks et de cycle de vie dans le [dépôt Cordova](https://github.com/webview-native-ui/cordova-plugin/issues).
