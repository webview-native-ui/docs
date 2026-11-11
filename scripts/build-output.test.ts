import assert from 'node:assert/strict';
import { access, readdir, readFile, stat } from 'node:fs/promises';
import { join } from 'node:path';
import test from 'node:test';
import { gunzipSync } from 'node:zlib';
import { JSDOM } from 'jsdom';
import { DOCS_LOCALES, PUBLISHED_DOCS_LOCALES } from '../shared/docs-locales';
import { projectDefinitions } from './project-manifest';
import { PROJECTS_EN } from '../projects/docs/src/app/generated/project-catalog.generated';
import {
  CURRENT_SPONSORS,
  PAST_SPONSORS,
} from '../projects/docs/src/app/generated/sponsors.generated';

test('split theme and Native UI guides resolve localized links and heading fragments', async () => {
  const ids = ['ionic-theme-ios27', 'capacitor-native-ui', 'ionic-theme-md3'];
  for (const { subPath } of PUBLISHED_DOCS_LOCALES) {
    const prefix = subPath ? `/${subPath}` : '';
    const documents = new Map<string, Document>();
    for (const id of ids) {
      const project = projectDefinitions.find((entry) => entry.id === id)!;
      for (const page of project.pages) {
        const route = `${prefix}/projects/${id}/docs/${page.slug}`;
        documents.set(
          route,
          new JSDOM(await readFile(`dist/docs/browser${route}/index.html`, 'utf8')).window.document,
        );
      }
    }
    for (const [route, document] of documents) {
      for (const link of document.querySelectorAll<HTMLAnchorElement>('main a[href]')) {
        const url = new URL(link.getAttribute('href')!, `https://webview-native-ui.com${route}`);
        if (
          url.origin !== 'https://webview-native-ui.com' ||
          !ids.some((id) => url.pathname.includes(`/projects/${id}/docs/`))
        )
          continue;
        assert.ok(
          url.pathname.startsWith(`${prefix}/projects/`),
          `${route}: wrong locale ${url.href}`,
        );
        const target = documents.get(url.pathname.replace(/\/$/, ''));
        assert.ok(target, `${route}: missing guide ${url.href}`);
        if (url.hash) {
          const id = url.hash.slice(1);
          assert.ok(
            target.getElementById(id) || target.getElementById(decodeURIComponent(id)),
            `${route}: missing heading ${url.href}`,
          );
        }
      }
    }
  }
});

test('places locale-specific static 404 pages in the browser output', async () => {
  for (const locale of PUBLISHED_DOCS_LOCALES) {
    const root = join('dist/docs/browser', locale.subPath);
    const html = await readFile(join(root, '404.html'), 'utf8');
    assert.match(html, new RegExp(`<html lang="${locale.code}">`));
    for (const nested of DOCS_LOCALES.filter(({ subPath }) => subPath)) {
      if (locale.subPath || !nested.published) {
        await assert.rejects(access(join(root, nested.subPath)), { code: 'ENOENT' });
      }
    }
  }
});

test('prerenders current and past public sponsors in both locales', async () => {
  const [english, japanese] = await Promise.all([
    readFile(new URL('../dist/docs/browser/support/index.html', import.meta.url), 'utf8'),
    readFile(new URL('../dist/docs/browser/ja/support/index.html', import.meta.url), 'utf8'),
  ]);

  for (const html of [english, japanese]) {
    for (const sponsor of [...CURRENT_SPONSORS, ...PAST_SPONSORS]) {
      assert.match(html, new RegExp(`href="${sponsor.profileUrl}"`));
    }
    assert.match(html, /(?:Sponsor from \$5\/month|月5ドルから支援する)/);
    assert.doesNotMatch(html, /monthlyPriceInDollars/);
  }
  if (CURRENT_SPONSORS.length > 0) {
    assert.match(english, />Current sponsors</);
    assert.match(japanese, />現在のスポンサー</);
  }
  if (PAST_SPONSORS.length > 0) {
    assert.match(english, />Past sponsors</);
    assert.match(japanese, />過去のスポンサー</);
  }
});

