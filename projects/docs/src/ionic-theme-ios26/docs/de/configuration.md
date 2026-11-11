---
title: "Das iOS-26-Theme konfigurieren"
sourceRevision: "36061e46f2985d65dcea4943c29d94916962f784c7c91f1a11fd8bba6e2ba08d"
---

# Das iOS-26-Theme konfigurieren

Verwenden Sie diese einzelnen Stylesheets und Animationsexporte, wenn Sie das Theme anpassen. Für einen kurzen Einstieg folgen Sie der [Einrichtungsanleitung](setup.md).

## Stile einzeln laden

Behalten Sie Ionics Basisstile an erster Stelle und laden Sie Ionic-Palette und Theme-Dateien anschließend in dieser Reihenfolge. Dieses Beispiel folgt der dunklen Systemdarstellung.

```css
@import '@ionic/core/css/palettes/dark.system.css';
@import '@rdlabo/ionic-theme-ios26/dist/css/default-variables.css';
@import '@rdlabo/ionic-theme-ios26/dist/css/ionic-theme-ios26.css';
@import '@rdlabo/ionic-theme-ios26/dist/css/md-remove-ios-class-effect.css';
@import '@rdlabo/ionic-theme-ios26/dist/css/ionic-theme-ios26-dark-system.css';
```

`md-remove-ios-class-effect.css` behandelt iOS-spezifische Utility-Klassen, wenn die Anwendung den Material-Design-Modus verwendet. Laden Sie anwendungsspezifische Überschreibungen nach diesen Importen. Für das Design eingerückter gruppierter Listen unter Android fügen Sie optional `@rdlabo/ionic-theme-ios26/dist/css/md-ion-list-inset.css` hinzu. MD3 enthält diese Listenstile bereits.

Kombinieren Sie eine Ionic-Palette mit der passenden Theme-Variante.

| Strategie | Ionic-Palette unter `@ionic/core/css/palettes/` | Theme unter `dist/css/` | Kombiniertes Stylesheet |
| --- | --- | --- | --- |
| System | `dark.system.css` | `ionic-theme-ios26-dark-system.css` | `styles/system.css` |
| Manuell | `dark.class.css` | `ionic-theme-ios26-dark-class.css` | `styles/class.css` |
| Immer dunkel | `dark.always.css` | `ionic-theme-ios26-dark-always.css` | `styles/always.css` |

Der manuelle Dunkelmodus verwendet `ion-palette-dark` auf `document.documentElement`. Jedes kombinierte Stylesheet enthält die passende Ionic-Palette und alle fünf oben gezeigten Importe. Ersetzen Sie die entsprechenden einzelnen Importe, wenn Sie ein kombiniertes Stylesheet einführen.

## Animationen einzeln konfigurieren

Bestimmen Sie den Modus der Anwendung vor der Ionic-Initialisierung und stellen Sie die Animationen für diesen Modus bereit. Dieses Beispiel behält auf anderen Plattformen den Material-Design-Modus bei.

```ts
import { isPlatform, type IonicConfig } from '@ionic/core';
import { iosTransitionAnimation, popoverEnterAnimation, popoverLeaveAnimation } from '@rdlabo/ionic-theme-ios26';

const mode = isPlatform('ios') ? 'ios' : 'md';
const ionicConfig: IonicConfig = {
  ...(mode === 'ios'
    ? { navAnimation: iosTransitionAnimation, popoverEnter: popoverEnterAnimation, popoverLeave: popoverLeaveAnimation }
    : {}),
  mode,
  // animated: false,
};
```

Ergänzen Sie dieses Objekt um anwendungsspezifische Ionic-Optionen. Übergeben Sie `ionicConfig` an die bestehende Initialisierung Ihres Frameworks.

| Framework | Initialisierung | Import |
| --- | --- | --- |
| Angular / Ionic 9 | `provideIonicAngular(ionicConfig)` | `@ionic/angular` |
| Angular / Ionic 8 | `provideIonicAngular(ionicConfig)` | `@ionic/angular/standalone` |
| React | `setupIonicReact(ionicConfig)` | `@ionic/react` |
| Vue | `app.use(IonicVue, ionicConfig)` | `@ionic/vue` |

## Theme-Konfiguration und Anpassung

