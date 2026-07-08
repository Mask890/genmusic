import { createFileRoute } from "@tanstack/react-router";
import { Player } from "@/components/Player";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Pebble — Local MP3 Player with Visualizer" },
      {
        name: "description",
        content:
          "A cute, ad-free mobile music player for your local MP3s with a smooth live audio visualizer.",
      },
      { property: "og:title", content: "Pebble — Local MP3 Player" },
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
  return <Player />;
}
