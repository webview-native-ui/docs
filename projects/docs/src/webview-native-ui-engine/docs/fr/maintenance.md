---
title: "Développement et publications"
sourceRevision: "0f1122357e2783205b137a54a18c5240b8ce3a79609fd694d77b917119561407"
---

# Développement et publications

Utilisez ce guide pour modifier ou publier l’Engine lui-même. Un consommateur natif peut compiler sans Node.js ; les modifications de source doivent donc régénérer le runtime embarqué. Une version peut arriver sur npm avant que les artefacts Maven soient téléchargeables : l’acceptation de la publication et la disponibilité du téléchargement pour les consommateurs sont donc vérifiées séparément ci-dessous.

## Développement

Les points d’entrée publics sont `src/index.ts` et `src/ionic.ts`, avec les contrats communs dans `src/types.ts`. L’implémentation est regroupée par responsabilité :

- `src/native/` : transport du pont, sessions natives, démarrage et URL de ressources.
- `src/projection/` : transfert d’images, propriété des projections, événements et styles.
- `src/dom/` : géométrie, défilement, visibilité et coordination des superpositions.

`npm run build` regroupe `src/native/bootstrap.ts` dans `runtime/native-ui-engine.js`, le runtime WebView partagé. Android embarque directement ce fichier comme asset. La compilation le copie aussi dans `ios/Sources/WebViewNativeUIEngine/Resources`, car SwiftPM exige que les ressources se trouvent dans le répertoire de la cible. Les deux fichiers générés sont ignorés pendant le développement et inclus dans les tags de version pour que les consommateurs SwiftPM n’aient pas besoin de Node.js. Exécutez `npm run build` avant de compiler un checkout des sources avec Xcode. Modifiez le source TypeScript, pas l’un de ces fichiers générés ; la CI vérifie la régénération et contrôle le runtime inclus dans les archives npm et Maven.

Les tests suivent la responsabilité qu’ils protègent :

- Les tests navigateur dans `tests/native`, `tests/projection` et `tests/dom` protègent les contrats de bridge, géométrie et cycle de vie des images. `tests/cordova/` teste un consommateur réel.
- Les tests de `tests/controls` couvrent la découverte Ionic, la sélection source/proxy, l’isolation des pages/modales et le transfert des événements de l’adaptateur. Conservez les tests génériques de timing ou d’état des images dans leur couche, sans les répéter via Controls.
- Les tests Swift et Android couvrent l’acquisition native, l’entrée SDK originale, le clipping et le démontage. Les mocks navigateur ne prouvent ni le dessin natif ni la livraison des taps et appuis longs.

Une régression doit échouer sur une violation visible du contrat. Privilégiez les sorties, la propriété des ressources et la livraison des entrées plutôt que l’état privé, des nombres exacts de callbacks ou le retour d’une méthode void. Les comptes sont pertinents si le contrat promet un seul enregistrement ou une seule livraison. Utilisez des options de fixture nommées ; étendez un cas existant s’il protège la même frontière sans nouveau setup. Testez les longues limites de minuteurs navigateur avec une horloge contrôlée ; gardez la reconnaissance SDK réelle dans les tests natifs.

Utilisez Node.js 24, comme la CI. Depuis ce dépôt :

```sh
npm ci
npm run build
npm run lint
npx playwright install chromium
npm test
```

Le lint combine la vérification TypeScript stricte, les règles recommandées standard ESLint/TypeScript et les vérifications typées des Promise pour `src`. Les scripts et tests reçoivent un lint syntaxique ; Prettier gère le formatage. `npm run format` applique uniquement le formatage. Les charges utiles du pont et les doublures de test peuvent utiliser un `any` explicite ; la validation des frontières en production reste nécessaire. Un `void` explicite marque le travail en arrière-plan, mais ne gère pas une Promise rejetée.

