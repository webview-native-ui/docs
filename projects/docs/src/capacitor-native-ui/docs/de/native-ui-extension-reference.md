---
sourceRevision: "b777edf9c4ac73b09bcfd66a3f8feb0bcef8e817ed5f08927f0a6ccbd90693a5"
title: Referenz für Native-UI-Erweiterungen
---

# Referenz für Native-UI-Erweiterungen

Die Anleitung zur Implementierung des Zählers finden Sie im [Einrichtungsleitfaden](native-ui-extensions.md).

## Reader-Vertrag

| Bestandteil | Anforderung |
| --- | --- |
| Ausführung | Synchron und ausschließlich lesend. |
| Web-Fallback | `null` zurückgeben, wenn die Quelle im Web bleiben soll. |
| `props` | JSON-Objekt mit endlichen Zahlen, Zeichenfolgen, booleschen Werten, null, Arrays und Objekten; begrenzt auf 64K Zeichen. |
| Aktionsziele | Die Quelle selbst oder ihre Nachfahren. Fehlende, versteckte und deaktivierte Ziele lassen sich nicht aktivieren. |
| Aktionsanzahl | Bis zu 30 pro Quelle. |

## Natives Scroll-Tracking unter iOS (experimentell)

Geben Sie für ein Element innerhalb eines einzelnen Overflow-Scrollcontainers `scrollElement` an. Die Web-Seite misst das Layout; iOS beobachtet die passende `UIScrollView` und aktualisiert beim Scrollen nur die native Position und Beschneidung. Quellen im selben Container teilen sich einen Beobachter. Die Bindung kalibriert die DOM- und nativen Koordinatenursprünge bei ruhendem Scrollcontainer und behält diese Zuordnung bei Inhaltsaktualisierungen bei. Teilweise sichtbare Bedienelemente bleiben nativ; vollständig abgeschnittene Bedienelemente können keine Eingaben empfangen.

```ts
const scrollElement = await ionContent.getScrollElement();
const counter = defineNativeUI({
  name: 'app.counter',
  selector: '[data-counter]',
  scrollElement: () => scrollElement,
  read(element) {
    return {
      props: { count: Number(element.getAttribute('data-count') ?? 0) },
      actions: { increment: element.querySelector<HTMLButtonElement>('button') },
    };
  },
});
```

Geben Sie bei einfachem HTML das Element mit `overflow: auto` oder `scroll` zurück. Geben Sie bis zu seiner Bereitschaft `null` zurück und rufen Sie anschließend `shell.markForCheck()` auf, falls diese Bereitschaft das DOM nicht verändert hat. Halten Sie Quellabmessungen und Änderungen am Inhaltslayout beobachtbar; verwenden Sie `markForCheck()` für Änderungen, die die Shell nicht beobachten kann.

Dies verwendet WebKits interne Overflow-View-Hierarchie ohne private Klassennamen. Eine Bindung muss genau einem nativen Scrollcontainer entsprechen; bei fehlender oder mehrdeutiger Zuordnung bleibt die interaktive Web-Quelle erhalten. Verschachteltes Scrollen, abgerundete oder geformte Beschneidung, CSS-Transformationen/Zoom, sticky/fixed-Nachfahren, Dokument-Scrolling, ältere native Binärdateien und Android werden von dieser optionalen Funktion nicht unterstützt. Lassen Sie `scrollElement` weg, um den bestehenden JS-basierten Positionierungspfad beizubehalten. Andere ungebundene Projektionsquellen im selben Scrollcontainer benötigen weiterhin die normale Layoutsynchronisierung. Jedes `scrollend` führt einen Abgleich über den normalen Aktualisierungs- und Bestätigungspfad aus, einschließlich erneuter Versuche nach einer vorübergehenden Bindungsablehnung.

