---
sourceRevision: "b777edf9c4ac73b09bcfd66a3f8feb0bcef8e817ed5f08927f0a6ccbd90693a5"
title: Référence des extensions Native UI
---

# Référence des extensions Native UI

Pour réaliser le compteur, suivez le [guide des extensions](native-ui-extensions.md).

## Contrat du lecteur

| Partie | Exigence |
| -------------- | -------------------------------------------------------------------------------------------------------------- |
| Exécution | Synchrone et en lecture seule. |
| Repli Web | Retourner `null` lorsque la source doit rester Web. |
| `props` | Objet JSON contenant nombres finis, chaînes, booléens, null, tableaux et objets ; limité à 64K caractères. |
| Cibles d’action | La source ou ses descendants. Les cibles absentes, masquées ou désactivées ne peuvent pas être activées. |
| Nombre d’actions | Jusqu’à 30 par source. |

## Suivi natif du défilement sur iOS (expérimental)

Pour un élément dans un seul conteneur de défilement overflow, fournissez `scrollElement`. Le Web mesure la disposition ; iOS observe la `UIScrollView` correspondante et ne met à jour que la position native et le découpage pendant le défilement. Les sources d’un même conteneur partagent un observateur. La liaison calibre les origines des coordonnées DOM et natives lorsque le défilement est au repos, puis conserve cette correspondance lors des mises à jour du contenu. Les contrôles partiellement visibles restent natifs et les contrôles entièrement découpés ne peuvent pas recevoir de saisie.

```ts
const scrollElement = await ionContent.getScrollElement();
const counter = defineNativeUI({
  name: 'app.counter',
  selector: '[data-counter]',
  scrollElement: () => scrollElement,
  read(element) {
    return {
      props: { count: Number(element.getAttribute('data-count') ?? 0) },
      actions: { increment: element.querySelector<HTMLButtonElement>('button') },
    };
  },
});
```

Avec du HTML simple, retournez l’élément ayant `overflow: auto` ou `scroll`. Retournez `null` jusqu’à ce qu’il soit prêt, puis appelez `shell.markForCheck()` si cet état de disponibilité n’a pas modifié le DOM. Gardez observables les dimensions des sources et les changements de disposition du contenu ; utilisez `markForCheck()` pour les changements que le shell ne peut pas observer.

Cette fonction utilise la hiérarchie interne des vues overflow de WebKit sans noms de classes privés. Une liaison doit correspondre à exactement un conteneur de défilement natif ; une correspondance absente ou ambiguë conserve la source Web interactive. Ce mécanisme facultatif ne prend pas en charge le défilement imbriqué, le découpage arrondi ou de forme personnalisée, les transformations ou le zoom CSS, les descendants sticky/fixed, le défilement du document, les anciens binaires natifs ni Android. Omettez `scrollElement` pour conserver le chemin de placement JS existant. Les autres sources de projection non liées dans le même conteneur nécessitent toujours la synchronisation ordinaire de la disposition. Chaque `scrollend` effectue une réconciliation par le chemin normal de mise à jour et d’accusé de réception, y compris les nouvelles tentatives après un refus temporaire de liaison.

`NativeUIContext.sourceFrame` est le dernier échantillon de disposition, pas une notification à chaque défilement. Le suivi natif ne reconstruit pas le contenu SwiftUI pour les décalages de défilement. Les accessoires d’onglets fixes n’utilisent pas cette liaison. Les transformations des Web Modal restent sur leur chemin de transfert existant ; le contenu couvert non interactif peut utiliser des images préparées, tandis que le contenu défilant interactif reste natif.

## Le contenu et le placement sont indépendants

| `placement` | Comportement |
| ---------------------- | ------------------------------------------------------------------------------------- |
| Omis ou `'element'` | Héberge le contenu natif dans le cadre Web de l’élément source sur iOS 26+ ou Android API 24+. |
| `'tab-accessory'` | Attache la View à l’accessoire d’onglets SwiftUI système d’une barre projetée sur iOS 26.1+. |

