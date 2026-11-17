# Documentation review record

## Scope and reviewers

Review the uncommitted documentation redesign on `docs/framework-setup-examples`, against
`documentation-journeys.md`. The manager-role reviewer and independent acceptance reviewer
are separate delegated agents. They did not implement the reviewed changes. A third agent
implemented the bounded theme-only setup correction; it does not approve its own work.

These are local reviews, not GitHub approvals or a claim that human managers reviewed the work.
No PR publication, protected-branch update or production deployment is part of this review.

## Round 1 — returned

Manager design review returned four issues:

1. Android custom extensions could never start: the combined startup's iOS guard still enclosed
   their replacement activation call.
2. Theme-only and existing-theme readers entered unrelated combined/appearance tasks before
   choosing an appropriate integration.
3. Appearance and built-in control tasks left framework event/state wiring to the reader.
4. Platform prerequisites and completion checks required unrelated OS/device capabilities,
   and a working Web action alone did not prove native projection.

Independent acceptance review separately returned:

1. The Android extension startup issue (confirmed against the installed release).
2. The theme-only iOS 27 package setup required Foldable and device-layout wiring.
3. Theme-only migration ended with mandatory Capacitor/native/rail checks.

The initial independent desktop/mobile checks found no page-wide overflow. Those observations
were not treated as acceptance of the broken journeys.

## Design corrections before re-review

- Define a setup selector on the homepage: combined integration, direct iOS 26/iOS 27/MD3
  installations, existing-theme Native UI, HTML and Cordova. Package context returns to this
  selector. Direct task entries state scope and expose alternative integrations.
- Give single-platform users their own prerequisites, sync/open commands and finish lines.
  Unsupported device capabilities complete with the documented fallback.
- Make three theme-only setup pages portal-owned, retaining public routes/heading aliases,
  with public presets, Ionic 9 framework examples and no Native UI/Foldable setup requirement.
- Use framework-native event binding and state in each appearance/control example, without
  per-visit global listeners or a second appearance controller.
- Show the full extension startup module: activation runs on both native hosts, while layout
  subscription remains iOS-specific. Check the actual module separately for iOS, Android and Web.
- Distinguish browser/theme-only migration completion from installed native-feature checks.
- Inspect native projection status after the sample action; document native versus Web fallback
  criteria and remove temporary diagnostics after checking.

## Round 2 — returned, then manager design approval

Both reviewers caught a correction error: the Android registration section had been replaced by
startup code. Restore the complete Gradle/Compose/Application registration to step 3b, put the
full startup module in step 4, and retain the rebuild checks in step 5. Runtime checks now cover
both native hosts, and the test also requires the Swift/Kotlin/Gradle registration examples.
The manager reviewer rechecked all four translations and approved the corrected design.

Independent acceptance also returned two equivalent-entry problems: the iOS 27 README still
required Foldable, and the new existing-theme entrance ended in an iPhone Duo-only finish line.
Correct these entry documents as well as setup. Ordinary iOS controls complete on iOS 26+;
rail-specific verification applies only to a supported device. Keep independent acceptance
pending until those changes receive another review.

## Round 3

The manager design reviewer approved the equivalent-entry corrections, and the independent
reviewer approved source acceptance with no additional blocking findings. Both checked the
Android registration/startup sequence and the ordinary-iOS versus rail-specific finish lines.
Final independent browser acceptance was approved with no remaining return requests:

- 112 pages: four languages × widths 1440/390 × 14 entry points.
- All setup alternatives and the combined route, package context links, theme-only README
  instructions, and Android registration/startup in the generated extension article.
- 16 historical heading fragments.
- 20 mobile click/menu checks, including context → selector → theme setup, drawer closing
  and Escape behavior.
- Visual inspection with no page-wide horizontal overflow.

The manager design cycle and independent acceptance cycle are both complete. Neither reviewer
has an unresolved blocking finding.

## Validation evidence

Final local checks passed:

- `npm test`: 154 source/contract tests, 15 Worker tests and 126 Angular tests.
- `npm run build`: production generation, 15 generated-output checks and both Worker dry runs.
- `npm run lint`, `npm run fmt:check`, `npm run seo:audit` and `git diff --check`.
- Six published-example groups type-check against installed release APIs, including the complete
  extension startup and its imported counter definition. Runtime tests exercise framework event
  examples and one startup per host, using controlled framework/native stubs.
