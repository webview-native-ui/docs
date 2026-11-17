---
title: '外観の切り替えを追加する'
sourceRevision: '13b6b0ec01975144b90a17a7f5d6effa854f3b741a574f04b30ac7b2fa77844d'
headingAliases:
  '1.-%E5%88%87%E3%82%8A%E6%9B%BF%E3%81%88%E6%93%8D%E4%BD%9C%E3%82%92%E7%94%BB%E9%9D%A2%E3%81%AB%E7%BD%AE%E3%81%8F': '1.-%E8%BF%BD%E5%8A%A0%E3%81%99%E3%82%8B2%E3%81%A4%E3%81%AE%E8%A8%AD%E5%AE%9A%E3%82%92%E7%A2%BA%E8%AA%8D%E3%81%99%E3%82%8B'
  '3.-%E3%83%9C%E3%82%BF%E3%83%B3%E3%81%8B%E3%82%89%E8%A1%A8%E7%A4%BA%E3%82%92%E5%88%87%E3%82%8A%E6%9B%BF%E3%81%88%E3%82%8B': '3.-2%E3%81%A4%E3%81%AE%E8%A8%AD%E5%AE%9A%E3%82%92%E7%94%BB%E9%9D%A2%E3%81%B8%E6%8E%A5%E7%B6%9A%E3%81%99%E3%82%8B'
---

# 外観の切り替えを追加する

導入手順ではOSに追従する明暗表示を維持しています。この使い方では、その方針を「端末配色を使うか」と「ダークモードを使うか」の独立した2つのアプリ設定へ切り替えます。それぞれion-item内のion-toggleで現在値を表示します。ダークモードの初期値だけをOSから取得し、その後のOS変更では設定を変えません。

テーマだけを導入する場合は、[iOS 26](/projects/ionic-theme-ios26/docs/setup)・[iOS 27](/projects/ionic-theme-ios27/docs/setup)・[MD3](/projects/ionic-theme-md3/docs/setup)の導入手順を選んでください。Native UIの追加は不要です。以下は、Ionic + Capacitorへの導入後に外観設定を追加する手順です。

## 1. 追加する2つの設定を確認する

一時確認用フックを撤去した[導入完了後](/standard-setup)のアプリから始めます。この手順では2設定の意味を確認し、ファイルはまだ変更しません。Use device colorsは、対応するAndroid 12以降の端末パレットを既定色の代わりに使う指定です。Dark modeはオンでダーク、オフでライトにし、配色元とは独立して選びます。このUIにOS追従の選択肢は追加しません。

| 設定              | オン                     | オフ                 |
| ----------------- | ------------------------ | -------------------- |
| Use device colors | 利用可能な端末配色を使う | テーマの既定色を使う |
| Dark mode         | ダーク                   | ライト               |

## 2. 既存の配色コントローラーを受け取る

既存スタイルのSystemからClassへの切り替え、既存起動モジュールへの設定状態、provider、取得／変更関数の順に4つの差分を適用します。これは、明暗の管理をOS追従のCSSからアプリのDark modeトグルへ意図的に変更する手順で、端末配色の選択とは独立しています。コントローラーの起動は一度のままです。現在のOSの明暗はdarkの初期値としてだけ受け取り、その値に対応するダーク／ライトで起動します。それ以降の明暗はそのbool値に従います。部分更新なので、片方の設定でもう片方を戻しません。APIが使える状態になれば、この手順は完了です。2つのトグルは手順3で追加します。

iOSではWeb画面やNative UIコントロールとは別に、ステータスバーの文字・アイコンの明暗も更新します。SystemBarsを初期起動と設定変更の両方で呼び、OSとは逆の明暗を選んでも読める状態にします。Androidのシステムバーや既存のinset処理は、このiOS用処理では変更しません。

<!-- prettier-ignore -->
```diff:src/global.css
@@
- @import '@rdlabo/ionic-theme-ios26/styles/system.css' supports(not (overflow-anchor: auto));
- @import '@rdlabo/ionic-theme-ios27/styles/system.css' supports(overflow-anchor: auto);
+ @import '@rdlabo/ionic-theme-ios26/styles/class.css' supports(not (overflow-anchor: auto));
+ @import '@rdlabo/ionic-theme-ios27/styles/class.css' supports(overflow-anchor: auto);
 @import '@rdlabo/ionic-theme-ios27/dist/css/vertical-bars.css' supports(not (overflow-anchor: auto));
 @import '@rdlabo/ionic-theme-md3/styles/theme.css';
```

