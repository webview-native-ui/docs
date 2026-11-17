---
title: '独自のネイティブUIを作る'
sourceRevision: '37f9d083616edac03d3d061e002e3bddfe49b4b0893522155e8ff29a649d1aed'
---

# 独自のネイティブUIを作る

導入手順で組み込みコントロールは有効になっています。この任意の使い方では、独自のカウンターをiOSのSwiftUIまたはAndroidのComposeで追加します。カウントと加算処理はWeb側に保ちます。拡張APIは実験的な機能です。

この差分は、[アプリへの導入が完了](/standard-setup)し、一時確認用フックも撤去した状態から始めます。

[既存テーマにNative UIを追加する場合](/projects/capacitor-native-ui/docs/ionic-vertical-bars)、[Ionicを使わないHTML](/projects/capacitor-native-ui/docs/framework-independent)、[Cordova](/projects/cordova-native-ui/docs/readme)はそれぞれの手順を使います。アプリを変更する前に[導入方法を選べます](/#choose-setup)。

## 1. 先にWebのカウンターを動かす

導入完了後のアプリにある、既存ルートから表示している画面を使います。例ではその既存画面をCounterと呼びますが、導入手順で作成したページではありません。実際のファイル名・コンポーネント名・ルートを維持し、その画面へ自分のフレームワークの差分だけを適用します。新しいページ・ルート・描画後callbackは不要です。元のヘッダーと本文は残します。カウントはフレームワークの状態で持ち、既存のイベント接続からCountラベルとdata-count属性を同時に更新します。同じルートをブラウザーで開いてIncrementを2回押し、ラベルとdata-countがどちらも2になれば、この手順は完了です。手順2では同じ要素をネイティブ表示へ接続します。

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

## 2. 共通のDOM readerを定義する

Webカウンターが動いた状態から、新しいreaderファイルを作ります。全行が追加です。app.counterという名前をネイティブ登録名と一致させます。この手順の終了時は、propsと既存のWebボタンを読み取れる状態で、ネイティブ実装の登録はまだです。

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

iOSを対象にする場合だけ、この分岐を実施します。アプリのディレクトリでnpx cap sync iosを実行し、Xcode 26以降で新しいCounterView.swiftをiOS 26以降のアプリターゲットへ追加します。AppDelegateの既存の起動メソッドに、JavaScript起動前の登録差分を適用し、元の戻り値とCapacitorの設定は維持します。起動時にネイティブ実装を登録する状態になりますが、JavaScriptとの接続は手順4で行います。

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

Android API 24以降を対象にする場合だけ実施します。アプリのディレクトリでnpx cap sync androidを実行し、既存のGradleファイルへ差分を適用します。Kotlinの版は例に合わせて変更せず、アプリで使っている値を維持します。登録済みのApplicationクラスがあれば、通常のApp.kt編集差分をそのクラスへ適用し、既存のonCreateも残します。クラスがない場合だけnew Applicationと書かれた新規作成とmanifestの差分を使い、両方は適用しません。com.example.appは既存パッケージ名へ読み替えます。Composeと登録の設定がそろった状態になり、JavaScriptとの接続は手順4で行います。

rootのbuildファイルではKotlinの差分を一つだけ選びます。Kotlin configuredはアプリで定義済みの版を維持します。Kotlin not configuredは、Kotlin未設定のJavaベースのアプリへ、公開プラグインの既定値2.2.20で不足している定義を追加します。既存のAndroidプラグイン・repositories・アプリ設定は維持します。プラグイン依存関係がすでにある場合は二重に追加しません。

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

選んだネイティブ実装の登録後、既存の起動処理へこの局所差分だけを適用します。counterのimportを追加し、同じランタイムをネイティブホストで起動して拡張を渡します。モジュール全体は置き換えません。外観の状態・配色provider・設定の取得／変更関数はそのまま残すため、外観設定の使い方の前後どちらでも適用できます。iOSのレイアウト購読も既存のままです。ソース上の接続は完了し、残りはネイティブ再ビルドです。

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

## 5. 再ビルドして状態とフォールバックを確認する

アプリのディレクトリでWebをビルド・同期し、対象のネイティブプロジェクトをXcodeまたはAndroid Studioで再ビルドします。Webの再読み込みだけではSwift・Kotlinの変更は入りません。Incrementを2回押すとネイティブ表示とWebのdata-countが2になり、元のボタンを無効にするとネイティブ操作もできないことを確認します。ブラウザーではWebのカウンターが動くことを確認します。対象ホストとWebの動作が一致すれば完了で、他の使い方の診断コードは不要です。

```sh
npm run build
npx cap sync
```

同期後は選んだネイティブターゲットをXcodeまたはAndroid Studioで再ビルドし、アプリを再起動します。カウントはページの状態なので、新しいアプリ起動では0から始まります。同じCounterルートを開いてIncrementを2回押し、ネイティブのラベルとWeb要素のdata-countがどちらも2になることを確認します。

その画面を表示したまま、WebViewのインスペクターのコンソールで次を実行します。ネイティブのIncrementが操作できなくなり、カウントが2のままであることを確認します。

```js
document.querySelector('[data-counter] button').disabled = true;
```

続いて同じコンソールで元のボタンを有効に戻し、再び操作できることを確認します。終了時はボタンを有効にしておきます。コンソールの操作をアプリの恒久的なコードへ追加する必要はありません。

```js
document.querySelector('[data-counter] button').disabled = false;
```

ほかのpropsや配置、ネイティブのスクロール追従を使う場合は[拡張リファレンス](/projects/capacitor-native-ui/docs/native-ui-extensions)を参照してください。
