# Documentation review — 2026-11-12

This review applies the same product decisions across the portal and package entry paths,
not only to the homepage. It covers the six documented packages, four published locales,
combined setup, individual setup, migration, support, generated output and publishing workflow.

## Findings and changes

| Finding                                                                                                       | Change                                                                                                                                                                                                                                           |
| ------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Sponsor snapshot had three current public sponsors while GitHub reported four                                 | Regenerate all public sponsors, including luisbytes. Refresh before production testing/building; retrieval failures stop publication. Test exact membership in every locale's footer and support page.                                           |
| Theme Native UI setup still described Vertical Bars as optional and normal startup as requiring root teardown | Include initial device layout and layout notifications in normal startup. Keep startup in one app-shell location. Point other themes to their own integration path.                                                                              |
| HTML guide placed required device wiring after build instructions                                             | Put device wiring in startup, before building. Move custom overlay details and exceptional root replacement after normal installation.                                                                                                           |
| Shared context sent all readers to an ambiguously named complete setup                                        | Name Ionic + Capacitor explicitly; preserve theme-only, existing-theme, HTML and Cordova choices.                                                                                                                                                |
| Package landing pages called browser theme previews simply “Demo”                                             | Label them Web theme previews and explain what requires a native app.                                                                                                                                                                            |
| Migration chapter treated the combined configuration as the destination for every app                         | Start with packages already in use; describe combined setup as a choice for Ionic + Capacitor apps.                                                                                                                                              |
| Standard setup did not explain successful results                                                             | Describe expected native iOS controls, Android device colors, rail adaptation, fallback and browser verification limits in all four locales.                                                                                                     |
| Support required scrolling through sponsor lists before the contribution link                                 | Add the same contribution link near the introduction.                                                                                                                                                                                            |
| Breadcrumb and 404 labels still described the homepage as a project catalog                                   | Align labels with the documentation overview.                                                                                                                                                                                                    |
| Common UI translations retained old-site claims and wording drift                                             | Review all 86 current keys in Japanese, French and German; remove the unrelated Japanese organization notice, correct German individual-sponsor wording and remove 63 unused old-site Japanese keys.                                             |
| Device chapter promised compatibility details not contained in its text                                       | Explain the notification-to-layout flow and direct compatibility questions to the detailed guides.                                                                                                                                               |
| MD3 had advanced from 9.2.1 to 9.2.2                                                                          | Update the installed package, release link, source pin, API version text and localized pinned asset links. README/docs source content is unchanged between those releases. Preserve screenshot capture provenance at its actual capture version. |

No route or redirect is removed. The former optional-Vertical-Bars heading remains an alias
of the normal startup section. The source migration inventory and original repository revision
remain unchanged for future comparisons.

## Review and verification

- GitHub API: current sponsors queried with `activeOnly: true`, `includePrivate: false`, with
  pagination. Four current public entities; private entities are neither queried nor published.
- Public npm: all six package versions checked. Only MD3 needed updating.
- Final generated-output audit: 680 HTML files, 20,898 internal links (including fragments),
  364 local image references; no missing targets.
- Live legacy URL audit: all 332 recorded URLs on docs.rdlabo.dev returned 301 to the expected
  destination, then 200 with matching canonical and heading; query parameters were retained.
- Marketing, OSS maintainer and supervisor reviews cover entry-path clarity, responsibility,
  ordinary startup and the distinction between Web previews and native-device functionality.
- Local checks passed: docs tests, router tests, Angular tests, production build, 15 build-output
  tests, Worker dry runs, formatting, lint and SEO. Exact two-source Git refs were used as described below.

## Source ownership and release dependency

The theme and Capacitor guides remain owned by their package repositories. Their English
changes are tracked in [theme PR #375](https://github.com/webview-native-ui/ionic-theme-ios27/pull/375)
and [Capacitor PR #48](https://github.com/webview-native-ui/capacitor-plugin/pull/48). This repository
carries corresponding translations and exact immutable source pins. Merge the source PRs
and verify ordinary generation/CI before publishing the portal.

Before source publication, local verification read only those two unpublished raw-source refs
from their exact local Git commits through a temporary fetch adapter outside the repository.
All other sources used the normal fetch path. Normal GitHub raw retrieval and generation were
subsequently verified after publishing both source branches. This adapter is a local verification aid, not part
of the application, CI or deployment workflow. Local results do not replace post-publication CI.
