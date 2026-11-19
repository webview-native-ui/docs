# WebView Native UI documentation

Four-language documentation for Engine, Capacitor Native UI, Cordova Native UI, Ionic Theme iOS27, iOS26, and MD3.
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
The catalog order is Themes, Plugins, then Developer tools.
The Plugins category contains the Capacitor and Cordova integrations.

The catalog uses the package versions pinned in `package.json`. Since Cordova plugin 0.1.6, applications install their Ionic theme separately.

Cloudflare Workers Static Assets uses `wrangler.jsonc` and the `webview-native-ui-docs` service.
Every push to `main`, including a merged PR, automatically runs the production deployment workflow.
It refreshes public sponsors and runs formatting, lint, tests, the production build, and the SEO audit
before deploying the documentation and legacy-domain redirects through the `cloudflare-production`
environment. Deployments run sequentially without cancelling an in-progress deployment.

Manual workflow dispatch remains available on `main`. Only manual runs can opt into deploying the
separate agent router. Configure `CLOUDFLARE_API_TOKEN` and the custom domain before deployment; see
[workers/README.md](workers/README.md) for agent-router secrets and fail-open setup.

The footer lists every current public GitHub sponsor; the support page also lists past public
sponsors. Production deployment refreshes the list with `npm run sponsors:generate` before
testing and building, using the workflow's GitHub token. CI runs the same refresh and
checks that the committed snapshot is current. The generator excludes private
sponsorships and follows every pagination cursor. If fetching fails, deployment stops rather
than publishing a stale list. Local builds use the committed snapshot; to refresh it, run
`GITHUB_TOKEN=<token> npm run sponsors:generate` with a GitHub token provided through the environment.

On a fresh checkout, run `npm run docs:sync:ionic` after installing dependencies to generate the [Ionic component reference](scripts/ionic-preview/README.md).
