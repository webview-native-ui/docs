---
title: "Premiers pas avec Cordova"
sourceRevision: "55d276c960fcb2656787871e306b1fe9e82df2a1a4481c0912a900d5df439950"
---

# Premiers pas avec Cordova

Utilisez la version publiée v0.1.7 de `@webview-native-ui/cordova-plugin` pour ajouter Native UI à une application Cordova. L’adaptateur partage Native UI Core avec le plugin Capacitor ; il ne nécessite pas le runtime JavaScript Capacitor. Le HTML standard est pris en charge via `/core`, tandis que la racine du package ajoute l’intégration Ionic.

Sur iOS, les boutons du rail vertical conservent le fond en verre du système. La propriété Ionic `color` permet de teinter leur icône.

Si une liste virtuelle continue de se mettre à jour après un changement d’onglet, Core prépare l’image destinée au Web dès la fin de la transition vers la vue native.

## Prérequis et prise en charge

- Cordova CLI 13, avec cordova-ios 8.1+ utilisant Swift Package Manager, ou cordova-android 15+.
- Les contrôles iOS natifs nécessitent iOS 26+ et Xcode 26+. Les versions antérieures d’iOS conservent la présentation Web. CocoaPods et les anciennes versions de Cordova ne sont pas pris en charge.
- L’intégration Ionic nécessite `@ionic/core >=8.8.1 <10`. Le HTML standard via `/core` ne nécessite pas Ionic.
- Android nécessite l’API 24+, le SDK 36, JDK 21, Kotlin 2.2.20 et Compose. Les contrôles standard conservent la présentation Web ; les extensions Compose locales à l’application sont prises en charge séparément. Ne supposez pas une parité avec les barres d’outils ou la recherche iOS.

## Installer la même version dans les deux projets

Exécutez cette commande dans le projet Cordova :

```sh
cordova plugin add @webview-native-ui/cordova-plugin@0.1.7
```

Pour une application Web assemblée par un bundler, exécutez aussi cette commande dans le projet npm qui construit les ressources Web :

```sh
npm install --save-exact @webview-native-ui/cordova-plugin@0.1.7
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

## Android Dynamic Color

Sous Android 12 ou version ultérieure, lisez la palette après l’initialisation de Cordova. Cette API fonctionne indépendamment des contrôles natifs.

```ts
import { getDynamicColorScheme } from '@webview-native-ui/cordova-plugin/core';

const scheme = await getDynamicColorScheme();
```

## Thème iOS facultatif

Si votre application utilise le thème iOS, installez-le séparément. Consultez [Configurer le thème avec Cordova](/ionic-theme-ios27/docs/cordova).

**iPhone Duo** — Cordova ne dispose pas d’équivalent à `@erkamyaman/capacitor-foldable`. Cette configuration ne prend pas en charge l’iPhone Duo.

## Badges des boutons de barre d’outils

Placez `ion-badge` dans un `ion-button`, directement sous ce bouton dans un `ion-toolbar`.

```html
<ion-toolbar>
  <ion-buttons slot="end">
    <ion-button aria-label="3 notifications">
      <ion-icon name="ellipsis-horizontal" slot="icon-only"></ion-icon>
      <ion-badge color="primary">3</ion-badge>
    </ion-button>
  </ion-buttons>
</ion-toolbar>
```

Sur les Vertical Bars natives iOS prises en charge, le badge reprend le texte source et les couleurs Ionic de fond et de texte. Le repli Web du rail conserve également son état d’affichage. Les changements de nombre et de couleur, le masquage et la suppression mettent à jour l’action existante. Pour un indicateur de non-lu, utilisez un `<ion-badge></ion-badge>` entièrement vide, sans espace ni saut de ligne à l’intérieur. Incluez l’état des notifications dans le libellé accessible. Mettez à jour les deux installations du plugin, exécutez `cordova prepare` et reconstruisez l’application native.

## Étapes suivantes

- Les [concepts et limites d’Engine](/webview-native-ui-engine/docs/concepts) expliquent le modèle de présentation partagé.
- Le [README du package](https://github.com/webview-native-ui/cordova-plugin/blob/v0.1.7/README.md) couvre les archives locales, le dépannage, le code partagé et les vérifications de développement.
- Signalez les problèmes d’installation Cordova, de callbacks et de cycle de vie dans le [dépôt Cordova](https://github.com/webview-native-ui/cordova-plugin/issues).
