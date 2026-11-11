---
title: "Erste Schritte"
sourceRevision: "a5bc0d556da0b580bbff6fcd573ba36d62ee9a846beac10df029f98c8c7e4e56"
---

# Ionic Theme Material Design 3

Ein CSS/JS-Theme für Ionic-Anwendungen mit Android Settings als visueller Referenz, das Ionics Komponenten-APIs und Farbsemantik bewahrt.

<!-- rdlabo-docs-pick -->

![Ionic-MD3-Theme mit der standardmäßigen Ionic-Palette unter Android 17](https://raw.githubusercontent.com/webview-native-ui/ionic-theme-md3/v9.2.2/screenshots/md3.png)

<!-- /rdlabo-docs-pick -->

Die Demo finden Sie hier: https://ionic-theme-md3.rdlabo.dev/

Für die Kompatibilität mit `@rdlabo/ionic-theme-ios27` entwickelt, sodass ein Markup-Baum beide Ionic-Modi gestalten kann.

## Installation

Verwenden Sie die [Einrichtungsanleitung](/docs/setup), um das Paket zu installieren, `@rdlabo/ionic-theme-md3/styles/theme.css` zu importieren und `md3ThemeConfig` per Spread in die Optionen Ihrer bestehenden Ionic-Initialisierung zu übernehmen. Ionic `>=8.8.0 <10` wird unterstützt. Apps mit älteren Ionic-Versionen können `@rdlabo/ionic-theme-md3@1.0.2` verwenden.

Folgen Sie für bestehende Apps der [optionalen Vereinfachung der Einrichtung](/docs/migration#optional-simplify-the-setup). Einzelne CSS-Dateien und Animationseinstellungen beschreibt die [Konfiguration](/docs/configuration).

### Android Settings-Darstellung

Das Theme bewahrt Ionics Farbsemantik und Schriftanpassungen der Anwendung. Standard-Toggles sind ohne Symbole. Die MD-Standardschrift nutzt lokal auf dem Gerät verfügbares Google Sans Flex mit üblichen Ersatzschriften und ist im Theme-CSS enthalten. Weder Schriftinitialisierungscode noch ein Capacitor-Plugin ist erforderlich. Zurück-Symbole bleiben Ionics Zuständigkeit.

Installation, Ersatzschriften und Komponenten-Anpassungen beschreibt [Android Settings-Darstellung](/docs/android-settings). Bestehende Nutzer sollten die [Migrationshinweise zu 9.2.0](/docs/migration#migrating-to-9.2.0%3A-android-settings-alignment) zu geänderten Toolbar-, Listen- und Toggle-Abmessungen lesen.

### Optional: MD3- und iOS-27-Themes gemeinsam verwenden

Folgen Sie der [kombinierten Theme-Konfiguration](/docs/configuration#use-md3-and-ios-27-together) für die Reihenfolge der Stylesheets und die plattformabhängige Auswahl der Animationen.

## Dokumentation

- [Einrichtung](/docs/setup) — das Theme mit dem Theme-Stylesheet und Konfigurationsobjekt installieren und konfigurieren.
- [Konfiguration](/docs/configuration) — einzelne Stylesheets, Animationen und die vorhandene Modusauswahl.

- [Dynamische Android-Farben](/docs/dynamic-colors) — optionale Material You-Einrichtung, helle/dunkle Darstellung, Lebenszyklus und Rollenzuordnung.
- [Farbsystem](/docs/color-system) — Ionic-Palettenstandards, optionale Material-Rollen und Farbzuordnungen für Komponenten.
- [Android Settings-Darstellung](/docs/android-settings) — Standardgeometrie, CSS-Standardschriften und Ionic-Anpassungen.
- [ion-item-group verwenden](https://docs.rdlabo.dev/projects/ionic-theme-md3/docs/using-ion-item-group) — gemeinsames Markup für eingerückte Listen in iOS 27 und MD3.
- [Besonderes Markup](https://docs.rdlabo.dev/projects/ionic-theme-md3/docs/special-markup) — optionale Komponentenkombinationen der Demo.
- [ESLint](https://docs.rdlabo.dev/projects/ionic-theme-md3/docs/eslint) — Listenstruktur mit ESLint-Regeln prüfen.
- [Migration](/docs/migration) — optionale Vereinfachung der Einrichtung und versionsspezifische Aktualisierungsschritte.

## Verwandte Projekte

Wenn Sie eine umfassendere Implementierung von Material Design 3 benötigen, könnte Sie auch Folgendes interessieren:

- **[md3-for-ionic](https://github.com/danielkleebinder/md3-for-ionic)** von danielkleebinder

> **Hinweis:** Dieses Theme ist gezielt auf Kompatibilität mit Ionics Designansatz und `@rdlabo/ionic-theme-ios27` ausgelegt; es soll MD3 nicht streng und vollständig nachbilden.

<!-- rdlabo-docs-omit -->

**Vollständige Dokumentation:** [https://docs.rdlabo.dev/projects/ionic-theme-md3](https://docs.rdlabo.dev/projects/ionic-theme-md3)

## Entwicklung und Tests

### JavaScript-Modul-Builds

Belassen Sie relative Imports im TypeScript-Quellcode ohne Dateiendung, entsprechend dem Quellcodestil von Ionic. Die gemeinsame CLI `rdlabo-build-theme` aus `@rdlabo/ionic-theme-utils` verwendet tsdown, um Imports beim Erzeugen von ESM-JavaScript und Typdeklarationen aufzulösen. Abhängigkeiten bleiben extern; die Quelldateien werden nicht umgeschrieben.

Führen Sie `npm run build && npm run test:esm` aus, um das npm-Tarball zu erstellen und mit der gemeinsamen CLI `rdlabo-check-esm` zu prüfen. Öffentliche JavaScript-Einstiegspunkte lassen sich in Node.js ohne DOM importieren. UI-Operationen benötigen weiterhin einen Browser oder eine unterstützte native Umgebung. Das Paket liefert ausschließlich ESM.

### Demo-Anwendung

Dieselbe Demo wird für beide unterstützten Ionic-Versionen bereitgestellt:

- [Ionic-9-Demo](https://ionic-theme-md3.rdlabo.dev) — maßgebliche Version
- [Ionic-8-Demo](https://ionic8-theme-md3.rdlabo.dev) — Kompatibilitätsversion

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

# Fordern Sie Referenzaktualisierungen für eine PR mit einem /update-screenshots-Kommentar an.
# Prüfen Sie die CI-generierten Änderungen vor der Übernahme.
```

### Kanäle für Vorabversionen

Ein offener Pull Request, der kein Entwurf ist, kann unter dem npm-Dist-Tag `beta` veröffentlicht werden, nachdem seine Workflows `Lint`, `E2E Screenshot Tests Pull Request` und `Package Candidate` erfolgreich waren. Ein Repository-Eigentümer oder Maintainer muss einen Kommentar hinzufügen, dessen vollständiger Inhalt lautet:

```text
/beta
```

Die Anforderung autorisiert ausschließlich den Head-SHA des Pull Requests zum Zeitpunkt des Kommentars. Der Workflow prüft Eigentümer- oder Maintainer-Berechtigung und Head-SHA unmittelbar vor der Veröffentlichung erneut. Jeder neue Commit macht die Anforderung ungültig, unabhängig von seinem Autor. Der neue SHA muss CI bestehen und einen neuen `/beta`-Kommentar eines Eigentümers oder Maintainers erhalten. Fork-Pull-Requests werden unterstützt. Pull Requests, die einen Workflow zur Freigabe von Veröffentlichungen ändern, können erst als Beta veröffentlicht werden, nachdem diese Workflow-Änderungen in `main` angekommen sind.

Beta-Versionen verwenden `<base>-beta.pr<PR number>.sha<12-character SHA>`. Der Pull Request erhält einen Kommentar mit der unveränderlichen Version und dem genauen `npm install`-Befehl.

Wird ein Pull Request in `main` gemergt, wird er erst dann automatisch unter dem npm-Dist-Tag `beta` veröffentlicht, wenn `Lint`, `E2E Screenshot Tests` und `Package Candidate` für genau diesen Merge-Commit erfolgreich sind. Direkte Pushes auf `main` veröffentlichen keinen Kandidaten. Merge-Kandidaten verwenden `<base>-beta.pr<PR number>.sha<12-character SHA>`; der gemergte Pull Request erhält den genauen Installationsbefehl.

Kandidatencode wird in einem schreibgeschützten Workflow ohne npm-Veröffentlichungszugangsdaten gebaut. Der privilegierte Release-Workflow checkt Pull-Request-Code niemals aus und führt ihn nicht aus. Er prüft Quellworkflow und Paketidentität erneut und veröffentlicht anschließend ausschließlich das unveränderliche gepackte Artefakt mit deaktivierten Lebenszyklusskripten. Der Kommentar mit dem Installationsbefehl ist eine separate Benachrichtigung nach bestem Bemühen und kann eine erfolgreiche npm-Veröffentlichung nicht ungültig machen.

Nur `npm run release` kann ein Release-Tag erstellen. Stabile Tags `vX.Y.Z` für Major-, Minor- oder Patch-Releases werden unter npm `latest` veröffentlicht; Revisions-/Vorabversions-Tags unter `next`. Weder die Veröffentlichung unter `beta` noch unter `next` verändert den npm-Dist-Tag `latest`.

<!-- /rdlabo-docs-omit -->

<!-- rdlabo-docs-omit -->

## Maintainer

- [rdlabo](https://rdlabo.dev/)
<!-- /rdlabo-docs-omit -->
