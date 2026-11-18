import { build } from 'esbuild';

await build({
  entryPoints: {
    controls: 'projects/docs/preview/controls.ts',
    ios: '@rdlabo/ionic-theme-ios27/styles/class.css',
    md: '@rdlabo/ionic-theme-md3/styles/theme.css',
  },
  outdir: 'projects/docs/public/assets/theme-preview',
  bundle: true,
  minify: true,
  legalComments: 'eof',
  target: 'es2022',
});
