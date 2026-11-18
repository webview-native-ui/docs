---
title: Native UI拡張リファレンス
---

# Native UI拡張リファレンス

カウンターの実装手順は[アプリ内のNative UI拡張](native-ui-extensions.md)を参照してください。

## リーダーの契約

| 項目 | 要件 |
| -------------- | -------------------------------------------------------------------------------------------------------------- |
| 実行 | 同期的で読み取り専用。 |
| Web フォールバック | ソースを Web に残す場合は `null` を返す。 |
| `props` | 有限数、文字列、真偽値、null、配列、オブジェクトを含む JSON オブジェクト。64K 文字まで。 |
| 操作対象 | ソース自身または子孫。存在しない・非表示・無効の対象は実行不可。 |
| 操作数 | ソースごとに最大 30。 |

## iOS のネイティブスクロール追従（実験的）

単一の overflow スクロールコンテナ内の要素には `scrollElement` を指定します。Web 側がレイアウトを計測し、iOS は対応する `UIScrollView` を監視して、スクロール中はネイティブの位置とクリッピングだけを更新します。同じコンテナ内のソースは1つのオブザーバーを共有します。バインディングはスクロールが停止している間に DOM とネイティブの座標原点を補正し、コンテンツの更新後もその対応を保持します。一部が見えているコントロールはネイティブのままで、完全にクリッピングされたコントロールは入力を受け付けません。

```ts
const scrollElement = await ionContent.getScrollElement();
const counter = defineNativeUI({
  name: 'app.counter',
  selector: '[data-counter]',
  scrollElement: () => scrollElement,
  read(element) {
    return {
      props: { count: Number(element.getAttribute('data-count') ?? 0) },
      actions: { increment: element.querySelector<HTMLButtonElement>('button') },
    };
  },
});
```

通常の HTML では `overflow: auto` または `scroll` を持つ要素を返します。準備ができるまでは `null` を返し、準備完了によって DOM が変更されなかった場合は `shell.markForCheck()` を呼び出します。ソースの寸法やコンテンツのレイアウト変更を監視可能な状態に保ち、Shell が監視できない変更には `markForCheck()` を使ってください。

この機能は、非公開のクラス名を使わずに WebKit 内部の overflow ビュー階層を利用します。バインディングはちょうど1つのネイティブスクローラーに一致する必要があります。一致するものがない場合や曖昧な場合は、操作可能な Web ソースを維持します。このオプトイン機能は、入れ子のスクロール、角丸や任意形状のクリッピング、CSS の変形・ズーム、sticky／fixed の子孫要素、ドキュメントのスクロール、古いネイティブバイナリ、Android に対応していません。従来の JS ベースの配置経路を維持するには `scrollElement` を省略します。同じスクローラー内でも、バインディングされていない別の投影ソースには通常のレイアウト同期が必要です。各 `scrollend` では通常の更新・確認応答の経路で1回の整合処理を行い、バインディングが一時的に拒否された後の再試行も含みます。

`NativeUIContext.sourceFrame` は最新のレイアウトサンプルであり、スクロールごとの通知ではありません。ネイティブ追従はスクロールオフセットの変化に対して SwiftUI のコンテンツを再構築しません。固定のタブアクセサリーはこのバインディングを使いません。Web Modal の変形は従来のハンドオフ経路を維持します。覆われて操作できないコンテンツには準備済み画像を使えますが、操作可能なスクロールコンテンツはネイティブのままです。

## 内容と配置は独立している

| `placement` | 動作 |
| ---------------------- | ------------------------------------------------------------------------------------- |
| 省略または `'element'` | iOS 26 以降・Android API 24 以降でソース要素の Web フレーム内にネイティブ内容を配置。 |
| `'tab-accessory'` | iOS 26.1 以降で、投影タブバーのシステム SwiftUI タブアクセサリーに View を付加。 |

