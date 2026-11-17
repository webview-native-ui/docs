---
title: 'Créer votre interface native'
sourceRevision: '110cd5cd706483bdd97502d594c8d53e17f6aefae9a351ea491f83e2c01003f7'
---

# Créer votre interface native

Créez un compteur dont l’état et l’action restent dans le Web, avec un rendu SwiftUI sur iOS ou Compose sur Android. L’API d’extension est expérimentale ; l’implémentation reste dans l’app.

Pour [Native UI avec un thème existant](/projects/capacitor-native-ui/docs/ionic-vertical-bars), [HTML sans Ionic](/projects/capacitor-native-ui/docs/framework-independent) ou [Cordova](/projects/cordova-native-ui/docs/readme), utilisez l’intégration correspondante. [Choisissez votre intégration](/#choose-setup) avant de modifier l’application.

## 1. Faire fonctionner le compteur Web

Utilisez l’app [configurée](/standard-setup). Ajoutez le HTML et reliez le clic après le rendu. Avant le code natif, un clic doit afficher Count: 1. Dans un framework, gardez le compteur dans l’état existant et mettez à jour data-count et le libellé depuis cet état.

```html
<div data-counter data-count="0" style="width: 280px; min-height: 128px">
  <p data-count-label>Count: 0</p>
  <button type="button">Increment</button>
</div>
```

```ts
const source = document.querySelector<HTMLElement>('[data-counter]')!;
source.querySelector('button')!.addEventListener('click', () => {
  const count = Number(source.dataset.count ?? 0) + 1;
  source.dataset.count = String(count);
  source.querySelector('[data-count-label]')!.textContent = `Count: ${count}`;
});
```

## 2. Définir le lecteur DOM partagé

Créez src/native-ui/counter.ts. Le nom app.counter doit correspondre à l’enregistrement natif. Le lecteur ne fait que lire le DOM. L’action native active le bouton existant ; l’incrémentation reste uniquement dans le gestionnaire Web.

```ts:src/native-ui/counter.ts
import { defineNativeUI } from '@rdlabo/capacitor-native-ui';

export const counter = defineNativeUI({
  name: 'app.counter',
  selector: '[data-counter]',
  read(element) {
    return {
      props: { count: Number(element.getAttribute('data-count') ?? 0) },
      actions: { increment: element.querySelector<HTMLButtonElement>('button') },
    };
  },
});
```

## 3a. Enregistrer SwiftUI sur iOS

Pour iOS, utilisez Xcode 26+ et une cible iOS 26+. Exécutez npx cap sync ios, ajoutez CounterView.swift à la cible puis insérez l’appel d’enregistrement dans le lancement AppDelegate existant avant JavaScript. Conservez son retour et la configuration Capacitor. Un fichier hors cible n’est pas compilé.

```swift:ios/App/App/CounterView.swift
import SwiftUI
import NativeUIPlugin

struct CounterProps: Decodable {
    let count: Int
}

struct CounterView: View {
    let props: CounterProps
    let actions: NativeUIActions
    @State private var error: String?

    var body: some View {
        HStack {
            Text("Count: \(props.count)")
            Button("Increment") {
                Task { @MainActor in
                    do {
                        try await actions.activate("increment")
                        error = nil
                    } catch {
                        self.error = "Action unavailable"
                    }
                }
            }
            .disabled(!actions.isAvailable("increment"))
            if let error { Text(error) }
        }
    }
}

@MainActor func registerAppNativeUI() throws {
    try NativeUI.register("app.counter") {
        (props: CounterProps, actions: NativeUIActions) in
        CounterView(props: props, actions: actions)
    }
}
```

```swift
do {
    try registerAppNativeUI()
} catch {
    print("Native UI registration failed: \(error)")
}
```

## 3b. Enregistrer Compose sur Android

Pour Android, utilisez API 24+. Après npx cap sync android, ajoutez les compilateurs Kotlin et Compose au buildscript racine avec la version Kotlin de l’app ; la version par défaut publiée est 2.2.20. Appliquez les plugins et activez Compose dans app/build.gradle. Placez App.kt dans le paquet existant en remplaçant com.example.app. Ajoutez android:name=".App" à application dans le manifeste. Si une classe Application existe déjà, ajoutez l’enregistrement à son onCreate.

```groovy:android/build.gradle
buildscript {
  ext.kotlin_version = '2.2.20'
  dependencies {
    classpath "org.jetbrains.kotlin:kotlin-gradle-plugin:$kotlin_version"
    classpath "org.jetbrains.kotlin:compose-compiler-gradle-plugin:$kotlin_version"
  }
}
```

```groovy:android/app/build.gradle
apply plugin: 'kotlin-android'
apply plugin: 'org.jetbrains.kotlin.plugin.compose'

android {
    buildFeatures {
        compose true
    }
}
```

```kotlin:App.kt
package com.example.app

import android.app.Application
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.text.BasicText
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.semantics.*
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.unit.dp
import dev.rdlabo.capacitor.nativeui.NativeUI
import kotlinx.coroutines.CancellationException
import kotlinx.coroutines.launch

class App : Application() {
    override fun onCreate() {
        super.onCreate()
        NativeUI.register(
            name = "app.counter",
            decode = { json -> json.getInt("count") },
        ) { count, actions, context ->
            val scope = rememberCoroutineScope()
            var error by remember { mutableStateOf<String?>(null) }
            val enabled = actions.isAvailable("increment")
            val foreground = if (context.dark) Color.White else Color.Black
            val background = if (context.dark) Color(0xFF202020) else Color.White
            val textStyle = TextStyle(color = foreground)
            Column(Modifier.fillMaxSize().background(background).padding(8.dp)) {
                BasicText("Count: $count", style = textStyle)
                Box(
                    Modifier.fillMaxWidth().heightIn(min = 48.dp)
                        .alpha(if (enabled) 1f else 0.5f)
                        .clickable(enabled = enabled, role = Role.Button, onClickLabel = "Increment count") {
                            scope.launch {
                                try {
                                    actions.activate("increment")
                                    error = null
                                } catch (cancelled: CancellationException) {
                                    throw cancelled
                                } catch (unavailable: IllegalStateException) {
                                    error = "Action unavailable. Try again."
                                }
                            }
                        },
                    contentAlignment = Alignment.Center,
                ) { BasicText("Increment", style = textStyle) }
                BasicText(
                    error ?: "",
                    modifier = Modifier.semantics { liveRegion = LiveRegionMode.Polite },
                    style = textStyle,
                )
            }
        }
    }
}
```

## 4. Ajouter la définition au démarrage

Remplacez src/native-ui.ts par ce module complet, en conservant l’affectation du contrôleur d’apparence si elle existe. Choisissez l’enregistrement 3a pour iOS, 3b pour Android, ou les deux. Le runtime unique démarre sur les deux hôtes natifs ; seul le suivi du layout reste limité à iOS. Conservez l’appel à startNativeUI du framework. Les contrôles intégrés gardent leurs limites de plateforme.

```ts:src/native-ui.ts
import { Capacitor } from '@capacitor/core';
import { enableNativeUI, getDynamicColorScheme, addDynamicColorListener } from '@rdlabo/capacitor-native-ui';
import { Foldable } from '@erkamyaman/capacitor-foldable';
import { resolveVerticalBarsLayout } from '@rdlabo/capacitor-native-ui/integration';
import { setVerticalBarsLayout } from '@rdlabo/ionic-theme-ios27';
import { enableDynamicColors } from '@rdlabo/ionic-theme-md3/dynamic-colors';
import { counter } from './native-ui/counter';

let startup: Promise<void> | undefined;

export function startNativeUI(): Promise<void> {
  return (startup ??= connectNativeUI());
}

async function connectNativeUI(): Promise<void> {
  await enableDynamicColors({
    getScheme: getDynamicColorScheme,
    listen: addDynamicColorListener,
  });

  if (Capacitor.getPlatform() !== 'web') {
    await enableNativeUI({ extensions: [counter] });
  }

  if (Capacitor.getPlatform() === 'ios') {
    const updateLayout = async () => {
      setVerticalBarsLayout(await resolveVerticalBarsLayout(Foldable));
    };
    void Foldable.addListener('layoutChange', () => void updateLayout().catch(console.error))
      .then(updateLayout)
      .catch(console.error);
  }
}
```

## 5. Recompiler et vérifier état et repli

Compilez le Web, synchronisez et recompilez l’application native choisie : les modifications Swift/Kotlin exigent ce rebuild. Deux pressions sur Increment doivent donner 2 dans le natif et data-count. Désactiver le bouton source doit désactiver l’action native. Le compteur Web doit fonctionner dans le navigateur. Sinon, vérifiez noms, ordre d’enregistrement, cible iOS et classe Application Android avant de modifier le lecteur.

```sh
npm run build
npx cap sync
```

Pour les autres propriétés, placements et défilements, consultez la [référence des extensions](/projects/capacitor-native-ui/docs/native-ui-extensions).
