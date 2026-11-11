import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import test from 'node:test';
import { compileString } from 'sass';
import ts from 'typescript';

for (const [project, page] of [
  ['ionic-theme-ios27', 'vertical-bars-layout'],
  ['capacitor-native-ui', 'ionic-vertical-bars'],
  ['capacitor-native-ui', 'setup'],
  ['capacitor-native-ui', 'device-layout'],
]) {
  test(`${page} examples compile against the installed release`, () => {
    const markdown = readFileSync(
      resolve(`projects/docs/src/${project}/docs/ja/${page}.md`),
      'utf8',
    );
    // Keep temporary modules beside node_modules so package exports resolve normally.
    const directory = mkdtempSync(resolve('.iphone-duo-examples-'));
    try {
      let index = 0;
      const examples: string[] = [];
      for (const match of markdown.matchAll(/^```(ts|scss)\n([\s\S]*?)^```/gm)) {
        const [, language, code] = match;
        if (language === 'scss') {
          assert.doesNotThrow(() => compileString(code, { loadPaths: [resolve('node_modules')] }));
          continue;
        }
        // Cleanup fences continue the immediately preceding setup example.
        if (code.startsWith('await listener.remove();')) {
          assert.ok(examples.length > 0, 'Cleanup must follow a setup example');
          examples[examples.length - 1] += code;
        } else if (!code.includes('import ') && code.startsWith('setVerticalBarsLayout(')) {
          examples.push(
            "import { setVerticalBarsLayout } from '@rdlabo/ionic-theme-ios27';\n" + code,
          );
        } else if (!code.includes('import ') && code.includes('enableNativeUI(')) {
          // Appearance alternatives reuse the plugin import from the setup above.
          examples.push("import { enableNativeUI } from '@rdlabo/capacitor-native-ui';\n" + code);
        } else {
          examples.push(code);
        }
      }
      if (project === 'capacitor-native-ui') {
        const companion = readFileSync(
          resolve('projects/docs/src/capacitor-native-ui/docs/ja/device-layout.md'),
          'utf8',
        );
        const layoutModule = [...companion.matchAll(/^```ts\n([\s\S]*?)^```/gm)]
          .map((match) => match[1])
          .find((code) => code.includes('export async function connectDeviceLayout'))!;
        assert.ok(layoutModule, 'The device connection must use the documented module');
        writeFileSync(join(directory, 'device-layout.ts'), layoutModule);
        const service = [...companion.matchAll(/^```ts\n([\s\S]*?)^```/gm)]
          .map((match) => match[1])
          .find((code) => code.includes('export class VerticalBarsLayoutService'))!;
        assert.ok(service, 'The bootstrap must use the documented device-layout service');
        mkdirSync(join(directory, 'app'));
        writeFileSync(join(directory, 'app/vertical-bars-layout.service.ts'), service);
        // These application-owned files are supplied by the existing app, not the plugin.
        writeFileSync(join(directory, 'app/app.component.ts'), 'export class AppComponent {}');
        writeFileSync(
          join(directory, 'app/app.config.ts'),
          "import type { ApplicationConfig } from '@angular/core'; export const appConfig: ApplicationConfig = { providers: [] };",
        );
      }
      for (const code of examples) {
        const filename = join(
          directory,
          ...(code.includes("from '../device-layout'") ? ['app'] : []),
          `${index++}.mts`,
        );
        writeFileSync(filename, code);
        const program = ts.createProgram([filename], {
          target: ts.ScriptTarget.ES2022,
          module: ts.ModuleKind.ESNext,
          moduleResolution: ts.ModuleResolutionKind.Bundler,
          experimentalDecorators: true,
          strict: true,
          noEmit: true,
          skipLibCheck: true,
          types: [],
        });
        const diagnostics = ts.getPreEmitDiagnostics(program);
        assert.equal(
          diagnostics.length,
          0,
          ts.formatDiagnosticsWithColorAndContext(diagnostics, {
            getCanonicalFileName: (name) => name,
            getCurrentDirectory: () => process.cwd(),
            getNewLine: () => '\n',
          }),
        );
      }
      assert.ok(index > 0, 'Expected TypeScript examples');
    } finally {
      rmSync(directory, { recursive: true, force: true });
    }
  });
}
