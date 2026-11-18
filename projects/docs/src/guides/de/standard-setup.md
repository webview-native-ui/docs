---
title: 'Eine Ionic-App einrichten'
sourceRevision: 'a67ad0f183afb251096333b5a893f0b52af2159adc4999ccb9fdeea10c4cbcbb'
headingAliases:
  'vor-dem-start': '1.-pakete-installieren'
  'verify-installation': '5.-die-integration-pr%C3%BCfen'
  'das-ergebnis-auf-jeder-plattform-pr%C3%BCfen': '5.-die-integration-pr%C3%BCfen'
  'nach-der-einrichtung': 'einrichtung-abgeschlossen'
---

# Eine Ionic-App einrichten

Richten Sie eine bestehende Ionic- und Capacitor-App mit iOS 26 als iOS-Basistheme, iOS 27 für geeignete Browser und Material Design 3 auf Android ein. Diese Anleitung verbindet außerdem native iOS-Steuerelemente, iPhone Duo / Vertical Bars und Android Dynamic Color.

## 1. Pakete installieren

```sh
npm install @rdlabo/capacitor-native-ui @rdlabo/ionic-theme-ios26 \
  @rdlabo/ionic-theme-ios27 @rdlabo/ionic-theme-md3 \
  @erkamyaman/capacitor-foldable@8
```

Für die Positionierung der Leisten ist Foldable ab 8.5 innerhalb der Hauptversion 8 erforderlich.

## 2. Beide Themes konfigurieren

Die Pakete sind installiert. Wenden Sie den Stylesheet-Diff und nur den Initialisierungs-Diff Ihres Frameworks an. Kontextzeilen bleiben bestehen; nicht gezeigte Provider, Router und Optionen bleiben erhalten. Danach sind Themes und Ionic konfiguriert, der native Start fehlt noch.

Der Style-Diff zeigt die vorhandene globale Datei src/global.css. Verwendet die App global.scss oder eine andere globale Datei, ändern Sie diese, statt ein weiteres Stylesheet anzulegen. Die entfernte Palette ist genau dark.system.css; ersetzen Sie diese Zeile nicht durch eine class- oder always-Palette.

Diese system-Presets behalten die bisherige Regel bei, der hellen/dunklen OS-Darstellung zu folgen. Eine Theme-Installation führt keine appgesteuerte Hell-/Dunkel-Überschreibung ein. Wechseln Sie erst beim Ergänzen dieser Funktion in der [Darstellungsaufgabe](/guides/appearance) zu class-Presets. Der Startcontroller bleibt im standardmäßigen system-Modus.

<!-- prettier-ignore -->
```diff:src/global.css
@@
 @import '@ionic/core/css/core.css';
 @import '@ionic/core/css/structure.css';
- @import '@ionic/core/css/palettes/dark.system.css';
+ @import '@rdlabo/ionic-theme-ios26/styles/system.css' supports(not (overflow-anchor: auto));
+ @import '@rdlabo/ionic-theme-ios27/styles/system.css' supports(overflow-anchor: auto);
+ @import '@rdlabo/ionic-theme-md3/styles/theme.css';

 :root { --app-content-width: 72rem; }
```

CSS wählt standardmäßig iOS 26 und bei Unterstützung für `overflow-anchor: auto` iOS 27. Der Material-Design-Modus nutzt MD3. Beide iOS-Stile verwenden dasselbe `ios27ThemeConfig` einschließlich nativer Übergangssynchronisierung. Übergeben Sie das Plattform-Preset an Ihre vorhandene Ionic-Initialisierung:

Wählen Sie das Beispiel für Ihr Framework und ersetzen Sie die vorhandene Ionic-Initialisierung. Initialisieren Sie Ionic nur einmal.

### Angular / Ionic 9

Übergeben Sie das Preset im vorhandenen App-Setup an den Ionic-Provider. Behalten Sie andere Provider einschließlich Router und HTTP bei.

