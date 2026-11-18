---
title: 'iOS 18'
code: []
scrollActiveLine: []
---

## iOS 18でテーマファイルの読み込みを防ぐ方法

iOS 18でIonic標準の外観を使うには、テーマの `import` に次の条件を追加します。スタイルシートはブラウザーが text-wrap: pretty に対応する場合に読み込まれます。

```css
@import '@rdlabo/ionic-theme-ios26/dist/css/default-variables.css' supports(text-wrap: pretty);
@import '@rdlabo/ionic-theme-ios26/dist/css/ionic-theme-ios26.css' supports(text-wrap: pretty);
@import '@rdlabo/ionic-theme-ios26/dist/css/md-remove-ios-class-effect.css' supports(text-wrap: pretty);
@import '@rdlabo/ionic-theme-ios26/dist/css/md-ion-list-inset.css' supports(text-wrap: pretty);
```
