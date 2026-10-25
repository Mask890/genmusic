# Pebble

A cute, ad-free mobile music player for your local MP3s with a live audio visualizer. No accounts, no uploads, no tracking — your music stays on your device.

Built as a Progressive Web App, Pebble can be installed on your home screen and works offline.

☕ Enjoying Pebble? [Buy me a coffee on Ko-fi](https://ko-fi.com/pebble_musicapp) to support development.

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Playback Features](#playback-features)
- [Library Management](#library-management)
- [Visualizers](#visualizers)
- [UI and Design](#ui-and-design)
- [Mobile and PWA Features](#mobile-and-pwa-features)
- [Offline Behavior](#offline-behavior)
- [Privacy](#privacy)
- [Roadmap](#roadmap)
- [Getting Started](#getting-started)

---

## Overview

Pebble is a single-screen music player designed for mobile-first use. You import audio files directly from your device, and they are stored locally in your browser. Playback, library management, and the visualizer all run inside the browser, so the app works without an internet connection after the first visit.

The app is designed to feel like a native music player: big play controls, a persistent library, a now-playing screen with reactive artwork, and lock-screen metadata on supported browsers.

---

## Tech Stack

- **Framework:** TanStack Start with React 19
- **Styling:** Tailwind CSS v4 with custom semantic color tokens
- **Build tool:** Vite 8
- **Offline support:** `vite-plugin-pwa` with Workbox
- **Local storage:** IndexedDB for audio blobs and metadata
- **Audio processing:** Web Audio API `AnalyserNode`
- **Lock-screen integration:** Media Session API
- **Fonts:** Inter, JetBrains Mono

---

## Playback Features

- **Import local audio files** through a file picker. MP3s and other audio files are supported, and you can import multiple tracks at once.
- **Persistent library** stored in IndexedDB. Tracks survive page reloads and browser restarts.
- **Play, pause, skip forward, skip back** with large touch-friendly controls.
- **Seekable progress bar** showing current time and total duration.
- **Shuffle mode** plays tracks in random order.
- **Repeat modes:** off, repeat all, repeat one.
- **Auto-advance** to the next track when a song ends.
- **Session restore** remembers the last selected track, shuffle state, repeat state, and visualizer choice across visits.

---

## Library Management

- **Add tracks** at any time by tapping the plus button.
- **View your library** by opening the sheet at the bottom of the screen.
- **Switch tracks** by selecting a song from the library.
- **Delete tracks** from both the library and local storage.
- **Automatic metadata parsing:** filenames in the format `Artist - Title` are split into artist and title automatically.
- **Track count summary** is shown on the library peek bar.

---

## Visualizers

The now-playing artwork is a live canvas visualizer driven by the audio frequency data. Tap the visualizer label to cycle through the available styles.

Available modes:

- **Plasma** — radial spokes and a waveform ring
- **Tie-Dye** — flowing radial threads that smear into kaleidoscopic patterns
- **Tunnel** — concentric warping rings
- **Bloom** — expanding kaleidoscopic petals with a bright core
- **Bars** — classic mirrored spectrum bars
- **Wave** — layered oscilloscope waves with a color-pulse background
- **Particles** — beat-triggered particle bursts from the center

The active visualizer is saved and restored across sessions.

---

## UI and Design

- **Mobile-first layout** optimized for phones and small screens.
- **Dark theme** with a deep purple background, pink primary accents, and teal secondary accents.
- **Glassmorphism** controls and library sheet with backdrop blur.
- **Ambient background blobs** that pulse and change intensity based on the music.
- **Custom animations:** floating cover art, morphing blobs, pulsing rings, and slide-up transitions.
- **Semantic color tokens** defined in CSS so the theme stays consistent and supports future theming.

---

## Mobile and PWA Features

Pebble is built to behave like a native app when installed from the browser.

- **Web App Manifest** with app name, short name, description, theme colors, standalone display mode, and portrait orientation.
- **App icons** in standard and maskable formats for Android, plus Apple touch icons.
- **Service worker** precaches the app shell and assets for offline use.
- **Guarded service worker registration** so the worker only activates in production and never interferes with development or preview environments.
- **Apple mobile web app metadata** enables full-screen mode when added to the home screen on iOS.
- **Media Session API** displays the current track title, artist, and artwork on the lock screen and in system media controls. It also supports play, pause, next, previous, and seek actions where the browser allows it.

---

## Offline Behavior

After the first visit, Pebble works offline:

- The app shell, styles, scripts, and icons are cached by the service worker.
- Imported music files are stored in IndexedDB and remain available without a network connection.
- The browser is asked to mark the origin’s storage as persistent, which reduces the chance of files being evicted under storage pressure.

---

## Privacy

- No user accounts.
- No audio files or metadata are uploaded to any server.
- No ads, analytics, or tracking.
- All data stays in your browser’s local storage.

---

## Roadmap

These features are planned for future releases but are not yet implemented:

- Native app wrapper with Capacitor for iOS and Android distribution.
- True background audio and lock-screen controls on mobile operating systems.
- Push notifications for new releases or playlist reminders.

---

## Getting Started

1. Open Pebble in a modern mobile browser.
2. Tap the plus button and select MP3 or audio files from your device.
3. Tap a track to play it.
4. Tap the visualizer label to switch visual styles.
5. Add Pebble to your home screen for a full-screen, offline-capable app experience.
