---
title: "Erste Schritte"
sourceRevision: "86498bb9ba6e7371b638d198b8620630ce7e52320c9f6e9f61b234eb1178d18f"
---

# Capacitor Native UI

Stellen Sie unterstützte Web-Bedienelemente unter iOS mit UIKit und SwiftUI dar, während Anwendungszustand, Routing und Handler in der WebView bleiben. Verwenden Sie bestehendes Ionic-Markup oder ausdrücklich gekennzeichnete HTML-Schaltflächen; eigene SwiftUI- oder Android-Compose-Inhalte lassen sich über experimentelle app-lokale Erweiterungen ergänzen.

Native UI muss ausdrücklich aktiviert werden und wird ab Version 2.0.0 offiziell unterstützt. Standardbedienelemente unter Android, in Browsern, unter älterem iOS sowie nicht unterstützte Bedienelemente behalten ihre Web-Darstellung. Android unterstützt experimentelle app-lokale Compose-Erweiterungen. Behalten Sie Stile und Layout Ihrer Anwendung; das iOS-Theme ist optional.

## Von npm installieren

Installieren Sie für die standardmäßige Ionic-iOS-Einrichtung Native UI, das iOS-27-Theme und Foldable:

```sh
npm install @rdlabo/capacitor-native-ui @rdlabo/ionic-theme-ios27 @erkamyaman/capacitor-foldable
```

Verwenden Sie das einzelne Stylesheet und das Preset `ios27ThemeConfig` des Themes. Starten Sie anschließend eine Runtime, nachdem die App-Shell eingebunden wurde:

```ts
import { enableNativeUI } from '@rdlabo/capacitor-native-ui';

const shell = await enableNativeUI();
```

**Vertical Bars ist standardmäßig aktiviert**, zusammen mit gewöhnlichen Bedienelementen. Binden Sie den standardmäßigen Gerätelayout-Service ein: Unterstützte Geräte bestimmen die Rail-Platzierung, andere Geräte behalten das Web-Layout. Starten Sie keine separate Rail-Runtime und kopieren Sie keinen systemnahen Renderer- oder Navigationscode in Seitenkomponenten.

Die [Ionic-Einrichtung](/docs/setup) beschreibt Stylesheet, Bootstrap, Geräteservice und native Buildschritte vollständig. Mit der [Einrichtung für bestehende Themes](/docs/ionic-vertical-bars) behalten Sie ein anderes Web-Theme; ohne Ionic verwenden Sie die [HTML-Einrichtung](/docs/framework-independent). Native UI ist weder für Anwendungszustand noch Routing oder Theme-Auswahl zuständig. Der Anwendungseigentümer zerstört sein Handle bei der Entsorgung.

## Funktionsweise der Projektion

Eine **Projektion** ist eine weitere Darstellung eines Web-Bedienelements. Ihre Anwendung behält das ursprüngliche DOM-Element, den Zustand und die Ereignishandler. Das Plugin liest unterstützte Beschriftungen, Symbole, Auswahl-/Deaktivierungszustände und Geometrie und ordnet anschließend das dargestellte Bedienelement seinem Quellelement zu. Es wandelt die Seite nicht in einen nativen Bildschirm um und führt keine zweite Kopie Ihrer Anwendung aus.

| Web-Quelle | Projizierte Darstellung |
| --- | --- |
| Android Material You-Farben auslesen | [Dynamische Android-Farben](/docs/dynamic-colors) |
| Unterstützte Ionic-Schaltflächen, Tabs und Segmente | Native UIKit-/SwiftUI-Bedienelemente unter unterstütztem iOS |
| Ausdrücklich markierte HTML-Schaltflächen und Zurückschaltflächen | Native Schaltflächen unter unterstütztem iOS |
| Geeignete Bedienelemente in Vertical Bars | SwiftUI-Bedienelemente in der verfügbaren Systemleiste; andernfalls Web-Seitenleiste |
| DOM-Element einer app-lokalen Erweiterung | Von Ihrer App registrierte SwiftUI- oder Compose-Inhalte mit aus diesem Element gelesenen Props |

Das Originalelement **bleibt während der Projektion im DOM**. Bindungen und Handler bleiben verbunden. Sobald die native Darstellung akzeptiert wurde, blendet die Laufzeit die Quelle visuell aus, verhindert direkte Zeigerinteraktionen und verbirgt sie vor der Web-Barrierefreiheit, damit keine zwei interaktiven Kopien existieren. Elementprojektion erhält die Layoutbox der Quelle; die Abstände der Seitenleiste liefert Ihre App oder Ihr Theme. Eine Web-Seitenleiste verwendet entsprechend die Web-Darstellung ihres Adapters: Ionic-Layout/Klone oder HTML-Proxy-Schaltflächen in Ihrem `webHost`.

