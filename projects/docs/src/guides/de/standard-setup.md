---
title: 'Eine Ionic-App einrichten'
sourceRevision: 'c9537c6c26d13c92845d732c8b7d42316125570eb1dfd3a3b8ce0ca6ba7f3d06'
---

# Eine Ionic-App einrichten

Richten Sie eine bestehende Ionic- und Capacitor-App mit iOS 26 als iOS-Basistheme, iOS 27 für geeignete Browser und Material Design 3 auf Android ein. Diese Anleitung verbindet außerdem native iOS-Steuerelemente, iPhone Duo / Vertical Bars und Android Dynamic Color.

## Vor dem Start

Verwenden Sie eine vorhandene Ionic-9-App mit Capacitor 8 und Foldable ab 8.5 innerhalb der Hauptversion 8. Wählen Sie iOS, Android oder beide. Beginnen Sie mit einem funktionierenden Web-Build und einem nativen Projekt für jede gewählte Plattform; ein weiteres Projekt ist nicht nötig. Behalten Sie vorhandene Routen und Handler.

Native iOS-Steuerelemente benötigen iOS 26+ und Xcode 26+. Android Dynamic Color benötigt Android 12+; ältere Geräte behalten die Standardpalette. Natives Rail-Rendering erfordert zusätzlich ein [unterstütztes Gerät und Betriebssystem](/projects/capacitor-native-ui/docs/vertical-bars#native-rendering).

Für ein Theme allein wählen Sie die Installation von [iOS 26](/projects/ionic-theme-ios26/docs/setup), [iOS 27](/projects/ionic-theme-ios27/docs/setup) oder [MD3](/projects/ionic-theme-md3/docs/setup). Für [Native UI mit vorhandenem Theme](/projects/capacitor-native-ui/docs/ionic-vertical-bars), [HTML ohne Ionic](/projects/capacitor-native-ui/docs/framework-independent) oder [Cordova](/projects/cordova-native-ui/docs/readme) verwenden Sie die jeweilige Anleitung.

## 1. Pakete installieren

```sh
npm install @rdlabo/capacitor-native-ui @rdlabo/ionic-theme-ios26 \
  @rdlabo/ionic-theme-ios27 @rdlabo/ionic-theme-md3 \
  @erkamyaman/capacitor-foldable@8
```

## 2. Beide Themes konfigurieren

Fügen Sie diese Imports nach dem Ionic-Basis-CSS in die globale Stylesheet-Datei ein. Ersetzen Sie vorhandene Theme- und dunkle Ionic-Paletten-Imports. Die Presets enthalten die passende Palette und Kompatibilitätsstile; zusätzliche Sass-Konfiguration ist nicht nötig.

```css
@import '@rdlabo/ionic-theme-ios26/styles/class.css' supports(not (overflow-anchor: auto));
@import '@rdlabo/ionic-theme-ios27/styles/class.css' supports(overflow-anchor: auto);
@import '@rdlabo/ionic-theme-ios27/dist/css/vertical-bars.css' supports(not (overflow-anchor: auto));
@import '@rdlabo/ionic-theme-md3/styles/theme.css';
```

CSS wählt standardmäßig iOS 26 und bei Unterstützung für `overflow-anchor: auto` iOS 27. Der Material-Design-Modus nutzt MD3. Beide iOS-Stile verwenden dasselbe `ios27ThemeConfig` einschließlich nativer Übergangssynchronisierung. Übergeben Sie das Plattform-Preset an Ihre vorhandene Ionic-Initialisierung:

Wählen Sie das Beispiel für Ihr Framework und ersetzen Sie die vorhandene Ionic-Initialisierung. Initialisieren Sie Ionic nur einmal.

### Angular / Ionic 9

Übergeben Sie das Preset im vorhandenen App-Setup an den Ionic-Provider. Behalten Sie andere Provider einschließlich Router und HTTP bei.

```ts:src/app/app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideIonicAngular } from '@ionic/angular';
import { Capacitor } from '@capacitor/core';
import { ios27ThemeConfig } from '@rdlabo/ionic-theme-ios27';
import { md3ThemeConfig } from '@rdlabo/ionic-theme-md3';

const ionicConfig = Capacitor.getPlatform() === 'ios' ? ios27ThemeConfig : md3ThemeConfig;

export const appConfig: ApplicationConfig = {
  providers: [provideIonicAngular(ionicConfig)],
};
```

### React

Führen Sie dies im bestehenden Einstiegspunkt vor dem Rendern der Root-Komponente aus. Behalten Sie React-Root, Routen und CSS-Imports bei.

```ts:src/main.tsx
import { setupIonicReact } from '@ionic/react';
import { Capacitor } from '@capacitor/core';
import { ios27ThemeConfig } from '@rdlabo/ionic-theme-ios27';
import { md3ThemeConfig } from '@rdlabo/ionic-theme-md3';

const ionicConfig = Capacitor.getPlatform() === 'ios' ? ios27ThemeConfig : md3ThemeConfig;

setupIonicReact(ionicConfig);
```

### Vue

Übergeben Sie das Preset im vorhandenen Einstiegspunkt bei der Registrierung von IonicVue vor dem Mounten. Behalten Sie Router und andere Plugins zwischen Erzeugung und Mounten bei.

```ts:src/main.ts
import { createApp } from 'vue';
import { IonicVue } from '@ionic/vue';
import { Capacitor } from '@capacitor/core';
import { ios27ThemeConfig } from '@rdlabo/ionic-theme-ios27';
import { md3ThemeConfig } from '@rdlabo/ionic-theme-md3';
import App from './App.vue';

const ionicConfig = Capacitor.getPlatform() === 'ios' ? ios27ThemeConfig : md3ThemeConfig;

const app = createApp(App);
app.use(IonicVue, ionicConfig);
app.mount('#app');
```

## 3. Nach dem Rendern der App-Shell starten

Erstellen Sie src/native-ui.ts mit diesem gemeinsamen Start. Wiederholte Aufrufe liefern dasselbe Promise, damit ein erneut ausgeführter React-Effekt den Erscheinungscontroller nicht doppelt startet. Rufen Sie es nach dem Shell-Rendering mit dem passenden Framework-Beispiel auf.

```ts:src/native-ui.ts
import { Capacitor } from '@capacitor/core';
import { enableNativeUI, getDynamicColorScheme, addDynamicColorListener } from '@rdlabo/capacitor-native-ui';
import { Foldable } from '@erkamyaman/capacitor-foldable';
import { resolveVerticalBarsLayout } from '@rdlabo/capacitor-native-ui/integration';
import { setVerticalBarsLayout } from '@rdlabo/ionic-theme-ios27';
import { enableDynamicColors } from '@rdlabo/ionic-theme-md3/dynamic-colors';

let startup: Promise<void> | undefined;

export function startNativeUI(): Promise<void> {
  return (startup ??= connectNativeUI());
}

async function connectNativeUI(): Promise<void> {
  await enableDynamicColors({
    getScheme: getDynamicColorScheme,
    listen: addDynamicColorListener,
  });

  if (Capacitor.getPlatform() === 'ios') {
    await enableNativeUI();

    const updateLayout = async () => {
      setVerticalBarsLayout(await resolveVerticalBarsLayout(Foldable));
    };

    void Foldable.addListener('layoutChange', () => void updateLayout().catch(console.error))
      .then(updateLayout)
      .catch(console.error);
  }
}
```

### Angular

Ergänzen Sie Import und afterNextRender in der bestehenden Root-Komponente. Die minimale Shell zeigt die Position; behalten Sie Imports, Template, Menü und Router bei.

```ts:src/app/app.component.ts
import { Component, afterNextRender } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular';
import { startNativeUI } from '../native-ui';

@Component({
  selector: 'app-root',
  imports: [IonApp, IonRouterOutlet],
  template: '<ion-app><ion-router-outlet /></ion-app>',
})
export class AppComponent {
  constructor() {
    afterNextRender(() => {
      void startNativeUI().catch(console.error);
    });
  }
}
```

### React

Ergänzen Sie Import und Effekt in der vorhandenen App-Komponente. Ihre JSX-Routen und Seiten bleiben innerhalb von IonApp.

```tsx:src/App.tsx
import { useEffect } from 'react';
import { IonApp } from '@ionic/react';
import { startNativeUI } from './native-ui';

export default function App() {
  useEffect(() => {
    void startNativeUI().catch(console.error);
  }, []);

  return <IonApp>{/* Keep your existing router and pages here. */}</IonApp>;
}
```

### Vue

Ergänzen Sie Import und onMounted im bestehenden App.vue-Skript. Template, Routen und Menü bleiben erhalten.

```vue:src/App.vue
<script setup lang="ts">
import { onMounted } from 'vue';
import { IonApp, IonRouterOutlet } from '@ionic/vue';
import { startNativeUI } from './native-ui';

onMounted(() => {
  void startNativeUI().catch(console.error);
});
</script>

<template>
  <ion-app><ion-router-outlet /></ion-app>
</template>
```

## 4. Erstellen, synchronisieren und ausführen

Erstellen Sie den Web-Build und führen Sie nur die Befehle der gewählten Plattform aus. Bauen und starten Sie das Projekt in Xcode oder Android Studio. Beide Gruppen sind nur bei zwei Zielplattformen nötig.

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

## Das Ergebnis auf jeder Plattform prüfen

Prüfen Sie nur die Zeilen der gewählten Plattformen. Nicht verfügbare Funktionen sind mit funktionierendem Fallback abgeschlossen; ein weiteres OS oder ein Rail-Gerät ist nicht erforderlich.

| Ziel                   | Prüfung                                                                   | Fertig, wenn                                                                                                                                        |
| ---------------------- | ------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| Alle                   | Seiten öffnen, navigieren und Hell/Dunkel wechseln.                       | Routen, Aktionen und lesbare Web-Elemente funktionieren.                                                                                            |
| iOS                    | Mit Xcode 26+ unter iOS 26+ starten und unterstützte Elemente betrachten. | Native Darstellung und Web-Aktion funktionieren. Diagnose siehe [Steuerelement-Anleitung](/guides/native-ui). Ältere Systeme behalten Web-Elemente. |
| Android                | Native App öffnen; ab Android 12 Gerätepalette ändern und erneut öffnen.  | MD3 nutzt verfügbare Gerätefarben; sonst bleiben Fallback-Farben und Web-Elemente bedienbar.                                                        |
| Gerät mit nativer Rail | Layout ändern und zurücksetzen.                                           | Vertical Bars folgt den Meldungen und entfernt den Platz wieder. Andere Geräte behalten das normale Layout.                                         |
| Browser                | Themes und vorhandene Aktionen ausprobieren.                              | Web-Darstellung und Verhalten funktionieren; dies belegt keine nativen Elemente, Gerätefarben oder Rails.                                           |

## Nach der Einrichtung

Nach diesen Prüfungen können Sie [das Erscheinungsbild anpassen](/guides/appearance), [native Steuerelemente konfigurieren](/guides/native-ui) oder [das Gerätelayout anpassen](/guides/device-layout). Nur für Themes folgen Sie der [iOS-26-Einrichtung](/projects/ionic-theme-ios26/docs/setup), [iOS 27](/projects/ionic-theme-ios27/docs/setup) oder [MD3](/projects/ionic-theme-md3/docs/setup).

## Einzelne Optionen

Für Native UI ohne diese Themes verwenden Sie die [Einrichtung mit vorhandenem Theme](/projects/capacitor-native-ui/docs/ionic-vertical-bars) oder die [HTML-Einrichtung](/projects/capacitor-native-ui/docs/framework-independent). Siehe [Dynamic Color](/projects/capacitor-native-ui/docs/dynamic-colors) für Darstellung und Farbzuordnung, [Konfiguration](/projects/capacitor-native-ui/docs/configuration) für Native-UI-Optionen und [Migration](/projects/capacitor-native-ui/docs/migration) für bestehende Integrationen.
