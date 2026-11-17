---
title: 'Créer votre interface native'
sourceRevision: '37f9d083616edac03d3d061e002e3bddfe49b4b0893522155e8ff29a649d1aed'
---

# Créer votre interface native

La configuration active déjà les contrôles intégrés. Cette tâche facultative et expérimentale ajoute votre propre compteur en SwiftUI sur iOS ou Compose sur Android, tandis que l’état et l’action restent dans l’application Web.

Ces diffs partent de la [configuration terminée](/standard-setup), avec son hook de vérification temporaire déjà retiré.

Pour [Native UI avec un thème existant](/projects/capacitor-native-ui/docs/ionic-vertical-bars), [HTML sans Ionic](/projects/capacitor-native-ui/docs/framework-independent) ou [Cordova](/projects/cordova-native-ui/docs/readme), utilisez l’intégration correspondante. [Choisissez votre intégration](/#choose-setup) avant de modifier l’application.

## 1. Faire fonctionner le compteur Web

Partez de la configuration terminée et d’une page qui possède déjà une route. L’exemple appelle cette page existante Counter ; la configuration ne l’a pas créée. Appliquez seulement le diff de votre framework en gardant son nom de fichier, de composant et sa route réels. Aucune nouvelle page, route ou callback après rendu n’est nécessaire. En-tête et contenu existants restent. L’état du framework pilote le compteur, son libellé et data-count via l’événement du bouton. Ouvrez cette même route dans le navigateur et pressez Increment deux fois. L’étape est terminée lorsque le libellé et data-count valent 2. L’étape 2 rendra ce même élément disponible pour la présentation native.

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

## 2. Définir le lecteur DOM partagé

Le compteur Web fonctionne. Créez ce nouveau reader, toutes les lignes étant ajoutées. app.counter doit correspondre à l’enregistrement natif. À ce stade, props et bouton Web sont lisibles, mais aucune implémentation native n’est enregistrée.

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

## 3a. Enregistrer SwiftUI sur iOS

Choisissez cette branche uniquement pour iOS. Exécutez npx cap sync ios dans le répertoire de l’application puis ajoutez CounterView.swift à la cible Xcode 26+/iOS 26+. Appliquez le diff dans le lancement AppDelegate existant avant JavaScript, en gardant retour et configuration Capacitor. L’implémentation sera enregistrée au lancement ; le raccordement JavaScript reste à l’étape 4.

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

## 3b. Enregistrer Compose sur Android

Choisissez cette branche pour Android API 24+ seulement. Après npx cap sync android dans le répertoire de l’application, modifiez les fichiers Gradle existants. Conservez leur version Kotlin, sans la changer pour copier l’exemple. Avec une classe Application déjà enregistrée, appliquez le diff App.kt normal et gardez son onCreate. Sinon, utilisez seulement l’alternative new Application et son diff manifest. Remplacez com.example.app par le paquet existant. Compose et l’enregistrement sont configurés ; JavaScript reste à raccorder à l’étape 4.

Pour le build racine, choisissez une seule variante Kotlin. Kotlin configured conserve la version déjà définie. Kotlin not configured ajoute la définition manquante avec la valeur par défaut du plugin publié, 2.2.20, pour une application Java sans Kotlin. Conservez plugin Android, repositories et paramètres existants. Ne dupliquez pas une dépendance de plugin déjà présente.

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

## 4. Ajouter la définition au démarrage

L’implémentation native choisie est enregistrée. Appliquez seulement ce diff local : import du compteur, activation du même runtime sur les hôtes natifs et passage de l’extension. Ne remplacez pas le module. État d’apparence, provider de couleurs et fonctions de préférences restent intacts, avant ou après la tâche d’apparence. L’abonnement iOS reste en place. Le code est raccordé ; le rebuild natif reste nécessaire.

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

## 5. Recompiler et vérifier état et repli

Depuis le répertoire de l’application, compilez le Web, synchronisez et recompilez la cible native dans Xcode ou Android Studio. Un rechargement Web n’installe pas Swift/Kotlin. Deux clics doivent donner 2 nativement et dans data-count ; désactiver le bouton source doit rendre l’action native indisponible. Le navigateur garde son compteur Web. La tâche est terminée lorsque cible et Web concordent, sans diagnostic d’une autre tâche.

```sh
npm run build
npx cap sync
```

Après synchronisation, recompilez la cible native dans Xcode ou Android Studio puis redémarrez l’application. Le compteur appartient à la page ; un nouveau lancement commence à 0. Ouvrez la même route Counter et pressez Increment deux fois : libellé natif et data-count Web doivent valoir 2.

Sur cette page visible, exécutez ceci dans la console de l’inspecteur WebView. L’action native Increment doit devenir indisponible et le compte rester à 2.

```js
document.querySelector('[data-counter] button').disabled = true;
```

Réactivez ensuite le bouton source dans la même console et vérifiez son fonctionnement. Laissez le bouton actif à la fin ; ces opérations de console ne constituent pas du code permanent à ajouter.

```js
document.querySelector('[data-counter] button').disabled = false;
```

Pour les autres propriétés, placements et défilements, consultez la [référence des extensions](/projects/capacitor-native-ui/docs/native-ui-extensions).
