---
title: '既存アプリを移行する'
sourceRevision: 'e3002de686a3989a3cd3e9ffcd213d9d5c8bcacb0cf2a27956e4448d61a833ae'
---

# 既存アプリを移行する

ルート・アプリの状態・イベント処理を作り直さず、既存の導入部分を更新します。使用中のパッケージを確認し、必要な更新と古い接続の置き換えを行ってから、再ビルド後に同じ画面を確認します。

## 1. 使用中のパッケージを確認する

アプリのディレクトリで実行し、使用中の版を確認します。見つからないパッケージはその機能を使っていないことを示します。テーマだけの移行のためにNative UIを足す必要はありません。この手順はIonic 9とCapacitor 8を対象にします。Cordovaでは、ここで示すCapacitorのコマンドではなく専用プラグインの移行手順を使います。

```sh
npm ls @ionic/core @capacitor/core @rdlabo/ionic-theme-ios26 @rdlabo/ionic-theme-ios27 @rdlabo/ionic-theme-md3 @rdlabo/capacitor-native-ui
```

## 2. 利用するパッケージを更新する

IonicとCapacitorを組み合わせたアプリでは、次のパッケージをまとめて更新し、Foldableはメジャー版8に保ちます。テーマだけのアプリでは、使用中のテーマだけを更新してください。npmが更新したlockfileも残します。別構成のコマンドまで全部実行する必要はありません。

```sh
npm install @rdlabo/ionic-theme-ios26@latest @rdlabo/ionic-theme-ios27@latest   @rdlabo/ionic-theme-md3@latest @rdlabo/capacitor-native-ui@latest   @erkamyaman/capacitor-foldable@8
```

## 3. 古いNative UIのimportと起動を置き換える

以前のテーマ内蔵Native UIを使っていたアプリだけが対象です。プロジェクト内で古いnative入口とenableNativeUIShellを検索し、アプリシェルの既存の呼び出しを置き換えます。起動は一度だけに保ち、画面のイベント処理はそのまま使います。古い名前がなければ次の手順へ進んでください。

```diff
- import { enableNativeUIShell } from '@rdlabo/ionic-theme-ios27/native';
+ import { enableNativeUI } from '@rdlabo/capacitor-native-ui';

- await enableNativeUIShell();
+ await enableNativeUI();
```

## 4. 外観の方針を保って読み込みを整理する

iOS 27のクラス型ダークパレットを使うアプリでは、対応する次の読み込みを一つのプリセットへ置き換えられます。システム追従のテーマ単体アプリはsystem.css、常時ダークならalways.cssを選ぶ方針を維持します。iOS 26/27とMD3を組み合わせた構成では、[導入手順](/standard-setup)の4 importと共通iOSプリセットを使い、このiOS 27単体の読み込みを追加しないでください。

```diff
- @import '@ionic/core/css/palettes/dark.class.css';
- @import '@rdlabo/ionic-theme-ios27/dist/css/default-variables.css';
- @import '@rdlabo/ionic-theme-ios27/dist/css/ionic-theme-ios27.css';
- @import '@rdlabo/ionic-theme-ios27/dist/css/ionic-theme-ios27-dark-class.css';
- @import '@rdlabo/ionic-theme-ios27/dist/css/md-remove-ios-class-effect.css';
+ @import '@rdlabo/ionic-theme-ios27/styles/class.css';
```

## 5. 既存のレイアウト更新を置き換える

getBarPlacementからedgeとinsetへ直接変換している場合は、既存のlayoutChange処理の中で次のresolverへ置き換えます。toolbarTopも反映できます。購読を増やしたり、OS世代でプリセットを切り替えたり、共通iOSプリセットのアニメーションを手動でラップしたりする必要はありません。通常のNative UI起動はアプリシェルに維持します。

端末レイアウト連携を使っていない場合、この手順は飛ばします。

```ts
import { Foldable } from '@erkamyaman/capacitor-foldable';
import { resolveVerticalBarsLayout } from '@rdlabo/capacitor-native-ui/integration';
import { setVerticalBarsLayout } from '@rdlabo/ionic-theme-ios27';

const updateLayout = async () => {
  setVerticalBarsLayout(await resolveVerticalBarsLayout(Foldable));
};

void Foldable.addListener('layoutChange', () => void updateLayout().catch(console.error))
  .then(updateLayout)
  .catch(console.error);
```

## 6. 再ビルドして動作を確認する

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
