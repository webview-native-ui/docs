---
title: "Native UI in einer Ionic-App einrichten"
sourceRevision: "13342d88e06664f78fd13bc71777b73b3c4be06d5865804072aea81678a2dc49"
---

# Native UI in einer Ionic-App einrichten

Beginnen Sie mit der standardmäßigen Ionic-iOS-Einrichtung: Pakete installieren, Theme-Preset verwenden und eine Native-UI-Runtime starten. **Vertical Bars ist standardmäßig aktiviert**, neben gewöhnlichen Bedienelementen. Ein unterstütztes Gerät bestimmt die Rail-Platzierung; Browser und Geräte ohne Rail behalten ihr Web-Layout.

Verwenden Sie eine bestehende Ionic-Anwendung mit Capacitor 8. Diese Anleitung nutzt das übergeordnete Stylesheet und die Konfiguration des iOS-27-Themes. Wenn Sie ein anderes Web-Theme behalten möchten, verwenden Sie die [Einrichtung für bestehende Themes](ionic-vertical-bars.md); ohne Ionic die [HTML-Einrichtung](framework-independent.md).

## 1. Plugin installieren

```sh
npm install @rdlabo/capacitor-native-ui @rdlabo/ionic-theme-ios27 @erkamyaman/capacitor-foldable
```

Deklarieren Sie Native UI direkt in der Anwendung, damit Capacitor das native Plugin erkennt. Behalten Sie Theme, Plugin und Foldable als separate Abhängigkeiten; das Theme deklariert seinen kompatiblen Native-UI-Peer-Bereich. Die standardmäßige Gerätelayout-Integration verwendet Foldable 8.5 oder neuer innerhalb von Version 8.

## 2. Shell aktivieren

Behalten Sie die Ionic-Basisstile. Ersetzen Sie im globalen Stylesheet separate Ionic-Dunkelpaletten- und iOS-Theme-Importe durch den einzelnen Theme-Einstiegspunkt:

```css
@import '@rdlabo/ionic-theme-ios27/styles/system.css';
```

Übergeben Sie das Theme-Preset vor dem Rendern an Ihre bestehende Ionic-Initialisierung:

```ts
import { ios27ThemeConfig } from '@rdlabo/ionic-theme-ios27';

const ionicConfig = {
  ...ios27ThemeConfig,
};
```

| Framework | Bestehende Ionic-Initialisierung |
| --- | --- |
| Angular / Ionic 8 | `provideIonicAngular(ionicConfig)` aus `@ionic/angular/standalone` |
| Angular / Ionic 9 | `provideIonicAngular(ionicConfig)` aus `@ionic/angular` |
| React | `setupIonicReact(ionicConfig)` aus `@ionic/react` |
| Vue | `app.use(IonicVue, ionicConfig)` mit `IonicVue` aus `@ionic/vue` |

