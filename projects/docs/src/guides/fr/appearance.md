---
title: 'Personnaliser l’apparence'
sourceRevision: '937569d01125fc3106f2a16c6de5da61360b98a4d5cb45df0e1e35ea8adf6ce2'
---

# Personnaliser l’apparence

Ajoutez des commandes clair, sombre et système à l’application configurée. Android conserve sa palette disponible ; la même préférence pilote le Web et les contrôles natifs iOS.

Pour une application utilisant uniquement un thème, commencez par l’installation [iOS 26](/projects/ionic-theme-ios26/docs/setup), [iOS 27](/projects/ionic-theme-ios27/docs/setup) ou [MD3](/projects/ionic-theme-md3/docs/setup). Native UI n’est pas nécessaire. Les étapes suivantes ajoutent des réglages d’apparence à la configuration Ionic + Capacitor.

## 1. Placer les commandes

Partez de l’application [déjà configurée](/standard-setup). L’objectif est une page de réglages avec les boutons Light, Dark et System. Ajoutez la fonction commune à l’étape 2, puis choisissez uniquement votre framework à l’étape 3. Aucun nouveau contrôleur ni plugin n’est installé.

## 2. Conserver le contrôleur existant

Dans src/native-ui.ts, ajoutez l’import de types et la variable au niveau du module. Affectez cette variable dans l’appel existant de connectNativeUI, puis ajoutez setAppearanceMode au même module. Il reste un seul contrôleur. La fonction attend le démarrage existant ; une page de réglages ouverte plus tard peut donc l’utiliser.

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

## 3. Relier les boutons

Choisissez un seul exemple et ajoutez ses imports et événements à la page de réglages existante. Les noms de fichiers indiquent les chemins relatifs ; conservez la route et le reste du contenu. Les événements du framework évitent requêtes DOM et écouteurs manuels. Rouvrir la page réutilise le même démarrage et contrôleur.

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

## 4. Vérifier les modes et le repli

Cliquez sur Dark puis Light : fond Web et contrôles iOS doivent changer ensemble. Choisissez System et modifiez l’apparence de l’appareil. Sur Android 12+, changez la palette du fond d’écran puis rouvrez l’app : MD3 doit la refléter. Le navigateur et les appareils non compatibles gardent une palette utilisable. En cas de divergence, retirez d’abord les anciennes palettes ou le second gestionnaire.

Pour le mappage des couleurs, consultez [Dynamic Color](/projects/capacitor-native-ui/docs/dynamic-colors). Pour un thème seul, suivez [iOS 26](/projects/ionic-theme-ios26/docs/setup), [iOS 27](/projects/ionic-theme-ios27/docs/setup) ou [MD3](/projects/ionic-theme-md3/docs/setup).
