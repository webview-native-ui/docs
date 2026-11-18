import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { cp, mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

export const japaneseDocsRef = '48f35c8a956fb55661dcbdbb474f848adb70431b';
const japaneseApiRef = '0e9f7c7e21496f3ad4582af3b6e53b22658cac1d';
const japaneseApiDigest = '18a5ba4e5d4f09ccffeffe6693a44490d0fdc1a26d7de5196caf0a8d9e3e2ea1';

export async function prepareJapaneseDocs(work) {
  const target = join(work, 'i18n/ja/docusaurus-plugin-content-docs/current');
  await mkdir(target, { recursive: true });
  const archive = join(work, 'translation-ja.tgz');
  execFileSync('curl', [
    '-fsSL',
    'https://codeload.github.com/ionic-team/ionic-docs/tar.gz/' + japaneseDocsRef,
    '-o',
    archive,
  ]);
  execFileSync('tar', [
    '-xzf',
    archive,
    '-C',
    target,
    '--strip-components=2',
    'ionic-docs-' + japaneseDocsRef + '/docs',
  ]);
  const file = join(work, 'api-ja.json');
  execFileSync('curl', [
    '-fsSL',
    'https://raw.githubusercontent.com/ionic-jp/ionic-docs/' +
      japaneseApiRef +
      '/scripts/data/translated-api.json',
    '-o',
    file,
  ]);
  if (
    createHash('sha256')
      .update(await readFile(file))
      .digest('hex') !== japaneseApiDigest
  )
    throw Error('Unexpected Japanese API definitions');
}

const apiInputs = [
  {
    major: '8',
    version: '8.8.20',
    sha256: '7b3182b656c01a58cb1fa35cd956e60156cb2a62a1e235eb695416f55aa34bd5',
  },
  {
    major: '9',
    version: '9.0.0',
    sha256: '2f201959495aa9e17c0e0fef0edbcbd4b7e3db5f65f5d43194e4ec27229dd8a7',
  },
];
export const ionicCore = 'node_modules/@ionic/angular/node_modules/@ionic/core';

export async function pinApiInputs(work) {
  const current = apiInputs.at(-1);
  const runtime = JSON.parse(await readFile(join(ionicCore, 'package.json'), 'utf8'));
  if (runtime.version !== current.version)
    throw new Error('Update the pinned API definitions to match the demo runtime');
  const versions = JSON.parse(await readFile(join(work, 'versions.json'), 'utf8'));
  if (
    versions.join(',') !==
    apiInputs
      .slice(0, -1)
      .map((x) => 'v' + x.major)
      .join(',')
  ) {
    throw new Error('Review and pin the API inputs for the new Ionic Docs versions');
  }
  for (const { major, version, sha256 } of apiInputs) {
    const file = join(work, 'api-v' + major + '.json');
    execFileSync('curl', [
      '-fsSL',
      'https://unpkg.com/@ionic/docs@' + version + '/core.json',
      '-o',
      file,
    ]);
    if (
      createHash('sha256')
        .update(await readFile(file))
        .digest('hex') !== sha256
    ) {
      throw new Error('Unexpected core.json for @ionic/docs@' + version);
    }
  }
  // Keep the upstream rendering logic. Only replace its mutable registry input.
  const plugin = join(work, 'plugins/docusaurus-plugin-ionic-component-api/index.js');
  const fetchJapanese =
    'await fetch(`https://raw.githubusercontent.com/ionic-jp/ionic-docs/main/scripts/data/translated-api.json`)';
  const original = await readFile(plugin, 'utf8');
  if (original.split(fetchJapanese).length !== 2)
    throw Error('Review the upstream Japanese API adapter');
  const source = original.replace(
    fetchJapanese,
    '({text: () => require("node:fs/promises").readFile(require("node:path").resolve(__dirname, "../../api-ja.json"), "utf8")})',
  );
  const fetchApi = 'await fetch(`https://unpkg.com/@ionic/docs@${npmTag}/core.json`)';
  if (source.split(fetchApi).length !== 2) throw new Error('Review the upstream API input adapter');
  await writeFile(
    plugin,
    source.replace(
      fetchApi,
      '({text: () => require("node:fs/promises").readFile(require("node:path").resolve(__dirname, "../../api-" + version + ".json"), "utf8")})',
    ),
  );
}

export async function installDistributionNotices(work, assets, revision) {
  const licenses = join(assets, 'licenses');
  await mkdir(licenses, { recursive: true });
  const packages = [
    [ionicCore, 'ionic-core'],
    ['node_modules/ionicons', 'ionicons'],
    ...['ios26', 'ios27', 'md3'].map((theme) => [
      'node_modules/@rdlabo/ionic-theme-' + theme,
      'ionic-theme-' + theme,
    ]),
  ];
  await cp(
    'scripts/ionic-preview/licenses/ionic-framework.txt',
    join(licenses, 'ionic-docs-api.txt'),
  );
  const notices = [
    'WebView Native UI component reference',
    '',
    'Articles and live examples are compiled from Ionic Docs (Apache-2.0).',
    'Source: https://github.com/ionic-team/ionic-docs/tree/' + revision,
    'Japanese articles: https://github.com/ionic-team/ionic-docs/tree/' + japaneseDocsRef,
    'Japanese API definitions: https://github.com/ionic-jp/ionic-docs/blob/' +
      japaneseApiRef +
      '/scripts/data/translated-api.json',
    'See LICENSE for the complete Apache License.',
    'Changes: rendered the original articles and code samples for this portal;',
    'live examples load local runtimes and themes and forward console output.',
    '',
    'API definitions: @ionic/docs@' +
      apiInputs.at(-1).version +
      ' (see licenses/ionic-docs-api.txt).',
    'SHA-256 of core.json: ' + apiInputs.at(-1).sha256,
    '',
  ];
  for (const [dir, basename] of packages) {
    const { name, version } = JSON.parse(await readFile(join(dir, 'package.json'), 'utf8'));
    const filename = basename + '.txt';
    await cp(join(dir, 'LICENSE'), join(licenses, filename));
    notices.push(name + '@' + version + ': licenses/' + filename);
  }
  await cp(
    'node_modules/@rdlabo/ionic-theme-md3/THIRD_PARTY_NOTICES.md',
    join(licenses, 'ionic-theme-md3-notices.md'),
  );
  notices.push(
    'Material Design 3 theme notices: licenses/ionic-theme-md3-notices.md',
    '',
    'Roboto fonts: Copyright 2011 Google Inc. All Rights Reserved. Apache-2.0 (see LICENSE).',
  );
  await mkdir(join(assets, 'usage/fonts'), { recursive: true });
  for (const weight of ['Regular', 'Medium']) {
    const font = 'Roboto-' + weight + '.ttf';
    await cp(join(work, 'static/fonts', font), join(assets, 'usage/fonts', font));
  }
  await writeFile(join(assets, 'NOTICE.txt'), notices.join('\n') + '\n');
}
