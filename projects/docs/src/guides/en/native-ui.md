# Use native UI

Make a toolbar action render natively on iOS while its existing Web handler still updates the page. The same page stays usable with Web controls on Android and in a browser.

For [Native UI with an existing theme](/projects/capacitor-native-ui/docs/ionic-vertical-bars), [HTML without Ionic](/projects/capacitor-native-ui/docs/framework-independent), or [Cordova](/projects/cordova-native-ui/docs/readme), use that integration instead. [Choose another setup](/#choose-setup) before changing the app.

## 1. Use the app-level runtime

Use the app from [app setup](/standard-setup) on an iOS 26+ device or simulator built with Xcode 26+. This walkthrough uses Ionic controls; the alternative integration links above keep other starting configurations available. In src/native-ui.ts, replace the existing enableNativeUI call inside the iOS branch with the code below. The exported function inspects that same shell after a page has rendered; it does not start another runtime.

```ts
const shell = await enableNativeUI();
readNativeUIStatus = () => shell.getStatus();
```

Add this export at module level in the same file, outside connectNativeUI:

```ts
let readNativeUIStatus: (() => unknown) | undefined;

export async function inspectNativeUI(): Promise<void> {
  await startNativeUI();
  console.info(readNativeUIStatus?.());
}
```

## 2. Add a toolbar action to a page

Choose the component for your framework and place it at the shown path, or merge its imports, template and state into an existing routed page. Keep the existing route and app shell. React and Vue use IonPage as the page root. Each example binds Save through the framework once and keeps the result in Web state.

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

## 3. Keep the action in the Web layer

Open the existing route that displays this page. The initial status reads Not saved; pressing Save changes it to Saved. Native activation invokes the same framework handler, so there is no Swift or Kotlin action to implement. Navigate away and reopen the page, then press Save again. It must update once; do not add a separate DOM listener alongside the framework binding.

## 4. Build and verify the same action on every platform

Build and sync, then run the existing iOS project. Press Save and confirm that the page changes to Saved once. Navigate away, go back, and cancel a back swipe: the action must still work without duplicates. In the browser and on Android, press the same Web button and verify the same update. A supported control uses native presentation; unsupported content must remain usable on the Web.

```sh
npm run build
npx cap sync ios
npx cap open ios
```

Use the [control reference](/projects/capacitor-native-ui/docs/native-ui) when changing individual control options, and [configuration](/projects/capacitor-native-ui/docs/configuration) when you need selective projection.

After the page is visible, press Save and inspect the status logged by inspectNativeUI. It waits for the existing startup, then reads the same runtime. Native acceptance requires state native, a positive projected count, visible native controls and the working Save action. A web state or zero projected confirms only fallback; inspect reason and the supported-control reference. Remove the diagnostic calls and export after verification. Android and the browser pass with the Web action; built-in native controls are iOS-only.