Les extensions sont indépendantes de `controls` et `ionic.auto`, y compris avec `enableVerticalControlArea()`. L’application contrôle leur présentation : retournez `null` du lecteur pour laisser une source Web, puis appelez `markForCheck()` lorsque cette condition change. Les accessoires nécessitent toujours leur hôte d’onglets natif compatible.

### Prérequis des accessoires d’onglets

| Exigence | Configuration prise en charge |
| ------------------- | ------------------------------------------------------------------------------------------------- |
| Emplacement source | À l’intérieur de son `ion-tabs` propriétaire ; le shell résout son `ion-tab-bar`. |
| Hôte natif | Hôte d’onglets SwiftUI Vertical Bars sur iOS 26.1+. |
| Nombre d’accessoires | Un seul accessoire par hôte. |
| Disposition de repli Web | Conservez une disposition Web équivalente, comme un pied de page fixe ; la source garde son espace lorsqu’elle est masquée. |

Les barres UIKit ordinaires, l’absence d’onglets natifs, iOS 26.0 ou des accessoires concurrents laissent la source Web. L’application ne transmet pas de références aux contrôleurs natifs et le shell ne simule pas un accessoire système par une superposition flottante.

## Lire la géométrie source et l’état de présentation

Le shell mesure automatiquement l’élément DOM source. Avec le placement `element` par défaut, il positionne et dimensionne l’hôte SwiftUI selon ce rectangle. Vous n’avez pas à transmettre de coordonnées dans `props` ni à positionner la vue native vous-même.

Utilisez la closure d’enregistrement à trois arguments pour recevoir ces informations :

```swift
try NativeUI.register("app.counter") {
    (props: CounterProps, actions: NativeUIActions, context: NativeUIContext) in
    CounterView(props: props, actions: actions)
        .padding(.horizontal, context.sourceFrame.width < 240 ? 4 : 12)
}
```

La closure existante `(props, actions)` reste prise en charge. Les deux formes utilisent les mêmes noms et vérifications de doublons.

| Propriété du contexte | Signification |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `sourceID` | Identité opaque de la source pendant sa durée de vie actuelle ; ce n’est pas le `id` HTML. |
| `sourceFrame` | `getBoundingClientRect()` du DOM en pixels CSS par rapport à la fenêtre Web, avec `x`, `y`, `width` et `height`. |
| `sourceFrameInWebView` | Rectangle source converti en points UIKit dans les coordonnées locales de la WebView ; pas en coordonnées écran. |
| `viewportWidth` | Largeur CSS de la fenêtre utilisée pour convertir les coordonnées de cet instantané. |
| `pointsPerCSSPixel` | Points UIKit par pixel CSS ; ce n’est pas la densité de pixels de l’appareil. |
| `placement` | `.element` ou `.tabAccessory`. |
| `colorScheme` | `.light` ou `.dark`, également appliqué à l’environnement SwiftUI. |
| `layoutDirection` | `.leftToRight` ou `.rightToLeft`, également appliqué à l’environnement SwiftUI. |

La closure reçoit un contexte actualisé lorsque le shell applique un nouvel instantané, notamment lors des déplacements, redimensionnements et changements d’apparence. Utilisez le contexte actuel au lieu de mémoriser sa géométrie dans `@State`. Les mises à jour traversent le pont Web/natif ; ce ne sont pas des mesures DOM synchrones depuis Swift.

Pour `tabAccessory`, `sourceFrame` décrit toujours l’élément DOM d’origine. Le système attribue la position et la taille réelles de l’accessoire. Utilisez `GeometryReader` dans votre View SwiftUI pour connaître l’espace local réel, quel que soit le placement :

```swift
GeometryReader { geometry in
    CounterView(props: props, actions: actions)
        .frame(width: geometry.size.width, height: geometry.size.height)
}
```

N’appliquez pas `sourceFrame.x` ou `y` comme décalage SwiftUI supplémentaire : le shell positionne déjà l’hôte pour `element`. Votre View organise son contenu à l’intérieur de cet hôte.

## Utiliser les capacités de projection partagées

