---
title: 'Native UI verwenden'
sourceRevision: 'a6e3664ef5e0672c1da7a2b3b29b882dcc5e91140923f9a59713abf673655f7d'
---

# Native UI verwenden

Zeigen Sie eine Toolbar-Aktion unter iOS nativ an, während ihr Web-Handler die Seite aktualisiert. Unter Android und im Browser bleibt dieselbe Seite mit Web-Steuerelementen nutzbar.

Für [Native UI mit vorhandenem Theme](/projects/capacitor-native-ui/docs/ionic-vertical-bars), [HTML ohne Ionic](/projects/capacitor-native-ui/docs/framework-independent) oder [Cordova](/projects/cordova-native-ui/docs/readme) verwenden Sie die jeweilige Anleitung. [Wählen Sie die Einrichtung](/#choose-setup), bevor Sie die App ändern.

## 1. Den App-Runtime verwenden

Verwenden Sie die [eingerichtete App](/standard-setup) mit iOS 26+ und Xcode 26+. Diese Anleitung nutzt Ionic-Elemente; andere Ausgangslagen erreichen Sie über die Links oben. Ersetzen Sie in src/native-ui.ts den vorhandenen Aufruf im iOS-Zweig durch den folgenden Code. Die exportierte Funktion prüft dieselbe Shell nach der Seitendarstellung und startet keine zweite Runtime.

```ts
const shell = await enableNativeUI();
readNativeUIStatus = () => shell.getStatus();
```

Ergänzen Sie außerdem diesen Export auf Modulebene außerhalb von connectNativeUI:

```ts
let readNativeUIStatus: (() => unknown) | undefined;

export async function inspectNativeUI(): Promise<void> {
  await startNativeUI();
  console.info(readNativeUIStatus?.());
}
```

## 2. Eine Toolbar-Aktion hinzufügen

Wählen Sie die Komponente Ihres Frameworks am angegebenen Pfad oder übernehmen Sie Imports, Template und Zustand in eine vorhandene Routenseite. Route und Shell bleiben bestehen. React und Vue verwenden IonPage als Wurzel. Save ist einmal über das Framework gebunden; das Ergebnis bleibt im Web-Zustand.

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

## 3. Die Aktion im Web belassen

Öffnen Sie die vorhandene Route dieser Seite. Save ändert Not saved in Saved. Die native Aktivierung ruft denselben Handler auf; eine Swift- oder Kotlin-Aktion ist nicht nötig. Verlassen und öffnen Sie die Seite erneut: ein Klick soll einmal aktualisieren. Ergänzen Sie keinen parallelen DOM-Listener.

## 4. Bauen und dieselbe Aktion prüfen

Bauen, synchronisieren und starten Sie das iOS-Projekt. Save muss den Text genau einmal zu Saved ändern. Prüfen Sie Navigation, Rückkehr und abgebrochene Zurück-Gesten. Browser und Android sollen mit dem Web-Button dasselbe Ergebnis liefern. Nicht unterstützte Inhalte müssen im Web bedienbar bleiben.

```sh
npm run build
npx cap sync ios
npx cap open ios
```

Einzelne Optionen stehen in der [Steuerelementreferenz](/projects/capacitor-native-ui/docs/native-ui), die gezielte Projektion in der [Konfiguration](/projects/capacitor-native-ui/docs/configuration).

Drücken Sie nach der Seitendarstellung Save und prüfen Sie den von inspectNativeUI protokollierten Status. Die Funktion wartet auf den vorhandenen Start und prüft dieselbe Runtime. Native Abnahme erfordert state native, einen positiven projected-Wert, sichtbare native Elemente und funktionierendes Save. web oder null Elemente belegt nur den Fallback; prüfen Sie reason und unterstützte Elemente. Entfernen Sie anschließend Diagnoseaufrufe und Export. Android und Browser bestehen mit der Web-Aktion; integrierte native Elemente gibt es nur unter iOS.
