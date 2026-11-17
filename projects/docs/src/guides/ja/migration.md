---
title: '既存アプリを移行する'
sourceRevision: 'f6c682196640ada89288d21f58919e99a41517204ad8bf7aea096a8f052c71f2'
---

# 既存アプリを移行する

以前の導入設定を使っているアプリを、ルート・状態・イベント処理を保ちながら更新する手順です。新規導入の次のステップではありません。使用中の機能を確認し、該当する変更だけを適用して元の動作を確認します。

## 1. 使用中のパッケージを確認する

以前の導入設定がある状態から始めます。このコマンドはパッケージを読むだけです。結果を保存し、以下で該当する変更を選びます。見つからないパッケージは未導入機能を示し、追加インストールを要求するものではありません。

アプリのディレクトリで実行し、使用中の版を確認します。見つからないパッケージはその機能を使っていないことを示します。テーマだけの移行のためにNative UIを足す必要はありません。この手順はIonic 9とCapacitor 8を対象にします。Cordovaでは、ここで示すCapacitorのコマンドではなく専用プラグインの移行手順を使います。

```sh
npm ls @ionic/core @capacitor/core @rdlabo/ionic-theme-ios26 @rdlabo/ionic-theme-ios27 @rdlabo/ionic-theme-md3 @rdlabo/capacitor-native-ui
```

## 2. 利用するパッケージを更新する

確認した一覧から、使用中のパッケージだけを更新します。一括のコマンドはその組み合わせを使っているアプリ用です。依存関係とlockfileが更新されれば、この手順は完了です。既存ソースの接続はまだ変わっていません。

IonicとCapacitorを組み合わせたアプリでは、次のパッケージをまとめて更新し、Foldableはメジャー版8に保ちます。テーマだけのアプリでは、使用中のテーマだけを更新してください。npmが更新したlockfileも残します。別構成のコマンドまで全部実行する必要はありません。

```sh
npm install @rdlabo/ionic-theme-ios26@latest @rdlabo/ionic-theme-ios27@latest   @rdlabo/ionic-theme-md3@latest @rdlabo/capacitor-native-ui@latest   @erkamyaman/capacitor-foldable@8
```

## 3. 古いNative UIのimportと起動を置き換える

古いimportと呼び出しがある場合だけ、既存の起動モジュールへこの差分を適用します。なければスキップします。同じ起動呼び出しがプラグインの入口を使う状態になり、ランタイムは追加しません。

以前のテーマ内蔵Native UIを使っていたアプリだけが対象です。プロジェクト内で古いnative入口とenableNativeUIShellを検索し、アプリシェルの既存の呼び出しを置き換えます。起動は一度だけに保ち、画面のイベント処理はそのまま使います。古い名前がなければ次の手順へ進んでください。

<!-- prettier-ignore -->
```diff:src/native-ui.ts
@@
- import { enableNativeUIShell } from '@rdlabo/ionic-theme-ios27/native';
+ import { enableNativeUI } from '@rdlabo/capacitor-native-ui';
 import { Foldable } from '@erkamyaman/capacitor-foldable';
 import { setVerticalBarsLayout } from '@rdlabo/ionic-theme-ios27';

 export async function startLegacyUI(): Promise<void> {
-   await enableNativeUIShell();
+   await enableNativeUI();
   const updateLayout = async () => {
     const placement = await Foldable.getBarPlacement();
     setVerticalBarsLayout({ edge: placement.edge, inset: placement.inset });
```

## 4. 外観の方針を保って読み込みを整理する

古いclassパレットの組み合わせが一致する場合だけ、このスタイル差分を適用します。system・alwaysの方針なら、その方針を維持します。選択済みの外観方針を変えずに、import構成だけをまとめた状態で完了です。

iOS 27のクラス型ダークパレットを使うアプリでは、対応する次の読み込みを一つのプリセットへ置き換えられます。システム追従のテーマ単体アプリはsystem.css、常時ダークならalways.cssを選ぶ方針を維持します。iOS 26/27とMD3を組み合わせた構成では、[導入手順](/standard-setup)の4 importと共通iOSプリセットを使い、このiOS 27単体の読み込みを追加しないでください。

