import assert from 'node:assert/strict';
import test from 'node:test';
import {
  applyTutorial,
  completedSetup,
  completedThemeSetup,
  initialTutorialFiles,
  tutorialBaselines,
  tutorialBlocks,
} from './tutorial-states';

const frameworks = ['angular', 'react', 'vue'] as const;
const locales = ['en', 'ja', 'fr', 'de'];
const guides = ['standard-setup', 'appearance', 'extensions', 'migration'];
const canonicalImports = (code: string) => {
  const lines = code.split('\n');
  return [
    ...lines.filter((line) => line.startsWith('import ')).sort(),
    ...lines.filter((line) => !line.startsWith('import ')),
  ].join('\n');
};

test('file changes use named diffs while terminal and console operations remain executable', () => {
  for (const locale of locales)
    for (const guide of guides) {
      const blocks = tutorialBlocks(guide, locale);
      assert.ok(blocks.length, `${locale}/${guide}`);
      for (const block of blocks) {
        assert.ok(
          ['diff', 'sh', 'js', 'text', 'json'].includes(block.language),
          `${locale}/${guide}: ${block.info}`,
        );
        if (block.language === 'diff') assert.ok(block.filename, `${guide}: target file`);
        if (block.language === 'sh')
          assert.ok(!/^\+.*(?:npm|npx)/m.test(block.code), `${guide}: executable command`);
        if (block.language === 'js')
          assert.match(
            block.code,
            /^(?:(?:typeof )?window\.inspectNativeUI|document\.querySelector)/,
          );
      }
    }
});

test('setup applies cumulatively to existing apps and removes its temporary inspection hook', () => {
  const source = tutorialBaselines();
  for (const locale of locales)
    for (const framework of frameworks) {
      const initial = initialTutorialFiles(framework);
      const state = completedSetup(framework, locale);
      const startupChanges = state.changes.filter(
        (change) => change.block.filename === 'src/native-ui.ts',
      );
      assert.equal(startupChanges.length, 3, `${locale}/${framework}: create, inspect, restore`);
      assert.equal(startupChanges[0].before, '');
      assert.match(startupChanges[1].after, /inspectNativeUI/);
      assert.equal(startupChanges[2].after, startupChanges[0].after);
      assert.equal(state.files['src/native-ui.ts'], startupChanges[0].after);
      assert.ok(!state.files['src/native-ui.ts'].includes('inspectNativeUI'));
      for (const [path, code] of Object.entries(initial)) {
        if (/routes?\.[jt]sx?$/.test(path))
          assert.equal(state.files[path], code, `${framework}: existing routes retained`);
      }
      const entry = state.files[source.frameworks[framework].setupEntry];
      if (framework === 'angular') {
        assert.match(entry, /provideRouter\(routes\)/);
        assert.match(entry, /provideHttpClient\(\)/);
      }
      if (framework === 'react')
        assert.match(
          entry,
          /createRoot\(document\.getElementById\('root'\)!\)\.render\(<App \/>\)/,
        );
      if (framework === 'vue') {
        assert.match(entry, /app\.use\(router\)/);
        assert.match(entry, /router\.isReady\(\)\.then/);
      }
    }
});

test('independent appearance and extension tasks preserve the configured startup', () => {
  for (const locale of locales)
    for (const framework of frameworks) {
      const baseline = completedSetup(framework, locale).files;
      const appearance = applyTutorial('appearance', framework, baseline, { locale }).files;
      const extensions = applyTutorial('extensions', framework, baseline, { locale }).files;
      const appearanceFirst = applyTutorial('extensions', framework, appearance, { locale }).files;
      const extensionsFirst = applyTutorial('appearance', framework, extensions, { locale }).files;
      assert.equal(
        canonicalImports(appearanceFirst['src/native-ui.ts']),
        canonicalImports(extensionsFirst['src/native-ui.ts']),
      );
      assert.match(appearanceFirst['src/native-ui.ts'], /getAppearancePreferences/);
      assert.match(appearanceFirst['src/native-ui.ts'], /preferences\.deviceColors/);
      assert.match(appearanceFirst['src/native-ui.ts'], /extensions: \[counter\]/);
      for (const start of [baseline, appearance, appearanceFirst]) {
        assert.equal((start['src/native-ui.ts'].match(/Foldable\.addListener/g) ?? []).length, 1);
      }
    }
});

