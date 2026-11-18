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

export type ProjectCategoryId = 'translations' | 'plugins' | 'frontend-tools' | 'developer-tools';

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
    id: 'plugins',
    label: { en: 'Plugins', ja: 'プラグイン', fr: 'Plugins', de: 'Plugins' },
    description: {
      en: 'Choose the native UI integration for your app: Capacitor or Cordova.',
      ja: 'アプリの構成に合わせて、Capacitor版・Cordova版を選べます。',
      fr: 'Choisissez l’intégration native adaptée à votre application : Capacitor ou Cordova.',
      de: 'Wählen Sie die native UI-Integration für Ihre App: Capacitor oder Cordova.',
    },
    order: 20,
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
    englishDocsRef: '439de9e1a0ccd4c1882e03a0f61eb27eb9c201bc',
    releaseNotesUrl: 'https://github.com/webview-native-ui/engine/releases/tag/v1.0.10',
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
    headline: text('Bring Native UI seamlessly into Web apps', 'WebView Native UI Engine'),
    overview: text(
      'Coordinate native controls and Web content across scrolling screens, transitions, and overlays on iOS and Android. Integrate the Engine into your plugin while retaining its renderer and public API.',
      'Capacitor・Cordovaのプラグイン開発者向けのライブラリです。スクロールや画面遷移に合わせて、Webコンテンツ上のネイティブコントロールの位置を更新します。各プラグインは独自の描画処理と公開APIを使用できます。',
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
        updatedAt: { en: '2026-11-17', ja: '2026-11-17', fr: '2026-11-17', de: '2026-11-17' },
      },
      {
        title: text('Documentation overview', 'ドキュメント概要'),
        section: text('Guides', 'ガイド'),
        slug: 'overview',
        file: 'README.md',
        updatedAt: { en: '2026-11-17', ja: '2026-11-17', fr: '2026-11-17', de: '2026-11-17' },
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
        updatedAt: { en: '2026-11-17', ja: '2026-11-17', fr: '2026-11-17', de: '2026-11-17' },
      },
      {
        title: text('Registration settings', '登録設定'),
        section: text('Configuration', '設定'),
        slug: 'configuration',
        file: 'configuration/README.md',
        updatedAt: { en: '2026-11-17', ja: '2026-11-17', fr: '2026-11-17', de: '2026-11-17' },
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
        updatedAt: { en: '2026-11-17', ja: '2026-11-17', fr: '2026-11-17', de: '2026-11-17' },
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
        updatedAt: { en: '2026-11-17', ja: '2026-11-17', fr: '2026-11-17', de: '2026-11-17' },
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
        updatedAt: { en: '2026-11-17', ja: '2026-11-17', fr: '2026-11-17', de: '2026-11-17' },
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
        updatedAt: { en: '2026-11-17', ja: '2026-11-17', fr: '2026-11-17', de: '2026-11-17' },
      },
      {
        title: text('Development and releases', '開発とリリース'),
        section: text('Guides', 'ガイド'),
        slug: 'maintenance',
        file: 'maintenance.md',
        updatedAt: { en: '2026-11-17', ja: '2026-11-17', fr: '2026-11-17', de: '2026-11-17' },
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
    releaseTagPrefix: 'ios27-v',
    repositoryUrl: 'https://github.com/webview-native-ui/ionic-theme-ios27',
    englishDocsRef: '9eb05304d5f3be2002a5a9509f5d3886b633628f',
    englishDocsAssetsRef: 'c70beb9d1e5b39de696b2b2c47a3d9bc5ffcdfbe',
    releaseNotesUrl:
      'https://github.com/webview-native-ui/ionic-theme-ios27/releases/tag/ios27-v2.2.0',
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
      'IonicコンポーネントにiOS 27のLiquid Glass、アニメーション、端末に応じたレイアウトを適用するテーマです。対応するコントロールをネイティブ表示するには、Capacitor Native UIを併用します。',
    ),
    featuresHeading: text('Features', '機能'),
    features: [],
    pages: [
      {
        title: text('Getting Started', 'はじめに'),
        section: text('Guides', 'ガイド'),
        slug: 'readme',
        file: 'readme.md',
        localEnglishSource: true,
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
        localEnglishSource: true,
        headingAliases: {
          '1.-install-the-theme-and-foldable': '1.-install-the-theme',
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
        localEnglishSource: true,
        updatedAt: { en: '2026-11-17', ja: '2026-11-17', fr: '2026-11-17', de: '2026-11-17' },
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
        headingAliases: {
          'optional%3A-vertical-bars': '2.-enable-native-controls',
          'optional-vertical-bars': '2.-enable-native-controls',
          '%E4%BB%BB%E6%84%8F%3A-vertical-bars': '2.-enable-native-controls',
          'facultatif-%3A-vertical-bars': '2.-enable-native-controls',
        },
        updatedAt: { en: '2026-11-12', ja: '2026-11-12', fr: '2026-11-12', de: '2026-11-12' },
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
        updatedAt: { en: '2026-11-17', ja: '2026-11-17', fr: '2026-11-17', de: '2026-11-17' },
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
    englishDocsRef: '9a60a64ed03b5e902616a4507e52093784d683c6',
    releaseNotesUrl: 'https://github.com/webview-native-ui/capacitor-plugin/releases/tag/v2.1.10',
    demoUrl: 'https://ionic-theme-ios27.rdlabo.dev/',
    category: 'plugins',
    icon: 'app',
    adapter: 'markdown',
    description: {
      en: 'Native UI, Android Dynamic Color and custom native content for WebView apps.',
      ja: 'WebViewアプリ向けのNative UI、Android Dynamic Color、独自ネイティブコンテンツ。',
      fr: 'Native UI, Dynamic Color Android et contenu natif personnalisé pour les applications WebView.',
      de: 'Native UI, Android Dynamic Color und eigene native Inhalte für WebView-Apps.',
    },
    headline: text('Capacitor Native UI', 'Capacitor Native UI'),
    overview: {
      en: 'Use built-in native controls on iOS, read Android Dynamic Color, or build custom SwiftUI and Compose content.',
      ja: 'iOSではWeb画面の対応コントロールをネイティブ表示し、Androidでは端末の配色を取得するCapacitorプラグインです。拡張APIでは、SwiftUIやComposeで独自のビューを実装できます。',
      fr: 'Utilisez les contrôles natifs iOS, lisez Dynamic Color Android ou créez du contenu SwiftUI et Compose personnalisé.',
      de: 'Verwenden Sie native iOS-Steuerelemente, lesen Sie Android Dynamic Color oder erstellen Sie eigene SwiftUI- und Compose-Inhalte.',
    },
    featuresHeading: text('Features', '機能'),
    features: [],
    pages: [
      {
        title: text('Getting Started', 'はじめに'),
        section: text('Guides', 'ガイド'),
        slug: 'readme',
        file: 'readme.md',
        headingAliases: {
          'install-from-npm': 'individual-guides',
          'standard-setup%3A-ios-native-ui-and-android-dynamic-color': 'individual-guides',
          'choose-what-to-build': 'individual-guides',
          'android-dynamic-colors': '2.-use-dynamic-color',
        },
        updatedAt: { en: '2026-11-11', ja: '2026-11-11', fr: '2026-11-11', de: '2026-11-11' },
      },
      {
        title: {
          en: 'Ionic setup',
          ja: 'Ionicの設定',
          fr: 'Configuration Ionic',
          de: 'Ionic-Einrichtung',
        },
        section: text('Guides', 'ガイド'),
        slug: 'setup',
        file: 'setup.md',
        headingAliases: {
          'place-startup-in-your-frameworks-app-root': '3.-start-native-ui',
          'application-lifetime': '3.-start-native-ui',
          'navigation-without-the-theme': 'next-steps',
          '2-enable-the-shell': '2.-configure-the-theme',
          '2.-configure-both-themes': '2.-configure-the-theme',
          '3-coordinate-navigation': '3.-start-native-ui',
          '3.-start-after-the-app-shell-renders': '3.-start-native-ui',
          'individual-options': 'next-steps',
          '4-build-sync-and-run': '4.-build%2C-sync%2C-and-run',
        },
        updatedAt: { en: '2026-11-11', ja: '2026-11-11', fr: '2026-11-11', de: '2026-11-11' },
      },
      {
        title: {
          en: 'Application startup and device layout',
          ja: 'アプリの起動とデバイス配置',
          fr: 'Démarrage de l’application et disposition de l’appareil',
          de: 'Anwendungsstart und Gerätelayout',
        },
        section: text('Guides', 'ガイド'),
        slug: 'device-layout',
        file: 'device-layout.md',
        headingAliases: {
          'device-layout-module': 'device-layout',
          'react-vue-and-other-application-owners': 'react%2C-vue-and-other-frameworks',
          'react%2C-vue-and-other-application-owners': 'react%2C-vue-and-other-frameworks',
        },
        updatedAt: { en: '2026-11-11', ja: '2026-11-11', fr: '2026-11-11', de: '2026-11-11' },
      },
      {
        title: text('Native UI without Ionic', 'Ionicを使わないNative UI'),
        section: text('Guides', 'ガイド'),
        slug: 'framework-independent',
        file: 'framework-independent.md',
        headingAliases: { '2-mark-source-controls': '2.-mark-source-controls' },
        updatedAt: { en: '2026-11-17', ja: '2026-11-17', fr: '2026-11-17', de: '2026-11-17' },
      },
      {
        title: {
          en: 'Vertical Bars with your existing theme',
          ja: '既存テーマで使うVertical Bars',
          fr: 'Vertical Bars avec votre thème existant',
          de: 'Vertical Bars mit Ihrem bestehenden Theme',
        },
        section: text('Guides', 'ガイド'),
        slug: 'ionic-vertical-bars',
        file: 'ionic-vertical-bars.md',
        localEnglishSource: true,
        headingAliases: {
          '2-connect-your-navigation-animation': '2.-connect-your-navigation-animation',
          '3-connect-device-placement-and-start-the-controls':
            '3.-connect-device-placement-and-start-the-controls',
          'keep-ionics-default-animation': "keep-ionic's-default-animation",
          'use-the-themes-ios-animation': "use-the-theme's-ios-animation",
        },
        updatedAt: { en: '2026-11-11', ja: '2026-11-11', fr: '2026-11-11', de: '2026-11-11' },
      },
      {
        title: text('Native UI', 'Native UI'),
        section: text('Guides', 'ガイド'),
        slug: 'native-ui',
        file: 'native-ui.md',
        updatedAt: { en: '2026-11-17', ja: '2026-11-17', fr: '2026-11-17', de: '2026-11-17' },
      },
      {
        title: text('Configuration', '設定'),
        section: text('Guides', 'ガイド'),
        slug: 'configuration',
        file: 'configuration.md',
        updatedAt: { en: '2026-11-17', ja: '2026-11-17', fr: '2026-11-17', de: '2026-11-17' },
      },
      {
        title: text('Light and dark appearance', 'ライト／ダーク表示'),
        section: text('Guides', 'ガイド'),
        slug: 'appearance',
        file: 'appearance.md',
        updatedAt: { en: '2026-11-11', ja: '2026-11-11', fr: '2026-11-11', de: '2026-11-11' },
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
        updatedAt: { en: '2026-11-11', ja: '2026-11-11', fr: '2026-11-11', de: '2026-11-11' },
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
        updatedAt: { en: '2026-11-11', ja: '2026-11-11', fr: '2026-11-11', de: '2026-11-11' },
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
    englishDocsRef: 'a4ec2bc083a5498b732626bc4936ddf458dd3697',
    repositoryBrowseUrl: 'https://github.com/webview-native-ui/ionic-theme-ios27/tree/ios26',
    englishDocsEditBranch: 'ios26',
    demoUrl: 'https://ionic-theme-ios26.rdlabo.dev/',
    releaseNotesUrl:
      'https://github.com/webview-native-ui/ionic-theme-ios27/releases/tag/ios26-v9.5.0',
    releaseTagPrefix: 'ios26-v',
    category: 'frontend-tools',
    icon: 'theme',
    adapter: 'markdown',
    description: text(
      'iOS 26 design styling for Ionic applications.',
      'Ionicアプリ向けのiOS 26デザインスタイル。',
    ),
    headline: text('Bring iOS 26 design to Ionic apps', 'Ionic Theme iOS26'),
    overview: text(
      'Apply iOS 26 CSS, transitions, and Liquid Glass interactions to Ionic components, with dark mode and selective migration support.',
      'IonicコンポーネントにiOS 26のスタイル、画面遷移、Liquid Glassの操作表現を適用するテーマです。ダークモードに対応し、既存アプリに段階的に導入できます。',
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
        localEnglishSource: true,
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
        { updatedAt: { en: '2026-11-17', ja: '2026-11-17', fr: '2026-11-17', de: '2026-11-17' } },
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
        updatedAt: { en: '2026-11-17', ja: '2026-11-17', fr: '2026-11-17', de: '2026-11-17' },
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
    englishDocsRef: 'af3c5ca8a4cf682ea72bb171cd519e1e4a1e9cb8',
    demoUrl: 'https://ionic-theme-md3.rdlabo.dev/',
    releaseNotesUrl: 'https://github.com/webview-native-ui/ionic-theme-md3/releases/tag/v9.3.0',
    category: 'frontend-tools',
    icon: 'theme',
    adapter: 'markdown',
    description: text(
      'Material Design 3 styling for Ionic applications.',
      'Ionicアプリ向けのMaterial Design 3スタイル。',
    ),
    headline: text('Bring Material Design 3 to Ionic apps', 'Ionic Theme MD3'),
    overview: text(
      'Apply Material Design 3 styling to Ionic while keeping markup compatible with the iOS 26 theme and shared transition animations.',
      'IonicコンポーネントにMaterial Design 3のスタイルと画面遷移のアニメーションを適用します。iOS 26テーマと同じマークアップを使用できます。',
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
          'Share one HTML structure with @rdlabo/ionic-theme-ios26 across platforms.',
          'プラットフォームをまたぎ @rdlabo/ionic-theme-ios26 と同じHTML構造を共有します。',
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
        localEnglishSource: true,
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
        updatedAt: { en: '2026-11-17', ja: '2026-11-17', fr: '2026-11-17', de: '2026-11-17' },
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
        updatedAt: { en: '2026-11-17', ja: '2026-11-17', fr: '2026-11-17', de: '2026-11-17' },
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
        updatedAt: { en: '2026-11-17', ja: '2026-11-17', fr: '2026-11-17', de: '2026-11-17' },
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
        { updatedAt: { en: '2026-11-17', ja: '2026-11-17', fr: '2026-11-17', de: '2026-11-17' } },
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
        updatedAt: { en: '2026-11-17', ja: '2026-11-17', fr: '2026-11-17', de: '2026-11-17' },
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
    englishDocsRef: 'd4f7aeffb228be4d7f0ff1ec4a21fcd00104f517',
    releaseNotesUrl: 'https://github.com/webview-native-ui/cordova-plugin/releases/tag/v0.1.4',
    category: 'plugins',
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
      ja: 'Cordova Native UI',
      fr: 'Ajoutez Native UI à votre application Cordova',
      de: 'Native UI in Ihre Cordova-App integrieren',
    },
    overview: {
      en: 'Install the published adapter in your native and Web projects, start after deviceready, and keep Web fallback behavior on unsupported controls. Capacitor and Cordova share Core, but their host integrations and support scopes differ.',
      ja: 'CordovaのWebViewで、対応するHTMLコントロールをネイティブ表示するプラグインです。初期化はdevicereadyイベントの後に行います。未対応の要素はWebViewに表示され、HTMLのまま操作できます。',
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
          en: '2026-11-17',
          ja: '2026-11-17',
          fr: '2026-11-17',
          de: '2026-11-17',
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
