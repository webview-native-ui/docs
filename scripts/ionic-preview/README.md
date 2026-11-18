# Sync Ionic component references

Run from the docs repository with Node.js 24 and its npm dependencies installed.

```sh
npm run docs:sync:ionic
```

The command downloads the pinned English and Japanese Ionic Docs revisions, builds its MDX with the upstream Docusaurus toolchain and exports the component articles and demos. The package lock selects the local Ionic runtime and themes. Japanese routes use the official translation/jp articles and the pinned ionic-jp API definitions. English, French and German routes show the English articles. Each article footer links to its original revision. Distribution credits and license texts are generated under `projects/docs/public/assets/ionic-components`.

PR CI and the production deployment workflow run this step after npm ci. On a fresh local checkout, run it once before starting, testing, or building the portal. The generated article modules and demo assets are ignored by Git.

To review an update locally, run `npm run docs:sync:ionic -- <commit-sha>`. Update the default SHA after verifying the result. Review package versions and core.json SHA-256 digests in `upstream-inputs.mjs` if the Ionic API version changes. Check the upstream API package license when updating its version. The current license snapshot is from [ionic-framework at the API package's gitHead](https://github.com/ionic-team/ionic-framework/blob/68a2fea5fa1db1c729ed81a29f10d0b1b4c399c7/LICENSE).

The generator replaces both generated directories after compilation and export succeed. Run the portal build and inspect a component page after syncing. The synchronization and publication steps are separate.
