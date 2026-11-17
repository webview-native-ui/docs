---
title: "Erste Schritte"
sourceRevision: 'a2a9e9c5d1e966ad521c387f28322fdb72f3d4334765d19b9105c2ea122bb935'
---

Installieren Sie das Paket mit `npm install @rdlabo/ionic-theme-ios27`. Für 1.x verwenden Sie die [Anleitung für v1.2.1](https://github.com/webview-native-ui/ionic-theme-ios27/tree/ios27-v1.2.1).
Ein Theme für Ionic-Anwendungen, das iOS 27 Liquid Glass und dessen Bewegungseffekte ins Web bringt. Capacitor-Anwendungen für iOS können zusätzlich Native UI für unterstützte Bedienelemente aktivieren; sie wird ab Version 2.0.0 offiziell unterstützt.

**[Ionic-9-Demo](https://ionic-theme-ios27.rdlabo.dev/) · [Einrichtungsanleitung](/docs/setup)**

<!-- rdlabo-docs-pick -->

<p>
  <img src="https://raw.githubusercontent.com/webview-native-ui/ionic-theme-ios27/c70beb9d1e5b39de696b2b2c47a3d9bc5ffcdfbe/screenshots/ios27-settings.png" width="32%" alt="iOS-27-Theme: Einstellungen im hellen Modus mit einer Liquid Glass-Suchleiste" />
  <img src="https://raw.githubusercontent.com/webview-native-ui/ionic-theme-ios27/c70beb9d1e5b39de696b2b2c47a3d9bc5ffcdfbe/screenshots/ios27-settings-dark.png" width="32%" alt="iOS-27-Theme: Einstellungen im dunklen Modus" />
  <img src="https://raw.githubusercontent.com/webview-native-ui/ionic-theme-ios27/c70beb9d1e5b39de696b2b2c47a3d9bc5ffcdfbe/screenshots/ios27-library.png" width="32%" alt="iOS-27-Theme: Bibliothek mit Liquid Glass-Schaltflächen und Tab-Leiste" />
</p>

<!-- /rdlabo-docs-pick -->

## Was möchten Sie tun?

| Ziel | Anleitung |
| --- | --- |
| Eine bestehende Ionic-App gestalten | [Erste Schritte](https://docs.rdlabo.dev/projects/ionic-theme-ios27/docs/setup) |
| iOS-26/27-Stile und optional MD3 auswählen | [Adaptive Themes](https://docs.rdlabo.dev/projects/ionic-theme-ios27/docs/adaptive-themes) |
| Native iOS-Steuerelemente zu einer Capacitor-App hinzufügen | [Native UI hinzufügen](https://docs.rdlabo.dev/projects/ionic-theme-ios27/docs/add-native-ui) |
| Ionic um eine Seitenleiste ergänzen und das eigene Theme behalten | [Vertical Bars Schritt für Schritt](https://docs.rdlabo.dev/projects/capacitor-native-ui/docs/ionic-vertical-bars) |
| Optional: Theme und Native UI mit Cordova nutzen | [Cordova einrichten](/docs/cordova) |
| Stile, Dunkelmodus und Animationen einzeln konfigurieren | [Konfiguration](/docs/configuration) |
| Eine bestehende Installation aktualisieren | [Migration](https://docs.rdlabo.dev/projects/ionic-theme-ios27/docs/migration) |

## Erste Schritte

Beginnen Sie in einer bestehenden Ionic-9-App mit dem eigenständigen Theme. Im Browser sind dafür weder ein natives Capacitor-Projekt noch Native-UI-Start erforderlich. Für Cordova nutzen Sie die optionale [Cordova-Anleitung](/docs/cordova) mit dem mitgelieferten Theme und hostspezifischen Start.

Ergänzen Sie [Capacitor Foldable](https://github.com/erkamyaman/capacitor-foldable), das Community-Plugin von Erkam Yaman, nur für geräteabhängiges Layout nach der [Layout-Anleitung](https://webview-native-ui.com/projects/ionic-theme-ios27/docs/vertical-bars-layout). Es meldet Position, Haltung und Änderungen; das Theme liefert Web-Layout und separat aktiviertes Native UI projiziert Steuerelemente. Installation und Ereignisanbindung sind optional und keine Voraussetzung für das Theme.

Installieren Sie das Theme, fügen Sie ein globales Theme-Stylesheet nach Ionics CSS-Basisimporten hinzu und übergeben Sie die Theme-Konfiguration an Ihre bestehende Ionic-Initialisierung. Beispiele für Angular, React und Vue finden Sie in der [Einrichtungsanleitung](https://docs.rdlabo.dev/projects/ionic-theme-ios27/docs/setup).

```sh
npm install @rdlabo/ionic-theme-ios27
```

```diff:src/global.css
@@
 @import '@ionic/core/css/core.css';
 @import '@ionic/core/css/structure.css';
- @import '@ionic/core/css/palettes/dark.system.css';
+ @import '@rdlabo/ionic-theme-ios27/styles/system.css';

 :root { --app-content-width: 72rem; }
```

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

Wählen Sie `styles/class.css` für den von der Anwendung gesteuerten Dunkelmodus oder `styles/always.css` für eine stets dunkle Darstellung. Das Stylesheet enthält die passende dunkle Ionic-Palette. Die Theme-Konfiguration verwendet standardmäßig den iOS-Modus und dessen Animationen; anwendungsspezifische Optionen haben Vorrang. Der Ionic-Kompatibilitätsbereich ist `>=9 <10`. Reine Browser-Apps benötigen kein natives Capacitor-Projekt.

Das Theme gestaltet Werkzeugleisten, Tabs, Listen, Schaltflächen, Suche und Overlays mit heller und dunkler Darstellung. Es aktiviert keine nativen Bedienelemente. Sobald das Web-Theme funktioniert, können Sie optional [Native UI hinzufügen](/docs/add-native-ui).

## Ihre App anpassen

Verwenden Sie die [Konfiguration](/docs/configuration) für einzelne CSS- und Animationseinstellungen. Bestehende Anwendungen können ihre Einrichtung optional anhand der [Migrationsanleitung](/docs/migration#optional-simplify-the-setup) vereinfachen.

- [Funktionen](/docs/features): CSS-Variablen, Liquid Glass und selektive Komponentenimporte.
- [Spezielles Markup und Klassen](/docs/special-markup): optionales Komponentenverhalten.
- [ion-item-group verwenden](/docs/using-ion-item-group): Markup für eingerückte Listen.
- [Animation](/docs/animation): Tab-, Segment- und Sucheffekte.
- [ESLint](/docs/eslint): nicht unterstützte Listenstrukturen erkennen.
- [Vertical Bars-Layout](/docs/vertical-bars-layout): Abstände, RTL, Geräteposition, Faltstellung und Split Panes.

## Zuständigkeiten der Repositorys

Das Capacitor-Plugin wird in [webview-native-ui/capacitor-plugin](https://github.com/webview-native-ui/capacitor-plugin) gepflegt. Dieses Repository verwaltet das Ionic-Theme, die kombinierte Demo, Browser-Screenshots und Simulator-Integrationstests. Die Demo installiert `@rdlabo/capacitor-native-ui` von npm; Theme-Releases veröffentlichen das Plugin nicht und ändern dessen Version nicht.

Das [Cordova-Plugin](https://github.com/webview-native-ui/cordova-plugin) wird separat gepflegt. Es verteilt eine festgelegte Kopie dieses Themes, deren Integrationsimporte mit Cordova verbunden sind. Gemeinsame Theme-Korrekturen gehören hierher; Cordova aktualisiert seine festgelegte Theme-Version in einem späteren Plugin-Release. Die Capacitor-Demo und die nachfolgenden Kandidatenprüfungen validieren Cordova nicht.

Um ein unveröffentlichtes Plugin-Archiv mit der echten Demo zu prüfen, führen Sie Folgendes aus:

```sh
npm run test:native-candidate -- /absolute/path/rdlabo-capacitor-native-ui-VERSION.tgz --e2e
```

Dies erstellt einen isolierten temporären Checkout und lässt Ihre Manifeste und Lockfiles unverändert. Ergänzen Sie `--shard=1/2` neben `--e2e`, um einen Playwright-Shard auszuführen; führen Sie alle Shards aus, um die gesamte Suite abzudecken. Jeder Shard umfasst weiterhin Paketprüfungen, Unit-Tests und den Produktionsbuild. Ergänzen Sie `--simulator=UDID` für die Simulator-Suiten für native UI, Suche und Ränder. Diagnoseinformationen und die temporäre Demo bleiben unter dem ausgegebenen Pfad erhalten. Plugin-spezifische Unit-Tests und native Bibliothekstests liegen im Plugin-Repository. Dessen CI testet jedes Kandidatenarchiv gegen den main-Branch dieses Repositorys.

## Wartung

Veröffentlichen Sie das Theme-Paket im Repository-Stamm mit `npm run release` von einem sauberen, aktuellen `main`. Der Workflow für `ios27-v…`-Tags veröffentlicht nur das Theme, mit `next` für Vorabversionen und `latest` für stabile Versionen.

Theme und Plugin werden unabhängig versioniert. Beim eigenständigen Paket `@rdlabo/ionic-theme-ios27` ist Capacitor Native UI eine erforderliche Peer-Abhängigkeit, damit Theme und Anwendung dieselbe Plugin-Instanz nutzen. npm 7+ installiert sie bei reinen Theme-Apps automatisch; bei anderen Paketmanagern müssen erforderliche Peer-Abhängigkeiten installiert werden. Apps mit nativen Steuerelementen müssen das Plugin zusätzlich direkt deklarieren, damit Capacitor es erkennt. Eine veröffentlichte npm-Version kann nicht überschrieben werden.
