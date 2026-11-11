# Native device showcase

The homepage shows native demos on a **physical iPhone 15 Pro Max** and **physical Pixel 8a**.
Both OS examples replace the previous browser screenshots; neither is a before/after comparison.

## iPhone capture provenance

- Asset: `projects/docs/public/assets/showcase/iphone-library.jpg` (690 × 1520).
- Source: `webview-native-ui/ionic-theme-ios27`, commit
  `8b769fd2765fde89ab9f76cdf9e1cff07bbd11de`, demo target `io.ionic.theme.ios27`.
- Local theme snapshot: 2.1.2; Capacitor Native UI: 2.1.4; Capacitor iOS: 8.5.2.
- Built the theme and production Web assets, ran Capacitor iOS sync, then built the signed
  Debug iPhoneOS app with Xcode and installed it on the physical device.
- `demo/src/main.ts` calls `enableNativeUI` with ordinary controls enabled. The app registers
  its native extensions in AppDelegate. This is the native app, not the hosted browser demo.
- The user selected Library on the device. The screen was captured from Apple's iPhone
  Mirroring window, which streams the physical device. The image is **not a simulator capture**.
- The source image is unretouched: it retains the real status bar, time and mirroring indicator.
  Its resolution is that of the mirrored capture, not the device's full-resolution screenshot.
  CSS crops only the surrounding white mirroring-window margin (16 px sides, 76 px top,
  16 px bottom); the source asset and all device UI pixels are preserved.
- Photography is the existing demo's Picsum feed. No production-user app content is included.

## Android capture provenance

- Asset: `projects/docs/public/assets/showcase/pixel-library.jpg` (1080 × 2400), captured on 2026-11-12.
- Physical Pixel 8a, Android 17; ADB `exec-out screencap -p` capture, encoded as JPEG (quality 85) for delivery.
  No retouching, cropping, compositing or UI alteration; raw PNG retained locally for verification.
- Source: `webview-native-ui/ionic-theme-md3`, commit `b9ab243` (theme 9.2.1).
- Built in an isolated worktree with Capacitor Native UI 2.1.4. Built production Web assets,
  synced Capacitor Android and built a debug APK. The application ID was changed to
  `io.ionic.theme.md3.showcase` solely to preserve the already-installed app with a different signature.
- Verified Material You enabled in the app and the native `getDynamicColorScheme` response:
  `available: true`, `systemDark: false`, light primary `#44683c`, primary container `#c4eeb7`.
- Selected Library through ADB on the real device. The green search action and navigation
  reflect the real device palette. No fixture colors or browser emulation were used.
- Android shows Ionic controls styled with Material Design 3 and native Dynamic Color;
  it does not claim iOS-only native control replacement is available on Android.
- Photography is the demo's existing Picsum feed. No production-user app content is included.

Both captures retain their actual system status and navigation bars. The iPhone image does not
show iPhone Duo or the SwiftUI mini-player. Captions name the actual devices and OS versions.
The setup link leads to the shared standard setup; browser theme trials remain a separate section.

To refresh: build and install the native demo, verify its Native UI setup, open a representative
screen on a physical device, wait for images to load, and capture that device. Record the exact
source revision, package versions, device, OS and capture method. Never relabel browser or
simulator captures as physical-device screenshots.
