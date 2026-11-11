---
title: "Das iOS-27-Theme konfigurieren"
sourceRevision: "bf27925774e3a25244c80e7c755c8e8e8731ead247ee37c373f2458d35910492"
---

# Das iOS-27-Theme konfigurieren

Die [Einrichtungsanleitung](setup.md) verwendet ein gebündeltes Stylesheet und `ios27ThemeConfig`. Diese Anleitung beschreibt ihre Standardwerte, anwendungsspezifische Überschreibungen und die einzelnen CSS- und Animations-APIs. Bestehende Anwendungen können ihre Einrichtung mit der [optionalen Migration](migration.md#optional-simplify-the-setup) vereinfachen.

## Dunkelmodus

Wählen Sie ein Stylesheet und laden Sie es global nach Ionics CSS-Basisimporten. Jedes Stylesheet bündelt die passende Ionic-Palette, Standardvariablen des Themes, Komponentenstile, Material-Design-Kompatibilitätsstile und die dunkle Theme-Variante.

| Darstellungsstrategie | Stylesheet | Aktivierung |
| --- | --- | --- |
| System | `@rdlabo/ionic-theme-ios27/styles/system.css` | Systemdarstellung. |
| Manuell | `@rdlabo/ionic-theme-ios27/styles/class.css` | `ion-palette-dark` auf dem Dokumentwurzelelement. |
| Immer dunkel | `@rdlabo/ionic-theme-ios27/styles/always.css` | Stets aktiv. |

Bei klassenbasierter Darstellung steuert die Anwendung das Umschalten der Klasse.

```ts
document.documentElement.classList.toggle('ion-palette-dark', dark);
```

Ersetzen Sie die entsprechenden einzelnen Theme-Importe und den Import der dunklen Ionic-Palette durch das gewählte Stylesheet, damit jedes Stylesheet nur einmal geladen wird. Platzieren Sie anwendungsspezifische Überschreibungen von CSS-Variablen nach dem Stylesheet. Native Bedienelemente übernehmen die daraus resultierende Darstellungsmarkierung. Siehe [Vererbung der nativen Darstellung](https://docs.rdlabo.dev/projects/capacitor-native-ui/docs/appearance).

## Einzelne Stylesheets kombinieren

Einzelne Stylesheet-Importe bleiben unterstützt. Der systemgesteuerte Dunkelmodus verwendet beispielsweise diese Reihenfolge nach Ionics CSS-Basisimporten.

```css
@import '@ionic/core/css/palettes/dark.system.css';
@import '@rdlabo/ionic-theme-ios27/dist/css/default-variables.css';
@import '@rdlabo/ionic-theme-ios27/dist/css/ionic-theme-ios27.css';
@import '@rdlabo/ionic-theme-ios27/dist/css/md-remove-ios-class-effect.css';
@import '@rdlabo/ionic-theme-ios27/dist/css/ionic-theme-ios27-dark-system.css';
```

Kombinieren Sie Ionic-Palette und dunkle Theme-Variante nach derselben Strategie.

| Strategie | Ionic-Palette unter `@ionic/core/css/palettes/` | Theme-Variante unter `@rdlabo/ionic-theme-ios27/dist/css/` |
| --- | --- | --- |
| System | `dark.system.css` | `ionic-theme-ios27-dark-system.css` |
| Manuell | `dark.class.css` | `ionic-theme-ios27-dark-class.css` |
| Immer dunkel | `dark.always.css` | `ionic-theme-ios27-dark-always.css` |

Das Kompatibilitäts-Stylesheet verhindert, dass iOS-spezifische Utility-Klassen Material-Design-Komponenten beeinflussen. Für bedingte iOS-26/27-Stile und MD3-Kombinationen verwenden Sie die bestehende [adaptive Theme-Zusammenstellung](adaptive-themes.md).

## Standardkonfiguration und Überschreibungen

`ios27ThemeConfig` ist ein typisiertes Ionic-Konfigurationsobjekt mit `mode: 'ios'`, `iosTransitionAnimation`, `popoverEnterAnimation` und `popoverLeaveAnimation`. Übernehmen Sie es vor dem Rendern per Spread in die Ionic-Konfiguration Ihrer Anwendung. Eigenschaften nach dem Spread überschreiben die entsprechenden Konfigurationswerte, auch mit ausdrücklich gesetztem `undefined`.

```ts
import { ios27ThemeConfig } from '@rdlabo/ionic-theme-ios27';

const ionicConfig = {
  ...ios27ThemeConfig,
  animated: false, // Application preference overrides Ionic's default.
  popoverEnter: undefined, // Use Ionic's default popover enter animation.
};
```

Eine eigene Übergangsfunktion der Anwendung kann `navAnimation` nach dem Spread ersetzen. Erstellen Sie für anwendungsspezifische Optionen ein neues Konfigurationsobjekt, damit andere Nutzer der gemeinsamen Konfiguration deren Standardwerte behalten.

Übergeben Sie dieses Objekt an die bestehende Ionic-Initialisierung der Anwendung. Verwenden Sie `provideIonicAngular`, `setupIonicReact` oder `app.use(IonicVue, ionicConfig)` wie unter [Initialisierung des Frameworks](setup.md#3-pass-theme-configuration-to-ionic) beschrieben.

### Die plattformabhängige Modusauswahl beibehalten

Wenn die Anwendung den Modus bereits plattformabhängig auswählt, übernehmen Sie die Konfiguration nur für den effektiven iOS-Modus per Spread.

```ts
import { isPlatform } from '@ionic/core';
import { ios27ThemeConfig } from '@rdlabo/ionic-theme-ios27';

const ionicConfig = {
  ...(isPlatform('ios') ? ios27ThemeConfig : { mode: 'md' as const }),
  animated: false, // Optional application setting, applied on both platforms.
};
```

Behalten Sie die bisherige Strategie der Modusauswahl bei, falls sie von diesem Beispiel abweicht. Wenn Sie nach dem Spread nur `mode` ändern, bleiben die iOS-Animationseigenschaften erhalten. Wählen Sie die passende Konfiguration als Ganzes, wenn sich Modus und Animationen gemeinsam ändern sollen. Bedingungen für Browserfunktionen und die Auswahl mehrerer Themes können ihre [adaptive Konfiguration](adaptive-themes.md) beibehalten.

## Animationen einzeln verdrahten

Die einzelnen Animationsexporte bleiben für die manuelle Konfiguration verfügbar.

```ts
import { iosTransitionAnimation, popoverEnterAnimation, popoverLeaveAnimation } from '@rdlabo/ionic-theme-ios27';

const ionicConfig = {
  mode: 'ios' as const,
  navAnimation: iosTransitionAnimation,
  popoverEnter: popoverEnterAnimation,
  popoverLeave: popoverLeaveAnimation,
  // animated: false,
};
```

Der Theme-Übergang koordiniert bereits Native UI, sofern sie aktiviert ist. Anwendungen mit einem eigenen Übergang können den [Anweisungen zum Übergangsadapter](https://docs.rdlabo.dev/projects/capacitor-native-ui/docs/migration#native-ui-transition-adapter) folgen. Weitere Tab-, Segment- und Sucheffekte sind unter [Animationen](animation.md) beschrieben.