<!-- prettier-ignore -->
```diff:src/app/app.config.ts
@@
 import { provideIonicAngular } from '@ionic/angular';
 import { provideRouter } from '@angular/router';
 import { routes } from './app.routes';
+ import { Capacitor } from '@capacitor/core';
+ import { ios27ThemeConfig } from '@rdlabo/ionic-theme-ios27';
+ import { md3ThemeConfig } from '@rdlabo/ionic-theme-md3';
+ 
+ const ionicConfig = Capacitor.getPlatform() === 'ios' ? ios27ThemeConfig : md3ThemeConfig;

 export const appConfig: ApplicationConfig = {
   providers: [
     provideRouter(routes),
-     provideIonicAngular(),
+     provideIonicAngular(ionicConfig),
     provideHttpClient(),
   ],
 };
```

### React

Führen Sie dies im bestehenden Einstiegspunkt vor dem Rendern der Root-Komponente aus. Behalten Sie React-Root, Routen und CSS-Imports bei.

<!-- prettier-ignore -->
```diff:src/main.tsx
@@
 import { setupIonicReact } from '@ionic/react';
+ import { Capacitor } from '@capacitor/core';
+ import { ios27ThemeConfig } from '@rdlabo/ionic-theme-ios27';
+ import { md3ThemeConfig } from '@rdlabo/ionic-theme-md3';
 import { createRoot } from 'react-dom/client';
 import App from './App';
 import './global.css';

- setupIonicReact();
+ const ionicConfig = Capacitor.getPlatform() === 'ios' ? ios27ThemeConfig : md3ThemeConfig;
+ 
+ setupIonicReact(ionicConfig);

 createRoot(document.getElementById('root')!).render(<App />);
```

### Vue

Übergeben Sie das Preset im vorhandenen Einstiegspunkt bei der Registrierung von IonicVue vor dem Mounten. Behalten Sie Router und andere Plugins zwischen Erzeugung und Mounten bei.

<!-- prettier-ignore -->
```diff:src/main.ts
@@
 import { createApp } from 'vue';
 import { IonicVue } from '@ionic/vue';
+ import { Capacitor } from '@capacitor/core';
+ import { ios27ThemeConfig } from '@rdlabo/ionic-theme-ios27';
+ import { md3ThemeConfig } from '@rdlabo/ionic-theme-md3';
 import App from './App.vue';
 import router from './router';
 import './global.css';

+ const ionicConfig = Capacitor.getPlatform() === 'ios' ? ios27ThemeConfig : md3ThemeConfig;
+ 
 const app = createApp(App);
- app.use(IonicVue);
+ app.use(IonicVue, ionicConfig);
 app.use(router);
 router.isReady().then(() => app.mount('#app'));
```

## 3. Nach dem Rendern der App-Shell starten

Die Themes sind konfiguriert. Erstellen Sie das gemeinsame Modul aus dem vollständig hinzugefügten Diff und ändern Sie nur die vorhandene App-Wurzel Ihres Frameworks. Template und Router bleiben erhalten. Der Start erfolgt danach nach dem Rendern; nativer Build und Prüfung stehen noch aus.

<!-- prettier-ignore -->
```diff:src/native-ui.ts
+ import { Capacitor } from '@capacitor/core';
+ import { enableNativeUI, getDynamicColorScheme, addDynamicColorListener } from '@rdlabo/capacitor-native-ui';
+ import { Foldable } from '@erkamyaman/capacitor-foldable';
+ import { resolveVerticalBarsLayout } from '@rdlabo/capacitor-native-ui/integration';
+ import { setVerticalBarsLayout } from '@rdlabo/ionic-theme-ios27';
+ import { enableDynamicColors } from '@rdlabo/ionic-theme-md3/dynamic-colors';
+ 
+ let startup: Promise<void> | undefined;
+ 
+ export function startNativeUI(): Promise<void> {
+   return (startup ??= connectNativeUI());
+ }
+ 
+ async function connectNativeUI(): Promise<void> {
+   await enableDynamicColors({
+     getScheme: getDynamicColorScheme,
+     listen: addDynamicColorListener,
+   });
+ 
+   if (Capacitor.getPlatform() === 'ios') {
+     await enableNativeUI();
+ 
+     const updateLayout = async () => {
+       setVerticalBarsLayout(await resolveVerticalBarsLayout(Foldable));
+     };
+ 
+     void Foldable.addListener('layoutChange', () => void updateLayout().catch(console.error))
+       .then(updateLayout)
+       .catch(console.error);
+   }
+ }
```

### Angular

Wenden Sie den Diff auf die bestehende Wurzelkomponente an. Template und Komponenten-Imports im Kontext bleiben mit Menü und Router erhalten.

