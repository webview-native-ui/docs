---
title: 'Ajouter un sélecteur d’apparence'
sourceRevision: '96278604f5e0a37dea6bee8b7c47217fc3ee67500e5523589899642cbab6480e'
headingAliases:
  '4.-v%C3%A9rifier-les-modes-et-le-repli': '3.-changer-les-r%C3%A9glages-et-v%C3%A9rifier-le-r%C3%A9sultat'
  '3.-raccorder-les-deux-r%C3%A9glages': '2.-ajouter-deux-interrupteurs-aux-r%C3%A9glages'
  '2.-conserver-le-contr%C3%B4leur-existant': '1.-choisir-le-mode-clair-ou-sombre-dans-l%E2%80%99app'
  '1.-v%C3%A9rifier-les-deux-r%C3%A9glages-%C3%A0-ajouter': 'r%C3%A9glages-%C3%A0-ajouter'
  '1.-placer-les-commandes': 'r%C3%A9glages-%C3%A0-ajouter'
  '3.-relier-les-boutons': '2.-ajouter-deux-interrupteurs-aux-r%C3%A9glages'
---

# Ajouter un sélecteur d’apparence

Ajoutez deux interrupteurs, Use device colors et Dark mode, et appliquez le choix à toute l’app.

Partez d’une app ayant terminé la [configuration Ionic](/standard-setup). Préparez d’abord le changement d’apparence commun à l’app, puis appelez-le depuis les interrupteurs des réglages.

## Réglages à ajouter

Les interrupteurs choisissent séparément la source des couleurs et le mode clair ou sombre. Les couleurs de l’appareil peuvent ainsi être utilisées en mode clair, ou les couleurs du thème en mode sombre.

| Réglage           | Activé                               | Désactivé         |
| ----------------- | ------------------------------------ | ----------------- |
| Use device colors | Couleurs disponibles sur Android 12+ | Couleurs du thème |
| Dark mode         | Sombre                               | Clair             |

## 1. Choisir le mode clair ou sombre dans l’app

Modifiez dans cet ordre src/global.css, puis le fichier src/native-ui.ts créé lors de l’installation. L’écran de réglages pourra ainsi changer l’apparence de toute l’app.

### Changer la feuille de style qui gère les modes clair et sombre

Le fichier system.css installé suit l’apparence du système. Remplacez-le par class.css pour laisser l’app choisir le mode clair ou sombre. class.css réagit à la classe ion-palette-dark, ajoutée ou retirée par setMode.

Appliquez la différence à votre feuille de style globale. Si Angular utilise src/global.scss, modifiez ce fichier.

<!-- prettier-ignore -->
```diff:src/global.css
@@
- @import '@rdlabo/ionic-theme-ios26/styles/system.css' supports(not (overflow-anchor: auto));
- @import '@rdlabo/ionic-theme-ios27/styles/system.css' supports(overflow-anchor: auto);
+ @import '@rdlabo/ionic-theme-ios26/styles/class.css' supports(not (overflow-anchor: auto));
+ @import '@rdlabo/ionic-theme-ios27/styles/class.css' supports(overflow-anchor: auto);
 @import '@rdlabo/ionic-theme-ios27/dist/css/vertical-bars.css' supports(not (overflow-anchor: auto));
 @import '@rdlabo/ionic-theme-md3/styles/theme.css';
```

### Conserver les réglages courants dans des variables

Dans src/native-ui.ts, preferences contient les deux choix : deviceColors pour les couleurs de l’appareil et dark pour le mode sombre. La valeur initiale de dark vient du système au démarrage.

appearance conserve l’objet renvoyé par enableDynamicColors. La modification suivante stocke ce résultat pour utiliser ensuite ses méthodes setMode et refresh.

<!-- prettier-ignore -->
```diff:src/native-ui.ts
@@
- import { Capacitor } from '@capacitor/core';
+ import { Capacitor, SystemBars, SystemBarsStyle } from '@capacitor/core';
@@
 import { enableDynamicColors } from '@rdlabo/ionic-theme-md3/dynamic-colors';
+ import type { DynamicColorTheme } from '@rdlabo/ionic-theme-md3/dynamic-colors';
@@
 let startup: Promise<void> | undefined;
+ 
+ export type AppearancePreferences = {
+   deviceColors: boolean;
+   dark: boolean;
+ };
+ 
+ let appearance: DynamicColorTheme;
+ let preferences: AppearancePreferences = {
+   deviceColors: true,
+   dark: globalThis.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false,
+ };
```

### Appliquer les réglages au démarrage

Transmettez le choix initial clair/sombre à enableDynamicColors et conservez son résultat dans appearance. Après le démarrage, appearance.setMode change le mode et appearance.refresh sélectionne à nouveau la palette.

