import { Link } from "@tanstack/react-router";
import { AudioLines, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ReactNode } from "react";

export function SiteShell({ children }: { children: ReactNode }) {
  return <div className="min-h-dvh bg-background text-foreground">
    <header className="site-header border-b border-border">
      <div className="site-container flex min-h-20 flex-wrap items-center justify-between gap-3 py-4">
        <Link to="/" className="flex items-center gap-2.5 text-2xl font-bold"><AudioLines className="size-7 text-primary" />pebble<span className="text-primary">.</span></Link>
        <nav aria-label="Main navigation" className="flex items-center gap-1 sm:gap-4">
          <Button variant="ghost" asChild><Link to="/downloads" activeProps={{ className: "text-primary" }}>Downloads</Link></Button>
          <Button variant="ghost" asChild><Link to="/updates" activeProps={{ className: "text-primary" }}>Updates</Link></Button>
          <Button variant="outline" asChild className="hidden sm:inline-flex"><Link to="/demo">Try demo <ArrowUpRight /></Link></Button>
        </nav>
      </div>
    </header>
    <main>{children}</main>
    <footer className="border-t border-border py-8"><div className="site-container flex flex-wrap items-center justify-between gap-4 text-xs text-muted-foreground"><span>Pebble. Your music, on your terms.</span><div className="flex gap-5"><Link to="/demo">Live demo</Link><Link to="/updates">Software updates</Link><span>No ads. Just music.</span></div></div></footer>
  </div>;
}