<!-- prettier-ignore -->
```diff:src/app/app.component.ts
@@
- import { Component } from '@angular/core';
+ import { Component, afterNextRender } from '@angular/core';
 import { IonApp, IonRouterOutlet } from '@ionic/angular';
+ import { startNativeUI } from '../native-ui';

 @Component({
   selector: 'app-root',
   imports: [IonApp, IonRouterOutlet],
   template: '<ion-app><ion-router-outlet /></ion-app>',
 })
- export class AppComponent {}
+ export class AppComponent {
+   constructor() {
+     afterNextRender(() => {
+       void startNativeUI().catch(console.error);
+     });
+   }
+ }
```

### React

Wenden Sie den Diff auf die vorhandene App-Komponente an. ExistingRouter steht für den bereits gerenderten Router; behalten Sie ihn samt Routen.

<!-- prettier-ignore -->
```diff:src/App.tsx
@@
+ import { useEffect } from 'react';
+ import { startNativeUI } from './native-ui';
 import { IonApp } from '@ionic/react';
 import { ExistingRouter } from './router';

 export default function App() {
+   useEffect(() => {
+     void startNativeUI().catch(console.error);
+   }, []);
+ 
   return <IonApp><ExistingRouter /></IonApp>;
 }
```

### Vue

Wenden Sie den Diff auf das vorhandene App.vue-Script an. Template, Router-Outlet und Menü bleiben unverändert.

<!-- prettier-ignore -->
```diff:src/App.vue
@@
 <script setup lang="ts">
+ import { onMounted } from 'vue';
 import { IonApp, IonRouterOutlet } from '@ionic/vue';
+ import { startNativeUI } from './native-ui';
+ 
+ onMounted(() => {
+   void startNativeUI().catch(console.error);
+ });
 </script>

 <template>
```

## 4. Erstellen, synchronisieren und ausführen

Der Start ist verbunden. Erstellen Sie im App-Verzeichnis den Web-Build und führen Sie nur die Befehle Ihrer Zielplattform aus. Bauen und starten Sie das Projekt in Xcode oder Android Studio. Danach enthält die App neue Web-Assets und Plugin; die Abnahme erfolgt in Schritt 5.

```sh
npm run build
```

### iOS

```sh
npx cap sync ios
npx cap open ios
```

### Android

```sh
npx cap sync android
npx cap open android
```

