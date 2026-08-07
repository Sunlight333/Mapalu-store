import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Clock, Phone, Mail, MapPin, Send, ArrowUpRight, Check } from 'lucide-react';
import { Reveal } from '../ui/motion';
import { navCategories } from '../../lib/catalog';
import { WHATSAPP } from '../../lib/estimator';

const STORE = {
  hours: 'Lunes a Sábado de 8:30am a 6:30pm',
  phones: ['3045512521', '3234021053', '3006400926'],
  email: 'Ferreventas20@gmail.com',
  address: 'CC Platino Local 76-95 · Centro de la Moda, Itagüí',
};

/* Brand marks — lucide dropped these, so they're inline. */
const Svg = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="17" height="17" aria-hidden="true" {...props} />
);

const Facebook = (p) => (
  <Svg {...p}>
    <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.9h2.54V9.85c0-2.52 1.5-3.91 3.77-3.91 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.78-1.63 1.57v1.89h2.78l-.45 2.9h-2.33V22c4.78-.76 8.44-4.92 8.44-9.94z" />
  </Svg>
);

const Instagram = (p) => (
  <Svg {...p}>
    <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.8 3.8 0 0 1-1.38-.9 3.8 3.8 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16zm0 5.68a4.16 4.16 0 1 0 0 8.32 4.16 4.16 0 0 0 0-8.32zm0 6.86a2.7 2.7 0 1 1 0-5.4 2.7 2.7 0 0 1 0 5.4zm5.3-7.02a.97.97 0 1 1-1.94 0 .97.97 0 0 1 1.94 0z" />
  </Svg>
);

const Youtube = (p) => (
  <Svg {...p}>
    <path d="M23.5 6.5a3 3 0 0 0-2.12-2.12C19.5 3.87 12 3.87 12 3.87s-7.5 0-9.38.51A3 3 0 0 0 .5 6.5C0 8.38 0 12 0 12s0 3.62.5 5.5a3 3 0 0 0 2.12 2.12c1.88.51 9.38.51 9.38.51s7.5 0 9.38-.51a3 3 0 0 0 2.12-2.12C24 15.62 24 12 24 12s0-3.62-.5-5.5zM9.6 15.6V8.4l6.2 3.6-6.2 3.6z" />
  </Svg>
);

const TikTok = (p) => (
  <Svg {...p}>
    <path d="M16.6 5.82A4.28 4.28 0 0 1 15.54 3h-3.09v12.4a2.59 2.59 0 0 1-2.59 2.5 2.59 2.59 0 1 1 .76-5.06V9.7a5.68 5.68 0 0 0-.76-.05A5.65 5.65 0 1 0 15.54 15.3V9.01a7.35 7.35 0 0 0 4.3 1.38V7.3a4.3 4.3 0 0 1-3.24-1.48z" />
  </Svg>
);

const SOCIAL = [
  { icon: Facebook, href: 'https://www.facebook.com/mapalustoresas/', label: 'Facebook' },
  { icon: Instagram, href: 'https://www.instagram.com/mapalu_store_sas', label: 'Instagram' },
  { icon: Youtube, href: 'https://www.youtube.com/@mapalustore918', label: 'YouTube' },
  { icon: TikTok, href: 'https://www.tiktok.com/@mapalustoresas', label: 'TikTok' },
];

