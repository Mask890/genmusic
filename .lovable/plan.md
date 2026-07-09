# Plan: Pebble Feature Documentation

## Goal
Write a single markdown file that describes the Pebble local MP3 player and every feature implemented to date.

## Proposed file
`README.md` in the project root (or `docs/FEATURES.md` if you prefer a dedicated docs folder). I’ll default to `README.md` so it surfaces on the project home page.

## What the doc will cover
Based on the current codebase, the file will include:

1. **Overview** — what Pebble is, target audience, and core value proposition (local, ad-free, visual-first mobile player).
2. **Tech stack** — TanStack Start, React 19, Tailwind CSS v4, Vite, PWA via vite-plugin-pwa, IndexedDB, Web Audio API, Media Session API.
3. **Playback features**
   - Local MP3/audio file import via file picker (multiple files)
   - Persistent library stored in IndexedDB
   - Persistent storage request to resist browser eviction
   - Play / pause, previous / next
   - Seekable progress bar with current/total time
   - Shuffle
   - Repeat modes: off, all, one
   - Auto-advance and repeat-one looping
   - Resume last track index, shuffle, repeat, and visualizer preference across sessions
4. **Library management**
   - Add tracks from device
   - Delete tracks from library and storage
   - Track count summary
   - Parse "Artist - Title" filenames automatically
5. **Visualizers** — seven canvas-based modes driven by the audio analyser:
   - Plasma
   - Tie-Dye
   - Tunnel
   - Bloom
   - Bars
   - Wave
   - Particles
   - Cycle button on the cover art
6. **UI / design**
   - Mobile-first, single-screen layout
   - Ambient background blobs that react to music intensity
   - Glassmorphism controls and library sheet
   - Custom animations (float, blob morph, pulse ring, slide-up)
   - Dark theme with semantic color tokens
7. **Mobile / PWA features**
   - Web App Manifest with standalone display, theme colors, icons, maskable icons
   - Service worker for offline app-shell caching
   - Guarded registration (disabled in dev/preview/iframe)
   - Apple mobile-web-app meta tags and touch icon
   - Media Session API for lock-screen metadata and transport controls
8. **Offline behavior**
   - App shell works offline thanks to the service worker
   - Music files persist in IndexedDB and survive reloads
9. **Security / privacy**
   - No accounts, no uploads to servers, no ads or tracking
   - All audio data stays on the device
10. **Future roadmap** (noted as planned, not implemented)
    - Capacitor native wrapper for App Store / Play Store
    - Background audio and lock-screen media controls on iOS/Android
    - Push notifications

## Format
Clean markdown with a table of contents, feature sections, and a short “Getting Started” note. No emojis, concise, user-readable.

## Deliverable
One new markdown file; no code changes required.

Would you like me to use a different filename or location?