- The primary reviewer checked the final setup selector in all four languages and desktop/mobile
  page layout at widths 1440 and 390, with no page-wide overflow. Independent browser results
  are recorded in the final acceptance entry below.

Existing build warnings remain for the shared package chunk and the homepage stylesheet budget.
They do not fail the build.

Native application builds and physical-device behavior are not inferred from Web tests or
stubbed framework/runtime execution. No native acceptance test has been run in this repository.
This approval concerns documentation design, reproducible source contracts and Web navigation;
it does not certify Swift/Kotlin compilation or native rendering on a device.

## Follow-up — distinguish installation from independent uses

User acceptance returned the visible reading model: the homepage section numbers, flat sidebar
and setup ending suggested one mandatory cross-page sequence even though the design described
independent tasks. The previous source/navigation approvals did not establish this distinction.

Revise the rendered information architecture and the setup finish together: five numbered setup
operations complete installation; purpose-specific guides are separate choices, and migration is
an alternate entrance. Show each page's kind and reading rule on direct/mobile entry. Review
these observable criteria independently before considering this follow-up accepted.

The manager returned one issue: removing the diagnostic link alone did not provide a native
projection check within setup. Add a temporary read-only hook for the existing handle in step 5,
inspect it after an eligible page renders, distinguish native success, expected fallback and
unverified projection, then remove the hook. Type and runtime checks confirm the recipe does
not start another runtime.

The manager and independent acceptance reviewer both approved the corrected reading model.
The independent reviewer read the final screens in all four languages at widths 1440/390 and
height 844, including direct/mobile entry, and confirmed that the kind and reading rule appear
on the first screen. Homepage, sidebar and article content agree on the five-step setup finish,
four independent uses and the separate migration entrance. No return requests remain.

Final tests, production build/output checks, SEO audit, lint, format and diff checks passed.
The primary browser check also passed all four languages at both widths, including old setup
fragments and no page-wide overflow. This follow-up remains a local change pending publication;
its native verification instructions were reviewed, not executed on a native device.

## Follow-up — separate device palette and brightness

User acceptance returned the appearance example: three action buttons and the label System
obscured the distinction between device palette use and OS light/dark following. They also
failed to show the current choice. Revise the optional appearance task to show two independent
inputs: a device-color checkbox and a light/dark select whose system option explicitly follows
OS appearance. Reuse one controller, restore original colors when device colors are disabled,
and retain the selected preferences during page revisits in the same app session.

Use partial, synchronous preference updates and read the latest color-source preference after
an asynchronous native read. The installed theme controller is exercised directly across six
combinations, OS appearance changes, unavailable-palette fallback, original-color restoration,
and rapid off/on plus brightness changes while a refresh is pending. Angular Signal Forms
bindings are compiled with the installed Angular compiler and strict template checking.

The manager and independent acceptance reviewer approved the implementation. The independent
reviewer reran the real-controller test and read the final generated appearance guide in all
four languages on desktop/mobile: the two labels, current-value bindings, OS-appearance option,
unsupported-device explanation and historical step-3 aliases are clear. No return requests remain.

Final checks passed: 155 source/contract tests, 15 Worker tests, 126 Angular tests, production
build/output checks, SEO, format, lint and diff checks. The new compiler test runs the actual
Angular compiler with strict template checking. Native device behavior is still unverified.
These appearance corrections and the reading-model follow-up remain local pending publication.

## Follow-up — diff-based changes and explicit completion states

User acceptance returned the code presentation: complete files, partial additions, diagnostics
and commands made it difficult to identify what had been done and what remained. Installation
and task guides now show filename-labelled diffs and state the precondition and outcome of
each operation. Commands remain executable terminal/console operations. Theme-only setup and
the iOS 27 README installation examples follow the same diff convention.

The independent design review found a hidden Counter callback prerequisite. Replace it with
Angular/React/Vue state and event changes in an existing routed Counter page. The manager and
independent reviewers also require real context/deletion matching, preservation of unshown
router/provider configuration, both appearance/extension application orders, and removal of
all temporary module/page code before the final running-app check.

