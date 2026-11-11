---
title: "Installer le thème iOS 26"
sourceRevision: "972873bad21952ab2b7f25d58c5a1373b1507f7ac8294e99dbb24423fab1c7fd"
---

# Installer le thème iOS 26

Utilisez une application Ionic Angular, React ou Vue existante avec `@ionic/core >=8.8.1 <10`.

## 1. Installer

```sh
npm install @rdlabo/ionic-theme-ios26
```

## 2. Charger une feuille de style

Après les styles de base d’Ionic, ajoutez cet import à votre feuille de style globale.

```css
@import '@rdlabo/ionic-theme-ios26/styles/system.css';
```

Cette feuille de style fournit les variables du thème, les styles des composants, les styles de compatibilité Material Design, la palette sombre système d’Ionic et les styles sombres correspondants du thème. Utilisez `styles/class.css` pour le mode sombre manuel via la classe `ion-palette-dark` sur la racine du document, ou `styles/always.css` pour une apparence toujours sombre. Choisissez la feuille de style correspondant à la politique de mode sombre de votre application et remplacez les imports existants correspondants du thème et de la palette sombre Ionic.

## 3. Configurer Ionic

Déployez `ios26ThemeConfig` par spread dans votre initialiseur de framework existant avant le rendu. Utilisez l’exemple correspondant à votre framework.

Angular avec Ionic 9 importe `provideIonicAngular` depuis `@ionic/angular`. Avec Ionic 8, utilisez `@ionic/angular/standalone` pour cet import.

```ts
import { provideIonicAngular } from '@ionic/angular';
import { ios26ThemeConfig } from '@rdlabo/ionic-theme-ios26';

// In the application's existing providers array
provideIonicAngular({
  ...ios26ThemeConfig,
  // animated: false,
});
```

Pour React :

```ts
import { setupIonicReact } from '@ionic/react';
import { ios26ThemeConfig } from '@rdlabo/ionic-theme-ios26';

setupIonicReact({
  ...ios26ThemeConfig,
  // animated: false,
});
```

Pour Vue, utilisez l’application Vue existante :

```ts
import { IonicVue } from '@ionic/vue';
import { ios26ThemeConfig } from '@rdlabo/ionic-theme-ios26';

app.use(IonicVue, {
  ...ios26ThemeConfig,
  // animated: false,
});
```

La configuration définit `mode: 'ios'` ; le thème apparaît donc aussi dans les aperçus sur ordinateur. Ajoutez vos options Ionic après le spread pour remplacer les valeurs par défaut. Si l’application sélectionne ses modes selon la plateforme, ne déployez la configuration que pour le mode iOS. Consultez un exemple dans [Configuration](configuration.md#theme-configuration-and-customization).

## 4. Prévisualiser

Démarrez le serveur de développement habituel de votre application et ouvrez une page existante. Ajoutez ce balisage dans son `ion-content`, avec la syntaxe de composants de votre framework.

```html
<ion-list inset="true">
  <ion-item-group>
    <ion-item><ion-label>Notifications</ion-label></ion-item>
    <ion-item><ion-label>Appearance</ion-label></ion-item>
  </ion-item-group>
</ion-list>
```

Vérifiez les groupes arrondis en retrait, naviguez entre les pages et contrôlez la politique de mode sombre choisie. Consultez [Utiliser ion-item-group](using-ion-item-group.md) pour la structure des listes. La [configuration](configuration.md) couvre les imports CSS individuels et les options d’animation. La [migration](migration.md) couvre l’adoption des wrappers dans une application existante et les mises à niveau propres à chaque version.