<!-- prettier-ignore -->
```diff:src/native-ui.ts
@@
- import { Capacitor } from '@capacitor/core';
+ import { Capacitor, SystemBars, SystemBarsStyle } from '@capacitor/core';
@@
 import { enableDynamicColors } from '@rdlabo/ionic-theme-md3/dynamic-colors';
+ import type { DynamicColorTheme } from '@rdlabo/ionic-theme-md3/dynamic-colors';
@@
 let startup: Promise<void> | undefined;
+ 
+ export type AppearancePreferences = {
+   deviceColors: boolean;
+   dark: boolean;
+ };
+ 
+ let appearance: DynamicColorTheme;
+ let preferences: AppearancePreferences = {
+   deviceColors: true,
+   dark: globalThis.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false,
+ };
```

<!-- prettier-ignore -->
```diff:src/native-ui.ts
@@
-   await enableDynamicColors({
-     getScheme: getDynamicColorScheme,
+   appearance = await enableDynamicColors({
+     mode: preferences.dark ? 'dark' : 'light',
+     getScheme: async () => {
+       const scheme = await getDynamicColorScheme();
+       return preferences.deviceColors
+         ? scheme
+         : { available: false as const, systemDark: scheme.systemDark };
+     },
     listen: addDynamicColorListener,
   });
@@
   if (Capacitor.getPlatform() === 'ios') {
+     await syncIOSSystemBars();
```

<!-- prettier-ignore -->
```diff:src/native-ui.ts
@@
       .catch(console.error);
   }
 }
+ 
+ export function getAppearancePreferences(): AppearancePreferences {
+   return { ...preferences };
+ }
+ 
+ export async function setAppearancePreferences(patch: Partial<AppearancePreferences>): Promise<void> {
+   const paletteChanged = patch.deviceColors !== undefined && patch.deviceColors !== preferences.deviceColors;
+   preferences = { ...preferences, ...patch };
+   await startNativeUI();
+   appearance.setMode(preferences.dark ? 'dark' : 'light');
+   if (paletteChanged) await appearance.refresh();
+   await syncIOSSystemBars();
+ }
+ 
+ async function syncIOSSystemBars(): Promise<void> {
+   if (Capacitor.getPlatform() !== 'ios') return;
+   await SystemBars.setStyle({
+     style: preferences.dark ? SystemBarsStyle.Dark : SystemBarsStyle.Light,
+   });
+ }
```

## 3. 2つの設定を画面へ接続する

既存ルートから表示する設定画面へ、自分のフレームワークの差分だけを適用します。実際のファイル名・ルート・ほかの内容は維持します。2つのトグルは共通設定を読み、選択状態を表示するため、別のコントローラーは作りません。実行中にこのルートを開き直しても設定を保ちます。永続化は行わず、アプリ再起動やブラウザーの完全な再読み込みでは、その時点のOSからダークモードの初期値を取り直します。Use device colorsは利用者の希望であり、端末パレットを取得できた証明ではありません。非対応端末の扱いは入力欄の近くへ表示します。

### Angular / Ionic 9

<!-- prettier-ignore -->
```diff:src/app/appearance.page.ts
@@
- import { Component } from '@angular/core';
+ import { Component, effect, signal } from '@angular/core';
+ import { form, FormField } from '@angular/forms/signals';
+ import { IonItem, IonToggle } from '@ionic/angular';
+ import { getAppearancePreferences, setAppearancePreferences } from '../native-ui';

 @Component({
   selector: 'app-appearance',
+   imports: [FormField, IonItem, IonToggle],
   template: `
     <section aria-label="Appearance">
       <h1>Appearance</h1>
+       <ion-item>
+         <ion-toggle [formField]="fields.deviceColors"
+           helperText="Uses device colors on supported Android 12+ devices; otherwise uses theme colors.">
+           Use device colors
+         </ion-toggle>
+       </ion-item>
+       <ion-item>
+         <ion-toggle [formField]="fields.dark">Dark mode</ion-toggle>
+       </ion-item>
     </section>
   `,
 })
- export class AppearancePage {}
+ export class AppearancePage {
+   readonly model = signal(getAppearancePreferences());
+   readonly fields = form(this.model);
+ 
+   constructor() {
+     effect(() => {
+       void setAppearancePreferences(this.model()).catch(console.error);
+     });
+   }
+ }
```

### React

<!-- prettier-ignore -->
```diff:src/Appearance.tsx
@@
+ import { useState } from 'react';
+ import { IonItem, IonToggle } from '@ionic/react';
+ import {
+   getAppearancePreferences,
+   setAppearancePreferences,
+   type AppearancePreferences,
+ } from './native-ui';
+ 
 export default function Appearance() {
+   const [preferences, setPreferences] = useState(getAppearancePreferences);
+ 
+   function apply(patch: Partial<AppearancePreferences>): void {
+     setPreferences((current) => ({ ...current, ...patch }));
+     void setAppearancePreferences(patch).catch(console.error);
+   }
+ 
   return (
     <section aria-label="Appearance">
       <h1>Appearance</h1>
+       <IonItem>
+         <IonToggle
+           checked={preferences.deviceColors}
+           onIonChange={(event) => apply({ deviceColors: event.detail.checked })}
+           helperText="Uses device colors on supported Android 12+ devices; otherwise uses theme colors."
+         >Use device colors</IonToggle>
+       </IonItem>
+       <IonItem>
+         <IonToggle checked={preferences.dark}
+           onIonChange={(event) => apply({ dark: event.detail.checked })}>Dark mode</IonToggle>
+       </IonItem>
     </section>
   );
 }
```

