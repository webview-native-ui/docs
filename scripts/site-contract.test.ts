import { applyTutorial, completedSetup, tutorialBaselines } from './tutorial-states';
import { GUIDE_CHAPTERS } from '../shared/guide-navigation';
import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';
import { readFile } from 'node:fs/promises';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { normalizeTranslationCode } from './translation-code';
import { projectDefinitions } from './project-manifest';
import {
  extractPackageReadme,
  normalizePackageMarkdown,
  stripLeadingH1,
  stripRdlaboDocsOmit,
} from './package-markdown';
import { fetchEnglishProjectMarkdown } from './package-repository';
import { PROJECT as ionicThemeIos27En } from '../projects/docs/src/app/generated/projects/ionic-theme-ios27.en.generated';
import { PROJECT as ionicThemeIos27Ja } from '../projects/docs/src/app/generated/projects/ionic-theme-ios27.ja.generated';
import { PROJECT as nativeUiEn } from '../projects/docs/src/app/generated/projects/capacitor-native-ui.en.generated';
import { PROJECT as nativeUiJa } from '../projects/docs/src/app/generated/projects/capacitor-native-ui.ja.generated';
import { PROJECT as ionicThemeIos26En } from '../projects/docs/src/app/generated/projects/ionic-theme-ios26.en.generated';
import { PROJECT as ionicThemeIos26Ja } from '../projects/docs/src/app/generated/projects/ionic-theme-ios26.ja.generated';
import { PROJECT as ionicThemeMd3En } from '../projects/docs/src/app/generated/projects/ionic-theme-md3.en.generated';
import { PROJECT as ionicThemeMd3Ja } from '../projects/docs/src/app/generated/projects/ionic-theme-md3.ja.generated';

function installedVersion(packageName: string): string {
  return (
    JSON.parse(
      readFileSync(new URL(`../node_modules/${packageName}/package.json`, import.meta.url), 'utf8'),
    ) as { version: string }
  ).version;
}

function yamlTitle(markdown: string): string {
  const frontMatter = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  assert.ok(frontMatter, 'rule markdown must include YAML front matter');
  const title = frontMatter[1].match(/^title:\s*(.+)\s*$/m)?.[1]?.trim();
  assert.ok(title, 'rule markdown must declare a YAML title');
  return title;
}

