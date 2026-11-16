---
title: "Entwicklung und Veröffentlichungen"
sourceRevision: "0f1122357e2783205b137a54a18c5240b8ce3a79609fd694d77b917119561407"
---

# Entwicklung und Veröffentlichungen

Verwenden Sie diesen Leitfaden, wenn Sie die Engine selbst ändern oder veröffentlichen. Ein nativer Verbraucher kann ohne Node.js bauen, daher müssen Quelländerungen die gebündelte Laufzeit neu erzeugen. Ein Release kann npm erreichen, bevor Maven-Artefakte heruntergeladen werden können; deshalb werden Annahme der Veröffentlichung und Downloadbereitschaft für Verbraucher unten getrennt geprüft.

## Entwicklung

Die öffentlichen Einstiegspunkte sind `src/index.ts` und `src/ionic.ts`; gemeinsame Verträge stehen in `src/types.ts`. Die Implementierung ist nach Verantwortungsbereichen gegliedert:

- `src/native/`: Bridge-Transport, native Sitzungen, Start und Ressourcen-URLs.
- `src/projection/`: Bildübergabe, Projektionszuständigkeit, Ereignisse und Stile.
- `src/dom/`: Geometrie, Scrollen, Sichtbarkeit und Overlay-Koordination.

`npm run build` bündelt `src/native/bootstrap.ts` zu `runtime/native-ui-engine.js`, der gemeinsamen WebView-Laufzeit. Android verpackt diese Datei direkt als Asset. Der Build kopiert sie außerdem nach `ios/Sources/WebViewNativeUIEngine/Resources`, da SwiftPM Ressourcen innerhalb des Zielverzeichnisses verlangt. Beide generierten Dateien werden während der Entwicklung ignoriert und in Release-Tags aufgenommen, damit SwiftPM-Verbraucher kein Node.js benötigen. Führen Sie `npm run build` aus, bevor Sie einen Quell-Checkout mit Xcode bauen. Bearbeiten Sie die TypeScript-Quelle, keine der generierten Dateien; CI prüft die Neugenerierung und die in npm- und Maven-Archiven enthaltene Laufzeit.

Tests folgen der Verantwortung, die sie schützen:

- Browser-Tests unter `tests/native`, `tests/projection` und `tests/dom` schützen Bridge-, Geometrie- und Bildlebenszyklus-Verträge. `tests/cordova/` prüft einen echten Verbraucher.
- Tests unter `tests/controls` prüfen Ionic-Erkennung, Quell-/Proxy-Auswahl, Seiten-/Modal-Isolation und Adapter-Ereignisweiterleitung. Allgemeine Engine-Timing- oder Bildzustandstests bleiben in ihrer zuständigen Schicht statt sie über Controls zu wiederholen.
- Swift- und Android-Tests prüfen native Aufnahme, ursprüngliche SDK-Eingaben, Clipping und Abbau. Browser-Mocks beweisen weder natives Zeichnen noch Tap-/Langdruck-Zustellung.

Regressionen sollen bei benutzersichtbaren Vertragsverletzungen fehlschlagen. Bevorzugen Sie Ausgabe, Ressourcenbesitz und Eingabezustellung gegenüber privatem Zustand, exakten Callback-Zahlen oder dem Rückgabewert einer void-Methode. Zählungen sind sinnvoll, wenn der Vertrag genau eine Registrierung oder Zustellung verspricht. Verwenden Sie benannte Fixture-Optionen und erweitern Sie vorhandene Fälle, wenn sie dieselbe Grenze ohne neues Setup schützen. Prüfen Sie lange Browser-Timer-Grenzen mit kontrollierter Uhr; tatsächliche SDK-Eingabeerkennung bleibt in nativen Tests.

Verwenden Sie wie CI Node.js 24. Führen Sie im Repository Folgendes aus:

```sh
npm ci
npm run build
npm run lint
npx playwright install chromium
npm test
```

Lint kombiniert strikte TypeScript-Prüfung, die empfohlenen Standardregeln von ESLint/TypeScript und typisierte Promise-Prüfungen für `src`. Skripte und Tests erhalten Syntax-Linting; Prettier übernimmt die Formatierung. `npm run format` formatiert ausschließlich. Bridge-Payloads und Test-Doubles dürfen explizites `any` verwenden; die Validierung an Produktionsgrenzen bleibt erforderlich. Ein explizites `void` kennzeichnet Hintergrundarbeit, behandelt aber keine abgewiesene Promise.

