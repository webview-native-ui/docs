---
title: "App-lokale Native UI-Erweiterungen (experimentell)"
sourceRevision: "8ed9efef934cec6179f6b54595742d650160dbcd0ffb482707d6b4b295f0b010"
---

# App-lokale Native UI-Erweiterungen (experimentell)

> **Experimentell:** Erweiterungs-API, native Registrierungsschnittstellen und Verhalten können sich in zukünftigen Releases ändern. Dies gilt für SwiftUI- und Kotlin-/Compose-Erweiterungen einschließlich der Positionen `element` und `tab-accessory`.

Eine Erweiterung projiziert Ihre bestehende Web-Oberfläche in eine SwiftUI-View unter iOS oder Jetpack-Compose-Inhalte unter Android. Beide Definitionen bleiben in Ihrer Anwendung: Ein npm-Paket, eine separate Bibliothek oder ein Capacitor-Plugin sind nicht erforderlich. Das Web-Element bleibt maßgebliche Quelle und Fallback-Oberfläche.

Erweiterungen verwenden dasselbe [Projektionsmodell](../README.md#how-projection-works) wie integrierte Bedienelemente. Definieren Sie die bereitzustellenden DOM-Daten und Aktionen und anschließend deren native Darstellung.

## Vorbereitungen

Beginnen Sie mit einer bestehenden Capacitor-8-App und installieren Sie das Plugin, falls noch nicht geschehen:

```sh
npm install @rdlabo/capacitor-native-ui @erkamyaman/capacitor-foldable
```

Wählen Sie die zu unterstützende native Plattform:

- **Android:** Verwenden Sie Ihr Capacitor-Android-Projekt und ein Gerät oder einen Emulator mit API 24+. Folgen Sie Schritt 1, der [Kotlin-/Compose-Registrierung](#2b-register-compose-content-on-android) und den Schritten 3–4. iOS-Projekt, Xcode, Ionic und Theme-Paket sind nicht erforderlich.
- **iOS:** Verwenden Sie Ihr Capacitor-iOS-Projekt, Xcode 26+ und ein iOS-26+-Gerät oder einen Simulator. Folgen Sie Schritt 1, der [SwiftUI-Registrierung](#2a-register-a-swiftui-view-on-ios) und den Schritten 3–4. Für zusätzliche Standardbedienelemente folgen Sie [Ionic-Einrichtung](setup.md) oder [HTML-Einrichtung](framework-independent.md).
- **Beide:** Verwenden Sie den DOM-Reader aus Schritt 1 gemeinsam und registrieren Sie auf jeder Plattform native Inhalte unter demselben Namen.

Die folgenden TypeScript-Beispiele verwenden den Ionic-Einstiegspunkt. Importieren Sie ohne Ionic sowohl `defineNativeUI` als auch `enableNativeUI` aus `@rdlabo/capacitor-native-ui/core`.

## 1. Einen DOM-Reader definieren

```ts
// src/native-ui/counter.ts
import { defineNativeUI } from '@rdlabo/capacitor-native-ui';

export const counter = defineNativeUI({
  name: 'app.counter',
  selector: '[data-counter]',
  read(element) {
    return {
      props: { count: Number(element.getAttribute('data-count') ?? 0) },
      actions: { increment: element.querySelector<HTMLButtonElement>('button') },
    };
  },
});
```

Verwenden Sie beispielsweise diese Web-Quelle. Ihr reservierter Platz nimmt auch native Inhalte und einen Aktionsfehler auf:

```html
<div data-counter data-count="0" style="width: 280px; min-height: 128px">
  <p data-count-label>Count: 0</p>
  <button type="button">Increment</button>
</div>
```

Lassen Sie den Klickhandler Ihres Frameworks den Zähler und `data-count` aktualisieren. Bei reinem HTML reicht Folgendes:

```ts
const source = document.querySelector<HTMLElement>('[data-counter]')!;
source.querySelector('button')!.addEventListener('click', () => {
  const count = Number(source.dataset.count ?? 0) + 1;
  source.dataset.count = String(count);
  source.querySelector('[data-count-label]')!.textContent = `Count: ${count}`;
});
```

Die Shell beobachtet DOM-Änderungen und sendet neue Props an den nativen Inhalt. In DOM-Attribute oder Text gerenderter Zustand wird automatisch beobachtet. Bei vom Reader gelesenen Eigenschaften oder externem Zustand ohne DOM-Mutation rufen Sie nach Änderungen `shell.markForCheck()` auf.

## 2a. Eine SwiftUI-View unter iOS registrieren

Führen Sie bei CocoaPods-Projekten zunächst die [Engine-Podfile-Einrichtung](https://docs.rdlabo.dev/projects/capacitor-native-ui/docs/setup#4-build-sync-and-run) durch. SwiftPM löst Engine automatisch auf.

Führen Sie nach der Plugin-Installation `npx cap sync ios` aus und fügen Sie eine Swift-Datei zum Xcode-Target der Anwendung hinzu. Importieren Sie `NativeUIPlugin`, das von `@rdlabo/capacitor-native-ui` bereitgestellte Modul. Behalten Sie Ihre bestehende SPM- oder CocoaPods-Integration.

```swift
import SwiftUI
import NativeUIPlugin

struct CounterProps: Decodable {
    let count: Int
}

struct CounterView: View {
    let props: CounterProps
    let actions: NativeUIActions
    @State private var error: String?

    var body: some View {
        HStack {
            Text("Count: \(props.count)")
            Button("Increment") {
                Task { @MainActor in
                    do {
                        try await actions.activate("increment")
                        error = nil
                    } catch {
                        self.error = "Action unavailable"
                    }
                }
            }
            .disabled(!actions.isAvailable("increment"))
            if let error { Text(error) }
        }
    }
}

@MainActor func registerAppNativeUI() throws {
    try NativeUI.register("app.counter") {
        (props: CounterProps, actions: NativeUIActions) in
        CounterView(props: props, actions: actions)
    }
}
```

Rufen Sie `registerAppNativeUI()` einmal aus `application(_:didFinishLaunchingWithOptions:)` auf, bevor JavaScript die Shell aktiviert. Behandeln Sie dort Registrierungsfehler; doppelte oder leere Namen werden abgewiesen. Swift-Quellcode wird in die App kompiliert, daher erfordert das Hinzufügen oder Ändern einer View einen erneuten iOS-Build. Die Registrierung ist eine synchrone Einrichtung, kein nativer Bridge-Befehl.

## 2b. Compose-Inhalte unter Android registrieren

Android unterstützt **nur Elementerweiterungen**. Standard-Ionic- und HTML-Bedienelemente bleiben im Web, einschließlich explizit markierter Schaltflächen. Native Vertical Bars und `tab-accessory` sind iOS-Funktionen; Android kann eine Web-Seitenleiste mit Elementerweiterungen kombinieren. Derselbe DOM-Reader, Props, Aktionsziele und `markForCheck()` funktionieren auf beiden Plattformen.

Führen Sie nach der Plugin-Installation `npx cap sync android` aus. Verwenden Sie Kotlin in Ihrer Android-App. Ergänzen Sie im Stamm-`build.gradle` die Kotlin- und Compose-Compiler-Plugins unter `buildscript.dependencies`, mit derselben Kotlin-Version wie die App (Plugin-Standard: `2.2.20`). Definieren Sie im Stamm-`buildscript` `ext.kotlin_version = '2.2.20'`, falls noch nicht vorhanden:

```groovy
classpath "org.jetbrains.kotlin:kotlin-gradle-plugin:$kotlin_version"
classpath "org.jetbrains.kotlin:compose-compiler-gradle-plugin:$kotlin_version"
```

Wenden Sie in `app/build.gradle` `kotlin-android` und `org.jetbrains.kotlin.plugin.compose` an und aktivieren Sie `android { buildFeatures { compose true } }`. Die Native UI-Abhängigkeit stellt Compose UI und Foundation bereit; ergänzen Sie Material-Abhängigkeiten selbst, wenn Ihre Erweiterung sie verwendet.

Registrieren Sie einmal in `Application.onCreate()` auf dem Hauptthread, bevor JavaScript die Shell aktiviert. Verwenden Sie eine `Application`-Unterklasse, die mit `android:name=".App"` auf `<application>` in `AndroidManifest.xml` konfiguriert ist; registrieren Sie nicht bei jeder Neuerstellung der Activity.

```kotlin
import android.app.Application
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.text.BasicText
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.semantics.*
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.unit.dp
import dev.rdlabo.capacitor.nativeui.NativeUI
import kotlinx.coroutines.CancellationException
import kotlinx.coroutines.launch

class App : Application() {
    override fun onCreate() {
        super.onCreate()
        NativeUI.register(
            name = "app.counter",
            decode = { json -> json.getInt("count") },
        ) { count, actions, context ->
            val scope = rememberCoroutineScope()
            var error by remember { mutableStateOf<String?>(null) }
            val enabled = actions.isAvailable("increment")
            val foreground = if (context.dark) Color.White else Color.Black
            val background = if (context.dark) Color(0xFF202020) else Color.White
            val textStyle = TextStyle(color = foreground)
            Column(Modifier.fillMaxSize().background(background).padding(8.dp)) {
                BasicText("Count: $count", style = textStyle)
                Box(
                    Modifier.fillMaxWidth().heightIn(min = 48.dp)
                        .alpha(if (enabled) 1f else 0.5f)
                        .clickable(enabled = enabled, role = Role.Button, onClickLabel = "Increment count") {
                            scope.launch {
                                try {
                                    actions.activate("increment")
                                    error = null
                                } catch (cancelled: CancellationException) {
                                    throw cancelled
                                } catch (unavailable: IllegalStateException) {
                                    error = "Action unavailable. Try again."
                                }
                            }
                        },
                    contentAlignment = Alignment.Center,
                ) { BasicText("Increment", style = textStyle) }
                BasicText(
                    error ?: "",
                    modifier = Modifier.semantics { liveRegion = LiveRegionMode.Polite },
                    style = textStyle,
                )
            }
        }
    }
}
```

Die Shell positioniert und dimensioniert den Compose-Host anhand des Quell-DOM-Rechtecks. `context.sourceFrame` enthält CSS-Pixel; `sourceFrameInDp` enthält Compose-dp, mit `dpPerCSSPixel` als Umrechnungsfaktor. `sourceID` und `viewportWidth` beschreiben aktuelle Quelle und Viewport. `rtl` wird auch über `LocalLayoutDirection` angewendet; verwenden Sie `dark`, um das Compose-Theme Ihrer App auszuwählen. Wenden Sie `x` und `y` der Quelle nicht erneut innerhalb Ihres Inhalts an.

Der Callback `decode` läuft vor dem Akzeptieren der Projektion. Wirft er einen Fehler, bleibt diese Quelle im Web. Leere oder doppelte Registrierungsnamen werden abgewiesen. Compose-Inhalte verantworten eigene Stile und Barrierefreiheit. Erstellen Sie die Android-App nach Kotlin-Änderungen neu.

## 3. Mit lokalen Definitionen aktivieren

```ts
import { enableNativeUI } from '@rdlabo/capacitor-native-ui';
import { counter } from './native-ui/counter';

const shell = await enableNativeUI({ ionic: { auto: false }, extensions: [counter] });
```

Dieses Beispiel aktiviert Ihre Erweiterungen ohne automatische Projektion von Ionic-Bedienelementen. Explizite `data-native-ui`-Quellen bleiben aktiviert. Lassen Sie `ionic: { auto: false }` weg, um zusätzlich Standard-Ionic-Bedienelemente unter unterstütztem iOS zu projizieren. Android-Standardbedienelemente bleiben in beiden Fällen im Web.

Ersetzen Sie Ihren bestehenden Startaufruf durch den obigen; starten Sie keine zweite Shell. Verbinden Sie ihn anhand der [App-Root-Lebenszyklusbeispiele](setup.md#place-startup-in-your-frameworks-app-root) mit Ihrem Framework und ergänzen Sie diese Optionen im gemeinsamen Startaufruf.

Halten Sie Erweiterungsobjekte über wiederholte Aktivierungsaufrufe stabil. Änderungen an laufenden Erweiterungen erfordern zunächst `await shell.destroy()`. Erweiterungsnamen müssen innerhalb einer Aktivierung eindeutig sein. Registrieren Sie keine überlappenden Selektoren für dieselbe Quelle. Eine Erweiterung verwaltet ihren Quellteilbaum, daher werden integrierte Bedienelemente darin nicht separat projiziert.

## 4. Erweiterung erstellen und ausprobieren

Erstellen Sie die Web-Assets, synchronisieren Sie und erstellen Sie die konfigurierte Plattform erneut:

- **Android:** `npx cap sync android` ausführen, dann die App in Android Studio erstellen und starten. Der Zähler sollte mit Compose dargestellt werden.
- **iOS:** `npx cap sync ios` ausführen, dann die App in Xcode erstellen und starten. Unter iOS 26+ sollte der Zähler mit SwiftUI dargestellt werden.

Tippen Sie auf Increment: Der ursprüngliche Web-Handler sollte `data-count` aktualisieren und der native Zähler folgen. Im Browser sollte der ursprüngliche Web-Zähler weiterhin funktionieren.

Aktivieren Sie für quellenspezifische Fallback-Gründe vorübergehend [`debug: true`](configuration.md#understand-why-a-source-stays-on-the-web). Bleibt die Quelle im Web, prüfen Sie, ob die Registrierung vor der Shell-Aktivierung durch JavaScript läuft und Namen sowie Props auf beiden Seiten übereinstimmen. Prüfen Sie unter Android, ob Ihre `Application`-Unterklasse im Manifest deklariert ist; unter iOS, ob die Swift-Datei zum App-Target gehört.

## Referenz für Native-UI-Erweiterungen

- <a id="reader-vertrag"></a><a id="reader-contract"></a>[Reader-Vertrag](native-ui-extension-reference.md#reader-contract)
- <a id="native-scroll-tracking-on-ios-(experimental)"></a><a id="natives-scroll-tracking-unter-ios-(experimentell)"></a><a id="native-scroll-tracking-on-ios-experimental"></a>[Natives Scroll-Tracking unter iOS (experimentell)](native-ui-extension-reference.md#native-scroll-tracking-on-ios-experimental)
- <a id="inhalt-und-position-sind-unabh%C3%A4ngig"></a><a id="content-and-placement-are-independent"></a>[Inhalt und Position sind unabhängig](native-ui-extension-reference.md#content-and-placement-are-independent)
- <a id="anforderungen-an-tab-zubeh%C3%B6r"></a><a id="tab-accessory-requirements"></a>[Anforderungen an Tab-Zubehör](native-ui-extension-reference.md#tab-accessory-requirements)
- <a id="quellgeometrie-und-darstellungszustand-lesen"></a><a id="read-source-geometry-and-presentation-state"></a>[Quellgeometrie und Darstellungszustand lesen](native-ui-extension-reference.md#read-source-geometry-and-presentation-state)
- <a id="gemeinsame-projektionsf%C3%A4higkeiten-verwenden"></a><a id="use-the-shared-projection-capabilities"></a>[Gemeinsame Projektionsfähigkeiten verwenden](native-ui-extension-reference.md#use-the-shared-projection-capabilities)
- <a id="eine-quellpr%C3%BCfung-planen"></a><a id="schedule-a-source-check"></a>[Eine Quellprüfung planen](native-ui-extension-reference.md#schedule-a-source-check)
- <a id="native-grafiken-und-farbkonvertierung-wiederverwenden"></a><a id="reuse-native-artwork-and-color-conversion"></a>[Native Grafiken und Farbkonvertierung wiederverwenden](native-ui-extension-reference.md#reuse-native-artwork-and-color-conversion)
- <a id="lebenszyklus-und-aktionsabschluss"></a><a id="lifecycle-and-action-completion"></a>[Lebenszyklus und Aktionsabschluss](native-ui-extension-reference.md#lifecycle-and-action-completion)
- <a id="aktionsabschluss"></a><a id="action-completion"></a>[Aktionsabschluss](native-ui-extension-reference.md#action-completion)
- <a id="example%3A-mini-player"></a><a id="beispiel%3A-mini-player"></a><a id="example-mini-player"></a>[Beispiel: Mini-Player](native-ui-extension-reference.md#example-mini-player)