拡張は `enableVerticalControlArea()` 使用時も `controls` と `ionic.auto` から独立しています。表示はアプリが制御し、Web に残す場合はリーダーから `null` を返し、条件変更時に `markForCheck()` を呼びます。アクセサリーには対応するネイティブタブホストが必要です。

### タブアクセサリーの要件

| 要件 | 対応する構成 |
| ------------------- | ------------------------------------------------------------------------------------------------- |
| ソース位置 | 所属する `ion-tabs` の内側。Shell がその `ion-tab-bar` を解決。 |
| ネイティブホスト | iOS 26.1 以降の Vertical Bars SwiftUI タブホスト。 |
| アクセサリー数 | ホストに 1 つ。 |
| Web フォールバックのレイアウト | 固定フッターなど同等の Web レイアウトを維持。ソースは隠れても領域を保つ。 |

通常の UIKit タブバー、ネイティブタブなし、iOS 26.0、競合するアクセサリーでは Web に残ります。アプリはネイティブコントローラー参照を渡さず、Shell も浮いたオーバーレイでシステムアクセサリーを近似しません。

## ソースの形状と表示状態を取得する

Shell はソース DOM を自動計測します。既定の `element` 配置ではその矩形に合わせて SwiftUI ホストの位置・サイズを決めるため、`props` に座標を送ったり手動でネイティブビューを配置したりする必要はありません。

情報を受け取るには引数 3 個の登録クロージャーを使います。

```swift
try NativeUI.register("app.counter") {
    (props: CounterProps, actions: NativeUIActions, context: NativeUIContext) in
    CounterView(props: props, actions: actions)
        .padding(.horizontal, context.sourceFrame.width < 240 ? 4 : 12)
}
```

従来の `(props, actions)` クロージャーも使用できます。どちらも同じ登録名と重複名チェックを使います。

| コンテキストのプロパティ | 意味 |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `sourceID` | 現在の寿命に対する不透明なソース識別子。HTML の `id` ではありません。 |
| `sourceFrame` | Web ビューポート基準の CSS ピクセルによる DOM の `getBoundingClientRect()`。`x`、`y`、`width`、`height` を含む。 |
| `sourceFrameInWebView` | ソース矩形を WebView のローカル座標の UIKit ポイントへ変換した値。画面座標ではありません。 |
| `viewportWidth` | スナップショットの座標変換に使う CSS ビューポート幅。 |
| `pointsPerCSSPixel` | CSS ピクセルあたりの UIKit ポイント。デバイスのピクセル密度ではありません。 |
| `placement` | `.element` または `.tabAccessory`。 |
| `colorScheme` | `.light` または `.dark`。SwiftUI 環境にも適用。 |
| `layoutDirection` | `.leftToRight` または `.rightToLeft`。SwiftUI 環境にも適用。 |

ソースの移動、サイズ、外観の変更を含む更新スナップショットを Shell が適用すると、クロージャーは新しいコンテキストを受け取ります。形状を `@State` にキャッシュせず、現在のコンテキストを使用してください。更新は Web/ネイティブブリッジを経由し、Swift からの同期 DOM 計測ではありません。

`tabAccessory` でも `sourceFrame` は元の DOM 要素を表します。アクセサリーの実際の位置・サイズはシステムが決定します。どちらの配置でも実際のローカル領域は View 内の SwiftUI の `GeometryReader` で取得します。

```swift
GeometryReader { geometry in
    CounterView(props: props, actions: actions)
        .frame(width: geometry.size.width, height: geometry.size.height)
}
```

`sourceFrame.x` や `y` を追加の SwiftUI オフセットに適用しないでください。`element` のホストは Shell がすでに配置しています。View はそのホスト内の内容を配置します。

## 共通の投影機能を使う