SwiftPM löst Engine automatisch auf. Für CocoaPods siehe [native Einrichtung](/projects/capacitor-native-ui/docs/configuration#native-project-setup).

## 5. Die Integration prüfen

Native iOS-Steuerelemente benötigen iOS 26+ und Xcode 26+. Android Dynamic Color benötigt Android 12+; ältere Geräte behalten die Standardpalette. Natives Rail-Rendering erfordert zusätzlich ein [unterstütztes Gerät und Betriebssystem](/projects/capacitor-native-ui/docs/vertical-bars#native-rendering).

Die native Darstellung unterstützter Ionic-Steuerelemente und die Reaktion auf Layoutänderungen sind bereits eingerichtet. Prüfen Sie dies mit vorhandenen Bildschirmen und Aktionen; zusätzliche Toolbar-Aktionen, eigene Komponenten oder Layout-Vorschaucodes sind nicht erforderlich.

### Alle Ziele: Abschlussprüfung

| Ziel                   | Prüfung                                                                   | Fertig, wenn                                                                                                                                                           |
| ---------------------- | ------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Alle                   | Seiten öffnen, navigieren und Hell/Dunkel wechseln.                       | Routen, Aktionen und lesbare Web-Elemente funktionieren.                                                                                                               |
| iOS                    | Mit Xcode 26+ unter iOS 26+ starten und unterstützte Elemente betrachten. | Das vorhandene unterstützte Element erscheint nativ und ruft bei Bedienung den ursprünglichen Web-Handler einmal auf. Ältere Systeme behalten bedienbare Web-Elemente. |
| Android                | Native App öffnen; ab Android 12 Gerätepalette ändern und erneut öffnen.  | MD3 nutzt verfügbare Gerätefarben; sonst bleiben Fallback-Farben und Web-Elemente bedienbar.                                                                           |
| Gerät mit nativer Rail | Layout ändern und zurücksetzen.                                           | Vertical Bars folgt den Meldungen und entfernt den Platz wieder. Andere Geräte behalten das normale Layout.                                                            |
| Browser                | Themes und vorhandene Aktionen ausprobieren.                              | Web-Darstellung und Verhalten funktionieren; dies belegt keine nativen Elemente, Gerätefarben oder Rails.                                                              |

### Nur iOS 26+ / Xcode 26+: temporäre Prüfung ergänzen

Wenn ein iOS-Steuerelement weiterhin in der Webansicht erscheint, können Sie seinen Status in Safari prüfen.

Prüfen Sie unter iOS 26+ mit Xcode 26+ einmal die vorhandene Runtime. Ersetzen Sie im iOS-Zweig von src/native-ui.ts den vorhandenen Aufruf await enableNativeUI() vorübergehend durch diese beiden Zeilen. Die Diagnose liest denselben Handle und startet keine weitere Runtime.

<!-- prettier-ignore -->
```diff:src/native-ui.ts (iOS verification)
@@
-     await enableNativeUI();
+     const shell = await enableNativeUI();
+     Object.assign(window, { inspectNativeUI: () => shell.getStatus() });
```

Bauen und synchronisieren Sie die Entwicklungs-App gemäß Schritt 4. Öffnen Sie ihre WebView im Safari Web Inspector. Zeigen Sie eine vorhandene Seite mit unterstütztem Toolbar-Button oder Tab-Bar und führen Sie nach der Darstellung Folgendes in der Konsole aus:

```js
window.inspectNativeUI();
```

Bei unterstützten Elementen muss state native und projected positiv sein; eine Aktion ruft ihren Web-Handler einmal auf. Die Projektion ist asynchron: Ist projected anfangs 0, warten Sie auf die Darstellung und prüfen erneut. Ein dauerhaftes 0 bestätigt keine native Darstellung. Bleibt state bei einem unterstützten iOS-Build web, prüfen Sie reason, native Synchronisierung/Neubau und Elementunterstützung vor dem Abschluss. Auf nicht unterstützten Systemen wird der Web-Fallback erwartet; die Web-Elemente müssen bedienbar bleiben. Entfernen Sie danach die temporäre Diagnose und stellen Sie await enableNativeUI() wieder her.

### Nur iOS 26+ / Xcode 26+: temporäre Prüfung entfernen

Wenden Sie diese Entfernung nur nach der unterstützten iOS-Prüfung oben an. Reines Android und älteres iOS überspringen den gesamten Abschnitt samt Befehlen und gehen zu Einrichtung abgeschlossen.

<!-- prettier-ignore -->
```diff:src/native-ui.ts (iOS verification)
@@
-     const shell = await enableNativeUI();
-     Object.assign(window, { inspectNativeUI: () => shell.getStatus() });
+     await enableNativeUI();
```

Bauen und synchronisieren Sie im App-Verzeichnis mit den folgenden Befehlen, beenden Sie die laufende iOS-App und starten Sie sie neu. Öffnen Sie Safari Web Inspector erneut: Der Ausdruck muss undefined liefern. Normale Elemente und ursprüngliche Handler müssen weiter funktionieren. Dadurch verschwindet auch der alte window-Hook aus dem Speicher.

```sh
npm run build
npx cap sync ios
```

```js
typeof window.inspectNativeUI;
```

## Einrichtung abgeschlossen

Sind diese Prüfungen erfolgreich, ist die Einrichtung abgeschlossen. Wählen Sie eine optionale Aufgabe nur für eine zusätzliche Funktion: [Darstellungseinstellungen](/guides/appearance) oder [eigene native UI](/guides/extensions).

## Einzelne Optionen

Für Native UI ohne diese Themes verwenden Sie die [Einrichtung mit vorhandenem Theme](/projects/capacitor-native-ui/docs/ionic-vertical-bars) oder die [HTML-Einrichtung](/projects/capacitor-native-ui/docs/framework-independent). Siehe [Dynamic Color](/projects/capacitor-native-ui/docs/dynamic-colors) für Darstellung und Farbzuordnung, [Konfiguration](/projects/capacitor-native-ui/docs/configuration) für Native-UI-Optionen und [Migration](/projects/capacitor-native-ui/docs/migration) für bestehende Integrationen.
