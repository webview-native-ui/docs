import { applyTutorial, completedSetup } from './tutorial-states';
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
  ['portal', 'standard-setup'],
  ['portal', 'extensions'],
]) {
  test(`${page} examples compile against the installed release`, () => {
    const markdown = readFileSync(
      resolve(
        project === 'portal'
          ? `projects/docs/src/guides/ja/${page}.md`
          : `projects/docs/src/${project}/docs/ja/${page}.md`,
      ),
      'utf8',
    );
    // Keep temporary modules beside node_modules so package exports resolve normally.
    const directory = mkdtempSync(resolve('.iphone-duo-examples-'));
    try {
      let index = 0;
      const examples: string[] = [];
      const portalState =
        project === 'portal'
          ? page === 'extensions'
            ? applyTutorial('extensions', 'angular', completedSetup('angular', 'ja').files, {
                locale: 'ja',
              })
            : completedSetup('angular', 'ja')
          : undefined;
      if (portalState) examples.push(portalState.files['src/native-ui.ts']);
      // The portal keeps its device wiring in a named shared startup module.
      // Framework configuration examples are exercised by the site contract tests.
      const pattern =
        project === 'portal'
          ? /^```(ts|scss)(?::src\/native-ui.ts)?\n([\s\S]*?)^```/gm
          : /^```(ts|scss)\n([\s\S]*?)^```/gm;
      for (const match of project === 'portal' ? [] : markdown.matchAll(pattern)) {
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
        mkdirSync(join(directory, 'app'));
        // These application-owned files are supplied by the existing app, not the plugin.
        writeFileSync(join(directory, 'app/app.component.ts'), 'export class AppComponent {}');
        writeFileSync(
          join(directory, 'app/app.config.ts'),
          "import type { ApplicationConfig } from '@angular/core'; export const appConfig: ApplicationConfig = { providers: [] };",
        );
      }
      if (project === 'portal' && page === 'extensions') {
        mkdirSync(join(directory, 'native-ui'));
        const definition = portalState!.files['src/native-ui/counter.ts'];
        assert.ok(definition, 'Extension startup imports the actual documented counter');
        writeFileSync(join(directory, 'native-ui/counter.ts'), definition);
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
