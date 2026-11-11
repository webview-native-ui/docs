import { cp, copyFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

/** Compare identical markup using installed release styles, isolated from the docs. */
export async function buildThemePreview(root: string, destination: string) {
  await mkdir(destination, { recursive: true });
  await cp(join(root, 'projects/docs/preview'), destination, { recursive: true });
  const vendor = join(destination, 'vendor');
  await mkdir(vendor, { recursive: true });
  for (const directory of ['components', 'css']) {
    await cp(join(root, 'node_modules/@ionic/core', directory), join(vendor, 'ionic', directory), {
      recursive: true,
      filter: (path) => !path.endsWith('.map') && !path.endsWith('.d.ts'),
    });
  }
  await copyFile(join(root, 'node_modules/@ionic/core/LICENSE'), join(vendor, 'ionic/LICENSE'));
  await copyFile(
    join(root, 'node_modules/@rdlabo/ionic-theme-ios27/dist/styles/class.css'),
    join(vendor, 'ios27.css'),
  );
  await copyFile(
    join(root, 'node_modules/@rdlabo/ionic-theme-md3/dist/styles/theme.css'),
    join(vendor, 'md3.css'),
  );
  for (const name of ['ionic-theme-ios27', 'ionic-theme-md3']) {
    await copyFile(
      join(root, `node_modules/@rdlabo/${name}/LICENSE`),
      join(vendor, `${name}.LICENSE`),
    );
    await copyFile(
      join(root, `node_modules/@rdlabo/${name}/package.json`),
      join(vendor, `${name}.package.json`),
    );
  }
  await copyFile(
    join(root, 'node_modules/@rdlabo/ionic-theme-md3/THIRD_PARTY_NOTICES.md'),
    join(vendor, 'ionic-theme-md3.NOTICES.md'),
  );
}
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  buildThemePreview(
    process.cwd(),
    join(
      process.cwd(),
      process.argv.includes('--dev')
        ? '.angular/theme-preview'
        : 'dist/docs/browser/previews/theme',
    ),
  ).catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  });
}
