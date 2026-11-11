import type { DocsLocale } from '../shared/docs-locales';
import { METADATA_FR } from './locales/metadata.fr';
import { METADATA_DE } from './locales/metadata.de';

export type Locale = DocsLocale;

export interface LocalizedText {
  en: string;
  ja: string;
  fr?: string;
  de?: string;
}

export interface ProjectPageDefinition {
  title: LocalizedText;
  section: LocalizedText;
  slug: string;
  file: string;
  /** Optional intent-focused document title for SEO `<title>` metadata. */
  seoTitle?: LocalizedText;
  /** Optional intent-focused summary for SEO description metadata. */
  seoDescription?: LocalizedText;
  /** Optional explicit content update date (`YYYY-MM-DD`) for sitemap `<lastmod>`. */
  updatedAt?: Partial<Record<Locale, string>>;
  /**
   * When true, English generation reads this page from the portal local filesystem
   * (same path layout as Japanese) instead of fetching GitHub English sources.
   * Edit links use the portal path (`fromPackage: false`).
   */
  localEnglishSource?: boolean;
  /** English source fragments that differ from the portal renderer's heading IDs. */
  headingAliases?: Readonly<Record<string, string>>;
  demo?: {
    url: string;
    title: LocalizedText;
  };
}

export interface ProjectFeatureDefinition {
  icon?: string;
  title: LocalizedText;
  description: LocalizedText;
}

export type ProjectCategoryId =
  'translations' | 'capacitor-plugins' | 'cordova-plugins' | 'frontend-tools' | 'developer-tools';

export interface ProjectCategoryDefinition {
  id: ProjectCategoryId;
  label: LocalizedText;
  description: LocalizedText;
  order: number;
}

export interface ProjectDefinition {
  id: string;
  slug: string;
  sourceDirectory: string;
  name: string;
  shortName: string;
  localizedShortName?: LocalizedText;
  packageName: string;
  repositoryUrl: string;
  /** Optional branch or directory shown by public source links; API calls use repositoryUrl. */
  repositoryBrowseUrl?: string;
  /** Optional interactive demo linked from the project Overview. */
  demoUrl?: string;
  /** Optional link to a specific project release. */
  releaseNotesUrl?: string;
  /** Optional landing-page guide priorities; sidebar order remains unchanged. */
  entryGuideSlugs?: readonly string[];
  /** Hosted documentation URL for catalog-only projects that are not rendered by this portal. */
  hostedUrl?: string;
  category: ProjectCategoryId;
  icon: 'payments' | 'identity' | 'terminal' | 'ads' | 'lint' | 'server' | 'app' | 'theme' | 'docs';
  adapter?: 'capacitor-docs-json' | 'markdown';
  /** Immutable Git ref override for English guides (default: installed package tag). */
  englishDocsRef?: string;
  /** Immutable screenshot source when the npm release tag omits documentation assets. */
  englishDocsAssetsRef?: string;
  /** Historical source repository when reviewed guides predate a repository split. */
  englishDocsRepositoryUrl?: string;
  releaseTagPrefix?: string;
  englishDocsEditBranch?: string;
  /** Additional locales whose reviewed heading structure matches the package source. */
  sourceHeadingAliases?: readonly Locale[];
  /** Optional intent-focused document title for the project landing page SEO `<title>`. */
  seoTitle?: LocalizedText;
  description: LocalizedText;
  headline: LocalizedText;
  overview: LocalizedText;
  featuresHeading: LocalizedText;
  features: readonly ProjectFeatureDefinition[];
  pages: readonly ProjectPageDefinition[];
}

const text = (en: string, ja: string): LocalizedText => ({ en, ja });

export const projectCategoryDefinitions: readonly ProjectCategoryDefinition[] = [
  {
    id: 'frontend-tools',
    label: {
      en: 'Themes',
      ja: 'テーマ',
      fr: 'Thèmes',
      de: 'Themes',
    },
    description: {
      en: 'iOS and Material Design themes, motion, and layout for Ionic.',
      ja: 'Ionic向けのiOS・Material Designテーマ、アニメーション、レイアウトです。',
      fr: 'Thèmes iOS et Material Design, animations et mise en page pour Ionic.',
      de: 'iOS- und Material-Design-Themes, Animationen und Layout für Ionic.',
    },
    order: 10,
  },
  {
    id: 'capacitor-plugins',
    label: {
      en: 'Capacitor plugins',
      ja: 'Capacitorプラグイン',
      fr: 'Plugins Capacitor',
      de: 'Capacitor-Plugins',
    },
    description: {
      en: 'Native controls for Ionic and HTML apps through Capacitor.',
      ja: 'Capacitorを通じてIonic・HTMLアプリへネイティブコントロールを提供します。',
      fr: 'Contrôles natifs pour les applications Ionic et HTML via Capacitor.',
      de: 'Native Steuerelemente für Ionic- und HTML-Apps über Capacitor.',
    },
    order: 20,
  },
  {
    id: 'cordova-plugins',
    label: {
      en: 'Cordova plugins',
      ja: 'Cordovaプラグイン',
      fr: 'Plugins Cordova',
      de: 'Cordova-Plugins',
    },
    description: {
      en: 'Native UI adapters and bundled theme integration for Cordova apps.',
      ja: 'Cordovaアプリ向けのNative UIアダプターと同梱テーマ連携です。',
      fr: 'Adaptateurs Native UI et intégration du thème fourni pour les applications Cordova.',
      de: 'Native-UI-Adapter und Integration des mitgelieferten Themes für Cordova-Apps.',
    },
    order: 30,
  },
  {
    id: 'developer-tools',
    label: {
      en: 'Developer tools',
      ja: '開発ツール',
      fr: 'Outils de développement',
      de: 'Entwicklertools',
    },
    description: {
      en: 'Shared native UI placement and lifecycle for Capacitor and Cordova plugins.',
      ja: 'Capacitor・Cordovaプラグインで共有するネイティブUIの配置とライフサイクルを提供します。',
      fr: 'Placement et cycle de vie partagés des interfaces natives pour les plugins Capacitor et Cordova.',
      de: 'Gemeinsame Platzierung und Lebenszyklus nativer UI für Capacitor- und Cordova-Plugins.',
    },
    order: 40,
  },
];
interface PageOptions {
  seoTitle?: LocalizedText;
  seoDescription?: LocalizedText;
  updatedAt?: Partial<Record<Locale, string>>;
  localEnglishSource?: boolean;
  demo?: ProjectPageDefinition['demo'];
}