| 機能 | 拡張での利用方法 |
| ----------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 位置とサイズ | ホストの自動配置と `NativeUIContext`。実際のローカル範囲は `GeometryReader`。 |
| ダークモードと RTL | `context` または SwiftUI の `@Environment(\.colorScheme)` と `@Environment(\.layoutDirection)`。 |
| Reduce Motion（視差効果を減らす設定）とアクセシビリティー | `@Environment(\.accessibilityReduceMotion)` などの SwiftUI 環境値とネイティブのアクセシビリティー修飾子。独自コントロールにアクセス可能な名前を設定。 |
| DOM に基づくアプリ状態 | `read(element)` から JSON の `props` を返す。DOM 変更で同期し、DOM 変更がない場合は `shell.markForCheck()`。 |
| 有効・表示中の操作対象 | `actions.availableNames` または `actions.isAvailable("increment")`。利用不可の DOM 対象は省略。 |
| 元の Web 操作を実行 | `try await actions.activate("increment")`。完了・失敗は後述の契約に従う。 |
| 一時的な Web フォールバックと終了処理 | 非対応内容、オーバーレイ、ナビゲーション中断、ソース削除に対して自動管理。 |
| アプリによる中断 | JavaScript から Shell の `suspend()`、返されたトークンの `resume()`、`destroy()` を使用。 |

たとえば、元の操作が利用できない場合はネイティブボタンを無効にします。

```swift
Button("Increment") {
    Task { @MainActor in
        do { try await actions.activate("increment") }
        catch { /* Present an application-appropriate error. */ }
    }
}
.disabled(!actions.isAvailable("increment"))
```

利用可否はスナップショットで予約ではありません。実行前に対象が消える場合があるため、エラーも処理してください。独自のテキスト、選択状態、フォント、色、バッジは拡張の `props` と SwiftUI View に持たせます。Shell は CSS から独自コンポーネントの視覚構造を推測しません。リーダーで必要な要素の計算済みスタイルと属性を読みます。画像・色の変換には再実装せず後述の共通 API を使ってください。

## ソースの確認を予約する

DOM 属性、テキスト、子、監視対象の要素サイズ、スクロール、対応ライフサイクルイベントは自動確認を発生させます。Shell は JavaScript 変数や任意の DOM プロパティをポーリングしません。リーダーが使う状態を DOM 変更なしで更新した場合は確認を要求します。

```ts
source.playbackPosition = newPosition; // 拡張が読み取るアプリ定義のプロパティです。
shell.markForCheck();
```

`markForCheck(): void` は再読み取りと形状計測を予約し、アプリの DOM 更新やネイティブの強制再描画はしません。複数呼び出しはまとめ、変更のないスナップショットは送りません。ブリッジ更新中の呼び出しは終了後の確認を予約します。中断中の投影は再開まで中断を維持します。`destroy()` 後や投影ランタイムのない環境では何もしません。

フレームワークが関連する DOM 変更を反映した後に呼びます。Angular の変更検知、React・Vue の描画を起動せず、ネイティブ完了を待つ Promise でもありません。観測可能な変更なしで標準コントロールのプロパティが変わる場合にも使えます。

## ネイティブの画像と色変換を再利用する

リーダーの第 2 引数は標準の SVG 取得・ラスタライズ処理を公開します。ソースに属するローカル `svg` または解決済み `ion-icon` を受け、**不透明な画像参照**、非対応なら `null` を返します。参照を `props` で返し、同期的に画像バイトを読み取ろうとしないでください。

```ts
const badge = defineNativeUI({
  name: 'app.badge',
  selector: '[data-badge]',
  read(element, context) {
    return {
      props: {
        icon: context.image(element.querySelector<HTMLElement>('ion-icon')),
        color: getComputedStyle(element).color,
      },
    };
  },
});
```

