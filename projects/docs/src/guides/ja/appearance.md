---
title: '見た目を整える'
sourceRevision: '937569d01125fc3106f2a16c6de5da61360b98a4d5cb45df0e1e35ea8adf6ce2'
---

# 見た目を整える

導入済みのアプリに、ライト・ダーク・システム追従を切り替える操作を追加します。Androidの端末配色を保ちながら、Web UIとiOSのネイティブコントロールを同じ設定で切り替えます。

テーマだけを導入する場合は、[iOS 26](/projects/ionic-theme-ios26/docs/setup)・[iOS 27](/projects/ionic-theme-ios27/docs/setup)・[MD3](/projects/ionic-theme-md3/docs/setup)の導入手順を選んでください。Native UIの追加は不要です。以下は、Ionic + Capacitorへの導入後に外観設定を追加する手順です。

## 1. 切り替え操作を画面に置く

[アプリへの導入](/standard-setup)が済んだアプリを使います。設定画面にLight・Dark・Systemの切り替えを追加します。手順2で共通の変更関数を用意し、手順3では使っているフレームワークの例だけ選びます。コントローラーやプラグインの追加は不要です。

## 2. 既存の配色コントローラーを受け取る

導入手順のsrc/native-ui.tsに、型のimportと変数をモジュール直下へ追加します。connectNativeUI内の既存の呼び出しを、その変数への代入に変え、同じファイルの末尾にsetAppearanceModeを追加します。コントローラーは一つのままです。設定変更の関数は起動完了を待つので、後から開いた設定画面でも使えます。

```ts:src/native-ui.ts
import type { ColorMode, DynamicColorTheme } from '@rdlabo/ionic-theme-md3/dynamic-colors';

let appearance: DynamicColorTheme;
```

```diff
- await enableDynamicColors({
+ appearance = await enableDynamicColors({
```

```ts:src/native-ui.ts
export async function setAppearanceMode(mode: ColorMode): Promise<void> {
  await startNativeUI();
  appearance.setMode(mode);
}
```

## 3. ボタンから表示を切り替える

使っているフレームワークの例だけ選び、既存の設定画面へimportとイベント処理を追加します。下のファイル名を基準にimportの相対パスを合わせ、現在のルートと他の内容は残します。フレームワークのクリック処理を使うため、DOM検索・描画後の手動登録・リスナーの後始末は不要です。画面を開き直しても起動処理と配色コントローラーは同じものを使います。

### Angular / Ionic 9

```ts:src/app/appearance.page.ts
import { Component } from '@angular/core';
import type { ColorMode } from '@rdlabo/ionic-theme-md3/dynamic-colors';
import { setAppearanceMode } from '../native-ui';

@Component({
  selector: 'app-appearance',
  template: `
    <section aria-label="Appearance">
      <button type="button" (click)="setMode('light')">Light</button>
      <button type="button" (click)="setMode('dark')">Dark</button>
      <button type="button" (click)="setMode('system')">System</button>
    </section>
  `,
})
export class AppearancePage {
  setMode(mode: ColorMode): void {
    void setAppearanceMode(mode).catch(console.error);
  }
}
```

### React

```tsx:src/Appearance.tsx
import type { ColorMode } from '@rdlabo/ionic-theme-md3/dynamic-colors';
import { setAppearanceMode } from './native-ui';

function setMode(mode: ColorMode): void {
  void setAppearanceMode(mode).catch(console.error);
}

export default function Appearance() {
  return (
    <section aria-label="Appearance">
      <button type="button" onClick={() => setMode('light')}>Light</button>
      <button type="button" onClick={() => setMode('dark')}>Dark</button>
      <button type="button" onClick={() => setMode('system')}>System</button>
    </section>
  );
}
```

### Vue

```vue:src/Appearance.vue
<script setup lang="ts">
import type { ColorMode } from '@rdlabo/ionic-theme-md3/dynamic-colors';
import { setAppearanceMode } from './native-ui';

function setMode(mode: ColorMode): void {
  void setAppearanceMode(mode).catch(console.error);
}
</script>

<template>
  <section aria-label="Appearance">
    <button type="button" @click="setMode('light')">Light</button>
    <button type="button" @click="setMode('dark')">Dark</button>
    <button type="button" @click="setMode('system')">System</button>
  </section>
</template>
```

## 4. 各モードと配色のフォールバックを確認する

「Dark」「Light」を押し、Webの背景と対応するiOSコントロールが一緒に変わることを確認します。「System」にして端末の外観を変更すると、アプリも追従します。Android 12以降では壁紙の配色を変えてアプリを開き直し、MD3への反映を確認します。ブラウザーや非対応のAndroid端末でも既定の配色で操作できれば完了です。Webとネイティブで表示が食い違う場合は、設定を足す前に古いダークパレットや二重の配色管理を取り除きます。

ブランドカラーの対応関係は[Dynamic Colorリファレンス](/projects/capacitor-native-ui/docs/dynamic-colors)にあります。テーマだけを入れる場合は[iOS 26](/projects/ionic-theme-ios26/docs/setup)・[iOS 27](/projects/ionic-theme-ios27/docs/setup)・[MD3](/projects/ionic-theme-md3/docs/setup)の導入手順を使います。
