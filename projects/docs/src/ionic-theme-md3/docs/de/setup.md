---
title: "Das MD3-Theme einrichten"
sourceRevision: "5f726b394cc1721628b2f84d869bd1bb63654ca1599e26a8c8daf82d68a0ff3b"
---

# Das MD3-Theme einrichten

Verwenden Sie eine bestehende Ionic-Angular-, React- oder Vue-App mit Ionic `>=8.8.0 <10`.

## Das Theme installieren

```sh
npm install @rdlabo/ionic-theme-md3
```

## Das Theme-Stylesheet laden

Fügen Sie Ihrem globalen Stylesheet nach Ionics CSS-Basisimporten und der gewählten dunklen Ionic-Palette einen Import hinzu:

```css
@import '@rdlabo/ionic-theme-md3/styles/theme.css';
```

Dieses Stylesheet kombiniert die Standardvariablen und MD3-Komponentenstile. Ersetzen Sie bei der Einführung in eine bestehende App die einzelnen MD3-Stylesheet-Importe. Behalten Sie den gewählten Import der dunklen Ionic-Palette bei, etwa `@ionic/core/css/palettes/dark.system.css`, und fügen Sie anwendungsspezifische Überschreibungen nach dem Theme-Stylesheet ein. MD3 verwendet ein Theme-Stylesheet für alle Darstellungsmodi. Wählen Sie für [Dynamic Colors](dynamic-colors.md) Ionics Palette `dark.class.css`.

## Ionic konfigurieren

Übernehmen Sie `md3ThemeConfig` vor dem Rendern von Komponenten per Spread in die Optionen der Ionic-Initialisierung, die Ihre App bereits aufruft. Wählen Sie das Beispiel für Ihr Framework.

### Angular

```ts
import { provideIonicAngular } from '@ionic/angular'; // Ionic 9
// Ionic 8: import { provideIonicAngular } from '@ionic/angular/standalone';
import { md3ThemeConfig } from '@rdlabo/ionic-theme-md3';

provideIonicAngular({
  ...md3ThemeConfig,
  // animated: false,
});
```

### React

```ts
import { setupIonicReact } from '@ionic/react';
import { md3ThemeConfig } from '@rdlabo/ionic-theme-md3';

setupIonicReact({
  ...md3ThemeConfig,
  // animated: false,
});
```

### Vue

```ts
import { IonicVue } from '@ionic/vue';
import { md3ThemeConfig } from '@rdlabo/ionic-theme-md3';

app.use(IonicVue, {
  ...md3ThemeConfig,
  // animated: false,
});
```

Die Konfiguration setzt `mode: 'md'` und den MD3-Seitenübergang. Fügen Sie anwendungsspezifische Optionen nach dem Spread hinzu, um diese Standardwerte zu überschreiben. Wählen Sie für eine plattformabhängige Darstellung die zum Modus passende Konfiguration wie unter [Konfiguration](configuration.md#preserve-existing-mode-selection) beschrieben. Das exportierte Objekt unterstützt Importe beim serverseitigen Rendern.

## Einen Bildschirm ansehen

Starten Sie den üblichen Entwicklungsserver Ihrer App. Öffnen Sie eine Seite mit diesem Markup und verwenden Sie die Komponentensyntax Ihres Frameworks:

```html
<ion-list inset="true">
  <ion-item-group>
    <ion-item><ion-label>Notifications</ion-label></ion-item>
    <ion-item><ion-label>Appearance</ion-label></ion-item>
  </ion-item-group>
</ion-list>
```

Prüfen Sie die gruppierte Liste, navigieren Sie zwischen Seiten und wechseln Sie die Gerätedarstellung anhand Ihrer gewählten Strategie für die dunkle Ionic-Palette. Die erwartete gruppierte Struktur beschreibt [Listenstruktur](using-ion-item-group.md); einzelne Stylesheets, Animationen und eine bestehende plattformabhängige Modusauswahl behandelt die [Konfiguration](configuration.md).