送信前に Shell が参照を `{ data, width, height, template }`（base64 PNG、CSS 寸法、描画モード）へ解決します。入れ子の参照やコピーにも対応します。`$nativeUIImage` は現在の読み取りコンテキストが返す参照の予約キーです。SwiftUI でアイコンを着色する場合は `image()` の第 2 引数に `{ template: true }` を指定します。既定ではソースの色を維持します。標準コントロールと同じローカル SVG 制約、RTL 取得、表示倍率のラスタライズ、画像キャッシュを使います。外部リソースや非対応 SVG は `null` を返します。未解決の `ion-icon` は読み込み完了まで Web フォールバックを維持してください。ラスタライズ失敗や props のサイズ超過では拡張は Web に残ります。

iOS では結果を `NativeUIImage` でデコードし、共通コンバーターを使います。

```swift
struct BadgeProps: Decodable {
    let icon: NativeUIImage?
    let color: String
}

struct BadgeView: View {
    let props: BadgeProps
    var body: some View {
        if let icon = props.icon, let image = NativeUIRendering.image(icon) {
            Image(uiImage: image)
                .foregroundStyle(Color(uiColor: NativeUIRendering.color(props.color)))
        }
    }
}
```

`NativeUIRendering.image` は不正な画像データに `nil` を返します。`NativeUIRendering.color` は計算済み `rgb()` / `rgba()` を受け、非対応形式では `.label` または指定した `fallback:` 色を使います。どちらも標準ネイティブ描画と共有し、CSS セレクター、変数、色名、任意のスタイルシートは評価しません。

## ライフサイクルと操作の完了

Shell は検出、形状、状態同期、ネイティブコントローラーの包含、オーバーレイに応じた投影の解除、中断、終了処理を管理します。拡張に attach/detach フックは不要です。Web ソースはネイティブが受理してから隠します。未登録レンダラー、props デコード失敗、非対応配置、リーダー失敗ではそのインスタンスは Web に残ります。既存の Shell オーバーレイ方針が適用され、Web オーバーレイがページを覆う間、拡張は Web に戻ります。

element 配置ではソースがビューポートと祖先の overflow クリップ範囲（Ionic の shadow スクロールコンテナーを含む）内に完全に収まる必要があります。一部が切れるソースは Web に残り、全体が見える位置へスクロールすると再び対象になります。タブアクセサリーはシステムホストの配置を使います。

### 操作の完了

| イベント | `try await actions.activate(name)` の結果 |
| ------------------------------------------------------------------ | -------------------------------------------- |
| 元の Web 要素がクリックを受け取る | 完了。 |
| ハンドラーが通信、ナビゲーション、モーダル表示を開始 | そのアプリの処理は待たない。 |
| 操作が無効・削除済み・古い | 拒否。 |
| 終了処理、ネイティブタスクのキャンセル、ブリッジタイムアウト | 保留中の呼び出しを確定。 |

ブリッジの確認応答は Capacitor の Promise メソッドです。

[デモのリーダー](https://github.com/webview-native-ui/ionic-theme-ios27/blob/ios27-v2.1.0/demo/src/native-ui/counter.ts)と [SwiftUI View](https://github.com/webview-native-ui/ionic-theme-ios27/blob/ios27-v2.1.0/demo/ios/App/App/NativeUICounter.swift)はアプリ内のファイルで両配置を示します。Native UI デモページでネイティブ投影と Web フォールバックを比較できます。

## 例: ミニプレーヤー

デモのミニプレーヤーは曲のメタデータと再生操作で同じ方式を示します。[DOM リーダーと Web フォールバック](https://github.com/webview-native-ui/ionic-theme-ios27/blob/ios27-v2.1.0/demo/src/native-ui/mini-player.ts)と[アプリ内 SwiftUI View](https://github.com/webview-native-ui/ionic-theme-ios27/blob/ios27-v2.1.0/demo/ios/App/App/NativeMiniPlayer.swift)を組み合わせます。再生状態とモーダル表示は Web アプリが管理し、ネイティブの `open` と `toggle` は元のボタンを実行します。音声エンジンではなく UI の例です。[拡張ガイド](native-ui-extensions.md)の拡張設定を終えてからファイルを調整してください。
