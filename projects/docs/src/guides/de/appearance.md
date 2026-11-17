---
title: 'Das Erscheinungsbild gestalten'
sourceRevision: '937569d01125fc3106f2a16c6de5da61360b98a4d5cb45df0e1e35ea8adf6ce2'
---

# Das Erscheinungsbild gestalten

Ergänzen Sie die eingerichtete App um Hell-, Dunkel- und Systemeinstellung. Android behält die verfügbare Gerätepalette; dieselbe Einstellung steuert Web-UI und native iOS-Steuerelemente.

Für eine App nur mit Theme beginnen Sie mit der Installation von [iOS 26](/projects/ionic-theme-ios26/docs/setup), [iOS 27](/projects/ionic-theme-ios27/docs/setup) oder [MD3](/projects/ionic-theme-md3/docs/setup). Native UI ist dafür nicht erforderlich. Die folgenden Schritte ergänzen die Ionic- und Capacitor-Einrichtung um Darstellungseinstellungen.

## 1. Die Bedienelemente platzieren

Beginnen Sie mit der [eingerichteten App](/standard-setup). Ziel ist eine Einstellungsseite mit Light, Dark und System. Ergänzen Sie die gemeinsame Funktion in Schritt 2 und wählen Sie in Schritt 3 nur Ihr Framework. Es wird kein weiterer Controller oder Plugin eingerichtet.

## 2. Den bestehenden Erscheinungscontroller verwenden

Ergänzen Sie Typimport und Variable auf Modulebene in src/native-ui.ts. Weisen Sie der Variablen den vorhandenen Aufruf in connectNativeUI zu und ergänzen Sie setAppearanceMode im selben Modul. Es bleibt ein Controller. Die Funktion wartet auf den bestehenden Start und funktioniert auch auf später geöffneten Einstellungsseiten.

```ts:src/native-ui.ts
import type { ColorMode, DynamicColorTheme } from '@rdlabo/ionic-theme-md3/dynamic-colors';

let appearance: DynamicColorTheme;
```

```diff
- await enableDynamicColors({
+ appearance = await enableDynamicColors({
```

```ts:src/native-ui.ts
export async function setAppearanceMode(mode: ColorMode): Promise<void> {
  await startNativeUI();
  appearance.setMode(mode);
}
```

## 3. Die Schaltflächen verbinden

Wählen Sie ein Beispiel und ergänzen Sie dessen Imports und Ereignisbindung in der vorhandenen Einstellungsseite. Die Dateinamen zeigen die relativen Importpfade; Route und übriger Inhalt bleiben bestehen. Framework-Ereignisse benötigen keine DOM-Abfrage oder manuellen Listener. Beim erneuten Öffnen werden derselbe Start und Controller verwendet.

### Angular / Ionic 9

```ts:src/app/appearance.page.ts
import { Component } from '@angular/core';
import type { ColorMode } from '@rdlabo/ionic-theme-md3/dynamic-colors';
import { setAppearanceMode } from '../native-ui';

@Component({
  selector: 'app-appearance',
  template: `
    <section aria-label="Appearance">
      <button type="button" (click)="setMode('light')">Light</button>
      <button type="button" (click)="setMode('dark')">Dark</button>
      <button type="button" (click)="setMode('system')">System</button>
    </section>
  `,
})
export class AppearancePage {
  setMode(mode: ColorMode): void {
    void setAppearanceMode(mode).catch(console.error);
  }
}
```

### React

```tsx:src/Appearance.tsx
import type { ColorMode } from '@rdlabo/ionic-theme-md3/dynamic-colors';
import { setAppearanceMode } from './native-ui';

function setMode(mode: ColorMode): void {
  void setAppearanceMode(mode).catch(console.error);
}

export default function Appearance() {
  return (
    <section aria-label="Appearance">
      <button type="button" onClick={() => setMode('light')}>Light</button>
      <button type="button" onClick={() => setMode('dark')}>Dark</button>
      <button type="button" onClick={() => setMode('system')}>System</button>
    </section>
  );
}
```

### Vue

```vue:src/Appearance.vue
<script setup lang="ts">
import type { ColorMode } from '@rdlabo/ionic-theme-md3/dynamic-colors';
import { setAppearanceMode } from './native-ui';

function setMode(mode: ColorMode): void {
  void setAppearanceMode(mode).catch(console.error);
}
</script>

<template>
  <section aria-label="Appearance">
    <button type="button" @click="setMode('light')">Light</button>
    <button type="button" @click="setMode('dark')">Dark</button>
    <button type="button" @click="setMode('system')">System</button>
  </section>
</template>
```

## 4. Modi und Fallback prüfen

Klicken Sie auf Dark und Light: Web-Hintergrund und unterstützte iOS-Steuerelemente sollen gemeinsam wechseln. Wählen Sie System und ändern Sie die Geräteeinstellung. Ändern Sie unter Android 12+ die Hintergrundpalette und öffnen Sie die App erneut; MD3 soll die neuen Farben nutzen. Browser und ältere Geräte behalten nutzbare Fallback-Farben. Entfernen Sie bei Abweichungen zuerst alte Paletten oder eine zweite Erscheinungssteuerung.

Für die Farbzuordnung siehe [Dynamic Color](/projects/capacitor-native-ui/docs/dynamic-colors). Nur Themes installieren Sie über [iOS 26](/projects/ionic-theme-ios26/docs/setup), [iOS 27](/projects/ionic-theme-ios27/docs/setup) oder [MD3](/projects/ionic-theme-md3/docs/setup).