### Vue

<!-- prettier-ignore -->
```diff:src/Appearance.vue
@@
 <script setup lang="ts">
+ import { reactive } from 'vue';
+ import { IonItem, IonToggle } from '@ionic/vue';
+ import {
+   getAppearancePreferences,
+   setAppearancePreferences,
+   type AppearancePreferences,
+ } from './native-ui';
+ 
+ const preferences = reactive(getAppearancePreferences());
+ 
+ function apply(patch: Partial<AppearancePreferences>): void {
+   Object.assign(preferences, patch);
+   void setAppearancePreferences(patch).catch(console.error);
+ }
+ 
+ function updateDeviceColors(event: CustomEvent<{ checked: boolean }>): void {
+   apply({ deviceColors: event.detail.checked });
+ }
+ 
+ function updateDark(event: CustomEvent<{ checked: boolean }>): void {
+   apply({ dark: event.detail.checked });
+ }
 </script>

 <template>
   <section aria-label="Appearance">
     <h1>Appearance</h1>
+     <ion-item>
+       <ion-toggle :checked="preferences.deviceColors" @ionChange="updateDeviceColors"
+         helper-text="Uses device colors on supported Android 12+ devices; otherwise uses theme colors.">
+         Use device colors
+       </ion-toggle>
+     </ion-item>
+     <ion-item>
+       <ion-toggle :checked="preferences.dark" @ionChange="updateDark">Dark mode</ion-toggle>
+     </ion-item>
   </section>
 </template>
```

## 4. 各モードと配色のフォールバックを確認する

編集した入力欄を確認する前に、既存のWeb開発サーバーを起動し、ブラウザーのページを完全に再読み込みします。ネイティブで確認する場合は、アプリのディレクトリでnpm run buildを実行し、選んだ対象だけをnpx cap sync iosまたはnpx cap sync androidで同期して、そのターゲットを再ビルドします。アプリ／WebViewを終了・再起動してから2つの入力欄を確認してください。ソース編集だけではインストール済みアプリは更新されません。アプリ再起動やブラウザーの完全な再読み込みではメモリー上の設定が初期化されるので、その後に確認用の値を選びます。ルート内の設定画面を開き直すだけなら値は維持されます。

端末配色オフ・ダークオフ、オフ・オン、オン・オフ、オン・オンの4通りを確認します。Dark modeがオフならライト、オンならダークのWeb UIと対応するiOSコントロールになります。アプリの実行中にOSの明暗を変えても、トグルやアプリの明暗が勝手に変わらないことを確認します。どちらかのトグルを変えても、もう片方の設定を戻してはいけません。

対応するAndroid 12以降では端末配色を有効にし、壁紙のパレットを変えて実行中の同じアプリへ戻り、新しい配色を確認します。端末配色を無効にすると、Dark modeを保ったままテーマの既定色へ戻ります。iOS・ブラウザー・非対応Androidでは、配色のオン・オフにかかわらず既定色で操作できます。設定ルートを開き直し、両方のオン・オフの状態が表示されることも確認します。4通りの組み合わせ・配色のフォールバック・画面再訪が動けば完了です。

iOSではOSがライトのままアプリをダークにし、時刻・電池などの文字やアイコンを読めることを確認します。OSがダークのままアプリをライトにした場合も確認してください。この例は設定を永続化しません。既存アプリの保存・復元へ接続する場合は、復元直後にも同じSystemBars更新を行い、再起動後の両方向を確認します。

帳票・印刷・PDF出力があるアプリでは、表示設定の変更後も用途に合う配色で出力されるか確認します。画面のテーマ変数が出力先へ引き継がれる場合は、印刷用の配色を画面設定から独立させます。一時確認画面だけで完了とせず、実際の設定画面と主要画面でも変更前後を比較してください。

ブランドカラーの対応関係は[Dynamic Colorリファレンス](/projects/capacitor-native-ui/docs/dynamic-colors)にあります。テーマだけを入れる場合は[iOS 26](/projects/ionic-theme-ios26/docs/setup)・[iOS 27](/projects/ionic-theme-ios27/docs/setup)・[MD3](/projects/ionic-theme-md3/docs/setup)の導入手順を使います。
