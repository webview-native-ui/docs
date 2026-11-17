# Documentation journeys and acceptance criteria

## Goal and audience

Help a developer finish a working integration with the fewest application changes. The first
reader is maintaining an existing Ionic 9 + Capacitor 8 app; this site does not teach framework
installation or application scaffolding. Theme-only, HTML + Capacitor, and Cordova users must
reach their own instructions before installing unrelated packages.

Success is a running application with observable results, not a reader reaching another page.
The portal owns the combined integration. Package documentation owns individual installation
variants, capability limits and API details. Do not duplicate the package reference into a
second mandatory tutorial sequence.

## Information architecture

| Reader goal                                       | Entry and owner                                                                 | Finish line                                                                                                         |
| ------------------------------------------------- | ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| Understand the product                            | Home / overview                                                                 | Identify the Web/theme/native responsibilities and actual iOS/Android support.                                      |
| Add themes and Native UI to an existing Ionic app | `/standard-setup`, portal                                                       | Install, configure the chosen framework once, start after the shell renders, build/sync/run and verify the results. |
| Use a theme without Native UI                     | Direct package choices in the home setup selector and before task prerequisites | Install only the selected theme; no Native UI startup, native project or Foldable configuration prerequisite.       |
| Add Native UI while keeping an existing theme     | Dedicated package Ionic integration guide                                       | Retain the theme and integrate only the native runtime and device wiring needed by the app.                         |
| Add Native UI without Ionic                       | Dedicated package HTML guide                                                    | Follow the framework-independent integration without Ionic imports.                                                 |
| Use Cordova                                       | Dedicated Cordova package guide                                                 | Use Cordova installation and lifecycle rather than Capacitor commands.                                              |
| Add an appearance setting                         | `/guides/appearance`, portal                                                    | Device-palette and dark-mode settings work independently through the existing controller.                           |
| Verify automatic native UI and layout             | `/standard-setup#verify-installation`, portal                                   | Existing Ionic controls and handlers work; layout changes apply and remove spacing without extra implementation.    |
| Implement a custom native component               | `/guides/extensions`, portal                                                    | A Web-owned counter works in Web and the selected native host. This is optional and experimental.                   |
| Update an existing integration                    | `/guides/migration`, portal                                                     | Identify the installed features, replace obsolete configuration and verify retained behavior.                       |
| Look up a package                                 | Persistent package reference table of contents                                  | Select a package, enter its documentation and locate its setup or API.                                              |

The main flow is **overview → choose the integration → finish on the selected platform(s)**.
The home selector (`#choose-setup`) exposes combined integration, three theme-only installations,
existing-theme Native UI, HTML and Cordova. Package-level context links back to this selector,
not to an unrelated combined installation. Combined setup remains the prominent default path.
A direct task-page entry states its supported starting state and offers other integration paths
before asking the reader to install packages.

Select iOS, Android or both before prerequisites and build commands. Each selected platform is
complete when its applicable features work; unavailable device colors or rails are completed
by checking the documented fallback. A second native project or a rail-capable device is not
a requirement for finishing an ordinary single-platform integration.

The combined flow is **app setup → a working app**. After that, task guides are independent
choices, not compulsory chapters. Every task page must explain its starting state, the files
and changes, when the code runs, the expected result and how to verify it. Reference links
supplement the task rather than carrying its essential implementation.

Keep existing routes and heading links working in all four languages. Changing a navigation
label must not require a URL migration. Package selection and the existing sliding navigation
remain available independently of tutorial progress.

## Minimum-change policy

- Use public theme presets. Keep the four CSS imports and one shared iOS configuration; do not
  branch JavaScript configuration or transition animation by iOS theme generation.
- Provide a complete initialization example for Angular, React and Vue. The reader picks one;
  router, providers, templates and existing application handlers must be retained.
- The combined setup includes the built-in native controls, Vertical Bars/device notifications
  and Dynamic Color. Do not make custom extensions or appearance settings part of installation.
- Start the combined integration once after the application shell renders. Root examples must
  not add exceptional teardown machinery. Explain any guard needed for actual framework behavior.
- Browser theme/layout previews are not native acceptance evidence. State platform support and
  native-toolchain requirements at the point where they affect an action.
