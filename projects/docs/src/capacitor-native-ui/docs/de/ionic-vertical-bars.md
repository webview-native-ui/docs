---
title: "Vertical Bars mit Ihrem bestehenden Theme"
sourceRevision: "21e5bb8f36ac3e48f01de53362d670dd6321517e71879538c5e6c2bd2eeec47c"
---

# Vertical Bars mit Ihrem bestehenden Theme

Vertical Bars gehört zur standardmäßigen Native-UI-Einrichtung. Mit dieser Anleitung behalten Sie das bestehende Web-Theme Ihrer App, statt das standardmäßige iOS-27-Theme-Preset zu übernehmen. Wählen Sie die Einrichtung nach den Komponenten Ihrer App, unabhängig davon, ob Sie Angular, React, Vue oder ein anderes Framework verwenden.

Die [Funktionsweise der Projektion](../README.md#how-projection-works) erläutert die Beziehung zwischen Quell-DOM, projizierten Bedienelementen und Aktionen. Wählen Sie anschließend unten Ihre Einrichtung.

## Einrichtung auswählen

| Ihre App | Einstieg | Ergänzung |
| --- | --- | --- |
| Ionic-Komponenten mit eigenem Theme, Ionic-Standardstilen oder einem anderen Theme | [Ionic-Einrichtung unten](#try-it-in-your-existing-ionic-app) | Foldable-Geräteplatzierung, eigenständiges Rail-CSS und Ionic-Native-UI-Adapter. Bestehendes Theme beibehalten. |
| Keine Ionic-Komponenten (reines HTML, React, Vue, Angular usw.) | [HTML-Einrichtung](https://webview-native-ui.com/projects/capacitor-native-ui/docs/framework-independent), dann die [Geräte-Rail-Einrichtung](https://webview-native-ui.com/projects/capacitor-native-ui/docs/framework-independent#device-placement-for-vertical-bars) | `@rdlabo/capacitor-native-ui/core` und Foldable. Ihre App stellt das Rail-Layout bereit; kein Theme-Paket. |
| Bereits iOS-27-Theme und Native UI im Einsatz | [Geräteplatzierung verbinden](https://webview-native-ui.com/projects/capacitor-native-ui/docs/vertical-bars#use-with-capacitor-foldable) | Bestehende Runtime weiterverwenden. Keine weitere starten. |

**Ohne Ionic folgen Sie statt der folgenden Schritte der HTML-Anleitung.** Sie benötigen weder `@rdlabo/ionic-theme-ios27` noch `vertical-bars.css`, `ion-app` oder Ionic-Navigationsanimationen. Explizit markierte HTML-Schaltflächen und Zurückschaltflächen werden unterstützt; beliebige HTML-Tabs werden nicht automatisch konvertiert. Eine Browservorschau benötigt einen anwendungsgestalteten `webHost`; native Seitenleistendarstellung benötigt zusätzlich unterstützte iOS-Hardware und -Software.

Der Rest dieser Seite richtet sich an **Ionic-Apps**. Die Ionic-Modi `ios` und `md` werden unterstützt. Tabs und unterstützte Werkzeugleistenaktionen wechseln an die Seite; Inhalt und horizontale Bedienelemente behalten ihre Darstellung.

Unterstützung für iPhone Duo und Vertical Bars sind ab Version 2.0.0 stabil.

## In Ihrer bestehenden Ionic-Anwendung ausprobieren

### 1. Das eigenständige Stylesheet installieren und laden

Beginnen Sie mit Ihrer bestehenden Ionic-App (Ionic `>=8.8.1 <10`, Capacitor 8). Bestehende Foldable-Installationen müssen die [Gerätelayout-API-Anforderung](https://webview-native-ui.com/projects/capacitor-native-ui/docs/vertical-bars#use-with-capacitor-foldable) erfüllen: Version 8.5 oder neuer innerhalb von Version 8. Installieren Sie Native UI, das Layout-Stylesheet-Paket und das erforderliche Gerätezustands-Plugin zusammen:

```bash
npm install @rdlabo/ionic-theme-ios27 @rdlabo/capacitor-native-ui @erkamyaman/capacitor-foldable
```

Behalten Sie Ihre vorhandenen Theme-Imports bei. Ergänzen Sie in Ihrer globalen Sass-Datei Folgendes:

```scss
@use '@rdlabo/ionic-theme-ios27/dist/css/vertical-bars.css';
```

Die vollständigen iOS-27-Theme-Stylesheets sind nicht erforderlich. Verwenden Sie dieses Stylesheet statt Foldables `ionic-tabs.css`; beide zusammen würden dieselben Tabs verschieben.

Wir verwenden [Capacitor Foldable](https://github.com/erkamyaman/capacitor-foldable) als standardmäßige Geräteintegration, weil es Platzierung, Haltung und Änderungen meldet und Layoutentscheidungen der App überlässt. Lösen Sie den Gerätebericht mit `resolveVerticalBarsLayout(Foldable)` auf und übergeben Sie die zurückgegebene Kante, den Einzug und den Werkzeugleistenursprung an den Layout-Helfer des Themes. Native UI prüft die native Rail-Verfügbarkeit unabhängig davon.

### 2. Navigationsanimation verbinden

Konfigurieren Sie `navAnimation`, bevor Ionic initialisiert wird. Der Start der Leistenlaufzeit registriert diese Option nicht. Der Adapter bereitet native Bedienelemente vor und koordiniert Navigationsfortschritt und Abbruch, wobei Ihre bestehende Seitenanimation erhalten bleibt.

#### Die Standardanimation von Ionic beibehalten

Wenn Sie `navAnimation` nicht konfiguriert haben, umschließen Sie die Standard-Builder von Ionic. Wählen Sie den Builder anhand des Übergangs-`mode` von Ionic, damit `ios` und `md` ihre üblichen Animationen behalten:

```ts
import { iosTransitionAnimation, mdTransitionAnimation, type AnimationBuilder } from '@ionic/core';
import { withNativeUITransition } from '@rdlabo/ionic-theme-ios27';

const defaultTransition: AnimationBuilder = (baseEl, opts) =>
  (opts.mode === 'ios' ? iosTransitionAnimation : mdTransitionAnimation)(baseEl, opts);

const ionicConfig = {
  navAnimation: withNativeUITransition(defaultTransition),
};
```

Ergänzen Sie diese Option vor der Initialisierung in Ihrer bestehenden Ionic-Konfiguration: Übergeben Sie sie an `provideIonicAngular()` von Angular, `setupIonicReact()` von React oder die Plugin-Optionen von `IonicVue`. Behalten Sie Ihre vorhandenen Theme-Stylesheet-Imports bei. Ein Stylesheet des iOS-27-Themes ist nicht erforderlich.

#### Die iOS-Animation des Themes verwenden

Wenn Sie den iOS-27-Übergang bereits verwenden, behalten Sie diese Konfiguration bei. Sie enthält den nativen Adapter und schließt den horizontalen Zurück-Schaltflächeneffekt in vertikalen Layouts aus. Ein zusätzlicher Wrapper ist nicht erforderlich. Der Import dieses JavaScript-Einstiegspunkts lädt die Theme-Stylesheets nicht.

```ts
import { iosTransitionAnimation } from '@rdlabo/ionic-theme-ios27';

const ionicConfig = {
  navAnimation: iosTransitionAnimation,
};
```

Wenden Sie diese Option auf Ihre bestehende iOS-Moduskonfiguration an und behalten Sie die MD-Konfiguration bei.

#### Ihre eigene Animation beibehalten

Wenn Ihre Anwendung einen anderen Builder für `navAnimation` verwendet, umschließen Sie ihn:

```ts
import type { AnimationBuilder } from '@ionic/core';
import { withNativeUITransition } from '@rdlabo/ionic-theme-ios27';

// Pass the animation builder your app already uses.
const configureNavigation = (existingTransition: AnimationBuilder) => ({
  navAnimation: withNativeUITransition(existingTransition),
});
```

Der Adapter gibt die ursprüngliche `Animation` zurück und erhält ihre Effekte, Dauer und Easing-Kurve. Verwenden Sie ihn nur für Navigation, nicht für Modal- oder Popover-Animationen. Der Builder muss für jede Navigation eine neue `Animation` zurückgeben; Ionic zerstört sie nach dem Übergang. Behalten Sie Lebenszyklusereignisse für die Registrierung von Bedienelementen und Übergänge ohne Animation bei.

Der Adapter behält die Animationsziele des Builders bei, einschließlich eines etwaigen horizontalen Zurück-Schaltflächeneffekts. Wenn Sie den iOS-27-Übergang benötigen und dieser Effekt in vertikalen Layouts ausgeschlossen werden soll, verwenden Sie stattdessen `iosTransitionAnimation` aus `@rdlabo/ionic-theme-ios27` als `navAnimation`. Der Adapter ist darin bereits enthalten; ein Wrapper ist daher nicht erforderlich.

### 3. Geräteposition verbinden und Bedienelemente starten

Verwenden Sie [Anwendungsstart und Gerätelayout](device-layout.md), um die standardmäßige `enableNativeUI()`-Runtime zu starten und Foldables erstes Layout sowie `layoutChange`-Ereignisse zu verbinden. Wenden Sie Stylesheet und Ionic-Animation aus den Schritten 1 und 2 als Theme-Konfiguration dieser Anwendung an.

Starten Sie einmal nach dem Rendern der App-Shell. Übergeben Sie das Layout an das Theme; Native UI übernimmt die Projektion. Ein null-Rand stellt das normale Layout wieder her.

### Zeitpunkt des anfänglichen Layouts

Führen Sie Schritt 3 nach dem Rendern von `ion-app` aus. `setVerticalBarsLayout()` benötigt das gemountete Element. Verwenden Sie die [Start- und Layoutbeispiele](device-layout.md), ohne auf Datenabfragen der Seiten zu warten.

Nativer Start, Gerätepositionierung und Rendering der Bedienelemente sind asynchron. Die Auflösung von `enableNativeUI()` liefert das Laufzeithandle, garantiert jedoch keine bereits abgeschlossene Projektion. Früher Start vermeidet zusätzliche Wartezeiten der Anwendung; das anfängliche Web-Layout kann dennoch vor der nativen Projektion sichtbar sein.

### 4. Erstellen, synchronisieren und auf iPhone Duo ausführen

Erstellen Sie die Web-Assets Ihrer Anwendung und synchronisieren Sie anschließend das native Projekt:

```sh
npx cap sync ios
```

Erstellen Sie mit Xcode 27.1 oder neuer und führen Sie auf iPhone Duo mit iOS 27.1 oder neuer aus. Behalten Sie Ihre bestehende SPM- oder CocoaPods-Integration; siehe [Native UI-Einrichtung](setup.md#4-build-sync-and-run).

**Erwartetes Verhalten, wenn das Gerät eine Seitenleiste meldet:** Ihre bestehende Tab-Leiste und geeignete Aktionen fixierter Werkzeugleisten wechseln an die Seite. Der Inhalt behält sein Theme und reserviert den gemessenen Abstand. Unterstützte iOS-Seitenleisten verwenden SwiftUI; bei fehlender nativer Darstellung bleibt die Web-Seitenleiste. Geräte mit null als Kante behalten ihr gewöhnliches Layout. Mit der [optionalen Browservorschau](#optional-browser-preview) simulieren Sie eine Seitenleiste ohne Gerätemeldung.

Behalten Sie bestehende Klickhandler, Routing und Formularzuordnungen. Aktionen benötigen standardmäßig ein `ion-icon` oder SVG mit `slot="icon-only"` in einer fixierten Werkzeugleiste. Die Regel gilt für alle Füllungen (`default`, `clear`, `solid`, `outline`), einschließlich Submit-Schaltflächen. Andere Aktionen bleiben horizontal. Verwenden Sie `.ios-theme-horizontal-only` auf einer `ion-buttons`-Gruppe oder einzelnen `ion-button`, um eine Aktion horizontal zu belassen.

### Optional: Das Aussehen nativer Schaltflächen wählen

Darstellungseinstellungen und lokale Überschreibungen beschreibt [Schaltflächendarstellung auswählen](vertical-bars.md#choose-button-appearance).

Standard ist `system`: SwiftUI gestaltet vertikale Schaltflächen und färbt ihre Icons. Soll Ihr bestehendes Theme Füllung und Farben liefern, setzen Sie die Optionen am bestehenden Startaufruf der Anwendung; behalten Sie die Geräteverbindung:

```ts
const shell = await enableNativeUI({
  ionic: { verticalBars: { buttonProjection: 'source', buttonDefaultFill: 'solid' } },
});
```

Der Standard `solid` passt zu gewöhnlichen Ionic-Schaltflächen. Innerhalb von `ion-buttons` bleibt der Standard transparent; setzen Sie ausdrücklich `fill="solid"`, um deren Hintergrund zu projizieren. Für einzelne Ausnahmen verwenden Sie [lokale Projektionseinstellungen](vertical-bars.md#override-individual-buttons-or-groups). Diese Einstellungen betreffen nur native vertikale Schaltflächen; Web-Klone behalten ihre Darstellung.

### Wenn die Seitenleiste nicht erscheint

| Beobachtung | Prüfung |
| --- | --- |
| Gewöhnliches Layout | Von Foldable gemeldete Kante prüfen. Eine Kante von null behält absichtlich das gewöhnliche Layout. |
| Gemeldete Kante, aber kein seitlicher Abstand | `vertical-bars.css` laden und erstes Layout sowie `layoutChange`-Ereignisse nach dem Einbinden von `ion-app` anwenden. |
| Platz erscheint, aber Bedienelemente bleiben horizontal | Runtime einmal starten. Bestehende Tabs oder unterstützte Aktionen mit `slot="icon-only"` in einer festen Header-/Footer-Werkzeugleiste verwenden. |
| Eine Aktion bleibt horizontal | Icon-Slot, feste Platzierung und Ausschlüsse prüfen. Siehe [Bedienelementanforderungen](https://webview-native-ui.com/projects/capacitor-native-ui/docs/vertical-bars#toolbar-actions). |

## Optionale Browservorschau

Lassen Sie für lokale Layouttests ohne Gerätemeldung das Foldable-Abonnement aus Schritt 3 vorübergehend weg und wenden Sie nach dem Einbinden von `ion-app` eine simulierte Position an:

```ts
setVerticalBarsLayout({ edge: 'trailing', inset: 80 });
```

Behalten Sie dasselbe Stylesheet und genau eine Native UI-Laufzeit. Verwenden Sie `leading` für die andere logische Kante oder `null` zur Wiederherstellung des gewöhnlichen Layouts. Der Helfer verwaltet `ios-theme-vertical-bars` und seine physisch linke Variante; manuelle Klassen gehören nicht zur Geräteeinrichtung. Reine CSS-Vorschauen beschreiben die [Layoutklassen](../../theme-ios27/docs/vertical-bars-layout.md#reserve-the-vertical-rail).

Web-Seitenleisten-Tabs zeigen Symbole und beim Drücken und Ziehen ihre Beschriftungen. Browservorschauen prüfen Web-Layout und Aktionen, nicht das native SwiftUI-Aussehen. Stellen Sie für den Geräte-Build das Foldable-Abonnement wieder her.

## Die Scharnierstellung ohne Projektion von Bedienelementen verwenden

Wenn Ihr bestehendes Theme nur eine von der Scharnierstellung gesteuerte geteilte Ansicht oder einen Layoutwechsel benötigt, starten Sie keine Projektionslaufzeit und fügen Sie `.ios-theme-vertical-bars` nicht hinzu. Übergeben Sie Ergebnisse von `Foldable.getFoldState()` und Ereignisse `foldStateChange` an `applyFoldStateClasses(root, fold)` und entfernen Sie den Listener zum Abschluss. Ein separater Aufruf zum Starten oder Stoppen der Überwachung existiert nicht.

Ein Abonnementbeispiel, null-Werte und die Lebensdauer der Überwachung beschreibt [Gerätelayout lesen](../../theme-ios27/docs/vertical-bars-layout.md#read-the-device-layout). Optionale Breitenregeln und den halb geöffneten Zustand beschreibt [Split Pane anpassen](../../theme-ios27/docs/vertical-bars-layout.md#adapt-the-split-pane).

## Gemeinsame Layoutregeln und API

Safe-Area-Behandlung, Overlays, RTL, Eignung von Bedienelementen, Web-Simulation und Handle-API sind unter [Vertical Bars](vertical-bars.md) dokumentiert. Lesen Sie diese Referenz für Anpassungen; sie ist kein zusätzlicher Installationsschritt.

## Gerätelayout auflösen

Schritt 3 verbindet den Resolver bereits; ergänzen Sie hier kein weiteres Geräteabonnement. Halten Sie diese Verbindung in einem anwendungseigenen Service oder Integrationsmodul, das nach dem Einbinden von `ion-app` initialisiert wird. Geroutete Seiten behalten ihr ursprüngliches Markup und ihre Geschäftshandler.

Foldable meldet die Gerätegeometrie. `resolveVerticalBarsLayout` ist ein SDK-freier Adapter, der `edge`, `inset` und `toolbarTop` zurückgibt; er startet Native UI nicht, registriert keine Ereignisse und schreibt kein CSS. `setVerticalBarsLayout` des Themes besitzt Web-Layout und Standardwerte; Native UI besitzt die Projektion und prüft die native Verfügbarkeit unabhängig davon. `layoutChange` deckt Anzeigeänderungen ab, bei denen Kante und Einzug unverändert bleiben. Abonnieren Sie vor dem ersten Abruf und entfernen Sie den Listener beim Beenden der Anwendung.

Fehlende oder fehlgeschlagene Abrufe bleiben undefiniert, damit das anwendende Theme seine Standardwerte behält. Provider-Frames und Einzüge verwenden CSS-Pixel des Browser-Viewports. Die Punkte von Foldable entsprechen dem üblichen Viewport mit device-width und initial-scale=1; andere Skalierungen benötigen einen normalisierten Provider. Das nächste `dir` auf `ion-app` oder seinen Vorfahren bestimmt die physische Rail-Seite passend zum Theme.
