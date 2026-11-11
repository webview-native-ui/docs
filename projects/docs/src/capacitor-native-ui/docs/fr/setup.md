---
title: "Configurer Native UI dans une application Ionic"
sourceRevision: "13342d88e06664f78fd13bc71777b73b3c4be06d5865804072aea81678a2dc49"
---

# Configurer Native UI dans une application Ionic

Commencez par la configuration Ionic iOS standard : installez les packages, utilisez le préréglage du thème et démarrez un seul runtime Native UI. **Vertical Bars est activé par défaut**, avec les contrôles ordinaires. Un appareil compatible choisit le placement du rail ; les navigateurs et les appareils sans rail conservent leur disposition Web.

Utilisez une application Ionic existante avec Capacitor 8. Ce guide utilise la feuille de style et la configuration de haut niveau du thème iOS 27. Pour conserver un autre thème Web, utilisez [la configuration pour un thème existant](ionic-vertical-bars.md) ; sans Ionic, utilisez la [configuration HTML](framework-independent.md).

## 1. Installer le plugin

```sh
npm install @rdlabo/capacitor-native-ui @rdlabo/ionic-theme-ios27 @erkamyaman/capacitor-foldable
```

Déclarez Native UI directement dans l’application pour que Capacitor découvre son plugin natif. Conservez le thème, le plugin et Foldable comme dépendances distinctes ; le thème déclare sa plage de dépendance pair compatible avec Native UI. L’intégration standard de la disposition de l’appareil utilise Foldable 8.5 ou ultérieur dans la version majeure 8.

## 2. Activer le shell

Conservez les styles de base d’Ionic. Dans la feuille de style globale, remplacez les imports distincts de la palette sombre Ionic et du thème iOS par l’unique point d’entrée du thème :

```css
@import '@rdlabo/ionic-theme-ios27/styles/system.css';
```

Transmettez le préréglage du thème à votre initialisation Ionic existante, avant le rendu :

```ts
import { ios27ThemeConfig } from '@rdlabo/ionic-theme-ios27';

const ionicConfig = {
  ...ios27ThemeConfig,
};
```

| Framework | Initialisation Ionic existante |
| --- | --- |
| Angular / Ionic 8 | `provideIonicAngular(ionicConfig)` depuis `@ionic/angular/standalone` |
| Angular / Ionic 9 | `provideIonicAngular(ionicConfig)` depuis `@ionic/angular` |
| React | `setupIonicReact(ionicConfig)` depuis `@ionic/react` |
| Vue | `app.use(IonicVue, ionicConfig)` avec `IonicVue` depuis `@ionic/vue` |