function fencedCodeBlocks(markdown: string): { language: string; body: string }[] {
  const blocks: { language: string; body: string }[] = [];
  const pattern = /^```([^\n`]*)\r?\n([\s\S]*?)^```/gm;
  for (const match of markdown.matchAll(pattern)) {
    const normalized = normalizeTranslationCode(match[0]);
    blocks.push({ language: match[1], body: normalized.slice(normalized.indexOf('\n') + 1, -3) });
  }
  return blocks;
}

async function englishGuideSource(
  project: {
    repositoryUrl: string;
    englishDocsRef?: string;
    packageName: string;
    sourceDirectory: string;
    pages?: readonly { file: string; localEnglishSource?: boolean }[];
  },
  file: string,
): Promise<string> {
  if (project.pages?.some((page) => page.file === file && page.localEnglishSource)) {
    return readFile(
      new URL(`../projects/docs/src/${project.sourceDirectory}/docs/${file}`, import.meta.url),
      'utf8',
    );
  }
  const { content } = await fetchEnglishProjectMarkdown(project, file);
  if (file === 'readme.md' || file === 'getting-started.md') {
    return normalizePackageMarkdown(extractPackageReadme(content));
  }
  return normalizePackageMarkdown(stripLeadingH1(stripRdlaboDocsOmit(content)));
}

test('pins every documentation source to the installed package version', async () => {
  const packageJson = JSON.parse(
    await readFile(new URL('../package.json', import.meta.url), 'utf8'),
  ) as {
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
  };

  for (const project of projectDefinitions) {
    if (project.hostedUrl) continue;
    if (project.englishDocsRef) {
      assert.match(
        project.englishDocsRef,
        /^(?:[0-9a-f]{40}|v\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?)$/,
        `${project.id} English docs ref must be immutable`,
      );
    }
    const declaredVersion =
      packageJson.dependencies?.[project.packageName] ??
      packageJson.devDependencies?.[project.packageName];
    assert.ok(declaredVersion, `${project.packageName} must be a package dependency`);
    assert.match(declaredVersion, /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/);

    const installedPackage = JSON.parse(
      await readFile(
        new URL(`../node_modules/${project.packageName}/package.json`, import.meta.url),
        'utf8',
      ),
    ) as { version: string };
    assert.equal(installedPackage.version, declaredVersion);
  }
});

test('serves locale-specific static 404 pages', async () => {
  const [english, japanese] = await Promise.all([
    readFile(new URL('../projects/docs/public/404.html', import.meta.url), 'utf8'),
    readFile(new URL('../projects/docs/public/ja/404.html', import.meta.url), 'utf8'),
  ]);
  assert.match(english, /<html lang="en">/);
  assert.match(japanese, /<html lang="ja">/);
  assert.match(japanese, /href="\/ja"/);
  assert.doesNotMatch(japanese, /href="\/ja\/"/);
});

test('lists ionic theme packages and pins localized README imports', async () => {
  const expectedProjects = new Map([
    [
      'ionic-theme-ios26',
      {
        packageName: '@rdlabo/ionic-theme-ios26',
        version: installedVersion('@rdlabo/ionic-theme-ios26'),
      },
    ],
    [
      'ionic-theme-ios27',
      {
        packageName: '@rdlabo/ionic-theme-ios27',
        version: installedVersion('@rdlabo/ionic-theme-ios27'),
      },
    ],
    [
      'ionic-theme-md3',
      {
        packageName: '@rdlabo/ionic-theme-md3',
        version: installedVersion('@rdlabo/ionic-theme-md3'),
      },
    ],
  ]);
  const packageJson = JSON.parse(
    await readFile(new URL('../package.json', import.meta.url), 'utf8'),
  ) as {
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
  };
  const packageVersions = {
    ...packageJson.dependencies,
    ...packageJson.devDependencies,
  };

  for (const [projectId, expected] of expectedProjects) {
    const project = projectDefinitions.find((entry) => entry.id === projectId);
    assert.ok(project, `${projectId} must be declared in the manifest`);
    assert.equal(project.packageName, expected.packageName);
    assert.equal(project.category, 'frontend-tools');
    assert.equal(project.icon, 'theme');
    assert.equal(project.adapter, 'markdown');

    const declaredVersion = packageVersions[expected.packageName];
    assert.equal(declaredVersion, expected.version);
    const installedPackage = JSON.parse(
      await readFile(
        new URL(`../node_modules/${expected.packageName}/package.json`, import.meta.url),
        'utf8',
      ),
    ) as { version: string };
    assert.equal(installedPackage.version, expected.version);

    const docsRoot = new URL(`../projects/docs/src/${projectId}/docs/`, import.meta.url);
    if (projectId !== 'ionic-theme-ios27') {
      const apiPage = project.pages.find((page) => page.file === 'api.md');
      assert.ok(apiPage, `${projectId} must declare an API page`);
      const [englishApi, japaneseApi] = await Promise.all([
        englishGuideSource(project, 'api.md'),
        readFile(new URL('ja/api.md', docsRoot), 'utf8'),
      ]);
      for (const [locale, markdown] of [
        ['en', englishApi],
        ['ja', japaneseApi],
      ] as const) {
        const escapedPackage = expected.packageName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        assert.match(
          markdown,
          new RegExp(`\`${escapedPackage}\`\\s+v${expected.version}\\b`),
          `${projectId} ${locale} api.md must pin the installed ${expected.packageName} v${expected.version}`,
        );
      }
    }
    const pageFiles = project.pages.map((page) => page.file).filter((file) => file !== 'api.md');
    for (const pageFile of pageFiles) {
      const [english, japanese] = await Promise.all([
        englishGuideSource(project, pageFile),
        readFile(new URL(`ja/${pageFile}`, docsRoot), 'utf8'),
      ]);
      assert.deepEqual(
        fencedCodeBlocks(japanese),
        fencedCodeBlocks(english),
        `${projectId}/${pageFile} non-comment code must match byte-for-byte between EN and JA`,
      );
      for (const markdown of [english, japanese]) {
        assert.doesNotMatch(markdown, new RegExp(['rdlabo', 'team'].join('-')));
        assert.doesNotMatch(markdown, new RegExp(`${projectId}/(?:blob|tree)/main`));
        if (pageFile === 'readme.md' && projectId !== 'ionic-theme-ios27') {
          const generated =
            projectId === 'ionic-theme-ios26'
              ? [ionicThemeIos26En, ionicThemeIos26Ja]
              : [ionicThemeMd3En, ionicThemeMd3Ja];
          for (const localized of generated) {
            assert.match(
              localized.overviewHtml,
              new RegExp(
                `raw\\.githubusercontent\\.com/webview-native-ui/${project.repositoryUrl.split('/').at(-1)}/${project.releaseTagPrefix ?? 'v'}${expected.version}/screenshots/`,
              ),
            );
          }
        }
        for (const link of markdown.matchAll(
          new RegExp(
            `https://github\\.com/webview-native-ui/${projectId}/(?:blob|tree)/[^\\s)\\]]+`,
            'g',
          ),
        )) {
          assert.ok(
            link[0].includes(`/${project.releaseTagPrefix ?? 'v'}${expected.version}/`) ||
              (projectId === 'ionic-theme-ios27' && link[0].endsWith('/tree/ios27-v1.2.1')),
            `${projectId} source link must use v${expected.version}: ${link[0]}`,
          );
        }
      }
    }
  }

  const iosProject = projectDefinitions.find((entry) => entry.id === 'ionic-theme-ios26');
  assert.ok(iosProject);
  const usingPage = iosProject.pages.find((entry) => entry.slug === 'using-ion-item-group');
  assert.ok(usingPage);
  assert.equal(usingPage.title.en, 'Using ion-item-group');
  assert.equal(usingPage.title.ja, 'ion-item-groupの使用方法');
  assert.notEqual(usingPage.title.ja, usingPage.title.en);
  assert.match(usingPage.title.ja, /[\u3040-\u30ff\u4e00-\u9fff]/);

  const [iosReadme, _iosReadmeJa, usingDoc, usingDocJa, iosMigration, iosMigrationJa] =
    await Promise.all([
      englishGuideSource(iosProject, 'readme.md'),
      readFile(
        new URL('../projects/docs/src/ionic-theme-ios26/docs/ja/readme.md', import.meta.url),
        'utf8',
      ),
      englishGuideSource(iosProject, 'using-ion-item-group.md'),
      readFile(
        new URL(
          '../projects/docs/src/ionic-theme-ios26/docs/ja/using-ion-item-group.md',
          import.meta.url,
        ),
        'utf8',
      ),
      englishGuideSource(iosProject, 'migration.md'),
      readFile(
        new URL('../projects/docs/src/ionic-theme-ios26/docs/ja/migration.md', import.meta.url),
        'utf8',
      ),
    ]);
  const iosExpected = expectedProjects.get('ionic-theme-ios26');
  assert.ok(iosExpected);
  assert.match(
    iosReadme,
    /\]\(https:\/\/webview-native-ui\.com\/projects\/ionic-theme-ios26\/docs\/using-ion-item-group\)/,
  );
  assert.match(iosReadme, /npm install @rdlabo\/ionic-theme-ios26/);
  assert.match(await englishGuideSource(iosProject, 'setup.md'), /ios26ThemeConfig/);

  assert.equal(yamlTitle(usingDocJa), 'ion-item-groupの使用方法');
  assert.notEqual(yamlTitle(usingDocJa), usingPage.title.en);
  assert.match(yamlTitle(usingDocJa), /[\u3040-\u30ff\u4e00-\u9fff]/);
  if (/^---\r?\n[\s\S]*?\r?\n---/.test(usingDoc)) {
    assert.equal(yamlTitle(usingDoc), 'Using ion-item-group');
  } else {
    assert.equal(usingPage.title.en, 'Using ion-item-group');
  }
  assert.doesNotMatch(usingDocJa, /^# /m);
  assert.match(usingDoc, /wrap its items in `ion-item-group`/);
  for (const markdown of [iosMigration, iosMigrationJa]) {
    assert.match(markdown, /\.header-item-group/);
    assert.match(markdown, /\.item-group-header/);
  }
});

test('shows ionic theme README picks on project Overviews, not Getting Started', () => {
  for (const [project, screenshot] of [
    [ionicThemeIos26En, 'screenshots/ios26.png'],
    [ionicThemeIos26Ja, 'screenshots/ios26.png'],
    [ionicThemeMd3En, 'screenshots/md3.png'],
    [ionicThemeMd3Ja, 'screenshots/md3.png'],
  ] as const) {
    assert.match(project.overviewHtml, new RegExp(screenshot.replace('.', '\\.')));
    const gettingStarted = project.pages.find((page) => page.slug === 'readme');
    assert.ok(gettingStarted);
    assert.doesNotMatch(gettingStarted.html, new RegExp(screenshot.replace('.', '\\.')));
  }
});

