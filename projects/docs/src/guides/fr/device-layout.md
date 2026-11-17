---
title: 'S’adapter à l’appareil'
sourceRevision: '4dddeb29f25d7325ac010931f49b4755159d61204419f0f9812e020641d01b97'
---

# S’adapter à l’appareil

Réservez l’espace du rail latéral signalé et restaurez la disposition ordinaire lorsqu’il disparaît. Vérifiez d’abord l’espacement Web, puis le signal de l’appareil et le rendu natif.

Pour [Native UI avec un thème existant](/projects/capacitor-native-ui/docs/ionic-vertical-bars), [HTML sans Ionic](/projects/capacitor-native-ui/docs/framework-independent) ou [Cordova](/projects/cordova-native-ui/docs/readme), utilisez l’intégration correspondante. [Choisissez votre intégration](/#choose-setup) avant de modifier l’application.

## 1. Repérer l’abonnement existant

La [configuration](/standard-setup) charge déjà le CSS du rail et l’abonnement de disposition. Gardez-le une fois dans le shell après le rendu d’ion-app, pas dans chaque page. Utilisez Foldable 8.5 ou ultérieur dans la version 8. Une grande fenêtre ne suffit pas à activer un rail natif.

## 2. Lire et appliquer le signal réel

Remplacez le bloc de mise à jour existant pour inspecter les valeurs, avec un seul abonnement. Le résolveur fournit edge, inset et toolbarTop ; le thème gère les directions logiques et rétablit les marges si edge est null. Ne substituez ni nom d’appareil, ni largeur fixe, ni test de fenêtre.

```ts
import { Foldable } from '@erkamyaman/capacitor-foldable';
import { resolveVerticalBarsLayout } from '@rdlabo/capacitor-native-ui/integration';
import { setVerticalBarsLayout } from '@rdlabo/ionic-theme-ios27';

const updateLayout = async () => {
  const layout = await resolveVerticalBarsLayout(Foldable);
  setVerticalBarsLayout(layout);
  console.info('Device layout', layout);
};

void Foldable.addListener('layoutChange', () => void updateLayout().catch(console.error))
  .then(updateLayout)
  .catch(console.error);
```

## 3. Prévisualiser les marges Web

Pour une prévisualisation temporaire dans le navigateur, choisissez le préréglage iOS puis exécutez ceci après le rendu d’ion-app. Vérifiez les marges côté trailing. Cela ne modifie que la disposition Web, pas la capacité native. Séparez cet essai de l’abonnement réel.

```ts
import { setVerticalBarsLayout } from '@rdlabo/ionic-theme-ios27';

setVerticalBarsLayout({ edge: 'trailing', inset: 80 });
```

## 4. Restaurer puis vérifier sur appareil

Restaurez la prévisualisation avec cet appel puis retirez le code temporaire. Compilez et synchronisez, puis vérifiez apparition, disparition, rotation et pliage sur appareil compatible. Les actions doivent conserver leurs gestionnaires Web. Un téléphone ordinaire ou navigateur garde sa disposition normale. Le rendu du rail natif exige notamment un iPhone Duo lié à iOS 27.1 ou ultérieur.

```ts
setVerticalBarsLayout({ edge: null });
```

Les détails des mesures et appareils sont dans la [référence du rail](/projects/capacitor-native-ui/docs/vertical-bars).