const page = (
  enTitle: string,
  jaTitle: string,
  slug: string,
  file: string,
  enSection: string,
  jaSection: string,
  options: PageOptions = {},
): ProjectPageDefinition => ({
  title: text(enTitle, jaTitle),
  section: text(enSection, jaSection),
  slug,
  file,
  ...options,
});

export const projectDefinitions: readonly ProjectDefinition[] = [
  {
    id: 'webview-native-ui-engine',
    slug: 'webview-native-ui-engine',
    sourceDirectory: 'webview-native-ui-engine',
    name: 'WebView Native UI Engine',
    shortName: 'WebView Native UI Engine',
    packageName: '@webview-native-ui/engine',
    repositoryUrl: 'https://github.com/webview-native-ui/engine',
    englishDocsRef: 'f4ad403a98536fb3f35269cb74326b880145540d',
    releaseNotesUrl: 'https://github.com/webview-native-ui/engine/releases/tag/v1.0.4',
    sourceHeadingAliases: ['ja'],
    category: 'developer-tools',
    icon: 'app',
    adapter: 'markdown',
    entryGuideSlugs: [
      'getting-started/initialization',
      'getting-started/capacitor',
      'getting-started/cordova',
    ],
    description: text(
      'Native UI placement, scroll tracking, and Web projection for Capacitor and Cordova plugin authors.',
      'Capacitor・Cordovaプラグイン開発者向けの、ネイティブUI配置・スクロール追従・Web投影ライブラリ。',
    ),
    headline: text(
      'Bring Native UI seamlessly into Web apps',
      'Native UIをWebアプリへシームレスに',
    ),
    overview: text(
      'Coordinate native controls and Web content across scrolling screens, transitions, and overlays on iOS and Android. Integrate the Engine into your plugin while retaining its renderer and public API.',
      'iOS・Androidのスクロール画面、画面遷移、オーバーレイでネイティブコントロールとWebコンテンツを連携させます。プラグインのレンダラーと公開APIを維持したままEngineを組み込めます。',
    ),
    featuresHeading: text('Features', '機能'),
    features: [],
    pages: [
      // Keep the package landing and docs/README.md distinct on case-insensitive filesystems.
      // getting-started.md falls back to the repository-root README; public URLs use page slugs.
      {
        title: text('Getting Started', 'はじめに'),
        section: text('Guides', 'ガイド'),
        slug: 'readme',
        file: 'getting-started.md',
        updatedAt: { en: '2026-11-09', ja: '2026-11-09', fr: '2026-11-09', de: '2026-11-09' },
      },
      {
        title: text('Documentation overview', 'ドキュメント概要'),
        section: text('Guides', 'ガイド'),
        slug: 'overview',
        file: 'README.md',
        updatedAt: { en: '2026-11-09', ja: '2026-11-09', fr: '2026-11-09', de: '2026-11-09' },
      },
      {
        title: text('Concepts and limits', '概念と制約'),
        section: text('Guides', 'ガイド'),
        slug: 'concepts',
        file: 'concepts.md',
        updatedAt: { en: '2026-11-01', ja: '2026-11-01', fr: '2026-11-01', de: '2026-11-01' },
      },
      {
        title: {
          en: 'Shared controls for native adapters',
          ja: 'ネイティブアダプターの共有コントロール',
          fr: 'Contrôles partagés pour les adaptateurs natifs',
          de: 'Gemeinsame Steuerelemente für native Adapter',
        },
        section: text('Guides', 'ガイド'),
        slug: 'controls',
        file: 'controls.md',
        updatedAt: { en: '2026-11-09', ja: '2026-11-09', fr: '2026-11-09', de: '2026-11-09' },
      },
      {
        title: text('Basic initialization', '基本的な初期化'),
        section: text('Integration', '組み込み'),
        slug: 'getting-started/initialization',
        file: 'getting-started/initialization.md',
        updatedAt: { en: '2026-11-01', ja: '2026-11-01', fr: '2026-11-01', de: '2026-11-01' },
      },
      {
        title: text('Capacitor plugin integration', 'Capacitorプラグインへの組み込み'),
        section: text('Integration', '組み込み'),
        slug: 'getting-started/capacitor',
        file: 'getting-started/capacitor.md',
        updatedAt: { en: '2026-11-01', ja: '2026-11-01', fr: '2026-11-01', de: '2026-11-01' },
      },
      {
        title: text('Cordova plugin integration', 'Cordovaプラグインへの組み込み'),
        section: text('Integration', '組み込み'),
        slug: 'getting-started/cordova',
        file: 'getting-started/cordova.md',
        updatedAt: { en: '2026-11-01', ja: '2026-11-01', fr: '2026-11-01', de: '2026-11-01' },
      },
      {
        title: text('Registration settings', '登録設定'),
        section: text('Configuration', '設定'),
        slug: 'configuration',
        file: 'configuration/README.md',
        updatedAt: { en: '2026-11-09', ja: '2026-11-09', fr: '2026-11-09', de: '2026-11-09' },
      },
      {
        title: text('Notifications', '通知'),
        section: text('Configuration', '設定'),
        slug: 'configuration/events',
        file: 'configuration/events.md',
        updatedAt: { en: '2026-10-29', ja: '2026-10-29', fr: '2026-10-29', de: '2026-10-29' },
      },
      {
        title: text('Value bindings', '値のバインディング'),
        section: text('Configuration', '設定'),
        slug: 'configuration/values',
        file: 'configuration/values.md',
        updatedAt: { en: '2026-10-29', ja: '2026-10-29', fr: '2026-10-29', de: '2026-10-29' },
      },
      {
        title: text('Capture timing', 'キャプチャのタイミング'),
        section: text('Configuration', '設定'),
        slug: 'configuration/capture',
        file: 'configuration/capture.md',
        updatedAt: { en: '2026-10-29', ja: '2026-10-29', fr: '2026-10-29', de: '2026-10-29' },
      },
      {
        title: text('Ionic overlays', 'Ionicオーバーレイ'),
        section: text('Configuration', '設定'),
        slug: 'configuration/ionic-overlays',
        file: 'configuration/ionic-overlays.md',
        updatedAt: { en: '2026-11-01', ja: '2026-11-01', fr: '2026-11-01', de: '2026-11-01' },
      },
      {
        title: {
          en: 'Custom overlay pause and resume',
          ja: 'カスタムオーバーレイの一時停止と再開',
          fr: 'Pause et reprise pour les superpositions personnalisées',
          de: 'Pause und Fortsetzung bei benutzerdefinierten Overlays',
        },
        section: text('Guides', 'ガイド'),
        slug: 'configuration/pause-resume',
        file: 'configuration/pause-resume.md',
        updatedAt: { en: '2026-11-09', ja: '2026-11-09', fr: '2026-11-09', de: '2026-11-09' },
      },
      {
        title: text('Choose an advanced API', '高度なAPIの選択'),
        section: text('Advanced APIs', '高度なAPI'),
        slug: 'advanced',
        file: 'advanced/README.md',
        updatedAt: { en: '2026-10-29', ja: '2026-10-29', fr: '2026-10-29', de: '2026-10-29' },
      },
      {
        title: text('Page and modal surfaces', 'ページとモーダルのサーフェス'),
        section: text('Advanced APIs', '高度なAPI'),
        slug: 'advanced/renderer',
        file: 'advanced/renderer.md',
        updatedAt: { en: '2026-10-29', ja: '2026-10-29', fr: '2026-10-29', de: '2026-10-29' },
      },
      {
        title: text('Web projection and batches', 'Web投影とバッチ'),
        section: text('Advanced APIs', '高度なAPI'),
        slug: 'advanced/web-projection',
        file: 'advanced/web-projection.md',
        updatedAt: { en: '2026-11-09', ja: '2026-11-09', fr: '2026-11-09', de: '2026-11-09' },
      },
      {
        title: text('Native handoff', 'ネイティブのハンドオフ'),
        section: text('Advanced APIs', '高度なAPI'),
        slug: 'advanced/native-handoff',
        file: 'advanced/native-handoff.md',
        updatedAt: { en: '2026-11-09', ja: '2026-11-09', fr: '2026-11-09', de: '2026-11-09' },
      },
      {
        title: text('Deferred Android placement', 'Androidの配置の遅延適用'),
        section: text('Advanced APIs', '高度なAPI'),
        slug: 'advanced/android-placement',
        file: 'advanced/android-placement.md',
        headingAliases: {
          'final-placement-when-returning-from-an-opaque-image-android':
            'final-placement-when-returning-from-an-opaque-image-(android)',
        },
        updatedAt: { en: '2026-10-29', ja: '2026-10-29', fr: '2026-10-29', de: '2026-10-29' },
      },
      {
        title: text('Update serialization and recovery', '更新の直列化と復旧'),
        section: text('Advanced APIs', '高度なAPI'),
        slug: 'advanced/update-queue',
        file: 'advanced/update-queue.md',
        updatedAt: { en: '2026-10-29', ja: '2026-10-29', fr: '2026-10-29', de: '2026-10-29' },
      },
      {
        title: text('Projection contract and lifetime', '投影の契約とライフタイム'),
        section: text('Reference', 'リファレンス'),
        slug: 'reference/projection',
        file: 'reference/projection.md',
        updatedAt: { en: '2026-11-01', ja: '2026-11-01', fr: '2026-11-01', de: '2026-11-01' },
      },
      {
        title: text('Projection container support', '投影コンテナの対応状況'),
        section: text('Reference', 'リファレンス'),
        slug: 'reference/containers',
        file: 'reference/containers.md',
        updatedAt: { en: '2026-10-29', ja: '2026-10-29', fr: '2026-10-29', de: '2026-10-29' },
      },
      {
        title: text('Observable presentation intent', '表示意図の観測'),
        section: text('Reference', 'リファレンス'),
        slug: 'reference/state',
        file: 'reference/state.md',
        updatedAt: { en: '2026-10-29', ja: '2026-10-29', fr: '2026-10-29', de: '2026-10-29' },
      },
      {
        title: text('Capture and platform limits', 'キャプチャとプラットフォームの制約'),
        section: text('Reference', 'リファレンス'),
        slug: 'reference/platforms',
        file: 'reference/platforms.md',
        updatedAt: { en: '2026-11-01', ja: '2026-11-01', fr: '2026-11-01', de: '2026-11-01' },
      },
      {
        title: text('Development and releases', '開発とリリース'),
        section: text('Guides', 'ガイド'),
        slug: 'maintenance',
        file: 'maintenance.md',
        updatedAt: { en: '2026-10-29', ja: '2026-10-29', fr: '2026-10-29', de: '2026-10-29' },
      },
    ],
  },
  {
    id: 'ionic-theme-ios27',
    sourceHeadingAliases: ['ja'],
    slug: 'ionic-theme-ios27',
    sourceDirectory: 'ionic-theme-ios27',
    name: 'rdlabo Ionic Theme iOS27',
    shortName: 'Ionic Theme iOS27',
    packageName: '@rdlabo/ionic-theme-ios27',
    repositoryUrl: 'https://github.com/webview-native-ui/ionic-theme-ios27',
    englishDocsRef: '93a492a8f82157a30d5f590c0b5b269cf2730d0f',
    englishDocsAssetsRef: 'c70beb9d1e5b39de696b2b2c47a3d9bc5ffcdfbe',
    releaseNotesUrl: 'https://github.com/webview-native-ui/ionic-theme-ios27/releases/tag/v2.1.3',
    demoUrl: 'https://ionic-theme-ios27.rdlabo.dev/',
    category: 'frontend-tools',
    icon: 'theme',
    adapter: 'markdown',
    description: text(
      'iOS 27 styling, motion, and Web layout for Ionic.',
      'Ionic向けのiOS 27スタイル、アニメーション、Webレイアウト。',
    ),
    headline: text('Ionic Theme iOS27', 'Ionic Theme iOS27'),
    overview: text(
      'Apply Liquid Glass, animations, and device-driven layouts to Ionic. Add the separate Capacitor Native UI plugin when you need native controls.',
      'IonicにLiquid Glass、アニメーション、デバイスに応じたレイアウトを適用します。ネイティブコントロールが必要な場合は、独立したCapacitor Native UIプラグインを追加できます。',
    ),
    featuresHeading: text('Features', '機能'),
    features: [],
    pages: [
      {
        title: text('Getting Started', 'はじめに'),
        section: text('Guides', 'ガイド'),
        slug: 'readme',
        file: 'readme.md',
        updatedAt: { en: '2026-11-11', ja: '2026-11-11', fr: '2026-11-11', de: '2026-11-11' },
      },
      {
        title: {
          en: 'Theme setup',
          ja: 'テーマのセットアップ',
          fr: 'Configurer le thème',
          de: 'Theme einrichten',
        },
        section: text('Guides', 'ガイド'),
        slug: 'setup',
        file: 'setup.md',
        headingAliases: {
          'choose-one-dark-mode-pair': '2.-load-one-stylesheet',
          '3-configure-ionic-animations': '3.-pass-theme-configuration-to-ionic',
          '3-pass-theme-configuration-to-ionic': '3.-pass-theme-configuration-to-ionic',
        },
        updatedAt: { en: '2026-11-11', ja: '2026-11-11', fr: '2026-11-11', de: '2026-11-11' },
      },
      {
        title: {
          en: 'Theme configuration',
          ja: 'テーマの設定',
          fr: 'Configuration du thème',
          de: 'Theme-Konfiguration',
        },
        section: {
          en: 'Guides',
          ja: 'ガイド',
          fr: 'Guides',
          de: 'Anleitungen',
        },
        slug: 'configuration',
        file: 'configuration.md',
        updatedAt: {
          en: '2026-11-11',
          ja: '2026-11-11',
          fr: '2026-11-11',
          de: '2026-11-11',
        },
      },
      {
        title: {
          en: 'Cordova setup',
          ja: 'Cordova のセットアップ',
          fr: 'Configuration Cordova',
          de: 'Cordova einrichten',
        },
        section: text('Guides', 'ガイド'),
        slug: 'cordova',
        file: 'cordova.md',
        updatedAt: { en: '2026-11-11', ja: '2026-11-11', fr: '2026-11-11', de: '2026-11-11' },
      },
      {
        title: text('Adaptive themes', 'テーマの自動切り替え'),
        section: text('Guides', 'ガイド'),
        slug: 'adaptive-themes',
        file: 'adaptive-themes.md',
        updatedAt: { en: '2026-11-11', ja: '2026-11-11', fr: '2026-11-11', de: '2026-11-11' },
      },
      {
        title: text('Add Native UI', 'Native UIの追加'),
        section: text('Guides', 'ガイド'),
        slug: 'add-native-ui',
        file: 'add-native-ui.md',
        updatedAt: { en: '2026-11-09', ja: '2026-11-09', fr: '2026-11-09', de: '2026-11-09' },
      },
      {
        title: text('Using ion-item-group', 'ion-item-groupの使用方法'),
        section: text('Guides', 'ガイド'),
        slug: 'using-ion-item-group',
        file: 'using-ion-item-group.md',
        updatedAt: { en: '2026-11-09', ja: '2026-11-09', fr: '2026-11-09', de: '2026-11-09' },
      },
      {
        title: text('Special markup and classes', '特別なマークアップとクラス'),
        section: text('Guides', 'ガイド'),
        slug: 'special-markup',
        file: 'special-markup.md',
        updatedAt: { en: '2026-10-22', ja: '2026-10-22', fr: '2026-10-22', de: '2026-10-22' },
      },
      {
        title: text('Keep lists consistent with ESLint', 'ESLintでリストの構造を整える'),
        section: text('Guides', 'ガイド'),
        slug: 'eslint',
        file: 'eslint.md',
        updatedAt: { en: '2026-10-22', ja: '2026-10-22', fr: '2026-10-22', de: '2026-10-22' },
      },
      {
        title: text('Features', '機能'),
        section: text('Guides', 'ガイド'),
        slug: 'features',
        file: 'features.md',
        updatedAt: { en: '2026-10-22', ja: '2026-10-22', fr: '2026-10-22', de: '2026-10-22' },
      },
      {
        title: text('Animation', 'アニメーション'),
        section: text('Guides', 'ガイド'),
        slug: 'animation',
        file: 'animation.md',
        updatedAt: { en: '2026-10-22', ja: '2026-10-22', fr: '2026-10-22', de: '2026-10-22' },
      },
      {
        title: text('Vertical Bars layout', 'Vertical Barsのレイアウト'),
        section: text('Guides', 'ガイド'),
        slug: 'vertical-bars-layout',
        file: 'vertical-bars-layout.md',
        updatedAt: { en: '2026-11-09', ja: '2026-11-09', fr: '2026-11-09', de: '2026-11-09' },
      },
      {
        title: text('Theme migration', 'テーマの移行'),
        section: text('Guides', 'ガイド'),
        slug: 'migration',
        file: 'migration.md',
        headingAliases: { 'optional-simplify-the-setup': 'optional%3A-simplify-the-setup' },
        updatedAt: { en: '2026-11-11', ja: '2026-11-11', fr: '2026-11-11', de: '2026-11-11' },
      },
    ],
  },
  {
    id: 'capacitor-native-ui',
    sourceHeadingAliases: ['ja'],
    slug: 'capacitor-native-ui',
    sourceDirectory: 'capacitor-native-ui',
    name: 'Capacitor Native UI',
    shortName: 'Capacitor Native UI',
    packageName: '@rdlabo/capacitor-native-ui',
    repositoryUrl: 'https://github.com/webview-native-ui/capacitor-plugin',
    englishDocsRef: '8588512d51324d9c6aab672da45a6598edf71927',
    releaseNotesUrl: 'https://github.com/webview-native-ui/capacitor-plugin/releases/tag/v2.1.4',
    demoUrl: 'https://ionic-theme-ios27.rdlabo.dev/',
    category: 'capacitor-plugins',
    icon: 'app',
    adapter: 'markdown',
    description: text(
      'Native controls for Ionic and HTML apps, with Web-owned state and events.',
      'Web側の状態とイベントを維持する、Ionic／HTMLアプリ向けのNative UI。',
    ),
    headline: text('Capacitor Native UI', 'Capacitor Native UI'),
    overview: text(
      'Project supported Ionic and HTML controls into UIKit and SwiftUI on iOS. Keep your theme and Web fallback; app-local SwiftUI and Android Compose extensions are experimental.',
      '対応するIonic／HTMLコントロールをiOSのUIKitとSwiftUIで描画します。既存テーマとWebフォールバックを維持でき、アプリ内のSwiftUI／Android Compose拡張は実験的機能です。',
    ),
    featuresHeading: text('Features', '機能'),
    features: [],
    pages: [
      {
        title: text('Getting Started', 'はじめに'),
        section: text('Guides', 'ガイド'),
        slug: 'readme',
        file: 'readme.md',
        updatedAt: { en: '2026-11-09', ja: '2026-11-09', fr: '2026-11-09', de: '2026-11-09' },
      },
      {
        title: text('Ionic setup', 'Ionicの設定'),
        section: text('Guides', 'ガイド'),
        slug: 'setup',
        file: 'setup.md',
        headingAliases: {
          'place-startup-in-your-frameworks-app-root': "place-startup-in-your-framework's-app-root",
          '4-build-sync-and-run': '4.-build%2C-sync%2C-and-run',
        },
        updatedAt: { en: '2026-11-09', ja: '2026-11-09', fr: '2026-11-09', de: '2026-11-09' },
      },
      {
        title: text('Native UI without Ionic', 'Ionicを使わないNative UI'),
        section: text('Guides', 'ガイド'),
        slug: 'framework-independent',
        file: 'framework-independent.md',
        headingAliases: { '2-mark-source-controls': '2.-mark-source-controls' },
        updatedAt: { en: '2026-11-09', ja: '2026-11-09', fr: '2026-11-09', de: '2026-11-09' },
      },
      {
        title: text(
          'Add Vertical Bars while keeping your theme',
          '既存テーマへのVertical Barsの追加',
        ),
        section: text('Guides', 'ガイド'),
        slug: 'ionic-vertical-bars',
        file: 'ionic-vertical-bars.md',
        headingAliases: {
          '2-connect-your-navigation-animation': '2.-connect-your-navigation-animation',
          'keep-ionics-default-animation': "keep-ionic's-default-animation",
          'use-the-themes-ios-animation': "use-the-theme's-ios-animation",
        },
        updatedAt: { en: '2026-11-09', ja: '2026-11-09', fr: '2026-11-09', de: '2026-11-09' },
      },
      {
        title: text('Native UI', 'Native UI'),
        section: text('Guides', 'ガイド'),
        slug: 'native-ui',
        file: 'native-ui.md',
        updatedAt: { en: '2026-11-09', ja: '2026-11-09', fr: '2026-11-09', de: '2026-11-09' },
      },
      {
        title: text('Configuration', '設定'),
        section: text('Guides', 'ガイド'),
        slug: 'configuration',
        file: 'configuration.md',
        updatedAt: { en: '2026-10-23', ja: '2026-10-23', fr: '2026-10-23', de: '2026-10-23' },
      },
      {
        title: text('Light and dark appearance', 'ライト／ダーク表示'),
        section: text('Guides', 'ガイド'),
        slug: 'appearance',
        file: 'appearance.md',
        updatedAt: { en: '2026-11-09', ja: '2026-11-09', fr: '2026-11-09', de: '2026-11-09' },
      },
      {
        title: {
          en: 'Android dynamic colors',
          ja: 'Androidの動的な配色',
          fr: 'Couleurs dynamiques Android',
          de: 'Dynamische Android-Farben',
        },
        section: text('Guides', 'ガイド'),
        slug: 'dynamic-colors',
        file: 'dynamic-colors.md',
        updatedAt: { en: '2026-11-09', ja: '2026-11-09', fr: '2026-11-09', de: '2026-11-09' },
      },
      {
        title: text('Vertical Bars', 'Vertical Bars'),
        section: text('Guides', 'ガイド'),
        slug: 'vertical-bars',
        file: 'vertical-bars.md',
        updatedAt: { en: '2026-11-09', ja: '2026-11-09', fr: '2026-11-09', de: '2026-11-09' },
      },
      {
        title: text(
          'App-local Native UI extensions (experimental)',
          'アプリ内のNative UI拡張（実験的）',
        ),
        section: text('Guides', 'ガイド'),
        slug: 'native-ui-extensions',
        file: 'native-ui-extensions.md',
        headingAliases: {
          '2a-register-a-swiftui-view-on-ios': '2a.-register-a-swiftui-view-on-ios',
          '2b-register-compose-content-on-android': '2b.-register-compose-content-on-android',
        },
        updatedAt: { en: '2026-11-09', ja: '2026-11-09', fr: '2026-11-09', de: '2026-11-09' },
      },
      {
        title: text('Migration', '移行'),
        section: text('Guides', 'ガイド'),
        slug: 'migration',
        file: 'migration.md',
        headingAliases: {
          '2-replace-native-imports': '2.-replace-native-imports',
          '3-sync-the-native-project': '3.-sync-the-native-project',
        },
        updatedAt: { en: '2026-11-09', ja: '2026-11-09', fr: '2026-11-09', de: '2026-11-09' },
      },
    ],
  },
  {
    id: 'ionic-theme-ios26',
    sourceHeadingAliases: ['ja'],
    slug: 'ionic-theme-ios26',
    sourceDirectory: 'ionic-theme-ios26',
    name: 'rdlabo Ionic Theme iOS26',
    shortName: 'Ionic Theme iOS26',
    packageName: '@rdlabo/ionic-theme-ios26',
    repositoryUrl: 'https://github.com/webview-native-ui/ionic-theme-ios27',
    // Reviewed documentation from ios26, independently of the npm release.
    englishDocsRef: '19a8418e42cf6c0af35c0fcf20c6b60236545054',
    repositoryBrowseUrl: 'https://github.com/webview-native-ui/ionic-theme-ios27/tree/ios26',
    englishDocsEditBranch: 'ios26',
    demoUrl: 'https://ionic-theme-ios26.rdlabo.dev/',
    releaseNotesUrl:
      'https://github.com/webview-native-ui/ionic-theme-ios27/releases/tag/ios26-v9.4.3',
    releaseTagPrefix: 'ios26-v',
    category: 'frontend-tools',
    icon: 'theme',
    adapter: 'markdown',
    description: text(
      'iOS 26 design styling for Ionic applications.',
      'Ionicアプリ向けのiOS 26デザインスタイル。',
    ),
    headline: text('Bring iOS 26 design to Ionic apps', 'IonicアプリにiOS 26デザインを取り入れる'),
    overview: text(
      'Apply iOS 26 CSS, transitions, and Liquid Glass interactions to Ionic components, with dark mode and selective migration support.',
      'IonicコンポーネントへiOS 26のCSS、トランジション、Liquid Glassインタラクションを適用し、ダークモードと段階的な移行にも対応します。',
    ),
    featuresHeading: text('Theme capabilities', 'テーマの機能'),
    features: [
      {
        icon: 'layout',
        title: text('iOS 26 CSS and design', 'iOS 26のCSSとデザイン'),
        description: text(
          'Restyle Ionic components to follow the latest iOS 26 design language.',
          'Ionicコンポーネントを最新のiOS 26デザイン言語に合わせて再スタイルします。',
        ),
      },
      {
        icon: 'motion',
        title: text('Transitions and Liquid Glass', 'トランジションとLiquid Glass'),
        description: text(
          'Use iOS-oriented navigation animations and Liquid Glass interaction effects.',
          'iOS向けのナビゲーションアニメーションとLiquid Glassのインタラクション効果を利用します。',
        ),
      },
      {
        icon: 'dark',
        title: text('Dark mode and selective migration', 'ダークモードと段階的移行'),
        description: text(
          'Adopt dark-mode styles and migrate component by component when needed.',
          '必要に応じてダークモードスタイルを導入し、コンポーネント単位で移行できます。',
        ),
      },
    ],
    pages: [
      page('Getting Started', 'はじめに', 'readme', 'readme.md', 'Quickstart', 'クイックスタート', {
        updatedAt: text('2026-09-30', '2026-09-30'),
      }),
      {
        title: {
          en: 'Theme setup',
          ja: 'テーマのセットアップ',
          fr: 'Configurer le thème',
          de: 'Theme einrichten',
        },
        section: {
          en: 'Guides',
          ja: 'ガイド',
          fr: 'Guides',
          de: 'Anleitungen',
        },
        slug: 'setup',
        file: 'setup.md',
        updatedAt: {
          en: '2026-11-11',
          ja: '2026-11-11',
          fr: '2026-11-11',
          de: '2026-11-11',
        },
      },
      {
        title: {
          en: 'Theme configuration',
          ja: 'テーマの設定',
          fr: 'Configuration du thème',
          de: 'Theme-Konfiguration',
        },
        section: {
          en: 'Guides',
          ja: 'ガイド',
          fr: 'Guides',
          de: 'Anleitungen',
        },
        slug: 'configuration',
        file: 'configuration.md',
        updatedAt: {
          en: '2026-11-11',
          ja: '2026-11-11',
          fr: '2026-11-11',
          de: '2026-11-11',
        },
      },
      page(
        'Using ion-item-group',
        'ion-item-groupの使用方法',
        'using-ion-item-group',
        'using-ion-item-group.md',
        'Guides',
        'ガイド',
        { updatedAt: text('2026-09-06', '2026-09-06') },
      ),
      page(
        'Special markup and classes',
        '特別なマークアップとクラス',
        'special-markup',
        'special-markup.md',
        'Guides',
        'ガイド',
        { updatedAt: text('2026-09-30', '2026-10-01') },
      ),
      page(
        'Keep lists consistent with ESLint',
        'ESLintでリストの構造を整える',
        'eslint',
        'eslint.md',
        'Guides',
        'ガイド',
        {
          seoTitle: text(
            'Check Ionic iOS 26 list markup with ESLint | rdlabo',
            'Ionic iOS 26のリスト構造をESLintで検査 | rdlabo',
          ),
          seoDescription: text(
            'Catch missing item groups in Ionic Angular templates with a focused ESLint rule for the iOS 26 theme.',
            'iOS 26テーマ向けのESLintルールで、Ionic Angularテンプレートのリストグループ漏れを検出します。',
          ),
          updatedAt: text('2026-09-06', '2026-09-06'),
        },
      ),
      page('Features', '機能', 'features', 'features.md', 'Guides', 'ガイド'),
      page(
        'Experimental Animation',
        '実験的なアニメーション',
        'experimental-animation',
        'experimental-animation.md',
        'Guides',
        'ガイド',
      ),
      page('iOS 18', 'iOS 18', 'ios-18', 'ios-18.md', 'Guides', 'ガイド'),
      page('Migration', '移行', 'migration', 'migration.md', 'Guides', 'ガイド', {
        headingAliases: { 'optional-simplify-the-setup': 'optional%3A-simplify-the-setup' },
        updatedAt: { en: '2026-11-11', ja: '2026-11-11', fr: '2026-11-11', de: '2026-11-11' },
      }),
      page(
        'E2E screenshot testing',
        'E2Eスクリーンショットテスト',
        'e2e-testing',
        'e2e-testing.md',
        'Development',
        '開発',
        { updatedAt: text('2026-09-30', '2026-09-30') },
      ),
      page('API', 'API', 'api', 'api.md', 'Reference', 'リファレンス', {
        localEnglishSource: true,
        updatedAt: { en: '2026-11-11', ja: '2026-11-11', fr: '2026-11-11', de: '2026-11-11' },
      }),
    ],
  },
  {
    id: 'ionic-theme-md3',
    sourceHeadingAliases: ['ja'],
    slug: 'ionic-theme-md3',
    sourceDirectory: 'ionic-theme-md3',
    name: 'rdlabo Ionic Theme Material Design 3',
    shortName: 'Ionic Theme MD3',
    packageName: '@rdlabo/ionic-theme-md3',
    repositoryUrl: 'https://github.com/webview-native-ui/ionic-theme-md3',
    // Reviewed documentation from main, independently of the npm release.
    englishDocsRef: '45e00998d64b4806428d282cecdedbaa4f44fc6f',
    demoUrl: 'https://ionic-theme-md3.rdlabo.dev/',
    releaseNotesUrl: 'https://github.com/webview-native-ui/ionic-theme-md3/releases/tag/v9.2.1',
    category: 'frontend-tools',
    icon: 'theme',
    adapter: 'markdown',
    description: text(
      'Material Design 3 styling for Ionic applications.',
      'Ionicアプリ向けのMaterial Design 3スタイル。',
    ),
    headline: text(
      'Bring Material Design 3 to Ionic apps',
      'IonicアプリにMaterial Design 3を取り入れる',
    ),
    overview: text(
      'Apply Material Design 3 styling to Ionic while keeping markup compatible with the iOS 26 theme and shared transition animations.',
      'iOS 26テーマと共通のマークアップ互換性を保ちつつ、IonicへMaterial Design 3スタイルとトランジションアニメーションを適用します。',
    ),
    featuresHeading: text('Theme capabilities', 'テーマの機能'),
    features: [
      {
        icon: 'layout',
        title: text('Material Design 3 styling', 'Material Design 3スタイル'),
        description: text(
          'Update Ionic components to follow Material Design 3 guidelines.',
          'IonicコンポーネントをMaterial Design 3ガイドラインに合わせて更新します。',
        ),
      },
      {
        icon: 'layers',
        title: text('iOS 26-compatible markup', 'iOS 26互換マークアップ'),
        description: text(
          'Share one HTML structure with `@rdlabo/ionic-theme-ios26` across platforms.',
          'プラットフォームをまたぎ `@rdlabo/ionic-theme-ios26` と同じHTML構造を共有します。',
        ),
      },
      {
        icon: 'motion',
        title: text('Transition animation', 'トランジションアニメーション'),
        description: text(
          'Configure MD3 navigation transitions for non-iOS platforms.',
          '非iOSプラットフォーム向けにMD3のナビゲーショントランジションを設定します。',
        ),
      },
    ],
    pages: [
      page('Getting Started', 'はじめに', 'readme', 'readme.md', 'Documentation', 'ドキュメント', {
        updatedAt: { en: '2026-11-11', ja: '2026-11-11', fr: '2026-11-11', de: '2026-11-11' },
      }),
      {
        title: {
          en: 'Theme setup',
          ja: 'テーマのセットアップ',
          fr: 'Configurer le thème',
          de: 'Theme einrichten',
        },
        section: {
          en: 'Guides',
          ja: 'ガイド',
          fr: 'Guides',
          de: 'Anleitungen',
        },
        slug: 'setup',
        file: 'setup.md',
        updatedAt: {
          en: '2026-11-11',
          ja: '2026-11-11',
          fr: '2026-11-11',
          de: '2026-11-11',
        },
      },
      {
        title: {
          en: 'Theme configuration',
          ja: 'テーマの設定',
          fr: 'Configuration du thème',
          de: 'Theme-Konfiguration',
        },
        section: {
          en: 'Guides',
          ja: 'ガイド',
          fr: 'Guides',
          de: 'Anleitungen',
        },
        slug: 'configuration',
        file: 'configuration.md',
        updatedAt: {
          en: '2026-11-11',
          ja: '2026-11-11',
          fr: '2026-11-11',
          de: '2026-11-11',
        },
      },
      {
        title: {
          en: 'Android Settings appearance',
          ja: 'Android Settings の外観',
          fr: 'Apparence Android Settings',
          de: 'Android Settings-Darstellung',
        },
        section: text('Guides', 'ガイド'),
        slug: 'android-settings',
        file: 'android-settings.md',
        headingAliases: { 'default-font-css-only': 'default-font%2C-css-only' },
        updatedAt: { en: '2026-11-11', ja: '2026-11-11', fr: '2026-11-11', de: '2026-11-11' },
      },
      {
        title: {
          en: 'Android dynamic colors',
          ja: 'Android の動的な色',
          fr: 'Couleurs dynamiques Android',
          de: 'Dynamische Android-Farben',
        },
        section: text('Guides', 'ガイド'),
        slug: 'dynamic-colors',
        file: 'dynamic-colors.md',
        updatedAt: { en: '2026-11-11', ja: '2026-11-11', fr: '2026-11-11', de: '2026-11-11' },
      },
      {
        title: {
          en: 'Color system',
          ja: 'カラーシステム',
          fr: 'Système de couleurs',
          de: 'Farbsystem',
        },
        section: text('Guides', 'ガイド'),
        slug: 'color-system',
        file: 'color-system.md',
        updatedAt: { en: '2026-11-11', ja: '2026-11-11', fr: '2026-11-11', de: '2026-11-11' },
      },
      page(
        'Using ion-item-group',
        'ion-item-groupの使用方法',
        'using-ion-item-group',
        'using-ion-item-group.md',
        'Guides',
        'ガイド',
        { updatedAt: { en: '2026-11-09', ja: '2026-11-09', fr: '2026-11-09', de: '2026-11-09' } },
      ),
      page(
        'Special markup',
        '特別なマークアップ',
        'special-markup',
        'special-markup.md',
        'Guides',
        'ガイド',
        { updatedAt: { en: '2026-11-09', ja: '2026-11-09', fr: '2026-11-09', de: '2026-11-09' } },
      ),
      page(
        'Keep lists consistent with ESLint',
        'ESLintでリストの構造を整える',
        'eslint',
        'eslint.md',
        'Guides',
        'ガイド',
        {
          seoTitle: text(
            'Check Ionic Material Design 3 lists with ESLint | rdlabo',
            'Ionic Material Design 3のリスト構造をESLintで検査 | rdlabo',
          ),
          seoDescription: text(
            'Check Ionic Angular list grouping for the Material Design 3 theme with ESLint, locally and in CI.',
            'Material Design 3テーマのIonic Angularリスト構造を、ESLintでローカルとCIから検査します。',
          ),
          updatedAt: text('2026-09-06', '2026-09-06'),
        },
      ),
      page('Migration', '移行', 'migration', 'migration.md', 'Guides', 'ガイド', {
        headingAliases: {
          'optional-simplify-the-setup': 'optional%3A-simplify-the-setup',
          'unreleased-android-settings-alignment':
            'migrating-to-9.2.0%3A-android-settings-alignment',
          'migrating-to-920-android-settings-alignment':
            'migrating-to-9.2.0%3A-android-settings-alignment',
        },
        updatedAt: { en: '2026-11-11', ja: '2026-11-11', fr: '2026-11-11', de: '2026-11-11' },
      }),
      page(
        'E2E screenshot testing',
        'E2Eスクリーンショットテスト',
        'e2e-testing',
        'e2e-testing.md',
        'Development',
        '開発',
        { updatedAt: { en: '2026-11-09', ja: '2026-11-09', fr: '2026-11-09', de: '2026-11-09' } },
      ),
      page('API', 'API', 'api', 'api.md', 'Reference', 'リファレンス', {
        localEnglishSource: true,
        updatedAt: { en: '2026-11-11', ja: '2026-11-11', fr: '2026-11-11', de: '2026-11-11' },
      }),
    ],
  },
  {
    id: 'cordova-native-ui',
    slug: 'cordova-native-ui',
    sourceDirectory: 'cordova-native-ui',
    name: 'Cordova Native UI',
    shortName: 'Cordova Native UI',
    packageName: '@webview-native-ui/cordova-plugin',
    repositoryUrl: 'https://github.com/webview-native-ui/cordova-plugin',
    englishDocsRef: '5ac3c7e2754c55c3ffde2e90b3d54ad10152362a',
    releaseNotesUrl: 'https://github.com/webview-native-ui/cordova-plugin/releases/tag/v0.1.1',
    category: 'cordova-plugins',
    icon: 'app',
    adapter: 'markdown',
    description: {
      en: 'Native UI for Cordova, with standard HTML and optional Ionic theme integration.',
      ja: '標準HTMLと任意のIonicテーマ連携に対応するCordova向けNative UI。',
      fr: 'Native UI pour Cordova, avec HTML standard et intégration facultative du thème Ionic.',
      de: 'Native UI für Cordova mit Standard-HTML und optionaler Ionic-Theme-Integration.',
    },
    headline: {
      en: 'Bring Native UI to your Cordova app',
      ja: 'CordovaアプリにNative UIを追加する',
      fr: 'Ajoutez Native UI à votre application Cordova',
      de: 'Native UI in Ihre Cordova-App integrieren',
    },
    overview: {
      en: 'Install the published adapter in your native and Web projects, start after deviceready, and keep Web fallback behavior on unsupported controls. Capacitor and Cordova share Core, but their host integrations and support scopes differ.',
      ja: '公開済みのアダプターをネイティブとWebの両プロジェクトへ導入し、deviceready後に開始します。未対応コントロールはWeb表示を維持します。CapacitorとCordovaはCoreを共有しますが、ホスト連携と対応範囲は異なります。',
      fr: 'Installez l’adaptateur publié dans vos projets natif et Web, démarrez après deviceready et conservez la présentation Web des contrôles non pris en charge. Capacitor et Cordova partagent Core, mais leur intégration hôte et leur périmètre de prise en charge diffèrent.',
      de: 'Installieren Sie den veröffentlichten Adapter im nativen und im Web-Projekt, starten Sie nach deviceready und behalten Sie die Web-Darstellung nicht unterstützter Steuerelemente bei. Capacitor und Cordova teilen Core, unterscheiden sich jedoch bei Host-Integration und Unterstützungsumfang.',
    },
    featuresHeading: {
      en: 'Features',
      ja: '機能',
      fr: 'Fonctionnalités',
      de: 'Funktionen',
    },
    features: [],
    pages: [
      {
        title: {
          en: 'Getting Started',
          ja: 'はじめに',
          fr: 'Premiers pas',
          de: 'Erste Schritte',
        },
        section: {
          en: 'Guides',
          ja: 'ガイド',
          fr: 'Guides',
          de: 'Anleitungen',
        },
        slug: 'readme',
        file: 'readme.md',
        localEnglishSource: true,
        updatedAt: {
          en: '2026-11-11',
          ja: '2026-11-11',
          fr: '2026-11-11',
          de: '2026-11-11',
        },
      },
    ],
  },
];

export function localize(value: LocalizedText, locale: Locale): string {
  const metadata: Partial<Record<Locale, Readonly<Record<string, string>>>> = {
    fr: METADATA_FR,
    de: METADATA_DE,
  };
  const translated = value[locale] ?? metadata[locale]?.[value.en];
  if (!translated?.trim()) {
    throw new Error(`Missing ${locale} translation for: ${value.en}`);
  }
  return translated;
}