`NativeUIContext.sourceFrame` ist die neueste Layoutstichprobe und keine Benachrichtigung bei jedem Scrollvorgang. Natives Tracking baut SwiftUI-Inhalte nicht aufgrund von Scrollversätzen neu auf. Feste Tab-Zusatzelemente verwenden diese Bindung nicht. Web-Modal-Transformationen bleiben auf ihrem bestehenden Übergabepfad; nicht interaktive abgedeckte Inhalte können vorbereitete Bilder verwenden, während interaktive scrollende Inhalte nativ bleiben.

## Inhalt und Position sind unabhängig

| `placement` | Verhalten |
| --- | --- |
| Ausgelassen oder `'element'` | Hostet native Inhalte im Web-Rahmen des Quellelements unter iOS 26+ oder Android API 24+. |
| `'tab-accessory'` | Fügt die View dem SwiftUI-System-Tab-Zubehör einer projizierten Tab-Leiste unter iOS 26.1+ hinzu. |

Erweiterungen sind von `controls` und `ionic.auto` unabhängig, auch mit `enableVerticalControlArea()`. Die Anwendung steuert ihre Darstellung: Geben Sie im Reader `null` zurück, wenn eine Quelle im Web bleiben soll, und rufen Sie bei Änderung dieser Bedingung `markForCheck()` auf. Zubehör benötigt weiterhin seinen unterstützten nativen Tab-Host.

### Anforderungen an Tab-Zubehör

| Anforderung | Unterstützte Konfiguration |
| --- | --- |
| Quellposition | Innerhalb des zuständigen `ion-tabs`; die Shell löst dessen `ion-tab-bar` auf. |
| Nativer Host | Vertical Bars-SwiftUI-Tab-Host unter iOS 26.1+. |
| Zubehöranzahl | Ein einzelnes Zubehör für den Host. |
| Web-Fallback-Layout | Ein gleichwertiges Web-Layout, etwa eine fixierte Fußzeile, beibehalten; die Quelle behält beim Ausblenden ihren Platz. |

Gewöhnliche UIKit-Tab-Leisten, fehlende native Tabs, iOS 26.0 oder konkurrierendes Zubehör belassen die Quelle im Web. Anwendungen übergeben keine nativen Controllerreferenzen und die Shell bildet Systemzubehör nicht durch ein schwebendes Overlay nach.

## Quellgeometrie und Darstellungszustand lesen

Die Shell vermisst das Quell-DOM-Element automatisch. Bei der Standardposition `element` positioniert und dimensioniert sie den SwiftUI-Host passend zu diesem Rechteck. Sie müssen weder Koordinaten in `props` senden noch die native View selbst positionieren.

Verwenden Sie die Registrierungs-Closure mit drei Argumenten, um diese Informationen zu erhalten:

```swift
try NativeUI.register("app.counter") {
    (props: CounterProps, actions: NativeUIActions, context: NativeUIContext) in
    CounterView(props: props, actions: actions)
        .padding(.horizontal, context.sourceFrame.width < 240 ? 4 : 12)
}
```

Die bestehende Closure `(props, actions)` bleibt unterstützt. Beide Formen verwenden dieselben Registrierungsnamen und Prüfungen auf doppelte Namen.

| Kontexteigenschaft | Bedeutung |
| --- | --- |
| `sourceID` | Opake Quellidentität für die aktuelle Lebensdauer; nicht die HTML-`id`. |
| `sourceFrame` | DOM-`getBoundingClientRect()` in CSS-Pixeln relativ zum Web-Viewport, einschließlich `x`, `y`, `width` und `height`. |
| `sourceFrameInWebView` | Quellrechteck in UIKit-Punkte im lokalen WebView-Koordinatensystem umgerechnet; keine Bildschirmkoordinaten. |
| `viewportWidth` | CSS-Viewportbreite für die Koordinatenumrechnung dieses Snapshots. |
| `pointsPerCSSPixel` | UIKit-Punkte pro CSS-Pixel; keine Gerätepixeldichte. |
| `placement` | `.element` oder `.tabAccessory`. |
| `colorScheme` | `.light` oder `.dark`, auch auf die SwiftUI-Umgebung angewendet. |
| `layoutDirection` | `.leftToRight` oder `.rightToLeft`, auch auf die SwiftUI-Umgebung angewendet. |

