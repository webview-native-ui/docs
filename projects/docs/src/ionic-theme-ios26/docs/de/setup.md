---
title: Das iOS-26-Theme einrichten
sourceRevision: '12e1b547a08ce9495e6add0490ec5f7082afe228220c97c1ede85b68b98326af'
---

Wenden Sie das iOS 26-Theme auf eine bestehende Ionic-9-App mit Angular, React oder Vue an. Diese Seite installiert nur das Theme. Native-UI-Start, ein natives Capacitor-Projekt und Foldable-Konfiguration sind nicht erforderlich. Bestehende Routen und Ereignisbehandlung bleiben erhalten.

## 1. Installieren

Installieren Sie das Paket im Anwendungsverzeichnis:

```sh
npm install @rdlabo/ionic-theme-ios26
```

## 2. Ein Stylesheet laden

Ersetzen Sie im globalen Stylesheet die bisherigen Theme- und passenden Ionic-Dunkelpaletten-Imports durch diesen Import nach dem Ionic-Basis-CSS. Das Preset enthält den System-Dunkelmodus und Kompatibilitätsstile. Eine Sass-Konfiguration ist nicht erforderlich.

```css
@import '@rdlabo/ionic-theme-ios26/styles/system.css';
```

Wählen Sie für manuellen Dunkelmodus styles/class.css und behalten Sie die bestehende Steuerung der Klasse ion-palette-dark. Für dauerhaft dunkle Apps wählen Sie styles/always.css. Laden Sie nur eines dieser Presets.

## 3. Ionic konfigurieren

Wählen Sie ein Framework-Beispiel. Das Preset liefert Theme-Modus und Animationen, auch für die Browser-Vorschau. Behalten Sie App-Optionen nach dem Spread. Wählt die App bewusst verschiedene Modi je Plattform, behalten Sie diese Auswahl und wenden Sie das Preset nur auf den passenden Modus an.

### Angular

Übergeben Sie in src/app/app.config.ts das Preset an den bestehenden Ionic-Provider. Das Beispiel zeigt diesen Provider; behalten Sie andere Provider im Array, einschließlich Router und HTTP.

```ts:src/app/app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideIonicAngular } from '@ionic/angular';
import { ios26ThemeConfig } from '@rdlabo/ionic-theme-ios26';

export const appConfig: ApplicationConfig = {
  providers: [provideIonicAngular({ ...ios26ThemeConfig })],
};
```

### React

Ersetzen Sie in src/main.tsx den bestehenden setupIonicReact-Aufruf vor dem Rendern der React-Wurzel durch diesen Aufruf. Behalten Sie Rendering, Routing und CSS-Imports.

```ts:src/main.tsx
import { setupIonicReact } from '@ionic/react';
import { ios26ThemeConfig } from '@rdlabo/ionic-theme-ios26';

setupIonicReact({ ...ios26ThemeConfig });
```

### Vue

Übergeben Sie in src/main.ts das Preset bei der IonicVue-Registrierung der bestehenden App vor dem Mounten. Das Beispiel zeigt die Position; behalten Sie Router, andere Plugins und die bestehende Mount-Sequenz.

```ts:src/main.ts
import { createApp } from 'vue';
import { IonicVue } from '@ionic/vue';
import { ios26ThemeConfig } from '@rdlabo/ionic-theme-ios26';
import App from './App.vue';

const app = createApp(App);
app.use(IonicVue, { ...ios26ThemeConfig });
app.mount('#app');
```

## 4. Vorschau

Starten Sie den üblichen Entwicklungsserver und öffnen Sie eine vorhandene Seite mit Ionic-Buttons oder Listen. Prüfen Sie das iOS-Design, den hellen und dunklen Systemmodus und die Navigation zwischen Seiten. Bei manuellem oder dauerhaftem Dunkelmodus prüfen Sie die gewählte Regel. Die Installation ist abgeschlossen, wenn das Theme greift, bestehende Bedienung und Navigation funktionieren und die Darstellungsregel eingehalten wird. Dafür sind weder nativer Build noch ein Gerät mit Leiste nötig.

Einzelne Stile und Anpassungen stehen unter [Konfiguration](configuration.md). Für bestehende Integrationen nutzen Sie [Migration](migration.md).
