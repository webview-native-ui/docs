---
title: '独自のネイティブUIを作る'
sourceRevision: '37f9d083616edac03d3d061e002e3bddfe49b4b0893522155e8ff29a649d1aed'
headingAliases:
  '5.-%E5%86%8D%E3%83%93%E3%83%AB%E3%83%89%E3%81%97%E3%81%A6%E7%8A%B6%E6%85%8B%E3%81%A8%E3%83%95%E3%82%A9%E3%83%BC%E3%83%AB%E3%83%90%E3%83%83%E3%82%AF%E3%82%92%E7%A2%BA%E8%AA%8D%E3%81%99%E3%82%8B': '5.-%E5%86%8D%E3%83%93%E3%83%AB%E3%83%89%E3%81%97%E3%81%A6%E3%82%AB%E3%82%A6%E3%83%B3%E3%82%BF%E3%83%BC%E3%82%92%E7%A2%BA%E8%AA%8D%E3%81%99%E3%82%8B'
  '2.-%E5%85%B1%E9%80%9A%E3%81%AEdom-reader%E3%82%92%E5%AE%9A%E7%BE%A9%E3%81%99%E3%82%8B': '2.-web%E3%81%AE%E7%8A%B6%E6%85%8B%E3%81%A8%E6%93%8D%E4%BD%9C%E3%82%92%E8%AA%AD%E3%81%BF%E5%8F%96%E3%82%8B'
---

# 独自のネイティブUIを作る

Webのカウンターを、iOSではSwiftUI、AndroidではComposeで表示します。カウントと加算処理はWeb側で管理します。拡張APIは実験的な機能です。

[Ionicアプリへの導入](/standard-setup)を終えたアプリが対象です。

## 1. 先にWebのカウンターを動かす

既存画面にカウンターを追加します。例のCounterは、アプリの画面名・ファイル名へ読み替えてください。ブラウザーでIncrementを2回押し、Countの表示とdata-count属性がどちらも2になることを確認します。

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

## 2. Webの状態と操作を読み取る

新しくsrc/native-ui/counter.tsを作成します。defineNativeUIで、ネイティブ表示に使うWebの要素を指定します。selectorでカウンター全体を選び、readから次の2つを返します。

- props：ネイティブ画面へ渡すデータです。ここではカウントの値を渡します。
- actions：ネイティブ画面から実行するWebの操作です。加算ボタンを渡すと、ネイティブ側の操作から元のincrementを呼べます。

app.counterは、この定義と、次の手順で追加するSwiftUI／Composeの実装を結び付ける名前です。

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

## 3a. iOSにSwiftUIを登録する

iOS 26以降・Xcode 26以降が対象です。npx cap sync iosを実行し、CounterView.swiftをアプリターゲットへ追加します。AppDelegateの起動メソッドで、JavaScriptの実行前にカウンターを登録します。

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

## 3b. AndroidにComposeを登録する

Android API 24以降が対象です。npx cap sync androidを実行し、既存のGradle設定へ差分を適用します。Applicationクラスがある場合は、そのクラスへApp.ktの変更を加えます。ない場合はnew Applicationの差分とmanifestの差分を使います。com.example.appはアプリのパッケージ名へ読み替えてください。

ルートのbuildファイルは、Kotlin設定済みならKotlin configured、未設定ならKotlin not configuredの差分を選びます。設定済みのKotlinバージョンは維持し、未設定の場合はプラグインの既定値2.2.20を追加します。

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

## 4. 既存の起動処理に定義を渡す

src/native-ui.ts を開き、手順2で作った counter をインポートします。起動時の enableNativeUI() にこの定義を渡すと、カウンターを表示したときに対応するネイティブUIが使われます。

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

## 5. 再ビルドしてカウンターを確認する

Webをビルドしてネイティブプロジェクトへ同期します。

```sh
npm run build
npx cap sync
```

XcodeまたはAndroid Studioで再ビルドし、アプリを起動します。Counter画面でIncrementを2回押し、ネイティブのラベルとWebのdata-countがどちらも2になることを確認します。ブラウザーでもWebのカウンターが動くことを確認してください。

Counter画面を表示したまま、WebViewのインスペクタのコンソールで次を実行します。ネイティブのIncrementも操作できなくなり、カウントが2のままになることを確認します。

```js
document.querySelector('[data-counter] button').disabled = true;
```

同じコンソールでボタンを有効に戻し、再び加算できることを確認します。

```js
document.querySelector('[data-counter] button').disabled = false;
```

ほかのpropsや配置、ネイティブのスクロール追従を使う場合は[拡張リファレンス](/projects/capacitor-native-ui/docs/native-ui-extensions)を参照してください。
