---
title: "アプリの起動とデバイス配置"
---

# アプリの起動とデバイス配置

アプリのシェル描画後に Native UI を一度起動します。Foldable の配置通知をテーマへ渡して、Web の余白をデバイスに合わせます。

## デバイス配置

`ion-app` の描画後に `layoutChange` を購読し、その後で初期配置を取得します。

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

Foldable 8.5 以降のバージョン8を使います。リゾルバーは `edge`、`inset`、`toolbarTop` をビューポートの CSS ピクセルで返します。テーマが Web レイアウトへ適用し、edge が null の場合は通常配置に戻します。Native UI は別途コントロールの投影を担当します。

## Angular bootstrap

`src/main.ts` で Angular の起動後に Native UI を起動します。

```ts
import { bootstrapApplication } from '@angular/platform-browser';
import { enableNativeUI } from '@rdlabo/capacitor-native-ui';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

void bootstrapApplication(AppComponent, appConfig)
  .then(() => {
    void enableNativeUI().catch(console.error);
  })
  .catch(console.error);
```

上の配置コードはアプリシェルの既存の `afterNextRender` コールバックへ置きます。Ionic のルートとページのハンドラーはそのまま使います。追加のサービスやライフサイクルラッパーは不要です。

## React、Vue とその他のフレームワーク

アプリのシェル描画後に Native UI を一度起動し、上の配置コードを接続します。

```ts
import { enableNativeUI } from '@rdlabo/capacitor-native-ui';

void enableNativeUI().catch(console.error);
```

ページではなく、マウント後のアプリ起動処理から呼びます。HTML アプリでは `/core` エントリーを使い、`setVerticalBarsLayout` の代わりに独自の CSS 更新処理を使います。

## デバイス動作の確認

対応レール端末でアクティブなディスプレイを切り替え、Web コンテンツの余白とツールバーの起点が一緒に変わることを確認します。レールのない端末では通常配置を使います。ブラウザーでは Web レイアウトを確認でき、ネイティブレールの描画には対応 iOS 端末と OS が必要です。
