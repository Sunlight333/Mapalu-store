import { motion, useReducedMotion } from 'framer-motion';
import { useRef, useState, useCallback } from 'react';

/* ------------------------------------------------------------------ *
 * Shared easing — "grow": fast out of the gate, long settle.
 * Every transition in the app uses this so motion feels like one system.
 * ------------------------------------------------------------------ */
export const EASE = [0.22, 1, 0.36, 1];

/** Scroll-triggered reveal. Drifts upward like foliage unfolding. */
export function Reveal({
  children,
  delay = 0,
  y = 28,
  duration = 0.7,
  className = '',
  once = true,
  as = 'div',
}) {
  const reduce = useReducedMotion();
  const Comp = motion[as] || motion.div;
  return (
    <Comp
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={reduce ? {} : { opacity: 1, y: 0 }}
      viewport={{ once, margin: '-60px' }}
      transition={{ duration, delay, ease: EASE }}
    >
      {children}
    </Comp>
  );
}

/** Parent that staggers its Reveal-like children. */
export function Stagger({ children, className = '', delay = 0, gap = 0.08, once = true }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once, margin: '-60px' }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: reduce ? 0 : gap, delayChildren: delay } },
      }}
    >
      {children}
    </motion.div>
  );
}

export const staggerItem = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: EASE } },
};

export function StaggerItem({ children, className = '', ...rest }) {
  return (
    <motion.div className={className} variants={staggerItem} {...rest}>
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ *
 * Tilt3D — pointer-tracked 3D card.
 * Rotates on X/Y around the pointer and lifts on Z, with the shadow
 * growing in step so the depth reads as real light, not a gimmick.
 * Disabled entirely for touch and for prefers-reduced-motion.
 * ------------------------------------------------------------------ */
export function Tilt3D({
  children,
  className = '',
  max = 9,
  scale = 1.02,
  lift = 24,
  glare = true,
}) {
  const reduce = useReducedMotion();
  const ref = useRef(null);
  const [t, setT] = useState({ rx: 0, ry: 0, gx: 50, gy: 50, active: false });

  const onMove = useCallback(
    (e) => {
      if (reduce || !ref.current) return;
      // Pointer-driven only: coarse pointers (touch) get the static card.
      if (window.matchMedia('(pointer: coarse)').matches) return;
      const r = ref.current.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      setT({
        rx: (0.5 - py) * max * 2,
        ry: (px - 0.5) * max * 2,
        gx: px * 100,
        gy: py * 100,
        active: true,
      });
    },
    [max, reduce],
  );

  const onLeave = useCallback(() => setT((s) => ({ ...s, rx: 0, ry: 0, active: false })), []);

  return (
    <div ref={ref} className={`scene ${className}`} onMouseMove={onMove} onMouseLeave={onLeave}>
      <motion.div
        className="preserve-3d relative h-full w-full"
        animate={{
          rotateX: t.rx,
          rotateY: t.ry,
          scale: t.active ? scale : 1,
          z: t.active ? lift : 0,
        }}
        transition={{ type: 'spring', stiffness: 260, damping: 26, mass: 0.6 }}
      >
        {children}
        {glare && !reduce && (
          <div
            className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300"
            style={{
              opacity: t.active ? 0.5 : 0,
              background: `radial-gradient(520px circle at ${t.gx}% ${t.gy}%, rgba(255,255,255,0.34), transparent 42%)`,
            }}
          />
        )}
      </motion.div>
    </div>
  );
}

/** Magnetic button wrapper — the CTA leans toward the cursor. */
export function Magnetic({ children, strength = 0.28, className = '' }) {
  const reduce = useReducedMotion();
  const ref = useRef(null);
  const [d, setD] = useState({ x: 0, y: 0 });

  const onMove = (e) => {
    if (reduce || !ref.current) return;
    if (window.matchMedia('(pointer: coarse)').matches) return;
    const r = ref.current.getBoundingClientRect();
    setD({
      x: (e.clientX - (r.left + r.width / 2)) * strength,
      y: (e.clientY - (r.top + r.height / 2)) * strength,
    });
  };

  return (
    <motion.div
      ref={ref}
      className={`inline-block ${className}`}
      onMouseMove={onMove}
      onMouseLeave={() => setD({ x: 0, y: 0 })}
      animate={d}
      transition={{ type: 'spring', stiffness: 240, damping: 18, mass: 0.5 }}
    >
      {children}
    </motion.div>
  );
}

/** Word-by-word headline reveal. */
export function SplitWords({ text, className = '', delay = 0, wordClass = '' }) {
  const reduce = useReducedMotion();
  const words = String(text).split(' ');
  if (reduce) return <span className={className}>{text}</span>;
  return (
    <span className={className}>
      {words.map((w, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom">
          <motion.span
            className={`inline-block ${wordClass}`}
            initial={{ y: '110%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.85, delay: delay + i * 0.06, ease: EASE }}
          >
            {w}
            {i < words.length - 1 ? ' ' : ''}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

/** Spring-animated number, used for estimator totals. */
export function CountUp({ value, format = (v) => Math.round(v), className = '' }) {
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(value);
  const raf = useRef();
  const from = useRef(value);

  if (reduce) return <span className={className}>{format(value)}</span>;

  // Animate whenever the target changes.
  if (from.current !== value && !raf.current) {
    const start = performance.now();
    const a = display;
    const b = value;
    const tick = (now) => {
      const p = Math.min(1, (now - start) / 520);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(a + (b - a) * eased);
      if (p < 1) {
        raf.current = requestAnimationFrame(tick);
      } else {
        raf.current = null;
        from.current = b;
      }
    };
    raf.current = requestAnimationFrame(tick);
  }

  return <span className={className}>{format(display)}</span>;
}
