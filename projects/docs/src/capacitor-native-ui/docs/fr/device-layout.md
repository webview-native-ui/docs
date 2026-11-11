---
title: "Relier le démarrage de l’application et la disposition de l’appareil"
sourceRevision: "a489f0c38652b8c7cefd1187c31bfc534fd85f52208e2b2df090fb2daea665a9"
---

# Relier le démarrage de l’application et la disposition de l’appareil

Connectez le runtime et la disposition de l’appareil une seule fois pour l’application. Native UI projette les contrôles ; le thème applique la disposition Web ; l’application relie les rapports de l’appareil de Foldable à cette disposition. La même connexion prend en charge le préréglage standard et un thème Web existant.

## Module de disposition de l’appareil

Créez `src/device-layout.ts`. Ce module appartenant à l’application ne contient aucun état de composant ou de routeur. Abonnez-vous avant la lecture initiale, appliquez les valeurs du résolveur et retirez l’écouteur lorsque son propriétaire s’arrête :

```ts
import { Capacitor } from '@capacitor/core';
import { Foldable } from '@erkamyaman/capacitor-foldable';
import { resolveVerticalBarsLayout } from '@rdlabo/capacitor-native-ui/integration';

export async function connectDeviceLayout(
  applyLayout: (layout: Awaited<ReturnType<typeof resolveVerticalBarsLayout>>) => void,
): Promise<() => Promise<void>> {
  if (Capacitor.getPlatform() !== 'ios') return async () => {};
  let active = true;
  const refresh = async () => {
    const layout = await resolveVerticalBarsLayout(Foldable);
    if (active) applyLayout(layout);
  };
  const listener = await Foldable.addListener('layoutChange', () => {
    void refresh().catch((error: unknown) => console.error('Device layout refresh failed', error));
  });
  try {
    await refresh();
  } catch (error) {
    active = false;
    await listener.remove();
    throw error;
  }
  return async () => {
    active = false;
    await listener.remove();
  };
}
```

Le callback possède la disposition Web. Les utilisateurs d’un thème Ionic transmettent `setVerticalBarsLayout` ; les applications HTML transmettent leur propre fonction de mise à jour du CSS ou de la disposition et utilisent le point d’entrée `/core` de Native UI. Le module de l’appareil lui-même n’importe ni thème ni framework.

Ceci utilise Foldable 8.5 ou ultérieur dans la version majeure 8. Le résolveur retourne `edge`, `inset` et `toolbarTop` en pixels CSS du viewport. Un bord nul rétablit la disposition ordinaire ; les valeurs indisponibles laissent les valeurs par défaut du thème en place. La géométrie de l’appareil et la disponibilité du rendu natif sont deux entrées distinctes.

## Amorçage Angular

Utilisez un service racine pour posséder la connexion à l’appareil. Créez `src/app/vertical-bars-layout.service.ts` :

```ts
import { DestroyRef, Injectable, inject } from '@angular/core';
import { connectDeviceLayout } from '../device-layout';
import { setVerticalBarsLayout } from '@rdlabo/ionic-theme-ios27';

@Injectable({ providedIn: 'root' })
export class VerticalBarsLayoutService {
  readonly #destroyRef = inject(DestroyRef);

  async initialize(): Promise<void> {
    const disconnect = await connectDeviceLayout(setVerticalBarsLayout);
    if (this.#destroyRef.destroyed) {
      await disconnect();
      return;
    }
    this.#destroyRef.onDestroy(() => {
      void disconnect().catch((error: unknown) => console.error('Device layout cleanup failed', error));
    });
  }
}
```

Connectez le service et Native UI dans le fichier `src/main.ts` existant de l’application. `appConfig` fournit le préréglage Ionic et les routes ; `AppComponent` assemble la structure de l’application et la sortie du routeur :

```ts
import { bootstrapApplication } from '@angular/platform-browser';
import { enableNativeUI } from '@rdlabo/capacitor-native-ui';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';
import { VerticalBarsLayoutService } from './app/vertical-bars-layout.service';

void bootstrapApplication(AppComponent, appConfig)
  .then(async (app) => {
    const shell = await enableNativeUI();
    if (app.destroyed) {
      await shell.destroy();
      return;
    }
    app.onDestroy(() => {
      void shell.destroy().catch((error: unknown) => console.error('Native UI cleanup failed', error));
    });
    await app.injector.get(VerticalBarsLayoutService).initialize();
  })
  .catch((error: unknown) => console.error('Application startup failed', error));
```

L’application possède le handle du runtime et le détruit à l’arrêt. Le service racine retire l’abonnement à l’appareil. Les composants de page conservent leur état et leurs gestionnaires d’action existants.

## React, Vue et autres propriétaires de l’application

Utilisez le même module `connectDeviceLayout` depuis le démarrage de l’application, après le montage de sa structure. L’intégration est indépendante du framework :

```ts
import { enableNativeUI } from '@rdlabo/capacitor-native-ui';
import { connectDeviceLayout } from './device-layout';
import { setVerticalBarsLayout } from '@rdlabo/ionic-theme-ios27';

export async function startApplicationNativeUI(): Promise<() => Promise<void>> {
  const shell = await enableNativeUI();
  try {
    const disconnect = await connectDeviceLayout(setVerticalBarsLayout);
    return async () => {
      try {
        await disconnect();
      } finally {
        await shell.destroy();
      }
    };
  } catch (error) {
    await shell.destroy();
    throw error;
  }
}
```

Attendez cette fonction une seule fois depuis le démarrage de l’application montée, conservez la fonction de libération retournée et attendez son exécution avant de démonter cette application. Le Strict Mode de développement de React peut remonter les effets : conservez ce démarrage unique par application auprès du propriétaire de l’application, plutôt que dans chaque composant routé ou à répétition dans un effet remonté. De même, les applications Vue utilisent leur propriétaire d’application plutôt que les hooks des pages. Le rendu navigateur/serveur ne doit appeler cette fonction qu’une fois le document disponible.

## Vérifier le comportement de l’appareil

Sur un appareil compatible avec le rail, changez l’écran actif et vérifiez que l’espacement du contenu Web et l’origine de la barre d’outils évoluent ensemble. Sur les appareils sans rail, la disposition ordinaire reste active. Un aperçu dans le navigateur vérifie la disposition Web ; le rendu natif du rail nécessite l’appareil iOS et le système compatibles.
