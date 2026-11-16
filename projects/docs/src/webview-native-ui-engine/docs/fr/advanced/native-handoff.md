---
title: "Transfert natif"
sourceRevision: "7d0e0f7de1f9aa0d9948181bc17192947c2a98c334baa6abe09fce271e56729a"
---

# Transfert natif pour les moteurs de rendu personnalisés

Un moteur de rendu existant doit transmettre ses messages ordonnés `WebProjectionRequest` à la méthode `handle` du gestionnaire natif d’instantanés. La validation des demandes, la conversion des coordonnées CSS vers le natif, le transfert d’images mises en cache et le retrait des copies restent ainsi dans l’Engine. Le pont reste la propre méthode Capacitor ou Cordova du plugin ; l’Engine ne dépend de l’objet d’appel d’aucun de ces frameworks.

Par exemple, un moteur de rendu envoie déjà les boutons d’une barre d’outils dans une mise à jour native unique et sait quelles vues appartiennent à chaque groupe de boutons. Transmettez les messages de transfert d’image à `handle` plutôt que de réimplémenter la conversion des coordonnées et le retrait des copies pour chaque groupe. Conservez l’admissibilité de la capture du groupe et sa mise en page ordinaire dans ce moteur de rendu : l’Engine ne peut pas déduire quelles vues sœurs peuvent être masquées ensemble sans risque.

Appelez les API de cycle de vie des vues et des instantanés sur le thread principal/UI. Fournissez deux callbacks du moteur de rendu : `frames(ids, revision)` renvoie les limites actuelles admissibles et `views(ids)` renvoie l’ensemble complet des vues natives pouvant être masquées ensemble sans risque. Renvoyez des limites vides ou `nil` / `null` lorsque l’opération n’est pas disponible. Les limites utilisent des **points relatifs à la WebView sur iOS** et des **pixels physiques relatifs à la WebView sur Android**. L’Engine vérifie que les ID mesurés correspondent exactement à la demande.

```swift
snapshots.handle(request, in: webView,
    frames: { ids, revision in renderer.measure(ids, at: revision) },
    views: { ids in renderer.viewsAllowedToHide(ids) },
    complete: reply)
```

```kotlin
snapshots.handle(request, activity.window, webView,
    frames = { ids, revision -> renderer.measure(ids, revision) },
    views = { ids -> renderer.viewsAllowedToHide(ids) },
    complete = { result ->
        result.fold(onSuccess = reply, onFailure = reject)
    })
```

