---
title: "Extensions Native UI locales à l’application (expérimentales)"
sourceRevision: "8ed9efef934cec6179f6b54595742d650160dbcd0ffb482707d6b4b295f0b010"
---
# Extensions Native UI locales à l’application (expérimentales)

> **Expérimental :** l’API d’extension, les interfaces d’enregistrement natives et leur comportement peuvent changer dans les versions futures. Cela concerne SwiftUI et Kotlin/Compose, ainsi que les placements `element` et `tab-accessory`.

Une extension projette votre interface Web existante dans une View SwiftUI sur iOS ou du contenu Jetpack Compose sur Android. Conservez les deux définitions dans l’application : aucun package npm, bibliothèque séparée ou plugin Capacitor supplémentaire n’est nécessaire. L’élément Web reste la source de vérité et l’interface de repli.

Les extensions utilisent le même [modèle de projection](../README.md#how-projection-works) que les contrôles intégrés. Définissez les données et actions DOM à exposer, puis fournissez leur présentation native.

## Avant de commencer

Partez d’une application Capacitor 8 existante et installez le plugin si nécessaire :

```sh
npm install @rdlabo/capacitor-native-ui @erkamyaman/capacitor-foldable
```

Choisissez la plateforme native à prendre en charge :

- **Android :** utilisez votre projet Capacitor Android et un appareil ou émulateur API 24+. Suivez l’étape 1, l’[enregistrement Kotlin/Compose](#2b-register-compose-content-on-android), puis les étapes 3 et 4. Aucun projet iOS, Xcode, Ionic ou package de thème n’est requis.
- **iOS :** utilisez votre projet Capacitor iOS, Xcode 26+ et un appareil ou simulateur iOS 26+. Suivez l’étape 1, l’[enregistrement SwiftUI](#2a-register-a-swiftui-view-on-ios), puis les étapes 3 et 4. Pour projeter aussi les contrôles standard, suivez la [configuration Ionic](setup.md) ou [HTML](framework-independent.md).
- **Les deux :** partagez le lecteur DOM de l’étape 1 et enregistrez du contenu natif sous le même nom sur chaque plateforme.

Les exemples TypeScript ci-dessous utilisent le point d’entrée Ionic. Sans Ionic, importez `defineNativeUI` et `enableNativeUI` depuis `@rdlabo/capacitor-native-ui/core`.

## 1. Définir un lecteur DOM

```ts
// src/native-ui/counter.ts
import { defineNativeUI } from '@rdlabo/capacitor-native-ui';

export const counter = defineNativeUI({
  name: 'app.counter',
  selector: '[data-counter]',
  read(element) {
    return {
      props: { count: Number(element.getAttribute('data-count') ?? 0) },
      actions: { increment: element.querySelector<HTMLButtonElement>('button') },
    };
  },
});
```

Par exemple, utilisez cette source Web. Son espace réservé accueille aussi le contenu natif et une erreur d’action :

```html
<div data-counter data-count="0" style="width: 280px; min-height: 128px">
  <p data-count-label>Count: 0</p>
  <button type="button">Increment</button>
</div>
```

Conservez le gestionnaire de clic de votre framework pour mettre à jour le compteur et `data-count`. En HTML simple, ceci suffit :

```ts
const source = document.querySelector<HTMLElement>('[data-counter]')!;
source.querySelector('button')!.addEventListener('click', () => {
  const count = Number(source.dataset.count ?? 0) + 1;
  source.dataset.count = String(count);
  source.querySelector('[data-count-label]')!.textContent = `Count: ${count}`;
});
```

Le shell observe les changements DOM et envoie les nouvelles props au contenu natif. L’état rendu dans les attributs ou le texte est observé automatiquement. Pour les propriétés ou états externes lus sans mutation DOM, appelez `shell.markForCheck()` après modification.

## 2a. Enregistrer une View SwiftUI sur iOS

Pour les projets CocoaPods, effectuez d’abord la [configuration du Podfile pour Engine](https://docs.rdlabo.dev/projects/capacitor-native-ui/docs/setup#4-build-sync-and-run). SwiftPM résout Engine automatiquement.

Exécutez `npx cap sync ios` après installation du plugin, puis ajoutez un fichier Swift à la cible Xcode de l’application. Importez `NativeUIPlugin`, fourni par `@rdlabo/capacitor-native-ui`. Conservez votre intégration SPM ou CocoaPods.

```swift
import SwiftUI
import NativeUIPlugin

struct CounterProps: Decodable {
    let count: Int
}

struct CounterView: View {
    let props: CounterProps
    let actions: NativeUIActions
    @State private var error: String?

    var body: some View {
        HStack {
            Text("Count: \(props.count)")
            Button("Increment") {
                Task { @MainActor in
                    do {
                        try await actions.activate("increment")
                        error = nil
                    } catch {
                        self.error = "Action unavailable"
                    }
                }
            }
            .disabled(!actions.isAvailable("increment"))
            if let error { Text(error) }
        }
    }
}

@MainActor func registerAppNativeUI() throws {
    try NativeUI.register("app.counter") {
        (props: CounterProps, actions: NativeUIActions) in
        CounterView(props: props, actions: actions)
    }
}
```

Appelez `registerAppNativeUI()` une seule fois depuis `application(_:didFinishLaunchingWithOptions:)`, avant l’activation du shell par JavaScript. Gérez-y une erreur d’enregistrement ; les noms vides ou dupliqués sont rejetés. Le Swift est compilé dans l’application : ajouter ou modifier une View nécessite une recompilation iOS. L’enregistrement est une configuration synchrone, pas une commande du pont natif.

## 2b. Enregistrer du contenu Compose sur Android

Android prend en charge **uniquement les extensions d’élément**. Les contrôles Ionic et HTML standard restent Web, y compris les boutons explicites. Vertical Bars natif et `tab-accessory` sont propres à iOS ; Android peut combiner rail Web et extensions d’élément. Le même lecteur DOM, les props, les cibles d’action et `markForCheck()` fonctionnent sur les deux plateformes.

Exécutez `npx cap sync android` après installation. Utilisez Kotlin dans l’application Android. Dans le `build.gradle` racine, ajoutez les plugins de compilation Kotlin et Compose à `buildscript.dependencies`, avec la même version Kotlin que l’application (le plugin utilise `2.2.20` par défaut). Définissez `ext.kotlin_version = '2.2.20'` dans le `buildscript` racine si nécessaire :

```groovy
classpath "org.jetbrains.kotlin:kotlin-gradle-plugin:$kotlin_version"
classpath "org.jetbrains.kotlin:compose-compiler-gradle-plugin:$kotlin_version"
```

Dans `app/build.gradle`, appliquez `kotlin-android` et `org.jetbrains.kotlin.plugin.compose`, et activez `android { buildFeatures { compose true } }`. Native UI expose Compose UI et Foundation ; ajoutez vous-même Material si votre extension l’utilise.

Enregistrez une seule fois depuis `Application.onCreate()`, sur le thread principal, avant l’activation JavaScript du shell. Utilisez une sous-classe `Application` configurée par `android:name=".App"` sur `<application>` dans `AndroidManifest.xml` ; évitez l’enregistrement à chaque recréation d’Activity.

```kotlin
import android.app.Application
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.text.BasicText
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.semantics.*
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.unit.dp
import dev.rdlabo.capacitor.nativeui.NativeUI
import kotlinx.coroutines.CancellationException
import kotlinx.coroutines.launch

class App : Application() {
    override fun onCreate() {
        super.onCreate()
        NativeUI.register(
            name = "app.counter",
            decode = { json -> json.getInt("count") },
        ) { count, actions, context ->
            val scope = rememberCoroutineScope()
            var error by remember { mutableStateOf<String?>(null) }
            val enabled = actions.isAvailable("increment")
            val foreground = if (context.dark) Color.White else Color.Black
            val background = if (context.dark) Color(0xFF202020) else Color.White
            val textStyle = TextStyle(color = foreground)
            Column(Modifier.fillMaxSize().background(background).padding(8.dp)) {
                BasicText("Count: $count", style = textStyle)
                Box(
                    Modifier.fillMaxWidth().heightIn(min = 48.dp)
                        .alpha(if (enabled) 1f else 0.5f)
                        .clickable(enabled = enabled, role = Role.Button, onClickLabel = "Increment count") {
                            scope.launch {
                                try {
                                    actions.activate("increment")
                                    error = null
                                } catch (cancelled: CancellationException) {
                                    throw cancelled
                                } catch (unavailable: IllegalStateException) {
                                    error = "Action unavailable. Try again."
                                }
                            }
                        },
                    contentAlignment = Alignment.Center,
                ) { BasicText("Increment", style = textStyle) }
                BasicText(
                    error ?: "",
                    modifier = Modifier.semantics { liveRegion = LiveRegionMode.Polite },
                    style = textStyle,
                )
            }
        }
    }
}
```

Le shell dimensionne et positionne l’hôte Compose depuis le rectangle DOM source. `context.sourceFrame` contient des pixels CSS ; `sourceFrameInDp` contient des dp Compose, avec `dpPerCSSPixel` comme facteur de conversion. `sourceID` et `viewportWidth` décrivent la source et la fenêtre actuelles. `rtl` est aussi appliqué via `LocalLayoutDirection` ; utilisez `dark` pour choisir votre thème Compose. N’appliquez pas à nouveau `x` et `y` de la source dans le contenu.

Le callback `decode` s’exécute avant acceptation de la projection. S’il lève une exception, la source reste Web. Les noms vides ou dupliqués sont rejetés. Le contenu Compose gère son style et son accessibilité. Recompilez Android après toute modification Kotlin.

## 3. Activer avec des définitions locales

```ts
import { enableNativeUI } from '@rdlabo/capacitor-native-ui';
import { counter } from './native-ui/counter';

const shell = await enableNativeUI({ ionic: { auto: false }, extensions: [counter] });
```

Cet exemple active vos extensions sans projeter automatiquement les contrôles Ionic. Les sources explicites `data-native-ui` restent actives. Pour projeter aussi les contrôles Ionic standard sur iOS compatible, omettez `ionic: { auto: false }`. Les contrôles standard Android restent Web dans les deux cas.

Remplacez l’appel de démarrage existant par celui-ci ; ne démarrez pas un second shell. Raccordez-le à votre framework via les [exemples de cycle de vie de la racine](setup.md#place-startup-in-your-frameworks-app-root), en plaçant ces options dans l’appel partagé.

Conservez des objets d’extension stables entre les appels d’activation. Les modifier pendant l’exécution nécessite d’abord `await shell.destroy()`. Leurs noms doivent être uniques dans une activation. N’enregistrez pas de sélecteurs se chevauchant pour une source. Une extension possède son sous-arbre source ; les contrôles intégrés qu’il contient ne sont pas projetés séparément.

## 4. Compiler et essayer l’extension

Compilez les ressources Web, puis synchronisez et recompilez la plateforme configurée :

- **Android :** exécutez `npx cap sync android`, puis compilez et lancez depuis Android Studio. Le compteur doit s’afficher avec Compose.
- **iOS :** exécutez `npx cap sync ios`, puis compilez et lancez depuis Xcode. Sous iOS 26+, le compteur doit s’afficher avec SwiftUI.

Touchez Increment : le gestionnaire Web original doit mettre à jour `data-count` et le compteur natif doit suivre. Dans le navigateur, le compteur Web original doit encore fonctionner.

Pour connaître les raisons de repli d’une source, activez temporairement [`debug: true`](configuration.md#understand-why-a-source-stays-on-the-web). Si elle reste Web, vérifiez que l’enregistrement précède l’activation JavaScript et que noms et props concordent. Sur Android, vérifiez la déclaration de la sous-classe `Application` dans le manifeste ; sur iOS, l’appartenance du fichier Swift à la cible.

## Référence des extensions Native UI

- <a id="contrat-du-lecteur"></a><a id="reader-contract"></a>[Contrat du lecteur](native-ui-extension-reference.md#reader-contract)
- <a id="native-scroll-tracking-on-ios-(experimental)"></a><a id="suivi-natif-du-d%C3%A9filement-sur-ios-(exp%C3%A9rimental)"></a><a id="native-scroll-tracking-on-ios-experimental"></a>[Suivi natif du défilement sur iOS (expérimental)](native-ui-extension-reference.md#native-scroll-tracking-on-ios-experimental)
- <a id="le-contenu-et-le-placement-sont-ind%C3%A9pendants"></a><a id="content-and-placement-are-independent"></a>[Le contenu et le placement sont indépendants](native-ui-extension-reference.md#content-and-placement-are-independent)
- <a id="pr%C3%A9requis-des-accessoires-d%E2%80%99onglets"></a><a id="tab-accessory-requirements"></a>[Prérequis des accessoires d’onglets](native-ui-extension-reference.md#tab-accessory-requirements)
- <a id="lire-la-g%C3%A9om%C3%A9trie-source-et-l%E2%80%99%C3%A9tat-de-pr%C3%A9sentation"></a><a id="read-source-geometry-and-presentation-state"></a>[Lire la géométrie source et l’état de présentation](native-ui-extension-reference.md#read-source-geometry-and-presentation-state)
- <a id="utiliser-les-capacit%C3%A9s-de-projection-partag%C3%A9es"></a><a id="use-the-shared-projection-capabilities"></a>[Utiliser les capacités de projection partagées](native-ui-extension-reference.md#use-the-shared-projection-capabilities)
- <a id="planifier-une-v%C3%A9rification-de-source"></a><a id="schedule-a-source-check"></a>[Planifier une vérification de source](native-ui-extension-reference.md#schedule-a-source-check)
- <a id="r%C3%A9utiliser-les-conversions-natives-d%E2%80%99images-et-de-couleurs"></a><a id="reuse-native-artwork-and-color-conversion"></a>[Réutiliser les conversions natives d’images et de couleurs](native-ui-extension-reference.md#reuse-native-artwork-and-color-conversion)
- <a id="cycle-de-vie-et-fin-des-actions"></a><a id="lifecycle-and-action-completion"></a>[Cycle de vie et fin des actions](native-ui-extension-reference.md#lifecycle-and-action-completion)
- <a id="fin-d%E2%80%99une-action"></a><a id="action-completion"></a>[Fin d’une action](native-ui-extension-reference.md#action-completion)
- <a id="example%3A-mini-player"></a><a id="exemple-%3A-mini-lecteur"></a><a id="example-mini-player"></a>[Exemple : mini-lecteur](native-ui-extension-reference.md#example-mini-player)
