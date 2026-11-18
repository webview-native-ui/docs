import { readFile, writeFile } from 'node:fs/promises';
import { build } from 'esbuild';

await build({
  entryPoints: {
    controls: 'projects/docs/preview/controls.ts',
    markup: 'projects/docs/preview/markup.ts',
    core: '@ionic/core/css/core.css',
    ios26: '@rdlabo/ionic-theme-ios26/styles/class.css',
    ios: '@rdlabo/ionic-theme-ios27/styles/class.css',
    md: '@rdlabo/ionic-theme-md3/styles/theme.css',
  },
  outdir: 'projects/docs/public/assets/theme-preview',
  bundle: true,
  minify: true,
  legalComments: 'eof',
  target: 'es2022',
});

const guide = await readFile('projects/docs/src/guides/en/special-markup.md', 'utf8');
const examples = [...guide.matchAll(/^```html\n([\s\S]*?)^```/gm)];
for (const [index, match] of examples.entries()) {
  for (const theme of ['ios', 'ios26', 'md']) {
    const mode = theme === 'md' ? 'md' : 'ios';
    const page = `<!doctype html>
<html lang="en" class="${mode}" mode="${mode}">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex">
<base href="/assets/theme-preview/"><title>Ionic markup preview</title>
<link rel="stylesheet" href="core.css"><link rel="stylesheet" href="${theme}.css">
<style>*{box-sizing:border-box}body{margin:0;background:white;color:#172033;font:16px system-ui,sans-serif}main{min-height:100vh;display:grid;place-items:center;padding:12px}section{width:min(100%,360px);text-align:center}ion-list,ion-toolbar{text-align:start}main:has(ion-content){padding:0;display:block}section:has(>ion-content){width:100%;height:100vh}</style>
<script src="markup.js" defer></script></head><body><main><section>${match[1]}</section></main></body></html>`;
    await writeFile(`projects/docs/public/assets/theme-preview/markup-${index}-${theme}.html`, page);
  }
}
