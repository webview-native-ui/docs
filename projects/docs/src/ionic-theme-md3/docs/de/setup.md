---
title: Das MD3-Theme einrichten
sourceRevision: '4bb3ca73de2c3058aaaad70af3a9155293f579b4b9675405076d8a4708cc1d6d'
---

Wenden Sie das Material Design 3-Theme auf eine bestehende Ionic-9-App mit Angular, React oder Vue an. Diese Seite installiert nur das Theme. Native-UI-Start, ein natives Capacitor-Projekt und Foldable-Konfiguration sind nicht erforderlich. Bestehende Routen und Ereignisbehandlung bleiben erhalten.


Die Diffs beginnen bei einer vorhandenen App mit einer Ionic-Initialisierung ohne Argument. Nicht gezeigte Routen, Provider und Renderlogik bleiben erhalten. Vorhandene Optionen stehen hinter dem Preset und behalten damit ihre Überschreibungen. src/global.css bezeichnet das vorhandene globale Stylesheet, etwa src/global.scss bei Angular; legen Sie keine zweite Datei an.


Der Stylesheet-Diff beginnt bei dark.system.css und behält die OS-Anpassung bei. Nutzt die App bereits Klassensteuerung oder dauerhaft Dunkel, behalten Sie diese Regel mit dem passenden Preset bei, statt zu System zu wechseln.

## Das Theme installieren

Nach npm sind nur die Abhängigkeiten installiert; Stylesheet und Initialisierung fehlen noch.

Installieren Sie das Paket im Anwendungsverzeichnis:

```sh
npm install @rdlabo/ionic-theme-md3
```

## Das Theme-Stylesheet laden

Nach diesem Diff ist das Theme-Stylesheet eingebunden; die Ionic-Konfiguration folgt noch.

Behalten Sie im globalen Stylesheet das Ionic-Basis-CSS und die gewählte Ionic-Dunkelpalette und laden Sie danach MD3. Das Beispiel nutzt den System-Dunkelmodus. Falls eine andere Palette konfiguriert ist, behalten Sie diese, ohne eine zweite hinzuzufügen. Ersetzen Sie einzelne MD3-Stylesheet-Imports durch diesen einen Import.

```diff:src/global.css
@@
 @import '@ionic/core/css/structure.css';
 @import '@ionic/core/css/palettes/dark.system.css';
+ @import '@rdlabo/ionic-theme-md3/styles/theme.css';

 :root { --app-content-width: 72rem; }
```

## Ionic konfigurieren

Wenden Sie nur den Diff Ihres Frameworks an. Danach sind Stylesheet und Initialisierung eingerichtet; die Browserprüfung steht noch aus.

Wählen Sie ein Framework-Beispiel. Das Preset liefert Theme-Modus und Animationen, auch für die Browser-Vorschau. Behalten Sie App-Optionen nach dem Spread. Wählt die App bewusst verschiedene Modi je Plattform, behalten Sie diese Auswahl und wenden Sie das Preset nur auf den passenden Modus an.

### Angular

Übergeben Sie in src/app/app.config.ts das Preset an den bestehenden Ionic-Provider. Das Beispiel zeigt diesen Provider; behalten Sie andere Provider im Array, einschließlich Router und HTTP.

```diff:src/app/app.config.ts
@@
 import { ApplicationConfig } from '@angular/core';
 import { provideIonicAngular } from '@ionic/angular';
+ import { md3ThemeConfig } from '@rdlabo/ionic-theme-md3';
 import { provideRouter } from '@angular/router';
 import { routes } from './app.routes';

 export const appConfig: ApplicationConfig = {
   providers: [
     provideRouter(routes),
-     provideIonicAngular(),
+     provideIonicAngular({ ...md3ThemeConfig }),
     provideHttpClient(),
   ],
 };
```

### React

Ersetzen Sie in src/main.tsx den bestehenden setupIonicReact-Aufruf vor dem Rendern der React-Wurzel durch diesen Aufruf. Behalten Sie Rendering, Routing und CSS-Imports.

```diff:src/main.tsx
@@
 import { setupIonicReact } from '@ionic/react';
+ import { md3ThemeConfig } from '@rdlabo/ionic-theme-md3';
 import { createRoot } from 'react-dom/client';
 import App from './App';
 import './global.css';

- setupIonicReact();
+ setupIonicReact({ ...md3ThemeConfig });

 createRoot(document.getElementById('root')!).render(<App />);
```

### Vue

Übergeben Sie in src/main.ts das Preset bei der IonicVue-Registrierung der bestehenden App vor dem Mounten. Das Beispiel zeigt die Position; behalten Sie Router, andere Plugins und die bestehende Mount-Sequenz.

```diff:src/main.ts
@@
 import { createApp } from 'vue';
 import { IonicVue } from '@ionic/vue';
+ import { md3ThemeConfig } from '@rdlabo/ionic-theme-md3';
 import App from './App.vue';
 import router from './router';
@@

 const app = createApp(App);
- app.use(IonicVue);
+ app.use(IonicVue, { ...md3ThemeConfig });
 app.use(router);
 router.isReady().then(() => app.mount('#app'));
```

## Einen Bildschirm ansehen

Starten Sie den üblichen Entwicklungsserver und öffnen Sie eine vorhandene Seite mit Ionic-Buttons oder Listen. Prüfen Sie das Material Design 3-Design, den hellen und dunklen Systemmodus und die Navigation zwischen Seiten. Bei manuellem oder dauerhaftem Dunkelmodus prüfen Sie die gewählte Regel. Die Installation ist abgeschlossen, wenn das Theme greift, bestehende Bedienung und Navigation funktionieren und die Darstellungsregel eingehalten wird. Dafür sind weder nativer Build noch ein Gerät mit Leiste nötig.

Einzelne Stile und Anpassungen stehen unter [Konfiguration](configuration.md). Für bestehende Integrationen nutzen Sie [Migration](migration.md).
