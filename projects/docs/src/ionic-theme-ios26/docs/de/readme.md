---
title: "Erste Schritte"
sourceRevision: "fe28a70dd3e5a307f1c8f967dd9abf34ad160f8ca54335f6c4913e5ef295d72c"
---

# Ionic Theme iOS26

Gestalten Sie Ionic-Komponenten mit iOS-26-Stilen und Liquid-Glass-Interaktionen.

[Einrichtung](setup.md) · [Web-Demo](https://ionic-theme-ios26.rdlabo.dev/)

Die Beispiele verwenden Ionic 9. Importieren Sie unter Ionic 8 mit Angular `provideIonicAngular` aus `@ionic/angular/standalone`.

<!-- rdlabo-docs-pick -->

![Ionic-Oberflächen im iOS-26-Design mit Liquid-Glass-Tab-Leiste, Listen und Bedienelementen](https://raw.githubusercontent.com/webview-native-ui/ionic-theme-ios27/ios26-v9.5.0/screenshots/ios26.png)

<!-- /rdlabo-docs-pick -->

## Installation

```sh
npm install @rdlabo/ionic-theme-ios26
```

[Einrichtung](setup.md) · [Konfiguration](configuration.md)

## Dokumentation

- [Verwendung von ion-item-group](https://webview-native-ui.com/projects/ionic-theme-ios26/docs/using-ion-item-group) — erforderliches Markup für eingerückte Listen.
- [Spezielles Markup und Klassen](https://webview-native-ui.com/projects/ionic-theme-ios26/docs/special-markup) — gezielt aktivierbares Markup und Hilfsklassen des Themes.
- [ESLint](https://webview-native-ui.com/projects/ionic-theme-ios26/docs/eslint) — die Listenstruktur mit ESLint-Regeln prüfen.
- [Funktionen](https://webview-native-ui.com/projects/ionic-theme-ios26/docs/features) — CSS-Variablen, Liquid Glass, selektive Imports und dunkler Modus.
- [Experimentelle Animation](https://webview-native-ui.com/projects/ionic-theme-ios26/docs/experimental-animation) — Effekte für Tab-Leiste und Suche.
- [iOS 18](https://webview-native-ui.com/projects/ionic-theme-ios26/docs/ios-18) — das Theme nur unter iOS 26 laden.
- [Migration](/docs/migration) — optionale Einführung der Wrapper und versionsspezifische Aktualisierungsschritte.

<!-- rdlabo-docs-omit -->

**Vollständige Dokumentation:** [https://webview-native-ui.com/projects/ionic-theme-ios26](https://webview-native-ui.com/projects/ionic-theme-ios26)

## Entwicklung und Tests

### JavaScript-Modul-Builds

Belassen Sie relative Imports im TypeScript-Quellcode ohne Dateiendung, entsprechend dem Quellcodestil von Ionic. Die gemeinsame CLI `rdlabo-build-theme` aus `@rdlabo/ionic-theme-utils` verwendet tsdown, um Imports beim Erzeugen von ESM-JavaScript und Typdeklarationen aufzulösen. Abhängigkeiten bleiben extern; die Quelldateien werden nicht umgeschrieben.

Führen Sie `npm run build && npm run test:esm` aus, um das npm-Tarball zu erstellen und mit der gemeinsamen CLI `rdlabo-check-esm` zu prüfen. Öffentliche JavaScript-Einstiegspunkte lassen sich in Node.js ohne DOM importieren. UI-Operationen benötigen weiterhin einen Browser oder eine unterstützte native Umgebung. Das Paket liefert ausschließlich ESM.

### Demo-Anwendung

Dieselbe Demo wird für beide unterstützten Ionic-Versionen bereitgestellt:

- [Ionic-9-Demo](https://ionic-theme-ios26.rdlabo.dev) — maßgebliche Version
- [Ionic-8-Demo](https://ionic8-theme-ios26.rdlabo.dev) — Kompatibilitätsversion

Das Verzeichnis `demo/` enthält die Angular-Anwendung für beide Bereitstellungen. So führen Sie sie lokal aus:

```bash
cd demo
npm install
npm start
```

### Visuelle Regressionstests

Wir verwenden Playwright für visuelle Regressionstests, um eine einheitliche Gestaltung über alle Komponenten hinweg sicherzustellen. Die Testsuite erstellt automatisch Screenshots aller Routen im hellen und dunklen Modus.

#### Tests ausführen

```bash
cd demo

# Alle E2E-Tests ausführen
npm run test:e2e

# Tests im UI-Modus ausführen (interaktiv)
npm run test:e2e:ui

# Tests debuggen
npm run test:e2e:debug

# Referenz-Screenshots aktualisieren (bei beabsichtigten UI-Änderungen)
npm run test:e2e:update
```

### Kanäle für Vorabversionen

Ein offener Pull Request, der kein Entwurf ist, kann unter dem npm-Dist-Tag `beta` veröffentlicht werden, nachdem seine Workflows `Lint`, `E2E Screenshot Tests Pull Request` und `Package Candidate` erfolgreich waren. Ein Repository-Eigentümer oder Maintainer muss einen Kommentar hinzufügen, dessen vollständiger Inhalt lautet:

```text
/beta
```

Die Anforderung autorisiert ausschließlich den Head-SHA und Zielbranch des Pull Requests zum Zeitpunkt des Kommentars. Der Workflow prüft Eigentümer- oder Maintainer-Berechtigung, Head-SHA und Zielbranch unmittelbar vor der Veröffentlichung erneut. Jeder neue Commit oder Wechsel des Zielbranches macht die Anforderung ungültig. Der neue Zustand muss CI bestehen und einen neuen `/beta`-Kommentar eines Eigentümers oder Maintainers erhalten. Fork-Pull-Requests werden unterstützt. Pull Requests, die einen Workflow zur Freigabe von Veröffentlichungen ändern, können erst als Beta veröffentlicht werden, nachdem diese Workflow-Änderungen im Zielbranch angekommen sind.

Beta-Versionen verwenden `<base>-beta.pr<PR number>.sha<12-character SHA>`. Der Pull Request erhält einen Kommentar mit der unveränderlichen Version und dem genauen `npm install`-Befehl.

Wird ein Pull Request in `main` oder `ios26` gemergt, wird er erst dann automatisch unter dem npm-Dist-Tag `beta` veröffentlicht, wenn `Lint`, `E2E Screenshot Tests` und `Package Candidate` für genau diesen Merge-Commit erfolgreich sind. Direkte Pushes veröffentlichen keinen Kandidaten. Merge-Kandidaten verwenden `<base>-beta.pr<PR number>.sha<12-character SHA>`; der gemergte Pull Request erhält den genauen Installationsbefehl.

Kandidatencode wird in einem schreibgeschützten Workflow ohne npm-Veröffentlichungszugangsdaten gebaut. Der privilegierte Release-Workflow checkt Pull-Request-Code niemals aus und führt ihn nicht aus. Er prüft Quellworkflow und Paketidentität erneut und veröffentlicht anschließend ausschließlich das unveränderliche gepackte Artefakt mit deaktivierten Lebenszyklusskripten. Der Kommentar mit dem Installationsbefehl ist eine separate Benachrichtigung nach bestem Bemühen und kann eine erfolgreiche npm-Veröffentlichung nicht ungültig machen.

Nur `npm run release` kann ein Release-Tag erstellen. Stabile Tags `ios26-vX.Y.Z` für Major-, Minor- oder Patch-Releases werden unter npm `latest` veröffentlicht; Revisions-/Vorabversions-Tags unter `next`. Weder die Veröffentlichung unter `beta` noch unter `next` verändert den npm-Dist-Tag `latest`.

<!-- /rdlabo-docs-omit -->

<!-- rdlabo-docs-omit -->

## Maintainer

- [rdlabo](https://rdlabo.dev/)
<!-- /rdlabo-docs-omit -->