Native Prüfungen laufen in ihren Plattform-CI-Jobs: `npm run lint:swift` verwendet node-swiftlint mit der Capacitor-Konfiguration unter macOS (`brew install swiftlint`); `npm run lint:android` führt Kotlin-Formatierungsprüfungen und Android Lint mit Warnungen als Fehlern aus (JDK 21 und Android SDK 36). Verwenden Sie `npm run format:swift` und `npm run format:kotlin`, um native Formatierung anzuwenden. Kotlin nutzt ktfmt, weil das Prettier-Kotlin-Plugin die bestehende native Test-Fixture nicht parsen kann.

Die Swift-CI verteilt unabhängige Arbeit auf `swift-package`, `ios-integration` und `ios-consumers`; der bestehende `swift`-Check verlangt alle drei Erfolge. Package-Tests prüfen deterministische native Ansichten, Aufnahmebesitz und Kodierungsverträge. Reale WKWebView-Navigation, Scroll-Verfolgung, aktive UIKit-Präsentationen und die Bildschirm-Bildpipeline laufen in `NativeUIHostedTests` mit UIApplication. CocoaPod- und Cordova-Verbraucherprüfungen laufen als parallele Matrix unter `ios-consumers`; `swift` verlangt beide. Beide nativen Testauswahlen führen ihre zugewiesenen Suiten einschließlich anwendungsgebundener Fälle aus. Der Simulator startet nach Node.js-Setup und Runtime-Generierung, ohne mit der Abhängigkeitsvorbereitung zu konkurrieren; jeder Job testet seriell auf seinem Gerät. Für die Simulatorbereitschaft gelten zwei Minuten bei Package und Hosted, für Tests fünf Minuten pro Suite und für macOS-Jobs zwölf Minuten. Fehlgeschlagene Läufe behalten `.xcresult`-Bundles. `-collect-test-diagnostics never` vermeidet laut [Apple](https://developer.apple.com/forums/thread/698054) die langsame Systemdiagnose nach Fehlern; Fehler, Assertions und Fixture-Zustand bleiben im Ergebnis. Kein automatischer Retry verdeckt Fehler.

Die genauen Package-Ausschlüsse stehen in `.github/workflows/native-ui-engine.yml`; die Hosted-Auswahl steht in `ios/Tests/project.yml` und nutzt [XcodeGens Testauswahl](https://github.com/yonaskolb/XcodeGen/blob/master/Docs/ProjectSpec.md#test-target). Prüfen Sie beim Verschieben zwischen Umgebungen, dass die ausgeführten Mengen disjunkt bleiben und ihre Vereinigung die gesamte Suite erhält. Hosted-Auswahl lokal ausführen:

```sh
xcodegen generate --spec ios/Tests/project.yml
xcodebuild -project ios/Tests/NativeUIControlsHostedTests.xcodeproj -scheme NativeUIHostedTests -destination 'platform=iOS Simulator,id=<booted simulator UUID>' -parallel-testing-enabled NO test
```

Diese Prüfungen schließen native Tests und Cordova-Fixtures ein. Swift-API-Dokumentation verwendet `///`; Implementierungshinweise verwenden `//`. Swift-Heuristiken zu Größe/Komplexität erzwingen weder Aufteilungen von Zustandsautomaten noch Änderungen öffentlicher APIs; erzwungenes Entpacken/Casts nur in Fixtures sind erlaubt, während Produktionscode die Prüfungen beibehält. Swift wird außerdem auf einem iOS-Simulator kompiliert und getestet.

Die Engine wird unabhängig von ihren Verbrauchern versioniert. Die Veröffentlichungsreihenfolge lautet Annahme der Maven-Veröffentlichung → npm-Engine; Verbraucher aktualisieren separat. npm-Releases erfordern einen erfolgreichen Maven-Veröffentlichungsworkflow für genau den getaggten Commit. Die Verteilung über Maven Central kann noch ausstehen: Android-Verbraucher müssen warten, bis das passende POM und AAR heruntergeladen werden können, während iOS- und Web-Verbraucher sofort aktualisieren können. Build- und Testbefehle veröffentlichen nichts. Tests decken reines DOM, Geometrie mit Nachkommastellen und RTL, veraltete ACKs, Bildzuständigkeit und natives WKWebView-Scrolltracking ab; Verbrauchertests bleiben für Ionic-/SDK-Integration verantwortlich.

CI-spezifische Einrichtung, Paketierungsbefehle und GitHub-Ausgaben sind in `.github/workflows/` definiert. Die Skripte enthalten weiterhin den Laufzeitbuild, wiederverwendbare Verbraucher-/Paketprüfungen und getestete Veröffentlichungslogik (Central-Zustandsbehandlung und npm-Artefaktvergleich).

## Maven-Veröffentlichung

Der Workflow `Native UI Engine Maven Release` wird auf dem Release-Tag manuell mit der exakten Engine-Paketversion gestartet. Der getaggte Commit muss zuvor die CI `Native UI Engine` bestehen. Der Workflow signiert ein AAR, ein Quellarchiv, generierte Kotlin-API-Dokumentation und Maven-Metadaten, lädt einmal hoch und endet, sobald Central `PUBLISHING` oder `PUBLISHED` meldet. Deployment-ID und Zustandsänderungen stehen in der Ausführungszusammenfassung. `PUBLISHING` bedeutet erfolgreiche Validierung und Annahme der Veröffentlichung durch Central; es garantiert noch keine herunterladbaren Artefakte. Dieser Workflow wartet nicht auf die Verteilung. Das npm-Release prüft, ob dieser Workflow für genau den Release-Commit erfolgreich war; es wartet nicht auf die Verteilung über Maven Central. Bestehende Koordinaten werden nie überschrieben; prüfen Sie nach einem Upload-Timeout das verzeichnete Deployment in Central vor weiteren Maßnahmen.

Konfigurieren Sie die Actions-Secrets des Repositorys mit `CENTRAL_USERNAME`, `CENTRAL_PASSWORD` (Central-Benutzertoken), `MAVEN_SIGNING_KEY` (ASCII-armierter privater Schlüssel) und `MAVEN_SIGNING_PASSWORD`. Der öffentliche Signaturschlüssel muss für Central verfügbar sein. GitHub-Secrets gelten nur für dieses Repository.

Führen Sie zur lokalen Paketierungsprüfung `python3 scripts/native-ui-engine-release/verify.py` mit JDK 21, Android SDK 36 und GnuPG aus. Das Skript erzeugt einen temporären Schlüssel, validiert Signaturen und Prüfsummen und löscht seine Test-ZIP ohne Upload. Veröffentlichungen bauen stets mit bereinigten Ausgaben und dem echten Signaturschlüssel neu. Veröffentlichen Sie das Maven-Artefakt vor dem entsprechenden npm-Release, auch bei Vorabversionen.

## Release-Einrichtung für Maintainer

Veröffentlichen Sie dieselbe Version für npm, SwiftPM und Maven; Verbraucher pinnen übereinstimmende Versionen über diese Verteilungswege hinweg.

Die npm-Organisation `webview-native-ui` und der Maven-Central-Namensraum `io.github.webview-native-ui` sind registriert. Pflegen Sie npm Trusted Publishing für `webview-native-ui/engine`, Workflow `release.yml`, und richten Sie die oben genannten Maven-Secrets in diesem Repository ein. Das Verschieben von Quelldateien kopiert keine Zugangsdaten.

1. Starten Sie **Prepare release** (`prepare-release.yml`) auf `main` und wählen Sie `major`, `minor`, `patch` oder `revision`. Kein lokaler Build, Commit oder Tag ist nötig.
2. Der Workflow erhöht die Version mit npm, baut und prüft das Paket und pusht einen main-Commit, der nur die Version ändert, sowie einen separaten Release-Commit/Tag mit den generierten Ressourcen. Er startet explizit die Validierung `Native UI Engine` auf diesem Tag und erstellt einen GitHub-Release-Entwurf mit generierten Release Notes.
3. Prüfen und bearbeiten Sie die Release Notes. Starten Sie nach erfolgreicher Tag-Validierung `native-ui-engine-release.yml` auf diesem Tag mit der exakten Paketversion.
4. Veröffentlichen Sie nach erfolgreicher Maven-Veröffentlichung den GitHub-Release-Entwurf. Central `PUBLISHING` bedeutet angenommener Upload, keine Downloadbereitschaft; weisen Sie in den Release Notes auf eine noch ausstehende Android-Verteilung hin. `release.yml` prüft Tag, Paketversion, Tag-CI und Maven-Annahme vor der Veröffentlichung auf npm (`next` für Revisionen, `latest` für stabile Releases).

Die Versionserhöhung folgt den SemVer-Regeln von npm; `revision` wird auf `prerelease` abgebildet:

| Aktuell | Auswahl | Danach |
| --- | --- | --- |
| `1.2.3` | major | `2.0.0` |
| `1.2.3` | minor | `1.3.0` |
| `1.2.3` | patch | `1.2.4` |
| `1.2.3` | revision | `1.2.4-0` |
| `1.2.4-0` | revision | `1.2.4-1` |
| `1.2.4-2` | patch | `1.2.4` |
| `1.3.0-2` | minor | `1.3.0` |
| `2.0.0-2` | major | `2.0.0` |

Commits der generierten Laufzeit gelangen niemals in die main-Historie. Die CI-Vorbereitung pusht main und den Release-Tag atomar, ohne Force-Push. Die Veröffentlichung akzeptiert nur einen getaggten direkten Nachfolge-Commit von main, der die beiden generierten Ressourcen hinzufügt und keine anderen Dateien ändert. npm baut und prüft die Laufzeit vor der Veröffentlichung neu; Maven paketiert die Laufzeit aus demselben getesteten Tag.

Schlägt die Vorbereitung vor dem Push fehl, führen Sie sie erneut aus. Wurden main und der Tag bereits gepusht, starten Sie die Vorbereitung nicht erneut (dies würde eine weitere Version anfordern) und verschieben Sie den Tag nicht. Starten Sie `Native UI Engine` manuell auf dem bestehenden Tag, falls die Validierung nicht gestartet wurde, und erstellen Sie den Release-Entwurf für diesen Tag, falls er fehlt. Damit lassen sich auch Fehler zwischen Push, Validierungsstart und Entwurfserstellung beheben. Bestehende Tags und veröffentlichte Artefakte werden niemals überschrieben.

Kein Build- oder Testbefehl veröffentlicht ein Paket. Bestehende npm-/Maven-Versionen werden nie überschrieben.

Wählen Sie zur erneuten Release-Prüfung eines bestehenden Tags diesen Tag sowohl als Workflow-Ref als auch als `tag`-Eingabe: `gh workflow run release.yml --ref vX.Y.Z -f tag=vX.Y.Z`. Dadurch wird der in diesem Release gespeicherte Workflow verwendet, auch für ältere Tags vor der Einführung separater Release-Commits. Geprüft wird der ursprüngliche getaggte Commit; die npm-Veröffentlichung wird nur übersprungen, wenn die vorhandenen Paketinhalte übereinstimmen. Lassen Sie den Tag unverändert. Die Release-Werkzeuge verwenden das mit Node.js 24 gelieferte npm, entsprechend CI.

[Dokumentationsübersicht](README.md)

## Native PNG-Artefakte

Die eingecheckten nativen Artefakte erlauben Builds ohne Rust oder NDK. Änderungen an Rust-Codec, C-Header oder JNI-Shim müssen im selben Änderungssatz alle Binärdateien neu erzeugen.

Verwenden Sie Rust 1.99.1 (festgelegte CI-Toolchain), Xcode unter macOS und Android NDK 29. Installieren Sie die Rust-Ziele `aarch64-apple-ios`, `aarch64-apple-ios-sim`, `x86_64-apple-ios`, `aarch64-linux-android`, `armv7-linux-androideabi`, `i686-linux-android` und `x86_64-linux-android`. Führen Sie dann Folgendes aus:

```sh
cargo test --locked --manifest-path native/png/Cargo.toml
cargo clippy --locked --manifest-path native/png/Cargo.toml --all-targets -- -D warnings
python3 scripts/build-native-png.py --ndk "$ANDROID_NDK_HOME"
python3 scripts/verify-native-png.py
npm run build
npm run test:package
```

Committen Sie `native/png`, `native/include`, `native/android`, `native/artifacts`, `native/licenses` und gemeinsame iOS-Lizenzressourcen zusammen. Das XCFramework enthält arm64-Geräte und arm64/x86_64-Simulatoren. Das Android-Artefakt enthält arm64-v8a, armeabi-v7a, x86 und x86_64 mit 16-KiB-ELF-Ausrichtung sowie Consumer-Regeln zum Erhalt der JNI-Namen. Hinweise für Rust-Abhängigkeiten und Standardbibliothek werden ausschließlich unter `ios/Sources/WebViewNativeUIEngine/Resources/NativeUIPngLicenses` gepflegt und von SwiftPM und CocoaPods direkt eingebunden. Android kopiert dasselbe Verzeichnis in generierte Ressourcen und Quellarchiv. `native/licenses` enthält nur Android-NDK-Hinweise; committen Sie keine zweite Kopie gemeinsamer Hinweise. Das Quell-/Binär-Hashmanifest weist veraltete Kombinationen vor der Paketierung zurück. `--platform ios` oder `android` erleichtert lokale Iterationen; ein Release muss einen vollständigen Build und die Prüfung von `all-build.json` abschließen.

Wenn andere Geräte verbunden sind, müssen Android-Tests den gewünschten Emulator explizit auswählen:

```sh
ANDROID_SERIAL=emulator-5554 android/gradlew -p android :connectedDebugAndroidTest
```

Der Integrationstest zur Bildwiederverwendung prüft Bewegung, Inhaltsinvalidierung, Übergabe und Dateibereinigung auf dem angegebenen iOS-Simulator:

```sh
python3 scripts/verify-image-reuse.py --device <booted-simulator-UUID>
```