| Capacité | Utilisation par une extension |
| ----------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Position et taille | Placement automatique de l’hôte et `NativeUIContext` ; limites locales réelles via `GeometryReader`. |
| Mode sombre et RTL | `context` ou `@Environment(\.colorScheme)` et `@Environment(\.layoutDirection)` de SwiftUI. |
| Reduce Motion et accessibilité | Valeurs d’environnement SwiftUI comme `@Environment(\.accessibilityReduceMotion)` et modificateurs d’accessibilité natifs. Donnez des noms accessibles aux contrôles personnalisés. |
| État applicatif issu du DOM | Retournez des `props` JSON depuis `read(element)` ; les changements DOM déclenchent la synchronisation. Sans mutation DOM, appelez `shell.markForCheck()`. |
| Cibles d’action actives/visibles | `actions.availableNames` ou `actions.isAvailable("increment")` ; les cibles DOM indisponibles sont omises. |
| Invoquer l’action Web d’origine | `try await actions.activate("increment")` ; fin et échec suivent le contrat ci-dessous. |
| Repli Web temporaire et nettoyage | Gérés automatiquement pour le contenu incompatible, les superpositions, la suspension de navigation et la suppression de sources. |
| Suspension contrôlée par l’application | Utilisez `suspend()` sur le handle, `resume()` sur le jeton retourné, et `destroy()` depuis JavaScript. |

Par exemple, désactivez un bouton natif lorsque son action d’origine est indisponible :

```swift
Button("Increment") {
    Task { @MainActor in
        do { try await actions.activate("increment") }
        catch { /* Present an application-appropriate error. */ }
    }
}
.disabled(!actions.isAvailable("increment"))
```

La disponibilité est un instantané, pas une réservation : une cible peut disparaître avant l’activation ; gérez aussi les erreurs. Texte personnalisé, sélection, polices, couleurs et badges relèvent des `props` et de la View SwiftUI de votre extension ; le shell ne déduit pas la structure visuelle d’un composant personnalisé depuis le CSS. Lisez les styles calculés et attributs dans votre lecteur. Utilisez les API partagées de conversion d’images et de couleurs ci-dessous au lieu de les réimplémenter.

## Planifier une vérification de source

Les attributs, textes, enfants, tailles observées, défilements et événements de cycle de vie pris en charge déclenchent des vérifications automatiques. Le shell ne surveille pas périodiquement les variables JavaScript ou propriétés DOM arbitraires. Après un changement d’état utilisé par votre lecteur sans mutation DOM, demandez une vérification :

```ts
source.playbackPosition = newPosition; // Propriété définie par l’application et lue par votre extension.
shell.markForCheck();
```

`markForCheck(): void` planifie une relecture et une mesure géométrique ; elle ne met pas à jour le DOM applicatif et ne force pas de rendu natif. Les appels répétés sont regroupés, les instantanés inchangés ne sont pas envoyés. Un appel pendant une mise à jour du pont planifie une vérification ultérieure. La projection suspendue le reste jusqu’à sa reprise. Après `destroy()` ou sans runtime de projection, les appels ne font rien.

Appelez après validation des changements DOM pertinents par votre framework. Cette API ne déclenche ni détection Angular ni rendu React/Vue, et ce n’est pas une promesse attendant la fin native. Elle fonctionne aussi pour les contrôles standard dont les propriétés changent sans mutation observable.

## Réutiliser les conversions natives d’images et de couleurs

Le deuxième argument du lecteur expose la capture et la rastérisation SVG standard. Il accepte un `svg` local ou un `ion-icon` résolu appartenant à la source et retourne une **référence d’image opaque**, ou `null` si l’image n’est pas prise en charge. Retournez cette référence dans `props` ; n’essayez pas de lire les octets de façon synchrone :

```ts
const badge = defineNativeUI({
  name: 'app.badge',
  selector: '[data-badge]',
  read(element, context) {
    return {
      props: {
        icon: context.image(element.querySelector<HTMLElement>('ion-icon')),
        color: getComputedStyle(element).color,
      },
    };
  },
});
```

