import { resolveDocsLocale } from './docs-locales';

export const GUIDE_CHAPTERS = [
  {
    id: 'appearance',
    kind: 'task',
    title: {
      en: 'Add an appearance switch',
      ja: '外観の切り替えを追加する',
      fr: 'Ajouter un sélecteur d’apparence',
      de: 'Darstellungswechsel hinzufügen',
    },
    description: {
      en: 'Configure device colors and light/dark appearance as separate preferences.',
      ja: '端末の配色とダークモードを切り替える設定を追加します。',
      fr: 'Réglez séparément les couleurs de l’appareil et l’apparence claire ou sombre.',
      de: 'Stellen Sie Gerätefarben und Hell-/Dunkelmodus getrennt ein.',
    },
  },
  {
    id: 'extensions',
    kind: 'task',
    title: {
      en: 'Build your own native UI',
      ja: '独自のネイティブUIを作る',
      fr: 'Créer votre interface native',
      de: 'Eigene native UI erstellen',
    },
    description: {
      en: 'Extend the native rendering when the built-in controls do not cover your application.',
      ja: 'SwiftUIやComposeで画面を作り、Webの状態・操作につなぎます。',
      fr: 'Étendez le rendu natif lorsque les contrôles intégrés ne suffisent pas.',
      de: 'Erweitern Sie die native Darstellung, wenn die integrierten Steuerelemente nicht ausreichen.',
    },
  },
  {
    id: 'migration',
    kind: 'migration',
    title: {
      en: 'Migrate an existing app',
      ja: '既存アプリを移行する',
      fr: 'Migrer une application existante',
      de: 'Eine bestehende App migrieren',
    },
    description: {
      en: 'Move to the current setup while keeping your application’s responsibilities clear.',
      ja: '使用中のパッケージと、古いimport・起動処理を更新します。',
      fr: 'Adoptez la configuration actuelle en conservant clairement les responsabilités de votre application.',
      de: 'Wechseln Sie zur aktuellen Einrichtung und behalten Sie klare Zuständigkeiten in Ihrer App.',
    },
  },
] as const;