test('Japanese home prerender uses slashless canonical SEO URLs and clear site navigation', async () => {
  const html = await readFile(
    new URL('../dist/docs/browser/ja/index.html', import.meta.url),
    'utf8',
  );
  assert.match(html, /rel="canonical" href="https:\/\/webview-native-ui\.com\/ja"/);
  assert.match(html, /property="og:url" content="https:\/\/webview-native-ui\.com\/ja"/);
  assert.match(html, /hreflang="ja" href="https:\/\/webview-native-ui\.com\/ja"/);
  assert.doesNotMatch(html, /rel="canonical" href="https:\/\/webview-native-ui\.com\/ja\/"/);
  assert.doesNotMatch(html, /property="og:url" content="https:\/\/webview-native-ui\.com\/ja\/"/);
  assert.doesNotMatch(html, /hreflang="ja" href="https:\/\/webview-native-ui\.com\/ja\/"/);
  assert.match(html, /<a(?=[^>]*\bclass="docs-brand[^"]*")(?=[^>]*\bhref="\/ja")[^>]*>/);
  assert.doesNotMatch(html, /<a[^>]*href="https:\/\/rdlabo\.dev\/"[^>]*target="_blank"[^>]*>/);
  assert.match(html, /class="docs-home-link[^"]*"[^>]*href="\/ja"/);
  assert.match(html, />docs</);
  assert.match(html, /(?:href="\/ja"[^>]*aria-current="page"|aria-current="page"[^>]*href="\/ja")/);
  assert.match(html, /data-rdlabo-json-ld/);
  assert.match(html, /"url":"https:\/\/webview-native-ui\.com\/ja"/);
  assert.match(html, /"inLanguage":"ja"/);
  assert.match(html, /"@type":"WebPage"/);
  assert.match(html, /"@id":"https:\/\/webview-native-ui\.com\/#website"/);
});

test('prerendered docs mark current location and hide empty search hosts', async () => {
  const [home, support, landing, docPage, japaneseLanding] = await Promise.all([
    readFile(new URL('../dist/docs/browser/index.html', import.meta.url), 'utf8'),
    readFile(new URL('../dist/docs/browser/support/index.html', import.meta.url), 'utf8'),
    readFile(
      new URL('../dist/docs/browser/projects/ionic-theme-md3/index.html', import.meta.url),
      'utf8',
    ),
    readFile(
      new URL(
        '../dist/docs/browser/projects/ionic-theme-md3/docs/migration/index.html',
        import.meta.url,
      ),
      'utf8',
    ),
    readFile(
      new URL('../dist/docs/browser/ja/projects/ionic-theme-md3/index.html', import.meta.url),
      'utf8',
    ),
  ]);

  assert.match(home, /(?:href="\/"[^>]*aria-current="page"|aria-current="page"[^>]*href="\/")/);
  assert.match(
    support,
    /(?:href="\/support"[^>]*aria-current="page"|aria-current="page"[^>]*href="\/support")/,
  );
  assert.match(
    landing,
    /(?:href="\/projects\/ionic-theme-md3"[^>]*aria-current="page"|aria-current="page"[^>]*href="\/projects\/ionic-theme-md3")/,
  );
  assert.match(
    docPage,
    /(?:href="\/projects\/ionic-theme-md3\/docs\/migration"[^>]*aria-current="page"|aria-current="page"[^>]*href="\/projects\/ionic-theme-md3\/docs\/migration")/,
  );
  assert.doesNotMatch(
    docPage,
    /href="\/projects\/ionic-theme-md3"(?![^>]*\/docs\/)[^>]*aria-current="page"|aria-current="page"[^>]*href="\/projects\/ionic-theme-md3"(?![^>]*\/docs\/)/,
  );
  assert.match(japaneseLanding, /関連記事（英語）/);
  assert.match(japaneseLanding, /related-article-lang[^>]*>英語</);
  assert.match(japaneseLanding, /lang="en"/);
  assert.doesNotMatch(landing, /関連記事（英語）/);
  const landingDom = new JSDOM(landing);
  assert.equal(landingDom.window.document.querySelector('.related-article-lang'), null);
  landingDom.window.close();

  const docsStyles = await readFile(
    new URL('../projects/docs/src/styles.css', import.meta.url),
    'utf8',
  );
  assert.match(docsStyles, /pagefind-modal-trigger\.docs-search:empty\s*\{\s*display:\s*none;/);
});

test('prerendered docs shell stays layout-neutral before bootstrap', async () => {
  const html = await readFile(new URL('../dist/docs/browser/index.html', import.meta.url), 'utf8');
  assert.match(html, /data-rdlabo-json-ld/);
  assert.match(html, /"@type":"WebSite"/);
  assert.match(html, /"url":"https:\/\/webview-native-ui\.com\/"/);
  const shell = html.match(/<div\b[^>]*\bclass="[^"]*\bdocs-shell\b[^"]*"[^>]*>/)?.[0];
  assert.ok(shell, 'docs-shell must be present in prerendered index.html');
  assert.doesNotMatch(shell, /\blayout-ready\b/);
  assert.match(shell, /lg:grid-cols-\[304px_minmax\(0,1fr\)\]/);

  const toggle = html.match(/<button\b[^>]*\baria-controls="docs-sidebar"[^>]*>/)?.[0];
  assert.ok(toggle, 'sidebar toggle must be present in prerendered index.html');
  assert.doesNotMatch(toggle, /\baria-expanded\b/);

  const sidebar = html.match(/<aside\b[^>]*\bid="docs-sidebar"[^>]*>/)?.[0];
  assert.ok(sidebar, 'docs-sidebar must be present in prerendered index.html');
  assert.match(sidebar, /lg:translate-x-0/);
  assert.doesNotMatch(sidebar, /\binert\b/);

  const css = await readFile(new URL('../projects/docs/src/app/app.css', import.meta.url), 'utf8');
  assert.match(
    css,
    /@media\s*\(\s*max-width:\s*1023px\s*\)[\s\S]*?\.docs-shell:not\(\.layout-ready\)\s+#docs-sidebar\s*\{[\s\S]*?visibility:\s*hidden;[\s\S]*?transform:\s*translateX\(-100%\);/,
  );
});

test('prerendered docs pages include breadcrumb JSON-LD with canonical HTTPS item URLs', async () => {
  const [docsPage, support] = await Promise.all([
    readFile(
      new URL(
        '../dist/docs/browser/projects/capacitor-native-ui/docs/readme/index.html',
        import.meta.url,
      ),
      'utf8',
    ),
    readFile(new URL('../dist/docs/browser/support/index.html', import.meta.url), 'utf8'),
  ]);

  assert.match(docsPage, /"@type":"BreadcrumbList"/);
  assert.match(docsPage, /"item":"https:\/\/webview-native-ui\.com\/"/);
  assert.match(
    docsPage,
    /"item":"https:\/\/webview-native-ui\.com\/projects\/capacitor-native-ui"/,
  );
  assert.match(
    docsPage,
    /"item":"https:\/\/webview-native-ui\.com\/projects\/capacitor-native-ui\/docs\/readme"/,
  );

  assert.match(support, /"@type":"BreadcrumbList"/);
  assert.match(support, /"item":"https:\/\/webview-native-ui\.com\/support"/);
});

test('visible docs breadcrumbs use canonical locale home paths', async () => {
  const [english, japanese] = await Promise.all([
    readFile(
      new URL(
        '../dist/docs/browser/projects/ionic-theme-md3/docs/migration/index.html',
        import.meta.url,
      ),
      'utf8',
    ),
    readFile(
      new URL(
        '../dist/docs/browser/ja/projects/ionic-theme-md3/docs/migration/index.html',
        import.meta.url,
      ),
      'utf8',
    ),
  ]);
  const englishBreadcrumb = english.match(
    /<nav[^>]*aria-label="Breadcrumb"[^>]*>[\s\S]*?<\/nav>/,
  )?.[0];
  const japaneseBreadcrumb = japanese.match(
    /<nav[^>]*aria-label="パンくずリスト"[^>]*>[\s\S]*?<\/nav>/,
  )?.[0];
  assert.ok(englishBreadcrumb);
  assert.ok(japaneseBreadcrumb);
  assert.match(englishBreadcrumb, /href="\/"/);
  assert.match(japaneseBreadcrumb, /href="\/ja"/);
  assert.doesNotMatch(japaneseBreadcrumb, /href="\/ja\/"/);
});

test('prerendered locales include reusable hydration data', async () => {
  const route = '/projects/capacitor-native-ui/docs/setup';
  const nestedRoute = '/projects/webview-native-ui-engine/docs/getting-started/capacitor';
  const pages = await Promise.all(
    PUBLISHED_DOCS_LOCALES.flatMap(({ subPath }) => {
      const prefix = subPath ? `${subPath}/` : '';
      return [
        [`${prefix}index.html`, '/'],
        [`${prefix}${route.slice(1)}/index.html`, route],
        [`${prefix}${nestedRoute.slice(1)}/index.html`, nestedRoute],
      ];
    }).map(async ([path, initialUrl]) => ({
      html: await readFile(new URL(`../dist/docs/browser/${path}`, import.meta.url), 'utf8'),
      initialUrl,
    })),
  );

  for (const { html, initialUrl } of pages) {
    assert.doesNotMatch(html, /\bngskiphydration\b/);
    assert.match(html, /\bngh="/);

    const serializedState = html.match(
      /<script id="ng-state" type="application\/json">([^<]+)<\/script>/,
    )?.[1];
    assert.ok(serializedState, 'prerendered page must include Angular hydration state');
    const state = JSON.parse(serializedState) as {
      __nghData__?: unknown[];
      'rdlabo-docs-initial-url'?: string;
    };
    const hydrationData = state.__nghData__;
    assert.ok(hydrationData?.length, 'Angular hydration state must include reusable views');
    assert.equal(state['rdlabo-docs-initial-url'], initialUrl);
  }
});

test('builds bounded search indexes for every published language with the component UI', async () => {
  const searchDirectory = new URL('../dist/docs/browser/pagefind/', import.meta.url);
  const files = await readdir(searchDirectory, { recursive: true });
  assert.ok(files.includes('pagefind-component-ui.js'));
  assert.ok(files.includes('pagefind-component-ui.css'));
  const canonicalPages = PROJECTS_EN.filter((project) => !project.hostedUrl).reduce(
    (count, project) => count + 1 + project.pages.length,
    2, // Home and support pages.
  );
  for (const { code } of PUBLISHED_DOCS_LOCALES) {
    assert.ok(
      files.some((file) => new RegExp(`^pagefind\\.${code}_.+\\.pf_meta$`).test(file)),
      code,
    );
    assert.equal(
      files.filter((file) => new RegExp(`^fragment/${code}_.+\\.pf_fragment$`).test(file)).length,
      canonicalPages,
      `${code} search index must contain only canonical pages`,
    );
  }
  const indexedNativeUiPages = new Map<
    string,
    { content: string; filters: Record<string, string[]>; meta?: { image?: string } }
  >();
  for (const file of files.filter(
    (file) => file.startsWith('fragment/') && file.endsWith('.pf_fragment'),
  )) {
    const json = gunzipSync(await readFile(join(searchDirectory.pathname, file)))
      .toString('utf8')
      .replace(/^pagefind_dcd/, '');
    const fragment = JSON.parse(json) as {
      url: string;
      content: string;
      filters: Record<string, string[]>;
    };
    if (/\/projects\/capacitor-native-ui(?:\/docs\/setup)?\/$/.test(fragment.url))
      indexedNativeUiPages.set(fragment.url, fragment);
  }
  for (const { subPath, code } of PUBLISHED_DOCS_LOCALES) {
    for (const page of ['', '/docs/setup']) {
      const prefix = subPath ? `${subPath}/` : '';
      const html = await readFile(
        `dist/docs/browser/${prefix}projects/capacitor-native-ui${page}/index.html`,
        'utf8',
      );
      const dom = new JSDOM(html);
      const config = dom.window.document.querySelector('pagefind-config');
      const trigger = dom.window.document.querySelector('pagefind-modal-trigger');
      assert.equal(config?.getAttribute('lang'), code);
      assert.ok(trigger && config && !!(config.compareDocumentPosition(trigger) & 4));
      const indexed = indexedNativeUiPages.get(`/${prefix}projects/capacitor-native-ui${page}/`);
      assert.ok(indexed, `${prefix}${page}: indexed canonical page`);
      assert.deepEqual(indexed.filters['project'], ['capacitor-native-ui']);
      assert.deepEqual(indexed.filters['category'], ['capacitor-plugins']);
      const sponsorAvatars = Array.from(
        dom.window.document.querySelectorAll('app-footer-sponsors img'),
        (image) => image.getAttribute('src'),
      );
      assert.ok(
        !sponsorAvatars.includes(indexed.meta?.image ?? ''),
        `${prefix}${page}: sponsor avatars must not become document search thumbnails`,
      );
      assert.doesNotMatch(
        indexed.content,
        /capacitor-plugins/,
        `${prefix}${page}: filter metadata must not pollute searchable content or excerpts`,
      );
      dom.window.close();
    }
  }
  const sizes = await Promise.all(
    files.map(async (file) => {
      const entry = await stat(join(searchDirectory.pathname, file));
      return entry.isFile() ? entry.size : 0;
    }),
  );
  assert.ok(
    // Aggregate of all four locales: 1,040 canonical pages, including seven new
    // Engine, Cordova, and color guides, currently produce about 6.009 MiB.
    sizes.reduce((total, size) => total + size, 0) < 6.1 * 1024 * 1024,
    'Search bundle must remain under 6.10 MiB across all published locales',
  );
});

test('ships the WebView Native UI brand in all four languages and static 404 pages', async () => {
  for (const { code, subPath } of PUBLISHED_DOCS_LOCALES) {
    const prefix = subPath ? `/${subPath}` : '';
    const root = join('dist/docs/browser', subPath);
    const home = new JSDOM(await readFile(join(root, 'index.html'), 'utf8'));
    assert.ok(home.window.document.title.includes('WebView Native UI'), code);
    assert.doesNotMatch(home.window.document.title, /Cloudflare|rdlabo/);
    const brand = home.window.document.querySelector<HTMLAnchorElement>('.docs-brand')!;
    assert.equal(brand.getAttribute('href'), prefix || '/');
    assert.equal(
      brand.querySelector('img')?.getAttribute('src'),
      '/assets/brand/webview-native-ui-logo.png',
    );
    assert.equal(
      home.window.document.querySelector('link[rel="icon"]')?.getAttribute('href'),
      '/assets/brand/webview-native-ui-logo.png',
    );
    assert.ok(
      home.window.document.querySelector('footer')?.textContent?.includes('WebView Native UI'),
      code,
    );
    assert.doesNotMatch(
      home.window.document.querySelector('footer')?.textContent ?? '',
      /rdlabo\.dev|association|一般社団法人/,
    );
    const missing = new JSDOM(await readFile(join(root, '404.html'), 'utf8'));
    assert.ok(missing.window.document.title.includes('WebView Native UI'), code);
    assert.equal(
      missing.window.document.querySelector('img')?.getAttribute('src'),
      '/assets/brand/webview-native-ui-logo.png',
    );
    home.window.close();
    missing.window.close();
  }
});