Die Closure erhält bei jedem aktualisierten Snapshot der Shell einen neuen Kontext, einschließlich Quellbewegung, Größen- und Darstellungsänderungen. Verwenden Sie den aktuellen Kontext, statt seine Geometrie in `@State` zwischenzuspeichern. Aktualisierungen passieren die Web-/Native-Bridge; sie sind keine synchrone DOM-Messung aus Swift.

Bei `tabAccessory` beschreibt `sourceFrame` weiterhin das ursprüngliche DOM-Element. Das System bestimmt tatsächliche Position und Größe des Zubehörs. Verwenden Sie innerhalb Ihrer View SwiftUIs `GeometryReader` für den tatsächlichen lokalen Platz bei beiden Positionen:

```swift
GeometryReader { geometry in
    CounterView(props: props, actions: actions)
        .frame(width: geometry.size.width, height: geometry.size.height)
}
```

Wenden Sie `sourceFrame.x` oder `y` nicht als weiteren SwiftUI-Versatz an: Die Shell positioniert den Host bei `element` bereits. Ihre View ordnet ihre Inhalte innerhalb dieses Hosts an.

## Gemeinsame Projektionsfähigkeiten verwenden

| Fähigkeit | Nutzung durch eine Erweiterung |
| --- | --- |
| Position und Größe | Automatische Host-Positionierung plus `NativeUIContext`; tatsächliche lokale Grenzen über `GeometryReader`. |
| Dunkelmodus und RTL | `context` oder SwiftUI-`@Environment(\.colorScheme)` und `@Environment(\.layoutDirection)`. |
| Reduce Motion und Barrierefreiheit | SwiftUI-Umgebungswerte wie `@Environment(\.accessibilityReduceMotion)` und native Barrierefreiheitsmodifikatoren. Geben Sie eigenen Bedienelementen zugängliche Namen. |
| DOM-basierter Anwendungszustand | JSON-`props` aus `read(element)` zurückgeben; DOM-Änderungen lösen Synchronisierung aus. Ohne DOM-Mutation `shell.markForCheck()` aufrufen. |
| Aktivierte/sichtbare Aktionsziele | `actions.availableNames` oder `actions.isAvailable("increment")`; nicht verfügbare DOM-Ziele werden ausgelassen. |
| Ursprüngliche Web-Aktion auslösen | `try await actions.activate("increment")`; Abschluss und Fehler folgen dem nachstehenden Vertrag. |
| Temporärer Web-Fallback und Bereinigung | Automatisch verwaltet für nicht unterstützte Inhalte, Overlays, Navigationsaussetzung und Quellentfernung. |
| Anwendungsgesteuerte Aussetzung | Aus JavaScript `suspend()` am Shell-Handle, `resume()` am zurückgegebenen Token und `destroy()` verwenden. |

Deaktivieren Sie beispielsweise eine native Schaltfläche, wenn ihre ursprüngliche Aktion nicht verfügbar ist:

```swift
Button("Increment") {
    Task { @MainActor in
        do { try await actions.activate("increment") }
        catch { /* Present an application-appropriate error. */ }
    }
}
.disabled(!actions.isAvailable("increment"))
```

Verfügbarkeit ist eine Momentaufnahme, keine Reservierung: Ein Ziel kann vor der Aktivierung verschwinden; behandeln Sie daher auch Fehler. Eigene Texte, Auswahlzustände, Schriften, Farben und Badges gehören in die `props` und SwiftUI-View Ihrer Erweiterung; die Shell leitet die visuelle Struktur eigener Komponenten nicht aus CSS ab. Lesen Sie berechnete Stile und Attribute des gewünschten Elements in Ihrem Reader. Verwenden Sie die folgenden gemeinsamen Bild- und Farbkonvertierungs-APIs, statt diese Umwandlungen selbst zu implementieren.

