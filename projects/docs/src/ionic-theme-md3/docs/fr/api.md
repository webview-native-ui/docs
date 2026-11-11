---
title: API
sourceRevision: "ad472863defb709d6e94b51b25c9a5d99baf4c63d390667aa75b2a1b6c5f5a29"
---

Référence de l’API JavaScript exportée par `@rdlabo/ionic-theme-md3` v9.2.2. Les points d’entrée CSS restent documentés dans le README.

## Animation

#### `function` mdTransitionAnimation

`(_: HTMLElement, opts: TransitionOptions) => Animation`

Construit la transition de navigation Material Design 3 pour Ionic.

## Couleurs dynamiques

#### `function` enableDynamicColors

`(options: DynamicColorThemeOptions) => Promise<DynamicColorTheme>`

Applique la palette sélectionnée à la racine du document. Gère les propriétés en ligne générées et la classe sombre jusqu’au nettoyage. Consultez [Couleurs dynamiques Android](/docs/dynamic-colors) pour la configuration, le cycle de vie et le comportement de repli.

#### `function` materialToIonicColors

`(scheme: MaterialColorScheme) => IonicColorVariables`

Convertit les rôles de couleur Material en variables CSS Ionic.

#### `function` materialToMd3Colors

`(scheme: Partial<Record<MaterialColorRole, string>>) => IonicColorVariables`

Convertit les rôles de couleur Material fournis en variables CSS MD3.

### Contrats de couleur publics

Le tableau public `materialColorRoles` répertorie les rôles pris en charge. `MaterialColorRole` est le type de ses éléments. Un `MaterialColorScheme` exige les six rôles ci-dessous ; les autres sont facultatifs.

```ts
type MaterialColorRole = (typeof materialColorRoles)[number];
interface MaterialColorScheme extends Partial<Record<MaterialColorRole, string>> {
  primary: string;
  secondary: string;
  tertiary: string;
  error: string;
  surface: string;
  onSurface: string;
}
type DynamicColorScheme = {
  available: false;
  systemDark: boolean;
} | {
  available: true;
  systemDark: boolean;
  light: MaterialColorScheme;
  dark: MaterialColorScheme;
};
type ColorMode = 'system' | 'light' | 'dark';
type IonicColorVariables = Record<string, string>;
```

Le contrôleur change le mode de couleur, actualise la palette et libère ses écouteurs et les styles qu’il gère.

```ts
interface DynamicColorThemeOptions {
  getScheme: () => Promise<DynamicColorScheme>;
  listen?: (listener: () => void) => Promise<{
    remove(): Promise<void>;
  }>;
  mode?: ColorMode;
  document?: Document;
  onError?: (error: unknown) => void;
}
interface DynamicColorTheme {
  setMode(mode: ColorMode): void;
  refresh(): Promise<void>;
  destroy(): Promise<void>;
}
```

## Icônes d’état des interrupteurs

#### `function` applyToggleStateIcons

`(toggle: HTMLElement) => Promise<() => void>`

Ajoute les icônes d’état Android Settings à un interrupteur Ionic déjà rendu. Les libellés activé/désactivé d’Ionic sont prioritaires. La fonction renvoyée supprime cet ajout. Consultez [Apparence Android Settings](/docs/android-settings).


## Préréglage de configuration du thème

#### `constant` md3ThemeConfig

`IonicConfig`

Un objet de configuration Ionic prêt à être déployé par spread. Déployez `md3ThemeConfig` par spread dans l’initialisation Ionic de votre framework, puis remplacez les propriétés individuelles si nécessaire. Consultez [Installer le thème](/docs/setup) et [Configurer le thème](/docs/configuration).
