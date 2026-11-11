---
title: "Migration"
sourceRevision: "ffdf5f0b3f847737ba5f52689f4435990c3a8abab0a1c6b8a6b77e91fe560811"
---

# Migration

Prüfen Sie alle Abschnitte, die neuer als die derzeit installierte Version sind, in aufsteigender Reihenfolge. Führen Sie beispielsweise beim Wechsel von 1.x auf 9.0.0 zuerst die Migrationsschritte für 2.0.0 und 3.0.0 aus, bevor Sie 9.0.0 prüfen.

Der optionale Einrichtungsabschnitt erläutert die Einführung der Wrapper. Versionsbezogene Abschnitte dokumentieren Änderungen beim Aktualisieren und Hinweise zur Kompatibilität.


## Optional: die Einrichtung vereinfachen

Bestehende einzelne CSS-Pfade und Animationsexporte bleiben unterstützt. Sie können `ios26ThemeConfig` und ein kombiniertes Theme-Stylesheet übernehmen, wenn Sie Ihre Einrichtung vereinfachen. Neue Anwendungen können der [Einrichtungsanleitung](setup.md) folgen.

Ersetzen Sie die manuellen Importe des Themes und der dunklen Ionic-Palette durch das Stylesheet, das Ihrer bisherigen Dunkelmodusstrategie entspricht. Wenden Sie diese Änderung bei einer Anwendung mit systemgesteuertem Dunkelmodus nach Ionics CSS-Basisimporten und vor anwendungsspezifischen Überschreibungen an.

```diff
- @import '@ionic/core/css/palettes/dark.system.css';
- @import '@rdlabo/ionic-theme-ios26/dist/css/default-variables.css';
- @import '@rdlabo/ionic-theme-ios26/dist/css/ionic-theme-ios26.css';
- @import '@rdlabo/ionic-theme-ios26/dist/css/md-remove-ios-class-effect.css';
- @import '@rdlabo/ionic-theme-ios26/dist/css/ionic-theme-ios26-dark-system.css';
+ @import '@rdlabo/ionic-theme-ios26/styles/system.css';
```

Verwenden Sie für den manuellen Dunkelmodus `styles/class.css` und behalten Sie das Umschalten von `ion-palette-dark` auf dem Dokumentwurzelelement bei. Für eine stets dunkle Darstellung verwenden Sie `styles/always.css`. Das Stylesheet enthält die passende Ionic-Palette. Behalten Sie zusätzliche selektive Stile wie `md-ion-list-inset.css` entsprechend den bisherigen Anforderungen Ihrer Anwendung bei.

Ersetzen Sie die manuell zusammengestellte Konfiguration durch einen Konfigurations-Spread. Dieses Beispiel behält eine konkrete Anwendungsoption, `animated: false`, nach der Konfiguration bei.

```diff
- import { iosTransitionAnimation, popoverEnterAnimation, popoverLeaveAnimation } from '@rdlabo/ionic-theme-ios26';
+ import { ios26ThemeConfig } from '@rdlabo/ionic-theme-ios26';

 const ionicConfig = {
-   mode: 'ios',
-   navAnimation: iosTransitionAnimation,
-   popoverEnter: popoverEnterAnimation,
-   popoverLeave: popoverLeaveAnimation,
+   ...ios26ThemeConfig,
   animated: false,
 };
```

Übergeben Sie das Objekt an denselben Aufruf von `provideIonicAngular`, `setupIonicReact` oder `app.use(IonicVue, ...)`, den Ihre Anwendung bereits verwendet. Eigenschaften nach dem Spread haben Vorrang vor der Konfiguration, einschließlich eigener Animationen und ausdrücklich übergebener `undefined`-Werte. Behalten Sie Ihre eigenen Optionen nach dem Spread bei.

Die Konfiguration setzt `mode: 'ios'` und enthält iOS-Animationen. Bewahren Sie eine plattformabhängige Modusstrategie, indem Sie die Konfiguration nur für den effektiven iOS-Modus per bedingtem Spread übernehmen. Dieses Beispiel behält die bisherige Plattformauswahl der Anwendung bei.

```diff
 import { isPlatform, type IonicConfig } from '@ionic/core';
- import { iosTransitionAnimation, popoverEnterAnimation, popoverLeaveAnimation } from '@rdlabo/ionic-theme-ios26';
+ import { ios26ThemeConfig } from '@rdlabo/ionic-theme-ios26';

 const mode = isPlatform('ios') ? 'ios' : 'md';
 const ionicConfig: IonicConfig = {
-   ...(mode === 'ios'
-     ? { navAnimation: iosTransitionAnimation, popoverEnter: popoverEnterAnimation, popoverLeave: popoverLeaveAnimation }
-     : {}),
+   ...(mode === 'ios' ? ios26ThemeConfig : {}),
   mode,
 };
```

Wenn Sie `mode` nach einem bedingungslosen Konfigurations-Spread ändern, bleiben dessen Animationsfunktionen erhalten. Wählen Sie Konfiguration und Modus gemeinsam vor der Ionic-Initialisierung aus. Behalten Sie bei der Auswahl des kombinierten Theme-Stylesheets Ihre bisherige Dunkelmodusstrategie bei. Einzelne CSS- und Animationsoptionen sowie Rezepte mit mehreren Themes beschreibt die [Konfiguration](configuration.md).