Lorsque les couleurs de l’appareil sont désactivées, ne transmettez pas cette palette : le thème retrouve ses couleurs par défaut. Sur iOS, appelez aussi syncIOSSystemBars au démarrage ; cette fonction est définie ci-dessous.

<!-- prettier-ignore -->
```diff:src/native-ui.ts
@@
-   await enableDynamicColors({
-     getScheme: getDynamicColorScheme,
+   appearance = await enableDynamicColors({
+     mode: preferences.dark ? 'dark' : 'light',
+     getScheme: async () => {
+       const scheme = await getDynamicColorScheme();
+       return preferences.deviceColors
+         ? scheme
+         : { available: false as const, systemDark: scheme.systemDark };
+     },
     listen: addDynamicColorListener,
   });
@@
   if (Capacitor.getPlatform() === 'ios') {
+     await syncIOSSystemBars();
```

### Ajouter les fonctions appelées par l’écran de réglages

Ajoutez ces fonctions à la fin du même fichier.

- getAppearancePreferences renvoie les réglages courants pour afficher les valeurs initiales des interrupteurs.
- setAppearancePreferences reçoit un réglage modifié et l’applique au thème. Changer un interrupteur conserve l’autre valeur.
- syncIOSSystemBars adapte le texte et les icônes de la barre d’état iOS à l’app, pour garder l’heure et la batterie lisibles sur un écran sombre.

<!-- prettier-ignore -->
```diff:src/native-ui.ts
@@
       .catch(console.error);
   }
 }
+ 
+ export function getAppearancePreferences(): AppearancePreferences {
+   return { ...preferences };
+ }
+ 
+ export async function setAppearancePreferences(patch: Partial<AppearancePreferences>): Promise<void> {
+   const paletteChanged = patch.deviceColors !== undefined && patch.deviceColors !== preferences.deviceColors;
+   preferences = { ...preferences, ...patch };
+   await startNativeUI();
+   appearance.setMode(preferences.dark ? 'dark' : 'light');
+   if (paletteChanged) await appearance.refresh();
+   await syncIOSSystemBars();
+ }
+ 
+ async function syncIOSSystemBars(): Promise<void> {
+   if (Capacitor.getPlatform() !== 'ios') return;
+   await SystemBars.setStyle({
+     style: preferences.dark ? SystemBarsStyle.Dark : SystemBarsStyle.Light,
+   });
+ }
```

L’écran de réglages peut maintenant lire les valeurs et changer l’apparence de l’app. Reliez ces deux opérations aux interrupteurs.

## 2. Ajouter deux interrupteurs aux réglages

Ajoutez deux éléments ion-item à l’écran de réglages existant, avec un ion-toggle chacun. Lisez les valeurs initiales avec getAppearancePreferences, puis transmettez les changements à setAppearancePreferences.

Appliquez l’exemple de votre framework.

### Angular / Ionic 9

Initialisez le modèle Signal Forms avec les réglages courants. Lorsqu’un interrupteur modifie le modèle, effect appelle setAppearancePreferences pour appliquer le changement à l’app.

<!-- prettier-ignore -->
```diff:src/app/appearance.page.ts
@@
- import { Component } from '@angular/core';
+ import { Component, effect, signal } from '@angular/core';
+ import { form, FormField } from '@angular/forms/signals';
+ import { IonItem, IonToggle } from '@ionic/angular';
+ import { getAppearancePreferences, setAppearancePreferences } from '../native-ui';

 @Component({
   selector: 'app-appearance',
+   imports: [FormField, IonItem, IonToggle],
   template: `
     <section aria-label="Appearance">
       <h1>Appearance</h1>
+       <ion-item>
+         <ion-toggle [formField]="fields.deviceColors"
+           helperText="Uses device colors on supported Android 12+ devices; otherwise uses theme colors.">
+           Use device colors
+         </ion-toggle>
+       </ion-item>
+       <ion-item>
+         <ion-toggle [formField]="fields.dark">Dark mode</ion-toggle>
+       </ion-item>
     </section>
   `,
 })
- export class AppearancePage {}
+ export class AppearancePage {
+   readonly model = signal(getAppearancePreferences());
+   readonly fields = form(this.model);
+ 
+   constructor() {
+     effect(() => {
+       void setAppearancePreferences(this.model()).catch(console.error);
+     });
+   }
+ }
```

### React

Transmettez la valeur courante à checked. onIonChange fournit la nouvelle valeur dans event.detail.checked ; transmettez-la à setAppearancePreferences. Mettez aussi à jour l’état de la page pour afficher la même valeur.

