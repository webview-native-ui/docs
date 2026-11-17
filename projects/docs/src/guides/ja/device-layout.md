---
title: '端末に合わせる'
sourceRevision: '4dddeb29f25d7325ac010931f49b4755159d61204419f0f9812e020641d01b97'
---

# 端末に合わせる

端末が通知するサイドレールの領域を空け、レールがなくなると通常の配置へ戻ることを確認します。まずWebの余白を確認し、その後に端末の通知とネイティブ表示を確認します。

[既存テーマにNative UIを追加する場合](/projects/capacitor-native-ui/docs/ionic-vertical-bars)、[Ionicを使わないHTML](/projects/capacitor-native-ui/docs/framework-independent)、[Cordova](/projects/cordova-native-ui/docs/readme)はそれぞれの手順を使います。アプリを変更する前に[導入方法を選べます](/#choose-setup)。

## 1. 既存のレイアウト購読を確認する

[アプリへの導入](/standard-setup)には、レール用CSSと端末レイアウトの購読がすでに含まれています。ion-appの描画後に、アプリシェルで一度だけ動く場所を確認してください。ルートごとのページへ追加し直しません。Foldableはバージョン8の8.5以降を使います。画面が広いだけではネイティブレールは有効になりません。

## 2. 端末の通知値を確認して適用する

既存の更新処理を次の形に置き換えると、通知値を確認できます。購読は一つに保ちます。resolverがedge・inset・toolbarTopを返し、テーマが論理方向を処理します。edgeがnullなら余白も戻ります。端末名や固定幅、画面幅による判定で値を上書きしません。

```ts
import { Foldable } from '@erkamyaman/capacitor-foldable';
import { resolveVerticalBarsLayout } from '@rdlabo/capacitor-native-ui/integration';
import { setVerticalBarsLayout } from '@rdlabo/ionic-theme-ios27';

const updateLayout = async () => {
  const layout = await resolveVerticalBarsLayout(Foldable);
  setVerticalBarsLayout(layout);
  console.info('Device layout', layout);
};

void Foldable.addListener('layoutChange', () => void updateLayout().catch(console.error))
  .then(updateLayout)
  .catch(console.error);
```

## 3. ブラウザーでWebの余白を試す

ブラウザーだけで一時的に確認する場合は、iOSプリセットを選び、ion-appの描画後に次を実行します。ツールバーと本文がtrailing側に領域を空けることを確認してください。変わるのはWebの配置だけで、ネイティブ対応の再現ではありません。端末用の購読へこの固定値を混ぜないでください。

```ts
import { setVerticalBarsLayout } from '@rdlabo/ionic-theme-ios27';

setVerticalBarsLayout({ edge: 'trailing', inset: 80 });
```

## 4. 通常配置へ戻して対応端末で確認する

次の呼び出しでブラウザーの確認用レイアウトを戻し、一時コードを取り除きます。アプリをビルド・同期し、対応端末でレールの出現・消失、回転、折りたたみを確認します。タブやツールバーの操作が既存のWebの処理を呼ぶことも確認してください。通常のスマートフォン、ブラウザー、非対応端末では普通の配置で操作できれば完了です。ネイティブレールの確認には、iOS 27.1以降でリンクしたiPhone Duoなど、対応する端末とOSが必要です。

```ts
setVerticalBarsLayout({ edge: null });
```

通知値と対応条件の詳細は[レールのリファレンス](/projects/capacitor-native-ui/docs/vertical-bars)にあります。
