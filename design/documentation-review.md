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
