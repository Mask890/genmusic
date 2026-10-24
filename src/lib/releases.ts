export type Platform = "windows" | "mac" | "android";
export type ReleaseAsset = { name: string; browser_download_url: string; size: number };
export type Release = { tag_name: string; name: string; published_at: string; body: string; html_url: string; assets: ReleaseAsset[]; draft?: boolean; prerelease?: boolean };
export const platforms: { id: Platform; name: string; detail: string; extension: string }[] = [
  { id: "windows", name: "Windows", detail: "Windows 10 or later · 64-bit", extension: ".exe" },
  { id: "mac", name: "macOS", detail: "Apple Silicon & Intel", extension: ".dmg" },
  { id: "android", name: "Android", detail: "Android 7 or later", extension: ".apk" },
];
export function assetFor(release: Release | undefined, platform: Platform) {
  const extension = platforms.find((p) => p.id === platform)?.extension;
  return release?.assets.find((asset) => asset.name.toLowerCase().endsWith(extension ?? "__none__") && /^https:\/\/github\.com\//.test(asset.browser_download_url));
}
export function stableReleases(releases: Release[]) {
  return releases.filter((r) => !r.draft && !r.prerelease).sort((a, b) => Date.parse(b.published_at) - Date.parse(a.published_at));
}