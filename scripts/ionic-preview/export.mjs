import { cp, mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { join, posix } from 'node:path';
import { load } from 'cheerio';

// Upstream demos import the version's shared CSS and JS from different nesting depths.
export async function normalizeDemoImports(usage) {
  for (const file of await readdir(usage, { recursive: true })) {
    if (!file.endsWith('/demo.html')) continue;
    const path = join(usage, file);
    const original = await readFile(path, 'utf8');
    const normalized = original.replace(
      /((?:src|href)=["'])(?:\.\.\/)+(common\.(?:css|js))(?=["'])/g,
      (_, attr, name) => attr + posix.relative(posix.dirname(file), name),
    );
    if (normalized !== original) await writeFile(path, normalized);
  }
}

export async function exportPortalComponents(work, output, ref) {
  const assets = 'projects/docs/public/assets/ionic-components';
  await mkdir(assets, { recursive: true });
  await cp(join(work, 'LICENSE'), join(assets, 'LICENSE'));
  await cp(join(output, 'preview-assets'), join(assets, 'runtime'), { recursive: true });
  await cp(join(output, 'usage'), join(assets, 'usage'), {
    recursive: true,
    filter: (path) => !/\.mdx?$|\/v[678](?:\/|$)/.test(path),
  });
  await normalizeDemoImports(join(assets, 'usage/v9'));
  await exportArticles(work, output, ref);
}

export async function exportArticles(work, output, ref) {
  const modules = 'projects/docs/src/app/generated/ionic-components';
  await mkdir(modules, { recursive: true });
  const files = (await readdir(join(work, 'docs/api')))
    .filter((name) => name.endsWith('.mdx'))
    .sort();
  const catalog = [];
  for (const file of files) {
    const slug = file.slice(0, -4);
    const $ = load(await readFile(join(output, 'api', slug, 'index.html'), 'utf8'));
    const article = $('.theme-doc-markdown');
    const title = article.find('h1').first().text();
    if (!title) throw Error('Missing article: ' + slug);
    const description = $('meta[name=description]').attr('content') ?? '';
    article.find('header').first().remove();
    article.find('.hash-link,.encapsulation-pill,button,script,style').remove();
    article.find('pre code').each((_, code) => {
      const lines = $(code).children('.token-line');
      lines.children('br').remove();
      if (lines.length) $(code).html(lines.map((_, line) => $(line).html() ?? '').get().join('\n'));
    });
    article.find('a[href]').each((_, link) => {
      const href = $(link).attr('href');
      if (href.startsWith('/docs/api/'))
        $(link).attr('href', href.replace('/docs/api/', '/components/'));
      else if (href.startsWith('/docs/')) $(link).attr('href', 'https://ionicframework.com' + href);
    });
    article.find('img[src],source[src],video[src]').each((_, el) => {
      const src = $(el).attr('src');
      if (src.startsWith('/docs/')) $(el).attr('src', 'https://ionicframework.com' + src);
    });
    const blocks = [];
    for (const node of article.contents()) {
      const el = $(node);
      const src = el.attr('data-ionic-demo');
      if (src) {
        if (!/^usage\/v9\/[\w/-]+\/demo\.html$/.test(src))
          throw Error('Unexpected demo path: ' + src);
        const examples = el
          .find('[data-framework]')
          .map((_, group) => ({
            name: $(group).attr('data-framework'),
            files: $(group)
              .children()
              .map((_, item) => ({
                name: $(item).attr('data-filename'),
                html: $(item).find('pre code').html() ?? '',
              }))
              .get(),
          }))
          .get();
        blocks.push({
          kind: 'demo',
          src,
          examples,
          mode: el.attr('data-mode') ?? '',
          console: el.attr('data-console') !== undefined,
        });
      } else if (el.hasClass('tabs-container')) {
        const labels = el.find('> [role=tablist] > [role=tab]');
        const panels = el.find('> div > [role=tabpanel]');
        if (!panels.length || labels.length !== panels.length) throw Error('Incomplete tabs: ' + slug);
        blocks.push({kind:'tabs', panels: panels.map((i, panel) => ({
          label: labels.eq(i).text().replace(/^Javascript$/, 'JavaScript'),
          html: $(panel).html(),
        })).get()});
      } else if (/^h[2-6]$/.test(node.name ?? '')) {
        blocks.push({
          kind: 'heading',
          level: Number(node.name[1]),
          id: el.attr('id'),
          text: el.text(),
        });
      } else {
        const html = $.html(node);
        if (!html.trim() || node.type === 'comment') continue;
        if (blocks.at(-1)?.kind === 'html') blocks.at(-1).html += html;
        else blocks.push({ kind: 'html', html });
      }
    }
    if (article.find('[data-ionic-demo]').length !== blocks.filter((b) => b.kind === 'demo').length)
      throw Error('Nested demo: ' + slug);
    // Keep whole examples together while respecting the portal's JS chunk budget.
    const parts = [];
    let part = [];
    let bytes = 0;
    for (const block of blocks) {
      const size = Buffer.byteLength(JSON.stringify(block));
      if (part.length && bytes + size > 400_000) {
        parts.push(part);
        part = [];
        bytes = 0;
      }
      part.push(block);
      bytes += size;
    }
    parts.push(part);
    const imports = [];
    for (const [index, content] of parts.entries()) {
      const filename = slug + (index ? '.' + index : '') + '.json';
      await writeFile(join(modules, filename), JSON.stringify(content));
      imports.push(`import('./${filename}').then(m => m.default as unknown[])`);
    }
    const loadExpression = imports.length === 1 ? imports[0] : `Promise.all([${imports.join(',')}]).then(parts => parts.flat())`;
    catalog.push(`  { ...${JSON.stringify({slug,title,description})}, load: () => ${loadExpression} },`);
  }
  await writeFile(
    join(modules, 'catalog.ts'),
    `export const revision = '${ref}';\nexport const catalog = [\n${catalog.join('\n')}\n];\n`,
  );
}