- Task examples must connect to the established startup module and existing framework events;
  do not create a second shell, controller or layout subscription.
- Appearance and extension tasks provide concrete Angular, React and Vue page examples
  using their own event binding and state. Do not require the reader to translate raw DOM code
  into a framework page or attach global listeners on every routed-page visit.
- Custom extensions change startup deliberately: enable the single runtime for each chosen
  native host (including Android), while keeping device-layout wiring scoped to its supported
  host. Show the whole replacement startup function so the host guard cannot be missed.
- A native control acceptance check must observe native projection status after the page is
  present as well as the Web-owned action result; a working Web button alone is insufficient.

## Review gates

### Manager design review

Review the journeys and their implementation together, including equivalent entrances from
home, navigation, package landing/README/setup and translated pages. Challenge ownership,
mandatory versus optional work, misleading capability claims, unnecessary setup steps and
missing completion criteria before examining rendering or code style. Test counts and numbered
headings alone do not establish that the design is usable.

Return blocking findings with the affected journey, consequence and evidence. Fix the design
or its implementation and repeat the review until there are no unresolved return requests.

### Independent acceptance review

Use a reviewer who did not implement the changes. Starting from the home page or a direct
package/page link, walk the scenarios below as a new reader. Verify the concrete code against
installed, pinned package contracts and execute Web examples where feasible. Separate observed
behavior from inferred native behavior; do not claim a native build or device test that was not run.

| Scenario                                    | Acceptance condition                                                                                                                                                                  |
| ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Angular / React / Vue combined installation | Each reader can identify the exact file, imports, initialization call and shell lifecycle; only one framework's example is needed and only the selected native projects are required. |
| Theme-only / HTML / Cordova                 | Each path is visible before combined installation and avoids unrelated prerequisites.                                                                                                 |
| Appearance settings after route navigation  | All three framework pages wire their events explicitly. Existing startup is reused; opening/reopening settings does not create a second controller or duplicate actions.              |
| Automatic native controls                   | Existing screen actions work in native presentation and Web fallback during setup verification; no fake Save example or additional page implementation.                               |
| Layout notification and reversal            | The setup listener applies initial placement, follows notifications and removes reserved spacing when the resolver returns no edge.                                                   |
| Custom component                            | The Web counter, reader, native registration and existing startup form one executable path separately for iOS and Android, including the change from the combined startup guard.      |
| Migration                                   | A reader can identify applicable changes and verify completion without installing features they do not use.                                                                           |
| Navigation and localization                 | Home, sidebar, package entry, direct URLs and heading links agree; all four languages expose equivalent actions.                                                                      |
| Desktop and mobile reading                  | Navigation and code stay usable without page-wide overflow.                                                                                                                           |

Return failures and repeat after corrections. Approval means the documented acceptance criteria
are met within the explicitly recorded evidence limits, not that every native host was built.

## Evidence and limits

Record review rounds and validation results separately in `documentation-review.md`. This design
is the review baseline; if a finding changes a journey or responsibility, update this file first
and then update the affected content and checks.

The three theme-only package setup pages, the iOS 27 README and the existing-theme Native UI
integration page are portal-owned English sources with reviewed
translations, so their install instructions can follow these journeys without changing pinned
package versions or rewriting other upstream reference pages. Their edit links must target this
repository. Dependencies installed automatically as package peers do not imply a requirement
to initialize Native UI or create native projects.

## Visible reading model

The previous design described independent task guides but the rendered interface presented
setup, tasks and migration as one flat sequence. A reader must be able to infer the reading
model from the page itself, including a direct link on mobile with the sidebar closed.

- The setup page has five ordered operations, ending in platform checks, then an explicit
  completion statement. Completing setup never requires finishing a task guide.
- Homepage and sidebar separate installation, independent post-setup uses, migration/update
  and package reference. Decorative section numbers must not imply a cross-page sequence.
- Every portal guide identifies its kind and reading rule above the content. A task title and
  introduction name the additional result; built-in controls and device updates already
  enabled during setup are not presented as another required installation.
- Numbering belongs to operations inside a page. A migration page is an alternate route for
  existing installations, not the last chapter of first-time installation.
