import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, Trash2, Minus, Plus, ShoppingBag, ArrowRight, Check } from 'lucide-react';
import { navCategories, searchProducts } from '../../lib/catalog';
import { useStore, useUI } from '../../store/useStore';
import { formatCOP, formatCOPShort } from '../../lib/format';
import { EASE } from '../ui/motion';
import { Button } from '../ui/Button';
import { WHATSAPP } from '../../lib/estimator';

/* ---------------- shared shell ---------------- */

function Scrim({ onClick }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onClick}
      className="fixed inset-0 z-[60] bg-ink/45 backdrop-blur-sm"
    />
  );
}

function useLockScroll(active) {
  useEffect(() => {
    if (!active) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [active]);
}

function useEscape(active, onClose) {
  useEffect(() => {
    if (!active) return;
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [active, onClose]);
}

/* ---------------- cart ---------------- */

export function CartDrawer() {
  const { cartOpen, closeCart } = useUI();
  const items = useStore((s) => s.items);
  const setQty = useStore((s) => s.setQty);
  const removeItem = useStore((s) => s.removeItem);
  const subtotal = items.reduce((n, i) => n + i.price * i.qty, 0);

  useLockScroll(cartOpen);
  useEscape(cartOpen, closeCart);

  const waHref = useMemo(() => {
    const lines = items
      .map((i) => `• ${i.title} × ${i.qty} — ${formatCOP(i.price * i.qty)}`)
      .join('\n');
    const msg = `Hola Mapalu 👋 Quiero confirmar este pedido:\n\n${lines}\n\nTotal: ${formatCOP(subtotal)}`;
    return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`;
  }, [items, subtotal]);

  return (
    <AnimatePresence>
      {cartOpen && (
        <>
          <Scrim onClick={closeCart} />
          <motion.aside
            role="dialog"
            aria-label="Carrito"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.45, ease: EASE }}
            className="fixed inset-y-0 right-0 z-[70] flex w-full max-w-[440px] flex-col bg-bone shadow-e6"
          >
            <div className="flex items-center justify-between border-b border-line px-6 py-5">
              <h2 className="font-display text-xl">Carrito</h2>
              <button
                onClick={closeCart}
                aria-label="Cerrar carrito"
                className="grid h-10 w-10 place-items-center rounded-full transition hover:bg-ink/5"
              >
                <X size={19} />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-5 px-8 text-center">
                <div className="grid h-20 w-20 place-items-center rounded-full bg-stone text-ink-muted">
                  <ShoppingBag size={28} />
                </div>
                <p className="text-ink-muted">Su carrito está vacío</p>
                <Button to="/collections/all" onClick={closeCart} variant="primary">
                  Empezar a comprar
                </Button>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto px-6 py-5">
                  <ul className="space-y-4">
                    <AnimatePresence initial={false}>
                      {items.map((item) => (
                        <motion.li
                          key={item.key}
                          layout
                          initial={{ opacity: 0, y: 14 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: 40, height: 0, marginBottom: 0 }}
                          transition={{ duration: 0.3, ease: EASE }}
                          className="flex gap-4 rounded-lg bg-white p-3 shadow-e1"
                        >
                          <img
                            src={item.image}
                            alt=""
                            className="h-20 w-16 shrink-0 rounded object-cover"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="line-clamp-2 text-sm leading-snug">{item.title}</p>
                            {item.variantTitle && (
                              <p className="mt-0.5 text-xs text-ink-muted">{item.variantTitle}</p>
                            )}
                            <p className="mt-1 font-display text-sm text-brand-700">
                              {formatCOPShort(item.price)}
                              {item.unit === 'm2' && <span className="text-xs"> / m²</span>}
                            </p>

                            <div className="mt-2 flex items-center gap-3">
                              <div className="flex items-center rounded-pill border border-line">
                                <button
                                  onClick={() => setQty(item.key, item.qty - 1)}
                                  aria-label="Restar"
                                  className="grid h-7 w-7 place-items-center rounded-full transition hover:bg-ink/5"
                                >
                                  <Minus size={12} />
                                </button>
                                <span className="w-7 text-center text-xs tabular-nums">
                                  {item.qty}
                                </span>
                                <button
                                  onClick={() => setQty(item.key, item.qty + 1)}
                                  aria-label="Sumar"
                                  className="grid h-7 w-7 place-items-center rounded-full transition hover:bg-ink/5"
                                >
                                  <Plus size={12} />
                                </button>
                              </div>
                              <button
                                onClick={() => removeItem(item.key)}
                                aria-label="Eliminar"
                                className="text-ink-muted transition hover:text-sale"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        </motion.li>
                      ))}
                    </AnimatePresence>
                  </ul>
                </div>

                <div className="border-t border-line bg-white px-6 py-5">
                  <div className="mb-1 flex items-baseline justify-between">
                    <span className="text-sm text-ink-muted">Subtotal</span>
                    <motion.span
                      key={subtotal}
                      initial={{ opacity: 0.4, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="font-display text-2xl text-ink"
                    >
                      {formatCOP(subtotal)}
                    </motion.span>
                  </div>
                  <p className="mb-4 text-xs text-ink-muted">
                    Envío y descuentos se calculan al confirmar.
                  </p>
                  <Button href={waHref} target="_blank" rel="noopener" variant="primary" className="w-full" size="lg">
                    Confirmar por WhatsApp <ArrowRight size={16} />
                  </Button>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

/* ---------------- mobile menu ---------------- */

export function MobileMenu() {
  const { menuOpen, closeMenu } = useUI();
  useLockScroll(menuOpen);
  useEscape(menuOpen, closeMenu);

  const primary = [
    { to: '/', label: 'Inicio' },
    { to: '/proyectos', label: 'Proyectos' },
    { to: '/productos', label: 'Productos' },
    { to: '/collections/all', label: 'Todos los productos' },
  ];

  return (
    <AnimatePresence>
      {menuOpen && (
        <>
          <Scrim onClick={closeMenu} />
          <motion.aside
            role="dialog"
            aria-label="Menú"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: 0.45, ease: EASE }}
            className="fixed inset-y-0 left-0 z-[70] flex w-full max-w-[380px] flex-col bg-brand-900 text-white shadow-e6"
          >
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
              <span className="font-display text-xl">Menú</span>
              <button
                onClick={closeMenu}
                aria-label="Cerrar menú"
                className="grid h-10 w-10 place-items-center rounded-full transition hover:bg-white/10"
              >
                <X size={19} />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto px-4 py-6">
              <ul className="space-y-1">
                {primary.map((l, i) => (
                  <motion.li
                    key={l.to}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.06 + i * 0.05, duration: 0.4, ease: EASE }}
                  >
                    <Link
                      to={l.to}
                      onClick={closeMenu}
                      className="block rounded-lg px-4 py-3 font-display text-lg transition hover:bg-white/10"
                    >
                      {l.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>

              <p className="eyebrow mt-8 px-4 text-brand-300">Categorías</p>
              <ul className="mt-3 space-y-0.5">
                {navCategories.map((c, i) => (
                  <motion.li
                    key={c.handle}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.24 + i * 0.03, duration: 0.35, ease: EASE }}
                  >
                    <Link
                      to={`/collections/${c.handle}`}
                      onClick={closeMenu}
                      className="block rounded-lg px-4 py-2.5 text-sm text-brand-100/85 transition hover:bg-white/10 hover:text-white"
                    >
                      {c.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </nav>

            <div className="border-t border-white/10 p-5">
              <Button
                href={`https://wa.me/${WHATSAPP}`}
                target="_blank"
                rel="noopener"
                variant="primary"
                className="w-full"
              >
                Hablar por WhatsApp
              </Button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

/* ---------------- search ---------------- */

export function SearchOverlay() {
  const { searchOpen, closeSearch } = useUI();
  const [q, setQ] = useState('');
  const results = useMemo(() => searchProducts(q, 12), [q]);

  useLockScroll(searchOpen);
  useEscape(searchOpen, closeSearch);
  useEffect(() => {
    if (!searchOpen) setQ('');
  }, [searchOpen]);

  return (
    <AnimatePresence>
      {searchOpen && (
        <>
          <Scrim onClick={closeSearch} />
          <motion.div
            role="dialog"
            aria-label="Buscar"
            initial={{ opacity: 0, y: -24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="fixed inset-x-0 top-0 z-[70] max-h-[88vh] overflow-y-auto bg-bone shadow-e6"
          >
            <div className="container-x py-6">
              <div className="flex items-center gap-3 border-b border-line pb-4">
                <Search size={22} className="shrink-0 text-brand-500" />
                <input
                  autoFocus
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Buscar rosas, jardines verticales, materas…"
                  className="w-full bg-transparent font-display text-xl outline-none placeholder:text-ink-muted/50 sm:text-2xl"
                />
                <button
                  onClick={closeSearch}
                  aria-label="Cerrar búsqueda"
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-full transition hover:bg-ink/5"
                >
                  <X size={19} />
                </button>
              </div>

              {q.length >= 2 && (
                <p className="py-4 text-sm text-ink-muted">
                  {results.length} resultado{results.length === 1 ? '' : 's'}
                </p>
              )}

              <div className="grid grid-cols-2 gap-3 pb-8 sm:grid-cols-3 lg:grid-cols-6">
                {results.map((p, i) => (
                  <motion.div
                    key={p.handle}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03, duration: 0.35, ease: EASE }}
                  >
                    <Link
                      to={`/products/${p.handle}`}
                      onClick={closeSearch}
                      className="group block overflow-hidden rounded-lg bg-white shadow-e1 transition-shadow hover:shadow-e4"
                    >
                      <div className="media-box aspect-square">
                        <img
                          src={p.image}
                          alt={p.title}
                          className="transition-transform duration-700 group-hover:scale-110"
                        />
                      </div>
                      <div className="p-2.5">
                        <p className="line-clamp-2 text-xs leading-snug">{p.title}</p>
                        <p className="mt-1 font-display text-sm text-brand-700">
                          {formatCOPShort(p.price)}
                        </p>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ---------------- toast ---------------- */

export function Toast() {
  const { toast, hideToast } = useUI();
  const openCart = useUI((s) => s.openCart);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(hideToast, 3200);
    return () => clearTimeout(t);
  }, [toast, hideToast]);

  return (
    // Positioning lives on this static wrapper. Putting the responsive
    // -translate-x-1/2 on the animated element would let Framer's transform
    // replace it, throwing the toast off-centre on phones.
    <div className="pointer-events-none fixed inset-x-0 bottom-24 z-[80] flex justify-center px-4 sm:bottom-8 sm:justify-end sm:px-8">
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 60, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 320, damping: 26 }}
            className="pointer-events-auto w-full max-w-[420px]"
          >
            <div className="flex items-center gap-3 rounded-xl bg-white p-4 shadow-e6">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand-500 text-white">
                <Check size={17} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">{toast.message}</p>
                {toast.title && (
                  <p className="truncate text-xs text-ink-muted">{toast.title}</p>
                )}
              </div>
              <button
                onClick={() => {
                  hideToast();
                  openCart();
                }}
                className="shrink-0 text-sm text-brand-600 underline-offset-2 hover:underline"
              >
                Ver
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