export const GUIDE_COPY = {
  componentPreview: {
    en: 'Try the same Ionic controls with the iOS 27 and Material Design 3 themes.',
    ja: '同じIonicコンポーネントを、iOS 27とMaterial Design 3で操作できます。',
    fr: 'Essayez les mêmes composants Ionic avec les thèmes iOS 27 et Material Design 3.',
    de: 'Probieren Sie dieselben Ionic-Komponenten mit den Themes für iOS 27 und Material Design 3 aus.',
  },
  fullDemo: {
    en: 'Full demo',
    ja: 'デモを開く',
    fr: 'Démo complète',
    de: 'Zur Demo',
  },
  heroHeadline: {
    en: 'One Web app. Two platform experiences.',
    ja: 'WebViewアプリに、\nネイティブの使い心地を。',
    fr: 'Une app Web, deux interfaces mobiles.',
    de: 'Eine Web-App. Zwei mobile Oberflächen.',
  },
  heroDefinition: {
    en: 'Bring Liquid Glass to iOS and Material Design 3 to Android. Keep your Ionic screens, navigation, and event handlers.',
    ja: 'Ionicの画面を活かしたまま、iOSにはLiquid Glass、AndroidにはMaterial Design 3を。必要な操作にはネイティブコントロールを使えます。',
    fr: 'Adoptez Liquid Glass sur iOS et Material Design 3 sur Android en conservant vos écrans Ionic, votre navigation et vos gestionnaires d’événements.',
    de: 'Liquid Glass für iOS und Material Design 3 für Android. Ansichten, Navigation und Ereignisbehandlung Ihrer Ionic-App bleiben erhalten.',
  },
  showcaseLibrary: {
    en: 'Photo library in the native demo running on a physical iPhone 15 Pro Max, with translucent controls over the gallery.',
    ja: 'iPhone 15 Pro Max実機で動くネイティブデモ。写真の上に半透明のコントロールが重なるライブラリー画面。',
    fr: 'Photothèque de la démo native sur un iPhone 15 Pro Max physique, avec des contrôles translucides superposés aux photos.',
    de: 'Fotogalerie der nativen Demo auf einem physischen iPhone 15 Pro Max, mit durchscheinenden Bedienelementen über den Fotos.',
  },
  dragDetail: {
    en: 'A finger held over the Docs tab while dragging. The Liquid Glass selection lens refracts the photo behind the tab bar.',
    ja: 'Docsタブまでドラッグして指を止めた状態。選択中のガラスの縁で、背後の写真が屈折して見えます。',
    fr: 'Pendant un glissement maintenu sur l’onglet Docs, la lentille Liquid Glass réfracte la photo derrière la barre.',
    de: 'Beim Ziehen über dem Tab Docs gehalten: Die Liquid-Glass-Linse bricht das Bild hinter der Tableiste.',
  },
  dragCaption: {
    en: 'Tab held during a drag · UIKit · iOS 27 simulator',
    ja: 'タブを押したままドラッグした状態 · UIKit · iOS 27シミュレーター',
    fr: 'Onglet maintenu pendant le glissement · UIKit · simulateur iOS 27',
    de: 'Tab beim Ziehen gehalten · UIKit · iOS-27-Simulator',
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
  howTitle: {
    en: 'Native controls on iOS',
    ja: 'iOSのネイティブコントロール',
    fr: 'Contrôles natifs sur iOS',
    de: 'Native Steuerelemente unter iOS',
  },
  guideTitle: {
    en: 'Use and customize after setup',
    ja: 'カスタマイズ',
    fr: 'Utiliser et personnaliser après l’installation',
    de: 'Nach der Einrichtung nutzen und anpassen',
  },
  setupGroup: {
    en: 'Installation',
    ja: '導入する',
    fr: 'Installation',
    de: 'Einrichtung',
  },
  migrationGroup: {
    en: 'Update an existing integration',
    ja: '移行・更新',
    fr: 'Mettre à jour une intégration',
    de: 'Eine bestehende Integration aktualisieren',
  },
  migrationReading: {
    en: 'For an existing integration. Follow the changes that apply to the packages and features your app already uses.',
    ja: 'テーマだけを使うアプリは、テーマの更新とWeb画面の確認が対象です。ネイティブ連携を使う場合は、その起動処理と端末での動作も確認します。',
    fr: 'Pour une intégration existante. Appliquez les changements correspondant aux paquets et fonctions déjà utilisés.',
    de: 'Für eine bestehende Integration. Führen Sie die Änderungen für die bereits genutzten Pakete und Funktionen aus.',
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
    ja: 'Ionicのテーマは、ボタンやタブなどのWebコンポーネントをiOSやAndroidの見た目に整えます。iOSでは、CapacitorまたはCordovaのプラグインを追加すると、対応するコントロールをネイティブ表示できます。',
    fr: 'Une boîte à outils open source pour associer écrans Web et interface native dans les applications iOS et Android. Créez vos écrans en HTML, CSS et JavaScript, utilisez des thèmes adaptés aux plateformes et ajoutez des contrôles natifs via Capacitor ou Cordova.',
    de: 'Ein Open-Source-Toolkit, das Web-Oberflächen und native UI in iOS- und Android-Apps verbindet. Erstellen Sie Oberflächen mit HTML, CSS und JavaScript, nutzen Sie Plattform-Themes und ergänzen Sie native Steuerelemente über Capacitor oder Cordova.',
  },
  approach: {
    en: 'Keep your screens on the Web. When an interaction calls for the platform itself, hand that control to the OS.',
    ja: '画面はWebのまま。タブバーやボタンには、OS標準の質感と操作感を取り入れられます。',
    fr: 'Gardez vos écrans Web et confiez au système les contrôles qui nécessitent un rendu ou un comportement natif.',
    de: 'Die Ansichten bleiben im Web. Einzelne Bedienelemente kann das Betriebssystem selbst darstellen und bedienen.',
  },
  start: {
    en: 'Set up your Ionic app',
    ja: 'Ionicアプリに導入する',
    fr: 'Configurer votre application Ionic',
    de: 'Die Ionic-App einrichten',
  },
  startDescription: {
    en: 'For an existing Ionic app with Capacitor 8. Follow the steps to install iOS 26/27 and MD3, configure the app, then run and verify Native UI, Dynamic Color, and Vertical Bars.',
    ja: 'Ionic 9とCapacitor 8を使うアプリに、iOS向けテーマとAndroid向けのMaterial Design 3を導入します。ビルド後、対象端末でiOSのネイティブコントロールやAndroidの端末配色を確認します。',
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
    ja: '概要',
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
    ja: '各パッケージの導入方法・設定・APIを調べられます。',
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
    en: 'A tab bar drawn by iOS',
    ja: '写真の上に浮かぶ、iOSのタブバー',
    fr: 'Une barre d’onglets dessinée par iOS',
    de: 'Eine von iOS gezeichnete Tableiste',
  },
  iosDetail: {
    en: 'The photos stay in the WebView. On iOS 26 and later, the plugin can render the tab bar in Liquid Glass. Tapping a native tab still triggers navigation in your Web app.',
    ja: 'タブを押したまま指を滑らせると、ガラスのレンズが指に追従し、その縁で写真が屈折して見えます。写真一覧はWebView、手前のタブバーはUIKitが描画し、タブの切り替えには既存のWeb側の処理を使います。',
    fr: 'Les photos restent dans la WebView. À partir d’iOS 26, le plugin peut afficher la barre d’onglets en Liquid Glass. Toucher un onglet déclenche la navigation de l’application Web.',
    de: 'Die Fotos bleiben in der WebView. Ab iOS 26 kann das Plugin die Tableiste in Liquid Glass darstellen. Beim Antippen übernimmt die bestehende Web-Navigation den Seitenwechsel.',
  },
  androidBenefit: {
    en: 'Custom native views',
    ja: '独自のネイティブUI',
    fr: 'Vues natives personnalisées',
    de: 'Eigene native Ansichten',
  },
  androidDetail: {
    en: 'For custom views, the experimental extension API connects SwiftUI on iOS or Compose on Android to your Web state and actions.',
    ja: '独自のUIには、iOSのSwiftUIやAndroidのComposeからWeb側の状態と操作を利用できる拡張API（実験的）があります。',
    fr: 'L’API d’extension expérimentale relie vos vues SwiftUI sur iOS ou Compose sur Android à l’état et aux actions de l’application Web.',
    de: 'Die experimentelle Erweiterungs-API verbindet SwiftUI unter iOS oder Compose unter Android mit Zustand und Aktionen der Web-App.',
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
    kind: chapter.kind,
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
