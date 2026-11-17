---
title: 'Eigene native UI erstellen'
sourceRevision: '110cd5cd706483bdd97502d594c8d53e17f6aefae9a351ea491f83e2c01003f7'
---

# Eigene native UI erstellen

Erstellen Sie einen Zähler mit Zustand und Aktion im Web sowie SwiftUI-Darstellung unter iOS oder Compose unter Android. Die Erweiterungs-API ist experimentell; die Implementierung bleibt in Ihrer App.

Für [Native UI mit vorhandenem Theme](/projects/capacitor-native-ui/docs/ionic-vertical-bars), [HTML ohne Ionic](/projects/capacitor-native-ui/docs/framework-independent) oder [Cordova](/projects/cordova-native-ui/docs/readme) verwenden Sie die jeweilige Anleitung. [Wählen Sie die Einrichtung](/#choose-setup), bevor Sie die App ändern.

## 1. Zuerst den Web-Zähler erstellen

Verwenden Sie die [eingerichtete App](/standard-setup). Ergänzen Sie HTML und Handler nach dem Rendering. Ein Klick muss schon vor nativem Code Count: 1 anzeigen. Im Framework bleiben Zähler, data-count und Beschriftung mit dem bestehenden Zustand verbunden.

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

## 2. Den gemeinsamen DOM-Reader definieren

Erstellen Sie src/native-ui/counter.ts. app.counter muss dem nativen Registrierungsnamen entsprechen. Der Reader liest nur das DOM. Native Aktivierung betätigt den vorhandenen Button; die Inkrementierung bleibt allein im Web-Handler.

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

## 3a. SwiftUI unter iOS registrieren

Nutzen Sie für iOS Xcode 26+ und ein iOS-26+-Ziel. Führen Sie npx cap sync ios aus, nehmen Sie CounterView.swift in das App-Target auf und registrieren Sie im bestehenden AppDelegate-Start vor JavaScript. Rückgabewert und Capacitor-Konfiguration bleiben erhalten. Dateien außerhalb des Targets werden nicht gebaut.

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

## 3b. Compose unter Android registrieren

Nutzen Sie unter Android API 24+. Ergänzen Sie nach npx cap sync android Kotlin- und Compose-Compiler im Root-buildscript mit der Kotlin-Version der App; der veröffentlichte Standard ist 2.2.20. Aktivieren Sie Plugins und Compose in app/build.gradle. Legen Sie App.kt im bestehenden Paket ab und ersetzen Sie com.example.app entsprechend. Setzen Sie android:name=".App" am application-Element im Manifest. Ergänzen Sie bei einer vorhandenen Application-Klasse nur die Registrierung im bestehenden onCreate.

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

## 4. Die Definition beim bestehenden Start übergeben

Ersetzen Sie src/native-ui.ts durch das vollständige Modul unten und behalten Sie eine bereits ergänzte Zuweisung des Darstellungskontrollers bei. Wählen Sie Registrierung 3a für iOS, 3b für Android oder beide. Die einzelne Runtime startet auf beiden nativen Hosts; nur die Layout-Anbindung bleibt auf iOS begrenzt. Der Framework-Aufruf von startNativeUI bleibt bestehen. Für integrierte Elemente gelten weiterhin ihre Plattformgrenzen.

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

## 5. Neu bauen und Zustand sowie Fallback prüfen

Bauen Sie Web-App und gewählte native App nach dem Sync neu; Swift/Kotlin-Änderungen benötigen einen nativen Build. Nach zwei Increment-Aktionen müssen native Anzeige und data-count den Wert 2 zeigen. Deaktivieren Sie den Quellbutton: auch die native Aktion muss gesperrt sein. Im Browser muss der Web-Zähler funktionieren. Prüfen Sie bei Problemen zuerst Namen, Registrierungszeitpunkt, iOS-Target und Android-Application.

```sh
npm run build
npx cap sync
```

Weitere Props, Platzierungen und Scroll-Tracking stehen in der [Erweiterungsreferenz](/projects/capacitor-native-ui/docs/native-ui-extensions).