組み合わせた導入手順の既定は、両iOSテーマのsystem importでOSのライト・ダークへ追従する方針です。テーマの更新だけなら、その読み込みを維持します。[外観設定の使い方](/guides/appearance)でアプリから明暗の上書きを追加する場合だけ、classへ切り替えます。この方針変更は端末配色の選択とは別です。下の旧classパレットの差分は、すでに手動管理している方針をそのまま維持します。

<!-- prettier-ignore -->
```diff:src/global.css
@@
 @import '@ionic/core/css/core.css';
- @import '@ionic/core/css/palettes/dark.class.css';
- @import '@rdlabo/ionic-theme-ios27/dist/css/default-variables.css';
- @import '@rdlabo/ionic-theme-ios27/dist/css/ionic-theme-ios27.css';
- @import '@rdlabo/ionic-theme-ios27/dist/css/ionic-theme-ios27-dark-class.css';
- @import '@rdlabo/ionic-theme-ios27/dist/css/md-remove-ios-class-effect.css';
+ @import '@rdlabo/ionic-theme-ios27/styles/class.css';
```

## 5. 既存のレイアウト更新を置き換える

古い端末レイアウト処理がある場合だけ、importとresolverへの変換部分を差分で変更します。表示されたリスナーは既存の文脈です。未導入ならスキップします。一つの既存購読からresolverの戻り値を反映できれば、この手順は完了です。

getBarPlacementからedgeとinsetへ直接変換している場合は、既存のlayoutChange処理の中で次のresolverへ置き換えます。toolbarTopも反映できます。購読を増やしたり、OS世代でプリセットを切り替えたり、共通iOSプリセットのアニメーションを手動でラップしたりする必要はありません。通常のNative UI起動はアプリシェルに維持します。

端末レイアウト連携を使っていない場合、この手順は飛ばします。

<!-- prettier-ignore -->
```diff:src/native-ui.ts
@@
 import { enableNativeUI } from '@rdlabo/capacitor-native-ui';
 import { Foldable } from '@erkamyaman/capacitor-foldable';
+ import { resolveVerticalBarsLayout } from '@rdlabo/capacitor-native-ui/integration';
 import { setVerticalBarsLayout } from '@rdlabo/ionic-theme-ios27';

 export async function startLegacyUI(): Promise<void> {
   await enableNativeUI();
   const updateLayout = async () => {
-     const placement = await Foldable.getBarPlacement();
-     setVerticalBarsLayout({ edge: placement.edge, inset: placement.inset });
+     setVerticalBarsLayout(await resolveVerticalBarsLayout(Foldable));
   };
   void Foldable.addListener('layoutChange', () => void updateLayout().catch(console.error))
     .then(updateLayout)
```

## 6. 再ビルドして動作を確認する

該当するソース変更が済んだら、アプリのディレクトリでビルドし、既存のネイティブ機能がある対象のコマンドだけを実行します。ブラウザー・テーマのみのアプリはWebの確認で完了です。ネイティブアプリは再ビルド・同期・再起動後に使用中の機能が動けば完了し、レールや拡張を新たな必須条件にはしません。

ブラウザー・テーマのみのアプリは、Webビルドと、選んだテーマの表示・ライト／ダークの方針・画面遷移を確認すれば完了です。Native UIやレイアウト機能を使っていない場合は、その手順を飛ばします。ネイティブプロジェクトやレール端末は不要です。

ネイティブ機能がある場合は、Webビルド後に既存の対象のコマンドだけ実行します。実際に使うネイティブ機能、元のWebイベント処理、キャンセルを含む画面遷移を確認してください。端末配色やレールは導入済みかつ対応端末でのみ確認し、それ以外は利用可能な端末でフォールバックを確認します。独自拡張の追加は不要です。

```sh
npm run build
```

### iOS

```sh
npx cap sync ios
npx cap open ios
```

### Android

```sh
npx cap sync android
npx cap open android
```

[既存テーマにNative UIを追加する場合](/projects/capacitor-native-ui/docs/ionic-vertical-bars)、[Ionicを使わないHTML](/projects/capacitor-native-ui/docs/framework-independent)、[Cordova](/projects/cordova-native-ui/docs/readme)はそれぞれの手順を使います。アプリを変更する前に[導入方法を選べます](/#choose-setup)。
