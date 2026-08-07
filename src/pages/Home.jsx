import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import {
  ArrowRight, Truck, Ruler, MapPin, Sparkles, ArrowUpRight, Play,
} from 'lucide-react';

import { Button, SectionHead } from '../components/ui/Button';
import { Reveal, Stagger, StaggerItem, Tilt3D, SplitWords, EASE } from '../components/ui/motion';
import { BackgroundVideo, VideoPanel, BeforeAfter, VIDEOS } from '../components/ui/Video';
import ProductCard from '../components/product/ProductCard';
import {
  featuredCategories, projectGroups, products, HERO_IMAGE,
} from '../lib/catalog';
import { formatCOPShort } from '../lib/format';
import { WHATSAPP } from '../lib/estimator';

/* ==================================================================== *
 * HERO — cinematic video with scroll-linked parallax, scale and blur
 * ==================================================================== */
function Hero() {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });

  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.18]);
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);
  const blur = useTransform(scrollYProgress, [0, 1], ['blur(0px)', 'blur(7px)']);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={ref} className="relative h-[100svh] min-h-[620px] w-full overflow-hidden bg-brand-950">
      <motion.div
        style={reduce ? undefined : { scale, y, filter: blur }}
        className="absolute inset-0"
      >
        <BackgroundVideo
          src={VIDEOS.greenWall}
          poster={HERO_IMAGE}
          overlay=""
          opacity={0.92}
        />
        {/* Legibility scrim — two layers so text stays readable over any frame */}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-950 via-brand-950/45 to-brand-950/65" />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-950/80 via-transparent to-transparent" />
      </motion.div>

      <div className="grain absolute inset-0" />

      <motion.div
        style={reduce ? undefined : { opacity: fade }}
        className="container-wide relative flex h-full flex-col justify-end pb-[max(4.5rem,env(safe-area-inset-bottom))] pt-36 text-center sm:justify-center sm:pb-28 sm:text-left"
      >
        <div className="mx-auto max-w-3xl sm:mx-0">
          <motion.span
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.7, ease: EASE }}
            className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-pill glass-dark px-3.5 py-2 text-[10px] font-medium uppercase tracking-[0.12em] text-brand-100 sm:gap-2 sm:px-4 sm:py-2 sm:text-2xs sm:tracking-[0.18em]"
          >
            <Sparkles size={12} className="shrink-0 text-sand-300" />
            Decoración artificial · Medellín
          </motion.span>

          <h1 className="mt-5 text-balance font-display text-[2.05rem] leading-[1.06] text-white sm:mt-6 sm:text-6xl sm:leading-[1.04] lg:text-7xl">
            <SplitWords text="Tu espacio puede" delay={0.35} />
            <br className="hidden sm:block" />{' '}
            <SplitWords text="verse así." delay={0.62} />{' '}
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.05, duration: 0.9 }}
              className="bg-gradient-to-r from-sand-200 via-sand-300 to-sand-400 bg-clip-text text-transparent"
            >
              <SplitWords text="Calcula cuánto cuesta." delay={1.05} />
            </motion.span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.35, duration: 0.7, ease: EASE }}
            className="text-pretty mx-auto mt-6 max-w-lg text-lg leading-relaxed text-brand-100/85 sm:mx-0 sm:text-xl"
          >
            Jardines verticales, techos y pisos. Diseñamos, cotizamos por metro cuadrado
            e instalamos en Medellín y el área metropolitana.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.7, ease: EASE }}
            className="mt-9 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center"
          >
            <Button to="/proyectos" size="lg" variant="primary" magnetic>
              Ver proyectos <ArrowRight size={17} />
            </Button>
            <Button to="/productos" size="lg" variant="glass">
              Comprar por unidad
            </Button>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute inset-x-0 bottom-6 hidden justify-center sm:flex"
      >
        <motion.div
          animate={{ y: [0, 9, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          className="flex h-11 w-7 items-start justify-center rounded-pill border border-white/30 p-1.5"
        >
          <span className="h-2 w-1 rounded-full bg-white/70" />
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ==================================================================== *
 * TRUST MARQUEE
 * ==================================================================== */
function TrustBar() {
  const items = [
    { icon: Truck, text: 'Despacho nacional desde Itagüí' },
    { icon: Ruler, text: 'Te ayudamos con las medidas' },
    { icon: MapPin, text: 'Instalación en Medellín y área metro' },
    { icon: Sparkles, text: 'Sin riego, sin poda, sin mantenimiento' },
  ];
  const loop = [...items, ...items, ...items];

  return (
    <section className="border-y border-line bg-white py-4">
      <div className="mask-fade-x overflow-hidden">
        <div className="flex w-max animate-marquee gap-10 sm:gap-16">
          {loop.map(({ icon: Icon, text }, i) => (
            <span key={i} className="flex shrink-0 items-center gap-2.5 text-base text-ink-muted">
              <Icon size={18} className="shrink-0 text-brand-500" />
              {text}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ==================================================================== *
 * PATH CHOOSER — the store's core split: projects vs products
 * ==================================================================== */
function PathChooser() {
  const paths = [
    {
      to: '/proyectos',
      video: VIDEOS.ceiling,
      poster: '/assets/images/content/WhatsApp_Image_2026-07-31_at_10.46.57_AM_7_905f4b70-7d92-48e6-bf8e-d6c471dbb3db.jpg',
      eyebrow: 'Por metro cuadrado',
      title: 'Proyectos',
      text: 'Muros verdes, techos y pisos instalados. Cotiza con nuestra calculadora.',
      cta: 'Ver proyectos',
    },
    {
      to: '/productos',
      video: VIDEOS.roseWall,
      poster: '/assets/images/content/WhatsApp_Image_2026-08-02_at_10.22.47_PM_b1b4ac7d-3024-4f76-9ebc-4fead53bcf1d.jpg',
      eyebrow: 'Por unidad',
      title: 'Productos',
      text: 'Paneles, flores, materas y follaje. Compra individual con envío nacional.',
      cta: 'Ver productos',
    },
  ];

  return (
    <section className="container-x py-20 lg:py-28">
      <SectionHead
        align="center"
        eyebrow="¿Qué estás buscando?"
        title="Dos formas de transformar tu espacio"
        sub="Compra productos por unidad o cotiza tu proyecto completo por metro cuadrado."
      />

      <Stagger className="mt-14 grid gap-6 lg:grid-cols-2" gap={0.12}>
        {paths.map((p) => (
          <StaggerItem key={p.to}>
            <Tilt3D max={6} lift={26}>
              <Link
                to={p.to}
                className="group relative block aspect-[4/5] overflow-hidden rounded-2xl shadow-e4 transition-shadow duration-500 hover:shadow-e6 sm:aspect-[16/11]"
              >
                {/* These clips include bright daylight frames, so the scrim has
                    to hold contrast at the text zone regardless of the frame. */}
                <BackgroundVideo
                  src={p.video}
                  poster={p.poster}
                  overlay="bg-gradient-to-t from-brand-950 via-brand-950/72 to-brand-950/25"
                />
                <div className="relative flex h-full flex-col items-center justify-end p-7 text-center sm:items-start sm:p-9 sm:text-left">
                  <span className="eyebrow text-sand-300">{p.eyebrow}</span>
                  <h3 className="mt-2 font-display text-3xl text-white sm:text-4xl">{p.title}</h3>
                  <p className="text-pretty mt-3 max-w-sm text-base leading-relaxed text-brand-100/85">
                    {p.text}
                  </p>
                  <span className="mt-7 inline-flex w-fit items-center gap-2 rounded-pill bg-white/95 px-7 py-3.5 text-base font-medium text-ink shadow-e3 transition-all duration-400 group-hover:gap-3.5 group-hover:bg-white">
                    {p.cta}
                    <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
              </Link>
            </Tilt3D>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}

/* ==================================================================== *
 * CATEGORY GRID — 3D tilting tiles
 * ==================================================================== */
function CategoryGrid() {
  return (
    <section className="bg-stone/60 py-20 lg:py-28">
      <div className="container-x">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
          <SectionHead
            eyebrow="Compra por categoría"
            title="Follaje, flores, materas y más"
            sub="Todo por unidad, con envío a todo el país."
          />
          <Reveal delay={0.15}>
            <Button to="/collections/all" variant="outline">
              Ver todo <ArrowUpRight size={16} />
            </Button>
          </Reveal>
        </div>

        <Stagger className="mt-12 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3" gap={0.07}>
          {featuredCategories.map((c) => (
            <StaggerItem key={c.handle}>
              <Tilt3D max={10} lift={22}>
                <Link
                  to={`/collections/${c.handle}`}
                  className="group relative block aspect-[4/5] overflow-hidden rounded-xl bg-brand-900 shadow-e3 transition-shadow duration-500 hover:shadow-e6 sm:aspect-square"
                >
                  <img
                    src={c.image}
                    alt={c.label}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1100ms] ease-grow group-hover:scale-[1.1]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-950/85 via-brand-950/15 to-transparent transition-opacity duration-500 group-hover:from-brand-950/92" />

                  <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6">
                    <h3 className="font-display text-base leading-tight text-white sm:text-xl">
                      {c.label}
                    </h3>
                    <span className="mt-2 flex items-center gap-1.5 text-xs text-brand-100/0 transition-all duration-400 group-hover:text-brand-100/85">
                      Explorar <ArrowRight size={13} />
                    </span>
                  </div>

                  <span className="absolute inset-0 rounded-xl ring-1 ring-inset ring-white/0 transition-all duration-500 group-hover:ring-white/25" />
                </Link>
              </Tilt3D>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

/* ==================================================================== *
 * PROJECT SHOWCASE — dark cinematic band
 * ==================================================================== */
function ProjectShowcase() {
  // Round-robin across Paredes / Techos / Pisos so the rail shows the full
  // range of surfaces rather than four wall projects in a row.
  const featured = (() => {
    const lists = projectGroups.map((g) => g.items.map((i) => ({ ...i, group: g.title })));
    const out = [];
    for (let round = 0; out.length < 4; round += 1) {
      let added = false;
      for (const list of lists) {
        if (list[round]) {
          out.push(list[round]);
          added = true;
          if (out.length === 4) break;
        }
      }
      if (!added) break; // every list exhausted
    }
    return out;
  })();

  return (
    <section className="relative overflow-hidden bg-brand-deep py-20 lg:py-28">
      <div className="pointer-events-none absolute -right-40 top-10 h-[560px] w-[560px] rounded-full bg-brand-400/10 blur-[130px]" />

      <div className="container-x relative">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-5">
            <SectionHead
              tone="light"
              eyebrow="Proyectos destacados"
              title="Espacios reales transformados por nuestro equipo"
              sub="Cotizamos por metro cuadrado, fabricamos e instalamos. Tú solo eliges el estilo."
            />
            <Reveal delay={0.2} className="mt-8 flex flex-wrap justify-center gap-3 sm:justify-start">
              <Button to="/proyectos" variant="white" magnetic>
                Ver todos los proyectos <ArrowRight size={16} />
              </Button>
              <Button
                href={`https://wa.me/${WHATSAPP}`}
                target="_blank"
                rel="noopener"
                variant="glass"
              >
                Cotizar por WhatsApp
              </Button>
            </Reveal>
          </div>

          <div className="lg:col-span-7">
            <Reveal delay={0.1}>
              <div className="grid grid-cols-2 gap-4">
                <VideoPanel
                  src={VIDEOS.install}
                  poster="/assets/images/content/WhatsApp_Image_2026-07-31_at_2.56.03_PM_6.jpg"
                  ratio="aspect-[3/4]"
                  label="Instalación"
                  className="translate-y-0"
                />
                <VideoPanel
                  src={VIDEOS.grass}
                  poster="/assets/images/content/WhatsApp_Image_2026-08-02_at_10.30.41_PM_1.jpg"
                  ratio="aspect-[3/4]"
                  label="Grama sintética"
                  className="translate-y-8 sm:translate-y-12"
                />
              </div>
            </Reveal>
          </div>
        </div>

        {/* Project price cards */}
        <Stagger className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4" gap={0.08}>
          {featured.map((p) => (
            <StaggerItem key={p.handle}>
              <Tilt3D max={8} lift={18}>
                <Link
                  to={`/products/${p.handle}`}
                  className="group relative block overflow-hidden rounded-xl glass-dark p-5 transition-all duration-500 hover:bg-white/10"
                >
                  <span className="eyebrow text-sand-300">{p.group}</span>
                  <h3 className="text-pretty mt-2.5 min-h-[3.25rem] font-display text-lg leading-snug text-white">
                    {p.title}
                  </h3>
                  <div className="mt-4 flex items-baseline gap-1.5 border-t border-white/10 pt-4">
                    <span className="text-xs text-brand-100/60">desde</span>
                    <span className="font-display text-xl text-white">
                      {formatCOPShort(p.price)}
                    </span>
                    <span className="text-xs text-brand-100/60">
                      {p.priceUnit === 'ml' ? '/ m lineal' : '/ m²'}
                    </span>
                  </div>
                  <ArrowUpRight
                    size={18}
                    className="absolute right-4 top-4 text-white/30 transition-all duration-400 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white"
                  />
                </Link>
              </Tilt3D>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

/* ==================================================================== *
 * BEFORE / AFTER
 * ==================================================================== */
function Transformation() {
  return (
    <section className="container-x py-20 lg:py-28">
      <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
        <div className="lg:col-span-5">
          <SectionHead
            eyebrow="Proyectos realizados"
            title="Antes y después"
            sub="El aspecto original del restaurante a la espera de su transformación — y el resultado: un espacio fresco y limpio."
          />
          <Reveal delay={0.15}>
            <ul className="mx-auto mt-8 max-w-md space-y-5 text-left sm:mx-0">
              {[
                ['01', 'Tomamos medidas', 'Te asesoramos por WhatsApp o visitamos el lugar.'],
                ['02', 'Cotizamos por m²', 'Precio transparente con nuestra calculadora.'],
                ['03', 'Fabricamos e instalamos', 'Anclaje firme, acabado 3D sin puntos de fijación a la vista.'],
              ].map(([n, t, d]) => (
                <li key={n} className="flex gap-4">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand-50 font-display text-sm text-brand-600">
                    {n}
                  </span>
                  <div>
                    <p className="font-medium text-ink">{t}</p>
                    <p className="text-base text-ink-muted">{d}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <div className="lg:col-span-7">
          <Reveal delay={0.1}>
            {/* The authentic pair from the live site, matched by their alt text. */}
            <BeforeAfter
              before="/assets/images/content/WhatsApp_Image_2026-07-31_at_2.56.03_PM_1_d3a89532-761b-4d96-a113-494f56609d5b.jpg"
              after="/assets/images/content/WhatsApp_Image_2026-07-31_at_2.56.03_PM_6_88c3ecbf-f1eb-42ec-a9ad-a88b1bccc4a2.jpg"
              beforeLabel="El aspecto original del restaurante a la espera de su transformación."
              afterLabel="El restaurante se ha transformado en un espacio fresco y limpio."
              className="aspect-[4/3]"
            />
            <p className="mt-3 text-center text-xs text-ink-muted">
              Arrastra para comparar
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ==================================================================== *
 * PRODUCT RAIL
 * ==================================================================== */
function ProductRail() {
  const picks = products
    .filter((p) => !p.isProject && p.image)
    .sort((a, b) => (b.compareAtPrice ? 1 : 0) - (a.compareAtPrice ? 1 : 0))
    .slice(0, 8);

  return (
    <section className="bg-stone/60 py-20 lg:py-28">
      <div className="container-x">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
          <SectionHead
            eyebrow="Decora con…"
            title="Favoritos de nuestros clientes"
            sub="Flores y follaje listos para enviar a todo el país."
          />
          <Reveal delay={0.15}>
            <Button to="/collections/all" variant="outline">
              Ver catálogo <ArrowUpRight size={16} />
            </Button>
          </Reveal>
        </div>

        <Stagger
          className="mt-12 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4"
          gap={0.06}
        >
          {picks.map((p, i) => (
            <ProductCard key={p.handle} product={p} index={i} />
          ))}
        </Stagger>
      </div>
    </section>
  );
}

/* ==================================================================== *
 * CLOSING CTA
 * ==================================================================== */
function ClosingCTA() {
  return (
    <section className="relative overflow-hidden">
      <div className="relative min-h-[460px]">
        <BackgroundVideo
          src={VIDEOS.terrace}
          poster="/assets/images/content/WhatsAppImage2026-08-04at11.30.58AM.jpg"
          overlay="bg-brand-950/82"
        />
        <div className="grain absolute inset-0" />

        <div className="container-x relative flex min-h-[460px] flex-col items-center justify-center py-20 text-center">
          <Reveal>
            <span className="eyebrow inline-flex items-center gap-2 rounded-pill glass-dark px-4 py-2 text-brand-100">
              <Play size={12} className="text-sand-300" />
              Asesoría sin costo
            </span>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="text-balance mt-6 max-w-3xl font-display text-3xl leading-tight text-white sm:text-5xl">
              Cuéntanos tu espacio y te decimos cuánto cuesta transformarlo
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="text-pretty mt-5 max-w-xl text-lg text-brand-100/80">
              Escríbenos con las medidas aproximadas. Una asesora te acompaña de principio a fin.
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button
                href={`https://wa.me/${WHATSAPP}`}
                target="_blank"
                rel="noopener"
                size="lg"
                variant="primary"
                magnetic
              >
                Hablar por WhatsApp <ArrowRight size={17} />
              </Button>
              <Button to="/proyectos" size="lg" variant="glass">
                Calcular mi proyecto
              </Button>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ==================================================================== */
export default function Home() {
  return (
    <>
      <Hero />
      <TrustBar />
      <PathChooser />
      <CategoryGrid />
      <ProjectShowcase />
      <Transformation />
      <ProductRail />
      <ClosingCTA />
    </>
  );
}
