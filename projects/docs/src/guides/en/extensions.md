# Build your own native UI

App setup already enables the built-in controls. This optional, experimental task adds your own counter with SwiftUI presentation on iOS or Compose on Android, while its count and increment action remain in the Web app.

These diffs start from [completed app setup](/standard-setup), with its temporary verification hook already removed.

For [Native UI with an existing theme](/projects/capacitor-native-ui/docs/ionic-vertical-bars), [HTML without Ionic](/projects/capacitor-native-ui/docs/framework-independent), or [Cordova](/projects/cordova-native-ui/docs/readme), use that integration instead. [Choose another setup](/#choose-setup) before changing the app.

## 1. Make the Web counter work first

Start from completed setup and a page that already has a route. The example calls that existing page Counter; it was not created by setup. Apply only your framework’s diff to your existing page, keeping its actual filename, component name and route. No new page, route or render callback is needed. The existing header and content remain. Count is owned by framework state, which updates both the Count label and data-count attribute through the existing button binding. Open that same route in the browser and press Increment twice. This step is complete when both label and data-count show 2. Step 2 makes this same source element available for native presentation.

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

## 2. Define the shared DOM reader

The Web counter works. Create this new reader file; all lines are additions. Its app.counter name must match the native registration. At the end, props and the existing Web button can be read, but no native implementation has been registered yet.

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

## 3a. Register SwiftUI on iOS

Choose this branch only for iOS. From the application directory run npx cap sync ios, then add the new CounterView.swift file to the app target in Xcode 26+ for iOS 26+. Apply the AppDelegate diff inside its existing launch method before JavaScript starts; keep the existing return and Capacitor setup. The native implementation is registered at launch, but JavaScript still needs step 4.

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

## 3b. Register Compose on Android

Choose this branch only for Android API 24+. After npx cap sync android in the app directory, apply the build-file diffs to the existing Gradle files. Keep the app’s Kotlin version instead of changing it to match this example. If an Application class is already registered, apply the default App.kt edit to that class and keep its onCreate code. Only if none exists, use the new Application alternative and its manifest diff instead; do not apply both alternatives. Replace com.example.app with the existing package. At the end, Compose and registration are configured, but JavaScript still needs step 4.

For the root build file, choose exactly one Kotlin variant. Kotlin configured keeps the version already defined by the app. Kotlin not configured adds the missing definition using the released plugin’s default, 2.2.20, for a Java-based app without Kotlin setup. Keep the existing Android plugin, repositories and application settings. Do not add a second copy of an already-present plugin dependency.

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

## 4. Add the definition to the existing startup

The selected native implementation is registered. Apply only this local diff to the existing startup: add the counter import, enable the same runtime on native hosts, and pass the extension. Do not replace the module. Leave all appearance state, the color provider and preference getters/setters untouched, so this can be applied before or after the appearance task. The existing iOS layout subscription stays in place. The counter is now connected in source; it still needs the native rebuild.

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

## 5. Rebuild and verify state and fallback

From the application directory, build Web assets, sync, then rebuild the selected native project in Xcode or Android Studio; a Web reload alone cannot install Swift or Kotlin changes. Press Increment twice: native text and Web data-count must reach 2. Disable the source button and verify native activation is unavailable. The browser must retain its Web counter. This task is complete when the selected host and Web behavior agree; no diagnostic code from another task is required.

```sh
npm run build
npx cap sync
```

After syncing, rebuild the selected native target in Xcode or Android Studio and restart the app. The counter is page state, so a fresh app starts at 0. Open the same Counter route and press Increment twice: both the native label and the Web element’s data-count must be 2.

With that page visible, run this in its WebView inspector console. The native Increment action must become unavailable and the count must stay 2.

```js
document.querySelector('[data-counter] button').disabled = true;
```

Then restore the source button in the same console. It must become usable again. Leave the feature with the source button enabled; these console operations do not add permanent application code.

```js
document.querySelector('[data-counter] button').disabled = false;
```

For other props, placements, and native scroll tracking, use the [extension reference](/projects/capacitor-native-ui/docs/native-ui-extensions).