Avant envoi de l’instantané, le shell résout les références en `{ data, width, height, template }` : données PNG base64, dimensions CSS et mode de rendu. Les références imbriquées et copies sont prises en charge ; la clé `$nativeUIImage` est réservée aux références du contexte de lecture actuel. Passez `{ template: true }` comme second argument à `image()` pour que SwiftUI teinte l’icône ; par défaut, les couleurs source sont conservées. Les restrictions SVG locales, la capture RTL, la rastérisation selon l’échelle d’affichage et le cache des contrôles standard s’appliquent. Les ressources externes et contenus SVG incompatibles retournent `null` ; un `ion-icon` non résolu doit conserver le repli Web jusqu’au chargement. Un échec de rastérisation ou des props trop volumineuses laissent l’extension Web.

Sur iOS, décodez le résultat avec `NativeUIImage` et utilisez les convertisseurs partagés :

```swift
struct BadgeProps: Decodable {
    let icon: NativeUIImage?
    let color: String
}

struct BadgeView: View {
    let props: BadgeProps
    var body: some View {
        if let icon = props.icon, let image = NativeUIRendering.image(icon) {
            Image(uiImage: image)
                .foregroundStyle(Color(uiColor: NativeUIRendering.color(props.color)))
        }
    }
}
```

`NativeUIRendering.image` retourne `nil` pour des données invalides. `NativeUIRendering.color` accepte les valeurs calculées `rgb()`/`rgba()` ; les formats incompatibles utilisent `.label` ou la couleur `fallback:` fournie. Les deux sont partagés avec les moteurs standard. Ils n’évaluent ni sélecteurs, ni variables CSS, ni noms de couleurs, ni feuilles de style arbitraires.

## Cycle de vie et fin des actions

Le shell gère découverte, géométrie, synchronisation d’état, intégration des contrôleurs natifs, retrait pour superpositions, suspension et nettoyage. Les extensions n’implémentent pas de hooks d’attachement/détachement. Les sources Web sont masquées uniquement après acceptation native. Un moteur non enregistré, un décodage de props défaillant, un placement incompatible ou un lecteur en échec laisse l’instance Web. La politique existante des superpositions s’applique ; les extensions redeviennent Web lorsque des superpositions Web couvrent la page.

Le placement d’élément nécessite que la source tienne entièrement dans la fenêtre et les limites de découpage overflow de ses ancêtres, y compris les conteneurs de défilement shadow Ionic. Les sources partiellement découpées restent Web et redeviennent admissibles une fois entièrement visibles. Les accessoires d’onglets utilisent le placement de leur hôte système.

### Fin d’une action

| Événement | Résultat de `try await actions.activate(name)` |
| ------------------------------------------------------------------ | -------------------------------------------- |
| L’élément Web original reçoit le clic | Se termine. |
| Le gestionnaire lance une requête réseau, une navigation ou une modale | N’attend pas ce travail applicatif. |
| Action désactivée, supprimée ou périmée | Rejette. |
| Nettoyage, annulation de tâche native ou expiration du pont | Termine les appels en attente. |

L’accusé de réception du pont est une méthode Promise de Capacitor.

Le [lecteur de démonstration](https://github.com/webview-native-ui/ionic-theme-ios27/blob/ios27-v2.1.0/demo/src/native-ui/counter.ts) et la [View SwiftUI de démonstration](https://github.com/webview-native-ui/ionic-theme-ios27/blob/ios27-v2.1.0/demo/ios/App/App/NativeUICounter.swift) présentent les deux placements avec des fichiers locaux à l’application. Ouvrez la page Native UI de la démo pour comparer projection native et repli Web.

## Exemple : mini-lecteur

Le mini-lecteur de démonstration applique le même modèle aux métadonnées de piste et actions de lecture : un [lecteur DOM et repli Web](https://github.com/webview-native-ui/ionic-theme-ios27/blob/ios27-v2.1.0/demo/src/native-ui/mini-player.ts) associé à une [View SwiftUI locale](https://github.com/webview-native-ui/ionic-theme-ios27/blob/ios27-v2.1.0/demo/ios/App/App/NativeMiniPlayer.swift). L’application Web gère l’état de lecture et la modale ; les actions natives `open` et `toggle` activent ses boutons d’origine. C’est un exemple d’interface, pas un moteur audio. Adaptez ces fichiers après avoir suivi le [guide des extensions](native-ui-extensions.md).