La feuille de style comprend la disposition Vertical Bars ; le préréglage comprend la transition de page coordonnée avec Native UI. N’ajoutez pas une deuxième feuille de style de rail et n’enveloppez pas de nouveau la transition du préréglage. Consultez la [configuration du thème](https://webview-native-ui.com/projects/ionic-theme-ios27/docs/configuration) pour le mode sombre manuel et les personnalisations de l’application.

Démarrez Native UI une seule fois après le montage de l’élément `ion-app` de l’application :

```ts
import { enableNativeUI } from '@rdlabo/capacitor-native-ui';

const shell = await enableNativeUI();
```

Cet appel par défaut active les contrôles ordinaires **et Vertical Bars**. Ne transmettez pas `controls: 'verticalOnly'` pour la configuration standard. La sélection individuelle, le placement fixe pour un aperçu dans le navigateur, les extensions et les baux de suspension sont des API de référence, pas des prérequis d’installation.

### Placer le démarrage à la racine de votre framework

L’amorçage de l’application possède le cycle de vie du runtime. Les rapports de l’appareil appartiennent à un service de l’application, la configuration du thème à l’initialisation Ionic et à la feuille de style globale, et les composants routés conservent leurs gestionnaires et leur état existants. N’ajoutez pas un second routeur, un état de projection ou une gestion du cycle de vie natif dans `AppComponent` ou dans les composants de page.

Pour Angular, utilisez le [service de disposition de l’appareil](ionic-vertical-bars.md#3-connect-device-placement-and-start-the-controls), puis reliez les deux propriétaires dans le fichier `src/main.ts` existant :

```ts
import { bootstrapApplication } from '@angular/platform-browser';
import { enableNativeUI } from '@rdlabo/capacitor-native-ui';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';
import { VerticalBarsLayoutService } from './app/vertical-bars-layout.service';

void bootstrapApplication(AppComponent, appConfig)
  .then(async (app) => {
    const shell = await enableNativeUI();
    if (app.destroyed) {
      await shell.destroy();
      return;
    }
    app.onDestroy(() => {
      void shell.destroy().catch((error: unknown) => console.error('Native UI cleanup failed', error));
    });
    await app.injector.get(VerticalBarsLayoutService).initialize();
  })
  .catch((error: unknown) => console.error('Application startup failed', error));
```

Intégrez ceci dans l’unique amorçage de l’application ; ne créez pas un autre amorçage ou un autre runtime. `AppComponent` continue à assembler uniquement la structure de l’application et la sortie du routeur. Le service s’abonne avant sa lecture initiale de l’appareil, retire son écouteur à la destruction et transmet la géométrie résolue au thème. Native UI possède la projection native, le repli et la transmission des événements.

Les applications React et Vue conservent la même répartition : démarrez une seule fois après le montage de la structure de l’application, maintenez les rapports de l’appareil au-dessus des pages routées, puis détruisez le runtime retourné et retirez l’écouteur de l’appareil lorsque ce propriétaire est libéré. Ne copiez pas le service d’injection de dépendances Angular dans un autre framework et n’introduisez pas de file globale de cycle de vie partagée au niveau du module.

## 3. Coordonner la navigation

Le préréglage standard `ios27ThemeConfig` coordonne déjà la présentation native avec la navigation Ionic, y compris les gestes de retour. Conservez les routes et gestionnaires Ionic habituels. Aucune enveloppe `navigate()` écrite par l’application, aucun changement de page par Web Animation et aucun démarrage Native UI par page ne sont nécessaires.

La configuration Vertical Bars par défaut comprend l’abonnement à l’appareil ci-dessus ; il ne s’agit pas d’une activation facultative à effectuer ensuite. `layoutChange` et `resolveVerticalBarsLayout(Foldable)` fournissent le bord, le retrait et l’origine de la barre d’outils même lorsqu’un changement d’écran ne modifie pas le bord ou le retrait. Le thème applique la disposition Web ; Native UI détermine si le rendu natif du rail est disponible. Un bord d’appareil nul rétablit la disposition ordinaire.

Pour un thème Web existant ou personnalisé, suivez [la configuration autonome de disposition et de transition](ionic-vertical-bars.md) au lieu de remplacer le thème. Les constructeurs d’animation personnalisés utilisent [l’adaptateur de transition](migration.md#native-ui-transition-adapter) ; cela remplace le chemin du préréglage au lieu d’ajouter un second coordinateur.

## 4. Compiler, synchroniser et exécuter

Les contrôles natifs ordinaires nécessitent Ionic `>=8.8.1 <10`, Capacitor 8, Xcode 26+ et iOS 26+. Vertical Bars natif nécessite aussi [l’appareil et le système compatibles avec le rail](vertical-bars.md#native-rendering). Activer le rail par défaut ne force pas un matériel incompatible à en afficher un.

SwiftPM résout Engine automatiquement. Pour une application CocoaPods existante, installez la version d’Engine requise par votre package Native UI installé :

```sh
npm install "@webview-native-ui/engine@$(node -p "require('./node_modules/@rdlabo/capacitor-native-ui/package.json').dependencies['@webview-native-ui/engine']")"
```

Ajoutez Engine à la cible existante de l’application dans `ios/App/Podfile`, en dehors du bloc généré `def capacitor_pods` :

```ruby
target 'App' do
  capacitor_pods
  pod 'WebViewNativeUIEngine', :path => '../../node_modules/@webview-native-ui/engine'
  # Keep your other application pods here.
end
```

Adaptez le chemin à la structure du projet et réalignez les versions lors des mises à jour de Native UI. Il s’agit de la configuration de compatibilité CocoaPods, pas de logique d’interface de l’application.

Compilez les ressources Web de l’application, puis synchronisez :

```sh
npx cap sync ios
```

Recompilez et exécutez dans Xcode. Les actions de barre d’outils et les onglets existants compatibles doivent être projetés nativement et appeler leurs gestionnaires d’origine. Sur un appareil compatible avec le rail, ils utilisent Vertical Bars et le contenu réserve l’espace signalé. Vérifiez la navigation avant/arrière, l’annulation du geste de retour, un changement d’écran de l’appareil et le repli Web. Un aperçu dans le navigateur ne permet pas de vérifier le rendu natif.

| Si vous observez… | Vérifiez… |
| --- | --- |
| Tous les contrôles restent Web sur un iOS compatible | Dépendance directe, démarrage après montage, synchronisation Capacitor et recompilation native. |
| Un seul contrôle reste Web | Comparez son balisage source aux [contrôles pris en charge](native-ui.md#supported-markup). |
| Un appareil avec rail conserve la disposition ordinaire | Connectez le service de l’appareil et chargez la feuille de style correspondante du thème. |
| La disposition ne suit pas les changements d’écran | Utilisez `layoutChange` avec le résolveur, pas seulement un événement de bord ou de retrait. |
| Les contrôles se chevauchent pendant la navigation | Conservez la transition du préréglage ou configurez exactement un adaptateur de transition personnalisé. |

## Étapes suivantes

- [Conserver un thème Web existant](ionic-vertical-bars.md) avec le comportement Vertical Bars standard.
- [Référence de configuration](configuration.md) pour les personnalisations explicites et la désactivation des valeurs par défaut.
- [Contrôles pris en charge](native-ui.md) et [apparence](appearance.md).
- [Migration](migration.md) pour les anciens noms de packages et API d’intégration.

## Navigation sans thème

Cette intégration avancée concerne les applications qui possèdent un autre cycle de navigation ; elle ne fait pas partie de l’installation Ionic standard. Conservez le routeur de l’application comme unique propriétaire de la navigation. Utilisez [l’exemple HTML](https://github.com/webview-native-ui/capacitor-plugin/tree/v2.1.4/examples/native-ui-html) pour une application sans routeur et la [suspension](native-ui.md#custom-overlay-suspension) lorsque l’application doit explicitement rendre la présentation au Web. Reprenez seulement une fois la navigation terminée ou son annulation stabilisée ; ne copiez pas un second routeur de pages dans une application Ionic.