Beispielsweise aktiviert das Antippen einer projizierten Speichern-Schaltfläche die ursprüngliche Web-Schaltfläche. Ihr vorhandener Handler speichert und aktualisiert den Anwendungszustand; unterstützte DOM-Änderungen aktualisieren anschließend die Projektion. Auch Tabs und andere Bedienelemente leiten Aktionen über ihre Quelladapter weiter. Aktualisieren Sie weiterhin die Quelle, statt einen separaten nativen Zustand zu verwalten. Für Reader-Werte, die sich ohne DOM-Mutation ändern, verwenden Sie `markForCheck()`.

Projektion ändert die Darstellung; sie übersetzt kein beliebiges HTML oder CSS in native Ansichten. Native Bedienelemente verwenden unterstützte Daten und Stile; eine eigene Web-Darstellung wird nicht garantiert nachgebildet. Entfernen oder Deaktivieren einer Quelle verhindert weitere gültige Aktionen. Ist Projektion nicht verfügbar oder wird sie beendet, hebt die Laufzeit ihre Ausblendung auf und die Quelle kehrt zur Web-Darstellung oder einer verfügbaren Web-Seitenleiste zurück. Der eigene Sichtbarkeits-/Deaktivierungszustand Ihrer Anwendung gilt weiterhin.

Die Native-Darstellungsverantwortung folgt der Quelle und ihrem Projektionskontext, unabhängig von Animationen und verfügbaren Bildern. Darstellung, Ziehen und Größenänderung eines Modals sowie die Bildwiederherstellung übertragen eine akzeptierte Quelle nicht ins Web, solange ihre Projektion geeignet bleibt. Eine ausdrückliche Web-Übergabe, eine nicht unterstützte oder abgelehnte Projektion, ein Laufzeitfehler oder das Ende der Quelle beziehungsweise des Kontexts gibt sie frei. Eine deaktivierte Schaltfläche bleibt dasselbe Native-eigene Bedienelement mit deaktivierter Eingabe.

