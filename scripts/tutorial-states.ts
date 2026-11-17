import { readFileSync } from 'node:fs';
import {
  applyDocumentedDiff,
  documentedCodeBlocks,
  type DocumentedCodeBlock,
} from './documented-diffs';

export type TutorialFramework = 'angular' | 'react' | 'vue';
interface FrameworkBaseline {
  files: Record<string, string>;
  setupEntry: string;
  setupRoot: string;
  profilePage: string;
  appearancePage: string;
  counterPage?: string;
}
interface Baselines {
  frameworks: Record<TutorialFramework, FrameworkBaseline>;
  native: {
    files: Record<string, string>;
    newApplicationFiles?: Record<string, string>;
    kotlinUnconfiguredFiles?: Record<string, string>;
  };
  common?: { files: Record<string, string> };
  legacy: { files: Record<string, string> };
}
export function tutorialBaselines(): Baselines {
  return JSON.parse(
    readFileSync(new URL('./fixtures/guide-diff-baselines.json', import.meta.url), 'utf8'),
  ) as Baselines;
}
export function initialTutorialFiles(
  framework: TutorialFramework,
  options: { newApplication?: boolean; kotlinConfigured?: boolean } = {},
): Record<string, string> {
  const source = tutorialBaselines();
  return {
    ...source.frameworks[framework].files,
    ...(options.newApplication ? source.native.newApplicationFiles : source.native.files),
    ...(options.kotlinConfigured === false ? source.native.kotlinUnconfiguredFiles : {}),
    ...source.common?.files,
  };
}
export function tutorialBlocks(guide: string, locale = 'en'): DocumentedCodeBlock[] {
  return documentedCodeBlocks(
    readFileSync(`projects/docs/src/guides/${locale}/${guide}.md`, 'utf8'),
  );
}
export interface AppliedTutorialChange {
  readonly block: DocumentedCodeBlock;
  readonly before: string;
  readonly after: string;
  readonly files: Readonly<Record<string, string>>;
}
export function applyTutorial(
  guide: string,
  framework: TutorialFramework,
  initial: Record<string, string>,
  options: {
    locale?: string;
    extensions?: boolean;
    newApplication?: boolean;
    kotlinConfigured?: boolean;
    diagnostics?: boolean;
  } = {},
): { files: Record<string, string>; changes: AppliedTutorialChange[] } {
  return applyNamedDiffs(guide, tutorialBlocks(guide, options.locale), framework, initial, options);
}
function applyNamedDiffs(
  guide: string,
  blocks: DocumentedCodeBlock[],
  framework: TutorialFramework,
  initial: Record<string, string>,
  options: {
    extensions?: boolean;
    newApplication?: boolean;
    kotlinConfigured?: boolean;
    diagnostics?: boolean;
  },
): { files: Record<string, string>; changes: AppliedTutorialChange[] } {
  const files = { ...initial };
  const baselines = tutorialBaselines();
  const ownPaths = new Set(Object.keys(baselines.frameworks[framework].files));
  const otherPaths = new Set(
    Object.values(baselines.frameworks).flatMap((entry) => Object.keys(entry.files)),
  );
  const changes: AppliedTutorialChange[] = [];
  for (const block of blocks) {
    if (block.language !== 'diff') continue;
    if (!block.filename) throw new Error(`${guide}: a file-change diff requires a filename`);
    const path = block.filename;
    if (otherPaths.has(path) && !ownPaths.has(path)) continue;
    if (block.variant === 'new Application' && !options.newApplication) continue;
    if (block.variant === 'Kotlin configured' && options.kotlinConfigured === false) continue;
    if (block.variant === 'Kotlin not configured' && options.kotlinConfigured !== false) continue;
    if (block.variant === 'iOS verification' && options.diagnostics === false) continue;
    if (options.newApplication && path.endsWith('/App.kt') && !block.variant) continue;
    if (block.variant === 'extensions' && !options.extensions) continue;
    if (block.variant === 'standard' && options.extensions) continue;
    const before = files[path] ?? '';
    const after = applyDocumentedDiff(
      before,
      block.code,
      `${guide}/${framework}/${path}/${block.section}`,
    );
    files[path] = after;
    changes.push({ block, before, after, files: { ...files } });
  }
  return { files, changes };
}
export function completedSetup(
  framework: TutorialFramework = 'angular',
  locale = 'en',
  options: { diagnostics?: boolean } = {},
) {
  return applyTutorial('standard-setup', framework, initialTutorialFiles(framework), {
    locale,
    ...options,
  });
}

export function completedThemeSetup(
  theme: 'ios26' | 'ios27' | 'md3',
  framework: TutorialFramework,
  locale = 'en',
) {
  const path = `projects/docs/src/ionic-theme-${theme}/docs/${locale === 'en' ? '' : `${locale}/`}setup.md`;
  return applyNamedDiffs(
    `theme-${theme}`,
    documentedCodeBlocks(readFileSync(path, 'utf8')),
    framework,
    tutorialBaselines().frameworks[framework].files,
    {},
  );
}
