import assert from 'node:assert/strict';
import test from 'node:test';
import legacyDomain, {
  CANONICAL_DOCS_ORIGIN,
  LEGACY_DOCS_HOST,
} from '../workers/legacy-domain-redirect.mjs';

test('the temporary launch hostname permanently redirects every locale and deep path without losing queries', async () => {
  for (const prefix of ['', '/ja', '/fr', '/de']) {
    for (const path of [
      '',
      '/',
      '/projects/webview-native-ui-engine/docs/getting-started/capacitor',
      '//example.com/path',
      '/%2F%2Fexample.com/path',
    ]) {
      const request = new Request(
        `https://${LEGACY_DOCS_HOST}${prefix}${path}?from=launch&next=https%3A%2F%2Fexample.com`,
      );
      const response = await legacyDomain.fetch(request);
      assert.equal(response.status, 301);
      const source = new URL(request.url);
      const destination = new URL(response.headers.get('Location')!);
      assert.equal(destination.pathname, source.pathname);
      assert.equal(destination.search, source.search);
      assert.equal(new URL(response.headers.get('Location')!).origin, CANONICAL_DOCS_ORIGIN);
    }
  }
});
