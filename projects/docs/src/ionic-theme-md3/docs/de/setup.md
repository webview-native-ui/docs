---
title: Das MD3-Theme einrichten
sourceRevision: '91bbdd037b94a24267e0e6b1d91a32cc2fff91a7894ae1b9bd0129c2594e2ccc'
---

Wenden Sie das Material Design 3-Theme auf eine bestehende Ionic-9-App mit Angular, React oder Vue an. Diese Seite installiert nur das Theme. Native-UI-Start, ein natives Capacitor-Projekt und Foldable-Konfiguration sind nicht erforderlich. Bestehende Routen und Ereignisbehandlung bleiben erhalten.

## Das Theme installieren

Installieren Sie das Paket im Anwendungsverzeichnis:

```sh
npm install @rdlabo/ionic-theme-md3
```

## Das Theme-Stylesheet laden

Behalten Sie im globalen Stylesheet das Ionic-Basis-CSS und die gewählte Ionic-Dunkelpalette und laden Sie danach MD3. Das Beispiel nutzt den System-Dunkelmodus. Falls eine andere Palette konfiguriert ist, behalten Sie diese, ohne eine zweite hinzuzufügen. Ersetzen Sie einzelne MD3-Stylesheet-Imports durch diesen einen Import.

```css
@import '@ionic/core/css/palettes/dark.system.css';
@import '@rdlabo/ionic-theme-md3/styles/theme.css';
```

## Ionic konfigurieren

Wählen Sie ein Framework-Beispiel. Das Preset liefert Theme-Modus und Animationen, auch für die Browser-Vorschau. Behalten Sie App-Optionen nach dem Spread. Wählt die App bewusst verschiedene Modi je Plattform, behalten Sie diese Auswahl und wenden Sie das Preset nur auf den passenden Modus an.

### Angular

Übergeben Sie in src/app/app.config.ts das Preset an den bestehenden Ionic-Provider. Das Beispiel zeigt diesen Provider; behalten Sie andere Provider im Array, einschließlich Router und HTTP.

```ts:src/app/app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideIonicAngular } from '@ionic/angular';
import { md3ThemeConfig } from '@rdlabo/ionic-theme-md3';

export const appConfig: ApplicationConfig = {
  providers: [provideIonicAngular({ ...md3ThemeConfig })],
};
```

### React

Ersetzen Sie in src/main.tsx den bestehenden setupIonicReact-Aufruf vor dem Rendern der React-Wurzel durch diesen Aufruf. Behalten Sie Rendering, Routing und CSS-Imports.

```ts:src/main.tsx
import { setupIonicReact } from '@ionic/react';
import { md3ThemeConfig } from '@rdlabo/ionic-theme-md3';

setupIonicReact({ ...md3ThemeConfig });
```

### Vue

Übergeben Sie in src/main.ts das Preset bei der IonicVue-Registrierung der bestehenden App vor dem Mounten. Das Beispiel zeigt die Position; behalten Sie Router, andere Plugins und die bestehende Mount-Sequenz.

```ts:src/main.ts
import { createApp } from 'vue';
import { IonicVue } from '@ionic/vue';
import { md3ThemeConfig } from '@rdlabo/ionic-theme-md3';
import App from './App.vue';

const app = createApp(App);
app.use(IonicVue, { ...md3ThemeConfig });
app.mount('#app');
```

## Einen Bildschirm ansehen

Starten Sie den üblichen Entwicklungsserver und öffnen Sie eine vorhandene Seite mit Ionic-Buttons oder Listen. Prüfen Sie das Material Design 3-Design, den hellen und dunklen Systemmodus und die Navigation zwischen Seiten. Bei manuellem oder dauerhaftem Dunkelmodus prüfen Sie die gewählte Regel. Die Installation ist abgeschlossen, wenn das Theme greift, bestehende Bedienung und Navigation funktionieren und die Darstellungsregel eingehalten wird. Dafür sind weder nativer Build noch ein Gerät mit Leiste nötig.

Einzelne Stile und Anpassungen stehen unter [Konfiguration](configuration.md). Für bestehende Integrationen nutzen Sie [Migration](migration.md).
