---
title: "Démarrage et disposition de l’appareil"
sourceRevision: "0daef9b9b205c8ca6d5eb604459f7f856fa549d2659b03adc687ba15d0f7bd29"
---

# Démarrage et disposition de l’appareil

Démarrez Native UI une fois après le rendu de la coque de l’application. Transmettez les rapports de disposition de Foldable au thème pour adapter les espacements Web à l’appareil.

## Disposition de l’appareil

Après le rendu de `ion-app`, abonnez-vous à `layoutChange`, puis lisez la disposition initiale :

```ts
import { Foldable } from '@erkamyaman/capacitor-foldable';
import { resolveVerticalBarsLayout } from '@rdlabo/capacitor-native-ui/integration';
import { setVerticalBarsLayout } from '@rdlabo/ionic-theme-ios27';

const updateLayout = async () => {
  setVerticalBarsLayout(await resolveVerticalBarsLayout(Foldable));
};

void Foldable.addListener('layoutChange', () => void updateLayout().catch(console.error))
  .then(updateLayout)
  .catch(console.error);
```

Utilisez Foldable 8.5 ou ultérieur dans la version 8. Le résolveur renvoie `edge`, `inset` et `toolbarTop` en pixels CSS du viewport. Le thème applique ces valeurs à la disposition Web ; un bord nul rétablit la disposition ordinaire. Native UI gère séparément la projection des contrôles.

## Amorçage Angular

Dans `src/main.ts`, démarrez Native UI après l’amorçage Angular :

```ts
import { bootstrapApplication } from '@angular/platform-browser';
import { enableNativeUI } from '@rdlabo/capacitor-native-ui';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

void bootstrapApplication(AppComponent, appConfig)
  .then(() => {
    void enableNativeUI().catch(console.error);
  })
  .catch(console.error);
```

Placez le code de disposition ci-dessus dans le callback `afterNextRender` existant de la coque de l’application. Conservez les routes Ionic et les gestionnaires de pages. Aucun service ni wrapper de cycle de vie supplémentaire n’est nécessaire.

## React, Vue et autres frameworks

Après le rendu de la coque de l’application, démarrez Native UI une fois et raccordez le code de disposition ci-dessus :

```ts
import { enableNativeUI } from '@rdlabo/capacitor-native-ui';

void enableNativeUI().catch(console.error);
```

Utilisez le point d’entrée de démarrage après le montage, plutôt qu’une page routée. Les applications HTML utilisent l’entrée `/core` et leur propre mise à jour CSS à la place de `setVerticalBarsLayout`.

## Vérifier le comportement sur appareil

Sur un appareil compatible avec le rail, changez l’écran actif et vérifiez que l’espacement du contenu Web et l’origine de la barre d’outils évoluent ensemble. Sans rail, la disposition ordinaire reste active. Un aperçu navigateur vérifie la disposition Web ; le rendu natif exige un appareil et un OS iOS compatibles.