<!-- prettier-ignore -->
```diff:src/Appearance.tsx
@@
+ import { useState } from 'react';
+ import { IonItem, IonToggle } from '@ionic/react';
+ import {
+   getAppearancePreferences,
+   setAppearancePreferences,
+   type AppearancePreferences,
+ } from './native-ui';
+ 
 export default function Appearance() {
+   const [preferences, setPreferences] = useState(getAppearancePreferences);
+ 
+   function apply(patch: Partial<AppearancePreferences>): void {
+     setPreferences((current) => ({ ...current, ...patch }));
+     void setAppearancePreferences(patch).catch(console.error);
+   }
+ 
   return (
     <section aria-label="Appearance">
       <h1>Appearance</h1>
+       <IonItem>
+         <IonToggle
+           checked={preferences.deviceColors}
+           onIonChange={(event) => apply({ deviceColors: event.detail.checked })}
+           helperText="Uses device colors on supported Android 12+ devices; otherwise uses theme colors."
+         >Use device colors</IonToggle>
+       </IonItem>
+       <IonItem>
+         <IonToggle checked={preferences.dark}
+           onIonChange={(event) => apply({ dark: event.detail.checked })}>Dark mode</IonToggle>
+       </IonItem>
     </section>
   );
 }
```

### Vue

Transmettez la valeur courante à checked. ionChange fournit la nouvelle valeur dans event.detail.checked ; transmettez-la à setAppearancePreferences et mettez à jour l’état de la page contenu dans reactive.

<!-- prettier-ignore -->
```diff:src/Appearance.vue
@@
 <script setup lang="ts">
+ import { reactive } from 'vue';
+ import { IonItem, IonToggle } from '@ionic/vue';
+ import {
+   getAppearancePreferences,
+   setAppearancePreferences,
+   type AppearancePreferences,
+ } from './native-ui';
+ 
+ const preferences = reactive(getAppearancePreferences());
+ 
+ function apply(patch: Partial<AppearancePreferences>): void {
+   Object.assign(preferences, patch);
+   void setAppearancePreferences(patch).catch(console.error);
+ }
+ 
+ function updateDeviceColors(event: CustomEvent<{ checked: boolean }>): void {
+   apply({ deviceColors: event.detail.checked });
+ }
+ 
+ function updateDark(event: CustomEvent<{ checked: boolean }>): void {
+   apply({ dark: event.detail.checked });
+ }
 </script>

 <template>
   <section aria-label="Appearance">
     <h1>Appearance</h1>
+     <ion-item>
+       <ion-toggle :checked="preferences.deviceColors" @ionChange="updateDeviceColors"
+         helper-text="Uses device colors on supported Android 12+ devices; otherwise uses theme colors.">
+         Use device colors
+       </ion-toggle>
+     </ion-item>
+     <ion-item>
+       <ion-toggle :checked="preferences.dark" @ionChange="updateDark">Dark mode</ion-toggle>
+     </ion-item>
   </section>
 </template>
```

Les valeurs sont partagées dans l’app et conservées lorsque vous rouvrez les réglages. Cet exemple ne les enregistre pas durablement. Un redémarrage ou un rechargement complet active les couleurs de l’appareil et initialise le mode sombre avec le réglage actuel du système. Pendant l’exécution, l’app suit l’interrupteur même si le système change d’apparence.

## 3. Changer les réglages et vérifier le résultat

Dans le navigateur, lancez le serveur de développement et rechargez la page. Pour l’app native, exécutez npm run build puis npx cap sync ios ou npx cap sync android pour la cible, reconstruisez et lancez-la.

Activez et désactivez d’abord Dark mode : le fond et le texte de l’app doivent passer du mode sombre au mode clair.

Sur Android 12+ compatible, changez aussi Use device colors. Activé utilise la palette de l’appareil ; désactivé utilise le thème. Changez le fond d’écran et revenez dans l’app pour vérifier l’actualisation des couleurs lorsque le réglage est activé. iOS, les navigateurs et Android non compatible utilisent les couleurs du thème dans les deux cas.

Essayez les quatre combinaisons : changer la source des couleurs conserve le mode clair/sombre, et changer le mode conserve la source. Rouvrez les réglages et vérifiez les deux valeurs.

Sur iOS, vérifiez le système clair avec l’app sombre et l’inverse ; l’heure et la batterie doivent rester lisibles. Avec un stockage existant, actualisez aussi SystemBars lors de la restauration et vérifiez après redémarrage.

Si l’app imprime ou exporte des PDF, vérifiez l’effet des changements de palette et de mode sur les couleurs de sortie. Utilisez une palette d’impression distincte si nécessaire. Vérifiez les vrais écrans de réglages et les écrans principaux.

Consultez [Dynamic Color](/projects/capacitor-native-ui/docs/dynamic-colors) pour la correspondance des couleurs.
