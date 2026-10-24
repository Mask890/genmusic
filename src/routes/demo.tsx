import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { Player } from "@/components/Player";
import { Button } from "@/components/ui/button";
export const Route = createFileRoute("/demo")({
  head: () => ({ meta: [{ title: "Pebble Live Demo — Play Your Music" }, { name: "description", content: "Try Pebble's local MP3 player and seven live audio visualizers. Your files stay on your device." }, { property: "og:title", content: "Pebble Live Demo" }, { property: "og:description", content: "Try local playback with seven audio-reactive visualizations." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: Demo,
});
function Demo() { return <div className="relative bg-background"><Button asChild variant="ghost" className="absolute left-2 top-2 z-50 sm:left-5 sm:top-5"><Link to="/"><ArrowLeft /> Pebble</Link></Button><div className="pt-12"><Player /></div></div>; }