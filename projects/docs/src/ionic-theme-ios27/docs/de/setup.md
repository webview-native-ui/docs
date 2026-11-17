---
title: Das iOS-27-Theme einrichten
sourceRevision: '6e176dd4cad5bda623d1cbefafc9395dd6d76e0dda737324a9ba8afcc0809375'
headingAliases:
  '1.-theme-und-foldable-installieren': '1.-theme-installieren'
---

Wenden Sie das iOS 27-Theme auf eine bestehende Ionic-9-App mit Angular, React oder Vue an. Diese Seite installiert nur das Theme. Native-UI-Start, ein natives Capacitor-Projekt und Foldable-Konfiguration sind nicht erforderlich. Bestehende Routen und Ereignisbehandlung bleiben erhalten.


Die Diffs beginnen bei einer vorhandenen App mit einer Ionic-Initialisierung ohne Argument. Nicht gezeigte Routen, Provider und Renderlogik bleiben erhalten. Vorhandene Optionen stehen hinter dem Preset und behalten damit ihre Überschreibungen. src/global.css bezeichnet das vorhandene globale Stylesheet, etwa src/global.scss bei Angular; legen Sie keine zweite Datei an.


Der Stylesheet-Diff beginnt bei dark.system.css und behält die OS-Anpassung bei. Nutzt die App bereits Klassensteuerung oder dauerhaft Dunkel, behalten Sie diese Regel mit dem passenden Preset bei, statt zu System zu wechseln.

## Vorbereitungen

Behalten Sie das Ionic-Basis-CSS. Wählen Sie unten das Beispiel für Ihr Framework und ersetzen Sie die bestehende Theme-Initialisierung, statt Ionic zweimal zu initialisieren.

## 1. Theme installieren

Nach npm sind nur die Abhängigkeiten installiert; Stylesheet und Initialisierung fehlen noch.

Installieren Sie das Paket im Anwendungsverzeichnis:

```sh
npm install @rdlabo/ionic-theme-ios27
```

## 2. Ein Stylesheet laden

Nach diesem Diff ist das Theme-Stylesheet eingebunden; die Ionic-Konfiguration folgt noch.

Ersetzen Sie im globalen Stylesheet die bisherigen Theme- und passenden Ionic-Dunkelpaletten-Imports durch diesen Import nach dem Ionic-Basis-CSS. Das Preset enthält den System-Dunkelmodus und Kompatibilitätsstile. Eine Sass-Konfiguration ist nicht erforderlich.

```diff:src/global.css
@@
 @import '@ionic/core/css/core.css';
 @import '@ionic/core/css/structure.css';
- @import '@ionic/core/css/palettes/dark.system.css';
+ @import '@rdlabo/ionic-theme-ios27/styles/system.css';

 :root { --app-content-width: 72rem; }
```

Wählen Sie für manuellen Dunkelmodus styles/class.css und behalten Sie die bestehende Steuerung der Klasse ion-palette-dark. Für dauerhaft dunkle Apps wählen Sie styles/always.css. Laden Sie nur eines dieser Presets.

## 3. Die Theme-Konfiguration an Ionic übergeben

Wenden Sie nur den Diff Ihres Frameworks an. Danach sind Stylesheet und Initialisierung eingerichtet; die Browserprüfung steht noch aus.

Wählen Sie ein Framework-Beispiel. Das Preset liefert Theme-Modus und Animationen, auch für die Browser-Vorschau. Behalten Sie App-Optionen nach dem Spread. Wählt die App bewusst verschiedene Modi je Plattform, behalten Sie diese Auswahl und wenden Sie das Preset nur auf den passenden Modus an.

### Angular

Übergeben Sie in src/app/app.config.ts das Preset an den bestehenden Ionic-Provider. Das Beispiel zeigt diesen Provider; behalten Sie andere Provider im Array, einschließlich Router und HTTP.

```diff:src/app/app.config.ts
@@
 import { ApplicationConfig } from '@angular/core';
 import { provideIonicAngular } from '@ionic/angular';
+ import { ios27ThemeConfig } from '@rdlabo/ionic-theme-ios27';
 import { provideRouter } from '@angular/router';
 import { routes } from './app.routes';

 export const appConfig: ApplicationConfig = {
   providers: [
     provideRouter(routes),
-     provideIonicAngular(),
+     provideIonicAngular({ ...ios27ThemeConfig }),
     provideHttpClient(),
   ],
 };
```

### React

Ersetzen Sie in src/main.tsx den bestehenden setupIonicReact-Aufruf vor dem Rendern der React-Wurzel durch diesen Aufruf. Behalten Sie Rendering, Routing und CSS-Imports.

```diff:src/main.tsx
@@
 import { setupIonicReact } from '@ionic/react';
+ import { ios27ThemeConfig } from '@rdlabo/ionic-theme-ios27';
 import { createRoot } from 'react-dom/client';
 import App from './App';
 import './global.css';

- setupIonicReact();
+ setupIonicReact({ ...ios27ThemeConfig });

 createRoot(document.getElementById('root')!).render(<App />);
```

### Vue

Übergeben Sie in src/main.ts das Preset bei der IonicVue-Registrierung der bestehenden App vor dem Mounten. Das Beispiel zeigt die Position; behalten Sie Router, andere Plugins und die bestehende Mount-Sequenz.

```diff:src/main.ts
@@
 import { createApp } from 'vue';
 import { IonicVue } from '@ionic/vue';
+ import { ios27ThemeConfig } from '@rdlabo/ionic-theme-ios27';
 import App from './App.vue';
 import router from './router';
@@

 const app = createApp(App);
- app.use(IonicVue);
+ app.use(IonicVue, { ...ios27ThemeConfig });
 app.use(router);
 router.isReady().then(() => app.mount('#app'));
```

## 4. Den ersten Bildschirm ansehen

Starten Sie den üblichen Entwicklungsserver und öffnen Sie eine vorhandene Seite mit Ionic-Buttons oder Listen. Prüfen Sie das iOS-Design, den hellen und dunklen Systemmodus und die Navigation zwischen Seiten. Bei manuellem oder dauerhaftem Dunkelmodus prüfen Sie die gewählte Regel. Die Installation ist abgeschlossen, wenn das Theme greift, bestehende Bedienung und Navigation funktionieren und die Darstellungsregel eingehalten wird. Dafür sind weder nativer Build noch ein Gerät mit Leiste nötig.

## Nächste Schritte

Geräteabhängige Platzierung und native Steuerelemente sind optionale Ergänzungen. Folgen Sie für gemeldete Leisten dem [Layout-Leitfaden](vertical-bars-layout.md#read-the-device-layout) und installieren Sie Foldable erst dort. Native Steuerelemente ergänzen Sie mit der [Native-UI-Integration](add-native-ui.md). Das Theme allein aktiviert keine nativen Steuerelemente.

Einzelne Stile und Anpassungen stehen unter [Konfiguration](configuration.md). Für bestehende Integrationen nutzen Sie [Migration](migration.md).
