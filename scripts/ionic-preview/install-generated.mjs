import { mkdir, mkdtemp, rename, rm } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { exportPortalComponents } from './export.mjs';
import { installDistributionNotices } from './upstream-inputs.mjs';

const destinations = [
  'projects/docs/public/assets/ionic-components',
  'projects/docs/src/app/generated/ionic-components',
];

// Both destinations contain generator-owned files. Stage complete replacements so
// a failed export preserves the previous snapshot and upstream deletions propagate.
export async function installGenerated(work, output, ref) {
  const root = process.cwd();
  const cache = resolve('.angular');
  await mkdir(cache, { recursive: true });
  const lock = join(cache, 'ionic-components-sync.lock');
  await mkdir(lock);
  let stage;
  let preserveBackup = false;
  try {
    stage = await mkdtemp(join(cache, 'ionic-components-sync-'));
    try {
      process.chdir(stage);
      await exportPortalComponents(work, output, ref);
    } finally {
      process.chdir(root);
    }
    await installDistributionNotices(work, join(stage, destinations[0]), ref);
    const changes = [];
    try {
      for (const destination of destinations) {
        const target = resolve(destination);
        await mkdir(dirname(target), { recursive: true });
        const backup = join(stage, 'previous-' + changes.length);
        const change = { target, backup, hadPrevious: false, installed: false };
        changes.push(change);
        try {
          await rename(target, backup);
          change.hadPrevious = true;
        } catch (error) {
          if (error.code !== 'ENOENT') throw error;
        }
        await rename(join(stage, destination), target);
        change.installed = true;
      }
    } catch (error) {
      try {
        for (const change of changes.reverse()) {
          if (change.installed) await rm(change.target, { recursive: true });
          if (change.hadPrevious) await rename(change.backup, change.target);
        }
      } catch (rollbackError) {
        preserveBackup = true;
        throw new AggregateError([error, rollbackError], 'Previous files retained in ' + stage);
      }
      throw error;
    }
  } finally {
    if (stage && !preserveBackup) await rm(stage, { recursive: true, force: true });
    await rm(lock, { recursive: true });
  }
}