`ios26ThemeConfig` ist ein typisiertes Ionic-Konfigurationsobjekt mit `mode: 'ios'` sowie den iOS-Navigations- und Popover-Animationen. Übernehmen Sie es per Spread in Ihre Ionic-Optionen und ergänzen Sie anschließend Überschreibungen.

```ts
import { ios26ThemeConfig } from '@rdlabo/ionic-theme-ios26';

const ionicConfig = {
  ...ios26ThemeConfig,
  // animated: false,
};
```

Eigenschaften nach dem Spread haben Vorrang, auch eigene Funktionen für `navAnimation`, `popoverEnter` und `popoverLeave`. Eine ausdrücklich mit `undefined` gesetzte Eigenschaft überschreibt den Konfigurationswert ebenfalls gemäß der üblichen JavaScript-Semantik für Objekt-Spreads. Das Objekt liest keine Browser-Globals und kann in einer serverseitig gerenderten App importiert werden.

Bei plattformabhängiger Modusauswahl übernehmen Sie die Konfiguration nur dann per Spread, wenn der effektive Modus iOS ist. Wenn Sie nur `mode` ändern, bleiben die per Spread übernommenen Animationsfunktionen erhalten. Wählen Sie daher Konfiguration und Modus gemeinsam vor der Ionic-Initialisierung.

```ts
import { isPlatform, type IonicConfig } from '@ionic/core';
import { ios26ThemeConfig } from '@rdlabo/ionic-theme-ios26';

const mode = isPlatform('ios') ? 'ios' : 'md';
const ionicConfig: IonicConfig = {
  ...(mode === 'ios' ? ios26ThemeConfig : {}),
  mode,
  // animated: false,
};
```

Zum Ersetzen einer bestehenden manuellen Einrichtung siehe [Optionale Einführung der Wrapper](migration.md#optional-simplify-the-setup).

## Optional: die iOS-26- und MD3-Themes gemeinsam verwenden

Installieren Sie MD3, um beide Ionic-Modi in derselben Anwendung zu gestalten. Beide Themes benötigen `@ionic/core` ab 8.8.1.

```sh
npm install @rdlabo/ionic-theme-ios26 @rdlabo/ionic-theme-md3
```

Wenn das globale Stylesheet Sass verwendet, laden Sie die Themes in dieser Reihenfolge. Dieses Beispiel verwendet den klassenbasierten Dunkelmodus. Wählen Sie für die Systemdarstellung oder stets dunkle Darstellung die passende Variante sowohl für die Ionic-Palette als auch für das iOS-26-Theme.

```scss
@use '@ionic/core/css/palettes/dark.class.css';
@use '@rdlabo/ionic-theme-ios26/src/styles/default-variables.scss' as ios26-vars;
@use '@rdlabo/ionic-theme-ios26/src/styles/ionic-theme-ios26.scss';
@use '@rdlabo/ionic-theme-ios26/src/styles/ionic-theme-ios26-dark-class.scss';
@use '@rdlabo/ionic-theme-ios26/src/styles/md-remove-ios-class-effect.scss';
@use '@rdlabo/ionic-theme-md3/dist/css/default-variables.css' as md3-vars;
@use '@rdlabo/ionic-theme-md3/dist/css/ionic-theme-md3.css';
```

Die ausdrücklichen Namensräume `ios26-vars` und `md3-vars` verhindern, dass die Variablenmodule denselben Standardnamensraum verwenden. MD3 liefert die Stile für eingerückte Listen. Konfigurieren Sie die passenden Übergänge vor der Ionic-Initialisierung.

```ts
import { isPlatform, type IonicConfig } from '@ionic/core';
import { iosTransitionAnimation, popoverEnterAnimation, popoverLeaveAnimation } from '@rdlabo/ionic-theme-ios26';
import { mdTransitionAnimation } from '@rdlabo/ionic-theme-md3';

const mode = isPlatform('ios') ? 'ios' : 'md';
const ios = mode === 'ios';
const ionicConfig: IonicConfig = {
  navAnimation: ios ? iosTransitionAnimation : mdTransitionAnimation,
  popoverEnter: ios ? popoverEnterAnimation : undefined,
  popoverLeave: ios ? popoverLeaveAnimation : undefined,
  mode,
  // animated: false,
};
```

Übergeben Sie dieses Objekt anhand der obigen Tabelle an die Initialisierung Ihres Frameworks.
