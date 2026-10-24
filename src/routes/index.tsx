import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { ArrowDownToLine, ArrowUpRight, AudioLines, ShieldCheck, WifiOff } from "lucide-react";
import { SiteShell } from "@/components/SiteShell";
import { Button } from "@/components/ui/button";
import visualizerArt from "@/assets/pebble-visualizer.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Pebble — Your Music, in Motion" },
      {
        name: "description",
        content:
           "Meet Pebble: a local music player for Windows, Mac, and Android with seven audio-reactive visualizers. Try the live demo and find app downloads.",
      },
      { property: "og:title", content: "Pebble — Your Music, in Motion" },
      {
        property: "og:description",
        content: "Play MP3s from your device with a dreamy live visualizer. No ads. No accounts.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return <SiteShell>
    <section className="pebble-hero relative isolate overflow-hidden">
      <img src={visualizerArt} alt="Flowing pink and turquoise waveform threads" width={1600} height={1024} className="absolute inset-0 -z-20 h-full w-full object-cover" />
      <div className="hero-shade absolute inset-0 -z-10" />
      <div className="site-container flex h-full flex-col justify-center py-14">
        <p className="mb-6 flex items-center gap-2 font-mono text-xs uppercase text-accent"><span className="size-1.5 rounded-full bg-accent" /> Local music. Limitless feeling.</p>
        <h1 className="hero-title font-bold">Pebble<span className="text-primary">.</span></h1>
        <p className="mt-4 text-3xl font-medium sm:text-4xl">Your music, in motion.</p>
        <p className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground">An independent music player for the songs you own. Beautiful visualizations. No ads. Nothing between you and your music.</p>
        <div className="mt-8 flex flex-wrap gap-3"><Button size="lg" asChild><Link to="/downloads"><ArrowDownToLine /> Get Pebble</Link></Button><Button size="lg" variant="outline" asChild><Link to="/demo">Try live demo <ArrowUpRight /></Link></Button></div>
        <p className="mt-5 font-mono text-xs text-muted-foreground">Windows .exe / macOS .dmg / Android .apk</p>
      </div>
      <div className="absolute bottom-6 right-8 hidden font-mono text-xs text-foreground/60 sm:block">SOUND, WITH A DIFFERENT DIMENSION</div>
    </section>
    <section className="border-y border-border bg-surface/50"><div className="site-container grid gap-6 py-7 sm:grid-cols-3">{[{ Icon: AudioLines, text: "7 audio-reactive visualizers" }, { Icon: WifiOff, text: "Your library. Offline." }, { Icon: ShieldCheck, text: "No ads. No accounts." }].map(({ Icon, text }) => <div key={text} className="flex items-center gap-3 text-sm"><Icon className="size-5 text-accent" />{text}</div>)}</div></section>
    <section className="site-container py-16 sm:py-20"><div className="flex flex-wrap items-end justify-between gap-5"><div><p className="font-mono text-xs uppercase text-primary">Not just heard. Felt.</p><h2 className="mt-4 text-3xl font-semibold">Let your songs take shape.</h2></div><Button variant="link" asChild><Link to="/demo">Explore the visualizers <ArrowUpRight /></Link></Button></div><p className="mt-5 max-w-xl leading-relaxed text-muted-foreground">From the flowing threads of Tie-Dye to the pulse of Plasma, every visual responds to your audio. A little nostalgia. A whole new atmosphere.</p><div className="mt-8 flex flex-wrap gap-x-7 gap-y-4 border-y border-border py-6 font-mono text-sm">{["Plasma", "Tie-Dye", "Tunnel", "Bloom", "Bars", "Wave", "Particles"].map((name, i) => <span key={name} className={i === 0 ? "text-primary" : "text-muted-foreground"}><span className="mr-2 text-xs text-accent">0{i + 1}</span>{name}</span>)}</div></section>
    <section className="border-t border-border bg-surface/50"><div className="site-container flex flex-wrap items-center justify-between gap-6 py-12"><div><h2 className="text-2xl font-semibold">A home for your music.</h2><p className="mt-3 text-sm text-muted-foreground">Standalone apps for your desktop and your pocket.</p></div><Button variant="outline" asChild><Link to="/downloads">View downloads <ArrowUpRight /></Link></Button></div></section>
  </SiteShell>;
}
