# WebView Native UI documentation

This repository builds one Angular static documentation application at `projects/docs` for
https://webview-native-ui.com. Keep `/projects/<slug>` and en/ja/fr/de URL paths stable.

- Declare projects, pinned English source refs, pages, and metadata in `scripts/project-manifest.ts`.
- English normally comes from the package repository at an immutable ref. Portal-owned English falls back to the tracked local source. Translations and code samples live under `projects/docs/src/<project>/docs`.
- Preserve translated front matter `sourceRevision` unless the English source and translation have both been reviewed. Preserve executable code across languages; explanatory comments may be translated.
- Never edit generated modules or the sitemap by hand. Run `npm run docs:generate`.
- Keep current package docs and historical iOS26 source/edit branches distinct. npm package names and public project slugs are unchanged by the repository move.
- Related articles remain canonical on rdlabo.dev; the retained metadata is in `scripts/related-articles.ts`.
- Verify with `npm run fmt:check`, `npm run lint`, `npm test`, `npm run build`, and `npm run seo:audit` (Node 24).
- Production uses `wrangler.jsonc`. The optional Markdown/agent router uses a separate Worker and config; see `workers/README.md`. Never copy production secrets into files.
- Deploy only after explicit approval. The workflow is manual and production-environment gated. The migration source's redirects must be deployed only after this site is live and verified.
