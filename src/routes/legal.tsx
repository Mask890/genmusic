import { createFileRoute } from "@tanstack/react-router";
import { Scale } from "lucide-react";
import { SiteShell } from "@/components/SiteShell";

export const Route = createFileRoute("/legal")({
  head: () => ({
    meta: [
      { title: "Pebble Legal Center — Terms, Privacy & Cookies" },
      { name: "description", content: "Legal information, terms and conditions, privacy, and device storage notices for Pebble Music Player, operated by LoveRiviera LLC in New York City." },
      { property: "og:title", content: "Pebble Legal Center" },
      { property: "og:description", content: "Terms, privacy, and cookies information for Pebble Music Player by LoveRiviera LLC." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LegalCenter,
});

function LegalCenter() {
  return <SiteShell>
    <header className="site-container py-12 sm:py-16">
      <p className="flex items-center gap-2 font-mono text-xs uppercase text-accent"><Scale className="size-4" /> LoveRiviera LLC</p>
      <h1 className="mt-4 text-4xl font-bold sm:text-5xl">Legal center.</h1>
      <p className="mt-5 max-w-2xl leading-relaxed text-muted-foreground">Legal information for Pebble Music Player, its website, live demo, and downloadable apps.</p>
      <p className="mt-4 font-mono text-xs text-muted-foreground">Last updated: October 24, 2026</p>
    </header>
    <div className="border-t border-border">
      <div className="site-container grid items-start gap-10 py-10 lg:grid-cols-[200px_minmax(0,1fr)] lg:gap-16">
        <nav aria-label="Legal sections" className="flex flex-wrap gap-x-6 gap-y-4 text-sm lg:sticky lg:top-8 lg:flex-col">
          <a href="#legal" className="text-muted-foreground transition-colors hover:text-primary">Legal</a>
          <a href="#terms" className="text-muted-foreground transition-colors hover:text-primary">Terms &amp; Conditions</a>
          <a href="#privacy" className="text-muted-foreground transition-colors hover:text-primary">Privacy</a>
          <a href="#cookies" className="text-muted-foreground transition-colors hover:text-primary">Cookies</a>
        </nav>
        <div className="legal-copy min-w-0 max-w-3xl">
          <section id="legal" className="scroll-mt-8 pb-10">
            <h2>Legal information</h2>
            <p>Pebble Music Player is operated by LoveRiviera LLC, located in New York City, New York, United States. LoveRiviera LLC owns the domain pebblemusicplayer.com.</p>
            <p>These notices cover the Pebble website, its browser demo, and any Pebble app releases made available through official download links. Third-party websites and services have their own terms and privacy policies.</p>
            <h3>Ownership and music rights</h3>
            <p>Pebble software, branding, and website content are protected by applicable intellectual property laws, subject to the licenses of third-party and open-source materials. Third-party names and trademarks belong to their respective owners.</p>
            <p>Your music remains yours. Using Pebble does not transfer ownership of your files to LoveRiviera LLC or give you rights to music you do not already have permission to use.</p>
            <h3>Contact availability</h3>
            <p>The website’s Contact button is not available yet. A public contact channel for support, legal inquiries, and privacy requests will be added before launch.</p>
          </section>
          <section id="terms" className="scroll-mt-8 border-t border-border py-10">
            <h2>Terms &amp; Conditions</h2>
            <p>These terms govern your use of the Pebble website, demo, and downloadable software. By using Pebble, you agree to these terms. If you do not agree, do not use the service or software.</p>
            <h3>Using Pebble</h3>
            <p>You may use Pebble for lawful personal music playback. Only import and play files you own or have permission to use. Do not use Pebble to infringe others’ rights, distribute malware, interfere with the website, or bypass security protections. Rights provided by applicable law or open-source licenses are not limited by these terms.</p>
            <h3>Local files and backups</h3>
            <p>You choose which files to import. Playback, supported formats, and device access depend on your browser, operating system, and app version. Keep your original music files and independent backups: browser or device storage can be cleared, become unavailable, or be removed when an app is uninstalled. The browser demo and downloaded apps have separate libraries.</p>
            <h3>Downloads and updates</h3>
            <p>Download only from the official links on Pebble’s Downloads and Software Updates pages. Available releases and features may change. Updates listed on the website are downloaded and installed by you; the website does not silently install native app updates. The browser version may refresh cached app files automatically.</p>
            <h3>Availability, warranties, and liability</h3>
            <p>To the extent permitted by law, Pebble is provided “as is” and “as available,” without guarantees of uninterrupted operation, compatibility, or preservation of local data. To that same extent, LoveRiviera LLC disclaims implied warranties and liability for indirect or consequential losses arising from use of Pebble. Nothing in these terms excludes rights, warranties, or liabilities that cannot lawfully be excluded.</p>
            <h3>Applicable law and changes</h3>
            <p>These terms are governed by New York law, except where mandatory laws in your place of residence require otherwise. Updated terms will be posted here with a revised date. Material changes will be identified on this page; where legally required, additional notice or consent will be provided.</p>
          </section>
          <section id="privacy" className="scroll-mt-8 border-t border-border py-10">
            <h2>Privacy notice</h2>
            <p>LoveRiviera LLC is responsible for the personal information it processes in connection with Pebble. The player is designed for local playback, without a Pebble account or uploads of your music files to our servers.</p>
            <h3>Music and playback information</h3>
            <p>The browser demo stores imported audio files and library information in your browser’s IndexedDB storage. Track selections, repeat and shuffle settings, and visualization preferences are saved locally. Audio is analyzed on your device to animate the visualizations. Downloaded apps use their own local storage; music libraries are not synced between devices or with the website.</p>
            <h3>Website requests and service providers</h3>
            <p>Visiting the website requires network requests to our hosting infrastructure. Hosting and delivery providers may process technical information such as your IP address, browser details, request time, and requested pages for delivery, security, and reliability. The download and update pages request public release information from GitHub; GitHub receives technical information associated with those requests and downloads under its own privacy policy.</p>
            <p>The player does not include advertising trackers. Website hosting may also process error and diagnostic information. Hosting-specific analytics, logs, cookies, and retention settings must be confirmed before public launch; this notice does not claim that infrastructure collects no information.</p>
            <h3>Purpose, sharing, and retention</h3>
            <p>Local information is used to play music and remember your choices. Technical information is used to deliver and protect the website and make releases available. We do not upload your music for sale or advertising. Hosting and download providers process requests needed for their services and may process information outside your country.</p>
            <p>Locally saved music remains until you remove it, clear site or app storage, uninstall the app, or your device removes the data. Provider log retention depends on the hosting and download services; no fixed retention period is represented here.</p>
            <h3>Your choices and privacy rights</h3>
            <p>You can remove tracks from the library or clear the site’s storage through your browser settings. Clearing storage removes saved music and preferences from that browser, not the original files elsewhere on your device. Depending on your location, you may have rights to access, correct, delete, restrict, or object to processing of personal information, and to complain to the appropriate privacy regulator. LoveRiviera LLC cannot retrieve music stored only on your device.</p>
            <p>A public channel for exercising privacy rights will be provided before launch. Do not submit sensitive information through an unavailable Contact button.</p>
            <h3>Children and changes</h3>
            <p>Pebble is not directed at children under 13, and we do not knowingly request personal information from them. This notice will be updated when data practices change, including if accounts, notifications, analytics, or other online features are introduced.</p>
          </section>
          <section id="cookies" className="scroll-mt-8 border-t border-border py-10">
            <h2>Cookies &amp; device storage</h2>
            <p>Cookies are small pieces of information stored by a browser. Pebble also uses other device storage, which is different from cookies but described here so you can understand what stays on your device.</p>
            <h3>Storage used by the player</h3>
            <ul>
              <li><strong>IndexedDB:</strong> imported audio files and library records for local playback.</li>
              <li><strong>Local storage:</strong> your last track selection, repeat, shuffle, and visualization preferences.</li>
              <li><strong>Cache Storage and service worker:</strong> cached app files that support offline use of the browser version and refresh it when updates become available.</li>
            </ul>
            <p>The player itself does not set advertising cookies or add third-party advertising tools. Hosting infrastructure may use cookies or similar technologies for delivery, security, or diagnostics; its actual settings must be checked before launch. No optional analytics or advertising consent is assumed from your visit.</p>
            <h3>Managing storage</h3>
            <p>Use your browser’s site-data settings to inspect or delete cookies and other storage for the site. You can also remove individual songs in Pebble. Blocking or clearing storage may prevent the player from remembering your library, settings, or cached app files.</p>
            <p>If optional tracking technologies are introduced, this notice will be updated and a consent choice will be offered where required before those technologies are used.</p>
          </section>
        </div>
      </div>
    </div>
  </SiteShell>;
}