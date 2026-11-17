---
title: 'An das Gerät anpassen'
sourceRevision: '4dddeb29f25d7325ac010931f49b4755159d61204419f0f9812e020641d01b97'
---

# An das Gerät anpassen

Reservieren Sie Platz für eine gemeldete Seitenleiste und stellen Sie nach ihrem Wegfall das normale Layout wieder her. Prüfen Sie zunächst Web-Abstände, danach Gerätemeldung und natives Rendering.

Für [Native UI mit vorhandenem Theme](/projects/capacitor-native-ui/docs/ionic-vertical-bars), [HTML ohne Ionic](/projects/capacitor-native-ui/docs/framework-independent) oder [Cordova](/projects/cordova-native-ui/docs/readme) verwenden Sie die jeweilige Anleitung. [Wählen Sie die Einrichtung](/#choose-setup), bevor Sie die App ändern.

## 1. Das bestehende Layout-Abonnement finden

Die [Einrichtung](/standard-setup) lädt bereits Rail-CSS und ein Layout-Abonnement. Lassen Sie es einmal nach dem ion-app-Rendering an der Shell laufen, nicht pro Routenseite. Verwenden Sie Foldable 8.5 oder neuer in Version 8. Ein breiter Viewport aktiviert keine native Rail.

## 2. Die echte Gerätemeldung anwenden

Ersetzen Sie den bestehenden Update-Block zur Kontrolle durch diesen Code und behalten Sie ein Abonnement. Der Resolver liefert edge, inset und toolbarTop. Das Theme behandelt logische Seiten und setzt Abstände bei null zurück. Ersetzen Sie dies nicht durch Gerätenamen, feste Breiten oder Viewport-Tests.

```ts
import { Foldable } from '@erkamyaman/capacitor-foldable';
import { resolveVerticalBarsLayout } from '@rdlabo/capacitor-native-ui/integration';
import { setVerticalBarsLayout } from '@rdlabo/ionic-theme-ios27';

const updateLayout = async () => {
  const layout = await resolveVerticalBarsLayout(Foldable);
  setVerticalBarsLayout(layout);
  console.info('Device layout', layout);
};

void Foldable.addListener('layoutChange', () => void updateLayout().catch(console.error))
  .then(updateLayout)
  .catch(console.error);
```

## 3. Web-Abstände im Browser prüfen

Wählen Sie für eine temporäre Browser-Vorschau das iOS-Preset und führen Sie dies nach dem ion-app-Rendering aus. Toolbar und Inhalt sollen auf der trailing-Seite Platz lassen. Das prüft nur Web-Layout, keine native Fähigkeit. Halten Sie den Test vom echten Geräte-Abonnement getrennt.

```ts
import { setVerticalBarsLayout } from '@rdlabo/ionic-theme-ios27';

setVerticalBarsLayout({ edge: 'trailing', inset: 80 });
```

## 4. Zurücksetzen und auf dem Gerät prüfen

Setzen Sie die Vorschau damit zurück und entfernen Sie den temporären Code. Bauen und synchronisieren Sie die App; prüfen Sie Einblenden, Wegfall, Rotation und Falten auf einem unterstützten Gerät. Aktionen müssen ihre Web-Handler behalten. Normale Telefone und Browser behalten das gewöhnliche Layout. Für die native Rail benötigen Sie etwa ein gegen iOS 27.1 oder neuer gelinktes iPhone Duo.

```ts
setVerticalBarsLayout({ edge: null });
```

Geometrie und Gerätebedingungen stehen in der [Rail-Referenz](/projects/capacitor-native-ui/docs/vertical-bars).
