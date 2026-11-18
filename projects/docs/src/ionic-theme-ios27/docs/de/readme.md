---
title: "Erste Schritte"
sourceRevision: "7340ece4c80437455dcad07cad5def0cdb3b564fba7a8717de8392e9719df36f"
---

Verwenden Sie Liquid Glass und die iOS-27-Animationen in Ionic-Komponenten.

[Einrichtung](setup.md) · [Web-Demo](https://ionic-theme-ios27.rdlabo.dev/)

Die Beispiele verwenden Ionic 9. Importieren Sie unter Ionic 8 mit Angular `provideIonicAngular` aus `@ionic/angular/standalone`.

<!-- rdlabo-docs-pick -->

<p>
  <img src="https://raw.githubusercontent.com/webview-native-ui/ionic-theme-ios27/c70beb9d1e5b39de696b2b2c47a3d9bc5ffcdfbe/screenshots/ios27-settings.png" width="32%" alt="iOS-27-Theme: Einstellungen im hellen Modus mit einer Liquid Glass-Suchleiste" />
  <img src="https://raw.githubusercontent.com/webview-native-ui/ionic-theme-ios27/c70beb9d1e5b39de696b2b2c47a3d9bc5ffcdfbe/screenshots/ios27-settings-dark.png" width="32%" alt="iOS-27-Theme: Einstellungen im dunklen Modus" />
  <img src="https://raw.githubusercontent.com/webview-native-ui/ionic-theme-ios27/c70beb9d1e5b39de696b2b2c47a3d9bc5ffcdfbe/screenshots/ios27-library.png" width="32%" alt="iOS-27-Theme: Bibliothek mit Liquid Glass-Schaltflächen und Tab-Leiste" />
</p>

<!-- /rdlabo-docs-pick -->

<a id="erste-schritte"></a><a id="get-started"></a>

## Was möchten Sie tun?

Übergeben Sie bei Cordova zuerst `ios27ThemeConfig` an Ionic und richten Sie dann die [Cordova-Anbindung](cordova.md) ein.

| Ziel | Anleitung |
| --- | --- |
| Eine bestehende Ionic-App gestalten | [Erste Schritte](https://webview-native-ui.com/projects/ionic-theme-ios27/docs/setup) |
| iOS-26/27-Stile und optional MD3 auswählen | [Adaptive Themes](https://webview-native-ui.com/projects/ionic-theme-ios27/docs/adaptive-themes) |
| Native iOS-Steuerelemente zu einer Capacitor-App hinzufügen | [Native UI hinzufügen](https://webview-native-ui.com/projects/ionic-theme-ios27/docs/add-native-ui) |
| Ionic um eine Seitenleiste ergänzen und das eigene Theme behalten | [Vertical Bars Schritt für Schritt](https://webview-native-ui.com/projects/capacitor-native-ui/docs/ionic-vertical-bars) |
| Optional: Theme und Native UI mit Cordova nutzen | [Cordova einrichten](/docs/cordova) |
| Stile, Dunkelmodus und Animationen einzeln konfigurieren | [Konfiguration](/docs/configuration) |
| Eine bestehende Installation aktualisieren | [Migration](https://webview-native-ui.com/projects/ionic-theme-ios27/docs/migration) |

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

Installieren Sie das iOS-Theme separat, wenn Ihre App es verwendet. Siehe [Theme für Cordova einrichten](cordova.md).

Um ein unveröffentlichtes Plugin-Archiv mit der echten Demo zu prüfen, führen Sie Folgendes aus:

```sh
npm run test:native-candidate -- /absolute/path/rdlabo-capacitor-native-ui-VERSION.tgz --e2e
```

Dies erstellt einen isolierten temporären Checkout und lässt Ihre Manifeste und Lockfiles unverändert. Ergänzen Sie `--shard=1/2` neben `--e2e`, um einen Playwright-Shard auszuführen; führen Sie alle Shards aus, um die gesamte Suite abzudecken. Jeder Shard umfasst weiterhin Paketprüfungen, Unit-Tests und den Produktionsbuild. Ergänzen Sie `--simulator=UDID` für die Simulator-Suiten für native UI, Suche und Ränder. Diagnoseinformationen und die temporäre Demo bleiben unter dem ausgegebenen Pfad erhalten. Plugin-spezifische Unit-Tests und native Bibliothekstests liegen im Plugin-Repository. Dessen CI testet jedes Kandidatenarchiv gegen den main-Branch dieses Repositorys.

## Wartung

Veröffentlichen Sie das Theme-Paket im Repository-Stamm mit `npm run release` von einem sauberen, aktuellen `main`. Der Workflow für `ios27-v…`-Tags veröffentlicht nur das Theme, mit `next` für Vorabversionen und `latest` für stabile Versionen.

Theme und Plugin werden unabhängig versioniert. Beim eigenständigen Paket `@rdlabo/ionic-theme-ios27` ist Capacitor Native UI eine erforderliche Peer-Abhängigkeit, damit Theme und Anwendung dieselbe Plugin-Instanz nutzen. npm 7+ installiert sie bei reinen Theme-Apps automatisch; bei anderen Paketmanagern müssen erforderliche Peer-Abhängigkeiten installiert werden. Apps mit nativen Steuerelementen müssen das Plugin zusätzlich direkt deklarieren, damit Capacitor es erkennt. Eine veröffentlichte npm-Version kann nicht überschrieben werden.