test('migration edits the declared legacy starting state without adding another listener', () => {
  for (const locale of locales) {
    const baseline = tutorialBaselines().legacy.files;
    const result = applyTutorial('migration', 'angular', baseline, { locale }).files;
    assert.ok(!result['src/native-ui.ts'].includes('enableNativeUIShell'));
    assert.match(result['src/native-ui.ts'], /resolveVerticalBarsLayout/);
    assert.equal((result['src/native-ui.ts'].match(/Foldable\.addListener/g) ?? []).length, 1);
    assert.match(result['src/global.css'], /ionic-theme-ios27\/styles\/class\.css/);
  }
});

test('the new Android Application alternative starts from a project without an Application class', () => {
  const framework = 'angular';
  for (const locale of locales) {
    const start = applyTutorial(
      'standard-setup',
      framework,
      initialTutorialFiles(framework, { newApplication: true }),
      { locale },
    ).files;
    const result = applyTutorial('extensions', framework, start, {
      locale,
      newApplication: true,
    }).files;
    assert.match(result['android/app/src/main/java/com/example/app/App.kt'], /NativeUI.register/);
    assert.match(result['android/app/src/main/AndroidManifest.xml'], /android:name=".App"/);
  }
});

test('theme-only setup diffs preserve routers and require no native startup', () => {
  for (const locale of locales)
    for (const framework of frameworks)
      for (const theme of ['ios26', 'ios27', 'md3'] as const) {
        const state = completedThemeSetup(theme, framework, locale);
        const { setupEntry, files } = tutorialBaselines().frameworks[framework];
        assert.match(state.files[setupEntry], new RegExp(theme + 'ThemeConfig'));
        assert.ok(!state.files['src/native-ui.ts']);
        for (const path of Object.keys(files).filter((name) => /routes?\./.test(name)))
          assert.equal(state.files[path], files[path]);
      }
});

test('an Android-only setup does not add or remove the iOS verification hook', () => {
  for (const locale of locales)
    for (const framework of frameworks) {
      const state = completedSetup(framework, locale, { diagnostics: false });
      const edits = state.changes.filter((change) => change.block.filename === 'src/native-ui.ts');
      assert.equal(edits.length, 1, 'only create startup');
      assert.equal(
        state.files['src/native-ui.ts'],
        completedSetup(framework, locale).files['src/native-ui.ts'],
      );
    }
});

test('Kotlin-unconfigured Android projects acquire one version definition and retain other build configuration', () => {
  for (const locale of locales)
    for (const newApplication of [false, true]) {
      const initial = initialTutorialFiles('angular', { kotlinConfigured: false, newApplication });
      assert.doesNotMatch(initial['android/build.gradle'], /ext.kotlin_version/);
      const setup = applyTutorial('standard-setup', 'angular', initial, { locale }).files;
      const state = applyTutorial('extensions', 'angular', setup, {
        locale,
        kotlinConfigured: false,
        newApplication,
      });
      assert.equal(
        (state.files['android/build.gradle'].match(/ext.kotlin_version/g) ?? []).length,
        1,
      );
      assert.match(state.files['android/build.gradle'], /kotlin-gradle-plugin/);
      assert.match(state.files['android/build.gradle'], /compose-compiler-gradle-plugin/);
      assert.match(state.files['android/build.gradle'], /com.android.tools.build:gradle/);
      assert.match(
        state.files['android/app/src/main/java/com/example/app/App.kt'],
        /NativeUI.register/,
      );
    }
});

test('manual appearance switching is the only stage that changes system dark mode to class dark mode', () => {
  for (const locale of locales)
    for (const framework of frameworks) {
      const initial = initialTutorialFiles(framework);
      assert.match(initial['src/global.css'], /palettes\/dark.system.css/);
      const setup = completedSetup(framework, locale).files;
      assert.match(setup['src/global.css'], /ionic-theme-ios26\/styles\/system.css/);
      assert.match(setup['src/global.css'], /ionic-theme-ios27\/styles\/system.css/);
      assert.doesNotMatch(setup['src/global.css'], /styles\/class.css/);
      const appearance = applyTutorial('appearance', framework, setup, { locale });
      const cssChanges = appearance.changes.filter(
        (change) => change.block.filename === 'src/global.css',
      );
      assert.equal(cssChanges.length, 1);
      assert.equal(
        appearance.files['src/global.css'],
        setup['src/global.css'].replaceAll('/styles/system.css', '/styles/class.css'),
      );
      assert.doesNotMatch(
        appearance.files['src/global.css'],
        /palettes\/dark.system.css|styles\/system.css/,
      );
      for (const name of ['extensions']) {
        const other = applyTutorial(name, framework, setup, { locale });
        assert.equal(other.files['src/global.css'], setup['src/global.css']);
      }
    }
});