## Eine Quellprüfung planen

DOM-Attribute, Text, Kindelemente, beobachtete Elementgrößen, Scrollen und unterstützte Lebenszyklusereignisse lösen automatische Prüfungen aus. Die Shell fragt weder JavaScript-Variablen noch beliebige DOM-Eigenschaften regelmäßig ab. Fordern Sie nach einer Zustandsänderung, die Ihr Reader ohne DOM-Mutation verwendet, eine Prüfung an:

```ts
source.playbackPosition = newPosition; // Eine von der Anwendung definierte Eigenschaft, die Ihre Erweiterung liest.
shell.markForCheck();
```

`markForCheck(): void` plant erneutes Lesen und Geometriemessung; es aktualisiert weder das Anwendungs-DOM noch erzwingt es natives Neuzeichnen. Wiederholte Aufrufe werden gebündelt und unveränderte Snapshots nicht gesendet. Ein Aufruf während eines Bridge-Updates plant eine weitere Prüfung danach. Ausgesetzte Projektion bleibt bis zur Wiederaufnahme ausgesetzt. Aufrufe nach `destroy()` oder ohne Projektionslaufzeit bewirken nichts.

Rufen Sie die Methode auf, nachdem Ihr Framework relevante DOM-Änderungen übernommen hat. Diese API löst weder Angular-Änderungserkennung noch React- oder Vue-Rendering aus und ist kein Promise, das auf nativen Abschluss wartet. Sie funktioniert auch für Standardbedienelemente, deren Eigenschaften sich ohne beobachtbare Mutation ändern.

## Native Grafiken und Farbkonvertierung wiederverwenden

Das zweite Reader-Argument stellt den standardmäßigen SVG-Erfassungs- und Rasterisierungspfad bereit. Es akzeptiert ein lokales `svg` oder ein aufgelöstes `ion-icon` der Quelle und liefert eine **opake Bildreferenz** oder bei nicht unterstützter Grafik `null`. Geben Sie die Referenz in `props` zurück; versuchen Sie nicht, Bildbytes synchron zu lesen:

```ts
const badge = defineNativeUI({
  name: 'app.badge',
  selector: '[data-badge]',
  read(element, context) {
    return {
      props: {
        icon: context.image(element.querySelector<HTMLElement>('ion-icon')),
        color: getComputedStyle(element).color,
      },
    };
  },
});
```

Vor dem Senden des Snapshots löst die Shell Referenzen zu `{ data, width, height, template }` auf: Base64-PNG-Daten, CSS-Abmessungen und Renderingmodus. Verschachtelte Referenzen und Kopien werden unterstützt; `$nativeUIImage` ist für Referenzen aus dem aktuellen Lesekontext reserviert. Verwenden Sie `{ template: true }` als zweites Argument von `image()`, wenn SwiftUI das Symbol tönen soll; standardmäßig bleiben die Quellfarben erhalten. Es gelten dieselben lokalen SVG-Einschränkungen, RTL-Erfassung, Rasterisierung mit Displayskalierung und Bildcache wie bei Standardbedienelementen. Externe Ressourcen und nicht unterstützte SVG-Inhalte liefern `null`; nicht aufgelöste `ion-icon`-Inhalte sollten bis zum Laden den Web-Fallback behalten. Rasterisierungsfehler oder Props über der Größenbegrenzung belassen die Erweiterung im Web.

Dekodieren Sie unter iOS den resultierenden Wert mit `NativeUIImage` und verwenden Sie die gemeinsamen Konverter:

```swift
struct BadgeProps: Decodable {
    let icon: NativeUIImage?
    let color: String
}

struct BadgeView: View {
    let props: BadgeProps
    var body: some View {
        if let icon = props.icon, let image = NativeUIRendering.image(icon) {
            Image(uiImage: image)
                .foregroundStyle(Color(uiColor: NativeUIRendering.color(props.color)))
        }
    }
}
```

