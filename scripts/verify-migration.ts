import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';

async function main(): Promise<void> {
  const inventory = JSON.parse(await readFile('migration/source-inventory.json', 'utf8')) as {
    files: { path: string; sha256: string }[];
  };
  for (const file of inventory.files) {
    const content = await readFile(file.path);
    assert.equal(createHash('sha256').update(content).digest('hex'), file.sha256, file.path);
  }
  console.log(`Verified ${inventory.files.length} original source files byte for byte.`);
}
void main();
