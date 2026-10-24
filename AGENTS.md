<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep the TanStack website separate from the isolated native Vite renderer; native/main.tsx reuses Player directly so downloaded apps need no web server.
- Keep Electron and installer tooling outside the website import graph; desktop-only Node APIs cannot run on the deployed website.
- Downloads and updates share a public GitHub Releases feed, configured by public/release-source.json or VITE_RELEASE_REPOSITORY; never invent links when no release exists.
- Build installers on matching GitHub runners and publish only after all platform jobs succeed; Android signing credentials must stay stable across upgrades.
- Keep legal notices in one /legal content route with section anchors for footer deep links; these anchors navigate within a single unified document rather than replace separate content routes.
