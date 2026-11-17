---
title: 'Darstellungswechsel hinzufügen'
sourceRevision: '96278604f5e0a37dea6bee8b7c47217fc3ee67500e5523589899642cbab6480e'
headingAliases:
  '4.-modi-und-fallback-pr%C3%BCfen': '3.-schalter-bet%C3%A4tigen-und-darstellung-pr%C3%BCfen'
  '3.-beide-einstellungen-verbinden': '2.-zwei-schalter-zur-einstellungsseite-hinzuf%C3%BCgen'
  '2.-den-bestehenden-erscheinungscontroller-verwenden': '1.-hell-oder-dunkel-durch-die-app-steuern'
  '1.-die-zwei-neuen-einstellungen-pr%C3%BCfen': 'die-beiden-einstellungen'
  '1.-die-bedienelemente-platzieren': 'die-beiden-einstellungen'
  '3.-die-schaltfl%C3%A4chen-verbinden': '2.-zwei-schalter-zur-einstellungsseite-hinzuf%C3%BCgen'
---

# Darstellungswechsel hinzufügen

Ergänzen Sie die Schalter Use device colors und Dark mode und wenden Sie die Auswahl in der gesamten App an.

Beginnen Sie mit einer App nach der [Ionic-Einrichtung](/standard-setup). Bereiten Sie zuerst die gemeinsame Darstellungsänderung vor und rufen Sie diese anschließend über die Schalter auf.

## Die beiden Einstellungen

Die Schalter wählen Farbquelle und Hell-/Dunkelmodus unabhängig voneinander. Beispielsweise sind Gerätefarben im Hellmodus oder die Standardfarben des Themes im Dunkelmodus möglich.

| Einstellung       | Ein                                       | Aus                       |
| ----------------- | ----------------------------------------- | ------------------------- |
| Use device colors | Verfügbare Gerätefarben unter Android 12+ | Standardfarben des Themes |
| Dark mode         | Dunkel                                    | Hell                      |

## 1. Hell oder Dunkel durch die App steuern

Ändern Sie zuerst src/global.css und dann die bei der Einrichtung erstellte src/native-ui.ts. Dadurch kann die Einstellungsseite die Darstellung der gesamten App ändern.

### Das Stylesheet für Hell und Dunkel wechseln

Das installierte system.css folgt der Betriebssystemdarstellung. Ersetzen Sie es durch class.css, damit die App Hell oder Dunkel wählen kann. class.css reagiert auf die Klasse ion-palette-dark, die setMode hinzufügt oder entfernt.

Wenden Sie den Diff auf das globale Stylesheet an. Verwendet Angular src/global.scss, ändern Sie diese Datei.

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

### Die aktuellen Einstellungen in Variablen halten

In src/native-ui.ts hält preferences die beiden Werte: deviceColors für Gerätefarben und dark für den Dunkelmodus. Der Anfangswert von dark stammt beim Start aus dem Betriebssystem.

appearance hält das von enableDynamicColors zurückgegebene Objekt. Die nächste Änderung speichert dieses Ergebnis, damit dessen Methoden setMode und refresh später nutzbar sind.

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

### Einstellungen beim App-Start anwenden

Übergeben Sie die anfängliche Hell-/Dunkelauswahl an enableDynamicColors und speichern Sie das Ergebnis in appearance. Nach dem Start ändert appearance.setMode den Modus; appearance.refresh wählt die Palette erneut aus.

Bei ausgeschalteten Gerätefarben wird die Gerätepalette nicht weitergegeben, sodass das Theme seine Standardfarben verwendet. Rufen Sie unter iOS außerdem die unten definierte Funktion syncIOSSystemBars beim Start auf.

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

### Funktionen für die Einstellungsseite ergänzen

Ergänzen Sie diese Funktionen am Ende derselben Datei.

