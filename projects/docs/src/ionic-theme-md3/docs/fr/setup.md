---
title: "Installer le thème MD3"
sourceRevision: "5f726b394cc1721628b2f84d869bd1bb63654ca1599e26a8c8daf82d68a0ff3b"
---

# Installer le thème MD3

Utilisez une application Ionic Angular, React ou Vue existante avec Ionic `>=8.8.0 <10`.

## Installer le thème

```sh
npm install @rdlabo/ionic-theme-md3
```

## Charger la feuille de style du thème

Ajoutez un import à votre feuille de style globale après le CSS de base d’Ionic et la palette sombre Ionic sélectionnée :

```css
@import '@rdlabo/ionic-theme-md3/styles/theme.css';
```

Cette feuille de style réunit les variables par défaut et les styles des composants MD3. Pour l’adopter dans une application existante, remplacez les imports individuels des feuilles de style MD3. Conservez l’import de la palette sombre Ionic choisie, par exemple `@ionic/core/css/palettes/dark.system.css`, et placez les personnalisations de l’application après la feuille de style du thème. MD3 utilise une seule feuille de style pour tous les modes d’apparence. Pour [Dynamic Colors](dynamic-colors.md), sélectionnez la palette Ionic `dark.class.css`.

## Configurer Ionic

Déployez `md3ThemeConfig` par spread dans les options transmises à l’initialiseur Ionic que votre application appelle déjà, avant de rendre les composants. Choisissez l’exemple correspondant à votre framework.

### Angular

```ts
import { provideIonicAngular } from '@ionic/angular'; // Ionic 9
// Ionic 8: import { provideIonicAngular } from '@ionic/angular/standalone';
import { md3ThemeConfig } from '@rdlabo/ionic-theme-md3';

provideIonicAngular({
  ...md3ThemeConfig,
  // animated: false,
});
```

### React

```ts
import { setupIonicReact } from '@ionic/react';
import { md3ThemeConfig } from '@rdlabo/ionic-theme-md3';

setupIonicReact({
  ...md3ThemeConfig,
  // animated: false,
});
```

### Vue

```ts
import { IonicVue } from '@ionic/vue';
import { md3ThemeConfig } from '@rdlabo/ionic-theme-md3';

app.use(IonicVue, {
  ...md3ThemeConfig,
  // animated: false,
});
```

La configuration définit `mode: 'md'` et la transition de page MD3. Ajoutez les options de l’application après le spread pour remplacer ces valeurs par défaut. Pour une apparence dépendant de la plateforme, sélectionnez la configuration correspondant au mode comme indiqué dans la [configuration](configuration.md#preserve-existing-mode-selection). L’objet exporté peut être importé pendant le rendu côté serveur.

## Prévisualiser un écran

Démarrez le serveur de développement habituel de l’application. Ouvrez une page contenant ce balisage, avec la syntaxe de composants de votre framework :

```html
<ion-list inset="true">
  <ion-item-group>
    <ion-item><ion-label>Notifications</ion-label></ion-item>
    <ion-item><ion-label>Appearance</ion-label></ion-item>
  </ion-item-group>
</ion-list>
```

Vérifiez la liste groupée, naviguez entre les pages et changez l’apparence de l’appareil selon la politique de palette sombre Ionic choisie. Consultez la [structure des listes](using-ion-item-group.md) pour le balisage groupé attendu et la [configuration](configuration.md) pour les feuilles de style, les animations et le maintien de la sélection du mode selon la plateforme.
