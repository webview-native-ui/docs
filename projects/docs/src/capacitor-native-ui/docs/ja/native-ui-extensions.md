---
title: アプリ内の Native UI 拡張（実験的）
---

# アプリ内の Native UI 拡張（実験的）

> **実験的:** 拡張 API、ネイティブ登録インターフェース、動作は今後のリリースで変更される場合があります。`element` と `tab-accessory` 配置を含む SwiftUI と Kotlin/Compose の両方に適用されます。

拡張は既存の Web UI を iOS の SwiftUI View または Android の Jetpack Compose コンテンツに投影します。両方の定義をアプリ内に置くため、npm パッケージ、別のライブラリー、Capacitor プラグインは不要です。Web 要素を正とし、フォールバック UI としても維持します。

拡張は組み込みコントロールと同じ[投影モデル](../README.md#how-projection-works)を使います。公開する DOM データと操作を定義し、ネイティブ表示を用意してください。

## 始める前に

既存の Capacitor 8 アプリで、未導入ならプラグインをインストールします。

```sh
npm install @rdlabo/capacitor-native-ui @erkamyaman/capacitor-foldable
```

対応するネイティブプラットフォームを選びます。

- **Android:** Capacitor Android プロジェクトと API 24 以降のデバイス・エミュレーターを使います。手順 1、[Kotlin/Compose の登録](#2b-register-compose-content-on-android)、手順 3–4 に進みます。iOS プロジェクト、Xcode、Ionic、テーマパッケージは不要です。
- **iOS:** Capacitor iOS プロジェクト、Xcode 26 以降、iOS 26 以降のデバイス・シミュレーターを使います。手順 1、[SwiftUI の登録](#2a-register-a-swiftui-view-on-ios)、手順 3–4 に進みます。標準コントロールも投影する場合は [Ionic 設定](setup.md)または [HTML 設定](framework-independent.md)に従ってください。
- **両方:** 手順 1 の DOM リーダーを共有し、各プラットフォームで同じ名前にネイティブコンテンツを登録します。

以下の TypeScript 例は Ionic エントリーを使います。Ionic を使わない場合は `defineNativeUI` と `enableNativeUI` の両方を `@rdlabo/capacitor-native-ui/core` からインポートします。

## 1. DOM リーダーを定義する

```ts
// src/native-ui/counter.ts
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

たとえば次の Web ソースを使います。確保した領域にはネイティブコンテンツと操作エラーも表示できます。

```html
<div data-counter data-count="0" style="width: 280px; min-height: 128px">
  <p data-count-label>Count: 0</p>
  <button type="button">Increment</button>
</div>
```

フレームワークのクリックハンドラーでカウントと `data-count` を更新します。通常の HTML なら次で十分です。

```ts
const source = document.querySelector<HTMLElement>('[data-counter]')!;
source.querySelector('button')!.addEventListener('click', () => {
  const count = Number(source.dataset.count ?? 0) + 1;
  source.dataset.count = String(count);
  source.querySelector('[data-count-label]')!.textContent = `Count: ${count}`;
});
```

Shell が DOM 変更を監視し、新しい props をネイティブへ送信します。DOM 属性やテキストに描画した状態は自動で監視します。DOM を変更しないプロパティや外部状態をリーダーが読む場合は、変更後に `shell.markForCheck()` を呼んでください。

## 2a. iOS で SwiftUI View を登録する

CocoaPods プロジェクトでは、まず [Engine の Podfile 設定](https://docs.rdlabo.dev/projects/capacitor-native-ui/docs/setup#4-build-sync-and-run)を完了してください。SwiftPM は Engine を自動で解決します。

プラグインの導入後に `npx cap sync ios` を実行し、アプリの Xcode ターゲットに Swift ファイルを追加します。`@rdlabo/capacitor-native-ui` が提供する `NativeUIPlugin` モジュールをインポートします。既存の SPM または CocoaPods 連携は維持してください。

```swift
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

JavaScript が Shell を有効にする前に、`application(_:didFinishLaunchingWithOptions:)` から `registerAppNativeUI()` を一度呼びます。重複・空の名前は拒否されるため、ここで登録エラーを処理してください。Swift はアプリにコンパイルされるので、View の追加・変更には iOS の再ビルドが必要です。登録は同期的な初期設定で、ネイティブブリッジのコマンドではありません。

## 2b. Android で Compose コンテンツを登録する

Android は **element 拡張のみ**に対応します。明示的に指定したボタンを含め、標準の Ionic・HTML コントロールは Web に残ります。ネイティブ Vertical Bars と `tab-accessory` は iOS の機能です。Android では Web サイドレールと element 拡張を併用できます。同じ DOM リーダー、props、操作対象、`markForCheck()` が両方で使えます。

導入後に `npx cap sync android` を実行し、Android アプリで Kotlin を使います。ルートの `build.gradle` の `buildscript.dependencies` に Kotlin と Compose コンパイラープラグインを追加し、アプリと同じ Kotlin バージョンを使います（プラグインの既定値は `2.2.20`）。未定義ならルートの `buildscript` に `ext.kotlin_version = '2.2.20'` を定義します。

```groovy
classpath "org.jetbrains.kotlin:kotlin-gradle-plugin:$kotlin_version"
classpath "org.jetbrains.kotlin:compose-compiler-gradle-plugin:$kotlin_version"
```

`app/build.gradle` で `kotlin-android` と `org.jetbrains.kotlin.plugin.compose` を適用し、`android { buildFeatures { compose true } }` を有効にします。Native UI の依存関係は Compose UI と Foundation を公開します。Material を使う拡張では依存関係を追加してください。

JavaScript が Shell を有効にする前に、メインスレッドの `Application.onCreate()` から一度登録します。`AndroidManifest.xml` の `<application>` に `android:name=".App"` を設定した `Application` サブクラスを使用し、Activity の再生成ごとの登録は避けてください。

```kotlin
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

Shell はソース DOM の矩形から Compose ホストの位置とサイズを決めます。`context.sourceFrame` は CSS ピクセル、`sourceFrameInDp` は Compose dp、`dpPerCSSPixel` は変換係数です。`sourceID` と `viewportWidth` は現在のソースとビューポートを表します。`rtl` は `LocalLayoutDirection` にも適用します。Compose テーマの選択には `dark` を使います。コンテンツ内でソースの `x` と `y` を再度適用しないでください。

`decode` は投影を受理する前に呼びます。例外が出たソースは Web に残ります。空・重複の登録名は拒否します。スタイルとアクセシビリティーは Compose コンテンツが管理します。Kotlin 変更後は Android アプリを再ビルドしてください。

## 3. ローカル定義で有効にする

```ts
import { enableNativeUI } from '@rdlabo/capacitor-native-ui';
import { counter } from './native-ui/counter';

const shell = await enableNativeUI({ ionic: { auto: false }, extensions: [counter] });
```

この例は Ionic コントロールの自動投影なしで拡張を有効にします。明示的な `data-native-ui` ソースは有効のままです。対応する iOS で標準 Ionic コントロールも投影するには `ionic: { auto: false }` を省略します。Android の標準コントロールはどちらも Web 描画です。

既存の起動呼び出しを上記へ置き換え、2 つ目の Shell を起動しないでください。[アプリルートのライフサイクル例](setup.md#place-startup-in-your-frameworks-app-root)でフレームワークに接続し、共有の起動呼び出しにこれらのオプションを入れます。

繰り返しの有効化でも拡張オブジェクトを安定して維持します。実行中の拡張変更には先に `await shell.destroy()` が必要です。有効化内で拡張名は一意にし、同じソースに重なるセレクターを登録しないでください。拡張はソースの部分木を所有するため、内部の組み込みコントロールは別途投影しません。

## 4. 拡張をビルドして試す

Web アセットをビルドし、設定したプラットフォームを同期・再ビルドします。

- **Android:** `npx cap sync android` を実行し、Android Studio からビルド・起動します。カウンターは Compose で描画されます。
- **iOS:** `npx cap sync ios` を実行し、Xcode からビルド・起動します。iOS 26 以降ではカウンターは SwiftUI で描画されます。

Increment をタップすると元の Web ハンドラーが `data-count` を更新し、ネイティブのカウントも追従します。ブラウザーでは元の Web カウンターが引き続き動作することを確認してください。

ソースごとのフォールバック理由には一時的に [`debug: true`](configuration.md#understand-why-a-source-stays-on-the-web) を有効にします。Web のままなら、JavaScript の有効化前に登録が実行され、両側の名前・props が一致することを確認します。Android では `Application` サブクラスのマニフェスト宣言、iOS では Swift ファイルのアプリターゲットへの所属を確認してください。

## Native UI拡張リファレンス

- <a id="%E3%83%AA%E3%83%BC%E3%83%80%E3%83%BC%E3%81%AE%E5%A5%91%E7%B4%84"></a><a id="reader-contract"></a>[リーダーの契約](native-ui-extension-reference.md#reader-contract)
- <a id="native-scroll-tracking-on-ios-(experimental)"></a><a id="ios-%E3%81%AE%E3%83%8D%E3%82%A4%E3%83%86%E3%82%A3%E3%83%96%E3%82%B9%E3%82%AF%E3%83%AD%E3%83%BC%E3%83%AB%E8%BF%BD%E5%BE%93%EF%BC%88%E5%AE%9F%E9%A8%93%E7%9A%84%EF%BC%89"></a><a id="native-scroll-tracking-on-ios-experimental"></a>[iOS のネイティブスクロール追従（実験的）](native-ui-extension-reference.md#native-scroll-tracking-on-ios-experimental)
- <a id="%E5%86%85%E5%AE%B9%E3%81%A8%E9%85%8D%E7%BD%AE%E3%81%AF%E7%8B%AC%E7%AB%8B%E3%81%97%E3%81%A6%E3%81%84%E3%82%8B"></a><a id="content-and-placement-are-independent"></a>[内容と配置は独立している](native-ui-extension-reference.md#content-and-placement-are-independent)
- <a id="%E3%82%BF%E3%83%96%E3%82%A2%E3%82%AF%E3%82%BB%E3%82%B5%E3%83%AA%E3%83%BC%E3%81%AE%E8%A6%81%E4%BB%B6"></a><a id="tab-accessory-requirements"></a>[タブアクセサリーの要件](native-ui-extension-reference.md#tab-accessory-requirements)
- <a id="%E3%82%BD%E3%83%BC%E3%82%B9%E3%81%AE%E5%BD%A2%E7%8A%B6%E3%81%A8%E8%A1%A8%E7%A4%BA%E7%8A%B6%E6%85%8B%E3%82%92%E5%8F%96%E5%BE%97%E3%81%99%E3%82%8B"></a><a id="read-source-geometry-and-presentation-state"></a>[ソースの形状と表示状態を取得する](native-ui-extension-reference.md#read-source-geometry-and-presentation-state)
- <a id="%E5%85%B1%E9%80%9A%E3%81%AE%E6%8A%95%E5%BD%B1%E6%A9%9F%E8%83%BD%E3%82%92%E4%BD%BF%E3%81%86"></a><a id="use-the-shared-projection-capabilities"></a>[共通の投影機能を使う](native-ui-extension-reference.md#use-the-shared-projection-capabilities)
- <a id="%E3%82%BD%E3%83%BC%E3%82%B9%E3%81%AE%E7%A2%BA%E8%AA%8D%E3%82%92%E4%BA%88%E7%B4%84%E3%81%99%E3%82%8B"></a><a id="schedule-a-source-check"></a>[ソースの確認を予約する](native-ui-extension-reference.md#schedule-a-source-check)
- <a id="%E3%83%8D%E3%82%A4%E3%83%86%E3%82%A3%E3%83%96%E3%81%AE%E7%94%BB%E5%83%8F%E3%81%A8%E8%89%B2%E5%A4%89%E6%8F%9B%E3%82%92%E5%86%8D%E5%88%A9%E7%94%A8%E3%81%99%E3%82%8B"></a><a id="reuse-native-artwork-and-color-conversion"></a>[ネイティブの画像と色変換を再利用する](native-ui-extension-reference.md#reuse-native-artwork-and-color-conversion)
- <a id="%E3%83%A9%E3%82%A4%E3%83%95%E3%82%B5%E3%82%A4%E3%82%AF%E3%83%AB%E3%81%A8%E6%93%8D%E4%BD%9C%E3%81%AE%E5%AE%8C%E4%BA%86"></a><a id="lifecycle-and-action-completion"></a>[ライフサイクルと操作の完了](native-ui-extension-reference.md#lifecycle-and-action-completion)
- <a id="%E6%93%8D%E4%BD%9C%E3%81%AE%E5%AE%8C%E4%BA%86"></a><a id="action-completion"></a>[操作の完了](native-ui-extension-reference.md#action-completion)
- <a id="example%3A-mini-player"></a><a id="%E4%BE%8B%3A-%E3%83%9F%E3%83%8B%E3%83%97%E3%83%AC%E3%83%BC%E3%83%A4%E3%83%BC"></a><a id="example-mini-player"></a>[例: ミニプレーヤー](native-ui-extension-reference.md#example-mini-player)
