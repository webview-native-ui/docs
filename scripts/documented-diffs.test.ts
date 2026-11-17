import assert from 'node:assert/strict';
import test from 'node:test';
import {
  applyDocumentedDiff,
  documentedCodeBlocks,
  repairDisplayDiffSpacing,
} from './documented-diffs';

test('documented changes retain unshown application code and verify every removed line', () => {
  const before = 'router();\nionic();\nhttp();\nrender();\n';
  const patch = '@@\n- ionic();\n+ ionic(config);\n http();';
  const after = applyDocumentedDiff(before, patch);
  assert.equal(after, 'router();\nionic(config);\nhttp();\nrender();\n');
  assert.throws(() => applyDocumentedDiff(after, patch), /found 0/);
  assert.throws(() => applyDocumentedDiff(before, '+ anotherRuntime();'), /need context/);
  assert.throws(() => applyDocumentedDiff('same();\nsame();\n', ' same();\n+ extra();'), /found 2/);
});

test('temporary changes revert to the exact original file', () => {
  const baseline = 'await enableNativeUI();\n';
  const added = applyDocumentedDiff(
    baseline,
    '- await enableNativeUI();\n+ const shell = await enableNativeUI();\n+ inspect(shell);',
  );
  assert.equal(
    applyDocumentedDiff(
      added,
      '- const shell = await enableNativeUI();\n- inspect(shell);\n+ await enableNativeUI();',
    ),
    baseline,
  );
  assert.equal(applyDocumentedDiff('', '+ newFile();\n+ \n+ ready();'), 'newFile();\n\nready();\n');
});

test('code blocks retain filename, branch and exact hunk whitespace', () => {
  const blocks = documentedCodeBlocks(
    '## 1. Verify\n### Existing extensions\n```diff:src/native-ui.ts (extensions)\n old();\n+ new();\n```\n',
  );
  assert.deepEqual(blocks[0], {
    info: 'diff:src/native-ui.ts (extensions)',
    language: 'diff',
    filename: 'src/native-ui.ts',
    variant: 'extensions',
    section: '1. Verify',
    subsection: 'Existing extensions',
    code: ' old();\n+ new();',
  });
});

test('unbalanced example fences fail before a later diff is misread', () => {
  assert.throws(
    () => documentedCodeBlocks('npm install example\n```\n\n```diff:app.ts\n+ code\n```'),
    /without an opening/,
  );
});

test('diff markers require a separator and preserve the code indentation', () => {
  assert.equal(applyDocumentedDiff('  old();\n', '-   old();\n+   next();\n+ '), '  next();\n\n');
  assert.throws(() => applyDocumentedDiff('', '+code();'), /separator space/);
  assert.throws(() => applyDocumentedDiff('code();\n', '-code();'), /separator space/);
});

test('display diffs repair missing separators and retain code indentation', () => {
  const markdown =
    '```diff\n--- a/file\n+++ b/file\n@@\n+import Example;\n function run() {\n-    old();\n+    next();\n+\n }\n```';
  const expected = markdown
    .replace('+import Example;', '+ import Example;')
    .replace('\n+\n', '\n+ \n');
  assert.equal(repairDisplayDiffSpacing(markdown), expected);
  assert.equal(repairDisplayDiffSpacing(expected), expected);
  const patch = documentedCodeBlocks(expected)[0].code;
  assert.equal(
    applyDocumentedDiff('function run() {\n   old();\n}\n', patch),
    'import Example;\nfunction run() {\n   next();\n\n}\n',
  );
  assert.equal(repairDisplayDiffSpacing('```ts\n++count;\n```'), '```ts\n++count;\n```');
});
