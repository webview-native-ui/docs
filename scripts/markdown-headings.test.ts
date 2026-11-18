import assert from 'node:assert/strict';
import test from 'node:test';
import { JSDOM } from 'jsdom';
import {
  addHeadingAliases,
  normalizeImportedReadmeHeadings,
  restorePackageFragmentAnchors,
} from './markdown-headings';

test('keeps an old published fragment attached to a renamed heading', () => {
  const document = new JSDOM('<h2 id="initialize">initialize</h2>').window.document;
  const oldId = encodeURIComponent('初期化');
  addHeadingAliases(document, { [oldId]: 'initialize' }, 'terminal');
  assert.equal(document.getElementById(oldId)?.parentElement?.id, 'initialize');
  assert.equal(document.querySelector('h2')?.textContent, 'initialize');
  assert.equal(document.getElementById(oldId)?.getAttribute('aria-hidden'), 'true');
  assert.equal(document.getElementById(oldId)?.hasAttribute('data-docs-heading-alias'), true);
  assert.throws(
    () => addHeadingAliases(document, { missing: 'absent' }, 'terminal'),
    /missing alias target/,
  );
  assert.throws(
    () => addHeadingAliases(document, { initialize: 'initialize' }, 'terminal'),
    /duplicate alias/,
  );
  assert.throws(() => addHeadingAliases(document, [], 'terminal'), /must map old IDs/);
  assert.throws(() => addHeadingAliases(document, { old: 1 }, 'terminal'), /non-empty string IDs/);
});

test('removes the README title and preserves nested heading levels after another h1', () => {
  const document = new JSDOM(`
    <h1 id="package">Package</h1>
    <h2 id="install">Installation</h2>
    <h1 id="faq">FAQ</h1>
    <h2 id="question">Question</h2>
    <h3 id="detail">Detail</h3>
  `).window.document;

  normalizeImportedReadmeHeadings(document);

  const page = document.createElement('main');
  page.innerHTML = `<h1>Page title</h1>${document.body.innerHTML}`;
  assert.equal(page.querySelectorAll('h1').length, 1);
  assert.deepEqual(
    Array.from(page.querySelectorAll('h1, h2, h3, h4')).map((heading) => [
      heading.tagName,
      heading.id,
    ]),
    [
      ['H1', ''],
      ['H2', 'install'],
      ['H2', 'faq'],
      ['H3', 'question'],
      ['H4', 'detail'],
    ],
  );
});

test('restores empty legacy anchors without interpreting code samples or extra attributes', () => {
  const document = new JSDOM(
    '<li>&lt;a id="old"&gt;&lt;/a&gt;<a href="/new">New</a></li><p><code>&lt;a id="sample"&gt;&lt;/a&gt;</code></p><p>&lt;a id="other" title="extra"&gt;&lt;/a&gt;</p>',
  ).window.document;
  restorePackageFragmentAnchors(document);
  assert.equal(document.querySelector('li span')?.id, 'old');
  assert.equal(document.querySelector('li')?.textContent, 'New');
  assert.equal(document.getElementById('sample'), null);
  assert.equal(document.getElementById('other'), null);
});
