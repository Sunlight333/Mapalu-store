import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Magnetic } from './motion';

const base =
  'relative inline-flex items-center justify-center gap-2 font-medium tracking-wide ' +
  'transition-all duration-300 ease-grow disabled:opacity-45 disabled:pointer-events-none ' +
  'rounded-pill whitespace-nowrap';

const sizes = {
  sm: 'h-10 px-5 text-sm',
  md: 'h-12 px-7 text-sm',
  lg: 'h-14 px-9 text-base',
};

const variants = {
  // Primary: the brand green as a lit surface — inner highlight + colored glow
  primary:
    'bg-brand-500 text-white shadow-glow hover:bg-brand-600 hover:shadow-glow-lg ' +
    'hover:-translate-y-0.5 active:translate-y-0 shadow-inset-dark',
  dark:
    'bg-ink text-white shadow-e4 hover:bg-brand-800 hover:shadow-e5 hover:-translate-y-0.5 active:translate-y-0',
  sand:
    'bg-sand-400 text-ink shadow-sand hover:bg-sand-500 hover:text-white hover:-translate-y-0.5 active:translate-y-0',
  outline:
    'border border-brand-700/25 text-brand-800 bg-white/60 hover:bg-white hover:border-brand-500/50 ' +
    'hover:shadow-e3 hover:-translate-y-0.5 active:translate-y-0',
  ghost: 'text-ink hover:bg-ink/5',
  glass:
    'glass-dark text-white hover:bg-white/15 hover:-translate-y-0.5 shadow-e3 active:translate-y-0',
  white:
    'bg-white text-ink shadow-e4 hover:shadow-e5 hover:-translate-y-0.5 active:translate-y-0',
};

export function Button({
  as,
  to,
  href,
  variant = 'primary',
  size = 'md',
  className = '',
  magnetic = false,
  children,
  ...rest
}) {
  const cls = `${base} ${sizes[size]} ${variants[variant]} ${className}`;

  let el;
  if (to) {
    el = (
      <Link to={to} className={cls} {...rest}>
        {children}
      </Link>
    );
  } else if (href) {
    el = (
      <a href={href} className={cls} {...rest}>
        {children}
      </a>
    );
  } else {
    const Comp = as || 'button';
    el = (
      <Comp className={cls} {...rest}>
        {children}
      </Comp>
    );
  }

  return magnetic ? <Magnetic>{el}</Magnetic> : el;
}

/** Small circular icon button used in headers, galleries and cards. */
export function IconButton({ label, className = '', variant = 'plain', ...rest }) {
  const styles = {
    plain: 'text-ink hover:bg-ink/5',
    glass: 'glass-dark text-white hover:bg-white/20',
    white: 'bg-white text-ink shadow-e3 hover:shadow-e4',
  };
  return (
    <motion.button
      type="button"
      aria-label={label}
      whileTap={{ scale: 0.92 }}
      className={`relative grid h-11 w-11 place-items-center rounded-full transition-all duration-300 ${styles[variant]} ${className}`}
      {...rest}
    />
  );
}

/**
 * Section eyebrow + heading pair, used across every page.
 *
 * Left-aligned sections centre themselves on phones — at that width a ragged
 * left column reads as unbalanced against the full-bleed cards below it.
 */
export function SectionHead({ eyebrow, title, sub, align = 'left', tone = 'dark', className = '' }) {
  const light = tone === 'light';
  const centred = align === 'center';
  return (
    <div
      className={`${
        centred ? 'mx-auto max-w-2xl text-center' : 'mx-auto max-w-2xl text-center sm:mx-0 sm:text-left'
      } ${className}`}
    >
      {eyebrow && (
        <span
          className={`eyebrow mb-3 inline-flex items-center gap-2 ${
            light ? 'text-brand-200' : 'text-brand-500'
          }`}
        >
          <span className={`h-px w-6 ${light ? 'bg-brand-300/60' : 'bg-brand-400/60'}`} />
          {eyebrow}
        </span>
      )}
      <h2
        className={`text-balance text-3xl sm:text-4xl lg:text-5xl ${
          light ? 'text-white' : 'text-ink'
        }`}
      >
        {title}
      </h2>
      {sub && (
        <p
          className={`text-pretty mx-auto mt-4 max-w-xl text-base leading-relaxed sm:mx-0 ${
            light ? 'text-brand-100/75' : 'text-ink-muted'
          }`}
        >
          {sub}
        </p>
      )}
    </div>
  );
}