test('separates iOS 26 and iOS 27 documentation, source branches, and screenshots', () => {
  for (const project of [ionicThemeIos27En, ionicThemeIos27Ja]) {
    assert.equal(project.version, installedVersion(project.packageName));
    assert.equal(project.demoUrl, 'https://ionic-theme-ios27.rdlabo.dev/');
    assert.equal(
      project.releaseNotesUrl,
      `https://github.com/webview-native-ui/ionic-theme-ios27/releases/tag/ios27-v${project.version}`,
    );
    assert.ok((project.overviewHtml.match(/<img /g) ?? []).length > 0);
    assert.doesNotMatch(project.overviewHtml, /&lt;img|src="\.\//);
    const images = new JSDOM(project.overviewHtml).window.document.querySelectorAll('img');
    for (const image of images) {
      const definition = projectDefinitions.find(({ id }) => id === project.id)!;
      assert.ok(
        image.src.includes(
          `/${definition.englishDocsAssetsRef ?? `ios27-v${project.version}`}/screenshots/`,
        ),
      );
    }
    assert.ok(!project.pages.some((page) => page.slug === 'ios-adaptive'));
  }
  const oldGuide = ionicThemeIos26En.pages.find((page) => page.slug === 'migration');
  const newGuide = ionicThemeIos27En.pages.find((page) => page.slug === 'migration');
  assert.match(oldGuide!.editUrl, /\/edit\/ios26\/docs\/migration\.md$/);
  assert.equal(
    newGuide!.editUrl,
    'https://github.com/webview-native-ui/docs/edit/main/projects/docs/src/ionic-theme-ios27/docs/migration.md',
  );
  assert.doesNotMatch(newGuide!.html, /Cordova-bundled theme/);
  assert.match(newGuide!.html, /href="\/projects\/ionic-theme-ios26\/docs\/migration"/);
});

test('publishes separate theme and Native UI guides with current package APIs', () => {
  for (const [theme, native, prefix] of [
    [ionicThemeIos27En, nativeUiEn, ''],
    [ionicThemeIos27Ja, nativeUiJa, '/ja'],
  ] as const) {
    assert.equal(theme.version, installedVersion('@rdlabo/ionic-theme-ios27'));
    assert.equal(native.version, installedVersion('@rdlabo/capacitor-native-ui'));
    assert.equal(native.packageName, '@rdlabo/capacitor-native-ui');
    assert.equal(native.repositoryUrl, 'https://github.com/webview-native-ui/capacitor-plugin');
    if (!prefix) {
      const definition = projectDefinitions.find(
        (project) => project.id === 'capacitor-native-ui',
      )!;
      for (const page of native.pages) {
        const local = definition.pages.find(
          (entry) => entry.slug === page.slug,
        )?.localEnglishSource;
        const expected = local
          ? 'https://github.com/webview-native-ui/docs/edit/main/projects/docs/src/capacitor-native-ui/docs/'
          : 'https://github.com/webview-native-ui/capacitor-plugin/edit/main/';
        assert.ok(page.editUrl.startsWith(expected), `${page.slug}: ${page.editUrl}`);
      }
    }
    assert.equal(native.pages.find((page) => page.slug === 'native-ui')!.title, 'Native UI');
    assert.doesNotMatch(native.description, /Preview|プレビュー/);
    assert.ok(
      !theme.pages.some((page) =>
        ['native-ui-shell', 'vertical-bars', 'iphone-duo'].includes(page.slug),
      ),
    );
    const layout = theme.pages.find((page) => page.slug === 'vertical-bars-layout')!;
    assert.match(layout.html, /setVerticalBarsLayout/);
    assert.match(layout.html, /applyFoldStateClasses/);
    const setup = native.pages.find((page) => page.slug === 'ionic-vertical-bars')!;
    assert.match(setup.html, /enableNativeUI/);
    assert.match(setup.html, /layoutChange/);
    const deviceSetup = native.pages.find((page) => page.slug === 'device-layout')!;
    assert.match(deviceSetup.html, /resolveVerticalBarsLayout/);
    assert.match(deviceSetup.html, /layoutChange/);
    assert.ok(
      setup.html.includes(`href="${prefix}/projects/ionic-theme-ios27/docs/vertical-bars-layout`),
    );
    assert.ok(
      layout.html.includes(`href="${prefix}/projects/capacitor-native-ui/docs/ionic-vertical-bars`),
    );
    assert.match(
      native.pages.find((page) => page.slug === 'framework-independent')!.html,
      /@rdlabo\/capacitor-native-ui\/core/,
    );
    for (const project of [theme, native]) {
      for (const guide of project.pages) {
        if (guide.slug !== 'migration') {
          assert.doesNotMatch(guide.html, /@rdlabo\/ionic-theme-ios27\/(?:native|vertical-bars)/);
        }
        const document = new JSDOM(guide.html).window.document;
        for (const link of document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]')) {
          const fragment = decodeURIComponent(link.getAttribute('href')!.slice(1));
          assert.ok(
            Array.from(document.querySelectorAll('[id]')).some(
              (element) => decodeURIComponent(element.id) === fragment,
            ),
            `${project.id}/${guide.slug}: missing local anchor ${fragment}`,
          );
        }
      }
    }
  }
});

test('imported portal links stay in the current tab', () => {
  const html = ionicThemeIos27En.pages.map((page) => page.html).join('');
  assert.doesNotMatch(
    html,
    /href="https:\/\/docs\.rdlabo\.dev\/projects\/(?:ionic-theme-ios27|ionic-theme-ios26|ionic-theme-md3|capacitor-native-ui|webview-native-ui-engine)(?:[/?#"])/,
  );
  for (const tag of html.match(/<a\b[^>]*href="\/projects\/[^>]*>/g) ?? []) {
    assert.doesNotMatch(tag, /target="_blank"/);
  }
  assert.match(html, /href="\/projects\/ionic-theme-ios26\/docs\/migration"/);
});

test('Native UI Japanese guides preserve the released executable examples', async () => {
  const project = projectDefinitions.find((entry) => entry.id === 'capacitor-native-ui')!;
  assert.equal(project.category, 'plugins');
  for (const page of project.pages) {
    const [english, japanese] = await Promise.all([
      englishGuideSource(project, page.file),
      readFile(`projects/docs/src/capacitor-native-ui/docs/ja/${page.file}`, 'utf8'),
    ]);
    assert.deepEqual(
      fencedCodeBlocks(japanese),
      fencedCodeBlocks(english),
      `${page.file}: preserve non-comment code`,
    );
  }
});

