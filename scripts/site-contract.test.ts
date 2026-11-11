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
    /\]\(https:\/\/docs\.rdlabo\.dev\/projects\/ionic-theme-ios26\/docs\/using-ion-item-group\)/,
  );
  assert.match(iosReadme, /ios26ThemeConfig/);

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
      `https://github.com/webview-native-ui/ionic-theme-ios27/releases/tag/v${project.version}`,
    );
    assert.ok((project.overviewHtml.match(/<img /g) ?? []).length > 0);
    assert.doesNotMatch(project.overviewHtml, /&lt;img|src="\.\//);
    const images = new JSDOM(project.overviewHtml).window.document.querySelectorAll('img');
    for (const image of images) {
      const definition = projectDefinitions.find(({ id }) => id === project.id)!;
      assert.ok(
        image.src.includes(
          `/${definition.englishDocsAssetsRef ?? `v${project.version}`}/screenshots/`,
        ),
      );
    }
    assert.ok(!project.pages.some((page) => page.slug === 'ios-adaptive'));
  }
  const oldGuide = ionicThemeIos26En.pages.find((page) => page.slug === 'migration');
  const newGuide = ionicThemeIos27En.pages.find((page) => page.slug === 'migration');
  assert.match(oldGuide!.editUrl, /\/edit\/ios26\/docs\/migration\.md$/);
  assert.match(newGuide!.editUrl, /\/edit\/main\/docs\/migration\.md$/);
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
      assert.ok(
        native.pages.every((page) =>
          page.editUrl.startsWith(
            'https://github.com/webview-native-ui/capacitor-plugin/edit/main/',
          ),
        ),
      );
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
    assert.match(setup.html, /resolveVerticalBarsLayout/);
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
  assert.equal(project.category, 'capacitor-plugins');
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
