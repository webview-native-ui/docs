---
title: "Native Übergabe"
sourceRevision: "7d0e0f7de1f9aa0d9948181bc17192947c2a98c334baa6abe09fce271e56729a"
---

# Native Übergabe für benutzerdefinierte Renderer

Ein bestehender Renderer sollte seine geordneten `WebProjectionRequest`-Nachrichten an die Methode `handle` des nativen Snapshot-Managers weiterleiten. Damit bleiben Anfragevalidierung, Koordinatenkonvertierung von CSS nach Native, Übergabe gecachter Bilder und Freigabe von Kopien in der Engine. Die Bridge bleibt die eigene Capacitor- oder Cordova-Methode des Plugins; die Engine hängt nicht vom Aufrufobjekt eines dieser Frameworks ab.

Beispielsweise sendet ein Renderer Toolbar-Schaltflächen bereits als eine native Aktualisierung und weiß, welche Ansichten zu jeder Schaltflächengruppe gehören. Leiten Sie Bildübergabenachrichten an `handle` weiter, statt Koordinatenkonvertierung und Kopienfreigabe für jede Gruppe neu zu implementieren. Belassen Sie die Aufnahmefähigkeit und das gewöhnliche Layout der Gruppe in diesem Renderer: Die Engine kann nicht ableiten, welche Geschwisteransichten gefahrlos gemeinsam ausgeblendet werden dürfen.

Rufen Sie Ansichts- und Snapshot-Lebenszyklus-APIs im Haupt-/UI-Thread auf. Stellen Sie zwei Renderer-Callbacks bereit: `frames(ids, revision)` liefert aktuelle geeignete Grenzen, und `views(ids)` liefert die vollständigen nativen Ansichten, die gefahrlos zusammen ausgeblendet werden können. Geben Sie leere Grenzen oder `nil` / `null` zurück, wenn dieser Vorgang nicht verfügbar ist. Grenzen verwenden **Punkte relativ zur WebView unter iOS** und **physische Pixel relativ zur WebView unter Android**. Die Engine prüft, dass die gemessenen IDs exakt der Anfrage entsprechen.

```swift
snapshots.handle(request, in: webView,
    frames: { ids, revision in renderer.measure(ids, at: revision) },
    views: { ids in renderer.viewsAllowedToHide(ids) },
    complete: reply)
```

```kotlin
snapshots.handle(request, activity.window, webView,
    frames = { ids, revision -> renderer.measure(ids, revision) },
    views = { ids -> renderer.viewsAllowedToHide(ids) },
    complete = { result ->
        result.fold(onSuccess = reply, onFailure = reject)
    })
```