`renderer` et `reply` ci-dessus représentent le code de mise en page existant du plugin et le callback de fin du pont. Sur Android, transmettez un `Result` en échec au callback de rejet du pont (`reject` ci-dessus) ; le Web utilise cet échec pour abandonner l’image et réconcilier la présentation. Ne confirmez pas comme réussie une étape de dessin échouée. `frames` peut s’exécuter plusieurs fois pendant la stabilisation de la géométrie ; il doit revérifier la révision demandée et l’admissibilité de la capture. Il ne doit pas modifier la mise en page. Si plusieurs contrôles partagent un conteneur natif, `views` doit rejeter un ensemble partiel qui masquerait des contrôles non capturés. L’Engine ne peut pas déduire cette relation.  Enregistrez l’observateur Window du gestionnaire de snapshots et transmettez ses événements complets ; voir [capture avant interaction](preinteraction-capture.md#window-integration). N’ajoutez pas de notifications tactiles redondantes au niveau du clip.

`cover` installe les pixels préparés avant de masquer ces vues. Les parties de destination sont validées par rapport au jeton mis en cache et utilisées à la fois pour la couverture et la restauration ; déplacer une surface préparée ne réutilise donc pas une ancienne position. Les transferts invalides ou indisponibles renvoient `shown: false`. `painted` et `restored` retirent uniquement la copie correspondante ; Android attend que le dessin Web soit prêt. `release` et `reset` retirent les ressources possédées. Aucune capture ne démarre dans le chemin de couverture ou de restauration.

Le moteur de rendu effectue toujours sa mise à jour native ordinaire entre `restore` et la confirmation d’acceptation de la mise à jour. Avant cette mise à jour, appelez `restoreControls()` sur iOS ou `restoreViews()` sur Android pour annuler uniquement les changements de masquage de l’Engine. Il ne s’agit pas d’une commande pour mettre en page ou révéler arbitrairement du contenu du plugin. Conservez la politique normale de visibilité et de placement dans le moteur de rendu.

### Primitives directes d’instantané

Utilisez-les uniquement lorsque votre intégration gère le placement natif pendant le transfert. `NativeUIProjection` utilise les mêmes opérations avec des politiques de placement et de vues opaques propres à l’enregistrement. Ne dupliquez pas la conversion ou le retrait des copies lorsque vous transmettez des demandes à `handle`.

- Convertissez les `parts` de destination depuis les pixels CSS avec `webView.bounds.width / viewportWidth` sur iOS ou `webView.width / viewportWidth` sur Android. Passez les cadres à `cover` et `restore` ; en l’absence de parties de couverture, le placement capturé est conservé. Aucune de ces opérations ne capture de nouveaux pixels.
- `transient: true` sépare une surface mobile de premier plan du `coveringToken` de l’arrière-plan. Réutilisez les pixels tant que les tailles des sources et leurs positions relatives à leur scope restent inchangées ; un mouvement à l’intérieur d’un scope fixe invalide la mise en page.
- Retirez la copie d’entrée une fois le dessin Web prêt : `retireCopy(token)` sur iOS, `retireCopyAfterWebDraw` sur Android.
- Pour le retour, appelez `restore`, annulez le masquage de l’Engine avec `restoreControls()` / `restoreViews()`, puis appliquez la mise en page native normale. Retirez la copie de retour après l’acceptation de la mise à jour native et la disponibilité du dessin Web, en utilisant `retireCopy` avec `entry: false` / `entry = false`. Android peut transmettre `painted` et `restored` à `handle` pour réutiliser la gestion de disponibilité et de rejet.
- Libérez les jetons avec `release(token)`. Utilisez `reset()` uniquement pour le démontage du propriétaire, et `close()` sur Android pour libérer l’encodeur. Ne réinitialisez jamais les captures d’une autre surface.

L’absence de capture ou de placement utilise le repli ordinaire du moteur de rendu. Consultez le [contrat des demandes Web](web-projection.md#multiple-fallbacks-in-one-native-transaction) pour les charges utiles.

Pour l’acquisition avant l’entrée native, l’arrêt avant mesure, l’invalidation et les événements de timing, consultez la [capture avant interaction](preinteraction-capture.md). Les limites de capture, notamment les matériaux dépendant de l’arrière-plan, figurent dans les [limites des plateformes](../reference/platforms.md).

## Suivi du défilement natif

Un contrôle natif dans une liste Web défilante nécessiterait autrement de nouveaux messages de placement à mesure que la liste bouge. Utilisez ces liaisons uniquement lorsque le moteur de rendu gère déjà la réconciliation du défilement : une vue de défilement overflow iOS identifiée sans ambiguïté peut entraîner le contenu natif avec elle. Un défilement imbriqué ou ambigu doit utiliser le repli ordinaire plutôt que rattacher le contenu au mauvais propriétaire de défilement.

`readScrollPlacement(element, owner, identify)` mesure un propriétaire overflow non transformé. `createScrollBindings()` valide la réutilisation et détecte les mouvements pendant que l’acquisition attend son ACK. N’incluez pas `reuse` dans les signatures de déduplication de mise en page ; il décrit l’état de confirmation, pas la mise en page.

Sur iOS, `NativeUIScrollBindings.replace` regroupe les sources par propriétaire et se lie uniquement à une `UIScrollView` correspondante non ambiguë. `update()` applique les positions et le découpage sans reconstruire le contenu. `NativeUIClippedView` conserve les dimensions complètes du contenu tout en limitant les pixels visibles et les tests de pointage.

Une liaison établie rejetée par le natif perd la propriété et peut être acquise à nouveau via le **même** chemin de mise à jour/ACK. Une nouvelle acquisition échouée reste sur le repli jusqu’à un événement pertinent de mise en page ou de fin de défilement. N’ajoutez jamais de boucle de réessai immédiate et ne rejouez pas d’actions utilisateur. Un changement de cadre ou de propriétés ne recalibre pas une origine de coordonnées établie.

Cette intégration utilise la hiérarchie interne d’overflow de WKWebView sans noms de classes privées. Elle ne peut pas lier des vues absentes ou ambiguës, le défilement imbriqué ou du document, des transformations non prises en charge, un clipping de forme ou un propriétaire mobile non confirmé. La présence d’un `UIScrollView` ne suffit pas à déclarer la prise en charge. Pour les gestes commençant dans les vues SDK, optez pour l’[hébergement du défilement natif](native-scroll-hosting.md) plutôt que d’ajouter un autre transfert de gestes. L’accessibilité du SDK reste propre au moteur de rendu.

### Capture du moteur de rendu seul sur iOS

Une requête `prepare` peut spécifier `captureMode: 'view'` pour dessiner uniquement les vues de rendu renvoyées par le sélecteur de vues, en préservant les pixels transparents à l’extérieur de leur matériau. Par défaut, la capture reste celle de la fenêtre composée. La capture du moteur de rendu seul peut modifier ou omettre le flou et la réfraction dépendant de l’arrière-plan ; elle ne garantit pas la transparence à l’intérieur d’une surface de verre. Les vues de rendu absentes, masquées ou détachées entraînent le rejet de la préparation. Android et les anciens binaires natifs conservent leur chemin de capture existant.

Les surfaces DOM mobiles peuvent fournir une couche de transfert fixe dans le viewport via `WebProjectionOptions.imageSurface` (`HTMLElement`). La projection Web marque ses requêtes de préparation avec `imageSurface: 'web'` afin que le masquage Native préserve la mise en page du moteur de rendu. Cela change le placement, pas le protocole de transfert : chaque surface utilise les mêmes copies Native temporaires d’entrée et de retour. Pendant le mouvement, les images DOM décodées résident sur leur surface source afin que sa transformation les transporte. Une translation n’invalide pas leur capture réutilisable ; les dimensions sont comparées à la résolution des pixels d’affichage, tandis que les changements réels de taille et de source continuent de l’invalider. Sur iOS, chaque partie d’image comprend des `anchorBounds` facultatives, relatives à la découpe de l’image et exprimées en unités du viewport. Les moteurs de rendu peuvent fournir des `anchorFrames` pour les contrôles composites, par exemple le premier véritable élément de barre d’outils d’un groupe. Les cibles mobiles utilisent ces limites pour conserver les marges de capture sans mélanger les coordonnées Native au moment de la capture avec le placement DOM ultérieur.

Conservez le moteur de rendu et la propriété de la source pendant la projection. Le protocole commun d’entrée et de retour ci-dessus reste applicable ; `imageSurface` modifie le placement, pas la durée de vie de l’image. `layoutFrame(target, part, parts)` fournit le placement actuel des ancres du groupe capturé et ne gère pas la visibilité. Appelez `updated(token, ids, revision)` uniquement pour une mise à jour native acceptée ; une révision plus récente que la requête de retour retire l’image affichée. L’éligibilité à la réutilisation du cache et le bail de l’image affichée restent distincts.

Sur iOS, utilisez `NativeUICoveredSnapshots.concealPixels(in:)` sur le thread principal lorsque la mise en page doit rester mesurable. Cette fonction masque les pixels et désactive les interactions et l’accessibilité sans modifier `isHidden` ni la géométrie. La closure de restauration qu’elle renvoie est idempotente ; en cas de baux superposés, le masque et les indicateurs d’origine ne sont restaurés qu’à la fin du dernier bail. La capture composée et celle du moteur de rendu seul utilisent la même copie Native et le même contrat de fin de dessin.

## Encodage et réutilisation des images

L’encodage PNG est fourni avec les packages natifs ; les consommateurs n’ont besoin ni de Rust ni du NDK. iOS conserve Display P3 16 bits et les métadonnées ICC. Android utilise l’encodeur Rust pour les images sRGB opaques et l’encodeur de la plateforme pour les entrées non prises en charge. En cas d’échec, le repli de la plateforme est conservé.

Les captures explicites de vues du moteur de rendu peuvent réutiliser des images immuables lorsque la révision du contenu et l’état des vues éligibles sont inchangés. Incrémentez la révision à chaque changement visuel, y compris les animations et les arrière-plans affectant les matériaux. N’activez pas la réutilisation d’un contenu dépendant de l’arrière-plan sans suivre ces changements. Les captures composites iOS par défaut n’activent pas ce cache de vues.

Les réponses natives signalent les pixels réutilisables avec `reused: true`. Ce n’est qu’alors que le Web peut réutiliser l’image décodée pour les mêmes URL et destination ; les autres réponses conservent le chargement et le décodage existants. Chaque token possède son propre bail sur les fichiers partagés. Continuez à libérer les tokens retirés et à réinitialiser le gestionnaire lors de la destruction du propriétaire.
