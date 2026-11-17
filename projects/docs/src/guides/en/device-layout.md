# Adapt to the device

Make the page leave room for a reported side rail and restore its ordinary layout when the rail disappears. First verify the Web spacing, then the actual device report and native rendering.

For [Native UI with an existing theme](/projects/capacitor-native-ui/docs/ionic-vertical-bars), [HTML without Ionic](/projects/capacitor-native-ui/docs/framework-independent), or [Cordova](/projects/cordova-native-ui/docs/readme), use that integration instead. [Choose another setup](/#choose-setup) before changing the app.

## 1. Locate the existing layout subscription

The [app setup](/standard-setup) already loads the rail CSS and subscribes to device layout once. Keep that code at the app shell, after ion-app renders. It should not run again on every routed page. Foldable must be 8.5 or later within version 8. A large viewport alone does not enable a native rail.

## 2. Inspect and apply the real report

Replace the existing update block with this version to inspect it. Keep one subscription. The resolver provides edge, inset, and toolbarTop; the theme handles logical edges and restores spacing when edge is null. Do not replace those values with a device name, a fixed width, or a viewport test.

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

## 3. Preview the Web spacing in a browser

For a temporary browser-only preview, select the iOS preset and run this after ion-app renders. Check that the toolbar and content leave space on the trailing side. This changes Web layout only and does not simulate native support. Keep this temporary call separate from the real device subscription.

```ts
import { setVerticalBarsLayout } from '@rdlabo/ionic-theme-ios27';

setVerticalBarsLayout({ edge: 'trailing', inset: 80 });
```

## 4. Restore and verify on a supported device

Restore the browser preview with the call below and remove the temporary preview code. Build and sync the app, then test rail appearance, disappearance, rotation, and folding on a supported device. Confirm that tabs and toolbar actions still call their existing Web handlers. On an ordinary phone, browser, or unsupported device, content must use its ordinary layout. Native rail support depends on the device and OS; use an iPhone Duo linked against iOS 27.1 or later when checking native rail rendering.

```ts
setVerticalBarsLayout({ edge: null });
```

Detailed geometry and supported-device conditions are in the [rail reference](/projects/capacitor-native-ui/docs/vertical-bars).