- Acceptance checks must inspect these visible boundaries and the standalone setup finish,
  in addition to code, links, and successful page rendering.

## Independent appearance preferences

Device palette selection and dark mode are independent booleans, matching seatkeep's two
settings. Ionic examples use two ion-item rows, each containing one ion-toggle: Use device
colors and Dark mode. Do not add an ion-list wrapper.
There is no select or system/light/dark choice. The initial dark value snapshots current OS
brightness once; after initialization the dark toggle controls appearance independently of
OS changes. Unsupported platforms retain their default palette with device colors enabled.

Reuse the existing theme controller, setting mode from the dark boolean at startup and on
updates. Only a palette preference change triggers refresh. To disable device colors, the
provider returns available:false while retaining systemDark. Read the latest preference after
the native read resolves. Partial synchronous updates prevent one setting overwriting the
other during pending reads. Choices survive reopening the page within the running app;
this example does not add persistence across restarts.

Acceptance checks all four combinations with the real controller, unsupported palette
fallback, original-color restoration, OS changes while manual dark mode remains selected,
and concurrent palette/dark updates. Angular uses Signal Forms; React and Vue bind both
toggles to boolean state. The initial setup retains system.css until this optional task.

## State transitions and file diffs

Installation and task instructions describe changes to an existing application. Show every
application-file edit as a filename-labelled diff: context remains, additions start with +,
removals start with -, and only genuinely new files use all-addition examples. Each + or -
marker has a visual gap of one monospace character before code. Changed and context rows
reserve matching columns, with code indentation preserved. Source separator spaces are one
implementation detail; the visual requirement is verified with browser coordinates. Keep terminal
commands, WebView console operations and expected output distinct from file edits. Reference
API definitions describe contracts rather than an application state transition.

Each step states its starting condition, the edit or operation, and the ending condition.
Installed dependencies, configured styles/options, connected startup and verified native
behavior are different states. A successful code edit does not establish that a native app
has been rebuilt or verified. A temporary check includes its removal diff and the rebuild,
sync and restart/full-reload needed to verify the restored running state.

The setup chain starts from an existing routed Ionic app and ends with its inspection hook
removed. Optional tasks start from that state. Their diffs preserve unshown providers,
HTTP configuration, routers, rendering and application content. Counter examples use each
framework's state in an existing routed page rather than assuming a custom rendering callback
not created by setup. Appearance and native extensions must work in either order without
replacing each other's startup changes. Temporary installation diagnostics must restore the original startup without leaving inspection hooks.

Acceptance applies the actual context and deleted lines to tracked starting fixtures, builds
successive snapshots, then executes and compiles those snapshots. Extracting only + lines is
insufficient. Temporary-check reversion, both optional-task orders, existing router/provider
retention and the declared legacy/new-Application alternatives are separate regression cases.

## Preserve appearance policy until the optional change

The combined-installation baseline uses Ionic dark.system.css and follows OS brightness.
Theme installation retains that policy through the public iOS system.css presets. It must
not silently replace OS media-query behavior with class-based control. Existing class/always
apps retain their own policy through the appropriate setup/migration route, rather than being
converted to the system baseline as a supposed simplification.

Only the optional appearance-settings task replaces the two iOS system.css imports with
class.css, leaving conditions, Vertical Bars and MD3 imports unchanged. Explain that this is
an intentional switch to application-controlled brightness. Device-palette selection remains
an independent preference. Validate the compiled CSS in iOS and MD modes with OS light/dark
and class absent/present, as well as the optional controller's fixed Light/Dark, so preserving
the trigger is checked rather than merely finding dark tokens in CSS.

## Automatic features are part of installation

Native presentation and device-layout synchronization already start in combined setup. They
must not appear as independent post-setup tasks. Remove the fake Save implementation and manual
layout preview, and keep their real acceptance criteria at the end of setup. Optional tasks
cover actual feature additions: appearance settings and custom native UI. Migration remains a
separate journey. Sponsorship is a separate navigation link outside guide categories. Old
native-ui and device-layout portal URLs redirect to the shared setup verification anchor in
all languages, replacing obsolete fragments. Package references remain available for specific
capabilities and configuration.