## Migration auf 9.2.0

### Versionsunabhängige Theme-Namen

Die Klasse zum Deaktivieren des Themes und die CSS-Variablen wurden umbenannt, um die Betriebssystemversion aus ihren öffentlichen Namen zu entfernen. Die alten Namen sind veraltet. Verwenden Sie in neuem Code die neuen Namen und migrieren Sie bestehende Anpassungen bei Gelegenheit.

| Veralteter Name | Neuer Name |
| --- | --- |
| `ios26-disabled` | `ios-theme-disabled` |
| `--ios26-content-box-shadow-rgb` | `--ios-theme-content-box-shadow-rgb` |
| `--ios26-*` (weitere Theme-Variablen) | `--ios-theme-*` (gleiches Suffix) |

```diff
- <ion-button class="ios26-disabled">Standard Ionic button</ion-button>
+ <ion-button class="ios-theme-disabled">Standard Ionic button</ion-button>
```

```diff
ion-content {
-  --ios26-content-box-shadow-rgb: 255, 255, 255;
+  --ios-theme-content-box-shadow-rgb: 255, 255, 255;
}
```

`ios26-disabled` bleibt als Alias unterstützt. Alte CSS-Variablen bleiben als Rückfalloptionen unterstützt; sind beide gesetzt, hat die neue Variable Vorrang. Bestehende Anwendungen können deshalb während der Migration die veralteten Namen weiterverwenden. Paketnamen und Stylesheet-Pfade bleiben unverändert.

## Migration auf 9.0.0

Version 9 gleicht die Hauptversion des Themes an Ionic Framework 9 an. Sie führt keine zusätzlichen inkompatiblen Änderungen über die in früheren Migrationsabschnitten beschriebenen hinaus ein.

Ionic 8 und Ionic 9 bleiben beide unterstützt. Version 9 benötigt `@ionic/core >=8.8.1 <10`.

## Migration auf 3.0.0

### `.header-item-group` in `.item-group-header` umbenennen

Die Klasse für eine als Abschnittsüberschrift verwendete `ion-item-group` wurde umbenannt, um mit dem von ihr angepassten Element übereinzustimmen. Ersetzen Sie jedes Vorkommen von `.header-item-group` in Anwendungstemplates und Styles.

```diff
- <ion-item-group class="header-item-group">
+ <ion-item-group class="item-group-header">
    ...
  </ion-item-group>
```

Die alte Klasse wird vom Theme nicht mehr gestaltet. Diese Umbenennung gilt auch für Markup, das gemeinsam mit `@rdlabo/ionic-theme-md3` verwendet wird.

## Migration auf 2.0.0

### `iosTransitionAnimation` konfigurieren

Version 2 benötigt den Navigationsübergang des Pakets. Er folgt dem standardmäßigen Ionic-iOS-Übergang ohne das überholte Verhalten von `animateBackButton()`, das einen großen Titel in die Beschriftung der Zurück-Schaltfläche animierte.

```ts
import { isPlatform } from '@ionic/core'; // Oder @ionic/angular/standalone, @ionic/react, @ionic/vue
import { iosTransitionAnimation } from '@rdlabo/ionic-theme-ios26';

// Angular
provideIonicAngular({
  // ...
  navAnimation: isPlatform('ios') ? iosTransitionAnimation : undefined,
});

// React
setupIonicReact({
  // ...
  navAnimation: isPlatform('ios') ? iosTransitionAnimation : undefined,
});

// Vue
createApp(App).use(IonicVue, {
  // ...
  navAnimation: isPlatform('ios') ? iosTransitionAnimation : undefined,
});
```

Mit diesem konfigurierten Übergang lässt sich `<ion-buttons><ion-back-button></ion-back-button></ion-buttons>` ohne die unerwünschten Übergangseffekte der alten Animation verwenden.

## Migration auf 1.0.0

### SCSS-Importpfade aktualisieren

Die Quelldateien wurden nach `src/styles` verschoben, als JavaScript-Dateien zum Paket hinzukamen.

```diff
- @import '@rdlabo/ionic-theme-ios26/src/default-variables.scss';
+ @import '@rdlabo/ionic-theme-ios26/src/styles/default-variables.scss';
```

Die Pfade des erzeugten CSS unter `dist` änderten sich nicht.

### `--ios26-color-background-rgb` umbenennen

```diff
  :root {
-   --ios26-color-background-rgb: 255, 255, 255;
+   --ios26-content-box-shadow-rgb: 255, 255, 255;
  }
```

### Helligkeitsvariablen umbenennen

Ersetzen Sie jede Variable `--ion-color-*-brightness-rgb` durch `--ion-color-*-brightness` und verwenden Sie einen Farbwert statt einer Liste von RGB-Kanälen.

```diff
  :root {
-   --ion-color-primary-brightness-rgb: 130, 255, 255;
+   --ion-color-primary-brightness: #96feff;
  }
```
