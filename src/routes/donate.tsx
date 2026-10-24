import { createFileRoute } from "@tanstack/react-router";
import { Coffee, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteShell } from "@/components/SiteShell";

const KOFI_URL = "https://ko-fi.com/pebble_musicapp";

export const Route = createFileRoute("/donate")({
  head: () => ({
    meta: [
      { title: "Support Pebble — Donate on Ko-fi" },
      { name: "description", content: "Pebble is free, ad-free and tracker-free. Buy us a coffee on Ko-fi to keep it that way." },
      { property: "og:title", content: "Support Pebble — Donate on Ko-fi" },
      { property: "og:description", content: "Help keep Pebble free, ad-free and independent." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: DonatePage,
});

function DonatePage() {
  return (
    <SiteShell>
      <section className="site-container max-w-2xl py-20 text-center">
        <Heart className="mx-auto size-10 text-primary" />
        <h1 className="mt-6 text-4xl font-bold sm:text-5xl">Support Pebble</h1>
        <p className="mt-5 text-muted-foreground">
          Pebble has no ads, no accounts, no subscriptions and no tracking. If it makes your music feel a little better, a small tip helps keep it that way.
        </p>
        <Button asChild size="lg" className="mt-8">
          <a href={KOFI_URL} target="_blank" rel="noopener noreferrer"><Coffee /> Buy me a coffee on Ko-fi</a>
        </Button>
        <ul className="mx-auto mt-12 grid max-w-md gap-3 text-left text-sm text-muted-foreground">
          <li>• Security certificates so Windows and Mac trust the installers</li>
          <li>• Building new versions and updates</li>
          <li>• Hosting and the pebblemusicplayer.com domain</li>
          <li>• Keeping Pebble independent and ad-free</li>
        </ul>
        <p className="mt-10 text-xs text-muted-foreground">Donations are optional and processed securely by Ko-fi. Pebble never sees your payment details.</p>
      </section>
    </SiteShell>
  );
}
