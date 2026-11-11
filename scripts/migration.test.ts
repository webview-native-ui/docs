import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import test from 'node:test';
import { projectDefinitions } from './project-manifest';
import { SITE_CONFIG } from '../projects/docs/src/app/site-config';

test('the migration retains every original source and reviewed translation', async () => {
  const inventory = JSON.parse(await readFile('migration/source-inventory.json', 'utf8'));
  for (const id of inventory.projects)
    assert.ok(projectDefinitions.some((project) => project.id === id));
  assert.equal(SITE_CONFIG.origin, 'https://webview-native-ui.com');
  for (const file of inventory.files) {
    await access(file.path);
  }
});

test('all migrated languages point portal edit links at the new repository', async () => {
  for (const project of projectDefinitions) {
    for (const locale of ['en', 'ja', 'fr', 'de']) {
      const { PROJECT } = await import(
        `../projects/docs/src/app/generated/projects/${project.id}.${locale}.generated.ts`
      );
      for (const page of PROJECT.pages) {
        assert.ok(!page.editUrl.includes('rdlabo-dev/website'), page.editUrl);
        if (locale !== 'en')
          assert.ok(
            page.editUrl.startsWith('https://github.com/webview-native-ui/docs/edit/main/'),
            page.editUrl,
          );
      }
    }
  }
});

test('production config uses isolated Workers and the approved hostname', async () => {
  const config = await readFile('wrangler.jsonc', 'utf8');
  const agent = await readFile('wrangler.docs-agent-router.jsonc', 'utf8');
  assert.match(config, /"name": "webview-native-ui-docs"/);
  assert.doesNotMatch(config, /"binding": "ASSETS"/);
  assert.match(config, /"pattern": "webview-native-ui.com"/);
  assert.match(agent, /"name": "webview-native-ui-docs-agent-router"/);
  assert.ok(!agent.includes('"pattern": "docs.rdlabo.dev/'));
});