- getAppearancePreferences liefert die aktuellen Einstellungen für die Anfangswerte der Schalter.
- setAppearancePreferences übernimmt eine geänderte Einstellung und wendet sie auf das Theme an. Der andere Schalterwert bleibt erhalten.
- syncIOSSystemBars passt Text und Symbole der iOS-Statusleiste an die App an, damit Uhr und Batterie auf einem dunklen Bildschirm lesbar bleiben.

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

Die Einstellungsseite kann jetzt die Werte lesen und die App-Darstellung ändern. Verbinden Sie diese beiden Vorgänge mit den Schaltern.

## 2. Zwei Schalter zur Einstellungsseite hinzufügen

Ergänzen Sie zwei ion-item-Elemente auf der vorhandenen Einstellungsseite, jeweils mit einem ion-toggle. Lesen Sie die Anfangswerte mit getAppearancePreferences und übergeben Sie Änderungen an setAppearancePreferences.

Wenden Sie das Beispiel Ihres Frameworks an.

### Angular / Ionic 9

Initialisieren Sie das Signal-Forms-Modell mit den aktuellen Einstellungen. Ändert ein Schalter das Modell, ruft effect die Funktion setAppearancePreferences auf und aktualisiert die App.

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

Übergeben Sie den aktuellen Wert an checked. onIonChange liefert den neuen Wert in event.detail.checked; geben Sie ihn an setAppearancePreferences weiter. Aktualisieren Sie auch den Seitenzustand, damit der Schalter denselben Wert anzeigt.

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

Übergeben Sie den aktuellen Wert an checked. ionChange liefert den neuen Wert in event.detail.checked; geben Sie ihn an setAppearancePreferences weiter und aktualisieren Sie den von reactive gehaltenen Seitenzustand.

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

Die Werte werden innerhalb der App geteilt und bleiben beim erneuten Öffnen der Einstellungen erhalten. Dieses Beispiel speichert sie nicht dauerhaft. Beim Neustart oder vollständigen Neuladen werden Gerätefarben eingeschaltet und der Dunkelmodus anhand des aktuellen Betriebssystems initialisiert. Während der Laufzeit folgt die App dem Schalter, auch wenn sich die Betriebssystemdarstellung ändert.

## 3. Schalter betätigen und Darstellung prüfen

Starten Sie im Browser den Entwicklungsserver und laden Sie die Seite neu. Führen Sie für native Apps npm run build und npx cap sync ios oder npx cap sync android für das Ziel aus; erstellen und starten Sie die native App erneut.

Schalten Sie zunächst Dark mode ein und aus. Hintergrund und Text der gesamten App müssen zwischen Dunkel und Hell wechseln.

Ändern Sie auf unterstützten Android-12+-Geräten auch Use device colors. Ein verwendet die Gerätepalette, Aus die Theme-Standardfarben. Ändern Sie das Hintergrundbild und kehren Sie zur App zurück, um bei eingeschalteter Option die neuen Farben zu prüfen. iOS, Browser und nicht unterstützte Android-Geräte nutzen bei beiden Werten die Theme-Farben.

Prüfen Sie alle vier Kombinationen: Ein Wechsel der Farbquelle erhält den Hell-/Dunkelmodus und umgekehrt. Öffnen Sie die Einstellungen erneut und prüfen Sie beide Werte.

Prüfen Sie unter iOS ein helles Betriebssystem mit dunkler App und den umgekehrten Fall; Uhr und Batterie müssen lesbar bleiben. Aktualisieren Sie bei bestehender Persistenz SystemBars auch beim Wiederherstellen und prüfen Sie nach einem Neustart erneut.

Prüfen Sie bei Druck oder PDF-Export, ob Änderungen an Farbquelle oder Modus die Ausgabefarben beeinflussen. Verwenden Sie bei Bedarf eine eigene Druckpalette. Prüfen Sie die tatsächlichen Einstellungs- und Hauptbildschirme.

Die Farbzuordnung steht in der [Dynamic-Color-Referenz](/projects/capacitor-native-ui/docs/dynamic-colors).
