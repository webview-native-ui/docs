# Sync Ionic component references

Run from the docs repository with Node.js 24 and its npm dependencies installed.

```sh
node scripts/preview-ionic-components.mjs
```

The command downloads the pinned English Ionic Docs revision, builds its MDX with the upstream Docusaurus toolchain and exports the component articles and demos. The package lock selects the local Ionic runtime and themes. The article footer links to the original revision. Distribution credits and license texts are generated under `projects/docs/public/assets/ionic-components`.

To review an update, pass a full Ionic Docs commit SHA as the first argument. Update the default SHA after verifying the result. Review package versions and core.json SHA-256 digests in `upstream-inputs.mjs` if the Ionic API version changes. Check the upstream API package license when updating its version. The current license snapshot is from [ionic-framework at the API package's gitHead](https://github.com/ionic-team/ionic-framework/blob/68a2fea5fa1db1c729ed81a29f10d0b1b4c399c7/LICENSE).

The generator replaces both generated directories after compilation and export succeed. Review their diff, then run the portal build and inspect a component page. The synchronization and publication steps are separate.
