import { applyTutorial, completedSetup } from './tutorial-states';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import test from 'node:test';

test('appearance settings compile with Angular Signal Forms and strict template checking', () => {
  const component = applyTutorial('appearance', 'angular', completedSetup('angular').files).files[
    'src/app/appearance.page.ts'
  ];
  assert.ok(component);
  const directory = mkdtempSync(resolve('.appearance-example-'));
  try {
    mkdirSync(join(directory, 'app'));
    writeFileSync(join(directory, 'app/appearance.page.ts'), component);
    writeFileSync(
      join(directory, 'native-ui.ts'),
      `export type AppearancePreferences = { deviceColors: boolean; dark: boolean };
export declare function getAppearancePreferences(): AppearancePreferences;
export declare function setAppearancePreferences(patch: Partial<AppearancePreferences>): Promise<void>;
`,
    );
    writeFileSync(
      join(directory, 'tsconfig.json'),
      JSON.stringify({
        compilerOptions: {
          target: 'ES2022',
          module: 'ESNext',
          moduleResolution: 'Bundler',
          lib: ['ES2022', 'DOM'],
          strict: true,
          experimentalDecorators: true,
          skipLibCheck: true,
          noEmit: true,
          types: [],
        },
        angularCompilerOptions: { strictTemplates: true },
        files: ['app/appearance.page.ts', 'native-ui.ts'],
      }),
    );
    execFileSync(
      process.execPath,
      [
        resolve('node_modules/@angular/compiler-cli/bundles/src/bin/ngc.js'),
        '-p',
        join(directory, 'tsconfig.json'),
      ],
      { stdio: 'pipe' },
    );
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});
