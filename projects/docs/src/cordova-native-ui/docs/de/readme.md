---
title: "Erste Schritte mit Cordova"
sourceRevision: "c9d494267c831a5f60d6ac5950069f416b8663e27c18e6c5dea492385838db46"
---

# Erste Schritte mit Cordova

Verwenden Sie das veröffentlichte Paket `@webview-native-ui/cordova-plugin` v0.1.1, um Native UI in eine Cordova-Anwendung einzubinden. Der Adapter verwendet denselben Native UI Core wie das Capacitor-Plugin; die JavaScript-Laufzeit von Capacitor ist nicht erforderlich. Standard-HTML wird über `/core` unterstützt, während der Paketeinstieg die Ionic-Integration ergänzt.

## Voraussetzungen und unterstützter Umfang

- Cordova CLI 13 mit cordova-ios 8.1+ und Swift Package Manager oder cordova-android 15+.
- Native iOS-Bedienelemente erfordern iOS 26+ und Xcode 26+. Ältere iOS-Versionen behalten die Web-Darstellung bei. CocoaPods und ältere Cordova-Versionen werden nicht unterstützt.
- Die Ionic-Integration und das mitgelieferte Theme erfordern `@ionic/core >=8.8.1 <10`. Standard-HTML über `/core` benötigt Ionic nicht.
- Android erfordert API 24+, SDK 36, JDK 21, Kotlin 2.2.20 und Compose. Standardbedienelemente behalten die Web-Darstellung bei; app-lokale Compose-Erweiterungen werden separat unterstützt. Gehen Sie nicht davon aus, dass iOS-Werkzeugleisten und die Suche unter Android im gleichen Umfang verfügbar sind.

## In beiden Projekten dieselbe Version installieren

Führen Sie diesen Befehl im Cordova-Projekt aus:

```sh
cordova plugin add @webview-native-ui/cordova-plugin@0.1.1
```

Bei einer gebündelten Web-Anwendung führen Sie außerdem diesen Befehl in dem npm-Projekt aus, das die Web-Assets erstellt:

```sh
npm install --save-exact @webview-native-ui/cordova-plugin@0.1.1
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

## Optionales mitgeliefertes Ionic-Theme

Version 0.1.1 enthält das iOS27-Theme in Version 2.1.0. Das eigenständige Theme wird unabhängig veröffentlicht; die Installation seiner neuesten Version aktualisiert die im Cordova-Plugin enthaltene Kopie nicht. Verwenden Sie die Einstiegspunkte `/theme` und `/theme/css/*` des Plugins ohne Bundler-Alias. Folgen Sie der [Cordova-Einrichtung des Themes](/ionic-theme-ios27/docs/cordova) für Animationen und Stylesheets und ersetzen Sie alte Theme-Importe, statt beide Integrationen zu mischen.

Starten Sie Native UI erst, wenn sowohl `deviceready` eingetreten als auch `ion-app` im Lebenszyklus Ihrer Anwendung eingebunden ist. Der Import oder die Gestaltung durch das Theme allein aktiviert keine nativen Bedienelemente. Capacitor ist der primäre Host; Cordova hat einen kleineren Unterstützungsumfang. Erfolgreiche Builds belegen keine vollständige Gleichwertigkeit bei Framework-Routern oder Gesten.

## Nächste Schritte

- [Engine-Konzepte und Grenzen](/webview-native-ui-engine/docs/concepts) erläutern das gemeinsame Darstellungsmodell.
- Das [Paket-README](https://github.com/webview-native-ui/cordova-plugin/blob/5ac3c7e2754c55c3ffde2e90b3d54ad10152362a/README.md) behandelt lokale Archive, Fehlerbehebung, gemeinsam genutzten Quellcode und Entwicklungsprüfungen.
- Melden Sie Probleme mit Cordova-Installation, Callbacks und Lebenszyklus im [Cordova-Repository](https://github.com/webview-native-ui/cordova-plugin/issues).
