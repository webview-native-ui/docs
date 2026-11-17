---
title: 'Eigene native UI erstellen'
sourceRevision: '37f9d083616edac03d3d061e002e3bddfe49b4b0893522155e8ff29a649d1aed'
---

# Eigene native UI erstellen

Die Einrichtung aktiviert bereits die integrierten Steuerelemente. Diese optionale, experimentelle Aufgabe ergänzt einen eigenen Zähler mit SwiftUI unter iOS oder Compose unter Android; Zustand und Aktion bleiben in der Web-App.

Diese Diffs beginnen nach der [abgeschlossenen Einrichtung](/standard-setup), deren temporärer Prüf-Hook bereits entfernt ist.

Für [Native UI mit vorhandenem Theme](/projects/capacitor-native-ui/docs/ionic-vertical-bars), [HTML ohne Ionic](/projects/capacitor-native-ui/docs/framework-independent) oder [Cordova](/projects/cordova-native-ui/docs/readme) verwenden Sie die jeweilige Anleitung. [Wählen Sie die Einrichtung](/#choose-setup), bevor Sie die App ändern.

## 1. Zuerst den Web-Zähler erstellen

Beginnen Sie nach der Einrichtung mit einer bereits gerouteten Seite. Das Beispiel nennt diese vorhandene Seite Counter; sie wurde nicht durch die Einrichtung erstellt. Wenden Sie nur den Diff Ihres Frameworks an und behalten Sie tatsächlichen Datei-/Komponentennamen und Route. Neue Seite, Route oder Render-Callback sind nicht erforderlich. Vorhandener Header und Inhalt bleiben erhalten. Framework-Zustand steuert Zähler, Count-Text und data-count über die Button-Bindung. Öffnen Sie dieselbe Route im Browser und drücken Sie Increment zweimal. Fertig ist der Schritt, wenn Text und data-count beide 2 zeigen. Schritt 2 macht dasselbe Element für native Darstellung verfügbar.

### Angular / Ionic 9

<!-- prettier-ignore -->
```diff:src/app/counter.page.ts
@@
- import { Component } from '@angular/core';
+ import { Component, signal } from '@angular/core';
 import { IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular';

 @Component({
@@
   imports: [IonHeader, IonToolbar, IonTitle, IonContent],
   template: `
     <ion-header><ion-toolbar><ion-title>Counter</ion-title></ion-toolbar></ion-header>
-     <ion-content><p>Counter details</p></ion-content>
+     <ion-content>
+       <p>Counter details</p>
+       <div data-counter [attr.data-count]="count()" style="width: 280px; min-height: 128px">
+         <p data-count-label>Count: {{ count() }}</p>
+         <button type="button" (click)="increment()">Increment</button>
+       </div>
+     </ion-content>
   `,
 })
- export class CounterPage {}
+ export class CounterPage {
+   readonly count = signal(0);
+   increment(): void {
+     this.count.update((value) => value + 1);
+   }
+ }
```

### React

<!-- prettier-ignore -->
```diff:src/Counter.tsx
@@
+ import { useState } from 'react';
 import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/react';

 export default function Counter() {
+   const [count, setCount] = useState(0);
+   function increment(): void {
+     setCount((value) => value + 1);
+   }
+ 
   return (
     <IonPage>
       <IonHeader><IonToolbar><IonTitle>Counter</IonTitle></IonToolbar></IonHeader>
-       <IonContent><p>Counter details</p></IonContent>
+       <IonContent>
+         <p>Counter details</p>
+         <div data-counter data-count={count} style={{ width: 280, minHeight: 128 }}>
+           <p data-count-label>Count: {count}</p>
+           <button type="button" onClick={increment}>Increment</button>
+         </div>
+       </IonContent>
     </IonPage>
   );
 }
```

### Vue

<!-- prettier-ignore -->
```diff:src/Counter.vue
@@
 <script setup lang="ts">
+ import { ref } from 'vue';
 import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/vue';
+ 
+ const count = ref(0);
+ function increment(): void {
+   count.value++;
+ }
 </script>

 <template>
   <ion-page>
     <ion-header><ion-toolbar><ion-title>Counter</ion-title></ion-toolbar></ion-header>
-     <ion-content><p>Counter details</p></ion-content>
+     <ion-content>
+       <p>Counter details</p>
+       <div data-counter :data-count="count" style="width: 280px; min-height: 128px">
+         <p data-count-label>Count: {{ count }}</p>
+         <button type="button" @click="increment">Increment</button>
+       </div>
+     </ion-content>
   </ion-page>
 </template>
```

## 2. Den gemeinsamen DOM-Reader definieren

Der Web-Zähler funktioniert. Erstellen Sie die neue Reader-Datei; alle Zeilen sind Ergänzungen. app.counter muss zur nativen Registrierung passen. Danach sind Props und Web-Button lesbar, die native Implementierung ist noch nicht registriert.

<!-- prettier-ignore -->
```diff:src/native-ui/counter.ts
+ import { defineNativeUI } from '@rdlabo/capacitor-native-ui';
+ 
+ export const counter = defineNativeUI({
+   name: 'app.counter',
+   selector: '[data-counter]',
+   read(element) {
+     return {
+       props: { count: Number(element.getAttribute('data-count') ?? 0) },
+       actions: { increment: element.querySelector<HTMLButtonElement>('button') },
+     };
+   },
+ });
```

## 3a. SwiftUI unter iOS registrieren

Wählen Sie diesen Zweig nur für iOS. Führen Sie npx cap sync ios im App-Verzeichnis aus und fügen Sie CounterView.swift dem App-Target unter Xcode 26+/iOS 26+ hinzu. Ergänzen Sie den Diff in der bestehenden AppDelegate-Startmethode vor JavaScript; Rückgabe und Capacitor bleiben bestehen. Die native Implementierung wird beim Start registriert; JavaScript folgt in Schritt 4.

<!-- prettier-ignore -->
```diff:ios/App/App/CounterView.swift
+ import SwiftUI
+ import NativeUIPlugin
+ 
+ struct CounterProps: Decodable {
+     let count: Int
+ }
+ 
+ struct CounterView: View {
+     let props: CounterProps
+     let actions: NativeUIActions
+     @State private var error: String?
+ 
+     var body: some View {
+         HStack {
+             Text("Count: \(props.count)")
+             Button("Increment") {
+                 Task { @MainActor in
+                     do {
+                         try await actions.activate("increment")
+                         error = nil
+                     } catch {
+                         self.error = "Action unavailable"
+                     }
+                 }
+             }
+             .disabled(!actions.isAvailable("increment"))
+             if let error { Text(error) }
+         }
+     }
+ }
+ 
+ @MainActor func registerAppNativeUI() throws {
+     try NativeUI.register("app.counter") {
+         (props: CounterProps, actions: NativeUIActions) in
+         CounterView(props: props, actions: actions)
+     }
+ }
```

<!-- prettier-ignore -->
```diff:ios/App/App/AppDelegate.swift
@@
 class AppDelegate: UIResponder, UIApplicationDelegate {
     var window: UIWindow?
     func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
+         do {
+             try registerAppNativeUI()
+         } catch {
+             print("Native UI registration failed: \(error)")
+         }
         return true
     }
 }
```

## 3b. Compose unter Android registrieren

Wählen Sie diesen Zweig nur für Android API 24+. Führen Sie npx cap sync android im App-Verzeichnis aus und ändern Sie die vorhandenen Gradle-Dateien. Behalten Sie die bestehende Kotlin-Version. Bei registrierter Application-Klasse verwenden Sie den normalen App.kt-Diff und behalten onCreate-Inhalte. Nur ohne solche Klasse verwenden Sie stattdessen new Application und den Manifest-Diff. Beide Alternativen nicht gemeinsam anwenden. com.example.app ist durch das vorhandene Paket zu ersetzen. Danach sind Compose und Registrierung konfiguriert; JavaScript folgt in Schritt 4.

Wählen Sie für die Root-Build-Datei genau eine Kotlin-Variante. Kotlin configured behält die bereits definierte Version. Kotlin not configured ergänzt die fehlende Definition mit dem Standard des veröffentlichten Plugins, 2.2.20, für eine Java-App ohne Kotlin-Einrichtung. Android-Plugin, Repositories und App-Einstellungen bleiben bestehen. Bereits vorhandene Plugin-Abhängigkeiten nicht duplizieren.

<!-- prettier-ignore -->
```diff:android/build.gradle (Kotlin configured)
@@
   ext.kotlin_version = '2.2.20'
   dependencies {
     classpath 'com.android.tools.build:gradle:8.13.0'
+     classpath "org.jetbrains.kotlin:kotlin-gradle-plugin:$kotlin_version"
+     classpath "org.jetbrains.kotlin:compose-compiler-gradle-plugin:$kotlin_version"
   }
 }
```

<!-- prettier-ignore -->
```diff:android/build.gradle (Kotlin not configured)
@@
 buildscript {
+   ext.kotlin_version = '2.2.20'
   dependencies {
     classpath 'com.android.tools.build:gradle:8.13.0'
+     classpath "org.jetbrains.kotlin:kotlin-gradle-plugin:$kotlin_version"
+     classpath "org.jetbrains.kotlin:compose-compiler-gradle-plugin:$kotlin_version"
   }
 }
```

<!-- prettier-ignore -->
```diff:android/app/build.gradle
@@
 apply plugin: 'com.android.application'
+ apply plugin: 'kotlin-android'
+ apply plugin: 'org.jetbrains.kotlin.plugin.compose'

 android {
     namespace 'com.example.app'
+     buildFeatures {
+         compose true
+     }
     defaultConfig { applicationId 'com.example.app' }
 }
```

<!-- prettier-ignore -->
```diff:android/app/src/main/java/com/example/app/App.kt
@@
 package com.example.app

 import android.app.Application
+ import androidx.compose.foundation.background
+ import androidx.compose.foundation.clickable
+ import androidx.compose.foundation.layout.*
+ import androidx.compose.foundation.text.BasicText
+ import androidx.compose.runtime.*
+ import androidx.compose.ui.Alignment
+ import androidx.compose.ui.Modifier
+ import androidx.compose.ui.draw.alpha
+ import androidx.compose.ui.graphics.Color
+ import androidx.compose.ui.semantics.*
+ import androidx.compose.ui.text.TextStyle
+ import androidx.compose.ui.unit.dp
+ import dev.rdlabo.capacitor.nativeui.NativeUI
+ import kotlinx.coroutines.CancellationException
+ import kotlinx.coroutines.launch

 class App : Application() {
     override fun onCreate() {
         super.onCreate()
+         NativeUI.register(
+             name = "app.counter",
+             decode = { json -> json.getInt("count") },
+         ) { count, actions, context ->
+             val scope = rememberCoroutineScope()
+             var error by remember { mutableStateOf<String?>(null) }
+             val enabled = actions.isAvailable("increment")
+             val foreground = if (context.dark) Color.White else Color.Black
+             val background = if (context.dark) Color(0xFF202020) else Color.White
+             val textStyle = TextStyle(color = foreground)
+             Column(Modifier.fillMaxSize().background(background).padding(8.dp)) {
+                 BasicText("Count: $count", style = textStyle)
+                 Box(
+                     Modifier.fillMaxWidth().heightIn(min = 48.dp)
+                         .alpha(if (enabled) 1f else 0.5f)
+                         .clickable(enabled = enabled, role = Role.Button, onClickLabel = "Increment count") {
+                             scope.launch {
+                                 try {
+                                     actions.activate("increment")
+                                     error = null
+                                 } catch (cancelled: CancellationException) {
+                                     throw cancelled
+                                 } catch (unavailable: IllegalStateException) {
+                                     error = "Action unavailable. Try again."
+                                 }
+                             }
+                         },
+                     contentAlignment = Alignment.Center,
+                 ) { BasicText("Increment", style = textStyle) }
+                 BasicText(
+                     error ?: "",
+                     modifier = Modifier.semantics { liveRegion = LiveRegionMode.Polite },
+                     style = textStyle,
+                 )
+             }
+         }
     }
 }
```

<!-- prettier-ignore -->
```diff:android/app/src/main/java/com/example/app/App.kt (new Application)
+ package com.example.app
+ 
+ import android.app.Application
+ import androidx.compose.foundation.background
+ import androidx.compose.foundation.clickable
+ import androidx.compose.foundation.layout.*
+ import androidx.compose.foundation.text.BasicText
+ import androidx.compose.runtime.*
+ import androidx.compose.ui.Alignment
+ import androidx.compose.ui.Modifier
+ import androidx.compose.ui.draw.alpha
+ import androidx.compose.ui.graphics.Color
+ import androidx.compose.ui.semantics.*
+ import androidx.compose.ui.text.TextStyle
+ import androidx.compose.ui.unit.dp
+ import dev.rdlabo.capacitor.nativeui.NativeUI
+ import kotlinx.coroutines.CancellationException
+ import kotlinx.coroutines.launch
+ 
+ class App : Application() {
+     override fun onCreate() {
+         super.onCreate()
+         NativeUI.register(
+             name = "app.counter",
+             decode = { json -> json.getInt("count") },
+         ) { count, actions, context ->
+             val scope = rememberCoroutineScope()
+             var error by remember { mutableStateOf<String?>(null) }
+             val enabled = actions.isAvailable("increment")
+             val foreground = if (context.dark) Color.White else Color.Black
+             val background = if (context.dark) Color(0xFF202020) else Color.White
+             val textStyle = TextStyle(color = foreground)
+             Column(Modifier.fillMaxSize().background(background).padding(8.dp)) {
+                 BasicText("Count: $count", style = textStyle)
+                 Box(
+                     Modifier.fillMaxWidth().heightIn(min = 48.dp)
+                         .alpha(if (enabled) 1f else 0.5f)
+                         .clickable(enabled = enabled, role = Role.Button, onClickLabel = "Increment count") {
+                             scope.launch {
+                                 try {
+                                     actions.activate("increment")
+                                     error = null
+                                 } catch (cancelled: CancellationException) {
+                                     throw cancelled
+                                 } catch (unavailable: IllegalStateException) {
+                                     error = "Action unavailable. Try again."
+                                 }
+                             }
+                         },
+                     contentAlignment = Alignment.Center,
+                 ) { BasicText("Increment", style = textStyle) }
+                 BasicText(
+                     error ?: "",
+                     modifier = Modifier.semantics { liveRegion = LiveRegionMode.Polite },
+                     style = textStyle,
+                 )
+             }
+         }
+     }
+ }
```

<!-- prettier-ignore -->
```diff:android/app/src/main/AndroidManifest.xml (new Application)
@@
 <manifest xmlns:android="http://schemas.android.com/apk/res/android">
-     <application android:label="My app">
+     <application android:label="My app" android:name=".App">
         <activity android:name=".MainActivity" />
     </application>
 </manifest>
```

## 4. Die Definition beim bestehenden Start übergeben

Die gewählte native Implementierung ist registriert. Wenden Sie nur diesen lokalen Diff an: Counter importieren, dieselbe Laufzeit auf nativen Hosts aktivieren und Erweiterung übergeben. Ersetzen Sie nicht das Modul. Darstellungszustand, Farbprovider und Einstellungsfunktionen bleiben unverändert; die Aufgabe funktioniert vor oder nach der Darstellungseinstellung. Das iOS-Abonnement bleibt erhalten. Der Quellcode ist verbunden, der native Build steht noch aus.

<!-- prettier-ignore -->
```diff:src/native-ui.ts
@@
 import { setVerticalBarsLayout } from '@rdlabo/ionic-theme-ios27';
+ import { counter } from './native-ui/counter';
@@
     listen: addDynamicColorListener,
   });

+   if (Capacitor.getPlatform() !== 'web') {
+     await enableNativeUI({ extensions: [counter] });
+   }
+ 
   if (Capacitor.getPlatform() === 'ios') {
@@
-     await enableNativeUI();
```

## 5. Neu bauen und Zustand sowie Fallback prüfen

Erstellen und synchronisieren Sie im App-Verzeichnis den Web-Build und bauen Sie das native Ziel in Xcode oder Android Studio neu. Web-Neuladen installiert keine Swift-/Kotlin-Änderung. Zweimal Increment muss nativ und in data-count 2 ergeben; ein deaktivierter Quellbutton muss native Aktivierung verhindern. Der Browser behält den Web-Zähler. Fertig ist die Aufgabe bei übereinstimmendem Verhalten von Ziel und Web, ohne Diagnosecode anderer Aufgaben.

```sh
npm run build
npx cap sync
```

Bauen Sie nach dem Sync das native Ziel in Xcode oder Android Studio neu und starten Sie die App neu. Der Zähler ist Seitenzustand und beginnt bei neuem App-Start mit 0. Öffnen Sie dieselbe Counter-Route und drücken Sie zweimal Increment: Native Beschriftung und Web-data-count müssen 2 zeigen.

Führen Sie bei sichtbarer Seite Folgendes in der WebView-Inspektorkonsole aus. Die native Increment-Aktion muss unverfügbar werden und der Wert 2 bleiben.

```js
document.querySelector('[data-counter] button').disabled = true;
```

Aktivieren Sie den Quellbutton anschließend in derselben Konsole erneut und prüfen Sie die Bedienung. Beenden Sie mit aktivem Button; diese Konsolenoperationen gehören nicht dauerhaft in den App-Code.

```js
document.querySelector('[data-counter] button').disabled = false;
```

Weitere Props, Platzierungen und Scroll-Tracking stehen in der [Erweiterungsreferenz](/projects/capacitor-native-ui/docs/native-ui-extensions).