Blockierende Web-Overlays können vorbereitete Bilder nativer Schaltflächen, Segmente, FABs und Tab-Leisten unter ihrem Hintergrund behalten. Die Bilder bewahren das erfasste native Erscheinungsbild und werden nach nativen Aktualisierungen und zusammengefassten visuellen Änderungen vorbereitet. Die Erfassung der Plattform kann vom Live-Compositing abweichen, etwa bei Liquid Glass-Kantenreflexen; eine pixelgenaue Reproduktion der Materialien ist nicht garantiert. Während einer Berührung pausiert die Vorbereitung; die Darstellung verwendet das letzte fertiggestellte Bild, ohne auf Erfassung oder Bridge-Bestätigung zu warten. Ein fehlendes Bild gibt eine akzeptierte Native-Quelle nicht an das Web zurück. Native Popover, die ihre Bedienelemente behalten, bleiben auf dem nativen Pfad. Die [Übergaberegeln](https://docs.rdlabo.dev/projects/capacitor-native-ui/docs/appearance#temporary-images-beneath-web-overlays) beschreiben Bewegung, Wiederherstellung und Ausnahmen. Erstellen Sie die native App neu, um diese Funktion zu aktivieren; ältere native Binärdateien behalten ihren bisherigen Pfad.

## Wählen Sie Ihr Ziel

| Ziel | Einstieg |
| --- | --- |
| Bestehende Ionic-Bedienelemente nativ rendern | [Ionic-Einrichtung](https://webview-native-ui.com/projects/capacitor-native-ui/docs/setup) |
| Native Schaltflächen ohne Ionic verwenden | [HTML-Einrichtung](https://webview-native-ui.com/projects/capacitor-native-ui/docs/framework-independent) |
| Ein anderes Ionic-Theme mit Vertical Bars behalten | [Vertical Bars Schritt für Schritt](https://webview-native-ui.com/projects/capacitor-native-ui/docs/ionic-vertical-bars) |
| Vertical Bars ohne Ionic verwenden | [HTML-Rail-Einrichtung](https://webview-native-ui.com/projects/capacitor-native-ui/docs/framework-independent) |
| Native Bedienelemente zu einer bestehenden iOS-27-Theme-App hinzufügen | [Native UI zum Theme hinzufügen](https://webview-native-ui.com/projects/ionic-theme-ios27/docs/add-native-ui) |
| Android-Material-You-Farben lesen | [Android Dynamic Colors](/docs/dynamic-colors) |
| Eigene SwiftUI- oder Android-Compose-Inhalte rendern | [App-lokale Erweiterungen (experimentell)](https://webview-native-ui.com/projects/capacitor-native-ui/docs/native-ui-extensions) |

## Anforderungen

Der native Start erfordert Capacitor 8 und ein iOS- oder Android-Projekt. Android-Erweiterungen benötigen API 24+ und Kotlin/Compose. Gewöhnliches natives Rendering erfordert iOS 26+ und Xcode 26+. Der Ionic-Adapter deklariert Ionic `>=8.8.1 <10` als kompatibel; automatisierte E2E-Validierung erfolgt mit Ionic 9. Der HTML-Adapter unter `/core` benötigt weder Ionic noch ein Theme-Paket. Für [Vertical Bars](/docs/vertical-bars) und [Erweiterungspositionierung](/docs/native-ui-extensions#content-and-placement-are-independent) gelten zusätzliche Geräteanforderungen.

Für Standardbedienelemente folgen Sie der Einrichtungsanleitung für Ihr Markup; Ionic- und HTML-Adapter verwenden unterschiedliche Importe. Für eigene native Inhalte beginnen Sie direkt mit der [Erweiterungsanleitung](/docs/native-ui-extensions).

## Referenz

- [Unterstützte Ionic-Bedienelemente](/docs/native-ui#supported-markup) und Fallback-Verhalten.
- [Konfiguration](/docs/configuration): Standardwerte, ausgewählte Bedienelemente, reiner Seitenleistenmodus und laufende Änderungen.
- [Helle und dunkle Darstellung](/docs/appearance): Web-Theme übernehmen, eigenes HTML konfigurieren und die gemeinsame Seitenleistendarstellung verstehen.
- [Vertical Bars](/docs/vertical-bars): Eignung, Darstellung und Laufzeit-API.
- [Migration](/docs/migration): Paketnamen, Importe und Aktualisierung des nativen Projekts.

## Entwicklung

```sh
npm ci
npm run build
npm test
npm run test:packages
```

Die gemeinsame DOM- und Renderer-Implementierung wird im lokalen Workspace `packages/native-ui-core` gepflegt. Dieses Repository verwaltet die Capacitor-Registrierung und Host-Adapter. `android/src/main/java/shared-core` wird durch `npm run sync:core` aus den lokalen Core-Quellen erzeugt; bearbeiten Sie Core und nicht diese Kopie. SwiftPM und CocoaPods kompilieren die gemeinsamen Swift-Quellen direkt aus `packages/native-ui-core/ios/Sources`. Git-basierte SwiftPM-Nutzer benötigen kein Node.js. Bestehende native Modulnamen und Kotlin-Symbolnamen bleiben für app-lokale Erweiterungen erhalten.

Das Repository-Stammverzeichnis bleibt das npm-Plugin: `src`, `ios`, `android` und `package.json` liegen zusammen. Seine TypeScript-Unit-Tests liegen in `tests`; Swift- und Android-Tests bleiben beim Plugin. `examples/native-ui-html` zeigt die Verwendung ohne Ionic-Theme.

Der Build folgt dem Capacitor-Plugin-Layout: TypeScript kompiliert `src/index.ts` nach `dist/esm`, und Rollup erzeugt das Browser-Bundle (`dist/plugin.js`) und CommonJS-Bundle (`dist/plugin.cjs`). Die Erweiterung `.cjs` ist erforderlich, weil dieses Paket `type: module` verwendet. Öffentliche ESM-Unterpfade teilen dieselben Module in `dist/esm`. Führen Sie `npm run watch` zum erneuten Kompilieren von TypeScript-Änderungen oder `npm run verify:web` für die Web-Prüfungen aus.

## Mit dem Ionic-Theme testen

Die vollständige Ionic-Demo, Screenshot-Tests, Theme-Übergangstests und Simulator-Integrations-Fixtures verbleiben in [ionic-theme-ios27](https://github.com/webview-native-ui/ionic-theme-ios27). Sie installieren dieses Plugin als npm-Abhängigkeit. Duplizieren Sie die Demo hier nicht.

Um unveröffentlichte Änderungen zu testen, bauen und packen Sie dieses Repository:

```sh
npm run build
npm pack --ignore-scripts --pack-destination /tmp
```

Führen Sie von einem migrierten Theme-Checkout aus `npm run test:native-candidate -- /tmp/rdlabo-capacitor-native-ui-VERSION.tgz --e2e` aus. Der Befehl erstellt eine isolierte Kopie, installiert das Archiv für Theme und Demo und führt anschließend Paketprüfungen, Integrations-Unit-Tests, den Produktionsbuild und Browsertests aus. Ergänzen Sie `--simulator=UDID`, um die bestehenden Simulator-Suiten auszuführen. Der ursprüngliche Checkout und seine Lockdateien bleiben unverändert; die temporäre Kopie bleibt zur Diagnose verfügbar.

## Releases

Das Plugin hat eine vom Theme unabhängige Version. Führen Sie bei erteilter Veröffentlichungsberechtigung `npm run release` von einem aktuellen main aus. Der Workflow für den Tag `vVERSION` veröffentlicht ausschließlich dieses Plugin (`next` für Vorabversionen, `latest` für stabile Versionen).

Fixieren Sie Engine in beiden npm-Manifesten, `Package.swift`, dem Podspec und der Android-Gradle-Abhängigkeit auf dieselbe exakte Version und aktualisieren Sie die Lockdatei gemeinsam. Ein variabler npm-Bereich kann eine neuere Engine als die nativen Abhängigkeiten auflösen und die Installation scheitern lassen.

Konfigurieren Sie vor dem ersten Release den npm Trusted Publisher für `webview-native-ui/capacitor-plugin`, Workflow `release.yml` und Umgebung `npm`. Konfigurieren Sie die Reviewer-Richtlinie dieser GitHub-Umgebung nach Bedarf. Bereits veröffentlichte Versionen können nicht erneut veröffentlicht werden; wählen Sie für das erste Release aus diesem Repository eine neue Version.

Dieses Repository wurde aus Commit `1831bde5` von `webview-native-ui/ionic-theme-ios27` extrahiert. Die ältere Historie verbleibt im ursprünglichen Repository.

## Gemeinsamen Core entwickeln

Core liegt in `packages/native-ui-core` in diesem Repository. Führen Sie `npm ci`, `npm run build` und `npm test` vom Repository-Stammverzeichnis aus; eine getrennte Core-Veröffentlichung oder ein separater Checkout sind nicht erforderlich. Der Build bettet JavaScript und Deklarationen von Core in das Plugin-Archiv ein. Core ist ein privater Workspace und keine separat veröffentlichte npm-Abhängigkeit.

Bearbeiten Sie gemeinsames TypeScript, Swift und Kotlin in `packages/native-ui-core`. `npm run sync:core` erzeugt die Android-Kopie neu; `npm run check:core` erkennt Abweichungen. Gemeinsame Renderer-/DOM-Tests laufen über den Testbefehl im Stammverzeichnis zusammen mit den Capacitor-Adaptertests. Native Core-Tests verbleiben in dessen Verzeichnissen `ios` und `android`.

Capacitor-Migrationen laufen vom Stammverzeichnis dieses Repositorys aus. `package.json`, `Package.swift`, der Podspec und `android/` behalten ihre Standardpositionen. Prüfen Sie native Builds nach SDK-Migrationen; das Beibehalten des Layouts garantiert keine Kompatibilität mit zukünftigen Migrationswerkzeugen.

### Swift Package-Nutzer

Fügen Sie `https://github.com/webview-native-ui/capacitor-plugin.git` in Xcode hinzu und wählen Sie das Produkt `NativeUICore`, um `import NativeUICore` ohne Verknüpfung des Capacitor-Adapters zu verwenden. Beide Produkte teilen die Release-Tags des Repositorys; SwiftPM kann beim Auflösen der Paketabhängigkeiten trotzdem Capacitor abrufen.

Capacitor-Apps verwenden weiterhin das Produkt `RdlaboCapacitorNativeUi` und `import NativeUIPlugin`. Dieses Modul exportiert Core erneut, sodass bestehende `NativeUI.register`-Aufrufe denselben Registrierungszustand wie der Adapter verwenden. Das Root-Manifest verwaltet beide Targets; es gibt kein separates verschachteltes Swift-Paket.

CocoaPods kompiliert den Adapter und die gemeinsamen Quellen weiterhin in den bestehenden Plugin-Pod. Diese Änderung veröffentlicht keinen eigenständigen Core-Pod und implementiert keinen Cordova-Adapter.

## Dynamische Android-Farben

Lesen Sie Material You-Farben unter Android 12+ mit `getDynamicColorScheme()` und beobachten Sie Wiederaufnahme- und Konfigurationsbenachrichtigungen mit `addDynamicColorListener()`. Importieren Sie beide aus `@rdlabo/capacitor-native-ui`. Dynamische Farben sind eine unterstützte, ausdrücklich zu aktivierende API, unabhängig von der Native UI-Projektion und experimentellen app-lokalen Erweiterungen.

Das Plugin liefert helle und dunkle Farbschemata, ohne das Activity-Theme zu ändern oder Wallpaper-Berechtigungen anzufordern. Andere Plattformen melden `available: false`. Das Plugin wendet kein CSS an; Ionic-Anwendungen können `enableDynamicColors` aus `@rdlabo/ionic-theme-md3/dynamic-colors` verwenden.

[Android Dynamic Colors](/docs/dynamic-colors) beschreibt Installation, API-Verträge, Änderungsbenachrichtigungen, Bereinigung und Ionic-Integration.