`renderer` und `reply` stehen oben für den bestehenden Layoutcode und den Bridge-Abschlusscallback des Plugins. Leiten Sie unter Android ein fehlgeschlagenes `Result` an den Ablehnungscallback der Bridge weiter (oben `reject`); Web verwendet diesen Fehler, um das Bild aufzugeben und die Darstellung abzugleichen. Bestätigen Sie eine fehlgeschlagene Zeichengrenze nicht als Erfolg. `frames` kann wiederholt laufen, während sich die Geometrie stabilisiert; es muss angeforderte Revision und Aufnahmefähigkeit erneut prüfen. Es darf das Layout nicht verändern. Wenn mehrere Steuerelemente einen nativen Container teilen, muss `views` eine Teilmenge ablehnen, die nicht aufgenommene Steuerelemente ausblenden würde. Die Engine kann diese Beziehung nicht ableiten.  Registrieren Sie den Window-Beobachter des Snapshot-Managers und leiten Sie dessen vollständige Ereignisse weiter; siehe [Aufnahme vor der Interaktion](preinteraction-capture.md#window-integration). Fügen Sie keine doppelten Touch-Benachrichtigungen auf Clip-Ebene hinzu.

`cover` installiert vorbereitete Bildpunkte, bevor es diese Ansichten ausblendet. Zielteile werden gegen das gecachte Token validiert und sowohl für Abdeckung als auch Wiederherstellung verwendet, sodass eine verschobene vorbereitete Oberfläche keine alte Position wiederverwendet. Ungültige oder nicht verfügbare Übergaben liefern `shown: false`. `painted` und `restored` geben nur die jeweilige Kopie frei; Android wartet auf die Web-Zeichenbereitschaft. `release` und `reset` geben eigene Ressourcen frei. Im Abdeckungs- oder Wiederherstellungsweg beginnt keine Aufnahme.

Der Renderer führt seine gewöhnliche native Aktualisierung weiterhin zwischen `restore` und der akzeptierten Aktualisierungsbestätigung aus. Rufen Sie vor dieser Aktualisierung unter iOS `restoreControls()` oder unter Android `restoreViews()` auf, um nur die Ausblendungsänderungen der Engine rückgängig zu machen. Dies ist kein Befehl, beliebige Plugin-Inhalte anzuordnen oder einzublenden. Belassen Sie die normale Sichtbarkeits- und Positionierungsstrategie im Renderer.

### Direkte Snapshot-Grundbausteine

Verwenden Sie diese nur, wenn Ihre Integration die native Positionierung während der Übergabe selbst verwaltet. `NativeUIProjection` verwendet dieselben Operationen mit registrierungsspezifischen Strategien für die Positionierung und für undurchsichtige Ansichten. Duplizieren Sie bei der Weiterleitung an `handle` weder Konvertierung noch Kopienfreigabe.

- Konvertieren Sie Ziel-`parts` aus CSS-Pixeln unter iOS mit `webView.bounds.width / viewportWidth` oder unter Android mit `webView.width / viewportWidth`. Übergeben Sie Frames an `cover` und `restore`; fehlende Abdeckungsteile behalten die aufgenommene Positionierung bei. Keine der beiden Operationen nimmt neue Bildpunkte auf.
- `transient: true` trennt eine bewegte Vordergrundoberfläche vom `coveringToken` des Hintergrunds. Verwenden Sie Bildpunkte wieder, solange Quellgrößen und Positionen relativ zu ihrem Scope unverändert bleiben; Bewegung innerhalb eines festen Scopes invalidiert das Layout.
- Geben Sie die Eintrittskopie nach Web-Zeichenbereitschaft frei: `retireCopy(token)` unter iOS, `retireCopyAfterWebDraw` unter Android.
- Rufen Sie für die Rückkehr `restore` auf, machen Sie die Engine-Ausblendung mit `restoreControls()` / `restoreViews()` rückgängig und wenden Sie das normale native Layout an. Geben Sie die Rückkehrkopie nach akzeptierter nativer Aktualisierung und Web-Zeichenbereitschaft mit `retireCopy` und `entry: false` / `entry = false` frei. Android kann `painted` und `restored` an `handle` weiterleiten, um Bereitschafts- und Ablehnungsbehandlung wiederzuverwenden.
- Geben Sie Tokens mit `release(token)` frei. Verwenden Sie `reset()` nur beim Abbau des Besitzers und unter Android `close()` zum Freigeben des Encoders. Setzen Sie niemals Aufnahmen einer anderen Oberfläche zurück.

Bei fehlender Aufnahme oder Positionierung gilt der gewöhnliche Fallback des Renderers. Payloads beschreibt der [Web-Anfragevertrag](web-projection.md#multiple-fallbacks-in-one-native-transaction).

Für die Aufnahme vor nativer Eingabe, das Anhalten vor der Messung, Invalidierung und Zeitereignisse siehe [Aufnahme vor der Interaktion](preinteraction-capture.md). Aufnahmegrenzen einschließlich hintergrundabhängiger Materialien beschreibt [Plattformgrenzen](../reference/platforms.md).

## Natives Scrolltracking

Ein natives Steuerelement in einer scrollenden Web-Liste würde sonst neue Positionierungsnachrichten benötigen, während sich die Liste bewegt. Verwenden Sie diese Bindungen nur, wenn der Renderer den Scroll-Abgleich bereits übernimmt: Eine eindeutig zugeordnete iOS-Overflow-Scrollansicht kann native Inhalte mitführen. Verschachteltes oder mehrdeutiges Scrollen muss den gewöhnlichen Fallback verwenden, statt Inhalte an den falschen Scroll-Besitzer anzuhängen.

`readScrollPlacement(element, owner, identify)` misst einen nicht transformierten Overflow-Besitzer. `createScrollBindings()` validiert Wiederverwendung und erkennt Bewegung, während die Übernahme auf ein ACK wartet. Nehmen Sie `reuse` nicht in Layout-Deduplizierungssignaturen auf; es beschreibt den Bestätigungszustand, nicht das Layout.

Unter iOS gruppiert `NativeUIScrollBindings.replace` Quellen nach Besitzer und bindet nur eine eindeutig passende `UIScrollView`. `update()` wendet Positionen und Beschneidung an, ohne Inhalte neu aufzubauen. `NativeUIClippedView` erhält die vollständigen Inhaltsabmessungen und beschränkt zugleich sichtbare Pixel und Treffertests.

Eine bestehende, nativ abgelehnte Bindung verliert ihre Zuständigkeit und kann über **denselben** Update-/ACK-Pfad neu übernommen werden. Eine fehlgeschlagene Neuübernahme bleibt bis zu einem relevanten Layout-/Scrollende-Ereignis beim Fallback. Ergänzen Sie niemals eine sofortige Wiederholungsschleife und führen Sie keine Benutzeraktionen erneut aus. Eine Frame-/Props-Änderung kalibriert einen bestehenden Koordinatenursprung nicht neu.

Dies nutzt die interne Overflow-Hierarchie von WKWebView ohne private Klassennamen. Fehlende oder mehrdeutige Ansichten, verschachteltes oder Dokument-Scrolling, nicht unterstützte Transformationen, geformtes Clipping oder ein bewegter unbestätigter Besitzer können nicht gebunden werden. Allein ein vorhandener `UIScrollView` belegt keine Unterstützung. Für Gesten, die in SDK-Ansichten beginnen, aktivieren Sie [natives Scroll-Hosting](native-scroll-hosting.md), statt eine weitere Gestenweiterleitung zu implementieren. SDK-Barrierefreiheit bleibt rendererspezifisch.

### Nur den Renderer unter iOS aufnehmen

Eine `prepare`-Anfrage kann `captureMode: 'view'` angeben, um nur die vom Ansichtsselektor gelieferten Renderer-Ansichten zu zeichnen und transparente Pixel außerhalb ihres Materials zu erhalten. Standard bleibt die Aufnahme des zusammengesetzten Fensters. Eine reine Renderer-Aufnahme kann hintergrundabhängige Unschärfe und Brechung verändern oder auslassen; sie garantiert keine Transparenz innerhalb einer Glasoberfläche. Fehlende, ausgeblendete oder abgetrennte Renderer-Ansichten führen zur Ablehnung der Vorbereitung. Android und ältere native Binärdateien behalten ihren bisherigen Aufnahmepfad.

Bewegte DOM-Oberflächen können über `WebProjectionOptions.imageSurface` (`HTMLElement`) eine im Viewport feste Transferebene bereitstellen. Die Web-Projektion kennzeichnet ihre Vorbereitungsanfragen mit `imageSurface: 'web'`, damit die Native-Ausblendung das Renderer-Layout erhält. Dies ändert die Platzierung, nicht das Übergabeprotokoll: Jede Oberfläche verwendet dieselben temporären nativen Eintritts- und Rückkehrkopien. Während der Bewegung liegen die dekodierten DOM-Bilder auf ihrer Quelloberfläche und werden von deren Transformation mitgeführt. Eine Verschiebung macht ihre wiederverwendbare Aufnahme nicht ungültig; Abmessungen werden mit der Auflösung der Anzeigepixel verglichen, während tatsächliche Größen- und Quellenänderungen sie weiterhin invalidieren. Unter iOS enthält jeder Bildteil optionale `anchorBounds` relativ zum Bildausschnitt, in Viewport-Einheiten. Renderer können `anchorFrames` für zusammengesetzte Steuerelemente bereitstellen, etwa für das erste tatsächliche Symbolleistenelement einer Gruppe. Bewegte Ziele verwenden diese Grenzen, um Aufnahmeränder zu erhalten, ohne native Koordinaten zum Aufnahmezeitpunkt mit der späteren DOM-Platzierung zu vermischen.

Erhalten Sie Renderer und Quellbesitz während der Projektion. Das gemeinsame Eintritts- und Rückkehrprotokoll gilt weiterhin; `imageSurface` ändert die Platzierung, nicht die Bildlebensdauer. `layoutFrame(target, part, parts)` liefert die aktuelle Ankerplatzierung der aufgenommenen Gruppe und verwaltet keine Sichtbarkeit. Rufen Sie `updated(token, ids, revision)` nur für akzeptierte native Aktualisierungen auf; eine neuere Revision als die Rückkehranfrage entfernt das angezeigte Bild. Cache-Wiederverwendbarkeit und Lease des angezeigten Bildes bleiben getrennt.

Verwenden Sie unter iOS `NativeUICoveredSnapshots.concealPixels(in:)` im Hauptthread, wenn das Layout messbar bleiben muss. Die Funktion maskiert Pixel und deaktiviert Interaktion und Barrierefreiheit, ohne `isHidden` oder Geometrie zu verändern. Ihre zurückgegebene Wiederherstellungs-Closure ist idempotent; bei überlappenden Leases werden die ursprüngliche Maske und Flags erst nach Ende der letzten Lease wiederhergestellt. Zusammengesetzte und reine Renderer-Aufnahmen verwenden dieselbe native Kopie und denselben Vertrag für den Zeichenabschluss.

## Bildkodierung und Wiederverwendung

PNG-Kodierung wird mit den nativen Paketen geliefert; Verbraucher benötigen weder Rust noch ein NDK. iOS erhält 16-Bit-Display-P3 und ICC-Metadaten. Android verwendet den Rust-Encoder für undurchsichtige sRGB-Bilder und den Plattform-Encoder für nicht unterstützte Eingaben. Bei Kodierungsfehlern bleibt der Plattform-Fallback erhalten.

Explizite Renderer-View-Aufnahmen dürfen unveränderliche Bilder wiederverwenden, solange Inhaltsrevision und geeigneter View-Zustand unverändert sind. Erhöhen Sie die Revision bei jeder visuellen Änderung, einschließlich Animationen und materialrelevanter Hintergrundänderungen. Aktivieren Sie die Wiederverwendung hintergrundabhängiger Inhalte nicht ohne entsprechende Änderungsverfolgung. Standardmäßige zusammengesetzte iOS-Aufnahmen aktivieren diesen Renderer-View-Cache nicht.

Native Antworten bestätigen wiederverwendbare Bildpunkte mit `reused: true`. Nur dann darf Web das dekodierte Bild für dieselbe URL und dasselbe Ziel wiederverwenden; andere Antworten behalten das bisherige Lade-/Dekodierverhalten. Tokens besitzen getrennte Leases auf gemeinsam genutzte Dateien. Geben Sie ausgemusterte Tokens weiterhin frei und setzen Sie den Manager beim Abbau des Besitzers zurück.
