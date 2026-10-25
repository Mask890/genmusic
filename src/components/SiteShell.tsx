import { Link } from "@tanstack/react-router";
import { AudioLines, ArrowUpRight, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ReactNode } from "react";

export function SiteShell({ children }: { children: ReactNode }) {
  return <div className="min-h-dvh bg-background text-foreground">
    <header className="site-header border-b border-border">
      <div className="site-container flex min-h-20 flex-wrap items-center justify-between gap-3 py-4">
        <Link to="/" className="flex items-center gap-2.5 text-2xl font-bold"><AudioLines className="size-7 text-primary" />pebble</Link>
        <nav aria-label="Main navigation" className="flex items-center gap-1 sm:gap-4">
          <Button variant="ghost" asChild><Link to="/donate" activeProps={{ className: "text-primary" }}>Buy Me a Coffee</Link></Button>
          <Button variant="ghost" asChild><Link to="/downloads" activeProps={{ className: "text-primary" }}>Downloads</Link></Button>
          <Button variant="ghost" asChild><Link to="/updates" activeProps={{ className: "text-primary" }}>Updates</Link></Button>
          <Button variant="outline" asChild className="hidden sm:inline-flex"><Link to="/demo">Try demo <ArrowUpRight /></Link></Button>
        </nav>
      </div>
    </header>
    <main>{children}</main>
    <footer className="border-t border-border pt-8">
      <div className="site-container">
        <div className="grid gap-8 pb-8 sm:grid-cols-[1fr_1fr] sm:gap-12">
          <div>
            <Link to="/" className="inline-flex items-center gap-2.5 text-3xl font-bold"><AudioLines className="size-8 text-primary" />pebble</Link>
            <p className="mt-4 text-sm text-muted-foreground">Pebble. Your music, on your terms.</p>
            <p className="mt-2 text-xs text-muted-foreground">No ads. Just music.</p>
          </div>
          <nav aria-label="Footer navigation" className="flex flex-wrap content-start items-start gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <Link to="/donate" className="hover:text-primary">Buy Me a Coffee</Link>
            <Link to="/downloads" className="hover:text-primary">Downloads</Link>
            <Link to="/demo" className="hover:text-primary">Live demo</Link>
            <Link to="/updates" className="hover:text-primary">Software updates</Link>
            <Link to="/support" className="hover:text-primary">Support docs</Link>
          </nav>
        </div>
        <div className="flex items-center justify-between gap-4 pt-2 pb-4">
          <nav aria-label="Legal navigation" className="flex flex-wrap gap-x-5 gap-y-3 text-xs text-muted-foreground">
            <Link to="/legal" className="transition-colors hover:text-primary">Legal</Link>
            <Link to="/legal" hash="terms" className="transition-colors hover:text-primary">Terms &amp; Conditions</Link>
            <Link to="/legal" hash="privacy" className="transition-colors hover:text-primary">Privacy</Link>
            <Link to="/legal" hash="cookies" className="transition-colors hover:text-primary">Cookies</Link>
          </nav>
          <Button variant="outline" size="sm" disabled title="Contact is not available yet" className="shrink-0"><Mail /> Contact</Button>
        </div>
        <p className="pb-6 text-center text-xs text-muted-foreground">© 2026 LoveRiviera LLC. All rights reserved.</p>
      </div>
    </footer>
  </div>;
}