test('Engine guides keep shared source images and localized navigation in every language', async () => {
  const definition = projectDefinitions.find(
    (project) => project.id === 'webview-native-ui-engine',
  );
  assert.ok(definition);
  assert.equal(
    new Set(definition.pages.map((page) => page.file.toLowerCase())).size,
    definition.pages.length,
    'Engine source paths must be distinct on case-insensitive filesystems',
  );
  assert.equal(
    new Set(definition.pages.map((page) => page.slug.toLowerCase())).size,
    definition.pages.length,
    'Engine prerendered routes must be distinct on case-insensitive filesystems',
  );
  const version = installedVersion(definition.packageName);
  const sourceRef = definition.englishDocsRef ?? `v${version}`;
  for (const locale of ['en', 'ja', 'fr', 'de']) {
    const { PROJECT: project } = await import(
      `../projects/docs/src/app/generated/projects/webview-native-ui-engine.${locale}.generated.ts`
    );
    const prefix = locale === 'en' ? '' : `/${locale}`;
    const page = project.pages.find((entry: { slug: string }) => entry.slug === 'readme');
    const dom = new JSDOM(page.html);
    assert.equal(
      dom.window.document.querySelector('img')?.getAttribute('src'),
      `https://raw.githubusercontent.com/webview-native-ui/engine/${sourceRef}/docs/assets/hero.png`,
    );
    for (const slug of ['overview', 'concepts', 'getting-started/initialization', 'maintenance']) {
      assert.ok(
        dom.window.document.querySelector(
          `a[href="${prefix}/projects/webview-native-ui-engine/docs/${slug}"]`,
        ),
        `${locale}: ${slug} remains inside the selected language`,
      );
    }
    dom.window.close();
    const documents = new Map<string, JSDOM>(
      project.pages.map((entry: { slug: string; html: string }) => [
        entry.slug,
        new JSDOM(entry.html),
      ]),
    );
    const routePrefix = `${prefix}/projects/webview-native-ui-engine/docs/`;
    for (const [slug, document] of documents) {
      for (const link of document.window.document.querySelectorAll('a[href]')) {
        const href = link.getAttribute('href')!;
        if (!href.startsWith(routePrefix)) continue;
        const [target, fragment] = href.slice(routePrefix.length).split('#');
        const destination = documents.get(target);
        assert.ok(destination, `${locale}: ${slug} links to published ${target}`);
        if (fragment) {
          assert.ok(
            destination.window.document.getElementById(decodeURIComponent(fragment)),
            `${locale}: ${slug} has valid fragment ${href}`,
          );
        }
      }
    }
    for (const document of documents.values()) document.window.close();
  }
});

test('old Engine guide URLs permanently redirect to the reorganized guides in every language', async () => {
  const redirects = await readFile(
    new URL('../projects/docs/public/_redirects', import.meta.url),
    'utf8',
  );
  for (const prefix of ['', '/ja', '/fr', '/de']) {
    for (const [oldSlug, newSlug] of [
      ['capacitor-plugin', 'getting-started/capacitor'],
      ['cordova-plugin', 'getting-started/cordova'],
      ['projection-containers', 'reference/containers'],
      ['projection', 'reference/projection'],
    ]) {
      const base = `${prefix}/projects/webview-native-ui-engine/docs/`;
      assert.ok(
        redirects.includes(`${base}${oldSlug} https://webview-native-ui.com${base}${newSlug} 301`),
      );
    }
  }
});

test('all published internal document links resolve within this standalone site', async () => {
  const paths = new Set<string>();
  const documents: { name: string; html: string }[] = [];
  for (const locale of ['en', 'ja', 'fr', 'de']) {
    const prefix = locale === 'en' ? '' : `/${locale}`;
    paths.add(prefix);
    paths.add(`${prefix}/support`);
    paths.add(`${prefix}/standard-setup`);
    for (const chapter of GUIDE_CHAPTERS) paths.add(`${prefix}/guides/${chapter.id}`);
    const { STANDARD_SETUP } =
      await import('../projects/docs/src/app/generated/standard-setup.generated');
    documents.push({
      name: `standard-setup/${locale}`,
      html: STANDARD_SETUP[locale as keyof typeof STANDARD_SETUP].html,
    });
    const { GUIDE_CONTENT } =
      await import('../projects/docs/src/app/generated/guide-content.generated');
    for (const chapter of GUIDE_CHAPTERS) {
      documents.push({
        name: `guides/${chapter.id}/${locale}`,
        html: GUIDE_CONTENT[chapter.id][locale].html,
      });
    }

    for (const definition of projectDefinitions) {
      const { PROJECT } = await import(
        `../projects/docs/src/app/generated/projects/${definition.id}.${locale}.generated.ts`
      );
      paths.add(`${prefix}${PROJECT.path}`);
      paths.add(`${prefix}/${PROJECT.id}`);
      documents.push({ name: `${definition.id}/${locale}/overview`, html: PROJECT.overviewHtml });
      for (const page of PROJECT.pages) {
        paths.add(`${prefix}${page.path}`);
        paths.add(`${prefix}/${PROJECT.id}/docs/${page.slug}`);
        documents.push({ name: `${definition.id}/${locale}/${page.slug}`, html: page.html });
      }
    }
  }
  for (const document of documents) {
    const dom = new JSDOM(document.html);
    for (const link of dom.window.document.querySelectorAll<HTMLAnchorElement>('a[href^="/"]')) {
      const path = new URL(
        link.getAttribute('href')!,
        'https://webview-native-ui.com',
      ).pathname.replace(/\/$/, '');
      assert.ok(paths.has(path), `${document.name}: unresolved link ${link.getAttribute('href')}`);
    }
    dom.window.close();
  }
});

