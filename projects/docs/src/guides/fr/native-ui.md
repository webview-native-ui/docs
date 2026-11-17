---
title: 'Utiliser l’interface native'
sourceRevision: 'a6e3664ef5e0672c1da7a2b3b29b882dcc5e91140923f9a59713abf673655f7d'
---

# Utiliser l’interface native

Affichez une action de barre nativement sur iOS tout en mettant à jour la page avec son gestionnaire Web. La même page reste utilisable sur Android et dans le navigateur.

Pour [Native UI avec un thème existant](/projects/capacitor-native-ui/docs/ionic-vertical-bars), [HTML sans Ionic](/projects/capacitor-native-ui/docs/framework-independent) ou [Cordova](/projects/cordova-native-ui/docs/readme), utilisez l’intégration correspondante. [Choisissez votre intégration](/#choose-setup) avant de modifier l’application.

## 1. Utiliser le runtime de l’application

Utilisez l’application [configurée](/standard-setup) sous iOS 26+ avec Xcode 26+. Ce guide utilise les contrôles Ionic ; les liens précédents couvrent les autres configurations. Dans src/native-ui.ts, remplacez l’appel existant dans la branche iOS par le code suivant. La fonction exportée inspecte le même shell après affichage de la page, sans démarrer un second runtime.

```ts
const shell = await enableNativeUI();
readNativeUIStatus = () => shell.getStatus();
```

Ajoutez aussi cet export au niveau du module, hors de connectNativeUI :

```ts
let readNativeUIStatus: (() => unknown) | undefined;

export async function inspectNativeUI(): Promise<void> {
  await startNativeUI();
  console.info(readNativeUIStatus?.());
}
```

## 2. Ajouter une action de barre

Choisissez le composant de votre framework au chemin indiqué ou fusionnez imports, template et état dans une page routée existante. Conservez route et shell. React et Vue utilisent IonPage comme racine. Save est lié une seule fois par le framework et le résultat reste dans l’état Web.

### Angular / Ionic 9

```ts:src/app/profile.page.ts
import { Component, signal } from '@angular/core';
import { inspectNativeUI } from '../native-ui';
import { IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonContent } from '@ionic/angular';

@Component({
  selector: 'app-profile',
  imports: [IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonContent],
  template: `
    <ion-header><ion-toolbar>
      <ion-title>Profile</ion-title>
      <ion-buttons slot="end">
        <ion-button type="button" (click)="save()">Save</ion-button>
      </ion-buttons>
    </ion-toolbar></ion-header>
    <ion-content><p role="status">{{ result() }}</p></ion-content>
  `,
})
export class ProfilePage {
  readonly result = signal('Not saved');
  save(): void {
    this.result.set('Saved');
    void inspectNativeUI().catch(console.error);
  }
}
```

### React

```tsx:src/Profile.tsx
import { useState } from 'react';
import { inspectNativeUI } from './native-ui';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonContent } from '@ionic/react';

export default function Profile() {
  const [result, setResult] = useState('Not saved');
  function save(): void {
    setResult('Saved');
    void inspectNativeUI().catch(console.error);
  }
  return (
    <IonPage>
      <IonHeader><IonToolbar>
        <IonTitle>Profile</IonTitle>
        <IonButtons slot="end">
          <IonButton type="button" onClick={save}>Save</IonButton>
        </IonButtons>
      </IonToolbar></IonHeader>
      <IonContent><p role="status">{result}</p></IonContent>
    </IonPage>
  );
}
```

### Vue

```vue:src/Profile.vue
<script setup lang="ts">
import { ref } from 'vue';
import { inspectNativeUI } from './native-ui';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonContent } from '@ionic/vue';

const result = ref('Not saved');
function save(): void {
  result.value = 'Saved';
  void inspectNativeUI().catch(console.error);
}
</script>

<template>
  <ion-page>
    <ion-header><ion-toolbar>
      <ion-title>Profile</ion-title>
      <ion-buttons slot="end">
        <ion-button type="button" @click="save">Save</ion-button>
      </ion-buttons>
    </ion-toolbar></ion-header>
    <ion-content><p role="status">{{ result }}</p></ion-content>
  </ion-page>
</template>
```

## 3. Garder l’action côté Web

Ouvrez la route existante de cette page. Not saved devient Saved après Save. L’activation native appelle ce même gestionnaire, sans action Swift ou Kotlin. Quittez puis rouvrez la page et réessayez : une seule mise à jour doit se produire. N’ajoutez pas d’écouteur DOM en parallèle.

## 4. Compiler et vérifier la même action

Compilez, synchronisez et exécutez le projet iOS. Save doit changer le texte en Saved une seule fois. Vérifiez après navigation, retour et annulation du geste de retour. Dans le navigateur et sur Android, le bouton Web doit produire le même résultat. Le contenu non compatible doit rester utilisable sur le Web.

```sh
npm run build
npx cap sync ios
npx cap open ios
```

Consultez la [référence des contrôles](/projects/capacitor-native-ui/docs/native-ui) et la [configuration](/projects/capacitor-native-ui/docs/configuration) pour ajuster la projection.

Une fois la page visible, appuyez sur Save et observez l’état journalisé par inspectNativeUI. La fonction attend le démarrage existant et inspecte le même runtime. L’acceptation native exige state native, projected positif, des contrôles natifs visibles et Save fonctionnel. web ou zéro confirme seulement le repli ; consultez reason et les contrôles compatibles. Retirez ensuite les appels de diagnostic et l’export. Android et le navigateur valident l’action Web ; les contrôles natifs intégrés sont réservés à iOS.
