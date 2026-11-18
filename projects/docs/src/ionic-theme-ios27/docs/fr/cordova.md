---
title: "Configuration Cordova"
sourceRevision: '33b1ccf63a4787bafc8696db5739b64d3e3b2714feabed2703411508407a0bac'
---

Installez le thème dans le projet Web après avoir suivi [la configuration Cordova](/cordova-native-ui/docs/readme).

```sh
npm install @rdlabo/ionic-theme-ios27
```

## Thème iOS facultatif

Conservez les styles de base Ionic et choisissez le préréglage correspondant au mode sombre actuel. Pour suivre le système :

```css
@import '@rdlabo/ionic-theme-ios27/styles/system.css';
```

Si vous utilisez les helpers JavaScript, importez-les depuis le thème. Dans le bundler Web, associez le nom de module exact

`@rdlabo/capacitor-native-ui/integration` → `@webview-native-ui/cordova-plugin/integration`

```ts
// vite.config.ts
import { defineConfig } from 'vite';

export default defineConfig({
  resolve: {
    alias: [{
      find: /^@rdlabo\/capacitor-native-ui\/integration$/,
      replacement: '@webview-native-ui/cordova-plugin/integration',
    }],
  },
});
```

## Démarrer Native UI quand Cordova et l’application sont prêts

Conservez `<script src="cordova.js"></script>` dans le HTML d’entrée Cordova. Enregistrez l’écouteur de disponibilité de l’appareil au démarrage et attendez que le framework monte `ion-app` avant d’activer Native UI :

```ts
import { enableNativeUI } from '@webview-native-ui/cordova-plugin';

const deviceReady = new Promise<void>((resolve) => {
  document.addEventListener('deviceready', () => resolve(), { once: true });
});

export async function startNativeUI(appMounted: Promise<void>) {
  await Promise.all([deviceReady, appMounted]);
  return enableNativeUI();
}
```

Fournissez `appMounted` depuis le cycle de montage de l’application, appelez `startNativeUI()` une seule fois et conservez le handle renvoyé. Appelez `await handle.destroy()` lorsque l’application cesse définitivement d’utiliser Native UI. Ne créez pas un runtime par page et n’appelez pas également `window.NativeUI.enableNativeUI()` avec ce démarrage basé sur npm. Les aperçus navigateur n’émettent pas `deviceready` de Cordova ; réservez ce chemin au build Cordova et prévisualisez le thème Web avec l’entrée navigateur habituelle.

Compilez les ressources Web dans le répertoire `www` de l’application Cordova, puis préparez et reconstruisez l’application native, par exemple :

```sh
cordova prepare ios
cordova build ios
```

Utilisez `android` pour un build Android après avoir satisfait ses prérequis. N’utilisez pas `npx cap sync` avec Cordova. Sur iOS, l’adaptateur désactive les retraits automatiques de la vue défilante ; appliquez les espacements de zone sûre dans le CSS de page comme indiqué dans le [guide du plugin](https://github.com/webview-native-ui/cordova-plugin#start-native-ui).

## Migrer une application existante vers cette intégration

À partir de 0.1.6, remplacez les imports du thème fourni avec les versions précédentes. Épinglez le thème à la version 2.2.0 pour conserver l’apparence de 0.1.5.

- `@webview-native-ui/cordova-plugin/theme` → `@rdlabo/ionic-theme-ios27`
- `@webview-native-ui/cordova-plugin/theme/css/*` → `@rdlabo/ionic-theme-ios27/dist/css/*`