test('standard setup uses public CSS presets and one shared iOS initializer', async () => {
  const { build } = await import('esbuild');
  const { transpileModule, ModuleKind, JsxEmit } = await import('typescript');
  const { runInNewContext } = await import('node:vm');
  const ios = { mode: 'ios', navAnimation: () => 'native-synchronized-animation' };
  const md = { mode: 'md', navAnimation: () => 'md-animation' };
  for (const locale of ['en', 'ja', 'fr', 'de']) {
    const source = await readFile(`projects/docs/src/guides/${locale}/standard-setup.md`, 'utf8');
    assert.doesNotMatch(
      source,
      /meta.load-css|CSS.supports|ios26ThemeConfig|ios26TransitionAnimation|withNativeUITransition|npm install --save-dev sass/,
    );
    const css = completedSetup('angular', locale).files['src/global.css'];
    assert.ok(css);
    const bundled = await build({
      stdin: { contents: css, loader: 'css', resolveDir: process.cwd() },
      bundle: true,
      write: false,
      metafile: true,
    });
    const output = bundled.outputFiles[0].text;
    assert.doesNotMatch(output, /@import\s/);
    assert.match(output, /@supports \(not \(overflow-anchor: auto\)\)/);
    assert.match(output, /@supports \(overflow-anchor: auto\)/);
    assert.match(output, /prefers-color-scheme:\s*dark/);
    assert.match(output, /ios-theme-vertical-bars/);
    for (const preset of [
      'ionic-theme-ios26/dist/styles/system.css',
      'ionic-theme-ios27/dist/styles/system.css',
      'ionic-theme-md3/dist/styles/theme.css',
    ]) {
      assert.ok(
        Object.keys(bundled.metafile.inputs).some((path) => path.endsWith(preset)),
        `${locale}: ${preset}`,
      );
    }
    const appearanceCss = applyTutorial(
      'appearance',
      'angular',
      completedSetup('angular', locale).files,
      { locale },
    ).files['src/global.css'];
    const manual = await build({
      stdin: { contents: appearanceCss, loader: 'css', resolveDir: process.cwd() },
      bundle: true,
      write: false,
      metafile: true,
    });
    const inputs = Object.keys(bundled.metafile.inputs);
    assert.ok(
      !inputs.some((path) => /ionic-theme-ios(?:26|27)\/dist\/styles\/class.css$/.test(path)),
    );
    const manualInputs = Object.keys(manual.metafile.inputs);
    for (const theme of ['ios26', 'ios27']) {
      assert.ok(
        manualInputs.some((path) => path.endsWith(`ionic-theme-${theme}/dist/styles/class.css`)),
      );
      assert.ok(
        !manualInputs.some((path) => path.endsWith(`ionic-theme-${theme}/dist/styles/system.css`)),
      );
    }
    assert.doesNotMatch(source, /Ionic 8|@ionic\/angular\/standalone/);
    const snippets = (['angular', 'react', 'vue'] as const).map((framework) => {
      const entry = tutorialBaselines().frameworks[framework].setupEntry;
      return completedSetup(framework, locale).files[entry];
    });
    assert.equal(snippets.length, 3, `${locale}: complete Angular, React and Vue examples`);
    for (const snippet of snippets) {
      const script = transpileModule(`${snippet}\nglobalThis.selected = ionicConfig;`, {
        fileName: 'example.tsx',
        compilerOptions: { module: ModuleKind.CommonJS, jsx: JsxEmit.ReactJSX },
      }).outputText;
      for (const platform of ['ios', 'android', 'web']) {
        const calls: unknown[] = [];
        const packages: Record<string, unknown> = {
          '@capacitor/core': { Capacitor: { getPlatform: () => platform } },
          '@angular/router': { provideRouter: (routes: unknown) => routes },
          '@angular/common/http': { provideHttpClient: () => 'existing-http-provider' },
          './app.routes': { routes: ['existing-route'] },
          'react-dom/client': { createRoot: () => ({ render: () => 'existing-root' }) },
          'react/jsx-runtime': { jsx: () => 'existing-app' },
          './App': { default: () => 'existing-app' },
          './global.css': {},
          './router': { __esModule: true, default: { isReady: () => Promise.resolve() } },
          '@rdlabo/ionic-theme-ios27': { ios27ThemeConfig: ios },
          '@rdlabo/ionic-theme-md3': { md3ThemeConfig: md },
          '@ionic/angular': {
            provideIonicAngular: (options: unknown) => {
              calls.push(options);
              return options;
            },
          },
          '@ionic/react': { setupIonicReact: (options: unknown) => calls.push(options) },
          '@ionic/vue': { IonicVue: 'IonicVue' },
          vue: {
            createApp: () => ({
              use: (plugin: unknown, options: unknown) => {
                if (plugin === 'IonicVue') calls.push(options);
              },
              mount: () => 'mounted',
            }),
          },
          './App.vue': { default: {} },
        };
        const context = {
          exports: {},
          require: (name: string) => {
            assert.ok(name in packages, name);
            return packages[name];
          },
          document: { getElementById: () => ({}) },
          selected: undefined as typeof ios | undefined,
        };
        runInNewContext(script, context);
        const expected = platform === 'ios' ? ios : md;
        assert.equal(context.selected, expected);
        assert.deepEqual(calls, [expected], `${locale}: Ionic initializes exactly once`);
      }
    }
  }
});