Les vérifications natives s’exécutent dans les jobs CI de leur plateforme : `npm run lint:swift` utilise node-swiftlint avec la configuration Capacitor sur macOS (`brew install swiftlint`) ; `npm run lint:android` exécute les vérifications de formatage Kotlin et Android Lint en traitant les avertissements comme des erreurs (JDK 21 et Android SDK 36). Utilisez `npm run format:swift` et `npm run format:kotlin` pour appliquer le formatage natif. Kotlin utilise ktfmt car le plugin Kotlin de Prettier ne peut pas analyser la fixture de test native existante.

La CI Swift répartit les tâches indépendantes entre `swift-package`, `ios-integration` et `ios-consumers` ; le contrôle `swift` exige les trois réussites. Les tests Package couvrent les vues natives déterministes, la propriété des captures et l’encodage. La navigation et le suivi du défilement WKWebView réels, les présentations UIKit actives et le pipeline d’images écran s’exécutent dans `NativeUIHostedTests` avec UIApplication. Les consommateurs CocoaPod et Cordova sont testés par une matrice parallèle dans `ios-consumers` ; `swift` exige les deux. Chaque sélection native exécute ses suites, y compris les cas réservés à l’application. Le démarrage du simulateur suit la configuration Node.js et la génération du runtime pour éviter la concurrence avec les dépendances ; chaque job teste en série sur son appareil. La disponibilité du simulateur est limitée à deux minutes pour Package et Hosted, l’exécution à cinq minutes par suite et chaque job macOS à douze minutes. Les échecs conservent les bundles `.xcresult`. Selon la [documentation Apple](https://developer.apple.com/forums/thread/698054), `-collect-test-diagnostics never` évite la lente collecte système après échec ; les assertions, erreurs et états de fixture restent dans le résultat. Aucun retry automatique ne masque un échec.

Les exclusions Package exactes sont dans `.github/workflows/native-ui-engine.yml` ; la sélection Hosted est dans `ios/Tests/project.yml` avec la [sélection de tests XcodeGen](https://github.com/yonaskolb/XcodeGen/blob/master/Docs/ProjectSpec.md#test-target). Lors d’un déplacement de test entre environnements, vérifiez que les ensembles exécutés restent disjoints et que leur union conserve la suite complète. Pour exécuter la sélection Hosted localement :

```sh
xcodegen generate --spec ios/Tests/project.yml
xcodebuild -project ios/Tests/NativeUIControlsHostedTests.xcodeproj -scheme NativeUIHostedTests -destination 'platform=iOS Simulator,id=<booted simulator UUID>' -parallel-testing-enabled NO test
```

Ces vérifications incluent les tests natifs et les fixtures Cordova. La documentation de l’API Swift utilise `///` ; les notes d’implémentation utilisent `//`. Les heuristiques de taille et de complexité Swift n’imposent pas de découpage des machines à états ni de changements d’API publique ; les déballages et conversions forcés réservés aux fixtures sont autorisés, tandis que la production conserve les vérifications. Swift est également compilé et testé sur un simulateur iOS.

L’Engine est versionné indépendamment de ses consommateurs. L’ordre de publication est : acceptation de la publication Maven → Engine npm ; les consommateurs se mettent à jour séparément. Les versions npm exigent la réussite du workflow de publication Maven pour le commit tagué exact. La distribution Maven Central peut encore être en attente : les consommateurs Android doivent attendre que les POM et AAR correspondants soient téléchargeables, tandis que les consommateurs iOS et Web peuvent se mettre à jour immédiatement. Les commandes de compilation et de test ne publient rien. Les tests couvrent le DOM standard, la géométrie fractionnaire/RTL, les ACK périmés, la propriété des images et le suivi du défilement WKWebView natif ; les tests consommateurs restent responsables de l’intégration Ionic/SDK.

La configuration réservée à la CI, les commandes de packaging et les sorties GitHub sont définies dans `.github/workflows/`. Les scripts conservent la compilation du runtime, les vérifications réutilisables des consommateurs et paquets, ainsi que la logique de publication testée (gestion des états Central et comparaison des artefacts npm).

## Publication Maven

Le workflow `Native UI Engine Maven Release` est déclenché manuellement sur le tag de version avec la version exacte du paquet Engine. Le commit tagué doit d’abord réussir la CI `Native UI Engine`. Il signe un AAR, une archive des sources, la documentation d’API Kotlin générée et les métadonnées Maven, téléverse une seule fois et se termine lorsque Central signale `PUBLISHING` ou `PUBLISHED`. L’ID de déploiement et les changements d’état sont consignés dans le résumé d’exécution. `PUBLISHING` signifie que la validation a réussi et que Central a accepté la publication ; cela ne garantit pas que les artefacts soient déjà téléchargeables. Ce workflow n’attend pas la distribution. La publication npm vérifie la réussite de ce workflow pour le commit de version exact ; elle n’attend pas la distribution Maven Central. Les coordonnées existantes ne sont jamais écrasées ; si un téléversement expire, inspectez le déploiement enregistré dans Central avant toute autre action.

Configurez les secrets Actions du dépôt avec `CENTRAL_USERNAME`, `CENTRAL_PASSWORD` (un jeton utilisateur Central), `MAVEN_SIGNING_KEY` (clé privée au format ASCII-armored) et `MAVEN_SIGNING_PASSWORD`. La clé publique de signature doit être disponible pour Central. Les secrets GitHub sont limités à ce dépôt.

Pour vérifier le packaging localement, exécutez `python3 scripts/native-ui-engine-release/verify.py` avec JDK 21, Android SDK 36 et GnuPG. Le script crée une clé jetable, valide signatures et sommes de contrôle, puis supprime son ZIP de test sans le téléverser. La publication reconstruit toujours des sorties propres avec la vraie clé de signature. Publiez l’artefact Maven avant la version npm correspondante, y compris pour les préversions.

## Configuration de publication pour les mainteneurs

Publiez la même version pour npm, SwiftPM et Maven ; les consommateurs épinglent des versions correspondantes sur ces distributions.

L’organisation npm `webview-native-ui` et l’espace de noms Maven Central `io.github.webview-native-ui` sont enregistrés. Maintenez la publication de confiance npm pour `webview-native-ui/engine`, workflow `release.yml`, et configurez les secrets Maven ci-dessus dans ce dépôt. Déplacer les fichiers source ne copie pas les identifiants.

1. Exécutez **Prepare release** (`prepare-release.yml`) sur `main` et sélectionnez `major`, `minor`, `patch` ou `revision`. Aucune compilation, aucun commit ni aucun tag local n’est nécessaire.
2. Le workflow incrémente la version avec npm, compile et vérifie le paquet, puis pousse un commit ne modifiant que la version sur main et, séparément, un commit de publication avec son tag contenant les ressources générées. Il démarre explicitement la validation `Native UI Engine` sur ce tag et crée un brouillon GitHub Release avec des notes de version générées.
3. Relisez et modifiez les notes de version. Après la réussite de la validation du tag, déclenchez `native-ui-engine-release.yml` sur ce tag avec la version exacte du paquet.
4. Une fois la publication Maven réussie, publiez le brouillon GitHub Release. L’état Central `PUBLISHING` signifie que le téléversement est accepté, pas que le téléchargement est disponible ; mentionnez toute distribution Android encore en attente dans les notes. `release.yml` vérifie le tag, la version du paquet, la CI du tag et l’acceptation Maven avant de publier sur npm (`next` pour les révisions, `latest` pour les versions stables).

Les incréments de version suivent les règles SemVer de npm ; `revision` correspond à `prerelease` :

| Version actuelle | Sélection | Version suivante |
| --- | --- | --- |
| `1.2.3` | major | `2.0.0` |
| `1.2.3` | minor | `1.3.0` |
| `1.2.3` | patch | `1.2.4` |
| `1.2.3` | revision | `1.2.4-0` |
| `1.2.4-0` | revision | `1.2.4-1` |
| `1.2.4-2` | patch | `1.2.4` |
| `1.3.0-2` | minor | `1.3.0` |
| `2.0.0-2` | major | `2.0.0` |

Les commits du runtime généré n’entrent jamais dans l’historique de main. La préparation en CI pousse main et le tag de version de façon atomique, sans forcer. La publication accepte uniquement un commit tagué enfant de main qui ajoute les deux ressources générées sans modifier aucun autre fichier. npm reconstruit et vérifie le runtime avant la publication ; Maven embarque le runtime provenant du même tag testé.

Si la préparation échoue avant le push, relancez-la. Si main et le tag ont déjà été poussés, ne relancez pas la préparation (cela demande une autre version) et ne déplacez pas le tag. Exécutez manuellement `Native UI Engine` sur le tag existant si la validation n’a pas démarré, et créez le brouillon de publication pour ce tag s’il manque. Cela permet aussi de récupérer après un échec survenu entre le push, le déclenchement de la validation et la création du brouillon. Les tags existants et les artefacts publiés ne sont jamais écrasés.

Aucune commande de compilation ou de test ne publie de paquet. Les versions npm/Maven existantes ne sont jamais écrasées.

Pour relancer la vérification d’une version correspondant à un tag existant, sélectionnez ce tag à la fois comme référence du workflow et comme paramètre `tag` : `gh workflow run release.yml --ref vX.Y.Z -f tag=vX.Y.Z`. Cela utilise le workflow enregistré dans cette version, y compris pour les anciens tags antérieurs à la structure de commits réservés aux publications. Il vérifie le commit tagué d’origine et omet la publication npm uniquement lorsque le contenu du paquet existant correspond. Ne modifiez pas le tag. Les outils de publication utilisent le npm fourni avec Node.js 24, comme la CI.

[Vue d’ensemble de la documentation](README.md)

## Artefacts PNG natifs

Les artefacts natifs versionnés permettent aux consommateurs de compiler sans Rust ni NDK. Toute modification du codec Rust, de l’en-tête C ou de la couche JNI doit régénérer tous les binaires dans le même changement.

Utilisez Rust 1.99.1 (version fixée par la CI), Xcode sur macOS et Android NDK 29. Installez les cibles Rust `aarch64-apple-ios`, `aarch64-apple-ios-sim`, `x86_64-apple-ios`, `aarch64-linux-android`, `armv7-linux-androideabi`, `i686-linux-android` et `x86_64-linux-android`, puis exécutez :

```sh
cargo test --locked --manifest-path native/png/Cargo.toml
cargo clippy --locked --manifest-path native/png/Cargo.toml --all-targets -- -D warnings
python3 scripts/build-native-png.py --ndk "$ANDROID_NDK_HOME"
python3 scripts/verify-native-png.py
npm run build
npm run test:package
```

Commitez ensemble `native/png`, `native/include`, `native/android`, `native/artifacts`, `native/licenses` et les ressources de licences iOS partagées. Le XCFramework contient les appareils arm64 et les simulateurs arm64/x86_64. L’artefact Android inclut arm64-v8a, armeabi-v7a, x86 et x86_64, avec alignement ELF de 16 Kio et règles consommateur conservant les noms JNI. Les notices des dépendances Rust et de la bibliothèque standard sont maintenues uniquement dans `ios/Sources/WebViewNativeUIEngine/Resources/NativeUIPngLicenses`, directement fourni par SwiftPM et CocoaPods. Android copie ce même dossier dans ses ressources générées et son archive source. `native/licenses` contient uniquement les notices du NDK Android ; ne dupliquez pas les notices partagées. Le manifeste de hachage source/binaire rejette les combinaisons périmées avant packaging. `--platform ios` ou `android` facilite l’itération locale ; une publication exige le build complet et la vérification `all-build.json`.

Si d’autres appareils sont connectés, les tests Android connectés doivent sélectionner explicitement l’émulateur voulu :

```sh
ANDROID_SERIAL=emulator-5554 android/gradlew -p android :connectedDebugAndroidTest
```

Le test d’intégration de réutilisation d’images vérifie le déplacement, l’invalidation du contenu, le transfert et le nettoyage des fichiers sur le simulateur iOS indiqué :

```sh
python3 scripts/verify-image-reuse.py --device <booted-simulator-UUID>
```