`NativeUIRendering.image` liefert bei ungültigen Bilddaten `nil`. `NativeUIRendering.color` akzeptiert berechnete `rgb()`-/`rgba()`-Werte; nicht unterstützte Formate verwenden `.label` oder die angegebene `fallback:`-Farbe. Beide werden mit den nativen Standardrenderern geteilt. Sie werten keine CSS-Selektoren, Variablen, benannten Farben oder beliebigen Stylesheets aus.

## Lebenszyklus und Aktionsabschluss

Die Shell verwaltet Erkennung, Geometrie, Zustandssynchronisierung, native Controller-Einbettung, Projektionsauflösung bei Overlays, Aussetzung und Bereinigung. Erweiterungen implementieren keine Attach-/Detach-Hooks. Web-Quellen werden erst ausgeblendet, nachdem die native Seite die Projektion akzeptiert. Ein nicht registrierter Renderer, fehlerhafter Props-Decoder, nicht unterstützte Position oder fehlgeschlagener Reader belässt die Instanz im Web. Die bestehende Overlay-Regel der Shell gilt: Erweiterungen kehren ins Web zurück, solange Web-Overlays die Seite bedecken.

Elementpositionierung erfordert, dass die Quelle vollständig in den Viewport und die abschneidenden Overflow-Grenzen ihrer Vorfahren passt, einschließlich Ionics Shadow-Scrollcontainern. Teilweise abgeschnittene Quellen bleiben im Web und werden wieder geeignet, sobald sie vollständig sichtbar gescrollt sind. Tab-Zubehör verwendet stattdessen die Positionierung des Systemhosts.

### Aktionsabschluss

| Ereignis | Ergebnis von `try await actions.activate(name)` |
| --- | --- |
| Das ursprüngliche Web-Element erhält seinen Klick | Wird abgeschlossen. |
| Handler startet Netzwerkanfrage, Navigation oder Modal | Wartet nicht auf diese Anwendungsarbeit. |
| Aktion ist deaktiviert, entfernt oder veraltet | Wird abgewiesen. |
| Bereinigung, Abbruch nativer Aufgabe oder Bridge-Timeout | Schließt ausstehende Aufrufe ab. |

Die Bridge-Bestätigung ist eine Capacitor-Promise-Methode.

Der [Demo-Reader](https://github.com/webview-native-ui/ionic-theme-ios27/blob/ios27-v2.1.0/demo/src/native-ui/counter.ts) und die [Demo-SwiftUI-View](https://github.com/webview-native-ui/ionic-theme-ios27/blob/ios27-v2.1.0/demo/ios/App/App/NativeUICounter.swift) zeigen beide Positionen mit app-lokalen Dateien. Öffnen Sie die Native UI-Demoseite, um native Projektion mit ihrem Web-Fallback zu vergleichen.

## Beispiel: Mini-Player

Der Demo-Mini-Player zeigt dasselbe Muster mit Titelmetadaten und Wiedergabeaktionen: Ein [DOM-Reader mit Web-Fallback](https://github.com/webview-native-ui/ionic-theme-ios27/blob/ios27-v2.1.0/demo/src/native-ui/mini-player.ts) wird mit einer [app-lokalen SwiftUI-View](https://github.com/webview-native-ui/ionic-theme-ios27/blob/ios27-v2.1.0/demo/ios/App/App/NativeMiniPlayer.swift) kombiniert. Die Web-App verwaltet Wiedergabezustand und Modal-Darstellung; native `open`- und `toggle`-Aktionen aktivieren ihre ursprünglichen Schaltflächen. Dies ist ein UI-Beispiel, keine Audio-Engine. Passen Sie die Dateien nach der [Erweiterungseinrichtung](native-ui-extensions.md) an.
