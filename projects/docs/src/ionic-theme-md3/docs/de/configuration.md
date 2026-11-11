---
title: "Theme-Konfiguration"
sourceRevision: "2d57f4924684edd7bb61d1d6a98d9a46dc779f6cbc984b04dc663b35a0ec7b52"
---

# Theme-Konfiguration

Die [Einrichtungsanleitung](setup.md) verwendet das kombinierte MD3-Theme-Stylesheet und `md3ThemeConfig`. Die einzelnen Stylesheets und Animationsexporte ermöglichen eine eigene Zusammenstellung.

## Einzelne Stylesheets laden

Platzieren Sie diese Importe nach Ionics Core-CSS und der gewählten dunklen Ionic-Palette:

```css
@import '@rdlabo/ionic-theme-md3/dist/css/default-variables.css';
@import '@rdlabo/ionic-theme-md3/dist/css/ionic-theme-md3.css';
```

Diese beiden Dateien bilden `styles/theme.css`. Verwenden Sie entweder das Theme-Stylesheet oder die einzelnen Importe. Platzieren Sie anwendungsspezifische CSS-Überschreibungen nach dem Theme.

Ionic ist für die Auswahl der dunklen Palette zuständig. Wählen Sie je nach Darstellungsstrategie Ihrer App `dark.system.css`, `dark.class.css` oder `dark.always.css` aus `@ionic/core/css/palettes/`. [Dynamic Colors](dynamic-colors.md) verwaltet `ion-palette-dark` und verwendet `dark.class.css`.

## Animationen direkt konfigurieren

Verwenden Sie den MD3-Übergang für Ionics Material-Design-Modus in Ihrer bestehenden Initialisierung:

```ts
import { isPlatform } from '@ionic/core';
import { mdTransitionAnimation } from '@rdlabo/ionic-theme-md3';

const ionicConfig = {
  navAnimation: isPlatform('ios') ? undefined : mdTransitionAnimation,
};
```

Übergeben Sie dieses Objekt an Angulars `provideIonicAngular(ionicConfig)`, Reacts `setupIonicReact(ionicConfig)` oder Vues `app.use(IonicVue, ionicConfig)`. Angular importiert `provideIonicAngular` in Ionic 9 aus `@ionic/angular` und in Ionic 8 aus `@ionic/angular/standalone`. React importiert `setupIonicReact` aus `@ionic/react`, Vue importiert `IonicVue` aus `@ionic/vue`.

Die [kombinierte Theme-Konfiguration](#use-md3-and-ios-27-together) zeigt plattformabhängige Übergänge bei gemeinsam installierten Themes.

## Die vorhandene Modusauswahl beibehalten

`md3ThemeConfig` enthält sowohl `mode: 'md'` als auch den MD3-Übergang. Wählen Sie seine Konfiguration, wenn die Anwendung den Material-Design-Modus auswählt:

```ts
import { isPlatform } from '@ionic/core';
import { md3ThemeConfig } from '@rdlabo/ionic-theme-md3';

const ionicConfig = {
  ...(isPlatform('ios') ? { mode: 'ios' as const } : md3ThemeConfig),
  // animated: false,
};
```

Der iOS-Zweig verwendet Ionics normale iOS-Darstellung und -Animationen. Optionen nach dem Spread überschreiben die gewählten Standardwerte, auch ein ausdrücklich gesetztes `navAnimation: undefined` für Ionics Standardübergang. Ein Vorher-Nachher-Beispiel finden Sie unter [Migration](migration.md#optional-simplify-the-setup).

## MD3 und iOS 27 gemeinsam verwenden

Installieren Sie das iOS-27-Theme, um beide Ionic-Modi in derselben Anwendung zu gestalten.

Die aktuellen Versionen beider Themes erfordern `@ionic/core` ab 8.8.1. Aktualisieren Sie Ionic vor der Verwendung dieser Konfiguration, wenn Ihre Anwendung 8.8.0 oder eine ältere Version verwendet.

```bash
npm install @rdlabo/ionic-theme-ios27
```

Wenn Ihr globales Stylesheet Sass verwendet, initialisieren Sie die Themes in dieser Reihenfolge:

```scss
@use '@rdlabo/ionic-theme-ios27/src/styles/default-variables.scss' as ios27-vars;
@use '@rdlabo/ionic-theme-ios27/src/styles/ionic-theme-ios27.scss';
@use '@rdlabo/ionic-theme-ios27/src/styles/ionic-theme-ios27-dark-class.scss';
@use '@rdlabo/ionic-theme-ios27/src/styles/md-remove-ios-class-effect.scss';
@use '@rdlabo/ionic-theme-md3/dist/css/default-variables.css' as md3-vars;
@use '@rdlabo/ionic-theme-md3/dist/css/ionic-theme-md3.css';
```

Das Beispiel verwendet Ionics klassenbasierten Dunkelmodus. Ihr globales Stylesheet muss außerdem die passende dunkle Ionic-Palette laden, etwa `@ionic/angular/css/palettes/dark.class.css` für Angular. Wählen Sie bei `dark-system` oder `dark-always` dieselbe Variante für die Ionic-Palette und das iOS-27-Theme. Siehe Ionics [Dokumentation zum Dunkelmodus](https://ionicframework.com/docs/theming/dark-mode). Die ausdrücklichen Namensräume `ios27-vars` und `md3-vars` verhindern, dass die beiden Variablenmodule denselben Standardnamensraum verwenden.

Konfigurieren Sie beide Übergangsimplementierungen, wenn beide Themes installiert sind:

```ts
import { isPlatform } from '@ionic/core';
import { iosTransitionAnimation, popoverEnterAnimation, popoverLeaveAnimation } from '@rdlabo/ionic-theme-ios27';
import { mdTransitionAnimation } from '@rdlabo/ionic-theme-md3';

const ios = isPlatform('ios');
const ionicConfig = {
  // Add application options here.
  navAnimation: ios ? iosTransitionAnimation : mdTransitionAnimation,
  popoverEnter: ios ? popoverEnterAnimation : undefined,
  popoverLeave: ios ? popoverLeaveAnimation : undefined,
};
```

Übergeben Sie dieses Objekt an Ihre bestehende Framework-Initialisierung mit den unter [Animationen direkt konfigurieren](#configure-animations-directly) beschriebenen Importen.

Die exportierten Theme-Konfigurationsobjekte können auch beide Modi auswählen:

```ts
import { isPlatform } from '@ionic/core';
import { ios27ThemeConfig } from '@rdlabo/ionic-theme-ios27';
import { md3ThemeConfig } from '@rdlabo/ionic-theme-md3';

const ionicConfig = {
  ...(isPlatform('ios') ? ios27ThemeConfig : md3ThemeConfig),
  // animated: false,
};
```
