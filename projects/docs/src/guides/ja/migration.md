---
title: '推奨構成に移行する'
sourceRevision: '0b3b1fd5d4b6c09c3e577c41aeb23c69815275559949b73d7d9a600a914aa5c8'
headingAliases:
  '4.-%E5%A4%96%E8%A6%B3%E3%81%AE%E6%96%B9%E9%87%9D%E3%82%92%E4%BF%9D%E3%81%A3%E3%81%A6%E8%AA%AD%E3%81%BF%E8%BE%BC%E3%81%BF%E3%82%92%E6%95%B4%E7%90%86%E3%81%99%E3%82%8B': '3.-%E9%85%8D%E8%89%B2%E3%82%92%E4%BF%9D%E3%81%A3%E3%81%A6%E3%82%B9%E3%82%BF%E3%82%A4%E3%83%AB%E3%82%92%E6%95%B4%E7%90%86%E3%81%99%E3%82%8B'
---

# 推奨構成に移行する

これまでは、アプリ側でテーマやプラグインをパッケージごとに設定する必要がありました。このガイドでは、使っている機能に合わせて、個別に追加したスタイルの読み込みや初期化処理を現在の推奨構成に置き換えます。

## 1. 使用中のパッケージを確認する

Ionic 9・Capacitor 8 のアプリで、手順2の更新対象となるテーマとプラグインを確認します。Cordova アプリは [Cordova プラグインのガイド](/projects/cordova-native-ui/docs/readme)を参照してください。

```sh
npm ls @rdlabo/ionic-theme-ios26 @rdlabo/ionic-theme-ios27 @rdlabo/ionic-theme-md3 @rdlabo/capacitor-native-ui @erkamyaman/capacitor-foldable
```

## 2. 利用するパッケージを更新する

次のコマンドには、手順1で見つかったパッケージだけを含めてください。Foldableは8.xを使い、更新したlockfileも保存します。

```sh
npm install @rdlabo/ionic-theme-ios26@latest @rdlabo/ionic-theme-ios27@latest   @rdlabo/ionic-theme-md3@latest @rdlabo/capacitor-native-ui@latest   @erkamyaman/capacitor-foldable@8
```

旧iOS 27テーマに内蔵されたNative UIを使っている場合は、[パッケージの移行ガイド](/projects/ionic-theme-ios27/docs/migration#native-ui-package-separation)に従ってください。

## 3. 配色を保ってスタイルを整理する

以下は、iOS 27のクラス型ダークパレットを一つのプリセットへまとめる例です。

OSの明暗に追従する場合はsystem.css、常時ダークならalways.cssを使います。iOS 26／27とMD3を組み合わせたアプリは、設定済みのimportを維持します。

更新時は現在の明暗の切り替え方式を維持します。OS追従からアプリ内での切り替えへ変更する場合は、[外観設定](/guides/appearance)の手順を使います。

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

## 4. 既存のレイアウト更新を置き換える

src/native-ui.ts で Foldable.getBarPlacement() を検索してください。呼び出しがなければ手順5へ進みます。

呼び出しがある場合は、バーの位置と余白を計算する部分を resolveVerticalBarsLayout(Foldable) に置き換えます。端末から取得した配置を setVerticalBarsLayout に渡すと、ツールバー上端の位置も反映されます。

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

## 5. 再ビルドして動作を確認する

Webをビルドし、使用中のテーマ、明暗の切り替え、画面遷移を確認します。

ブラウザー向け・テーマのみのアプリは、Web上での確認で完了です。

ネイティブアプリは、対象OSへ同期して再ビルド・起動します。導入済みのネイティブコントロール、端末配色、レイアウト連携と、元のWeb操作が動くことを確認してください。非対応端末ではWeb表示や既定の配色への切り替わりを確認します。

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