Das Stylesheet enthält das Vertical-Bars-Layout; das Preset enthält den Native-UI-fähigen Seitenübergang. Fügen Sie kein zweites Rail-Stylesheet hinzu und umschließen Sie den Übergang des Presets nicht erneut. Die [Theme-Konfiguration](https://webview-native-ui.com/projects/ionic-theme-ios27/docs/configuration) beschreibt manuellen Dunkelmodus und anwendungsspezifische Überschreibungen.

Starten Sie Native UI einmal, nachdem das `ion-app` der Anwendung eingebunden wurde:

```ts
import { enableNativeUI } from '@rdlabo/capacitor-native-ui';

const shell = await enableNativeUI();
```

Dieser Standardaufruf aktiviert gewöhnliche Bedienelemente **und Vertical Bars**. Übergeben Sie für die Standardeinrichtung nicht `controls: 'verticalOnly'`. Individuelle Auswahl, feste Browser-Platzierung, Erweiterungen und Suspendierungs-Leases sind Referenz-APIs und keine Installationsvoraussetzungen.

### Start im App-Stamm Ihres Frameworks platzieren

Der Anwendungs-Bootstrap besitzt den Runtime-Lebenszyklus. Geräteinformationen gehören in einen Anwendungsservice, die Theme-Konfiguration in die Ionic-Initialisierung beziehungsweise das globale Stylesheet. Geroutete Komponenten behalten ihre bestehenden Handler und ihren Zustand. Ergänzen Sie in `AppComponent` oder Seitenkomponenten keinen zweiten Router, Projektionszustand oder eigene native Lebenszyklusverwaltung.

Verwenden Sie für Angular den [Gerätelayout-Service](ionic-vertical-bars.md#3-connect-device-placement-and-start-the-controls) und verbinden Sie anschließend beide Verantwortlichen in der bestehenden `src/main.ts`:

```ts
import { bootstrapApplication } from '@angular/platform-browser';
import { enableNativeUI } from '@rdlabo/capacitor-native-ui';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';
import { VerticalBarsLayoutService } from './app/vertical-bars-layout.service';

void bootstrapApplication(AppComponent, appConfig)
  .then(async (app) => {
    const shell = await enableNativeUI();
    if (app.destroyed) {
      await shell.destroy();
      return;
    }
    app.onDestroy(() => {
      void shell.destroy().catch((error: unknown) => console.error('Native UI cleanup failed', error));
    });
    await app.injector.get(VerticalBarsLayoutService).initialize();
  })
  .catch((error: unknown) => console.error('Application startup failed', error));
```

Integrieren Sie dies in den einzigen Bootstrap der Anwendung; erstellen Sie weder einen weiteren Bootstrap noch eine weitere Runtime. `AppComponent` setzt weiterhin nur App-Shell und Router-Outlet zusammen. Der Service registriert seinen Listener vor dem ersten Geräteabruf, entfernt ihn bei der Zerstörung und übergibt die aufgelöste Geometrie an das Theme. Native UI übernimmt native Projektion, Fallback und Ereignisweiterleitung.

Für React- und Vue-Anwendungen gilt dieselbe Zuständigkeit: einmal nach dem Einbinden der App-Shell starten, Geräteinformationen oberhalb gerouteter Seiten verwalten und bei der Entsorgung des Anwendungseigentümers die zurückgegebene Runtime zerstören sowie den Gerätelistener entfernen. Kopieren Sie Angulars DI-Service nicht in ein anderes Framework und führen Sie keine gemeinsame modulglobale Lebenszykluswarteschlange ein.

## 3. Navigation koordinieren

Das standardmäßige `ios27ThemeConfig` koordiniert bereits die native Darstellung mit der Ionic-Navigation, einschließlich Zurück-Gesten. Behalten Sie normale Ionic-Routen und Handler. Ein selbst geschriebener `navigate()`-Wrapper, ein Seitenwechsel per Web Animation oder ein Native-UI-Start je Seite ist nicht erforderlich.

Die standardmäßige Vertical-Bars-Einrichtung enthält das Geräteabonnement oben; es ist kein späterer optionaler Schritt. `layoutChange` zusammen mit `resolveVerticalBarsLayout(Foldable)` liefert Kante, Einzug und Werkzeugleistenursprung auch dann, wenn eine Anzeigeänderung Kante und Einzug unverändert lässt. Das Theme wendet das Web-Layout an; Native UI bestimmt, ob natives Rail-Rendering verfügbar ist. Eine Gerätekante von null stellt das gewöhnliche Layout wieder her.

Folgen Sie für ein bestehendes oder eigenes Web-Theme der [eigenständigen Layout- und Übergangseinrichtung](ionic-vertical-bars.md), statt das Theme zu ersetzen. Eigene Animations-Builder verwenden den [Übergangsadapter](migration.md#native-ui-transition-adapter); dieser ersetzt den Preset-Weg, statt einen zweiten Koordinator hinzuzufügen.

## 4. Erstellen, synchronisieren und ausführen

Gewöhnliche native Bedienelemente benötigen Ionic `>=8.8.1 <10`, Capacitor 8, Xcode 26+ und iOS 26+. Native Vertical Bars benötigen zusätzlich das [unterstützte Rail-Gerät und Betriebssystem](vertical-bars.md#native-rendering). Die standardmäßig aktivierte Rail erzwingt auf nicht unterstützter Hardware keine native Darstellung.

SwiftPM löst Engine automatisch auf. Installieren Sie für eine bestehende CocoaPods-App die Engine-Version, die Ihr installiertes Native-UI-Paket benötigt:

```sh
npm install "@webview-native-ui/engine@$(node -p "require('./node_modules/@rdlabo/capacitor-native-ui/package.json').dependencies['@webview-native-ui/engine']")"
```

Fügen Sie Engine dem bestehenden Anwendungstarget in `ios/App/Podfile` hinzu, außerhalb des generierten Blocks `def capacitor_pods`:

```ruby
target 'App' do
  capacitor_pods
  pod 'WebViewNativeUIEngine', :path => '../../node_modules/@webview-native-ui/engine'
  # Keep your other application pods here.
end
```

Passen Sie den Pfad an Ihr Projektlayout an und wiederholen Sie die Versionsabstimmung bei Native-UI-Upgrades. Dies ist eine CocoaPods-Kompatibilitätseinrichtung und keine UI-Logik der Anwendung.

Erstellen Sie die Web-Assets der Anwendung und synchronisieren Sie anschließend:

```sh
npx cap sync ios
```

Erstellen Sie die App erneut und starten Sie sie in Xcode. Vorhandene unterstützte Werkzeugleistenaktionen und Tabs sollten nativ projiziert werden und ihre ursprünglichen Handler aufrufen. Auf einem unterstützten Rail-Gerät verwenden sie Vertical Bars; der Inhalt reserviert den gemeldeten Platz. Prüfen Sie Vorwärts-/Zurück-Navigation, abgebrochene Zurück-Gesten, eine Geräteanzeigeänderung und den Web-Fallback. Eine Browser-Vorschau kann natives Rendering nicht überprüfen.

| Beobachtung | Prüfung |
| --- | --- |
| Alle Bedienelemente bleiben unter unterstütztem iOS im Web | Direkte Abhängigkeit, Start nach dem Einbinden, Capacitor-Synchronisierung und nativer Neubuild. |
| Nur ein Bedienelement bleibt im Web | Quell-Markup mit [unterstützten Bedienelementen](native-ui.md#supported-markup) vergleichen. |
| Ein Rail-Gerät behält das gewöhnliche Layout | Geräteservice einbinden und passendes Theme-Stylesheet laden. |
| Das Layout reagiert nicht auf Anzeigeänderungen | `layoutChange` mit dem Resolver verwenden, nicht nur ein Kanten-/Einzugsereignis. |
| Bedienelemente überlappen bei der Navigation | Preset-Übergang beibehalten oder genau einen eigenen Übergangsadapter konfigurieren. |

## Nächste Schritte

- [Ein bestehendes Web-Theme behalten](ionic-vertical-bars.md) und dabei das standardmäßige Vertical-Bars-Verhalten erhalten.
- [Konfigurationsreferenz](configuration.md) für explizite Anpassungen und das Deaktivieren von Standards.
- [Unterstützte Bedienelemente](native-ui.md) und [Darstellung](appearance.md).
- [Migration](migration.md) für ältere Paketnamen und Integrations-APIs.

## Navigation ohne Theme

Dies ist eine fortgeschrittene Integration für Anwendungen mit einem anderen eigenen Navigationslebenszyklus, kein Bestandteil der standardmäßigen Ionic-Installation. Behalten Sie den Anwendungsrouter als einzigen Navigationsverantwortlichen. Verwenden Sie das [HTML-Beispiel](https://github.com/webview-native-ui/capacitor-plugin/tree/v2.1.4/examples/native-ui-html) für eine routerlose App und die [Suspendierung](native-ui.md#custom-overlay-suspension), wenn die Anwendung die Darstellung ausdrücklich an das Web zurückgeben muss. Setzen Sie erst fort, wenn Abschluss oder Abbruch vollständig abgewickelt sind; kopieren Sie keinen zweiten Seitenrouter in eine Ionic-App.
