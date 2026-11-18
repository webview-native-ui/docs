---
title: "Erste Schritte mit Cordova"
sourceRevision: '634df3976e546677419f36950fa411c56c3a96be1221e2ee5ad220049d59cb26'
---

# Erste Schritte mit Cordova

Verwenden Sie das veröffentlichte Paket `@webview-native-ui/cordova-plugin` v0.1.6, um Native UI in eine Cordova-Anwendung einzubinden. Der Adapter verwendet denselben Native UI Core wie das Capacitor-Plugin; die JavaScript-Laufzeit von Capacitor ist nicht erforderlich. Standard-HTML wird über `/core` unterstützt, während der Paketeinstieg die Ionic-Integration ergänzt.

## Voraussetzungen und unterstützter Umfang

- Cordova CLI 13 mit cordova-ios 8.1+ und Swift Package Manager oder cordova-android 15+.
- Native iOS-Bedienelemente erfordern iOS 26+ und Xcode 26+. Ältere iOS-Versionen behalten die Web-Darstellung bei. CocoaPods und ältere Cordova-Versionen werden nicht unterstützt.
- Die Ionic-Integration erfordert `@ionic/core >=8.8.1 <10`. Standard-HTML über `/core` benötigt Ionic nicht.
- Android erfordert API 24+, SDK 36, JDK 21, Kotlin 2.2.20 und Compose. Standardbedienelemente behalten die Web-Darstellung bei; app-lokale Compose-Erweiterungen werden separat unterstützt. Gehen Sie nicht davon aus, dass iOS-Werkzeugleisten und die Suche unter Android im gleichen Umfang verfügbar sind.

## In beiden Projekten dieselbe Version installieren

Führen Sie diesen Befehl im Cordova-Projekt aus:

```sh
cordova plugin add @webview-native-ui/cordova-plugin@0.1.6
```

Bei einer gebündelten Web-Anwendung führen Sie außerdem diesen Befehl in dem npm-Projekt aus, das die Web-Assets erstellt:

```sh
npm install --save-exact @webview-native-ui/cordova-plugin@0.1.6
```

Der Cordova-Befehl installiert das native Plugin. Die npm-Abhängigkeit stellt die Importe für den Web-Bundler bereit. Halten Sie beide Versionen gleich. Behalten Sie `<script src="cordova.js"></script>` im HTML-Einstiegspunkt von Cordova bei, erstellen Sie die Web-Assets unter `www`, führen Sie anschließend `cordova prepare` aus und bauen Sie die native Anwendung neu. Das Neuladen der Web-Assets aktualisiert keinen nativen Code. Die direkte Installation über eine Git-URL wird nicht unterstützt.

Ergänzen Sie für Android diese Einstellungen in `config.xml`:

```xml
<preference name="GradlePluginKotlinEnabled" value="true" />
<preference name="GradlePluginKotlinVersion" value="2.2.20" />
<preference name="AndroidGradlePluginVersion" value="8.13.0" />
<preference name="AndroidJavaSourceCompatibility" value="21" />
<preference name="AndroidJavaTargetCompatibility" value="21" />
<preference name="AndroidKotlinJVMTarget" value="21" />
```

## Nach der Bereitschaft von Cordova starten

Behalten Sie bei der mitgelieferten Browser-API das Handle bei und starten Sie nach `deviceready`:

```js
let nativeUI;

document.addEventListener('deviceready', async () => {
  nativeUI = await window.NativeUI.enableNativeUI();
}, { once: true });
```

Rufen Sie `await nativeUI.destroy()` auf, wenn die Anwendung Native UI dauerhaft nicht mehr verwendet. Prüfen Sie bei der Diagnose des Web-Fallbacks `nativeUI.getStatus()`. Sehen Sie unter iOS in Ihrem CSS Abstände für die Safe Area vor, etwa mit `env(safe-area-inset-top)`; automatische Scroll-View-Insets sind deaktiviert.

Importieren Sie in einer ESM-Anwendung `enableNativeUI` für Standard-HTML aus `@webview-native-ui/cordova-plugin/core` oder für Ionic aus `@webview-native-ui/cordova-plugin`. Verwenden Sie nur eine Form des Laufzeiteinstiegs. Mischen Sie den npm-basierten Start nicht mit dem Start über `window.NativeUI`.

## Optionales iOS-Theme

Installieren Sie das iOS-Theme separat, wenn Ihre App es verwendet. Siehe [Theme für Cordova einrichten](/ionic-theme-ios27/docs/cordova).

**iPhone Duo:** Für Cordova gibt es kein Gegenstück zu `@erkamyaman/capacitor-foldable`. Diese Konfiguration unterstützt das iPhone Duo daher nicht.

## Badges für Werkzeugleisten-Schaltflächen

Platzieren Sie `ion-badge` direkt in einem `ion-button` innerhalb einer `ion-toolbar`.

```html
<ion-toolbar>
  <ion-buttons slot="end">
    <ion-button aria-label="3 notifications">
      <ion-icon name="ellipsis-horizontal" slot="icon-only"></ion-icon>
      <ion-badge color="primary">3</ion-badge>
    </ion-button>
  </ion-buttons>
</ion-toolbar>
```

Auf unterstützten nativen iOS Vertical Bars übernimmt das Badge den Quelltext sowie die Ionic-Hintergrund- und Textfarben. Der Web-Fallback der Leiste behält auch den Anzeigezustand bei. Änderungen an Anzahl und Farbe, Ausblenden und Entfernen aktualisieren die vorhandene Aktion. Verwenden Sie für einen Ungelesen-Indikator ein vollständig leeres `<ion-badge></ion-badge>` ohne Leerzeichen oder Zeilenumbrüche darin. Nehmen Sie den Benachrichtigungsstatus in die barrierefreie Beschriftung auf. Aktualisieren Sie beide Plugin-Installationen, führen Sie `cordova prepare` aus und erstellen Sie die native App neu.

## Nächste Schritte

- [Engine-Konzepte und Grenzen](/webview-native-ui-engine/docs/concepts) erläutern das gemeinsame Darstellungsmodell.
- Das [Paket-README](https://github.com/webview-native-ui/cordova-plugin/blob/v0.1.6/README.md) behandelt lokale Archive, Fehlerbehebung, gemeinsam genutzten Quellcode und Entwicklungsprüfungen.
- Melden Sie Probleme mit Cordova-Installation, Callbacks und Lebenszyklus im [Cordova-Repository](https://github.com/webview-native-ui/cordova-plugin/issues).
