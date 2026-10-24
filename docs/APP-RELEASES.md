# Pebble downloadable apps

The website now has a landing page, /downloads, /updates, and /demo. The existing Player and its seven audio-reactive visualizers are reused in a separate standalone native renderer. The installer workflow is prepared, not yet run or verified on native devices.

## One-time setup
1. Connect Git sync in Lovable Project settings → Git. The workflow watches `main`; change that branch if the synced branch differs.
2. Use a public release repository. GitHub Releases in private repositories cannot be downloaded anonymously. If source must remain private, adapt publishing to a separate public downloads repository with a narrowly scoped token.
3. Set `repository` in `public/release-source.json` to the public `owner/repository` containing the releases (or set the public VITE_RELEASE_REPOSITORY variable). Never put tokens in this file. The website reads GitHub Releases on each visit, so new versions appear without a site rebuild. GitHub rate limits can temporarily make the feed unavailable.
4. Add GitHub Actions secrets ANDROID_KEYSTORE_BASE64, ANDROID_KEYSTORE_PASSWORD, ANDROID_KEY_ALIAS, ANDROID_KEY_PASSWORD. Generate and securely back up a release keystore with Java keytool; preserve it forever so subsequent APKs update the existing app. Never commit a keystore or password. No debug APK is published as a production download.
5. Enable Actions with permission to write repository contents. Run “Build Pebble apps” from Actions, or push an app change to main.

## Android test first (no release-signing secrets)

For an initial installable Android test, use the separate **Build Android test APK** workflow. Android requires every installable APK to be signed, so this uses an automatically generated debug key rather than a truly unsigned APK. It does not use your production signing credentials.

1. Connect this project to GitHub through Lovable Project settings → Git if not already connected. GitHub sync creates a repository; you do not need to create one separately.
2. In that repository, open **Actions → Build Android test APK → Run workflow**, select the branch containing this workflow, and start it. If it is not listed, ensure the workflow is on the repository's default branch.
3. Wait for the run to succeed. Open the completed run and download **Pebble-Android-Test-RUN_NUMBER** from **Artifacts** (GitHub sign-in required). Extract the ZIP to obtain `Pebble-Test-RUN_NUMBER-Android.apk`; artifacts expire after 14 days.
4. Transfer the APK to an Android 7+ phone, open it, and allow installation from that source only if you trust this build. It appears as **Pebble Test**, separate from the eventual production app.
5. Import your own music; verify playback, repeat-one, all seven visualizers, saved music after closing/reopening, and offline playback. Music in the website demo is not transferred automatically.

Hosted runs can generate different debug keys. A later test APK may require uninstalling the previous Pebble Test, which deletes its saved library; keep your original music files. Test builds are not suitable for reliable upgrade testing or public release. The stable production key is still required for that.

This manual Android-only workflow does **not** run the Windows/Mac jobs, publish a GitHub Release, or change the site's Coming soon buttons. The existing production workflow still requires release-signing secrets and all three platform builds to succeed. No test APK has been generated or device-tested merely by adding this workflow.

## Output
- Windows: traditional Squirrel Setup EXE, x64.
- macOS: universal Apple Silicon/Intel DMG containing Pebble.app and Applications shortcut.
- Android: release-signed APK, Android 7+ (Capacitor 8, JDK 21).
- Each successful three-platform run creates `v0.1.RUN_NUMBER` on GitHub Releases; the website selects the newest non-draft, non-prerelease release.
- Run-number versions are early development versions, not a semantic release policy.

## Native builds
`bunx vite build --config native/vite.config.ts` makes the offline renderer in dist-native. Desktop packaging: `node scripts/package-desktop.mjs` on Windows or Mac. Android: `bunx cap add android`, `bunx cap sync android`, then signing preparation and Gradle release build (see workflow).

The native renderer bundles fonts and runs locally without the website or a server. User-selected audio is copied into IndexedDB. It currently uses the system file picker, not automatic scanning of Music/Downloads folders or Android's whole media library. Background audio and native notifications remain future work.

## Signing and updates
Windows and Mac packages are currently unsigned. Windows SmartScreen and macOS Gatekeeper warnings are expected; do not tell users to blindly bypass warnings. Before a public production launch, add Windows certificate signing, Apple Developer ID signing and notarization, and native-device testing. The DMG alone does not grant macOS trust.

Updates are manual download/install from /updates, not silent in-app auto-updates. Native app ID/name and Electron user-data name stay stable; validate persistence across an installed upgrade before launch. Website-demo libraries are separate from downloaded-app libraries. Do not publish release notes claiming untested fixes.

No installers have been generated in this Lovable sandbox. Windows/macOS installers require matching hosted runners; Android additionally requires the signing credentials above. Verify APK playback, file access, visualizations, and app upgrades on real devices before marking releases production-ready.