test('task examples change the Web UI and keep a single startup', async () => {
  const { transpileModule, ModuleKind, ScriptTarget, JsxEmit } = await import('typescript');
  const { runInNewContext } = await import('node:vm');
  const setupState = completedSetup('angular');
  const codeBlocks = async (name: string) => {
    const examples = new Map<string, { language: string; filename: string; code: string }>();
    for (const framework of ['angular', 'react', 'vue'] as const) {
      const base = completedSetup(framework);
      const state = name === 'standard-setup' ? base : applyTutorial(name, framework, base.files);
      for (const change of state.changes) {
        const filename = change.block.filename!;
        const extension = filename.split('.').at(-1)!;
        const language =
          extension === 'kt' ? 'kotlin' : extension === 'gradle' ? 'groovy' : extension;
        examples.set(filename, {
          language: `${language}:${filename}`,
          filename,
          code: state.files[filename],
        });
      }
    }
    return [...examples.values()];
  };
  const execute = (code: string, context: Record<string, unknown>) => {
    const javascript = transpileModule(code, {
      fileName: 'example.tsx',
      compilerOptions: {
        module: ModuleKind.CommonJS,
        target: ScriptTarget.ES2022,
        jsx: JsxEmit.ReactJSX,
      },
    }).outputText;
    return runInNewContext(`(async () => { ${javascript} })()`, context) as Promise<void>;
  };
  const diagnosticStartupCode = setupState.changes.find((change) =>
    change.after.includes('Object.assign(window'),
  )!.after;
  const appearance = await codeBlocks('appearance');
  const { enableDynamicColors } = await import('@rdlabo/ionic-theme-md3/dynamic-colors');
  const paletteDocument = new JSDOM('<html><body></body></html>');
  const root = paletteDocument.window.document.documentElement;
  root.style.setProperty('--ion-color-primary', '#123456');
  const light = {
    primary: '#6750a4',
    secondary: '#625b71',
    tertiary: '#7d5260',
    error: '#b3261e',
    surface: '#fffbfe',
    onSurface: '#1c1b1f',
  };
  const dark = {
    primary: '#d0bcff',
    secondary: '#ccc2dc',
    tertiary: '#efb8c8',
    error: '#f2b8b5',
    surface: '#1c1b1f',
    onSurface: '#e6e1e5',
  };
  let available = true;
  let systemDark = false;
  const nativeScheme = () =>
    available
      ? { available: true as const, systemDark, light, dark }
      : { available: false as const, systemDark };
  let readGate: Promise<ReturnType<typeof nativeScheme>> | undefined;
  let invalidate: () => void = () => undefined;
  let controllers = 0;
  let realController: Awaited<ReturnType<typeof enableDynamicColors>> | undefined;
  const preferenceModules: Record<string, unknown> = {
    '@capacitor/core': { Capacitor: { getPlatform: () => 'web' } },
    '@rdlabo/capacitor-native-ui': {
      getDynamicColorScheme: () => readGate ?? Promise.resolve(nativeScheme()),
      addDynamicColorListener: async (listener: () => void) => {
        invalidate = listener;
        return { remove: async () => undefined };
      },
    },
    '@rdlabo/ionic-theme-md3/dynamic-colors': {
      enableDynamicColors: async (options: Parameters<typeof enableDynamicColors>[0]) => {
        controllers++;
        realController = await enableDynamicColors({
          ...options,
          document: paletteDocument.window.document,
        });
        return realController;
      },
    },
    '@erkamyaman/capacitor-foldable': { Foldable: {} },
    '@rdlabo/capacitor-native-ui/integration': {},
    '@rdlabo/ionic-theme-ios27': {},
  };
  const appearanceStartup = applyTutorial('appearance', 'angular', setupState.files).files[
    'src/native-ui.ts'
  ];
  type Preferences = { deviceColors: boolean; dark: boolean };
  const prefExports = {} as {
    startNativeUI(): Promise<void>;
    getAppearancePreferences(): Preferences;
    setAppearancePreferences(patch: Partial<Preferences>): Promise<void>;
  };
  await execute(appearanceStartup, {
    exports: prefExports,
    require: (name: string) => preferenceModules[name],
    console,
    matchMedia: () => ({ matches: systemDark }),
  });
  await prefExports.startNativeUI();
  const preferenceSnapshot = () => ({ ...prefExports.getAppearancePreferences() });
  assert.deepEqual(preferenceSnapshot(), { deviceColors: true, dark: false });
  const checkPalette = (deviceColors: boolean, darkMode: boolean) => {
    assert.equal(root.classList.contains('ion-palette-dark'), darkMode);
    assert.equal(root.style.getPropertyValue('color-scheme'), darkMode ? 'dark' : 'light');
    assert.equal(
      root.style.getPropertyValue('--ion-color-primary').toLowerCase(),
      deviceColors && available ? (darkMode ? dark.primary : light.primary) : '#123456',
    );
  };
  for (const deviceColors of [false, true]) {
    await prefExports.setAppearancePreferences({ deviceColors });
    for (const dark of [false, true]) {
      await prefExports.setAppearancePreferences({ dark });
      assert.deepEqual(preferenceSnapshot(), { deviceColors, dark });
      checkPalette(deviceColors, dark);
    }
  }
  const flush = () => new Promise<void>((resolve) => setImmediate(resolve));
  await prefExports.setAppearancePreferences({ deviceColors: false, dark: false });
  systemDark = true;
  invalidate();
  await flush();
  checkPalette(false, false);
  await prefExports.setAppearancePreferences({ dark: false });
  systemDark = false;
  invalidate();
  await flush();
  checkPalette(false, false);
  // An unavailable palette does not change the user's selected preference.
  available = false;
  await prefExports.setAppearancePreferences({ deviceColors: true, dark: true });
  checkPalette(true, true);
  assert.equal(preferenceSnapshot().deviceColors, true);
  available = true;
  await prefExports.setAppearancePreferences({ deviceColors: false, dark: false });
  let releaseRead!: (value: ReturnType<typeof nativeScheme>) => void;
  readGate = new Promise((resolve) => {
    releaseRead = resolve;
  });
  const enable = prefExports.setAppearancePreferences({ deviceColors: true });
  await flush();
  const disable = prefExports.setAppearancePreferences({ deviceColors: false });
  const enableAgain = prefExports.setAppearancePreferences({ deviceColors: true });
  const changeMode = prefExports.setAppearancePreferences({ dark: true });
  releaseRead(nativeScheme());
  await Promise.all([enable, disable, enableAgain, changeMode]);
  readGate = undefined;
  assert.deepEqual(preferenceSnapshot(), { deviceColors: true, dark: true });
  checkPalette(true, true);
  // A final OFF while a shared refresh is pending restores the original colors.
  readGate = new Promise((resolve) => {
    releaseRead = resolve;
  });
  const off = prefExports.setAppearancePreferences({ deviceColors: false });
  await flush();
  const lightMode = prefExports.setAppearancePreferences({ dark: false });
  releaseRead(nativeScheme());
  await Promise.all([off, lightMode]);
  readGate = undefined;
  checkPalette(false, false);
  assert.equal(controllers, 1);

  const angular = { Component: () => (target: unknown) => target };
  interface PreferenceNode {
    type: string;
    props: Record<string, any>;
  }
  const preferenceJsx = (type: string, props: Record<string, any>): PreferenceNode => ({
    type,
    props,
  });
  const fields = (element: PreferenceNode): PreferenceNode[] => {
    const children = Array.isArray(element.props?.children)
      ? element.props.children
      : [element.props?.children];
    return [
      element,
      ...children
        .filter((child): child is PreferenceNode => !!child && typeof child === 'object')
        .flatMap(fields),
    ];
  };
  for (const framework of ['angular', 'react', 'vue']) {
    await prefExports.setAppearancePreferences({ deviceColors: true, dark: false });
    const block = appearance.find((block) =>
      block.language.includes(
        framework === 'angular'
          ? 'appearance.page.ts'
          : framework === 'react'
            ? 'Appearance.tsx'
            : 'Appearance.vue',
      ),
    )!;
    assert.ok(block.code.includes('Use device colors'));
    assert.ok(block.code.includes('Dark mode'));
    assert.ok(block.code.includes('otherwise uses theme colors'));
    assert.ok(!block.code.includes('<button'));
    assert.ok(!block.code.includes('<select'));
    assert.ok(!block.code.includes('<option'));
    assert.equal((block.code.match(/<(?:ion-toggle|IonToggle)\b/g) ?? []).length, 2);
    assert.equal((block.code.match(/<(?:ion-item|IonItem)\b/g) ?? []).length, 2);
    assert.ok(!/<(?:ion-list|IonList|input)\b/.test(block.code));
    for (let visit = 0; visit < 2; visit++) {
      const output: Record<string, any> = {};
      let localState: Preferences | undefined;
      const effects: (() => void)[] = [];
      const modelSignal = (initial: Preferences) => {
        let value = initial;
        const read = () => value;
        read.set = (next: Preferences) => {
          value = next;
          for (const effect of effects) effect();
        };
        return read;
      };
      const modules: Record<string, unknown> = {
        '../native-ui': prefExports,
        './native-ui': prefExports,
        '@angular/core': {
          Component: angular.Component,
          signal: modelSignal,
          effect: (callback: () => void) => {
            effects.push(callback);
            callback();
          },
        },
        '@angular/forms/signals': { form: () => ({}), FormField: class {} },
        '@ionic/react': { IonItem: 'IonItem', IonToggle: 'IonToggle' },
        '@ionic/vue': { IonItem: 'ion-item', IonToggle: 'ion-toggle' },
        '@ionic/angular': { IonItem: class {}, IonToggle: class {} },
        react: {
          useState: (initial: () => Preferences) => {
            localState ??= initial();
            return [
              localState,
              (update: (current: Preferences) => Preferences) => {
                localState = update(localState!);
              },
            ];
          },
        },
        'react/jsx-runtime': { jsx: preferenceJsx, jsxs: preferenceJsx },
        vue: { reactive: (value: Preferences) => value },
      };
      const code =
        framework === 'vue'
          ? block.code.match(/<script setup lang="ts">([\s\S]*?)<\/script>/)![1] +
            '\nexports.preferences = preferences; exports.updateDeviceColors = updateDeviceColors; exports.updateDark = updateDark;'
          : block.code;
      await execute(code, { exports: output, require: (name: string) => modules[name], console });
      const expected = preferenceSnapshot();
      const next =
        visit === 0 ? { deviceColors: false, dark: true } : { deviceColors: true, dark: false };
      if (framework === 'angular') {
        assert.ok(block.code.includes('[formField]="fields.deviceColors"'));
        assert.ok(block.code.includes('[formField]="fields.dark"'));
        const page = new output.AppearancePage();
        assert.deepEqual({ ...page.model() }, expected);
        page.model.set({ ...page.model(), deviceColors: next.deviceColors });
        page.model.set({ ...page.model(), dark: next.dark });
        assert.deepEqual({ ...page.model() }, next);
      } else if (framework === 'react') {
        const controls = () => fields(output.default());
        const checkbox = () => controls().filter((node) => node.type === 'IonToggle')[0];
        const darkCheckbox = () => controls().filter((node) => node.type === 'IonToggle')[1];
        assert.equal(checkbox().props.checked, expected.deviceColors);
        assert.equal(darkCheckbox().props.checked, expected.dark);
        checkbox().props.onIonChange({ detail: { checked: next.deviceColors } });
        assert.equal(darkCheckbox().props.checked, expected.dark);
        darkCheckbox().props.onIonChange({ detail: { checked: next.dark } });
        assert.equal(checkbox().props.checked, next.deviceColors);
        assert.equal(darkCheckbox().props.checked, next.dark);
      } else {
        assert.ok(block.code.includes(':checked="preferences.deviceColors"'));
        assert.ok(block.code.includes(':checked="preferences.dark"'));
        assert.deepEqual({ ...output.preferences }, expected);
        output.updateDeviceColors({ detail: { checked: next.deviceColors } });
        output.updateDark({ detail: { checked: next.dark } });
        assert.deepEqual({ ...output.preferences }, next);
      }
      await flush();
      assert.deepEqual(preferenceSnapshot(), next);
      checkPalette(next.deviceColors, next.dark);
    }
  }
  assert.equal(controllers, 1);
  await realController!.destroy();
  assert.equal(root.style.getPropertyValue('--ion-color-primary'), '#123456');
  paletteDocument.window.close();

  // iOS system bars follow the chosen app appearance, including initial restoration.
  const systemBarStyles: string[] = [];
  const iosModes: string[] = [];
  let iosSystemDark = true;
  let nativePlatform = 'ios';
  const iosModules = {
    ...preferenceModules,
    '@capacitor/core': {
      Capacitor: { getPlatform: () => nativePlatform },
      SystemBarsStyle: { Dark: 'DARK', Light: 'LIGHT' },
      SystemBars: {
        setStyle: async ({ style }: { style: string }) => {
          systemBarStyles.push(style);
        },
      },
    },
    '@rdlabo/capacitor-native-ui': {
      ...(preferenceModules['@rdlabo/capacitor-native-ui'] as object),
      enableNativeUI: async () => ({}),
    },
    '@rdlabo/ionic-theme-md3/dynamic-colors': {
      enableDynamicColors: async ({ mode }: { mode: string }) => {
        iosModes.push(mode);
        return { setMode: (next: string) => iosModes.push(next), refresh: async () => undefined };
      },
    },
    '@erkamyaman/capacitor-foldable': {
      Foldable: { addListener: async () => ({ remove: async () => undefined }) },
    },
    '@rdlabo/capacitor-native-ui/integration': { resolveVerticalBarsLayout: async () => ({}) },
    '@rdlabo/ionic-theme-ios27': { setVerticalBarsLayout: () => undefined },
  };
  const iosExports = {} as typeof prefExports;
  await execute(appearanceStartup, {
    exports: iosExports,
    require: (name: string) => iosModules[name as keyof typeof iosModules],
    console,
    matchMedia: () => ({ matches: iosSystemDark }),
  });
  await iosExports.startNativeUI();
  assert.deepEqual(systemBarStyles, ['DARK']);
  assert.deepEqual(iosModes, ['dark']);
  await iosExports.setAppearancePreferences({ dark: false });
  assert.equal(systemBarStyles.at(-1), 'LIGHT'); // OS stays dark.
  iosSystemDark = false;
  await iosExports.setAppearancePreferences({ dark: true });
  assert.equal(systemBarStyles.at(-1), 'DARK'); // OS stays light.
  await iosExports.setAppearancePreferences({ deviceColors: false });
  assert.equal(systemBarStyles.at(-1), 'DARK');
  const iosCalls = systemBarStyles.length;
  for (nativePlatform of ['android', 'web'])
    await iosExports.setAppearancePreferences({ dark: false });
  assert.equal(systemBarStyles.length, iosCalls, 'preserve Android/Web system-bar handling');

  const extensions = await codeBlocks('extensions');
  for (const filename of [
    'ios/App/App/CounterView.swift',
    'android/app/src/main/java/com/example/app/App.kt',
    'android/build.gradle',
    'android/app/build.gradle',
  ]) {
    assert.ok(
      extensions.find((block) => block.filename === filename),
      `Native extension registration: ${filename}`,
    );
  }
  assert.ok(
    extensions
      .find((block) => block.filename.endsWith('/App.kt'))!
      .code.includes('NativeUI.register'),
  );
  assert.ok(
    extensions
      .find((block) => block.filename.endsWith('/CounterView.swift'))!
      .code.includes('NativeUI.register'),
  );
  interface CounterDefinition {
    read(element: HTMLElement): {
      props: { count: number };
      actions: { increment: HTMLButtonElement };
    };
  }
  const counterExports = {} as { counter: CounterDefinition };
  await execute(extensions.find((block) => block.filename === 'src/native-ui/counter.ts')!.code, {
    exports: counterExports,
    require: () => ({ defineNativeUI: (definition: CounterDefinition) => definition }),
  });
  for (const framework of ['angular', 'react', 'vue'] as const) {
    const filename = tutorialBaselines().frameworks[framework].counterPage!;
    const component = extensions.find((block) => block.filename === filename)!;
    const output: Record<string, any> = {};
    let reactCount: number | undefined;
    const numberSignal = (initial: number) => {
      let value = initial;
      const read = () => value;
      read.update = (update: (value: number) => number) => {
        value = update(value);
      };
      return read;
    };
    const ion = Object.fromEntries(
      ['IonPage', 'IonHeader', 'IonToolbar', 'IonTitle', 'IonContent'].map((name) => [name, name]),
    );
    const modules: Record<string, unknown> = {
      '@angular/core': { Component: angular.Component, signal: numberSignal },
      '@ionic/angular': ion,
      '@ionic/react': ion,
      '@ionic/vue': ion,
      react: {
        useState: (initial: number) => {
          reactCount ??= initial;
          return [
            reactCount,
            (update: (value: number) => number) => {
              reactCount = update(reactCount!);
            },
          ];
        },
      },
      'react/jsx-runtime': { jsx: preferenceJsx, jsxs: preferenceJsx },
      vue: { ref: (value: number) => ({ value }) },
    };
    const code =
      framework === 'vue'
        ? component.code.match(/<script setup lang="ts">([\s\S]*?)<\/script>/)![1] +
          '\nexports.count = count; exports.increment = increment;'
        : component.code;
    await execute(code, { exports: output, require: (name: string) => modules[name], console });
    let count: () => number;
    let increment: () => void;
    if (framework === 'angular') {
      assert.ok(component.code.includes('[attr.data-count]="count()"'));
      assert.ok(component.code.includes('(click)="increment()"'));
      const page = new output.CounterPage();
      count = () => page.count();
      increment = () => page.increment();
    } else if (framework === 'react') {
      const counter = () =>
        fields(output.default()).find((node) => node.props?.['data-counter'] !== undefined)!;
      count = () => Number(counter().props['data-count']);
      increment = () =>
        fields(counter())
          .find((node) => node.type === 'button')!
          .props.onClick();
    } else {
      assert.ok(component.code.includes(':data-count="count"'));
      assert.ok(component.code.includes('@click="increment"'));
      count = () => output.count.value;
      increment = () => output.increment();
    }
    // Controlled rendering feeds the documented DOM contract into the real reader.
    const document = new JSDOM(
      '<div data-counter><p data-count-label></p><button type="button">Increment</button></div>',
    );
    const source = document.window.document.querySelector<HTMLElement>('[data-counter]')!;
    const sync = () => {
      source.dataset.count = String(count());
      source.querySelector('[data-count-label]')!.textContent = `Count: ${count()}`;
    };
    source.querySelector('button')!.onclick = () => {
      increment();
      sync();
    };
    sync();
    for (let click = 0; click < 2; click++)
      counterExports.counter.read(source).actions.increment.click();
    assert.equal(counterExports.counter.read(source).props.count, 2, framework);
    assert.equal(source.querySelector('[data-count-label]')!.textContent, 'Count: 2');
    counterExports.counter.read(source).actions.increment.disabled = true;
    counterExports.counter.read(source).actions.increment.click();
    assert.equal(count(), 2);
    document.window.close();
  }

  for (const isExtension of [false, true]) {
    for (const platform of ['ios', 'android', 'web']) {
      const calls = { colors: 0, native: 0, layout: 0 };
      let layout: { edge: string | null; inset?: number } = { edge: null };
      let layoutChanged: (() => void) | undefined;
      const appliedLayouts: unknown[] = [];
      const modules: Record<string, unknown> = {
        '@capacitor/core': { Capacitor: { getPlatform: () => platform } },
        '@rdlabo/capacitor-native-ui': {
          enableNativeUI: (options?: { extensions?: unknown[] }) => {
            assert.equal(
              options?.extensions?.[0],
              isExtension ? counterExports.counter : undefined,
            );
            calls.native++;
            return Promise.resolve({ getStatus: () => ({ state: 'native', projected: 2 }) });
          },
          getDynamicColorScheme: () => Promise.resolve({ available: false, systemDark: false }),
          addDynamicColorListener: () => Promise.resolve({ remove: () => Promise.resolve() }),
        },
        '@erkamyaman/capacitor-foldable': {
          Foldable: {
            addListener: (_event: string, listener: () => void) => {
              layoutChanged = listener;
              calls.layout++;
              return Promise.resolve({ remove: () => Promise.resolve() });
            },
          },
        },
        '@rdlabo/capacitor-native-ui/integration': {
          resolveVerticalBarsLayout: () => Promise.resolve({ ...layout }),
        },
        '@rdlabo/ionic-theme-ios27': {
          setVerticalBarsLayout: (value: unknown) => appliedLayouts.push(value),
        },
        '@rdlabo/ionic-theme-md3/dynamic-colors': {
          enableDynamicColors: () => {
            calls.colors++;
            return Promise.resolve({});
          },
        },
      };
      modules['./native-ui/counter'] = { counter: counterExports.counter };
      const inspectionWindow = {} as {
        inspectNativeUI?: () => { state: string; projected: number };
      };
      const startupExports = {} as { startNativeUI(): Promise<void> };
      await execute(
        isExtension
          ? extensions.find((block) => block.language === 'ts:src/native-ui.ts')!.code
          : diagnosticStartupCode,
        {
          window: inspectionWindow,
          exports: startupExports,
          require: (name: string) => modules[name],
          console,
        },
      );
      const first = startupExports.startNativeUI();
      const second = startupExports.startNativeUI();
      assert.equal(first, second);
      await first;
      await flush();
      if (platform === 'ios') {
        assert.deepEqual(appliedLayouts, [{ edge: null }], 'initial automatic layout');
        layout = { edge: 'trailing', inset: 80 };
        layoutChanged!();
        await flush();
        assert.deepEqual(appliedLayouts.at(-1), layout, 'layoutChange applies new spacing');
        layout = { edge: null };
        layoutChanged!();
        await flush();
        assert.deepEqual(appliedLayouts.at(-1), layout, 'layoutChange removes reserved spacing');
      } else assert.deepEqual(appliedLayouts, []);
      if (!isExtension && platform === 'ios') {
        assert.equal(inspectionWindow.inspectNativeUI?.().state, 'native');
        assert.equal(inspectionWindow.inspectNativeUI?.().projected, 2);
      } else assert.equal(inspectionWindow.inspectNativeUI, undefined);
      assert.deepEqual(calls, {
        colors: 1,
        native: platform === 'ios' || (isExtension && platform === 'android') ? 1 : 0,
        layout: platform === 'ios' ? 1 : 0,
      });
    }
  }
});
