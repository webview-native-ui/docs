---
title: 'Darstellungswechsel hinzufügen'
sourceRevision: '13b6b0ec01975144b90a17a7f5d6effa854f3b741a574f04b30ac7b2fa77844d'
headingAliases:
  '1.-die-bedienelemente-platzieren': '1.-die-zwei-neuen-einstellungen-pr%C3%BCfen'
  '3.-die-schaltfl%C3%A4chen-verbinden': '3.-beide-einstellungen-verbinden'
---

# Darstellungswechsel hinzufügen

Die Einrichtung behält die OS-Darstellung bei. Diese optionale Aufgabe ersetzt sie durch zwei unabhängige App-Einstellungen: Use device colors und Dark mode. Beide ion-toggle-Schalter zeigen aktuelle Werte. Der anfängliche Dunkelwert wird einmal vom OS gelesen; spätere OS-Änderungen ändern die Einstellung nicht.

Für eine App nur mit Theme beginnen Sie mit der Installation von [iOS 26](/projects/ionic-theme-ios26/docs/setup), [iOS 27](/projects/ionic-theme-ios27/docs/setup) oder [MD3](/projects/ionic-theme-md3/docs/setup). Native UI ist dafür nicht erforderlich. Die folgenden Schritte ergänzen die Ionic- und Capacitor-Einrichtung um Darstellungseinstellungen.

## 1. Die zwei neuen Einstellungen prüfen

Beginnen Sie nach der [abgeschlossenen Einrichtung](/standard-setup) ohne temporären Prüf-Hook. Bestimmen Sie zunächst die beiden Einstellungen, ohne Dateien zu ändern. Use device colors wählt die verfügbare Android-12+-Palette statt Theme-Standardfarben. Dark mode wählt aktiviert dunkel und deaktiviert hell, unabhängig von der Farbquelle. Diese UI ergänzt keine OS-Folgeauswahl.

| Einstellung       | Aktiviert               | Deaktiviert          |
| ----------------- | ----------------------- | -------------------- |
| Use device colors | Verfügbare Gerätefarben | Theme-Standardfarben |
| Dark mode         | Dunkel                  | Hell                 |

## 2. Den bestehenden Erscheinungscontroller verwenden

Wenden Sie vier Diffs nacheinander an: System zu Class im bestehenden Stylesheet, dann Einstellungszustand, Provider und Getter/Setter im Startmodul. Damit übernimmt bewusst die Dark-mode-ion-toggle-Schalter der App Hell/Dunkel vom OS-folgenden CSS, unabhängig von Gerätefarben. Der Controller startet weiterhin einmal. Das OS liefert nur den anfänglichen Dunkel-Booleschen Wert; der Controller startet passend explizit hell/dunkel und folgt danach diesem Wert. Teiländerungen behalten die jeweils andere Einstellung. Danach ist die API bereit; beide ion-toggle-Schalter folgen in Schritt 3.

Unter iOS benötigen Text und Symbole der Statusleiste eine eigene Aktualisierung, unabhängig vom Web-Theme und den Native-UI-Steuerelementen. Rufen Sie SystemBars beim Start und nach Einstellungsänderungen auf, damit die Anzeige auch bei einer vom Betriebssystem abweichenden Darstellung lesbar bleibt. Die bestehende Android-Verwaltung von Systemleisten und Insets bleibt erhalten.

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

## 3. Beide Einstellungen verbinden

Wenden Sie nur den Diff Ihres Frameworks auf eine vorhandene geroutete Einstellungsseite an. Dateiname, Route und anderer Inhalt bleiben bestehen. Beide ion-toggle-Schalter lesen gemeinsame Einstellungen und zeigen Werte ohne weiteren Controller. Erneutes Öffnen der Route behält sie während dieser Ausführung. Nichts wird gespeichert: App-Neustart oder vollständiges Browser-Neuladen liest das OS erneut für den Dunkel-Anfangswert. Use device colors zeigt einen Wunsch, keinen Nachweis verfügbarer Gerätefarben; der Text daneben erklärt den Fallback.

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

## 4. Modi und Fallback prüfen

Starten Sie vor der Prüfung der geänderten Elemente den bestehenden Web-Entwicklungsserver und laden Sie die Browser-Seite vollständig neu. Führen Sie zur nativen Prüfung npm run build im App-Verzeichnis aus, synchronisieren Sie nur das gewählte Ziel mit npx cap sync ios oder npx cap sync android, bauen Sie es neu und beenden/starten Sie App/WebView neu. Quelländerungen allein aktualisieren keine installierte App. App-Neustart oder vollständiges Browser-Neuladen setzt diese Speichereinstellungen zurück; wählen Sie die Testwerte erst danach. Nur die geroutete Einstellungsseite erneut zu öffnen behält sie bei.

Prüfen Sie alle vier Kombinationen: Gerätefarben aus/dunkel aus, aus/an, an/aus und an/an. Dark mode muss passend helle oder dunkle Web-UI und unterstützte iOS-Elemente erzeugen. Ein OS-Hell-/Dunkelwechsel während laufender App darf weder ion-toggle-Schalter noch gewählte Darstellung verändern. Jede ion-toggle-Schalter muss die andere Einstellung beibehalten.

Aktivieren Sie auf unterstütztem Android 12+ Gerätefarben, ändern Sie die Hintergrundpalette und kehren Sie zur gleichen laufenden App zurück. Ausschalten muss Theme-Farben wiederherstellen, ohne Dark mode zu ändern. Unter iOS, Browsern und nicht unterstütztem Android bleiben Theme-Farben in beiden Fällen nutzbar. Öffnen Sie die Route erneut und prüfen Sie beide ion-toggle-Schalter. Fertig ist die Aufgabe mit vier funktionierenden Kombinationen, Fallback und erneutem Öffnen.

Lassen Sie unter iOS das Betriebssystem hell und stellen Sie die App dunkel ein; Uhrzeit, Batterie und andere Statusleistenelemente müssen lesbar bleiben. Prüfen Sie auch dunkles Betriebssystem mit heller App. Dieses Beispiel speichert keine Einstellungen dauerhaft. Bei bestehender Persistenz führen Sie dieselbe SystemBars-Aktualisierung direkt nach der Wiederherstellung aus und prüfen beide Richtungen nach einem Neustart.

Wenn die App Dokumente druckt oder als PDF exportiert, prüfen Sie nach der Darstellungsänderung die vorgesehenen Ausgabefarben. Falls Bildschirm-Theme-Variablen in die Ausgabe gelangen, verwenden Sie eine eigene Druckpalette. Vergleichen Sie die tatsächlichen Einstellungs- und Hauptbildschirme vor und nach der Änderung, nicht nur einen temporären Prüfbildschirm.

Für die Farbzuordnung siehe [Dynamic Color](/projects/capacitor-native-ui/docs/dynamic-colors). Nur Themes installieren Sie über [iOS 26](/projects/ionic-theme-ios26/docs/setup), [iOS 27](/projects/ionic-theme-ios27/docs/setup) oder [MD3](/projects/ionic-theme-md3/docs/setup).
