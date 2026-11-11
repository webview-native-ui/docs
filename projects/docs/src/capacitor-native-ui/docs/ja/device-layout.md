---
title: アプリの起動とデバイス配置を接続する
---

# アプリの起動とデバイス配置を接続する

ランタイムとデバイス配置をアプリ単位で一度接続します。Native UI はコントロールの投影、テーマは Web レイアウト、アプリは Foldable のデバイス情報とレイアウトの接続を担当します。標準テーマのプリセットでも既存の Web テーマでも同じ接続を使えます。

## デバイス配置モジュール

`src/device-layout.ts` を作成します。このアプリ所有のモジュールは、コンポーネントやルーターの状態を持ちません。初回読み取りより先に購読し、リゾルバーの値を適用します。所有者を停止するときに購読を解除します。

```ts
import { Capacitor } from '@capacitor/core';
import { Foldable } from '@erkamyaman/capacitor-foldable';
import { resolveVerticalBarsLayout } from '@rdlabo/capacitor-native-ui/integration';

export async function connectDeviceLayout(
  applyLayout: (layout: Awaited<ReturnType<typeof resolveVerticalBarsLayout>>) => void,
): Promise<() => Promise<void>> {
  if (Capacitor.getPlatform() !== 'ios') return async () => {};
  let active = true;
  const refresh = async () => {
    const layout = await resolveVerticalBarsLayout(Foldable);
    if (active) applyLayout(layout);
  };
  const listener = await Foldable.addListener('layoutChange', () => {
    void refresh().catch((error: unknown) => console.error('Device layout refresh failed', error));
  });
  try {
    await refresh();
  } catch (error) {
    active = false;
    await listener.remove();
    throw error;
  }
  return async () => {
    active = false;
    await listener.remove();
  };
}
```

Web レイアウトはコールバックが所有します。Ionic テーマを使う場合は `setVerticalBarsLayout` を渡し、HTML アプリは独自の CSS・レイアウト更新処理と Native UI の `/core` エントリーを使います。デバイスモジュール自体はテーマやフレームワークを import しません。

Foldable 8.5 以降のバージョン8を使います。リゾルバーは `edge`、`inset`、`toolbarTop` をビューポートの CSS ピクセルで返します。edge が null なら通常のレイアウトへ戻し、利用できない値はテーマの既定値を維持します。デバイスの位置と寸法と、ネイティブ描画の利用可否は別の入力です。

## Angular bootstrap

デバイスの接続はルートサービスで所有します。`src/app/vertical-bars-layout.service.ts` を作成します。

```ts
import { DestroyRef, Injectable, inject } from '@angular/core';
import { connectDeviceLayout } from '../device-layout';
import { setVerticalBarsLayout } from '@rdlabo/ionic-theme-ios27';

@Injectable({ providedIn: 'root' })
export class VerticalBarsLayoutService {
  readonly #destroyRef = inject(DestroyRef);

  async initialize(): Promise<void> {
    const disconnect = await connectDeviceLayout(setVerticalBarsLayout);
    if (this.#destroyRef.destroyed) {
      await disconnect();
      return;
    }
    this.#destroyRef.onDestroy(() => {
      void disconnect().catch((error: unknown) => console.error('Device layout cleanup failed', error));
    });
  }
}
```

アプリの既存の `src/main.ts` で、サービスと Native UI を接続します。`appConfig` が Ionic のプリセットとルートを設定し、`AppComponent` がアプリのシェルと router outlet を構成します。

```ts
import { bootstrapApplication } from '@angular/platform-browser';
import { enableNativeUI } from '@rdlabo/capacitor-native-ui';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';
import { VerticalBarsLayoutService } from './app/vertical-bars-layout.service';

void bootstrapApplication(AppComponent, appConfig)
  .then(async (app) => {
    const shell = await enableNativeUI();
    if (app.destroyed) {
      await shell.destroy();
      return;
    }
    app.onDestroy(() => {
      void shell.destroy().catch((error: unknown) => console.error('Native UI cleanup failed', error));
    });
    await app.injector.get(VerticalBarsLayoutService).initialize();
  })
  .catch((error: unknown) => console.error('Application startup failed', error));
```

アプリはランタイムのハンドルを所有し、終了時に破棄します。ルートサービスはデバイス購読を解除します。ページコンポーネントは既存の状態と操作ハンドラーを維持します。

## React・Vue などのアプリ所有者

アプリのシェルがマウントされた後に、同じ `connectDeviceLayout` モジュールをアプリの起動から使います。連携自体はフレームワークに依存しません。

```ts
import { enableNativeUI } from '@rdlabo/capacitor-native-ui';
import { connectDeviceLayout } from './device-layout';
import { setVerticalBarsLayout } from '@rdlabo/ionic-theme-ios27';

export async function startApplicationNativeUI(): Promise<() => Promise<void>> {
  const shell = await enableNativeUI();
  try {
    const disconnect = await connectDeviceLayout(setVerticalBarsLayout);
    return async () => {
      try {
        await disconnect();
      } finally {
        await shell.destroy();
      }
    };
  } catch (error) {
    await shell.destroy();
    throw error;
  }
}
```

アプリのマウント後の起動処理から、この関数を一度 await します。返された破棄関数を保持し、アプリをアンマウントする前に await して呼び出します。React の開発用 Strict Mode は effect を再マウントする場合があります。このアプリ単位の起動はアプリの所有者へ置き、ページごとや再マウントされる effect から繰り返し起動しないでください。Vue でもページの寿命ではなく、アプリの所有者を使います。ブラウザー・サーバー描画環境では、ドキュメントが存在した後にだけ呼び出します。

## デバイスの動作確認

レール対応デバイスで使用する画面を切り替え、Web コンテンツの余白とツールバー原点が一緒に更新されることを確認します。レールのないデバイスでは通常のレイアウトが有効です。ブラウザープレビューでは Web レイアウトを確認し、ネイティブレールの描画は対応 iOS デバイスと OS で確認してください。
