import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Plus, Check } from 'lucide-react';
import { useState } from 'react';
import { Tilt3D, staggerItem } from '../ui/motion';
import { formatCOPShort, discountPct, unitLabel } from '../../lib/format';
import { useStore, useUI } from '../../store/useStore';

const PLACEHOLDER =
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 4"%3E%3Crect width="3" height="4" fill="%23EFEDE7"/%3E%3C/svg%3E';

export default function ProductCard({ product, index = 0, variant = 'default' }) {
  const [added, setAdded] = useState(false);
  const addItem = useStore((s) => s.addItem);
  const wishlist = useStore((s) => s.wishlist);
  const toggleWish = useStore((s) => s.toggleWish);
  const showToast = useUI((s) => s.showToast);

  const off = discountPct(product.price, product.compareAtPrice);
  const wished = wishlist.includes(product.handle);
  const isProject = product.isProject;

  const quickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      handle: product.handle,
      title: product.title,
      price: product.price,
      image: product.image,
      qty: 1,
      unit: product.priceUnit,
    });
    setAdded(true);
    showToast({ message: '¡Añadido exitosamente!', title: product.title });
    setTimeout(() => setAdded(false), 1600);
  };

  return (
    <motion.div variants={staggerItem} custom={index} className="h-full">
      <Tilt3D max={7} lift={18} className="h-full">
        <Link
          to={`/products/${product.handle}`}
          className="group relative flex h-full flex-col overflow-hidden rounded-xl bg-white shadow-e2 transition-shadow duration-500 hover:shadow-e5"
        >
          {/* Media */}
          <div className="media-box aspect-[3/4] overflow-hidden">
            <img
              src={product.image || PLACEHOLDER}
              alt={product.title}
              loading={index < 4 ? 'eager' : 'lazy'}
              decoding="async"
              className="transition-transform duration-[900ms] ease-grow group-hover:scale-[1.07]"
              onError={(e) => {
                e.currentTarget.src = PLACEHOLDER;
              }}
            />

            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/25 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

            {/* Badges */}
            <div className="pointer-events-none absolute left-3 top-3 flex flex-col gap-1.5">
              {off > 0 && (
                <span className="rounded-pill bg-sand-400 px-2.5 py-1 text-2xs font-semibold uppercase tracking-wider text-ink shadow-e2">
                  -{off}%
                </span>
              )}
              {isProject && (
                <span className="rounded-pill bg-brand-500 px-2.5 py-1 text-2xs font-semibold uppercase tracking-wider text-white shadow-e2">
                  Proyecto
                </span>
              )}
              {!product.available && (
                <span className="rounded-pill bg-ink/80 px-2.5 py-1 text-2xs font-semibold uppercase tracking-wider text-white">
                  Agotado
                </span>
              )}
            </div>

            {/* Wishlist */}
            <button
              type="button"
              aria-label={wished ? 'Quitar de favoritos' : 'Añadir a favoritos'}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleWish(product.handle);
              }}
              className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/85 text-ink shadow-e2 backdrop-blur transition-all duration-300 hover:scale-110 hover:bg-white sm:opacity-0 sm:group-hover:opacity-100"
            >
              <Heart
                size={15}
                className={wished ? 'fill-sand-500 text-sand-500' : ''}
              />
            </button>

            {/* Quick add — projects go to the estimator instead */}
            {!isProject && product.available && (
              <button
                type="button"
                onClick={quickAdd}
                aria-label={`Añadir ${product.title} al carrito`}
                className="absolute bottom-3 right-3 grid h-11 w-11 translate-y-2 place-items-center rounded-full bg-brand-500 text-white opacity-0 shadow-glow transition-all duration-300 hover:scale-110 hover:bg-brand-600 group-hover:translate-y-0 group-hover:opacity-100 focus-visible:translate-y-0 focus-visible:opacity-100"
              >
                {added ? <Check size={17} /> : <Plus size={17} />}
              </button>
            )}
          </div>

          {/* Body */}
          <div className="flex flex-1 flex-col p-4 sm:p-5">
            {product.productType && (
              <span className="eyebrow mb-1.5 text-ink-muted/70">{product.productType}</span>
            )}
            <h3 className="text-pretty font-display text-base leading-snug text-ink transition-colors duration-300 group-hover:text-brand-600 sm:text-lg">
              {product.title}
            </h3>

            <div className="mt-auto flex flex-wrap items-baseline gap-x-2 gap-y-0.5 pt-3">
              {isProject && (
                <span className="text-sm text-ink-muted">desde</span>
              )}
              <span className="font-display text-xl text-brand-700">
                {formatCOPShort(product.price)}
              </span>
              {product.compareAtPrice > product.price && (
                <span className="text-base text-ink-muted line-through">
                  {formatCOPShort(product.compareAtPrice)}
                </span>
              )}
              {unitLabel(product.priceUnit) && (
                <span className="text-sm text-ink-muted">{unitLabel(product.priceUnit)}</span>
              )}
            </div>
          </div>

          {/* Bottom hairline that fills on hover */}
          <span className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-brand-sheen transition-transform duration-500 ease-grow group-hover:scale-x-100" />
        </Link>
      </Tilt3D>
    </motion.div>
  );
}