export default function Footer() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    if (!email.includes('@')) return;
    setSent(true);
    setEmail('');
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <footer className="relative overflow-hidden bg-brand-deep text-brand-100/80">
      {/* soft light bloom */}
      <div className="pointer-events-none absolute -left-40 -top-40 h-[520px] w-[520px] rounded-full bg-brand-400/10 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-52 -right-32 h-[520px] w-[520px] rounded-full bg-sand-400/10 blur-[120px]" />

      {/* Newsletter */}
      <div className="relative border-b border-white/10">
        <div className="container-x py-14 lg:py-20">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <Reveal>
              <span className="eyebrow text-brand-300">Newsletter</span>
              <h2 className="mt-3 text-balance text-3xl text-white sm:text-4xl">
                Ideas para transformar tu espacio
              </h2>
              <p className="mt-3 max-w-md text-pretty text-brand-100/65">
                Nuevos diseños, proyectos instalados y promociones. Sin spam.
              </p>
            </Reveal>

            <Reveal delay={0.1}>
              <form onSubmit={submit} className="relative">
                <div className="flex flex-col gap-3 sm:flex-row">
                  <div className="relative flex-1">
                    <Mail
                      size={17}
                      className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-brand-300"
                    />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="tu@correo.com"
                      aria-label="Correo electrónico"
                      className="h-14 w-full rounded-pill border border-white/15 bg-white/5 pl-12 pr-5 text-white outline-none backdrop-blur transition focus:border-brand-300/60 focus:bg-white/10 placeholder:text-brand-100/40"
                    />
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    type="submit"
                    className="inline-flex h-14 items-center justify-center gap-2 rounded-pill bg-white px-8 font-medium text-brand-800 shadow-e4 transition hover:shadow-e5"
                  >
                    {sent ? <Check size={17} /> : <Send size={16} />}
                    {sent ? 'Suscrito' : 'Suscribirme'}
                  </motion.button>
                </div>
              </form>
            </Reveal>
          </div>
        </div>
      </div>

      {/* Link columns */}
      <div className="relative container-x py-14 lg:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <img src="/assets/images/logo/mapalu_logo.png" alt="Mapalu Store" className="h-16 w-auto sm:h-[72px]" />
            <p className="mt-5 max-w-xs text-pretty text-sm leading-relaxed text-brand-100/65">
              Expertos en decoración artificial. Jardines verticales, grama sintética y flores
              artificiales, con servicio de instalación.
            </p>
            <div className="mt-6 flex gap-2">
              {SOCIAL.map(({ icon: Icon, href, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener"
                  aria-label={label}
                  whileHover={{ y: -3, scale: 1.06 }}
                  className="grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-white/5 text-brand-100 transition hover:border-brand-300/50 hover:bg-white/10 hover:text-white"
                >
                  <Icon />
                </motion.a>
              ))}
            </div>
          </div>

          <div className="lg:col-span-3">
            <h3 className="eyebrow mb-4 text-white">Categorías</h3>
            <ul className="space-y-2.5">
              {navCategories.slice(0, 7).map((c) => (
                <li key={c.handle}>
                  <Link
                    to={`/collections/${c.handle}`}
                    className="group inline-flex items-center gap-1 text-sm text-brand-100/65 transition hover:text-white"
                  >
                    {c.label}
                    <ArrowUpRight
                      size={13}
                      className="opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h3 className="eyebrow mb-4 text-white">Políticas</h3>
            <ul className="space-y-2.5 text-sm">
              {[
                ['Devoluciones', '/politicas/devoluciones'],
                ['Privacidad', '/politicas/privacidad'],
                ['Términos', '/politicas/terminos'],
                ['Envíos', '/politicas/envios'],
                ['PQRS', '/contacto'],
              ].map(([label, to]) => (
                <li key={to}>
                  <Link to={to} className="text-brand-100/65 transition hover:text-white">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h3 className="eyebrow mb-4 text-white">Nuestra tienda</h3>
            <ul className="space-y-3 text-sm text-brand-100/65">
              <li className="flex gap-2.5">
                <Clock size={15} className="mt-0.5 shrink-0 text-brand-300" />
                <span>{STORE.hours}</span>
              </li>
              <li className="flex gap-2.5">
                <Phone size={15} className="mt-0.5 shrink-0 text-brand-300" />
                <span className="flex flex-col">
                  {STORE.phones.map((p) => (
                    <a key={p} href={`tel:+57${p}`} className="transition hover:text-white">
                      {p}
                    </a>
                  ))}
                </span>
              </li>
              <li className="flex gap-2.5">
                <Mail size={15} className="mt-0.5 shrink-0 text-brand-300" />
                <a href={`mailto:${STORE.email}`} className="break-all transition hover:text-white">
                  {STORE.email}
                </a>
              </li>
              <li className="flex gap-2.5">
                <MapPin size={15} className="mt-0.5 shrink-0 text-brand-300" />
                <span>{STORE.address}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="relative border-t border-white/10">
        <div className="container-x flex flex-col items-center justify-between gap-3 py-6 text-xs text-brand-100/45 sm:flex-row">
          <p>© {new Date().getFullYear()} Mapalu Store SAS · Itagüí, Colombia</p>
          <p>
            Despacho nacional · Instalación en Medellín y área metropolitana
          </p>
        </div>
      </div>
    </footer>
  );
}

/** Floating WhatsApp CTA — replaces the SeedGrow Shopify app. */
export function WhatsAppFab() {
  const [hover, setHover] = useState(false);
  return (
    <motion.a
      href={`https://wa.me/${WHATSAPP}`}
      target="_blank"
      rel="noopener"
      aria-label="Hablar por WhatsApp"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1.4, type: 'spring', stiffness: 260, damping: 20 }}
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.94 }}
      onHoverStart={() => setHover(true)}
      onHoverEnd={() => setHover(false)}
      className="group fixed bottom-6 right-5 z-40 flex items-center gap-3 rounded-pill bg-[#25D366] py-3 pl-3 pr-4 text-white shadow-[0_12px_34px_-8px_rgba(37,211,102,0.7)] sm:bottom-8 sm:right-8"
    >
      <span className="relative grid h-9 w-9 place-items-center rounded-full bg-white/20">
        <span className="absolute inset-0 animate-ping rounded-full bg-white/25" />
        <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20" aria-hidden="true">
          <path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.64-2.05-.17-.3-.02-.46.13-.6.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.6-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.75-.72 2-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35M12.04 21.5h-.01a9.4 9.4 0 0 1-4.8-1.32l-.34-.2-3.57.94.95-3.48-.22-.36a9.42 9.42 0 0 1-1.44-5.02c0-5.2 4.24-9.44 9.45-9.44a9.4 9.4 0 0 1 6.67 2.77 9.35 9.35 0 0 1 2.76 6.68c0 5.2-4.24 9.44-9.45 9.44M20.52 3.45A11.77 11.77 0 0 0 12.04 0C5.5 0 .2 5.3.2 11.82c0 2.08.55 4.11 1.59 5.9L.1 24l6.42-1.68a11.8 11.8 0 0 0 5.51 1.4h.01c6.53 0 11.84-5.3 11.84-11.82 0-3.16-1.23-6.13-3.47-8.36" />
        </svg>
      </span>
      <motion.span
        animate={{ width: hover ? 'auto' : 0, opacity: hover ? 1 : 0 }}
        className="hidden overflow-hidden whitespace-nowrap text-sm font-medium sm:inline-block"
      >
        Asesoría gratis
      </motion.span>
    </motion.a>
  );
}

/** Thin scroll-progress bar pinned under the header. */
export function ScrollProgress({ progress }) {
  return (
    <motion.div
      style={{ scaleX: progress }}
      className="fixed inset-x-0 top-0 z-[55] h-[3px] origin-left bg-brand-sheen"
    />
  );
}
