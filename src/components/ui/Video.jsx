import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Play, Pause, VolumeX, Volume2 } from 'lucide-react';

/**
 * Real videos pulled from the store's own Shopify CDN, keyed by what each
 * clip actually shows (verified frame-by-frame, see shots/video-contact-sheet.png).
 *
 * Deliberately NOT used:
 *   video-01 — carries a burned-in "www.mapalustore.com" watermark and
 *              TikTok-style captions; unusable behind headline type.
 *   video-04 — would not decode a frame; content unverified.
 */
export const VIDEOS = {
  /** Lush flowering green wall wrapping a bar — clean, no on-screen text. */
  greenWall: '/assets/videos/video-03-hd-1080p-1cd291b5.mp4',
  /** Restaurant with a planted ceiling and checkerboard floor. */
  ceiling: '/assets/videos/video-07-hd-1080p-423e0238.mp4',
  /** Commercial space fronted by a red rose wall. */
  roseWall: '/assets/videos/video-08-hd-1080p-75973f95.mp4',
  /** Crew mid-install over a pool — literal installation footage. */
  install: '/assets/videos/video-06-hd-1080p-7b59783b.mp4',
  /** Finished synthetic-grass patio with café seating. */
  grass: '/assets/videos/video-05-hd-720p-263e5ec6.mp4',
  /** Rooftop terrace in synthetic grass over the Medellín hills. */
  rooftop: '/assets/videos/video-09-hd-720p-ce2a1cbf.mp4',
  /** Outdoor terrace: jacuzzi, grass floor, bamboo screen. */
  terrace: '/assets/videos/video-02-hd-1080p-fe868737.mp4',
};

export const VIDEO_LIST = Object.values(VIDEOS);

/**
 * Autoplaying background video that only decodes while on screen.
 *
 * Three things make this safe rather than a battery/bandwidth tax:
 *  - IntersectionObserver pauses it the moment it scrolls away
 *  - prefers-reduced-motion falls back to the poster image, no video fetched
 *  - preload="none" until it first enters the viewport
 */
export function BackgroundVideo({
  src,
  poster,
  className = '',
  overlay = 'bg-fade-up',
  opacity = 1,
  playbackRate = 1,
}) {
  const reduce = useReducedMotion();
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || reduce) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting);
        if (entry.isIntersecting) {
          el.play?.().catch(() => {});
        } else {
          el.pause?.();
        }
      },
      { threshold: 0.05 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduce]);

  useEffect(() => {
    if (ref.current && playbackRate !== 1) ref.current.playbackRate = playbackRate;
  }, [playbackRate, ready]);

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      {poster && (
        <img
          src={poster}
          alt=""
          aria-hidden="true"
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
            ready && !reduce ? 'opacity-0' : 'opacity-100'
          } ${reduce ? 'animate-kenburns' : ''}`}
        />
      )}
      {!reduce && (
        <video
          ref={ref}
          src={src}
          poster={poster}
          muted
          loop
          playsInline
          preload="none"
          onCanPlay={() => setReady(true)}
          aria-hidden="true"
          style={{ opacity: ready ? opacity : 0 }}
          className="absolute inset-0 h-full w-full object-cover transition-opacity duration-1000"
        />
      )}
      {overlay && <div className={`absolute inset-0 ${overlay}`} />}
      {/* keeps the observer honest even if the video element is absent */}
      <span ref={reduce ? ref : undefined} className="sr-only">
        {visible ? '' : ''}
      </span>
    </div>
  );
}

/**
 * Foreground video panel with play/mute controls — used for the
 * "Proyectos realizados" showcase where the video IS the content.
 */
export function VideoPanel({ src, poster, className = '', ratio = 'aspect-[4/5]', label }) {
  const reduce = useReducedMotion();
  const ref = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el || reduce) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.play().then(() => setPlaying(true)).catch(() => {});
        } else {
          el.pause();
          setPlaying(false);
        }
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduce]);

  const toggle = () => {
    const el = ref.current;
    if (!el) return;
    if (el.paused) {
      el.play().then(() => setPlaying(true)).catch(() => {});
    } else {
      el.pause();
      setPlaying(false);
    }
  };

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl bg-brand-950 shadow-e5 ${ratio} ${className}`}
    >
      <video
        ref={ref}
        src={src}
        poster={poster}
        muted={muted}
        loop
        playsInline
        preload="metadata"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-brand-950/70 via-transparent to-transparent" />

      {label && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 p-5 sm:p-6">
          <p className="font-display text-lg text-white sm:text-xl">{label}</p>
        </div>
      )}

      <div className="absolute right-4 top-4 flex gap-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100 focus-within:opacity-100">
        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? 'Pausar video' : 'Reproducir video'}
          className="grid h-10 w-10 place-items-center rounded-full glass-dark text-white shadow-e3 transition hover:scale-110"
        >
          {playing ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
        </button>
        <button
          type="button"
          onClick={() => {
            setMuted((m) => !m);
            if (ref.current) ref.current.muted = !muted;
          }}
          aria-label={muted ? 'Activar sonido' : 'Silenciar'}
          className="grid h-10 w-10 place-items-center rounded-full glass-dark text-white shadow-e3 transition hover:scale-110"
        >
          {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>
      </div>
    </div>
  );
}

