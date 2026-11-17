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
| Add an appearance setting                         | `/guides/appearance`, portal                                                    | A user can choose Light, Dark and System through the existing appearance controller.                                |
| Use a built-in native control                     | `/guides/native-ui`, portal                                                     | The same Web action works in the supported native presentation and the Web fallback.                                |
| Adapt to device layout                            | `/guides/device-layout`, portal                                                 | Device notifications apply and remove layout space through one subscription.                                        |
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
- Appearance and built-in-control tasks provide concrete Angular, React and Vue page examples
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

| Scenario                                    | Acceptance condition                                                                                                                                                                                         |
| ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Angular / React / Vue combined installation | Each reader can identify the exact file, imports, initialization call and shell lifecycle; only one framework's example is needed and only the selected native projects are required.                        |
| Theme-only / HTML / Cordova                 | Each path is visible before combined installation and avoids unrelated prerequisites.                                                                                                                        |
| Appearance settings after route navigation  | All three framework pages wire their events explicitly. Existing startup is reused; opening/reopening settings does not create a second controller or duplicate actions.                                     |
| Native control action                       | It is clear where markup and handlers go; Web remains the source of behavior; iOS support, observable projection status and other-platform fallback are explicit; all three framework handlers are concrete. |
| Layout notification and reversal            | One listener updates from the resolver, removal restores normal layout, and a browser spacing preview is explicitly limited.                                                                                 |
| Custom component                            | The Web counter, reader, native registration and existing startup form one executable path separately for iOS and Android, including the change from the combined startup guard.                             |
| Migration                                   | A reader can identify applicable changes and verify completion without installing features they do not use.                                                                                                  |
| Navigation and localization                 | Home, sidebar, package entry, direct URLs and heading links agree; all four languages expose equivalent actions.                                                                                             |
| Desktop and mobile reading                  | Navigation and code stay usable without page-wide overflow.                                                                                                                                                  |

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
