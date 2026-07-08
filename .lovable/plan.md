# Mobile App Plan for Pebble

## Goal
Make the Pebble MP3 player installable on phones, work offline, and eventually support native mobile features like background audio, lock-screen media controls, and push notifications.

## Recommended Approach

### Phase 1: Progressive Web App (PWA)
This gives you a home-screen installable app and offline playback without app store accounts. It is the fastest path and shares 100% of the existing code.

**What we'll build:**
1. Add a web app manifest (`public/manifest.webmanifest`) with app name, icons, theme colors, and `display: standalone`.
2. Generate app icons for common sizes and place them in `public/`.
3. Add required `<head>` tags in `src/routes/__root.tsx` (manifest link, theme-color, apple-touch-icon).
4. Add a guarded service worker using `vite-plugin-pwa` with `generateSW` so the app shell works offline.
5. Ensure uploaded MP3s stored in IndexedDB continue to be available offline (they already are local; we just need the app shell cached).
6. Use the Media Session API so lock-screen metadata (title, artwork, play/pause) works where the browser supports it.

**Out of scope for Phase 1:**
- True background audio on iOS (Safari pauses PWAs in the background).
- Push notifications on iOS (requires a native app).
- App Store / Play Store distribution.

### Phase 2: Native App Wrapper with Capacitor
Wrap the PWA in a native shell so you can publish to the App Store and Google Play and unlock full native capabilities.

**What we'll build:**
1. Add Capacitor to the project with iOS and Android platforms.
2. Configure the native app metadata (bundle ID, app name, splash screen, icons).
3. Add the Capacitor background-audio plugin so music keeps playing when the app is backgrounded or the screen is locked.
4. Add lock-screen / notification media controls.
5. Set up push notifications (Firebase Cloud Messaging for Android; APNS for iOS).
6. Document the build and publish steps for both stores.

**What you will need to provide:**
- Apple Developer account ($99/year) for iOS App Store.
- Google Play Developer account ($25 one-time) for Play Store.
- macOS with Xcode to build the iOS app.
- Android Studio to build the Android app.
- Firebase project if you want push notifications.

## Why This Order?
- The PWA can be shipped immediately to anyone with a browser.
- It validates the mobile UX before investing in native builds.
- Capacitor reuses the same web code, so Phase 2 is additive, not a rewrite.

## Suggested First Step
Start with Phase 1 (PWA) now. It gives you an installable, offline-capable music app today. Phase 2 can be added once you confirm the mobile experience feels right and you have the store accounts ready.

Would you like me to implement Phase 1 (PWA with offline support) first?