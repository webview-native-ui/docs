---
title: "Das iOS-26-Theme einrichten"
sourceRevision: "972873bad21952ab2b7f25d58c5a1373b1507f7ac8294e99dbb24423fab1c7fd"
---

# Das iOS-26-Theme einrichten

Verwenden Sie eine bestehende Ionic-Angular-, React- oder Vue-Anwendung mit `@ionic/core >=8.8.1 <10`.

## 1. Installieren

```sh
npm install @rdlabo/ionic-theme-ios26
```

## 2. Ein Stylesheet laden

Fügen Sie diesen Import in Ihrem globalen Stylesheet nach Ionics Basisstilen hinzu.

```css
@import '@rdlabo/ionic-theme-ios26/styles/system.css';
```

Das Stylesheet liefert Theme-Variablen, Komponentenstile, Material-Design-Kompatibilitätsstile, Ionics systemgesteuerte dunkle Palette und die dazugehörigen dunklen Theme-Stile. Verwenden Sie `styles/class.css` für den manuellen Dunkelmodus über die Klasse `ion-palette-dark` auf dem Dokumentwurzelelement oder `styles/always.css` für eine stets dunkle Darstellung. Wählen Sie das Stylesheet passend zur Dunkelmodusstrategie Ihrer Anwendung und ersetzen Sie die entsprechenden bisherigen Importe des Themes und der dunklen Ionic-Palette.

## 3. Ionic konfigurieren

Übernehmen Sie `ios26ThemeConfig` vor dem Rendern per Spread in Ihre bestehende Framework-Initialisierung. Verwenden Sie das Beispiel für Ihr Framework.

Angular mit Ionic 9 importiert `provideIonicAngular` aus `@ionic/angular`. Mit Ionic 8 verwenden Sie dafür `@ionic/angular/standalone`.

```ts
import { provideIonicAngular } from '@ionic/angular';
import { ios26ThemeConfig } from '@rdlabo/ionic-theme-ios26';

// In the application's existing providers array
provideIonicAngular({
  ...ios26ThemeConfig,
  // animated: false,
});
```

Für React:

```ts
import { setupIonicReact } from '@ionic/react';
import { ios26ThemeConfig } from '@rdlabo/ionic-theme-ios26';

setupIonicReact({
  ...ios26ThemeConfig,
  // animated: false,
});
```

Verwenden Sie für Vue die bestehende Vue-App Ihrer Anwendung:

```ts
import { IonicVue } from '@ionic/vue';
import { ios26ThemeConfig } from '@rdlabo/ionic-theme-ios26';

app.use(IonicVue, {
  ...ios26ThemeConfig,
  // animated: false,
});
```

Die Konfiguration setzt `mode: 'ios'`, sodass das Theme auch in Desktopvorschauen erscheint. Fügen Sie Ihre Ionic-Optionen nach dem Spread hinzu, um Standardwerte zu überschreiben. Wählt Ihre Anwendung den Modus plattformabhängig, übernehmen Sie die Konfiguration nur im iOS-Modus per bedingtem Spread. Ein Beispiel finden Sie unter [Konfiguration](configuration.md#theme-configuration-and-customization).

## 4. Vorschau

Starten Sie den üblichen Entwicklungsserver Ihrer Anwendung und öffnen Sie eine vorhandene Seite. Fügen Sie dieses Markup innerhalb ihres `ion-content` ein und verwenden Sie dabei die Komponentensyntax Ihres Frameworks.

```html
<ion-list inset="true">
  <ion-item-group>
    <ion-item><ion-label>Notifications</ion-label></ion-item>
    <ion-item><ion-label>Appearance</ion-label></ion-item>
  </ion-item-group>
</ion-list>
```

Prüfen Sie die abgerundeten eingerückten Gruppen, navigieren Sie zwischen Seiten und prüfen Sie die gewählte Dunkelmodusstrategie. Die Listenstruktur beschreibt [ion-item-group verwenden](using-ion-item-group.md). Die [Konfiguration](configuration.md) behandelt einzelne CSS-Importe und Animationsoptionen. Die [Migration](migration.md) beschreibt die Einführung der Wrapper in einer bestehenden Anwendung sowie versionsspezifische Aktualisierungen.
