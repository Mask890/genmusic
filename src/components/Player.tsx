import { useEffect, useMemo, useRef, useState } from "react";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Repeat1,
  Plus,
  Music2,
  X,
  ListMusic,
} from "lucide-react";

type RepeatMode = "off" | "all" | "one";

type Track = {
  id: string;
  file: File;
  url: string;
  title: string;
  artist: string;
};

function fmt(t: number) {
  if (!isFinite(t) || t < 0) t = 0;
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60);
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

function parseName(file: File): { title: string; artist: string } {
  const raw = file.name.replace(/\.[^.]+$/, "");
  const parts = raw.split(" - ");
  if (parts.length >= 2) {
    return { artist: parts[0].trim(), title: parts.slice(1).join(" - ").trim() };
  }
  return { title: raw, artist: "Unknown artist" };
}

export function Player() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [current, setCurrent] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState<RepeatMode>("off");
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [levels, setLevels] = useState<number[]>(() => Array(24).fill(0));

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const rafRef = useRef<number | null>(null);

  const track = tracks[current];

  // Cleanup URLs on unmount
  useEffect(() => {
    return () => {
      tracks.forEach((t) => URL.revokeObjectURL(t.url));
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Setup analyser once we have an audio element and user interacts (play)
  const ensureAnalyser = () => {
    if (!audioRef.current) return;
    if (!audioCtxRef.current) {
      const Ctx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new Ctx();
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 1024;
      analyser.smoothingTimeConstant = 0.82;
      const src = ctx.createMediaElementSource(audioRef.current);
      src.connect(analyser);
      analyser.connect(ctx.destination);
      audioCtxRef.current = ctx;
      analyserRef.current = analyser;
      sourceRef.current = src;
    }
    audioCtxRef.current?.resume();
  };

  const tick = () => {
    const analyser = analyserRef.current;
    if (analyser) {
      const data = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteFrequencyData(data);
      const buckets = 24;
      const out: number[] = [];
      const step = Math.floor(data.length / buckets);
      for (let i = 0; i < buckets; i++) {
        let sum = 0;
        for (let j = 0; j < step; j++) sum += data[i * step + j];
        out.push(sum / step / 255);
      }
      setLevels(out);
    }
    rafRef.current = requestAnimationFrame(tick);
  };

  useEffect(() => {
    if (playing) {
      rafRef.current = requestAnimationFrame(tick);
    } else if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing]);

  const handleFiles = (fl: FileList | null) => {
    if (!fl) return;
    const newTracks: Track[] = [];
    Array.from(fl).forEach((f) => {
      if (!f.type.startsWith("audio")) return;
      const { title, artist } = parseName(f);
      newTracks.push({
        id: `${f.name}-${f.size}-${Math.random().toString(36).slice(2, 7)}`,
        file: f,
        url: URL.createObjectURL(f),
        title,
        artist,
      });
    });
    if (!newTracks.length) return;
    setTracks((prev) => {
      const next = [...prev, ...newTracks];
      if (prev.length === 0) setCurrent(0);
      return next;
    });
  };

  const togglePlay = async () => {
    if (!track || !audioRef.current) return;
    ensureAnalyser();
    if (audioRef.current.paused) {
      await audioRef.current.play();
      setPlaying(true);
    } else {
      audioRef.current.pause();
      setPlaying(false);
    }
  };

  const nextTrack = () => {
    if (!tracks.length) return;
    setCurrent((c) => {
      if (shuffle) {
        if (tracks.length === 1) return 0;
        let n = c;
        while (n === c) n = Math.floor(Math.random() * tracks.length);
        return n;
      }
      return (c + 1) % tracks.length;
    });
  };
  const prevTrack = () => {
    if (!tracks.length) return;
    if (audioRef.current && audioRef.current.currentTime > 3) {
      audioRef.current.currentTime = 0;
      return;
    }
    setCurrent((c) => (c - 1 + tracks.length) % tracks.length);
  };

  // when track changes, autoplay if we were playing
  useEffect(() => {
    if (!audioRef.current || !track) return;
    audioRef.current.src = track.url;
    audioRef.current.load();
    if (playing) {
      ensureAnalyser();
      audioRef.current.play().catch(() => setPlaying(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [track?.id]);

  const seek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioRef.current) return;
    const v = parseFloat(e.target.value);
    audioRef.current.currentTime = (v / 100) * duration;
    setProgress(v);
  };

  const removeTrack = (id: string) => {
    setTracks((prev) => {
      const idx = prev.findIndex((t) => t.id === id);
      if (idx === -1) return prev;
      URL.revokeObjectURL(prev[idx].url);
      const next = prev.filter((t) => t.id !== id);
      if (idx === current) {
        setPlaying(false);
        setCurrent(0);
      } else if (idx < current) {
        setCurrent((c) => c - 1);
      }
      return next;
    });
  };

  // reactive intensity for blob glow
  const intensity = useMemo(() => {
    if (!levels.length) return 0;
    const avg = levels.reduce((a, b) => a + b, 0) / levels.length;
    return avg;
  }, [levels]);

  return (
    <div className="relative mx-auto flex min-h-dvh w-full max-w-md flex-col overflow-hidden bg-background text-foreground">
      <audio
        ref={audioRef}
        onTimeUpdate={(e) => {
          const el = e.currentTarget;
          setDuration(el.duration || 0);
          setProgress(el.duration ? (el.currentTime / el.duration) * 100 : 0);
        }}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration || 0)}
        onEnded={() => {
          if (repeat === "one" && audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play();
          } else if (repeat === "off" && current === tracks.length - 1) {
            setPlaying(false);
          } else {
            nextTrack();
          }
        }}
      />

      {/* Ambient background orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="animate-blob absolute left-1/2 top-1/3 h-72 w-72 -translate-x-1/2 -translate-y-1/2 bg-primary/30 blur-3xl transition-opacity duration-300"
          style={{ opacity: 0.35 + intensity * 0.5 }}
        />
        <div
          className="animate-blob-slow absolute left-1/2 top-1/3 h-80 w-80 -translate-x-1/2 -translate-y-1/2 bg-accent/25 blur-3xl transition-opacity duration-300"
          style={{ opacity: 0.25 + intensity * 0.4 }}
        />
      </div>

      {/* Top nav */}
      <nav className="relative z-20 flex items-center justify-between px-6 pt-6 pb-2">
        <button
          onClick={() => fileInputRef.current?.click()}
          aria-label="Add music"
          className="glass flex size-10 items-center justify-center rounded-full transition hover:bg-white/10"
        >
          <Plus className="size-4" />
        </button>
        <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          Now Playing
        </span>
        <button
          onClick={() => setLibraryOpen(true)}
          aria-label="Open library"
          className="glass flex size-10 items-center justify-center rounded-full transition hover:bg-white/10"
        >
          <ListMusic className="size-4" />
        </button>
      </nav>

      <input
        ref={fileInputRef}
        type="file"
        accept="audio/*,.mp3"
        multiple
        className="hidden"
        onChange={(e) => {
          handleFiles(e.target.files);
          e.target.value = "";
        }}
      />

      {/* Hero */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-8">
        <div className="animate-float relative">
          <div className="animate-pulse-ring absolute -inset-4 rounded-[60px] bg-primary/20 blur-xl" />
          <div className="relative grid size-56 place-items-center overflow-hidden rounded-[48px] bg-surface shadow-2xl ring-1 ring-white/10">
            {/* Live visualizer canvas replaces the placeholder art */}
            <Visualizer analyserRef={analyserRef} playing={playing} />
            {!track && (
              <div className="absolute inset-0 grid place-items-center text-center">
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <Music2 className="size-7 opacity-60" />
                  <span className="font-mono text-[10px] uppercase tracking-widest">
                    No track loaded
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="animate-slide-up mt-10 max-w-full text-center [animation-delay:120ms]">
          <h1 className="truncate text-balance text-2xl font-bold tracking-tight">
            {track?.title ?? "Add your music"}
          </h1>
          <p className="mt-1 font-mono text-xs uppercase tracking-widest text-primary">
            {track?.artist ?? "Tap + to load MP3s"}
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="animate-slide-up relative z-20 space-y-6 px-8 pb-28 [animation-delay:240ms]">
        <div className="space-y-2">
          <div className="relative">
            <input
              type="range"
              min={0}
              max={100}
              step={0.1}
              value={progress}
              onChange={seek}
              disabled={!track}
              aria-label="Seek"
              className="track-slider h-1.5 w-full cursor-pointer appearance-none rounded-full bg-white/10 disabled:cursor-not-allowed"
              style={{
                background: `linear-gradient(to right, var(--primary) 0%, var(--accent) ${progress}%, rgba(255,255,255,0.08) ${progress}%)`,
              }}
            />
          </div>
          <div className="flex justify-between font-mono text-[10px] tabular-nums tracking-tighter text-muted-foreground">
            <span>{fmt(duration * (progress / 100))}</span>
            <span>{fmt(duration)}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <button
            onClick={() => setShuffle((s) => !s)}
            aria-label="Shuffle"
            className={`grid size-9 place-items-center rounded-full transition ${
              shuffle ? "text-primary" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Shuffle className="size-4" />
          </button>
          <div className="flex items-center gap-6">
            <button
              onClick={prevTrack}
              disabled={!tracks.length}
              aria-label="Previous"
              className="grid size-10 place-items-center text-foreground/90 transition hover:text-foreground disabled:opacity-30"
            >
              <SkipBack className="size-5 fill-current" />
            </button>
            <button
              onClick={togglePlay}
              disabled={!track}
              aria-label={playing ? "Pause" : "Play"}
              className="grid size-16 place-items-center rounded-full bg-foreground text-background shadow-lg shadow-primary/30 transition active:scale-95 hover:scale-105 disabled:opacity-40"
            >
              {playing ? (
                <Pause className="size-6 fill-current" />
              ) : (
                <Play className="size-6 translate-x-0.5 fill-current" />
              )}
            </button>
            <button
              onClick={nextTrack}
              disabled={!tracks.length}
              aria-label="Next"
              className="grid size-10 place-items-center text-foreground/90 transition hover:text-foreground disabled:opacity-30"
            >
              <SkipForward className="size-5 fill-current" />
            </button>
          </div>
          <button
            onClick={() =>
              setRepeat((r) => (r === "off" ? "all" : r === "all" ? "one" : "off"))
            }
            aria-label={`Repeat: ${repeat}`}
            title={`Repeat: ${repeat}`}
            className={`grid size-9 place-items-center rounded-full transition ${
              repeat !== "off" ? "text-accent" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {repeat === "one" ? <Repeat1 className="size-4" /> : <Repeat className="size-4" />}
          </button>
        </div>
      </div>

      {/* Library sheet peek */}
      <button
        onClick={() => setLibraryOpen(true)}
        className="glass absolute inset-x-0 bottom-0 z-30 flex items-center justify-between rounded-t-[32px] px-6 py-4 text-left transition hover:pb-5"
      >
        <div className="flex min-w-0 items-center gap-3">
          <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-white/5">
            <Music2 className="size-4 text-muted-foreground" />
          </div>
          <div className="min-w-0">
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Library
            </p>
            <p className="truncate text-xs font-bold">
              {tracks.length
                ? `${tracks.length} track${tracks.length === 1 ? "" : "s"}`
                : "Empty — add MP3s"}
            </p>
          </div>
        </div>
        <div className="flex items-end gap-1">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-1 rounded-full bg-primary transition-all duration-150"
              style={{
                height: `${8 + (levels[i * 4] ?? 0) * 20}px`,
                background: i % 2 ? "var(--accent)" : "var(--primary)",
              }}
            />
          ))}
        </div>
      </button>

      {/* Library sheet */}
      {libraryOpen && (
        <LibrarySheet
          tracks={tracks}
          current={current}
          onClose={() => setLibraryOpen(false)}
          onPick={(i) => {
            setCurrent(i);
            setPlaying(true);
            setLibraryOpen(false);
            setTimeout(() => {
              ensureAnalyser();
              audioRef.current?.play().catch(() => setPlaying(false));
            }, 0);
          }}
          onAdd={() => fileInputRef.current?.click()}
          onRemove={removeTrack}
        />
      )}

      {/* Vignette */}
      <div className="pointer-events-none absolute inset-0 z-40 rounded-[40px] ring-1 ring-inset ring-white/5" />
    </div>
  );
}

function Visualizer({
  analyserRef,
  playing,
}: {
  analyserRef: React.RefObject<AnalyserNode | null>;
  playing: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const phaseRef = useRef(0);
  const smoothRef = useRef<Float32Array | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    let freq: Uint8Array<ArrayBuffer> | null = null;
    let time: Uint8Array<ArrayBuffer> | null = null;

    const draw = () => {
      rafRef.current = requestAnimationFrame(draw);
      const analyser = analyserRef.current;
      const w = canvas.width;
      const h = canvas.height;

      // trailing fade for tie-dye smear
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = "rgba(10, 8, 20, 0.18)";
      ctx.fillRect(0, 0, w, h);

      if (!analyser) return;
      if (!freq || freq.length !== analyser.frequencyBinCount) {
        freq = new Uint8Array(analyser.frequencyBinCount);
        time = new Uint8Array(analyser.fftSize);
        smoothRef.current = new Float32Array(analyser.frequencyBinCount);
      }
      analyser.getByteFrequencyData(freq);
      analyser.getByteTimeDomainData(time!);

      // energy metrics
      let bass = 0;
      const bassEnd = Math.floor(freq.length * 0.12);
      for (let i = 0; i < bassEnd; i++) bass += freq[i];
      bass = bass / bassEnd / 255;

      let mid = 0;
      for (let i = bassEnd; i < freq.length * 0.5; i++) mid += freq[i];
      mid = mid / (freq.length * 0.5 - bassEnd) / 255;

      phaseRef.current += 0.006 + bass * 0.04;
      const phase = phaseRef.current;

      const cx = w / 2;
      const cy = h / 2;
      const baseR = Math.min(w, h) * 0.18;

      // additive plasma blobs (tie-dye)
      ctx.globalCompositeOperation = "lighter";
      const colors = [
        [255, 90, 200], // pink
        [120, 200, 255], // cyan
        [180, 130, 255], // violet
        [255, 180, 120], // amber
      ];
      for (let i = 0; i < 4; i++) {
        const a = phase * (0.6 + i * 0.15) + (i * Math.PI) / 2;
        const r = baseR * (1.1 + Math.sin(phase * 1.3 + i) * 0.35) + bass * baseR * 1.8;
        const x = cx + Math.cos(a) * baseR * (0.5 + mid * 0.9);
        const y = cy + Math.sin(a * 1.1) * baseR * (0.5 + mid * 0.9);
        const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
        const [cr, cg, cb] = colors[i];
        grad.addColorStop(0, `rgba(${cr},${cg},${cb},${0.55 + bass * 0.4})`);
        grad.addColorStop(1, `rgba(${cr},${cg},${cb},0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }

      // radial frequency spokes — WMP-flavored
      const spokes = 64;
      const smooth = smoothRef.current!;
      ctx.lineCap = "round";
      for (let i = 0; i < spokes; i++) {
        const bin = Math.floor((i / spokes) * freq.length * 0.7);
        const target = freq[bin] / 255;
        smooth[bin] = smooth[bin] * 0.7 + target * 0.3;
        const v = smooth[bin];
        const angle = (i / spokes) * Math.PI * 2 + phase * 0.3;
        const inner = baseR * 0.55;
        const outer = inner + v * baseR * 1.6 + 4;
        const hue = (i / spokes) * 320 + phase * 40;
        ctx.strokeStyle = `hsla(${hue}, 95%, ${55 + v * 25}%, ${0.35 + v * 0.6})`;
        ctx.lineWidth = 2 * dpr + v * 3 * dpr;
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(angle) * inner, cy + Math.sin(angle) * inner);
        ctx.lineTo(cx + Math.cos(angle) * outer, cy + Math.sin(angle) * outer);
        ctx.stroke();
      }

      // waveform ring
      ctx.globalCompositeOperation = "screen";
      ctx.beginPath();
      const t = time!;
      const ringR = baseR * 0.5 + bass * baseR * 0.3;
      for (let i = 0; i < t.length; i++) {
        const p = i / t.length;
        const amp = (t[i] - 128) / 128;
        const a = p * Math.PI * 2;
        const rr = ringR + amp * baseR * 0.35;
        const x = cx + Math.cos(a) * rr;
        const y = cy + Math.sin(a) * rr;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.strokeStyle = `hsla(${(phase * 60) % 360}, 100%, 80%, 0.85)`;
      ctx.lineWidth = 1.5 * dpr;
      ctx.stroke();
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      ro.disconnect();
    };
  }, [analyserRef, playing]);

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />;
}


function LibrarySheet({
  tracks,
  current,
  onClose,
  onPick,
  onAdd,
  onRemove,
}: {
  tracks: Track[];
  current: number;
  onClose: () => void;
  onPick: (i: number) => void;
  onAdd: () => void;
  onRemove: (id: string) => void;
}) {
  return (
    <div className="absolute inset-0 z-50 flex items-end bg-background/60 backdrop-blur-sm">
      <div className="animate-slide-up glass flex max-h-[85%] w-full flex-col rounded-t-[32px] p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold tracking-tight">Library</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={onAdd}
              className="flex items-center gap-1.5 rounded-full bg-primary py-1.5 pl-2 pr-3 text-primary-foreground transition hover:opacity-90"
            >
              <Plus className="size-3.5" />
              <span className="text-[11px] font-semibold uppercase tracking-wider">Add</span>
            </button>
            <button
              onClick={onClose}
              aria-label="Close"
              className="grid size-8 place-items-center rounded-full bg-white/5 text-muted-foreground hover:text-foreground"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>

        <div className="flex-1 space-y-2 overflow-y-auto pr-1">
          {tracks.length === 0 && (
            <div className="grid place-items-center rounded-2xl border border-dashed border-white/10 py-12 text-center">
              <Music2 className="size-6 text-muted-foreground" />
              <p className="mt-3 text-sm text-muted-foreground">No music yet.</p>
              <button
                onClick={onAdd}
                className="mt-4 rounded-full bg-white/5 px-4 py-2 text-xs font-medium hover:bg-white/10"
              >
                Load MP3s from your device
              </button>
            </div>
          )}
          {tracks.map((t, i) => {
            const active = i === current;
            return (
              <div
                key={t.id}
                className={`group flex items-center gap-3 rounded-2xl p-2 pr-3 transition ${
                  active ? "bg-primary/15 ring-1 ring-primary/40" : "hover:bg-white/5"
                }`}
              >
                <button
                  onClick={() => onPick(i)}
                  className="flex min-w-0 flex-1 items-center gap-3 text-left"
                >
                  <div
                    className={`grid size-10 shrink-0 place-items-center rounded-xl ${
                      active ? "bg-primary/25 text-primary" : "bg-white/5 text-muted-foreground"
                    }`}
                  >
                    {active ? <Pause className="size-4" /> : <Play className="size-4" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{t.title}</p>
                    <p className="truncate text-[11px] text-muted-foreground">{t.artist}</p>
                  </div>
                </button>
                <button
                  onClick={() => onRemove(t.id)}
                  aria-label="Remove"
                  className="grid size-7 place-items-center rounded-full text-muted-foreground opacity-0 transition hover:text-destructive group-hover:opacity-100"
                >
                  <X className="size-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
