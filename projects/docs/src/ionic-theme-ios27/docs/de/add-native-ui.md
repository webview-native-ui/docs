---
title: "Native UI zum Theme hinzufügen"
sourceRevision: "c96f45ac9a6826b673cdac04e1df2b27f0ee77fa8f41e403da57047a28d10da1"
---

# Native UI zum Theme hinzufügen

Für iOS Native UI und Android Dynamic Color zusammen verwenden Sie die [WebView Native UI Standardeinrichtung](https://webview-native-ui.com/standard-setup). Diese Seite ergänzt ein bestehendes iOS-Theme um Native UI.

Verwenden Sie `@rdlabo/ionic-theme-ios27` bereits in einer Capacitor-App? Ergänzen Sie native Steuerelemente unter iOS und behalten Sie Theme-Stile, Web-Inhalte und Routing bei. Nicht unterstützte Steuerelemente, Browser und Android behalten ihre Web-Darstellung.

Beginnen Sie mit der [Theme-Einrichtung](setup.md), falls das Theme noch nicht konfiguriert ist. Für eine andere Web-Darstellung folgen Sie stattdessen der [Einrichtung mit vorhandenem Theme](../../capacitor-native-ui/docs/ionic-vertical-bars.md).

Unter [Funktionsweise der Projektion](../../capacitor-native-ui/docs/native-ui.md) erfahren Sie, wie native Bedienelemente mit Ihrem Web-DOM und Ihren Handlern verbunden bleiben.

## 1. Das native Plugin installieren

Diese Anleitung setzt eine Capacitor-8-Anwendung mit iOS-Projekt voraus. Für Cordova folgen Sie der separaten [Cordova-Einrichtung](cordova.md). Das reine Web-Theme lässt sich ohne Capacitor nutzen; native iOS-Steuerelemente benötigen zuvor ein eingerichtetes natives Projekt. Die unterstützten Ionic-, iOS- und Xcode-Versionen finden Sie in den [Native UI-Voraussetzungen](https://webview-native-ui.com/projects/capacitor-native-ui/docs/readme#requirements).

Theme und Native UI werden unabhängig versioniert. Installieren Sie eine Native UI-Version, die mit der deklarierten Peer-Abhängigkeit des Themes kompatibel ist, sowie Foldable als separate Anwendungsabhängigkeit:

```sh
npm install @rdlabo/ionic-theme-ios27 @rdlabo/capacitor-native-ui @erkamyaman/capacitor-foldable
```

Capacitors standardmäßige Plugin-Erkennung benötigt eine direkte Abhängigkeit; die allein über das Theme installierte Kopie registriert das native Plugin nicht.

Behalten Sie das Stylesheet aus der [Theme-Einrichtung](setup.md), das das Vertical-Bars-Layout enthält. Verwenden Sie Foldable 8.5 oder neuer innerhalb von Version 8.

## 2. Native Bedienelemente aktivieren

Führen Sie den Code einmal nach dem Rendern von `ion-app` aus. Normale Steuerelemente und Vertical Bars sind standardmäßig aktiviert. Abonnieren Sie Änderungen vor dem Anwenden des anfänglichen Layouts:

```ts
import { enableNativeUI } from '@rdlabo/capacitor-native-ui';
import { Foldable } from '@erkamyaman/capacitor-foldable';
import { resolveVerticalBarsLayout } from '@rdlabo/capacitor-native-ui/integration';
import { setVerticalBarsLayout } from '@rdlabo/ionic-theme-ios27';

await enableNativeUI();

const updateLayout = async () => {
  setVerticalBarsLayout(await resolveVerticalBarsLayout(Foldable));
};

void Foldable.addListener('layoutChange', () => void updateLayout().catch(console.error))
  .then(updateLayout)
  .catch(console.error);
```

Für Angular platzieren Sie diesen Startcode im `afterNextRender`-Callback der App-Shell. Für React oder Vue führen Sie beides nach dem Mounten der Shell aus. Das Theme setzt die Geräteabstände um; Native UI übernimmt die native Darstellung. Ein edge von null stellt das normale Layout wieder her.

Behalten Sie `navAnimation: iosTransitionAnimation` aus dem Theme-Paket. Diese Animation koordiniert native Bedienelemente bereits bei Seitenübergängen und Zurückgesten; umschließen Sie sie nicht erneut. Für eigene Animationen folgen Sie den [Anweisungen zum Übergangsadapter](../../capacitor-native-ui/docs/migration.md#native-ui-transition-adapter).

Die Installation des Plugins oder die Konfiguration der Theme-Animationen aktiviert keine nativen Bedienelemente. Die Anwendung aktiviert sie mit dem obigen Startaufruf.

## 3. Synchronisieren und unter iOS ausführen

Schließen Sie bei CocoaPods-Projekten zunächst die [Engine-Podfile-Einrichtung](https://webview-native-ui.com/projects/capacitor-native-ui/docs/configuration#native-project-setup) ab. SwiftPM löst Engine automatisch auf. Bauen Sie Ihre Web-Assets und führen Sie anschließend Folgendes aus:

```sh
npx cap sync ios
```

Starten Sie die App auf einem unterstützten iOS-Gerät oder Simulator. Geeignete fixierte Bedienelemente sollten nativ dargestellt werden und weiterhin ihre vorhandenen Handler aufrufen. Navigieren Sie vorwärts und zurück und prüfen Sie anschließend dieselbe App im Browser auf den Web-Fallback. Bleibt unter unterstütztem iOS alles im Web, prüfen Sie direkte Abhängigkeit, Startaufruf, Synchronisierung und erneuten nativen Build. Unter [unterstützte Bedienelemente](../../capacitor-native-ui/docs/native-ui.md#supported-markup) finden Sie geeignetes Markup und das Web-Fallback-Verhalten. Behalten Sie die Theme-Stile für Web-Inhalte und nicht projizierte Bedienelemente.

## Eine bestehende native Integration aktualisieren

Wenn Sie native APIs bisher aus dem Theme-Paket importiert haben, folgen Sie der [Migration nativer Importe](../../capacitor-native-ui/docs/migration.md#2-replace-native-imports) und der [Migration des nativen Projekts](../../capacitor-native-ui/docs/migration.md#3-sync-the-native-project). Behalten Sie gewöhnliche Theme-Importe und Stylesheets.
