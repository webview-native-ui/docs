---
title: 'Native UIを使う'
sourceRevision: 'a6e3664ef5e0672c1da7a2b3b29b882dcc5e91140923f9a59713abf673655f7d'
---

# Native UIを使う

ツールバーの操作をiOSでネイティブ表示し、既存のWeb側の処理で画面を更新します。同じ画面はAndroidとブラウザーでもWebコントロールとして使えます。

[既存テーマにNative UIを追加する場合](/projects/capacitor-native-ui/docs/ionic-vertical-bars)、[Ionicを使わないHTML](/projects/capacitor-native-ui/docs/framework-independent)、[Cordova](/projects/cordova-native-ui/docs/readme)はそれぞれの手順を使います。アプリを変更する前に[導入方法を選べます](/#choose-setup)。

## 1. アプリ単位の起動を確認する

[アプリへの導入](/standard-setup)が済んだアプリを、Xcode 26以降でiOS 26以降の端末またはシミュレーターへ実行します。この手順はIonicのコントロール向けです。他の開始構成は上のリンクから選べます。src/native-ui.tsのiOS分岐にある既存のenableNativeUI呼び出しを次へ置き換えます。公開する関数は画面描画後に同じシェルの状態を確認するためのもので、別のランタイムは起動しません。

```ts
const shell = await enableNativeUI();
readNativeUIStatus = () => shell.getStatus();
```

同じファイルのモジュール直下（connectNativeUIの外）へ次も追加します。

```ts
let readNativeUIStatus: (() => unknown) | undefined;

export async function inspectNativeUI(): Promise<void> {
  await startNativeUI();
  console.info(readNativeUIStatus?.());
}
```

## 2. 画面にツールバーの操作を置く

使っているフレームワークのコンポーネントを示したパスへ置くか、import・テンプレート・状態を既存のルート配下のページへ組み込みます。現在のルートとアプリシェルを維持してください。ReactとVueではIonPageをページのルートに使います。Saveはフレームワークのイベント処理へ一度だけ接続し、結果はWeb側の状態で管理します。

### Angular / Ionic 9

```ts:src/app/profile.page.ts
import { Component, signal } from '@angular/core';
import { inspectNativeUI } from '../native-ui';
import { IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonContent } from '@ionic/angular';

@Component({
  selector: 'app-profile',
  imports: [IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonContent],
  template: `
    <ion-header><ion-toolbar>
      <ion-title>Profile</ion-title>
      <ion-buttons slot="end">
        <ion-button type="button" (click)="save()">Save</ion-button>
      </ion-buttons>
    </ion-toolbar></ion-header>
    <ion-content><p role="status">{{ result() }}</p></ion-content>
  `,
})
export class ProfilePage {
  readonly result = signal('Not saved');
  save(): void {
    this.result.set('Saved');
    void inspectNativeUI().catch(console.error);
  }
}
```

### React

```tsx:src/Profile.tsx
import { useState } from 'react';
import { inspectNativeUI } from './native-ui';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonContent } from '@ionic/react';

export default function Profile() {
  const [result, setResult] = useState('Not saved');
  function save(): void {
    setResult('Saved');
    void inspectNativeUI().catch(console.error);
  }
  return (
    <IonPage>
      <IonHeader><IonToolbar>
        <IonTitle>Profile</IonTitle>
        <IonButtons slot="end">
          <IonButton type="button" onClick={save}>Save</IonButton>
        </IonButtons>
      </IonToolbar></IonHeader>
      <IonContent><p role="status">{result}</p></IonContent>
    </IonPage>
  );
}
```

### Vue

```vue:src/Profile.vue
<script setup lang="ts">
import { ref } from 'vue';
import { inspectNativeUI } from './native-ui';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonContent } from '@ionic/vue';

const result = ref('Not saved');
function save(): void {
  result.value = 'Saved';
  void inspectNativeUI().catch(console.error);
}
</script>

<template>
  <ion-page>
    <ion-header><ion-toolbar>
      <ion-title>Profile</ion-title>
      <ion-buttons slot="end">
        <ion-button type="button" @click="save">Save</ion-button>
      </ion-buttons>
    </ion-toolbar></ion-header>
    <ion-content><p role="status">{{ result }}</p></ion-content>
  </ion-page>
</template>
```

## 3. Web側に操作の処理を置く

このページを表示する既存のルートを開きます。初期表示はNot savedで、Saveを押すとSavedへ変わります。ネイティブからの操作も同じフレームワークの処理を呼ぶため、SwiftやKotlinで保存処理を足す必要はありません。別画面へ移動して戻り、もう一度Saveを押して一度だけ更新されることを確認します。フレームワークの配線にDOMリスナーを追加しないでください。

## 4. ビルドして同じ操作を確認する

ビルド・同期の後、既存のiOSプロジェクトを実行します。Saveを押し、表示が一度だけSavedへ変わることを確認します。別画面への遷移、戻る操作、戻るスワイプのキャンセル後も、操作が重複せずに動けば完了です。ブラウザーとAndroidでも同じWebボタンで同じ更新を確認します。非対応の内容はWeb表示のまま操作できる必要があります。

```sh
npm run build
npx cap sync ios
npx cap open ios
```

個別のコントロールを調整する場合は[コントロールのリファレンス](/projects/capacitor-native-ui/docs/native-ui)、対象を絞る場合は[設定リファレンス](/projects/capacitor-native-ui/docs/configuration)を使います。

ページの描画後にSaveを押し、inspectNativeUIがログへ出す状態を確認します。既存の起動完了を待ち、同じランタイムを調べます。ネイティブ表示の合格条件はstateがnative、projectedが正数で、ネイティブコントロールが見え、Saveの処理が動くことです。web状態や件数0はフォールバックの確認にとどまるので、reasonと対応コントロールを確認します。確認後は診断の呼び出しとexportを外します。AndroidとブラウザーはWeb操作の成功が期待結果で、組み込みネイティブコントロールはiOSのみです。
