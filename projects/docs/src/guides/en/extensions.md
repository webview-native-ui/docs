# Build your own native UI

Build a counter whose count and increment action remain in the Web app, with SwiftUI presentation on iOS or Compose presentation on Android. The extension API is experimental; this example keeps the implementation inside your app.

For [Native UI with an existing theme](/projects/capacitor-native-ui/docs/ionic-vertical-bars), [HTML without Ionic](/projects/capacitor-native-ui/docs/framework-independent), or [Cordova](/projects/cordova-native-ui/docs/readme), use that integration instead. [Choose another setup](/#choose-setup) before changing the app.

## 1. Make the Web counter work first

Use the app from [setup](/standard-setup). Put this markup in a page and attach the handler after the page renders. It should display Count: 1 after one click before you add native code. In a framework page, keep the count in its existing state and update the same data-count attribute and label from that state.

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

## 2. Define the shared DOM reader

Create src/native-ui/counter.ts with this definition. The name app.counter must match native registration. The reader only reads the DOM; it does not change state. Native activation will click the existing button, so the Web handler remains the only increment implementation.

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

## 3a. Register SwiftUI on iOS

For iOS, use Xcode 26+ and an iOS 26+ target. Run npx cap sync ios, add CounterView.swift to the app target, and use the following implementation. Then insert the registration call into the existing AppDelegate launch method before JavaScript starts. Keep the existing return value and Capacitor setup. A Swift file outside the app target will not be compiled.

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

## 3b. Register Compose on Android

For Android, use an API 24+ device or emulator. After npx cap sync android, add the Kotlin and Compose compiler plugins to the root buildscript dependencies, using the app’s Kotlin version; the released plugin defaults to 2.2.20. Apply the plugins and enable Compose in app/build.gradle. Add App.kt under the app’s existing package, replacing com.example.app with that package. Set android:name=".App" on the existing application element in AndroidManifest.xml. If you already have an Application class, keep it and add the registration to its existing onCreate.

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

## 4. Add the definition to the existing startup

Replace src/native-ui.ts from app setup with the complete module below, retaining any appearance-controller assignment already added. Select the native registration in step 3a for iOS or 3b for Android, or both. The one runtime now starts on both native hosts; the layout subscription remains iOS-only. Keep the existing framework call to startNativeUI. Built-in controls still use their supported-platform behavior.

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

## 5. Rebuild and verify state and fallback

Build the Web app, sync, and rebuild the selected native app because Swift and Kotlin changes require a native build. Press Increment twice: both native display and Web data-count must reach 2. Disable the source button and verify the native action is unavailable. In a browser, the original Web counter must still work. If native content does not appear, check app.counter on both sides, native registration before shell startup, iOS target membership, and the Android Application manifest entry before changing the reader.

```sh
npm run build
npx cap sync
```

For other props, placements, and native scroll tracking, use the [extension reference](/projects/capacitor-native-ui/docs/native-ui-extensions).
