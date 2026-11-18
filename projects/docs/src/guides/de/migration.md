---
title: 'Zur empfohlenen Konfiguration wechseln'
sourceRevision: '0b3b1fd5d4b6c09c3e577c41aeb23c69815275559949b73d7d9a600a914aa5c8'
---

# Zur empfohlenen Konfiguration wechseln

Bisher mussten Apps jedes Paket einzeln konfigurieren. Diese Anleitung zeigt, wie Sie die bisherigen Einstellungen für die bereits verwendeten Themes und nativen Funktionen Ihrer Ionic-App durch die empfohlene Konfiguration ersetzen.

## 1. Die installierten Pakete erfassen

Ermitteln Sie in Ihrer App mit Ionic 9 und Capacitor 8 die installierten Themes und Plugins für die Aktualisierung in Schritt 2. Für Cordova gilt die [Anleitung zum Cordova-Plugin](/projects/cordova-native-ui/docs/readme).

```sh
npm ls @rdlabo/ionic-theme-ios26 @rdlabo/ionic-theme-ios27 @rdlabo/ionic-theme-md3 @rdlabo/capacitor-native-ui @erkamyaman/capacitor-foldable
```

## 2. Die verwendeten Pakete aktualisieren

Aktualisieren Sie anhand der Liste nur verwendete Pakete. Der Sammelbefehl gilt nur für diese Kombination. Danach sind Abhängigkeiten und Lockfile aktualisiert, bestehende Quellanbindung noch unverändert.

Aktualisieren Sie für Ionic + Capacitor diese Pakete gemeinsam und behalten Sie Foldable-Hauptversion 8 bei. Aktualisieren Sie bei einer Theme-App nur das installierte Theme. Behalten Sie die Lockdatei und führen Sie nicht sämtliche Varianten aus.

```sh
npm install @rdlabo/ionic-theme-ios26@latest @rdlabo/ionic-theme-ios27@latest   @rdlabo/ionic-theme-md3@latest @rdlabo/capacitor-native-ui@latest   @erkamyaman/capacitor-foldable@8
```

Wenn Ihre App die integrierte Native UI einer älteren Version des iOS-27-Themes verwendet, folgen Sie der [Migrationsanleitung des Pakets](/projects/ionic-theme-ios27/docs/migration#native-ui-package-separation).

## 3. Erscheinungsmodus erhalten und Imports vereinfachen

Wenden Sie diesen Style-Diff nur bei passender alter class-Gruppe an. Eine bisherige system/always-Regel bleibt stattdessen erhalten. Die Darstellungsregel bleibt gleich; nur die Importzusammenstellung wird vereinfacht.

Eine App mit klassenbasierter iOS-27-Palette kann diese Gruppe durch ein Preset ersetzen. Behalten Sie system.css bei System-Theme oder always.css bei stets dunklem Theme bei. Für iOS 26/27 + MD3 behalten Sie die Imports und das gemeinsame iOS-Preset der [Einrichtung](/standard-setup); fügen Sie diesen einzelnen iOS-27-Import nicht zusätzlich hinzu.

Die kombinierte Einrichtung behält standardmäßig system-Imports beider iOS-Themes für den OS-Hell-/Dunkelmodus. Behalten Sie diese bei einer reinen Theme-Aktualisierung. Erst die [Darstellungsaufgabe](/guides/appearance) wechselt für appgesteuerte Überschreibungen zu class, unabhängig von Gerätefarben. Der folgende alte class-Paletten-Diff behält dessen bisherige manuelle Regel bei.

<!-- prettier-ignore -->
```diff:src/global.css
@@
 @import '@ionic/core/css/core.css';
- @import '@ionic/core/css/palettes/dark.class.css';
- @import '@rdlabo/ionic-theme-ios27/dist/css/default-variables.css';
- @import '@rdlabo/ionic-theme-ios27/dist/css/ionic-theme-ios27.css';
- @import '@rdlabo/ionic-theme-ios27/dist/css/ionic-theme-ios27-dark-class.css';
- @import '@rdlabo/ionic-theme-ios27/dist/css/md-remove-ios-class-effect.css';
+ @import '@rdlabo/ionic-theme-ios27/styles/class.css';
```

## 4. Den bestehenden Layout-Handler aktualisieren

Ändern Sie bei vorhandenem altem Layout-Callback nur Import und Resolver-Zuordnung. Der Listener ist bestehender Kontext. Ohne diese Funktion überspringen. Danach wendet genau das bestehende Abonnement das Resolver-Ergebnis an.

Ersetzen Sie eine direkte getBarPlacement-Abbildung auf edge/inset im vorhandenen layoutChange-Handler durch den Resolver; er liefert auch toolbarTop. Ergänzen Sie weder ein zweites Abonnement noch eine Preset-Auswahl je OS-Generation oder einen manuellen Wrapper um das gemeinsame iOS-Preset. Der Runtime bleibt an der Shell.

Ohne vorhandene Geräte-Layout-Anbindung überspringen Sie diesen Schritt.

<!-- prettier-ignore -->
```diff:src/native-ui.ts
@@
 import { enableNativeUI } from '@rdlabo/capacitor-native-ui';
 import { Foldable } from '@erkamyaman/capacitor-foldable';
+ import { resolveVerticalBarsLayout } from '@rdlabo/capacitor-native-ui/integration';
 import { setVerticalBarsLayout } from '@rdlabo/ionic-theme-ios27';

 export async function startLegacyUI(): Promise<void> {
   await enableNativeUI();
   const updateLayout = async () => {
-     const placement = await Foldable.getBarPlacement();
-     setVerticalBarsLayout({ edge: placement.edge, inset: placement.inset });
+     setVerticalBarsLayout(await resolveVerticalBarsLayout(Foldable));
   };
   void Foldable.addListener('layoutChange', () => void updateLayout().catch(console.error))
     .then(updateLayout)
```

## 5. Neu bauen und Verhalten prüfen

Die zutreffenden Quelländerungen sind abgeschlossen. Bauen Sie im App-Verzeichnis und führen Sie nur Befehle vorhandener nativer Ziele aus. Browser-/Theme-Apps enden nach Web-Prüfungen. Native Apps enden nach erneutem Build, Sync, Neustart und Prüfung genutzter Funktionen, ohne neue Rail- oder Erweiterungs-Voraussetzung.

Bei einer Browser- oder reinen Theme-App genügen Web-Build und Prüfung des Themes, der Hell/Dunkel-Regel und der Navigation. Damit ist die Migration abgeschlossen; Schritte für nicht genutzte Native-UI- und Layout-Funktionen entfallen. Ein natives Projekt oder Rail-Gerät ist nicht nötig.

Mit nativen Funktionen bauen Sie Web-Assets und führen nur die Befehle vorhandener Ziele aus. Prüfen Sie tatsächlich genutzte native Funktionen, Web-Aktionen und Navigation einschließlich Abbruch. Gerätefarben und Rails testen Sie nur, wenn installiert und unterstützt; andernfalls den Fallback auf dem verfügbaren Gerät. Eigene Erweiterungen sind nicht erforderlich.

```sh
npm run build
```

### iOS

```sh
npx cap sync ios
npx cap open ios
```

### Android

```sh
npx cap sync android
npx cap open android
```

Für [Native UI mit vorhandenem Theme](/projects/capacitor-native-ui/docs/ionic-vertical-bars), [HTML ohne Ionic](/projects/capacitor-native-ui/docs/framework-independent) oder [Cordova](/projects/cordova-native-ui/docs/readme) verwenden Sie die jeweilige Anleitung. [Wählen Sie die Einrichtung](/#choose-setup), bevor Sie die App ändern.
