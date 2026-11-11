# WebView Native UI documentation

Four-language documentation for Engine, Capacitor Native UI, Ionic Theme iOS27, iOS26, and MD3.
Production origin: https://webview-native-ui.com.

Requires Node.js 24 and npm 11. Run `npm ci`, then `npm start` (English), `npm run start:ja`,
`npm run start:fr`, or `npm run start:de`.

```sh
npm run docs:generate
npm run fmt:check
npm run lint
npm test
npm run build
npm run seo:audit
npm run deploy:docs:dry-run
```

The Angular app, shared renderer, localization, Pagefind search, sponsorship UI, static 404s,
and contract tests were extracted from [rdlabo-dev/website](https://github.com/rdlabo-dev/website).
The MIT license and original attribution are retained. See [MIGRATION.md](MIGRATION.md).

Project metadata and immutable package source refs live in `scripts/project-manifest.ts`.
Japanese, French, and German translations remain in `projects/docs/src/<project>/docs/<locale>`;
portal-owned English and shared samples live alongside those directories. Package-owned English
continues to be fetched from its pinned upstream source. Generation reads tracked portal-owned
sources locally so a fresh checkout can build without already-published files in this repository.
Generated modules and sitemap are committed; `workers/generated` is disposable.

Public paths and npm package names remain unchanged. Related English articles remain on rdlabo.dev.
Cordova setup is covered in Engine guides; a new standalone Cordova manual is outside this extraction.

Cloudflare Workers Static Assets uses `wrangler.jsonc` and the `webview-native-ui-docs` service.
Production deploys are manual via the environment-gated workflow after explicit approval.
Configure `CLOUDFLARE_API_TOKEN` and the custom domain before running it. The optional agent router
has a distinct Worker name; see [workers/README.md](workers/README.md) for secrets and fail-open setup.
