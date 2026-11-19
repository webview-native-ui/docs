---
title: "開発とリリース"
sourceRevision: "5a3174b50ea047c18e35195e9d624a4c6dcd96189d08997b0fde00c9401eef63"
---

# 開発とリリース

Engine自体を変更・公開するときに使うガイドです。ネイティブの利用側はNode.jsなしでビルドする場合があるため、ソースを変更したら同梱ランタイムを再生成する必要があります。Maven成果物がダウンロード可能になる前にnpmへリリースが届く場合があるため、以下では公開の受理と利用側のダウンロード準備完了を別々に確認します。

## 開発

公開エントリーポイントは`src/index.ts`と`src/ionic.ts`で、共通の契約は`src/types.ts`にあります。実装は責務ごとに分かれています。

- `src/native/`：ブリッジ転送、ネイティブセッション、起動、リソースURL。
- `src/projection/`：画像のハンドオフ、投影の所有権、イベント、スタイル。
- `src/dom/`：ジオメトリ、スクロール、可視性、オーバーレイの調整。

`npm run build`は、`src/native/bootstrap.ts`を共通WebViewランタイムの`runtime/native-ui-engine.js`へバンドルします。Androidはこのファイルを直接アセットとして含めます。SwiftPMはターゲットディレクトリ内のリソースを必要とするため、ビルドでは`ios/Sources/WebViewNativeUIEngine/Resources`にもコピーします。両方の生成物は開発中は追跡対象から除外し、SwiftPM利用側にNode.jsを要求しないようリリースタグに含めます。ソースのチェックアウトをXcodeでビルドする前に、`npm run build`を実行してください。生成ファイルではなくTypeScriptソースを編集してください。CIは再生成を確認し、npmとMavenのアーカイブに含まれるランタイムを検証します。

テストは保護する責務に応じて配置します。

- `tests/native`、`tests/projection`、`tests/dom`のブラウザーテストは、ブリッジ、ジオメトリ、画像のライフサイクルの契約を扱います。`tests/cordova/`は実際の利用側を検証します。
- `tests/controls`はIonicの検出、ソースとプロキシの選択、ページとモーダルの分離、アダプターのイベント転送を扱います。一般的なEngineのタイミングや画像状態のテストは、Controls経由で重複させず、担当する層に置きます。
- SwiftとAndroidのテストは、ネイティブ取得、SDK本来の入力、クリッピング、破棄を扱います。ブラウザーのモックでは、ネイティブの描画やタップ・長押しの配信は証明できません。

回帰テストは利用者に見える契約違反で失敗すべきです。内部状態、厳密なコールバック回数、voidメソッドの戻り値より、出力、リソース所有権、入力の配信を重視します。1回の登録や配信が契約なら回数の検証も有効です。名前付きのフィクスチャ設定を使い、同じ境界を守れるならセットアップを増やさず既存ケースを拡張します。長いブラウザータイマーの境界は制御した時計でテストし、実際のSDK入力認識はネイティブテストに残します。

CIと同じNode.js 24を使います。このリポジトリで次を実行します。

```sh
npm ci
npm run build
npm run lint
npx playwright install chromium
npm test
```

lintは、厳密なTypeScriptチェック、標準のESLint/TypeScript推奨ルール、`src`に対する型情報を使ったPromiseチェックを組み合わせます。スクリプトとテストには構文レベルのlintを適用し、整形はPrettierが担当します。`npm run format`は整形のみを行います。ブリッジのペイロードとテストダブルには明示的な`any`を使えますが、本番の境界検証は必要です。明示的な`void`はバックグラウンド処理を示しますが、Promiseの拒否を処理するものではありません。

ネイティブのチェックは各プラットフォームのCIジョブで実行します。`npm run lint:swift`はmacOS上で、Capacitor設定のnode-swiftlintを使います（`brew install swiftlint`）。`npm run lint:android`はKotlinの整形チェックと、警告をエラー扱いするAndroid Lintを実行します（JDK 21とAndroid SDK 36）。ネイティブの整形には`npm run format:swift`と`npm run format:kotlin`を使います。既存のネイティブテストフィクスチャをPrettier Kotlinプラグインが解析できないため、Kotlinにはktfmtを使います。

