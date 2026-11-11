import { resolveDocsLocale } from './docs-locales';

// Portal-owned narrative. Package pages own detailed configuration and APIs.
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
    paragraphs: {
      en: [
        'The standard setup combines the iOS 27 and Material Design 3 themes. Start there for a new integration; use the individual theme guides when adding only a theme to an existing app.',
        'Themes style your Web UI. Dynamic Color obtains the Android palette through the plugin and applies it through the Material Design theme. Keep one owner for the app’s appearance preference, including when the app chooses a different mode from the device.',
      ],
      ja: [
        '標準導入ではiOS 27とMaterial Design 3のテーマを組み合わせます。新規導入はそこから始め、既存アプリにテーマだけを追加する場合は個別のテーマガイドを使います。',
        'テーマはWeb UIの見た目を担当します。Dynamic ColorはプラグインでAndroidの配色を取得し、Material Designのテーマを通じて反映します。デバイスと異なるモードを選ぶ場合も、アプリの配色モードを管理する場所は一つに保ちます。',
      ],
      fr: [
        'La configuration standard associe les thèmes iOS 27 et Material Design 3. Commencez par elle pour une nouvelle intégration ; utilisez les guides individuels pour ajouter seulement un thème.',
        'Les thèmes habillent l’interface Web. Dynamic Color obtient la palette Android via le plugin et l’applique via le thème Material Design. Gardez un seul responsable du mode d’apparence, même si celui de l’application diffère de celui de l’appareil.',
      ],
      de: [
        'Die Standardeinrichtung kombiniert die Themes für iOS 27 und Material Design 3. Beginnen Sie bei einer neuen Integration dort; die einzelnen Theme-Anleitungen eignen sich zum Ergänzen eines bestehenden Projekts.',
        'Themes gestalten die Web-Oberfläche. Dynamic Color liest die Android-Palette über das Plugin und wendet sie über das Material-Design-Theme an. Verwalten Sie den Erscheinungsmodus an einer Stelle, auch wenn App und Gerät unterschiedliche Modi verwenden.',
      ],
    },
    links: [
      {
        path: '/projects/ionic-theme-ios27/docs/setup',
        label: {
          en: 'iOS theme',
          ja: 'iOSのテーマ',
          fr: 'Thème iOS',
          de: 'iOS-Theme',
        },
      },
      {
        path: '/projects/ionic-theme-md3/docs/setup',
        label: {
          en: 'Material Design theme',
          ja: 'Material Designのテーマ',
          fr: 'Thème Material Design',
          de: 'Material-Design-Theme',
        },
      },
      {
        path: '/projects/capacitor-native-ui/docs/dynamic-colors',
        label: {
          en: 'Dynamic Color and appearance preferences',
          ja: 'Dynamic Colorと配色モード',
          fr: 'Dynamic Color et préférences d’apparence',
          de: 'Dynamic Color und Erscheinungsmodus',
        },
      },
      {
        path: '/projects/ionic-theme-md3/docs/color-system',
        label: {
          en: 'Color mapping',
          ja: '色のマッピング',
          fr: 'Correspondance des couleurs',
          de: 'Farbzuordnung',
        },
      },
      {
        path: '/projects/ionic-theme-ios27/docs/adaptive-themes',
        label: {
          en: 'Adaptive themes',
          ja: 'テーマの切り替え',
          fr: 'Thèmes adaptatifs',
          de: 'Adaptive Themes',
        },
      },
    ],
    sections: [
      {
        title: {
          en: 'Choose the appearance owner',
          ja: '配色モードの管理元を決める',
          fr: 'Choisir qui gère l’apparence',
          de: 'Die Zuständigkeit für den Modus festlegen',
        },
        body: {
          en: 'For an app that follows the device, standard setup uses the theme controller in system mode. If your app already offers light, dark or system preferences, keep that preference as the source of truth and connect Dynamic Color to it. Do not add another system-mode controller beside it.',
          ja: 'デバイスに追従するアプリでは、標準導入のテーマコントローラーをsystemモードで使います。アプリにライト・ダーク・システム追従の設定がすでにある場合は、その設定を管理元としてDynamic Colorを接続します。別のsystemモードのコントローラーを並行して追加しません。',
          fr: 'Pour suivre l’appareil, la configuration standard utilise le contrôleur du thème en mode system. Si votre application propose déjà des préférences clair, sombre ou système, conservez-les comme source de vérité et connectez-y Dynamic Color. N’ajoutez pas un second contrôleur en parallèle.',
          de: 'Für Apps, die dem Gerät folgen, verwendet die Standardeinrichtung den Theme-Controller im Modus system. Bietet Ihre App bereits Hell-, Dunkel- oder Systemeinstellungen an, bleiben diese maßgeblich. Verbinden Sie Dynamic Color damit, statt einen zweiten System-Controller hinzuzufügen.',
        },
      },
      {
        title: {
          en: 'Separate mode from palette',
          ja: 'モードとパレットを分けて考える',
          fr: 'Distinguer mode et palette',
          de: 'Modus und Palette unterscheiden',
        },
        body: {
          en: 'Light or dark is the app’s appearance choice; Dynamic Color supplies the available Android colors. Apply colors for the app’s selected mode, even when it differs from the device. On devices without Dynamic Color, keep the theme’s fallback palette. Check both modes and the fallback rather than testing only the device’s current colors.',
          ja: 'ライトかダークかはアプリの表示設定で、Dynamic ColorはAndroidで利用できる配色を提供します。デバイスと設定が異なる場合も、アプリが選んだモードに合う色を適用します。Dynamic Colorを利用できない端末ではテーマの既定色を使います。端末の現在の配色だけでなく、両モードとフォールバックを確認してください。',
          fr: 'Le mode clair ou sombre est un choix de l’application ; Dynamic Color fournit les couleurs Android disponibles. Appliquez les couleurs du mode choisi dans l’application, même s’il diffère de celui de l’appareil. Sans Dynamic Color, conservez la palette du thème. Vérifiez les deux modes et la palette de repli.',
          de: 'Hell oder dunkel ist eine Entscheidung der App; Dynamic Color liefert die verfügbaren Android-Farben. Verwenden Sie die Farben des gewählten App-Modus, auch wenn dieser vom Gerät abweicht. Ohne Dynamic Color bleibt die Theme-Palette erhalten. Prüfen Sie beide Modi und die Fallback-Palette.',
        },
      },
    ],
  },
  {
    id: 'native-ui',
    title: {
      en: 'Use native UI',
      ja: 'ネイティブUIを使う',
      fr: 'Utiliser l’interface native',
      de: 'Native UI verwenden',
    },
    description: {
      en: 'Project your Web controls into native UI while your app keeps its state, routes and handlers.',
      ja: 'アプリの状態・ルーティング・イベント処理を保ったまま、WebのコントロールをネイティブUIで表示します。',
      fr: 'Affichez vos contrôles Web en interface native tout en conservant l’état, les routes et les gestionnaires de votre application.',
      de: 'Stellen Sie Web-Steuerelemente nativ dar, während Zustand, Routing und Ereignisbehandlung in Ihrer App bleiben.',
    },
    paragraphs: {
      en: [
        'The Capacitor plugin offers three capabilities: use its built-in native UI (currently iOS), obtain Dynamic Color (currently Android), or implement your own native UI. Standard setup combines the first two; this chapter covers the built-in controls.',
        'Ordinary controls and Vertical Bars are enabled by default. The default installation also connects device-layout notifications. After installation, adjust only the controls or behavior your application needs.',
      ],
      ja: [
        'Capacitorプラグインには、用意されたNative UIを使う（現在iOS）、Dynamic Colorを使う（現在Android）、自分でNative UIを作る、という3つの機能があります。標準導入は最初の二つを組み合わせます。この章では用意されたコントロールを扱います。',
        '通常のコントロールとVertical Barsはデフォルトで有効です。通常導入にはデバイスのレイアウト通知の接続も含みます。導入後はアプリで調整したいコントロールや動作の設定を読み進めてください。',
      ],
      fr: [
        'Le plugin Capacitor propose trois fonctions : utiliser son interface native intégrée (actuellement iOS), obtenir Dynamic Color (actuellement Android) ou créer sa propre interface native. La configuration standard combine les deux premières ; ce chapitre traite des contrôles intégrés.',
        'Les contrôles ordinaires et Vertical Bars sont activés par défaut. L’installation connecte aussi les notifications de disposition de l’appareil. Ajustez ensuite les contrôles ou comportements nécessaires à votre application.',
      ],
      de: [
        'Das Capacitor-Plugin bietet drei Funktionen: integrierte native UI verwenden (derzeit iOS), Dynamic Color beziehen (derzeit Android) oder eigene native UI erstellen. Die Standardeinrichtung kombiniert die ersten beiden; dieses Kapitel behandelt die integrierten Steuerelemente.',
        'Normale Steuerelemente und Vertical Bars sind standardmäßig aktiviert. Die Einrichtung verbindet auch die Layout-Benachrichtigungen des Geräts. Passen Sie danach die benötigten Steuerelemente und Verhaltensweisen an.',
      ],
    },
    links: [
      {
        path: '/projects/capacitor-native-ui/docs/native-ui',
        label: {
          en: 'Controls and Web projection',
          ja: 'コントロールとWebからの反映',
          fr: 'Contrôles et projection Web',
          de: 'Steuerelemente und Web-Projektion',
        },
      },
      {
        path: '/projects/capacitor-native-ui/docs/configuration',
        label: {
          en: 'Configure native controls',
          ja: 'ネイティブコントロールの設定',
          fr: 'Configurer les contrôles natifs',
          de: 'Native Steuerelemente konfigurieren',
        },
      },
      {
        path: '/projects/capacitor-native-ui/docs/appearance',
        label: {
          en: 'Native appearance',
          ja: 'ネイティブUIの外観',
          fr: 'Apparence native',
          de: 'Natives Erscheinungsbild',
        },
      },
      {
        path: '/projects/cordova-native-ui/docs/readme',
        label: {
          en: 'Use with Cordova',
          ja: 'Cordovaで使う',
          fr: 'Utiliser avec Cordova',
          de: 'Mit Cordova verwenden',
        },
      },
    ],
    sections: [
      {
        title: {
          en: 'Keep application behavior in the Web layer',
          ja: 'アプリの動作はWeb側で管理する',
          fr: 'Garder le comportement dans la couche Web',
          de: 'Das App-Verhalten in der Web-Schicht belassen',
        },
        body: {
          en: 'The Web element describes the control’s state and actions. Native UI presents supported controls and sends interactions back to the existing Web handlers. Keep route changes, validation and application state in those handlers; do not implement a second copy in native code.',
          ja: 'Webの要素がコントロールの状態と操作を表します。Native UIは対応するコントロールを描画し、操作を既存のWebのハンドラーへ戻します。画面遷移・検証・アプリの状態更新はそのハンドラーが担当し、ネイティブ側に同じ処理を二重実装しません。',
          fr: 'L’élément Web décrit l’état et les actions du contrôle. Native UI présente les contrôles compatibles et renvoie les interactions aux gestionnaires Web existants. Gardez navigation, validation et état dans ces gestionnaires, sans les dupliquer en code natif.',
          de: 'Das Web-Element beschreibt Zustand und Aktionen. Native UI stellt unterstützte Steuerelemente dar und leitet Interaktionen an die vorhandenen Web-Handler zurück. Routing, Validierung und Zustandsänderungen bleiben dort und werden nicht nativ dupliziert.',
        },
      },
      {
        title: {
          en: 'Choose what you already have',
          ja: '既存の画面に合う導入方法を選ぶ',
          fr: 'Partir de votre interface existante',
          de: 'Von der vorhandenen Oberfläche ausgehen',
        },
        body: {
          en: 'Use standard setup for the complete Ionic experience. When you only need native controls, choose one of the integrations below: the iOS 27 theme, your existing Web theme, or HTML without Ionic. These are alternatives for the same capability, not three steps to perform in order. Keep unsupported controls usable on the Web and verify their existing event handlers.',
          ja: 'Ionicで全体を導入するなら標準導入を使います。Native UIだけを導入する場合は、iOS 27テーマ・既存のWebテーマ・Ionicを使わないHTMLのいずれかを下の表で選びます。同じ機能の導入方法の違いなので、順番に三つとも実行する必要はありません。非対応のコントロールはWebで操作できる状態を保ち、既存のイベント処理も確認します。',
          fr: 'Utilisez la configuration standard pour l’ensemble Ionic. Pour les seuls contrôles natifs, choisissez une intégration ci-dessous : thème iOS 27, thème Web existant ou HTML sans Ionic. Ce sont des alternatives, pas trois étapes successives. Gardez les contrôles non compatibles utilisables sur le Web et vérifiez leurs événements.',
          de: 'Für die vollständige Ionic-Einrichtung verwenden Sie die Standardanleitung. Für native Steuerelemente allein wählen Sie unten das iOS-27-Theme, Ihr bestehendes Web-Theme oder HTML ohne Ionic. Dies sind Alternativen, keine aufeinanderfolgenden Schritte. Nicht unterstützte Steuerelemente bleiben im Web bedienbar; prüfen Sie ihre Ereignisbehandlung.',
        },
      },
    ],
  },
  {
    id: 'device-layout',
    title: {
      en: 'Adapt to the device',
      ja: 'デバイスに対応する',
      fr: 'S’adapter à l’appareil',
      de: 'An das Gerät anpassen',
    },
    description: {
      en: 'Follow display changes and place Vertical Bars on supported devices.',
      ja: 'ディスプレイの変化に追従し、対応デバイスに合わせてVertical Barsを配置します。',
      fr: 'Suivez les changements d’affichage et placez Vertical Bars sur les appareils compatibles.',
      de: 'Reagieren Sie auf Anzeigeänderungen und platzieren Sie Vertical Bars auf unterstützten Geräten.',
    },
    paragraphs: {
      en: [
        'Device adaptation is part of standard setup, including iPhone Duo support. The Foldable subscription supplies the initial layout and later changes; the resolver and theme apply the matching placement.',
        'Read this chapter to understand the supported device and OS combinations or to customize layout. Ordinary devices retain Web layout when native rail placement is not supported.',
      ],
      ja: [
        'iPhone Duoを含むデバイスへの対応は標準導入に含まれます。Foldableの購読で初期レイアウトとその後の変更を受け取り、resolverとテーマで配置を反映します。',
        'この章では対応デバイス・OSの条件と、レイアウトを調整する方法を説明します。ネイティブのレール配置に対応しないデバイスではWebレイアウトを維持します。',
      ],
      fr: [
        'L’adaptation aux appareils, y compris iPhone Duo, fait partie de la configuration standard. L’abonnement Foldable fournit la disposition initiale et ses changements ; le résolveur et le thème appliquent le placement adapté.',
        'Ce chapitre explique les appareils et systèmes compatibles ainsi que la personnalisation de la disposition. Les appareils sans placement natif des rails conservent la disposition Web.',
      ],
      de: [
        'Die Geräteanpassung einschließlich iPhone Duo gehört zur Standardeinrichtung. Das Foldable-Abonnement liefert das anfängliche Layout und spätere Änderungen; Resolver und Theme wenden die passende Platzierung an.',
        'Dieses Kapitel erklärt unterstützte Geräte und Betriebssysteme sowie Layout-Anpassungen. Geräte ohne native Rail-Platzierung behalten das Web-Layout.',
      ],
    },
    links: [
      {
        path: '/projects/capacitor-native-ui/docs/device-layout',
        label: {
          en: 'Device layout notifications',
          ja: 'デバイスのレイアウト通知',
          fr: 'Notifications de disposition',
          de: 'Layout-Benachrichtigungen',
        },
      },
      {
        path: '/projects/capacitor-native-ui/docs/vertical-bars',
        label: {
          en: 'Vertical Bars and platform requirements',
          ja: 'Vertical Barsと対応条件',
          fr: 'Vertical Bars et compatibilité',
          de: 'Vertical Bars und Voraussetzungen',
        },
      },
      {
        path: '/projects/ionic-theme-ios27/docs/vertical-bars-layout',
        label: {
          en: 'Theme layout settings',
          ja: 'テーマのレイアウト設定',
          fr: 'Réglages de disposition du thème',
          de: 'Layout-Einstellungen des Themes',
        },
      },
    ],
    sections: [
      {
        title: {
          en: 'From the device report to Web layout',
          ja: 'デバイスの通知からWebの配置まで',
          fr: 'Du rapport de l’appareil à la disposition Web',
          de: 'Vom Gerätebericht zum Web-Layout',
        },
        body: {
          en: 'Foldable reports display changes. resolveVerticalBarsLayout reads the report and returns edge, inset and toolbarTop in viewport CSS pixels. setVerticalBarsLayout applies those values through the theme. Subscribe before reading the initial layout so startup and later changes use the same update function. Native control projection is handled separately by Native UI.',
          ja: 'Foldableがディスプレイの変更を通知します。resolveVerticalBarsLayoutはその情報を読み、edge・inset・toolbarTopをビューポートのCSSピクセルで返します。setVerticalBarsLayoutがテーマを通じて配置を反映します。購読後に初期値を読むことで、起動時とその後の変化を同じ更新処理に通します。コントロールのネイティブ描画はNative UIが別に担当します。',
          fr: 'Foldable signale les changements d’affichage. resolveVerticalBarsLayout lit ces informations et renvoie edge, inset et toolbarTop en pixels CSS du viewport. setVerticalBarsLayout les applique via le thème. Abonnez-vous avant de lire la disposition initiale pour utiliser la même fonction au démarrage et lors des changements. Native UI gère séparément la projection des contrôles.',
          de: 'Foldable meldet Anzeigeänderungen. resolveVerticalBarsLayout liest den Bericht und liefert edge, inset und toolbarTop in CSS-Pixeln des Viewports. setVerticalBarsLayout wendet sie über das Theme an. Abonnieren Sie zuerst die Änderungen und lesen Sie dann den Anfangszustand, damit beide denselben Aktualisierungspfad verwenden. Die native Darstellung übernimmt Native UI separat.',
        },
      },
      {
        title: {
          en: 'Let the reported layout decide',
          ja: '通知されたレイアウトを判断元にする',
          fr: 'Se fier à la disposition signalée',
          de: 'Das gemeldete Layout entscheiden lassen',
        },
        body: {
          en: 'An edge of null restores ordinary Web layout. Use the reported geometry instead of guessing from the device name, screen width or foldable status. Web spacing and native rail availability are distinct: a browser preview can validate spacing, while native rail rendering needs a supported device and OS. Check both rail edges, rotation, display changes and return to ordinary layout.',
          ja: 'edgeがnullなら通常のWebレイアウトへ戻ります。デバイス名・画面幅・折りたたみ端末かどうかで推測せず、通知された配置を使います。Webの余白調整とネイティブレールの利用可否は別です。ブラウザーでは余白を確認でき、ネイティブ描画は対応デバイスとOSで確認します。左右のレール・回転・ディスプレイの切り替え・通常配置への復帰を確認してください。',
          fr: 'Un edge null rétablit la disposition Web ordinaire. Utilisez la géométrie signalée, sans la déduire du nom, de la largeur ou du caractère pliable de l’appareil. L’espacement Web et la disponibilité du rail natif sont distincts : le navigateur permet de vérifier l’espacement, tandis que le rendu natif exige un appareil et un OS compatibles. Vérifiez les deux côtés, la rotation, les changements d’affichage et le retour à la disposition ordinaire.',
          de: 'Bei edge gleich null wird das normale Web-Layout wiederhergestellt. Nutzen Sie die gemeldete Geometrie statt Gerätename, Bildschirmbreite oder Faltbarkeit als Heuristik. Web-Abstände und native Rail-Verfügbarkeit sind getrennt: Abstände lassen sich im Browser prüfen, natives Rendering erfordert ein unterstütztes Gerät und Betriebssystem. Prüfen Sie beide Rail-Seiten, Rotation, Anzeigewechsel und die Rückkehr zum normalen Layout.',
        },
      },
    ],
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
    paragraphs: {
      en: [
        'Start with the built-in controls. For application-specific UI, the plugin’s experimental extension API lets you add native implementations using SwiftUI or Android Compose.',
        'Engine is the lower-level rendering and projection layer. Its integration and reference guides are for custom hosts and renderer work; they are not prerequisites for standard setup.',
      ],
      ja: [
        'まずは用意されたコントロールを使います。アプリ固有のUIが必要な場合は、プラグインの実験的な拡張APIでSwiftUIやAndroid Composeの実装を追加できます。',
        'Engineは描画とWebからの反映を担う下位レイヤーです。独自ホストやレンダラーを実装する際に統合ガイドやリファレンスを参照します。標準導入の前提知識として読む必要はありません。',
      ],
      fr: [
        'Commencez par les contrôles intégrés. Pour une interface propre à votre application, l’API expérimentale d’extension du plugin permet d’ajouter des implémentations SwiftUI ou Android Compose.',
        'Engine est la couche de rendu et de projection sous-jacente. Ses guides concernent les hôtes et moteurs de rendu personnalisés ; ils ne sont pas nécessaires à la configuration standard.',
      ],
      de: [
        'Beginnen Sie mit den integrierten Steuerelementen. Für anwendungsspezifische UI ermöglicht die experimentelle Erweiterungs-API Implementierungen mit SwiftUI oder Android Compose.',
        'Engine bildet die darunterliegende Rendering- und Projektionsschicht. Die Anleitungen richten sich an eigene Hosts und Renderer; sie sind keine Voraussetzung für die Standardeinrichtung.',
      ],
    },
    links: [
      {
        path: '/projects/capacitor-native-ui/docs/native-ui-extensions',
        label: {
          en: 'Native UI extensions (experimental)',
          ja: 'Native UIの拡張（実験的）',
          fr: 'Extensions Native UI (expérimental)',
          de: 'Native-UI-Erweiterungen (experimentell)',
        },
      },
      {
        path: '/projects/webview-native-ui-engine/docs/overview',
        label: {
          en: 'How Engine fits in',
          ja: 'Engineの役割',
          fr: 'Rôle d’Engine',
          de: 'Die Rolle von Engine',
        },
      },
      {
        path: '/projects/webview-native-ui-engine/docs/advanced/renderer',
        label: {
          en: 'Custom rendering',
          ja: '独自の描画',
          fr: 'Rendu personnalisé',
          de: 'Eigene Darstellung',
        },
      },
      {
        path: '/projects/webview-native-ui-engine/docs/reference/projection',
        label: {
          en: 'Projection reference',
          ja: '反映処理のリファレンス',
          fr: 'Référence de projection',
          de: 'Projektionsreferenz',
        },
      },
    ],
    sections: [
      {
        title: {
          en: 'Share state and actions, customize presentation',
          ja: '状態と操作を共有し、表示を拡張する',
          fr: 'Partager état et actions, adapter la présentation',
          de: 'Zustand und Aktionen teilen, Darstellung erweitern',
        },
        body: {
          en: 'Define a read-only DOM reader that exposes the properties to display and the Web action targets. Native code renders those properties and invokes the declared actions. The Web element remains the source of truth and the fallback UI; do not move business logic into the reader or duplicate it in SwiftUI or Compose.',
          ja: '表示する値とWebの操作対象を公開する、読み取り専用のDOM readerを定義します。ネイティブ側はその値を描画し、宣言された操作を呼び出します。Webの要素を状態の基準とフォールバックUIに保ち、readerへの業務ロジックの移動やSwiftUI・Composeへの二重実装はしません。',
          fr: 'Définissez un lecteur DOM en lecture seule exposant les propriétés à afficher et les cibles d’action Web. Le code natif affiche ces propriétés et invoque les actions déclarées. L’élément Web reste la source de vérité et l’interface de repli ; ne déplacez pas la logique métier dans le lecteur et ne la dupliquez pas en SwiftUI ou Compose.',
          de: 'Definieren Sie einen nur lesenden DOM-Reader, der Eigenschaften und Web-Aktionsziele bereitstellt. Nativer Code stellt die Eigenschaften dar und ruft die deklarierten Aktionen auf. Das Web-Element bleibt maßgeblich und dient als Fallback. Geschäftslogik gehört weder in den Reader noch als Kopie in SwiftUI oder Compose.',
        },
      },
      {
        title: {
          en: 'Keep the extension local to your app',
          ja: '拡張はアプリ内で完結させる',
          fr: 'Garder l’extension dans l’application',
          de: 'Die Erweiterung in der App belassen',
        },
        body: {
          en: 'Keep the Web definition and native implementation in the application; a separate npm package or Capacitor plugin is not required. Register the matching native implementation on each platform you support. Begin with the experimental extension guide; use Engine directly only when building a custom host or rendering integration.',
          ja: 'Web側の定義とネイティブ側の実装はアプリ内に置けます。別のnpmパッケージやCapacitorプラグインを作る必要はありません。対応するプラットフォームごとに同じ定義に対応するネイティブ実装を登録します。まず実験的な拡張ガイドを使い、独自ホストや描画統合を作る場合にEngineを直接扱います。',
          fr: 'Gardez la définition Web et l’implémentation native dans l’application ; aucun paquet npm ni plugin Capacitor distinct n’est nécessaire. Enregistrez l’implémentation correspondante sur chaque plateforme prise en charge. Commencez par le guide expérimental d’extension ; utilisez Engine directement pour un hôte ou une intégration de rendu personnalisés.',
          de: 'Web-Definition und native Implementierung können in der App bleiben; ein separates npm-Paket oder Capacitor-Plugin ist nicht nötig. Registrieren Sie die passende Implementierung auf jeder unterstützten Plattform. Beginnen Sie mit der experimentellen Erweiterungsanleitung. Verwenden Sie Engine direkt für eigene Hosts oder Rendering-Integrationen.',
        },
      },
    ],
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
    paragraphs: {
      en: [
        'Use standard setup as the target, then follow the migration guide for the packages already installed. Check the theme and plugin guides together when your application uses both.',
        'Application state, routing and event handlers remain in the application. Ordinary startup belongs at the app shell; introduce custom lifecycle management only when your application actually replaces that shell. iOS 26 documentation remains available for existing users.',
      ],
      ja: [
        '標準導入を移行先の構成として確認し、現在使っているパッケージの移行ガイドへ進みます。テーマとプラグインを併用している場合は、両方の変更点を確認します。',
        '状態・ルーティング・イベント処理は引き続きアプリが担当します。通常の初期化はアプリシェルで行い、独自のライフサイクル管理はシェル自体を置き換えるアプリで必要な場合に扱います。iOS 26のドキュメントも維持します。',
      ],
      fr: [
        'Prenez la configuration standard comme cible, puis consultez la migration des paquets déjà installés. Vérifiez les guides du thème et du plugin si vous utilisez les deux.',
        'L’état, les routes et les événements restent dans l’application. L’initialisation ordinaire se fait au niveau du shell ; une gestion de cycle de vie particulière ne concerne que les applications qui le remplacent. La documentation iOS 26 reste accessible.',
      ],
      de: [
        'Verwenden Sie die Standardeinrichtung als Ziel und folgen Sie dann den Migrationsanleitungen der installierten Pakete. Prüfen Sie Theme und Plugin gemeinsam, wenn Ihre App beide nutzt.',
        'Zustand, Routing und Ereignisbehandlung bleiben in der Anwendung. Die normale Initialisierung erfolgt in der App-Shell; eigene Lebenszyklusverwaltung ist nur bei deren Austausch relevant. Die iOS-26-Dokumentation bleibt verfügbar.',
      ],
    },
    links: [
      {
        path: '/projects/capacitor-native-ui/docs/migration',
        label: {
          en: 'Native UI migration',
          ja: 'Native UIの移行',
          fr: 'Migration Native UI',
          de: 'Native-UI-Migration',
        },
      },
      {
        path: '/projects/ionic-theme-ios27/docs/migration',
        label: {
          en: 'iOS theme migration',
          ja: 'iOSテーマの移行',
          fr: 'Migration du thème iOS',
          de: 'iOS-Theme-Migration',
        },
      },
      {
        path: '/projects/ionic-theme-md3/docs/migration',
        label: {
          en: 'Material Design theme migration',
          ja: 'Material Designテーマの移行',
          fr: 'Migration du thème Material Design',
          de: 'Material-Design-Theme-Migration',
        },
      },
      {
        path: '/projects/ionic-theme-ios26',
        label: {
          en: 'iOS 26 documentation',
          ja: 'iOS 26のドキュメント',
          fr: 'Documentation iOS 26',
          de: 'iOS-26-Dokumentation',
        },
      },
    ],
    sections: [
      {
        title: {
          en: 'Keep app behavior, replace integration wiring',
          ja: 'アプリの動作を保ち、接続部分を更新する',
          fr: 'Conserver le comportement, remplacer l’intégration',
          de: 'App-Verhalten erhalten, Integration aktualisieren',
        },
        body: {
          en: 'Keep routes, state and event handlers. If an earlier guide introduced a mountNativeUI wrapper solely for ordinary startup, remove that wrapper and its teardown wiring. Start once at the app shell and keep the default controls. For device layout, replace direct placement mapping with the resolver in the existing layout subscription rather than adding a second listener.',
          ja: 'ルート・状態・イベントハンドラーは維持します。以前のガイドのmountNativeUIラッパーを通常起動のためだけに追加した場合は、そのラッパーと破棄処理の接続を取り除きます。アプリシェルで一度起動し、デフォルトのコントロールを使います。デバイスの配置は直接の値変換をresolverへ置き換え、既存のレイアウト購読を更新します。別の購読を追加しません。',
          fr: 'Conservez routes, état et gestionnaires. Si un ancien guide a introduit mountNativeUI uniquement pour le démarrage ordinaire, retirez ce wrapper et son nettoyage associé. Démarrez une fois au niveau du shell et gardez les contrôles par défaut. Remplacez le mappage direct de disposition par le résolveur dans l’abonnement existant, sans ajouter un second écouteur.',
          de: 'Behalten Sie Routing, Zustand und Handler bei. Wurde mountNativeUI aus einer früheren Anleitung nur für den normalen Start übernommen, entfernen Sie diesen Wrapper und seine Aufräumlogik. Starten Sie einmal an der App-Shell mit den Standard-Steuerelementen. Ersetzen Sie die direkte Layout-Zuordnung im vorhandenen Abonnement durch den Resolver, statt einen zweiten Listener hinzuzufügen.',
        },
      },
      {
        title: {
          en: 'Verify the complete result',
          ja: '全体の動作を確認する',
          fr: 'Vérifier le résultat complet',
          de: 'Das Gesamtergebnis prüfen',
        },
        body: {
          en: 'After updating compatible packages, build the Web assets, sync Capacitor and rebuild the native applications. Check ordinary phone layout and supported rail devices, existing actions and routes, both appearance modes and color fallback. Cordova bundles its integration through its own plugin release; follow that package’s instructions instead of applying the Capacitor commands.',
          ja: '互換性のあるパッケージへ更新したら、Webアセットのビルド・Capacitorのsync・ネイティブアプリの再ビルドを行います。通常のスマートフォンとレール対応端末、既存の操作と画面遷移、ライト・ダーク両モード、配色のフォールバックを確認します。Cordovaは専用プラグインのリリースに統合が含まれるため、Capacitorのコマンドを流用せずそのパッケージの手順に従います。',
          fr: 'Après mise à jour des paquets compatibles, compilez les ressources Web, synchronisez Capacitor et recompilez les applications natives. Vérifiez téléphones ordinaires, appareils à rail, actions et routes existantes, les deux modes et les couleurs de repli. Cordova fournit son intégration dans sa propre version du plugin ; suivez ses instructions plutôt que les commandes Capacitor.',
          de: 'Nach dem Update kompatibler Pakete bauen Sie die Web-Assets, synchronisieren Capacitor und bauen die nativen Apps neu. Prüfen Sie normale Smartphones und Rail-Geräte, bestehende Aktionen und Routen, beide Erscheinungsmodi und Fallback-Farben. Cordova bündelt die Integration in eigenen Plugin-Releases; folgen Sie dessen Anleitung statt den Capacitor-Befehlen.',
        },
      },
    ],
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
  compareTitle: {
    en: 'One screen. See what the theme changes.',
    ja: '同じ画面で、テーマの違いを見る。',
    fr: 'Un écran. Découvrez ce que le thème change.',
    de: 'Ein Bildschirm. Sehen Sie, was das Theme verändert.',
  },
  compareDescription: {
    en: 'The same settings, content and controls, rendered with the same Ionic mode. Try the switches and save button in either preview.',
    ja: '同じ設定画面・同じ内容・同じIonicモードで比較できます。スイッチや保存ボタンを、両方の画面で操作してみてください。',
    fr: 'Les mêmes réglages, contenus et contrôles dans le même mode Ionic. Essayez les interrupteurs et le bouton d’enregistrement dans les deux aperçus.',
    de: 'Dieselben Einstellungen, Inhalte und Steuerelemente im selben Ionic-Modus. Probieren Sie Schalter und Speichern in beiden Vorschauen aus.',
  },
  compareSwipe: {
    en: 'Swipe horizontally to compare the same screen before and after applying the theme.',
    ja: '横にスワイプして、同じ画面のテーマ適用前後を比べてください。',
    fr: 'Balayez horizontalement pour comparer le même écran avant et après application du thème.',
    de: 'Wische horizontal, um denselben Bildschirm vor und nach Anwendung des Themes zu vergleichen.',
  },
  baselineLabel: {
    en: 'Standard Ionic',
    ja: '標準Ionic',
    fr: 'Ionic standard',
    de: 'Standard-Ionic',
  },
  previewMode: {
    en: 'Platform to compare',
    ja: '比較するプラットフォーム',
    fr: 'Plateforme à comparer',
    de: 'Plattform vergleichen',
  },
  previewScope: {
    en: 'Live Web theme preview. Native controls and Android device colors are shown by the native app, not by this comparison.',
    ja: '実際のWebテーマを使ったプレビューです。ネイティブコントロールとAndroid端末の配色は、この比較ではなくネイティブアプリで確認できます。',
    fr: 'Aperçu utilisant les vrais thèmes Web. Les contrôles natifs et couleurs Android se vérifient dans l’application native, pas dans cette comparaison.',
    de: 'Live-Vorschau der Web-Themes. Native Steuerelemente und Android-Gerätefarben werden in der nativen App geprüft, nicht in diesem Vergleich.',
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
    en: 'Understand, then customize.',
    ja: '仕組みを理解して、必要な部分を調整する。',
    fr: 'Comprendre, puis personnaliser.',
    de: 'Verstehen und anpassen.',
  },
  standardAudience: {
    en: 'Standard setup: Ionic + Capacitor 8',
    ja: '標準導入：Ionic + Capacitor 8',
    fr: 'Configuration standard : Ionic + Capacitor 8',
    de: 'Standardeinrichtung: Ionic + Capacitor 8',
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
    en: 'Your app keeps its state, navigation and event handlers in the Web layer. The themes are built for Ionic; native UI integrations also support HTML without Ionic. The standard setup below brings the pieces together for an Ionic app with Capacitor.',
    ja: 'アプリの状態・画面遷移・イベント処理はWeb側で管理します。テーマはIonic向けで、ネイティブUIの導入はIonicを使わないHTMLにも対応しています。この下の標準導入では、IonicとCapacitorを使って全体を組み合わせます。',
    fr: 'L’état, la navigation et les événements restent dans la couche Web. Les thèmes sont conçus pour Ionic ; les intégrations natives prennent aussi en charge HTML sans Ionic. La configuration standard ci-dessous réunit ces éléments pour une application Ionic avec Capacitor.',
    de: 'Zustand, Navigation und Ereignisbehandlung bleiben in der Web-Schicht. Die Themes sind für Ionic ausgelegt; native UI lässt sich auch mit HTML ohne Ionic integrieren. Die folgende Standardeinrichtung verbindet diese Bausteine für eine Ionic-App mit Capacitor.',
  },
  start: {
    en: 'Start with the complete setup',
    ja: '標準構成で導入する',
    fr: 'Commencer par la configuration complète',
    de: 'Mit der vollständigen Einrichtung beginnen',
  },
  startDescription: {
    en: 'For an existing Ionic app with Capacitor 8. The guide installs both themes, starts Native UI and Dynamic Color, and connects device-layout notifications for Vertical Bars.',
    ja: 'Capacitor 8を使う既存のIonicアプリ向けです。両方のテーマ、Native UI、Dynamic Colorに加え、Vertical Barsに必要なデバイスのレイアウト通知まで一つの手順で接続します。',
    fr: 'Pour une application Ionic existante avec Capacitor 8. Le guide installe les deux thèmes, démarre Native UI et Dynamic Color et connecte les notifications de disposition pour Vertical Bars.',
    de: 'Für eine vorhandene Ionic-App mit Capacitor 8. Die Anleitung installiert beide Themes, startet Native UI und Dynamic Color und verbindet die Layout-Benachrichtigungen für Vertical Bars.',
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
    en: 'Continue reading',
    ja: '次に読む',
    fr: 'Poursuivre la lecture',
    de: 'Weiterlesen',
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
    en: 'Use iOS 27 theme styling with built-in native controls on iOS 26+ (Xcode 26+). Vertical Bars adapts to supported devices, including iPhone Duo.',
    ja: 'iOS 27テーマのスタイルを使い、iOS 26以降ではプラグインのネイティブコントロールを利用できます（Xcode 26以降）。iPhone Duoなどの対応端末ではVertical Barsで配置も調整します。',
    fr: 'Utilisez le style du thème iOS 27 et les contrôles natifs intégrés sur iOS 26+ (Xcode 26+). Vertical Bars adapte la disposition aux appareils compatibles, dont iPhone Duo.',
    de: 'Nutzen Sie das iOS-27-Theme und integrierte native Steuerelemente unter iOS 26+ (Xcode 26+). Vertical Bars passt das Layout an unterstützte Geräte wie iPhone Duo an.',
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
    path: `/guides/${chapter.id}`,
    title: chapter.title[code],
    description: chapter.description[code],
    paragraphs: chapter.paragraphs[code],
    sections: chapter.sections.map((section) => ({
      title: section.title[code],
      body: section.body[code],
    })),
    links: chapter.links.map((link) => ({ path: link.path, label: link.label[code] })),
  }));
}
export function guideCopyForLocale(locale: string) {
  const code = resolveDocsLocale(locale);
  return Object.fromEntries(
    Object.entries(GUIDE_COPY).map(([key, value]) => [key, value[code]]),
  ) as Record<keyof typeof GUIDE_COPY, string>;
}
