---
title: "API"
sourceRevision: "79853cf34609291a52db228805498ee3189d34947e4265451775be1ed5abbfc8"
---
Referenz der von `@rdlabo/ionic-theme-ios26` v9.4.3 exportierten JavaScript-API. CSS- und Sass-Einstiegspunkte sind weiterhin im README dokumentiert.

## Effekte

#### `function` registerTabBarEffect

`(targetElement: HTMLElement) => registeredEffect | undefined`

Registriert den Liquid-Glass-Auswahleffekt für eine Ionic-Tab-Leiste.

#### `function` registerSegmentEffect

`(targetElement: HTMLElement) => registeredEffect | undefined`

Registriert den Liquid-Glass-Auswahleffekt für ein Ionic-Segment.

#### `interface` registeredEffect

| Mitglied        | Typ         | Beschreibung                                                    |
| ------------- | ------------ | -------------------------------------------------------------- |
| **`destroy`** | `() => void` | Entfernt Listener und Effektelemente, die durch die Registrierung erzeugt wurden. |

#### `interface` EffectScales

| Eigenschaft         | Typ     | Beschreibung               |
| ------------ | -------- | ------------------------- |
| **`small`**  | `string` | Kleine Effektskalierung.       |
| **`medium`** | `string` | Mittlere Effektskalierung.      |
| **`large`**  | `string` | Große Effektskalierung.       |
| **`xlarge`** | `string` | Sehr große Effektskalierung. |

## Durchsuchbare Tab-Leiste

#### `function` attachTabBarSearchable

`(ionTabBar: HTMLElement, ionFabButton: HTMLElement, ionFooter: HTMLElement) => TabBarSearchableFunction`

Bindet den Übergang für eine durchsuchbare Tab-Leiste an und gibt dessen Ereignishandler zurück.

#### `enum` TabBarSearchableType

| Mitglied      | Wert     | Beschreibung             |
| ----------- | --------- | ----------------------- |
| **`Enter`** | `"enter"` | Wechselt in den Suchmodus. |
| **`Leave`** | `"leave"` | Verlässt den Suchmodus. |

#### `type alias` TabBarSearchableFunction

`(event: Event, type: TabBarSearchableType) => Promise<void>`

## Animationen

#### `function` iosTransitionAnimation

`(navEl: HTMLElement, opts: TransitionOptions) => Animation`

Erstellt den iOS-Navigationsübergang des Pakets.

#### `function` popoverEnterAnimation

`(baseEl: HTMLElement, opts?: any) => Animation`

Erstellt die iOS-Popover-Eintrittsanimation.

#### `function` popoverLeaveAnimation

`(baseEl: HTMLElement) => Animation`

Erstellt die iOS-Popover-Austrittsanimation.

## Voreinstellung für die Theme-Konfiguration

#### `constant` ios26ThemeConfig

`IonicConfig`

Ein Ionic-Konfigurationsobjekt zur direkten Übernahme per Spread. Übernehmen Sie `ios26ThemeConfig` per Spread in die Ionic-Initialisierung Ihres Frameworks und überschreiben Sie anschließend bei Bedarf einzelne Eigenschaften. Siehe [Theme-Einrichtung](/docs/setup) und [Theme-Konfiguration](/docs/configuration).
