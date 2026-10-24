import { useEffect, useState } from "react";
import { stableReleases, type Release } from "@/lib/releases";

export function useReleases() {
  const [releases, setReleases] = useState<Release[]>([]);
  const [status, setStatus] = useState<"loading" | "unconfigured" | "ready" | "error">("loading");
  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      try {
        const configResponse = await fetch("/release-source.json", { signal: controller.signal });
        if (!configResponse.ok) throw new Error("Release configuration unavailable");
        const config = await configResponse.json() as { repository?: string };
        const repository = import.meta.env.VITE_RELEASE_REPOSITORY || config.repository;
        if (!repository || !/^[\w.-]+\/[\w.-]+$/.test(repository)) { setStatus("unconfigured"); return; }
        const response = await fetch(`https://api.github.com/repos/${repository}/releases?per_page=20`, { signal: controller.signal, headers: { Accept: "application/vnd.github+json" } });
        if (!response.ok) throw new Error("Release feed unavailable");
        const data = await response.json();
        if (!Array.isArray(data)) throw new Error("Invalid release feed");
        setReleases(stableReleases(data));
        setStatus("ready");
      } catch { if (!controller.signal.aborted) setStatus("error"); }
    }
    void load();
    return () => controller.abort();
  }, []);
  return { releases, latest: releases[0], status };
}