Tracked fixtures and a strict diff applier reconstruct the documented states. Existing API,
Angular strict-template and real-controller tests now consume the reconstructed files rather
than code blocks stripped of their + prefixes. The first implementation review returned three execution-state gaps: the Kotlin version was
assumed to exist, iOS diagnostic removal appeared applicable to Android readers, and source
edits were followed by checks without a running-app update. Add configured/unconfigured Kotlin
branches, scope the whole diagnostic lifecycle to supported iOS, and include browser reload or
selected-target build/sync/relaunch before checks. Restore explicit completed-setup links.

The manager and independent acceptance reviewer approved the corrected version. The independent
reviewer read 80 generated pages in four languages on desktop/mobile and confirmed that filenames,
added/deleted lines, starting conditions, unperformed work and finish conditions are clear. Branch
selection and full removal/restart are explicit; long Android filenames cause no page overflow.

Final validation passed: 167 source/contract tests, 15 Worker tests, 126 Angular tests, production
build/output checks, SEO, format, lint and diff checks. Strict diff-state tests cover intermediate
exports, complete reversions, preserved routers and HTTP providers, optional task permutations,
Android-only setup, and native Application/Kotlin alternatives. Runtime and compiler checks use
the applied files. Native builds/device operation remain unverified. All follow-up changes remain
local pending publication.

## Follow-up — preserve OS-following CSS until manual appearance is added

User acceptance returned an unintended behavior change: installation replaced dark.system.css
with class presets even before manual light/dark controls existed. Restore the combined setup
to system.css presets, explicitly limit its baseline to an OS-following app, and move the two
System-to-Class import edits into the optional appearance task. Existing class/always apps
retain their policy through the appropriate setup/migration path. The legacy class-to-class
migration remains unchanged. No controller API or UI feature was added in this correction.

CSS-bundle and state tests now enforce this phase boundary. A real browser with the compiled
CSS and installed theme controller verified iOS and MD modes: default System follows OS
brightness regardless of the class; only the optional Class stage permits fixed Light/Dark
opposite to the OS. The initially reviewed System choice was subsequently removed by the
two-checkbox correction below.

## Follow-up — two independent checkbox preferences

User acceptance rejected the system/light/dark select. Reading seatkeep's settings confirmed
two independent settings: dark mode and device (Dynamic) colors. The HTML examples use two
checkboxes with boolean preferences. OS brightness supplies the initial dark value once,
then application-controlled dark mode remains independent of OS changes. No OS-following
choice or third control is added. The earlier select-based acceptance is superseded.

The default setup retains system.css. Only the optional appearance task swaps to class.css.
Runtime checks cover all four combinations, unsupported palettes, pending reads, and both
checkbox events in Angular, React, and Vue. Both delegated manager and independent acceptance
reviewers approved the final two-checkbox model without further returns. These are agent
reviews, not claims of review by a human manager or of native-device execution.

Final verification passed: 168 source tests, 15 worker tests, 126 Angular tests, the production
build and 15 build-output checks, SEO audit, formatting and lint. After the final heading/alias
edit, regeneration/build and 14 heading/translation checks passed. Compiled CSS with the real
controller passed 16 browser cases across iOS/MD modes. Generated appearance pages passed
8 checks across four languages and mobile/desktop widths: two checkbox examples per framework,
no select/options, no horizontal overflow, and the retained English step-one fragment.
The Japanese mobile screenshot was inspected. Changes remain local; no publication or main
push is included in this follow-up.

## Follow-up — preserve diff marker separators

User acceptance returned the missing space after + / - markers. The rule is now recorded in
the global ~/.codex/AGENTS.md. All 40 newly rewritten source articles (276 diff blocks) use a
separator space distinct from code indentation, including empty changed lines. Prettier-ignore
protects diff fences against trailing-space removal. Strict replay rejects missing separators
and removes two prefix characters without changing code indentation.

Imported display diffs repair missing separators on empty lines and on immediately adjacent
nonspace code; existing whitespace, context and file headers are preserved. This is not a raw
unified-patch conversion. Both HTML and agent Markdown receive the same repair. A before/after
replay regression covers imports, nested indentation, blank lines, context and headers.

