---
title: "Capacitor Native UI"
sourceRevision: "6b71e7c15aabcd36aa31f342d7285eca9fc6d8baf823c4ef16845167f055f22d"
---

# Capacitor Native UI

Capacitor Native UI bietet native Steuerelemente, Gerätefarben und eigene native Inhalte für WebView-Anwendungen.


Folgen Sie für eine Ionic-App mit iOS Native UI und Android Dynamic Color der [WebView Native UI Standardeinrichtung](https://webview-native-ui.com/standard-setup).

## Einzelne Leitfäden

### 1. Native UI des Plugins verwenden

Das Plugin rendert unterstützte Ionic- und HTML-Steuerelemente unter iOS nativ. Zustand, Routing und Handler bleiben bei der Anwendung.

| Ihre Anwendung | Leitfaden |
| --- | --- |
| Ionic mit dem standardmäßigen iOS-27-Theme | [Ionic-Einrichtung](setup.md) |
| Ionic mit vorhandenem Web-Theme | [Einrichtung mit vorhandenem Theme](ionic-vertical-bars.md) |
| HTML ohne Ionic | [HTML-Einrichtung](framework-independent.md) |

#### Funktionsweise der Projektion

Native UI stellt das ursprüngliche Web-Steuerelement nativ dar und behält Zustand und Handler bei. Siehe [unterstützte Steuerelemente und Projektion](native-ui.md).

### 2. Dynamic Color verwenden

Lesen Sie die Android-Gerätepalette und wenden Sie sie über das Theme an. Der [Dynamic-Color-Leitfaden](dynamic-colors.md) beschreibt die eigenständige Verwendung, Darstellungspräferenzen und Farbzuordnung.

### 3. Eigene Native UI erstellen

Rendern Sie eigene SwiftUI- oder Android-Compose-Inhalte über [anwendungslokale Erweiterungen](native-ui-extensions.md). Diese Funktion ist experimentell.

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
