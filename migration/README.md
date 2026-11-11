# Migration compatibility and source diffs

The source documentation was migrated from `rdlabo-dev/website` at
`7bd562b441ee69d29a6400230229cd7711f6dfa5`. Keep this immutable baseline;
do not update its revision or hashes to make a comparison pass.

- `source-inventory.json` records the original paths and SHA-256 hashes.
- `redirect-inventory.json` records the source sitemap's migrated pages plus historical
  aliases, and the destination paths expected after the move (332 entries).
- The source site's redirect implementation remains in
  [workers/webview-docs-redirect.mjs](https://github.com/rdlabo-dev/website/blob/main/workers/webview-docs-redirect.mjs).
  It redirects both `/projects/<id>/…` and `/<id>/…` in all four languages,
  preserving query strings. Browser fragments are retained by redirects whose Location
  has no fragment. Destination heading IDs still need review when editing headings.
- This repository's `projects/docs/public/_redirects` preserves historical page aliases.
  The build checks every recorded destination and detects alias removal/redirect loops.
  This is a local compatibility check, not proof of a production deployment.

## Review changes against the original docs

Use the source repository's Git history, not its current main: the migrated files were
removed there to avoid maintaining two copies. Given a local checkout at
`/path/to/website`, export the baseline into a fresh temporary directory:

```sh
baseline=$(mktemp -d)
git -C /path/to/website archive 7bd562b441ee69d29a6400230229cd7711f6dfa5 \
  projects/docs/src/webview-native-ui-engine \
  projects/docs/src/capacitor-native-ui \
  projects/docs/src/ionic-theme-ios27 \
  projects/docs/src/ionic-theme-ios26 \
  projects/docs/src/ionic-theme-md3 | tar -x -C "$baseline"
git diff --no-index "$baseline/projects/docs/src/capacitor-native-ui/docs" \
  projects/docs/src/capacitor-native-ui/docs
```

Repeat the final comparison for the other project directories. A diff exits with status 1
when differences exist; those differences are the review material, not a migration failure.
`npm run migration:verify-source` is the initial byte-for-byte copy check and is expected
to fail once a migrated file is intentionally edited; it is not an ongoing freshness check.

English documentation may now come from package repositories at the immutable refs in
`scripts/project-manifest.ts`. Review those source-ref changes and generated content diffs
alongside the local Markdown diff; a local-source diff alone does not cover the published site.

When reorganizing pages, preserve the old URL or add an explicit 301 to the appropriate page,
retain locale and heading compatibility, and run `npm run build`. Do not delete inventory
entries simply because a destination was removed. After an approved deployment, check the
source URL's actual 301 Location and the destination's content, not just its HTTP status.