The manager returned ambiguous imported-diff handling and then the remaining Engine imports;
both were corrected and the manager approved re-review. The final build checks every rendered
diff marker across all locales, package pages, setup and task guides. Both delegated reviewers
approved re-review. Verification passed: 170 source tests, 15 worker tests and 126 Angular tests;
the final strict replay/compiler checks; generated-output checks for all pages; formatting and
lint. Production compilation/prerendering completed; an initially overbroad output assertion
mistook unchanged context markers for +/- and was narrowed to changed lines, then all 15 output
tests passed. Real browser checks inspected 124 changed lines at each of 390px and 1440px, and
the mobile screenshot was visually checked. No native-device claim or publication is included.

## Follow-up — visual diff columns

User acceptance clarified that the requirement is a one-character visual gap, not mandatory
literal whitespace. The global rule and journey design were corrected. The previous text-only
checks failed to notice that context lines reserved one column while changed lines reserved
two. Shared Zenn CSS now gives context prefixes one additional ch of inline padding, retaining
code indentation and the existing source representation.

The production build and 15 generated-output checks passed. Browser range measurements on the
actual six stylesheet import lines showed identical code-start coordinates; added, removed and
context rows in an indented fixture also matched at 390px and 1440px (at most 0.016px
rounding in the nested desktop fixture). Both delegated reviewers approved, including an
independent browser measurement. The corrected mobile screenshot was visually inspected.

## Follow-up — appearance extends beyond Web colors

A downstream PR review identified missing iOS system-bar contrast when manual app appearance
opposes the OS, theme colors leaking into PDF output, missing usage documentation and missing
comparisons of real screens. The appearance task now updates SystemBars from the shared dark
preference at iOS startup and after changes. Capacitor 8 maps Dark to light content on dark
backgrounds and Light to dark content on light backgrounds. Android/Web do not enter this
synchronization; existing Android inset handling remains the app’s responsibility.

The verification instructions now cover both OS/app opposites, restoration when integrating
existing persistence, print/PDF colors where applicable, and actual settings/main-screen
comparisons. The example still does not add persistence. No downstream repository was edited
and no GitHub comment was posted.

Review returned contextual diffs that could not compose with the new iOS call. Extensions now
use a unique controller-tail context and separate removal hunk; temporary native diagnostics
replace only the relevant runtime call. The synchronization helper uses a non-iOS early return
so layout diffs retain unique context. Four-language, three-framework AE/EA and diagnostic
restoration checks pass. Both delegated reviewers approved re-review. All 23 related tests,
including strict Angular compilation and iOS SystemBars runtime stubs, passed. Production build,
15 generated-page checks, formatting and lint passed. Native-device status-bar appearance has not
been verified in this documentation workspace.

## Follow-up — remove work that setup already performs

User acceptance rejected the toolbar-action and device-layout guides because combined setup
already enables native presentation and layout synchronization automatically. Both portal
articles were removed in all four languages, together with their fake Save example and manual
browser preview tests. Home/sidebar now expose only appearance and custom-extension tasks;
migration is separate. Setup verification covers existing controls and layout behavior without
asking readers to create an example action. Runtime tests retain one startup/listener and check
initial layout, layout-change application and restoration to no reserved edge.

The two legacy portal routes redirect to setup verification in both SPA and static delivery.
SPA redirect returns a UrlTree to replace obsolete fragments. The shared verification anchor
uses the existing headingAliases mechanism: the initial raw-span approach was stripped by the
Markdown renderer and the generated-page check caught it before completion. All four locale
aliases now exist in final HTML. Sponsorship is outside the guide navigation, separated below
the package reference.

Appearance examples now use exactly two ion-item elements, each containing one ion-toggle,
without an ion-list wrapper. Angular retains Signal Forms, checked by strict ngc against the
actual Ionic 9 Angular package (added as a test-only development dependency); React/Vue use
ionChange detail.checked. The two independent booleans and iOS SystemBars synchronization remain.
Both delegated reviewers approved the final source and the manager rechecked anchor generation.

Verification passed: 170 source tests, 15 worker tests, 119 Angular tests, final production build,
15 generated-output tests, SEO, formatting and lint. Browser checks covered all four languages
at 390px and 1440px, verifying two optional guides, a separate Sponsor link, two Ionic rows and
toggles per framework and no raw input/ion-list. Eight real local Cloudflare 301 responses point
to the localized setup verification anchor. Desktop and mobile navigation screenshots were
visually inspected. Changes remain local; no publication or protected-branch push was performed.