/** Before/after wipe — mirrors the live site's "Proyectos realizados" pair. */
export function BeforeAfter({ before, after, beforeLabel, afterLabel, className = '' }) {
  const [pos, setPos] = useState(50);
  const ref = useRef(null);
  const dragging = useRef(false);

  const setFromClient = (clientX) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    setPos(Math.min(100, Math.max(0, ((clientX - r.left) / r.width) * 100)));
  };

  useEffect(() => {
    const move = (e) => {
      if (!dragging.current) return;
      setFromClient(e.touches ? e.touches[0].clientX : e.clientX);
    };
    const up = () => (dragging.current = false);
    window.addEventListener('mousemove', move);
    window.addEventListener('touchmove', move, { passive: true });
    window.addEventListener('mouseup', up);
    window.addEventListener('touchend', up);
    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('touchmove', move);
      window.removeEventListener('mouseup', up);
      window.removeEventListener('touchend', up);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`relative select-none overflow-hidden rounded-2xl shadow-e5 ${className}`}
      onMouseDown={(e) => {
        dragging.current = true;
        setFromClient(e.clientX);
      }}
      onTouchStart={(e) => {
        dragging.current = true;
        setFromClient(e.touches[0].clientX);
      }}
    >
      <img src={after} alt={afterLabel} className="block h-full w-full object-cover" />

      {/* "Before" sits at full size on top and is revealed with clip-path, so
          both images stay in the same coordinate space at any container width. */}
      <div
        className="absolute inset-0"
        style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
      >
        <img
          src={before}
          alt={beforeLabel}
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>

      <span
        className="absolute left-4 top-4 rounded-pill glass-dark px-3 py-1 text-2xs uppercase tracking-widest text-white transition-opacity duration-200"
        style={{ opacity: pos > 14 ? 1 : 0 }}
      >
        Antes
      </span>
      <span
        className="absolute right-4 top-4 rounded-pill glass-dark px-3 py-1 text-2xs uppercase tracking-widest text-white transition-opacity duration-200"
        style={{ opacity: pos < 86 ? 1 : 0 }}
      >
        Después
      </span>

      <div
        className="absolute inset-y-0 z-10 w-0.5 bg-white/90 shadow-[0_0_18px_rgba(255,255,255,0.7)]"
        style={{ left: `${pos}%` }}
      >
        <motion.div
          whileHover={{ scale: 1.12 }}
          className="absolute left-1/2 top-1/2 grid h-12 w-12 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize place-items-center rounded-full bg-white shadow-e4"
        >
          <span className="text-brand-700">
            <svg width="18" height="12" viewBox="0 0 18 12" fill="none" aria-hidden="true">
              <path d="M5 1 1 6l4 5M13 1l4 5-4 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </motion.div>
      </div>
    </div>
  );
}
