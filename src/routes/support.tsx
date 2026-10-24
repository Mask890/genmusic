import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpen, ArrowDownToLine } from "lucide-react";
import { SiteShell } from "@/components/SiteShell";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/support")({
  head: () => ({ meta: [
    { title: "Pebble Support Docs — Installation & Android Signing" },
    { name: "description", content: "Pebble installation, local music, updates, and a step-by-step Android signing key guide for release maintainers." },
    { property: "og:title", content: "Pebble Support Docs" },
    { property: "og:description", content: "Help with installing Pebble, keeping your music, and preparing signed Android releases." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Support,
});

function Support() {
  return <SiteShell>
    <section className="site-container py-14 sm:py-20">
      <BookOpen className="size-7 text-accent" />
      <h1 className="mt-4 text-4xl font-bold">Support docs.</h1>
      <p className="mt-5 max-w-2xl leading-relaxed text-muted-foreground">Installation, your music library, and release setup for Pebble.</p>
      <div className="mt-10 grid items-start gap-10 md:grid-cols-[200px_minmax(0,1fr)]">
        <nav aria-label="Support topics" className="flex flex-col items-start gap-4 text-sm md:sticky md:top-8">
          <a href="#installation" className="hover:text-primary">Install &amp; update</a>
          <a href="#library" className="hover:text-primary">Your music library</a>
          <a href="#android-signing" className="hover:text-primary">Android signing key</a>
        </nav>
        <div className="legal-copy min-w-0 space-y-12">
          <section id="installation" className="scroll-mt-8">
            <h2>Install &amp; update</h2>
            <p>Use the Downloads page for available Windows (.exe), Mac (.dmg), and Android (.apk) installers. A “Coming soon” button means there is no published installer for that device yet.</p>
            <p>On Windows, open the installer. On Mac, open the disk image and move Pebble into Applications. On Android, open the APK; your phone may ask you to allow installation from that source. Only install files from official Pebble release links. Unsigned desktop builds may show security warnings; do not bypass a warning for a file you cannot verify.</p>
            <p>Check Software Updates for new versions and release notes. Download and install updates yourself; Pebble does not silently install them. Keep your original music files and back up your library before upgrading.</p>
            <h3>iPhone &amp; iPad</h3>
            <p>A downloadable iOS installer is not currently offered. You can try Pebble in Safari and use Share → Add to Home Screen. Import songs with the file picker; this is the website experience, not a native iOS download.</p>
            <div className="mt-5 flex flex-wrap gap-3"><Button asChild variant="outline"><Link to="/downloads"><ArrowDownToLine /> Downloads</Link></Button><Button asChild variant="ghost"><Link to="/updates">Software updates</Link></Button></div>
          </section>
          <section id="library" className="scroll-mt-8">
            <h2>Your music library</h2>
            <p>Import MP3s from your device using the player’s import button. Your songs stay on your device, not on a Pebble server. The current apps use the file picker rather than automatically scanning music folders.</p>
            <p>The website demo and installed apps have separate libraries. Clearing site storage, uninstalling an app, or storage cleanup can remove saved copies. Keep your original files somewhere safe so you can import them again. The editor’s preview may also reset saved storage during updates.</p>
          </section>
          <section id="android-signing" className="scroll-mt-8">
            <p className="!mt-0 font-mono text-xs uppercase text-accent">For the app owner &amp; release maintainers</p>
            <h2 className="mt-3">Android signing key</h2>
            <p>Every installable Android app must be signed. Future Pebble updates must use the same production signing key. Losing it can mean users need to uninstall and reinstall, losing the app’s saved library.</p>
            <h3>Choose how to set it up</h3>
            <ol className="mt-4 list-decimal space-y-4 pl-5 text-sm leading-relaxed text-muted-foreground">
              <li><strong>Ask for assisted setup.</strong> In your private Lovable project chat, choose option 1: “Create the Android signing key and save it as GitHub Actions secrets.” Once setup is confirmed, download the backup supplied in Files and keep it securely, such as in a password manager that supports attachments or an encrypted USB drive. A public repository must never contain the key itself.</li>
              <li><strong>Create it yourself.</strong> Choose option 2 and follow the guide below to generate the key locally and add it to GitHub yourself.</li>
            </ol>
            <p>These options are instructions for the project owner, not a form on this website. Do not share a signing key or password in chat, source code, release downloads, or screenshots.</p>
            <h3>1. Generate a release keystore</h3>
            <p>Install a Java JDK with <code>keytool</code>. In a private folder outside your source repository, run:</p>
            <pre className="mt-4 overflow-x-auto rounded-md border border-border bg-surface p-4 text-xs leading-relaxed"><code>{"keytool -genkeypair -v -keystore pebble-release.jks \\\n  -alias pebble -keyalg RSA -keysize 2048 -validity 10000"}</code></pre>
            <p>Follow the prompts to set a strong keystore password and enter your organization details. Record the alias and key password; if you reuse the keystore password for the key, record that too. Keep the keystore and credentials in a secure backup. Never regenerate this key for an ordinary update.</p>
            <h3>2. Encode the keystore for GitHub</h3>
            <p>On Mac or Linux:</p>
            <pre className="mt-4 overflow-x-auto rounded-md border border-border bg-surface p-4 text-xs"><code>{"base64 < pebble-release.jks | tr -d '\\r\\n' > pebble-release.base64.txt"}</code></pre>
            <p>On Windows PowerShell:</p>
            <pre className="mt-4 overflow-x-auto rounded-md border border-border bg-surface p-4 text-xs"><code>{"[Convert]::ToBase64String([IO.File]::ReadAllBytes(\"$PWD\\pebble-release.jks\")) | Set-Content -NoNewline pebble-release.base64.txt"}</code></pre>
            <p>The encoded file is still a secret, not encryption. Do not commit or publish either file.</p>
            <h3>3. Add GitHub Actions secrets</h3>
            <p>Open your GitHub repository → Settings → Secrets and variables → Actions → New repository secret. Add each of these separately:</p>
            <dl className="mt-5 space-y-4 text-sm">
              {[
                ["ANDROID_KEYSTORE_BASE64", "The full contents of pebble-release.base64.txt."],
                ["ANDROID_KEYSTORE_PASSWORD", "The password used for the keystore."],
                ["ANDROID_KEY_ALIAS", "pebble, if you used the command above."],
                ["ANDROID_KEY_PASSWORD", "The password for the signing key."],
              ].map(([name, description]) => <div key={name}><dt className="break-all font-mono text-accent">{name}</dt><dd className="mt-1 text-muted-foreground">{description}</dd></div>)}
            </dl>
            <h3>4. Build, check &amp; publish</h3>
            <p>Run the production “Build Pebble apps” workflow in GitHub Actions. Adding secrets alone does not enable downloads: an Android build must succeed and its signed APK must be published in the public release feed. The website can then show the Android download button on its next successful release check.</p>
            <p>Test installation, playback, all seven visualizers, offline use, saved music after reopening, and an upgrade signed with the same key on an Android device before calling it ready for users.</p>
            <h3>Test APKs are different</h3>
            <p>The manual “Build Android test APK” workflow needs no production key. Its debug-signed app installs as Pebble Test, separately from Pebble. It does not activate the public download button. Later test builds may use a different debug key and require uninstalling the previous test app.</p>
          </section>
        </div>
      </div>
    </section>
  </SiteShell>;
}