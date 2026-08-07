import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { Menu, Search, ShoppingBag, Heart, ChevronDown } from 'lucide-react';
import { navCategories } from '../../lib/catalog';
import { useStore, useUI } from '../../store/useStore';
import { EASE } from '../ui/motion';

const LOGO = '/assets/images/logo/mapalu_logo.png';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const { scrollY } = useScroll();
  const location = useLocation();

  const count = useStore((s) => s.items.reduce((n, i) => n + i.qty, 0));
  const wishCount = useStore((s) => s.wishlist.length);
  const { openCart, openMenu, openSearch } = useUI();

  useMotionValueEvent(scrollY, 'change', (v) => setScrolled(v > 24));
  useEffect(() => setMegaOpen(false), [location.pathname]);

  // The home hero is a dark video: chrome must invert to stay legible until
  // the header picks up its own light background on scroll.
  const overHero = location.pathname === '/' && !scrolled;

  const linkCls = ({ isActive }) =>
    `relative py-2 text-sm transition-colors duration-300 ${
      overHero
        ? isActive
          ? 'text-white'
          : 'text-white/75 hover:text-white'
        : isActive
          ? 'text-brand-600'
          : 'text-ink hover:text-brand-600'
    }`;

  const iconCls = `grid h-11 w-11 place-items-center rounded-full transition ${
    overHero ? 'text-white hover:bg-white/15' : 'text-ink hover:bg-ink/5'
  }`;

  return (
    <>
      <motion.header
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.7, ease: EASE }}
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-bone/85 shadow-e2 backdrop-blur-xl backdrop-saturate-150'
            : 'bg-transparent'
        }`}
      >
        <div className="container-wide">
          <div
            className={`flex items-center justify-between transition-all duration-500 ${
              scrolled ? 'h-[68px]' : 'h-[84px]'
            }`}
          >
            {/* Left: mobile menu + logo */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={openMenu}
                aria-label="Abrir menú"
                className={`-ml-2 lg:hidden ${iconCls}`}
              >
                <Menu size={20} />
              </button>

              <Link to="/" className="group flex items-center gap-2.5" aria-label="Mapalu Store">
                <motion.img
                  src={LOGO}
                  alt="Mapalu Store"
                  whileHover={{ scale: 1.04, rotate: -1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                  className={`w-auto transition-all duration-500 ${scrolled ? 'h-9' : 'h-11'} ${overHero ? 'brightness-0 invert' : ''}`}
                />
              </Link>
            </div>

            {/* Center: desktop nav */}
            <nav className="hidden items-center gap-7 lg:flex">
              <NavLink to="/" className={linkCls} end>
                Inicio
              </NavLink>
              <NavLink to="/proyectos" className={linkCls}>
                Proyectos
              </NavLink>
              <NavLink to="/productos" className={linkCls}>
                Productos
              </NavLink>

              <div
                className="relative"
                onMouseEnter={() => setMegaOpen(true)}
                onMouseLeave={() => setMegaOpen(false)}
              >
                <button
                  type="button"
                  onClick={() => setMegaOpen((o) => !o)}
                  aria-expanded={megaOpen}
                  className={`flex items-center gap-1 py-2 text-sm transition-colors duration-300 ${overHero ? 'text-white/75 hover:text-white' : 'text-ink hover:text-brand-600'}`}
                >
                  Categorías
                  <ChevronDown
                    size={14}
                    className={`transition-transform duration-300 ${megaOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                <AnimatePresence>
                  {megaOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 12, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.98 }}
                      transition={{ duration: 0.28, ease: EASE }}
                      className="absolute left-1/2 top-full w-[min(680px,88vw)] -translate-x-1/2 pt-3"
                    >
                      <div className="overflow-hidden rounded-2xl bg-white/95 p-3 shadow-e6 backdrop-blur-xl">
                        <div className="grid grid-cols-2 gap-1 sm:grid-cols-3">
                          {navCategories.map((c, i) => (
                            <motion.div
                              key={c.handle}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: i * 0.025, duration: 0.3, ease: EASE }}
                            >
                              <Link
                                to={`/collections/${c.handle}`}
                                className="block rounded-lg px-3 py-2.5 text-sm text-ink transition-all duration-200 hover:bg-brand-50 hover:text-brand-700"
                              >
                                {c.label}
                              </Link>
                            </motion.div>
                          ))}
                        </div>
                        <Link
                          to="/collections/all"
                          className="mt-2 block rounded-lg bg-brand-800 px-4 py-3 text-center text-sm text-white transition hover:bg-brand-700"
                        >
                          Ver todos los productos
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </nav>

            {/* Right: actions */}
            <div className="flex items-center gap-0.5">
              <button
                type="button"
                onClick={openSearch}
                aria-label="Buscar"
                className={iconCls}
              >
                <Search size={19} />
              </button>

              <Link
                to="/favoritos"
                aria-label="Favoritos"
                className={`relative hidden sm:grid ${iconCls}`}
              >
                <Heart size={19} />
                {wishCount > 0 && (
                  <span className="absolute right-1.5 top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-sand-400 px-1 text-[10px] font-semibold text-ink">
                    {wishCount}
                  </span>
                )}
              </Link>

              <button
                type="button"
                onClick={openCart}
                aria-label={`Carrito, ${count} artículos`}
                className={`relative ${iconCls}`}
              >
                <ShoppingBag size={19} />
                <AnimatePresence>
                  {count > 0 && (
                    <motion.span
                      key={count}
                      initial={{ scale: 0.4, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.4, opacity: 0 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                      className="absolute right-1 top-1.5 grid h-4.5 min-w-[18px] place-items-center rounded-full bg-brand-500 px-1 text-[10px] font-semibold text-white shadow-glow"
                    >
                      {count}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>
        </div>
      </motion.header>
    </>
  );
}
