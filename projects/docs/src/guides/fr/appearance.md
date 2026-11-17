---
title: 'Ajouter un sélecteur d’apparence'
sourceRevision: '13b6b0ec01975144b90a17a7f5d6effa854f3b741a574f04b30ac7b2fa77844d'
headingAliases:
  '1.-placer-les-commandes': '1.-v%C3%A9rifier-les-deux-r%C3%A9glages-%C3%A0-ajouter'
  '3.-relier-les-boutons': '3.-raccorder-les-deux-r%C3%A9glages'
---

# Ajouter un sélecteur d’apparence

La configuration conserve l’apparence liée au système. Cette tâche facultative la remplace par deux réglages indépendants de l’application : Use device colors et Dark mode. Deux interrupteurs affichent leurs valeurs. La valeur initiale sombre est lue une seule fois depuis le système ; ses changements ultérieurs ne modifient pas le réglage.

Pour une application utilisant uniquement un thème, commencez par l’installation [iOS 26](/projects/ionic-theme-ios26/docs/setup), [iOS 27](/projects/ionic-theme-ios27/docs/setup) ou [MD3](/projects/ionic-theme-md3/docs/setup). Native UI n’est pas nécessaire. Les étapes suivantes ajoutent des réglages d’apparence à la configuration Ionic + Capacitor.

## 1. Vérifier les deux réglages à ajouter

Partez de la [configuration terminée](/standard-setup), hook temporaire retiré. Identifiez les deux réglages sans modifier encore les fichiers. Use device colors choisit la palette disponible d’Android 12+ plutôt que les couleurs du thème. Dark mode choisit sombre si coché, clair sinon, indépendamment de la palette. Cette interface n’ajoute pas de choix de suivi du système.

| Réglage           | Coché                              | Décoché           |
| ----------------- | ---------------------------------- | ----------------- |
| Use device colors | Couleurs disponibles de l’appareil | Couleurs du thème |
| Dark mode         | Sombre                             | Clair             |

## 2. Conserver le contrôleur existant

Appliquez quatre diffs dans l’ordre : System vers Class dans le stylesheet existant, puis état des préférences, provider et fonctions d’accès dans le démarrage. Cela confie volontairement le clair/sombre à la interrupteur Dark mode de l’application, au lieu du CSS suivant le système, indépendamment des couleurs de l’appareil. Le contrôleur démarre toujours une seule fois. Le système fournit uniquement le booléen sombre initial ; le contrôleur démarre dans le mode clair/sombre explicite correspondant puis suit ce booléen. Une mise à jour partielle conserve l’autre réglage. L’API est alors prête ; les deux interrupteurs arrivent à l’étape 3.

Sur iOS, le texte et les icônes de la barre d’état nécessitent une mise à jour distincte du thème Web et des contrôles Native UI. Appelez SystemBars au démarrage et après les changements pour préserver leur lisibilité lorsque l’app diffère du système. Cette synchronisation iOS conserve la gestion Android existante des barres et des insets.

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

## 3. Raccorder les deux réglages

Appliquez uniquement le diff de votre framework à une page de réglages déjà routée. Conservez son fichier, sa route et son contenu. Les deux interrupteurs lisent les préférences partagées et affichent les valeurs, sans second contrôleur. Réouvrir la route conserve les réglages pendant cette exécution. Rien n’est persisté : redémarrer l’application ou recharger entièrement le navigateur relit le système pour la valeur sombre initiale. Use device colors exprime une préférence, pas la disponibilité prouvée d’une palette ; le texte voisin explique le repli.

### Angular / Ionic 9

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

## 4. Vérifier les modes et le repli

Avant de vérifier les contrôles modifiés, démarrez le serveur Web de développement existant et rechargez complètement la page. Pour la vérification native, exécutez npm run build dans le répertoire de l’application, synchronisez uniquement la cible avec npx cap sync ios ou npx cap sync android, recompilez-la puis arrêtez et relancez l’application/WebView. Modifier la source seul ne met pas à jour une application installée. Redémarrage ou rechargement complet réinitialise ces préférences en mémoire : choisissez les valeurs de test ensuite. Une simple réouverture de la page routée les conserve.

Vérifiez les quatre combinaisons : couleurs désactivées/sombre désactivé, désactivées/activé, activées/désactivé et activées/activé. La interrupteur Dark mode doit produire respectivement clair ou sombre sur le Web et les contrôles iOS compatibles. Changer le clair/sombre du système pendant l’exécution ne doit modifier ni la interrupteur ni l’apparence choisie. Chaque interrupteur doit préserver l’autre.

Sur Android 12+ compatible, activez les couleurs de l’appareil, changez la palette du fond d’écran puis revenez à la même application en cours. Désactiver cette option doit rétablir les couleurs du thème sans changer Dark mode. Sur iOS, navigateurs et Android non compatible, les couleurs du thème restent utilisables dans les deux cas. Rouvrez la route et vérifiez les deux interrupteurs. La tâche est terminée lorsque les quatre combinaisons, le repli et la réouverture fonctionnent.

Sur iOS, laissez le système clair et activez le mode sombre de l’app ; vérifiez la lisibilité de l’heure, de la batterie et des autres éléments de la barre d’état. Vérifiez aussi le système sombre avec l’app claire. Cet exemple ne persiste pas les préférences. Avec un stockage existant, appliquez la même mise à jour SystemBars dès la restauration et vérifiez les deux sens après redémarrage.

Si l’app imprime ou exporte des documents ou PDF, vérifiez que les couleurs de sortie restent adaptées après le changement des réglages. Si les variables du thème se propagent à la sortie, définissez une palette d’impression indépendante. Comparez les vrais écrans de réglages et les écrans principaux avant et après, au-delà du seul écran temporaire de vérification.

Pour le mappage des couleurs, consultez [Dynamic Color](/projects/capacitor-native-ui/docs/dynamic-colors). Pour un thème seul, suivez [iOS 26](/projects/ionic-theme-ios26/docs/setup), [iOS 27](/projects/ionic-theme-ios27/docs/setup) ou [MD3](/projects/ionic-theme-md3/docs/setup).
