// Compile upstream MDX with Node 24, then export the articles to the Angular portal.
import { execFileSync } from 'node:child_process';
import { cp, mkdir, mkdtemp, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { installGenerated } from './ionic-preview/install-generated.mjs';
import { build } from 'esbuild';
import { ionicCore, pinApiInputs } from './ionic-preview/upstream-inputs.mjs';

const ref = process.argv[2] ?? 'a79918700e48c6ae3c8c14e06964d413c7b219ef';
if (!/^[a-f0-9]{40}$/.test(ref)) throw new Error('Expected an ionic-docs commit SHA');
const work = await mkdtemp(join(tmpdir(), 'ionic-docs-'));
try {
  const run = (cmd, args) => execFileSync(cmd, args, { cwd: work, stdio: 'inherit' });
  run('curl', [
    '-fsSL',
    `https://codeload.github.com/ionic-team/ionic-docs/tar.gz/${ref}`,
    '-o',
    'source.tgz',
  ]);
  run('tar', ['-xzf', 'source.tgz', '--strip-components=1']);
  run('npm', ['ci', '--ignore-scripts', '--legacy-peer-deps', '--no-audit']);
  await pinApiInputs(work);
  run('npm', ['run', 'generate-markdown']);
  await cp(
    'scripts/ionic-preview/Playground.tsx',
    join(work, 'src/components/global/Playground/index.tsx'),
  );
  await cp('scripts/ionic-preview/config.cjs', join(work, 'preview.config.cjs'));
  await writeFile(
    join(work, 'src/theme/TOC/index.tsx'),
    "export {default} from '@theme-original/TOC';\n",
  );

  const assets = join(work, 'static/preview-assets');
  await mkdir(assets, { recursive: true });
  for (const folder of ['css', 'dist/ionic']) {
    await cp(join(ionicCore, folder), join(assets, folder), {
      recursive: true,
    });
  }
  await build({
    entryPoints: {
      ios26: '@rdlabo/ionic-theme-ios26/styles/class.css',
      ios27: '@rdlabo/ionic-theme-ios27/styles/class.css',
      md: '@rdlabo/ionic-theme-md3/styles/theme.css',
    },
    outdir: assets,
    bundle: true,
    minify: true,
  });
  const usage = join(work, 'static/usage/v9');
  const cdn = 'https://cdn.jsdelivr.net/npm/@ionic/core@9/';
  for (const file of await readdir(usage, { recursive: true })) {
    if (!file.endsWith('/demo.html') && file !== 'common.js') continue;
    const path = join(usage, file);
    let source = (await readFile(path, 'utf8')).replaceAll(
      cdn,
      '/assets/ionic-components/runtime/',
    );
    if (file === 'common.js') {
      source =
        '// Modified by WebView Native UI: use local resources and forward console output.\n' +
        source;
      source +=
        "\nwindow.addEventListener('console', ({detail}) => parent.postMessage({ionicDemoLog:detail.message},location.origin));\n";
    }
    if (file.endsWith('.html')) {
      source = source.replace(
        '</head>',
        `<!-- Modified by WebView Native UI: load the local runtime and selected theme. -->
    <script>
      const previewTheme = new URLSearchParams(location.search).get('theme');
      if (['ios26','ios27','md'].includes(previewTheme)) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = '/assets/ionic-components/runtime/' + previewTheme + '.css';
        document.head.append(link);
      }
    </script></head>`,
      );
    }
    await writeFile(path, source);
  }
  const output = resolve('dist/ionic-components/docs');
  run('node', [
    'node_modules/@docusaurus/core/bin/docusaurus.mjs',
    'build',
    '--locale',
    'en',
    '--config',
    'preview.config.cjs',
    '--out-dir',
    output,
  ]);
  await installGenerated(work, output, ref);
} finally {
  await rm(work, { recursive: true, force: true });
}
