import { resolveDocsLocale } from './docs-locales';

export const GUIDE_CHAPTERS = [
  {
    id: 'appearance',
    title: {
      en: 'Shape the appearance',
      ja: '見た目を整える',
      fr: 'Personnaliser l’apparence',
      de: 'Das Erscheinungsbild gestalten',
    },
    description: {
      en: 'Use platform themes, then choose how your app follows light, dark and device colors.',
      ja: 'プラットフォームに合うテーマを使い、ライト・ダークモードやデバイスの配色への追従を設定します。',
      fr: 'Utilisez les thèmes des plateformes, puis choisissez les modes clair, sombre et les couleurs de l’appareil.',
      de: 'Verwenden Sie Plattform-Themes und bestimmen Sie anschließend Hell-/Dunkelmodus und Gerätefarben.',
    },
  },
  {
    id: 'native-ui',
    title: {
      en: 'Use native UI',
      ja: 'Native UIを使う',
      fr: 'Utiliser l’interface native',
      de: 'Native UI verwenden',
    },
    description: {
      en: 'Project your Web controls into native UI while your app keeps its state, routes and handlers.',
      ja: 'アプリの状態・ルーティング・イベント処理を保ったまま、WebのコントロールをネイティブUIで表示します。',
      fr: 'Affichez vos contrôles Web en interface native tout en conservant l’état, les routes et les gestionnaires de votre application.',
      de: 'Stellen Sie Web-Steuerelemente nativ dar, während Zustand, Routing und Ereignisbehandlung in Ihrer App bleiben.',
    },
  },
  {
    id: 'device-layout',
    title: {
      en: 'Adapt to the device',
      ja: '端末に合わせる',
      fr: 'S’adapter à l’appareil',
      de: 'An das Gerät anpassen',
    },
    description: {
      en: 'Follow display changes and place Vertical Bars on supported devices.',
      ja: 'ディスプレイの変化に追従し、対応デバイスに合わせてVertical Barsを配置します。',
      fr: 'Suivez les changements d’affichage et placez Vertical Bars sur les appareils compatibles.',
      de: 'Reagieren Sie auf Anzeigeänderungen und platzieren Sie Vertical Bars auf unterstützten Geräten.',
    },
  },
  {
    id: 'extensions',
    title: {
      en: 'Build your own native UI',
      ja: '独自のネイティブUIを作る',
      fr: 'Créer votre interface native',
      de: 'Eigene native UI erstellen',
    },
    description: {
      en: 'Extend the native rendering when the built-in controls do not cover your application.',
      ja: '用意されたコントロールでは足りない場合に、ネイティブの描画を拡張します。',
      fr: 'Étendez le rendu natif lorsque les contrôles intégrés ne suffisent pas.',
      de: 'Erweitern Sie die native Darstellung, wenn die integrierten Steuerelemente nicht ausreichen.',
    },
  },
  {
    id: 'migration',
    title: {
      en: 'Migrate an existing app',
      ja: '既存アプリを移行する',
      fr: 'Migrer une application existante',
      de: 'Eine bestehende App migrieren',
    },
    description: {
      en: 'Move to the current setup while keeping your application’s responsibilities clear.',
      ja: 'アプリが担う責務を保ちながら、現在の推奨構成へ移行します。',
      fr: 'Adoptez la configuration actuelle en conservant clairement les responsabilités de votre application.',
      de: 'Wechseln Sie zur aktuellen Einrichtung und behalten Sie klare Zuständigkeiten in Ihrer App.',
    },
  },
] as const;