Swift CIは独立した処理を`swift-package`、`ios-integration`、`ios-consumers`に分け、既存の`swift`チェックは3つすべての成功を要求します。Packageテストは決定論的なネイティブビュー、キャプチャ所有権、エンコードの契約を扱います。実際のWKWebViewの遷移・スクロール追従、アクティブなUIKit表示、実画面の画像パイプラインはUIApplicationを持つ`NativeUIHostedTests`で実行します。CocoaPodとCordovaの利用側検証は`ios-consumers`の並列マトリクスで行い、`swift`は両方を必須とします。両ネイティブテスト群はアプリ内でのみ動くケースも含め、それぞれに割り当てられたスイートを実行します。シミュレーター起動はNode.js設定とランタイム生成の後に開始し、依存関係の準備と競合させません。各ジョブは選択したデバイス上で直列にテストします。Package・Hostedスイートのシミュレーター準備は2分、各スイートの実行は5分、パッケージジョブは12分、ホスト統合・利用側ジョブは20分が上限です。後者は Xcode の初回ビルドとシミュレーターへのインストールを含み、従来の12分では検証前に打ち切られることがありました。失敗時の`.xcresult`を保持します。[Appleの説明](https://developer.apple.com/forums/thread/698054)に従い、`-collect-test-diagnostics never`で失敗後の遅いシステム診断を避けます。テスト失敗、アサーション、フィクスチャの状態は結果に残ります。自動リトライで失敗を隠しません。

Packageテストの正確な除外設定は`.github/workflows/native-ui-engine.yml`、Hostedテストの選択は[XcodeGenのテスト選択](https://github.com/yonaskolb/XcodeGen/blob/master/Docs/ProjectSpec.md#test-target)を使う`ios/Tests/project.yml`にあります。実行環境間でテストを移す場合、実行集合が重複せず、和集合が全スイートを維持することを確認します。Hostedの選択をローカル実行するには次を使います。

```sh
xcodegen generate --spec ios/Tests/project.yml
xcodebuild -project ios/Tests/NativeUIControlsHostedTests.xcodeproj -scheme NativeUIHostedTests -destination 'platform=iOS Simulator,id=<booted simulator UUID>' -parallel-testing-enabled NO test
```

これらのチェックには、ネイティブテストとCordovaフィクスチャを含みます。SwiftのAPI文書には`///`、実装上の注記には`//`を使います。Swiftのサイズ・複雑度に関するヒューリスティックは、状態機械の分割や公開APIの変更を強制しません。フィクスチャ内だけのforce unwrap/castは許可し、本番コードではチェックを維持します。SwiftはiOSシミュレーターでもコンパイル・テストします。

Engineのバージョンは利用側と独立しています。公開の順序は、Maven公開の受理→npm Engineです。利用側は個別に更新します。npmリリースには、タグが指す正確なコミットでMaven公開ワークフローが成功している必要があります。Maven Centralの配信はまだ保留中の場合があります。Android利用側は対応するPOMとAARをダウンロードできるまで待つ必要がありますが、iOSとWeb利用側はすぐ更新できます。ビルドやテストのコマンドで公開は行われません。テストは通常のDOM、小数・RTLジオメトリ、古いACK、画像の所有権、ネイティブWKWebViewのスクロール追従を扱います。IonicやSDKとの結合テストは利用側の責務です。

CI専用のセットアップ、パッケージングコマンド、GitHubの出力は`.github/workflows/`で定義します。スクリプトには、ランタイムのビルド、再利用可能な利用側・パッケージ検証、テスト済みの公開処理（Centralの状態処理とnpm成果物の比較）を残します。

## Mavenへの公開

`Native UI Engine Maven Release`ワークフローは、正確なEngineパッケージバージョンを指定してリリースタグで手動実行します。タグが指すコミットは、先に`Native UI Engine`のCIを通過しなければなりません。AAR、ソースアーカイブ、生成したKotlin API文書、Mavenメタデータに署名して一度だけアップロードし、Centralが`PUBLISHING`または`PUBLISHED`を返すと完了します。デプロイIDと状態の変化は実行サマリーに記録します。`PUBLISHING`は検証を通過してCentralが公開を受理したことを表し、成果物をすでにダウンロードできるとは保証しません。このワークフローは配信を待ちません。npmリリースは正確なリリースコミットに対してこのワークフローの成功を確認しますが、Maven Centralの配信は待ちません。既存の座標は上書きしません。アップロードがタイムアウトしたら、次の操作の前にCentralに記録されたデプロイを確認してください。

リポジトリのActions secretsに、`CENTRAL_USERNAME`、`CENTRAL_PASSWORD`（Centralのユーザートークン）、`MAVEN_SIGNING_KEY`（ASCII-armored形式の秘密鍵）、`MAVEN_SIGNING_PASSWORD`を設定します。署名の公開鍵はCentralが取得できる必要があります。GitHubのsecretsはこのリポジトリにスコープされます。

ローカルでパッケージングを検証するには、JDK 21、Android SDK 36、GnuPGを用意し、`python3 scripts/native-ui-engine-release/verify.py`を実行します。使い捨ての鍵を作成し、署名とチェックサムを検証して、アップロードせずにテストZIPを削除します。公開時は常に、本物の署名鍵を使い、クリーンな出力から再ビルドします。プレリリースも含め、対応するnpmリリースより先にMaven成果物を公開してください。

## メンテナーのリリース設定

npm、SwiftPM、Mavenには同じバージョンを公開します。利用側は各配布方式で対応するバージョンを固定します。

npm組織の`webview-native-ui`とMaven Central名前空間の`io.github.webview-native-ui`は登録済みです。`webview-native-ui/engine`、ワークフロー`release.yml`向けのnpm trusted publishingを維持し、このリポジトリへ上記のMaven secretsを設定します。ソースファイルを移動しても、認証情報はコピーされません。

1. `main`で**Prepare release**（`prepare-release.yml`）を実行し、`major`、`minor`、`patch`、`revision`のいずれかを選びます。ローカルでのビルド、コミット、タグ作成は不要です。
2. ワークフローはnpmでバージョンを上げ、パッケージをビルド・検証して、バージョンだけを更新したmainのコミットと、生成リソースを含む別のリリースコミット・タグをpushします。そのタグに対して`Native UI Engine`の検証を明示的に開始し、自動生成したリリースノートを含むGitHub Releaseのドラフトを作成します。
3. リリースノートを確認・編集します。タグの検証が通過したら、正確なパッケージバージョンを指定して、そのタグで`native-ui-engine-release.yml`を実行します。
4. Maven公開の成功後に、GitHub Releaseのドラフトを公開します。Centralの`PUBLISHING`はアップロードの受理であり、ダウンロード準備完了ではありません。Android向けの配信が保留中なら、ノートに記載してください。`release.yml`はnpm公開前に、タグ、パッケージバージョン、タグのCI、Mavenの受理を検証します（revisionは`next`、安定版は`latest`）。

バージョンの増分はnpmのSemVerルールに従います。`revision`は`prerelease`に対応します。

| 現在 | 選択 | 次のバージョン |
| --- | --- | --- |
| `1.2.3` | major | `2.0.0` |
| `1.2.3` | minor | `1.3.0` |
| `1.2.3` | patch | `1.2.4` |
| `1.2.3` | revision | `1.2.4-0` |
| `1.2.4-0` | revision | `1.2.4-1` |
| `1.2.4-2` | patch | `1.2.4` |
| `1.3.0-2` | minor | `1.3.0` |
| `2.0.0-2` | major | `2.0.0` |

生成ランタイムのコミットがmainの履歴に入ることはありません。CIの準備処理は、forceを使わずに、mainとリリースタグをアトミックにpushします。公開で受け入れるのは、mainの子コミットにタグが付いており、2つの生成リソースだけを追加して他のファイルを変更していない場合のみです。npmは公開前にランタイムを再ビルドして確認し、Mavenは同じ検証済みタグのランタイムをパッケージに含めます。

push前に準備が失敗した場合は再実行します。mainとタグがすでにpushされている場合、準備を再実行したり（別のバージョンを要求することになります）、タグを移動したりしないでください。検証が開始されていなければ、既存のタグで`Native UI Engine`を手動実行し、リリースドラフトがなければ、そのタグのドラフトを作成します。これにより、push、検証の開始、ドラフト作成の間で発生した失敗からも復旧できます。既存のタグと公開済み成果物は上書きしません。

ビルドやテストのコマンドがパッケージを公開することはありません。既存のnpm/Mavenバージョンは上書きしません。

既存タグのリリース検証を再実行するには、ワークフローのrefと`tag`入力の両方に、そのタグを指定します：`gh workflow run release.yml --ref vX.Y.Z -f tag=vX.Y.Z`。これにより、リリース専用コミット構成の導入前に作られた古いタグも含め、そのリリースに保存されたワークフローを使います。元のタグ付きコミットを確認し、既存パッケージの内容が一致する場合だけnpm公開を省略します。タグは変更しないでください。リリースツールはCIと同じ、Node.js 24同梱のnpmを使います。

[ドキュメント概要](README.md)

## ネイティブPNG成果物

チェックイン済みのネイティブ成果物により、利用側はRustやNDKなしでビルドできます。Rustコーデック、Cヘッダー、JNIシムを変更した場合は、同じ変更内ですべてのバイナリを再生成します。

Rust 1.99.1（CIの固定ツールチェーン）、macOSのXcode、Android NDK 29を使います。Rustの`aarch64-apple-ios`、`aarch64-apple-ios-sim`、`x86_64-apple-ios`、`aarch64-linux-android`、`armv7-linux-androideabi`、`i686-linux-android`、`x86_64-linux-android`ターゲットをインストールし、次を実行します。

```sh
cargo test --locked --manifest-path native/png/Cargo.toml
cargo clippy --locked --manifest-path native/png/Cargo.toml --all-targets -- -D warnings
python3 scripts/build-native-png.py --ndk "$ANDROID_NDK_HOME"
python3 scripts/verify-native-png.py
npm run build
npm run test:package
```

`native/png`、`native/include`、`native/android`、`native/artifacts`、`native/licenses`、共有のiOSライセンスリソースをまとめてコミットします。XCFrameworkにはarm64実機とarm64/x86_64シミュレーターを含めます。Android成果物はarm64-v8a、armeabi-v7a、x86、x86_64に対応し、ELFの16 KiBアラインメントとJNIクラス・メソッド名を保持するconsumer rulesを含みます。Rust依存関係と標準ライブラリの通知は`ios/Sources/WebViewNativeUIEngine/Resources/NativeUIPngLicenses`だけで管理し、SwiftPMとCocoaPodsが直接同梱します。Androidは同じディレクトリを生成リソースとソースアーカイブへコピーします。`native/licenses`にはAndroid NDKの通知だけを置き、共有通知のコピーを重複コミットしません。ソース・バイナリのハッシュマニフェストは、パッケージ作成前に古い組み合わせを拒否します。ローカルでは`--platform ios`または`android`で反復できますが、リリース前には全ビルドと`all-build.json`の検証を完了してください。

他のデバイスも接続している場合、Androidの接続テストでは対象エミュレーターを明示します。

```sh
ANDROID_SERIAL=emulator-5554 android/gradlew -p android :connectedDebugAndroidTest
```

画像再利用の結合テストは、指定したiOSシミュレーターで移動、コンテンツの無効化、ハンドオフ、ファイルの解放を検証します。

```sh
python3 scripts/verify-image-reuse.py --device <booted-simulator-UUID>
```
