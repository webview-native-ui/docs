---
title: "Migration"
sourceRevision: "4ca2e7f0f7e12cf1411a07b4025c2b2e7a3145072713cef5e20353d374e18b3a"
---

# Migration

Prüfen Sie alle Abschnitte, die neuer als die derzeit installierte Version sind, in aufsteigender Reihenfolge. Führen Sie beispielsweise beim Wechsel von 1.x auf 9.0.0 zuerst die Migrationsschritte für 2.0.0 aus, bevor Sie 9.0.0 prüfen.

Versionsbezogene Abschnitte enthalten Änderungen, die Anpassungen am Anwendungscode oder an der Konfiguration erfordern. Die nachfolgende Vereinfachung der Einrichtung ist optional.


## Optional: die Einrichtung vereinfachen

Das Theme-Stylesheet und `md3ThemeConfig` ermöglichen eine kürzere Einrichtung. Bestehende einzelne Stylesheet-Pfade und Animationsexporte bleiben unterstützt. Anwendungen können das Theme-Stylesheet und das Konfigurationsobjekt unabhängig voneinander übernehmen.

### Die Theme-Stylesheet-Importe ersetzen

```diff
 @import '@ionic/core/css/palettes/dark.system.css';
- @import '@rdlabo/ionic-theme-md3/dist/css/default-variables.css';
- @import '@rdlabo/ionic-theme-md3/dist/css/ionic-theme-md3.css';
+ @import '@rdlabo/ionic-theme-md3/styles/theme.css';
```

Behalten Sie die dunkle Ionic-Palette bei, die Ihre Anwendung bereits auswählt. Das Beispiel verwendet die Systemdarstellung; klassengesteuerte und stets dunkle Anwendungen behalten ihre entsprechende Palette bei. Platzieren Sie Ionics Basisstile vor diesen Importen und anwendungsspezifische Überschreibungen danach. MD3 stellt ein gemeinsames Theme-Stylesheet für diese Modi bereit.

### Die Animationsverdrahtung ersetzen

Ersetzen Sie in einer App, die bereits den Material-Design-Modus verwendet, die manuelle Einrichtung wie folgt.

```diff
- import { mdTransitionAnimation } from '@rdlabo/ionic-theme-md3';
+ import { md3ThemeConfig } from '@rdlabo/ionic-theme-md3';

- const ionicConfig = {
-   mode: 'md' as const,
-   navAnimation: mdTransitionAnimation,
- };
+ const ionicConfig = {
+   ...md3ThemeConfig,
+   // animated: false,
+ };
```

Übergeben Sie das Objekt an Ihre bestehende Framework-Initialisierung. Die Theme-Konfiguration setzt `mode: 'md'` und den passenden MD3-Übergang. Wählen Sie in einer Anwendung mit plattformabhängiger Darstellung die Konfiguration für den gewählten Modus:

```ts
import { isPlatform } from '@ionic/core';
import { md3ThemeConfig } from '@rdlabo/ionic-theme-md3';

const ionicConfig = {
  ...(isPlatform('ios') ? { mode: 'ios' as const } : md3ThemeConfig),
  // animated: false,
};
```

Die Anwendung ist für die Modusauswahl zuständig. Behalten Sie einen bestehenden ausdrücklichen Modus bei, indem Sie die passende Theme-Konfiguration auswählen. Platzieren Sie Anwendungseinstellungen nach dem Spread, damit eigene Animationen Vorrang haben, auch ein ausdrücklich gesetztes `navAnimation: undefined` für Ionics Standardübergang. Die Framework-Importe beschreibt die [Einrichtung](setup.md); einzelne APIs und die kombinierte Theme-Auswahl die [Konfiguration](configuration.md). Dynamic Colors verwendet weiterhin Ionics [klassenbasierte Palette](dynamic-colors.md).

## Migration auf 9.2.0: Anpassung an Android Settings

Eine Template-Migration ist nicht erforderlich. Prüfen Sie vor diesem Update Anwendungs-CSS, das frühere Theme-Abmessungen ausgleicht:

| Komponente | Bisheriges Theme | Aktualisiertes Theme |
| --- | --- | --- |
| Standard-Toggle | Spur 52×32px, Schieber 24px | Spur 52×28px, Schieber 20px |
| Normaler Toolbar-Titel | 20px; 4px Start-Padding neben Steuerelementen am Anfang | 22px / Zeile 28px; Start-Padding 12px |
| Titel eines zweizeiligen eingerückten Eintrags | 18.4px, Stärke 500 | 16px, Stärke 400; Notiz 14px |
| Mindesthöhe gruppierter Einträge | 48px | 56px; Zeilen mit Radio-Steuerelementen 72px |
| Eingerückte Listen mit Überschrift | Zusätzlicher Listenrand/Innenabstand | Überschrift 56px; kein zusätzlicher Blockrand/Innenabstand |

Dies sind Theme-Standardwerte, keine festen Inhaltshöhen. Umbruch und anwendungsspezifische Größen bleiben möglich. Beispiele finden Sie unter [Listengrößen](using-ion-item-group.md#sizing-and-overrides) und [Android Settings-Darstellung](android-settings.md).

Die Demo fügt Kreuz-/Häkchensymbole nicht mehr automatisch hinzu. Anwendungen mit explizitem Aufruf von `applyToggleStateIcons` behalten dieses Verhalten; entfernen Sie den Aufruf und führen Sie dessen Bereinigung aus, wenn Toggles ohne Symbole gewünscht sind. Ionics `enableOnOffLabels` bleibt unterstützt.

Das Haupttheme enthält seine MD-Standardschrift nun im CSS. Laden Sie es nach Ionics Core-Stilen. Bestehende `--ion-font-family`-Anpassungen haben weiterhin Vorrang; ohne Anwendungsschrift nutzt der Browser lokales Google Sans Flex, sofern verfügbar, danach die normale Ersatzschriftfolge. Weder TypeScript-Schrifthelfer noch zusätzliche Stylesheets sind erforderlich. Prüfen Sie Textumbrüche auf unterstützten Geräten und in allen Sprachen; Schriftdateien werden nicht mitgeliefert.

Zurück-Symbole bleiben von Ionic verwaltet. Benannte Farben, Material You-Zuordnung und Symbolanpassungen einzelner Buttons behalten ihre Bedeutung.

## Migration auf 9.0.0

Version 9 gleicht die Hauptversion des Themes an Ionic Framework 9 an. Sie führt keine zusätzlichen inkompatiblen Änderungen über die in früheren Migrationsabschnitten beschriebenen hinaus ein.

Ionic 8 und Ionic 9 bleiben beide unterstützt. Version 9 benötigt `@ionic/core >=8.8.0 <10`.

## Migration auf 2.0.0

### `.header-item-group` in `.item-group-header` umbenennen

Die Klasse für eine als Abschnittsüberschrift verwendete `ion-item-group` wurde umbenannt, um mit dem von ihr angepassten Element übereinzustimmen. Ersetzen Sie jedes Vorkommen von `.header-item-group` in Anwendungstemplates und Styles.

```diff
- <ion-item-group class="header-item-group">
+ <ion-item-group class="item-group-header">
    ...
  </ion-item-group>
```

Die alte Klasse wird vom Theme nicht mehr gestaltet. Diese Umbenennung gilt auch für Markup, das gemeinsam mit `@rdlabo/ionic-theme-ios26` verwendet wird.
