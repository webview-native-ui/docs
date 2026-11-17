---
title: '独自のネイティブUIを作る'
sourceRevision: '110cd5cd706483bdd97502d594c8d53e17f6aefae9a351ea491f83e2c01003f7'
---

# 独自のネイティブUIを作る

カウントと加算処理をWeb側に保ったまま、iOSではSwiftUI、AndroidではComposeで表示するカウンターを作ります。拡張APIは実験的な機能です。この例の実装はアプリ内に置きます。

[既存テーマにNative UIを追加する場合](/projects/capacitor-native-ui/docs/ionic-vertical-bars)、[Ionicを使わないHTML](/projects/capacitor-native-ui/docs/framework-independent)、[Cordova](/projects/cordova-native-ui/docs/readme)はそれぞれの手順を使います。アプリを変更する前に[導入方法を選べます](/#choose-setup)。

## 1. 先にWebのカウンターを動かす

[導入手順](/standard-setup)のアプリを使います。画面に次のHTMLを置き、描画後にクリック処理を接続します。ネイティブコードを追加する前に、一度押すとCount: 1になることを確認してください。フレームワークでは既存の状態管理を使い、同じdata-count属性とラベルをその状態から更新します。

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

## 2. 共通のDOM readerを定義する

src/native-ui/counter.tsを作り、次の定義を置きます。app.counterという名前をネイティブの登録名と一致させます。readerはDOMを読むだけで状態を書き換えません。ネイティブの操作は既存のボタンを呼ぶので、加算処理はWeb側の一つだけです。

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

## 3a. iOSにSwiftUIを登録する

iOSではXcode 26以降とiOS 26以降のターゲットを使います。npx cap sync iosを実行し、CounterView.swiftをアプリのターゲットに追加します。次の実装を置き、既存のAppDelegateの起動処理で、JavaScriptが始まる前に登録を呼びます。既存の戻り値とCapacitorの設定は維持してください。ファイルをターゲットに含めないとビルドされません。

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

## 3b. AndroidにComposeを登録する

AndroidではAPI 24以降の端末またはエミュレーターを使います。npx cap sync androidの後、ルートのbuildscript.dependenciesにKotlinとComposeコンパイラを追加します。アプリのKotlin版に揃え、公開プラグインの既定版は2.2.20です。app/build.gradleでプラグインとComposeを有効にします。App.ktは既存のアプリパッケージ内に置き、com.example.appをその名前に置き換えます。AndroidManifest.xmlの既存のapplicationにandroid:name=".App"を設定してください。Applicationクラスがある場合は作り直さず、既存のonCreateへ登録部分を追加します。

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

## 4. 既存の起動処理に定義を渡す

導入時のsrc/native-ui.tsを次のモジュールに置き換えます。外観設定を追加済みなら、そのコントローラーへの代入は維持してください。iOSは手順3a、Androidは3bの登録を選び、両方に対応する場合だけ両方を実装します。ランタイムの起動は両ネイティブホストへ広げ、レイアウト購読だけをiOS内に残します。フレームワーク側のstartNativeUI呼び出しはそのままです。組み込みコントロールの対応範囲は変わりません。

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

## 5. 再ビルドして状態とフォールバックを確認する

Webアプリをビルド・同期し、対象のネイティブアプリも再ビルドします。SwiftやKotlinの変更はWebの再読み込みだけでは反映されません。Incrementを二度押し、ネイティブの表示とWebのdata-countが両方2になることを確認します。元のボタンをdisabledにするとネイティブの操作も無効になります。ブラウザーでは元のWebカウンターが動けば完了です。ネイティブ表示にならない場合は、readerを変える前にapp.counterの名前、起動前の登録、iOSターゲットへの所属、AndroidのApplication設定を確認します。

```sh
npm run build
npx cap sync
```

ほかのpropsや配置、ネイティブのスクロール追従を使う場合は[拡張リファレンス](/projects/capacitor-native-ui/docs/native-ui-extensions)を参照してください。
