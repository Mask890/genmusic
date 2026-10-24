import { Monitor, Apple, Smartphone, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { platforms, assetFor, type Release } from "@/lib/releases";

export function DownloadOptions({ release }: { release?: Release }) {
  return <div className="grid items-stretch gap-4 md:grid-cols-3">{platforms.map((platform) => {
    const Icon = platform.id === "windows" ? Monitor : platform.id === "mac" ? Apple : Smartphone;
    const asset = assetFor(release, platform.id);
    return <article key={platform.id} className="flex h-full flex-col rounded-lg border border-border bg-surface p-6">
      <Icon className="mb-6 size-7 text-accent" />
      <h3 className="text-xl font-semibold">Pebble for {platform.name}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{platform.detail}</p>
      <div className="mt-auto pt-6">{asset ? <Button asChild className="w-full"><a href={asset.browser_download_url}><Download /> Download {platform.extension}</a></Button> : <Button disabled className="w-full" variant="secondary"><Download /> Coming soon · {platform.extension}</Button>}</div>
      <p className="mt-3 text-xs text-muted-foreground">{asset ? `${release?.tag_name} · ${(asset.size / 1024 / 1024).toFixed(1)} MB` : "First release in preparation"}</p>
    </article>;
  })}</div>;
}