export const GUIDE_COPY = {
  heroDefinition: {
    en: 'Open-source themes and native controls for apps built with Web technologies.',
    ja: 'Web技術で作るアプリ向けの、テーマとネイティブUIのオープンソースライブラリ群です。',
    fr: 'Des thèmes et contrôles natifs open source pour les applications créées avec les technologies Web.',
    de: 'Open-Source-Themes und native Steuerelemente für Apps mit Web-Technologien.',
  },
  heroAudience: {
    en: 'Themes for Ionic · Native integrations for Capacitor and Cordova',
    ja: 'Ionic向けテーマ · Capacitor／Cordova向けネイティブ連携',
    fr: 'Thèmes pour Ionic · Intégrations natives pour Capacitor et Cordova',
    de: 'Themes für Ionic · Native Integrationen für Capacitor und Cordova',
  },
  showcaseLibrary: {
    en: 'Photo library in the native demo running on a physical iPhone 15 Pro Max, with translucent controls over the gallery.',
    ja: 'iPhone 15 Pro Max実機で動くネイティブデモ。写真の上に半透明のコントロールが重なるライブラリー画面。',
    fr: 'Photothèque de la démo native sur un iPhone 15 Pro Max physique, avec des contrôles translucides superposés aux photos.',
    de: 'Fotogalerie der nativen Demo auf einem physischen iPhone 15 Pro Max, mit durchscheinenden Bedienelementen über den Fotos.',
  },
  showcaseAndroid: {
    en: 'Photo library running on a physical Pixel 8a, with Material Design 3 and green controls from the device’s Dynamic Color palette.',
    ja: 'Pixel 8a実機で動く写真ライブラリー。Material Design 3の画面に、端末のDynamic Colorによる緑の操作部が表示されています。',
    fr: 'Photothèque sur un Pixel 8a physique, avec Material Design 3 et des contrôles verts issus de la palette Dynamic Color de l’appareil.',
    de: 'Fotogalerie auf einem physischen Pixel 8a, mit Material Design 3 und grünen Bedienelementen aus der Dynamic-Color-Palette des Geräts.',
  },
  showcaseCaption: {
    en: 'Native apps running on real devices',
    ja: '実機で動くネイティブアプリ',
    fr: 'Applications natives sur appareils réels',
    de: 'Native Apps auf echten Geräten',
  },
  previewTitle: {
    en: 'Try the themes',
    ja: 'テーマを試す',
    fr: 'Essayer les thèmes',
    de: 'Themes ausprobieren',
  },
  howTitle: {
    en: 'Your Web app, with platform UI.',
    ja: 'Webで作る画面に、プラットフォームのUIを。',
    fr: 'Votre application Web, avec l’interface de la plateforme.',
    de: 'Ihre Web-App mit Plattform-UI.',
  },
  guideTitle: {
    en: 'Customize when needed',
    ja: '必要になったら調整する',
    fr: 'Personnaliser si nécessaire',
    de: 'Bei Bedarf anpassen',
  },
  standardAudience: {
    en: 'For Ionic 9 + Capacitor 8',
    ja: '対象：Ionic 9 + Capacitor 8',
    fr: 'Pour Ionic 9 + Capacitor 8',
    de: 'Für Ionic 9 + Capacitor 8',
  },
  title: {
    en: 'WebView Native UI',
    ja: 'WebView Native UI',
    fr: 'WebView Native UI',
    de: 'WebView Native UI',
  },
  intro: {
    en: 'An open-source toolkit for combining Web screens with native UI in iOS and Android apps. Build your screens with HTML, CSS and JavaScript, use themes for platform styling, and add native controls through Capacitor or Cordova.',
    ja: 'Webで作る画面とネイティブUIを組み合わせる、iOS・Androidアプリ向けのオープンソースツールキットです。HTML・CSS・JavaScriptで作る画面に、プラットフォームに合うテーマや、Capacitor・Cordovaを通じたネイティブコントロールを取り入れられます。',
    fr: 'Une boîte à outils open source pour associer écrans Web et interface native dans les applications iOS et Android. Créez vos écrans en HTML, CSS et JavaScript, utilisez des thèmes adaptés aux plateformes et ajoutez des contrôles natifs via Capacitor ou Cordova.',
    de: 'Ein Open-Source-Toolkit, das Web-Oberflächen und native UI in iOS- und Android-Apps verbindet. Erstellen Sie Oberflächen mit HTML, CSS und JavaScript, nutzen Sie Plattform-Themes und ergänzen Sie native Steuerelemente über Capacitor oder Cordova.',
  },
  approach: {
    en: 'Your app keeps its state, navigation and event handlers in the Web layer. The themes are built for Ionic; native UI integrations also support HTML without Ionic. Follow the setup steps below to add these features to your Ionic app.',
    ja: 'アプリの状態・画面遷移・イベント処理はWeb側で管理します。テーマはIonic向けで、ネイティブUIの導入はIonicを使わないHTMLにも対応しています。この下の手順で、Ionicアプリへの導入から動作確認まで進められます。',
    fr: 'L’état, la navigation et les événements restent dans la couche Web. Les thèmes sont conçus pour Ionic ; les intégrations natives prennent aussi en charge HTML sans Ionic. Les étapes ci-dessous permettent de les intégrer à votre application Ionic.',
    de: 'Zustand, Navigation und Ereignisbehandlung bleiben in der Web-Schicht. Die Themes sind für Ionic ausgelegt; native UI lässt sich auch mit HTML ohne Ionic integrieren. Die folgenden Schritte integrieren diese Funktionen in Ihre Ionic-App.',
  },
  start: {
    en: 'Set up your Ionic app',
    ja: 'Ionicアプリに導入する',
    fr: 'Configurer votre application Ionic',
    de: 'Die Ionic-App einrichten',
  },
  startDescription: {
    en: 'For an existing Ionic app with Capacitor 8. Follow the steps to install iOS 26/27 and MD3, configure the app, then run and verify Native UI, Dynamic Color, and Vertical Bars.',
    ja: 'Capacitor 8を使う既存のIonicアプリ向けです。iOS 26/27とMD3のインストールから、アプリの設定、Native UI・Dynamic Color・Vertical Barsの起動と動作確認まで、順番に進めます。',
    fr: 'Pour une application Ionic existante avec Capacitor 8. Suivez les étapes pour installer iOS 26/27 et MD3, configurer l’application, puis exécuter et vérifier Native UI, Dynamic Color et Vertical Bars.',
    de: 'Für eine vorhandene Ionic-App mit Capacitor 8. Die Schritte führen durch Installation von iOS 26/27 und MD3, App-Konfiguration sowie Start und Prüfung von Native UI, Dynamic Color und Vertical Bars.',
  },
  guide: {
    en: 'Guide',
    ja: 'ガイド',
    fr: 'Guide',
    de: 'Anleitung',
  },
  overview: {
    en: 'Overview',
    ja: '全体像',
    fr: 'Vue d’ensemble',
    de: 'Überblick',
  },
  next: {
    en: 'Reference',
    ja: 'リファレンス',
    fr: 'Référence',
    de: 'Referenz',
  },
  reference: {
    en: 'Package reference',
    ja: 'パッケージリファレンス',
    fr: 'Référence des paquets',
    de: 'Paketreferenz',
  },
  referenceDescription: {
    en: 'Look up installation variants, options and APIs for a specific package.',
    ja: '特定のパッケージの導入方法・オプション・APIを調べる場合はこちら。',
    fr: 'Consultez les variantes d’installation, options et API d’un paquet précis.',
    de: 'Hier finden Sie Installationsvarianten, Optionen und APIs einzelner Pakete.',
  },
  routes: {
    en: 'Choose a Native UI integration',
    ja: 'Native UIの導入方法を選ぶ',
    fr: 'Choisir une intégration Native UI',
    de: 'Eine Native-UI-Integration wählen',
  },
  iosBenefit: {
    en: 'iOS: Liquid Glass styling and native controls',
    ja: 'iOS：Liquid Glassの見た目とネイティブコントロール',
    fr: 'iOS : style Liquid Glass et contrôles natifs',
    de: 'iOS: Liquid-Glass-Design und native Steuerelemente',
  },
  iosDetail: {
    en: 'Use iOS 26 theme styling by default and iOS 27 on capable browsers, with built-in native controls on iOS 26+ (Xcode 26+). Vertical Bars adapts to supported devices, including iPhone Duo.',
    ja: 'iOS 26テーマを基本に、対応ブラウザーではiOS 27へ切り替えます。iOS 26以降ではプラグインのネイティブコントロールを利用できます（Xcode 26以降）。iPhone Duoなどの対応端末ではVertical Barsで配置も調整します。',
    fr: 'Utilisez le thème iOS 26 par défaut et iOS 27 sur les navigateurs compatibles, avec les contrôles natifs intégrés sur iOS 26+ (Xcode 26+). Vertical Bars adapte la disposition aux appareils compatibles, dont iPhone Duo.',
    de: 'Nutzen Sie standardmäßig das iOS-26-Theme und in geeigneten Browsern iOS 27 sowie integrierte native Steuerelemente unter iOS 26+ (Xcode 26+). Vertical Bars passt das Layout an unterstützte Geräte wie iPhone Duo an.',
  },
  androidBenefit: {
    en: 'Android: Material Design 3 with device colors',
    ja: 'Android：Material Design 3と端末の配色',
    fr: 'Android : Material Design 3 et couleurs de l’appareil',
    de: 'Android: Material Design 3 mit Gerätefarben',
  },
  androidDetail: {
    en: 'Style Ionic controls with Material Design 3. On Android 12+, Dynamic Color applies the device palette; unsupported devices keep the theme’s fallback colors. Built-in plugin Native UI is currently iOS-only.',
    ja: 'IonicのコントロールをMaterial Design 3で整えます。Android 12以降ではDynamic Colorで端末の配色を反映し、非対応端末ではテーマの既定色を使います。プラグインの組み込みNative UIは現在iOSのみです。',
    fr: 'Habillez les contrôles Ionic avec Material Design 3. Sur Android 12+, Dynamic Color applique la palette de l’appareil ; les autres appareils gardent les couleurs du thème. L’interface native intégrée du plugin est actuellement réservée à iOS.',
    de: 'Gestalten Sie Ionic-Steuerelemente mit Material Design 3. Unter Android 12+ übernimmt Dynamic Color die Gerätepalette; andere Geräte behalten die Theme-Farben. Die integrierte native UI des Plugins ist derzeit nur für iOS verfügbar.',
  },
  otherSetups: {
    en: 'Using a different setup?',
    ja: '別の構成で使う場合',
    fr: 'Vous utilisez une autre configuration ?',
    de: 'Sie verwenden eine andere Konfiguration?',
  },
  existingTheme: {
    en: 'Add Native UI to an existing theme',
    ja: '既存テーマにNative UIを追加する',
    fr: 'Ajouter Native UI à un thème existant',
    de: 'Native UI zum vorhandenen Theme hinzufügen',
  },
  themeOnly: {
    en: 'Themes only',
    ja: 'テーマだけ使う',
    fr: 'Thèmes seuls',
    de: 'Nur Themes',
  },
  htmlSetup: {
    en: 'Capacitor + HTML without Ionic',
    ja: 'Ionicを使わないCapacitor + HTML',
    fr: 'Capacitor + HTML sans Ionic',
    de: 'Capacitor + HTML ohne Ionic',
  },
  cordovaSetup: {
    en: 'Cordova integration',
    ja: 'Cordovaでの導入',
    fr: 'Intégration Cordova',
    de: 'Cordova-Integration',
  },
  iosPreview: {
    en: 'iOS 27 theme: Library screen',
    ja: 'iOS 27テーマ：ライブラリー画面',
    fr: 'Thème iOS 27 : écran Bibliothèque',
    de: 'iOS-27-Theme: Bibliotheksansicht',
  },
  androidPreview: {
    en: 'Material Design 3 theme with the default Ionic palette',
    ja: 'Material Design 3テーマ（Ionicの既定色）',
    fr: 'Thème Material Design 3 avec la palette Ionic par défaut',
    de: 'Material-Design-3-Theme mit der Ionic-Standardpalette',
  },
  tryIos: {
    en: 'Try the iOS theme in your browser',
    ja: 'iOSテーマをブラウザーで試す',
    fr: 'Essayer le thème iOS dans le navigateur',
    de: 'iOS-Theme im Browser ausprobieren',
  },
  tryAndroid: {
    en: 'Try Material Design 3 in your browser',
    ja: 'Material Design 3をブラウザーで試す',
    fr: 'Essayer Material Design 3 dans le navigateur',
    de: 'Material Design 3 im Browser ausprobieren',
  },
} as const;

export function guideChaptersForLocale(locale: string) {
  const code = resolveDocsLocale(locale);
  return GUIDE_CHAPTERS.map((chapter) => ({
    id: chapter.id,
    path: '/guides/' + chapter.id,
    title: chapter.title[code],
    description: chapter.description[code],
  }));
}
export function guideCopyForLocale(locale: string) {
  const code = resolveDocsLocale(locale);
  return Object.fromEntries(
    Object.entries(GUIDE_COPY).map(([key, value]) => [key, value[code]]),
  ) as Record<keyof typeof GUIDE_COPY, string>;
}
