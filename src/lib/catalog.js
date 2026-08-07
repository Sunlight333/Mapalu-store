import indexData from '../data/product-index.json';
import collectionsData from '../data/collections.json';

/**
 * Seven collections on the live Shopify store render zero products even though
 * four of them sit in the main navigation (see docs/01-sitemap-routes.md).
 * The products still exist — they were just detached from the collection.
 * We rebuild membership from product_type / tags so no nav link dead-ends.
 */
const BACKFILL = {
  'ramas-de-follaje': (p) =>
    p.productType === 'follaje' || p.tags.some((t) => /follaje/i.test(t)),
  'helechos-y-ramas': (p) =>
    p.productType === 'helecho' || p.tags.some((t) => /helecho/i.test(t)),
  'ramas-para-arbol': (p) =>
    p.productType === 'ramas artificiales' ||
    p.tags.some((t) => /rama(s)? (artificial|para arbol)/i.test(t)),
  extras: (p) =>
    p.productType === 'materas' || p.tags.some((t) => /matera/i.test(t)),
  orquideas: (p) =>
    p.productType === 'orquidea' || p.tags.some((t) => /orquide/i.test(t)),
  'flores-en-oferta': (p) => !!p.compareAtPrice && p.compareAtPrice > p.price,
};

/** Near-duplicate / empty collections that shouldn't get their own route. */
const DROP = new Set(['paredes-1', 'glicina']);

export const products = indexData;

export const productsByHandle = Object.fromEntries(
  indexData.map((p) => [p.handle, p]),
);

export const collections = collectionsData
  .filter((c) => !DROP.has(c.handle))
  .map((c) => {
    let handles = c.productHandles || [];
    let backfilled = false;
    if (handles.length === 0 && BACKFILL[c.handle]) {
      handles = indexData.filter(BACKFILL[c.handle]).map((p) => p.handle);
      backfilled = handles.length > 0;
    }
    return { ...c, productHandles: handles, productCount: handles.length, backfilled };
  });

export const collectionsByHandle = Object.fromEntries(
  collections.map((c) => [c.handle, c]),
);

export const getCollection = (handle) => {
  if (handle === 'all') {
    return {
      handle: 'all',
      title: 'Todos los productos',
      description: 'El catálogo completo de Mapalu Store.',
      productHandles: indexData.map((p) => p.handle),
      productCount: indexData.length,
      image: null,
    };
  }
  return collectionsByHandle[handle] || null;
};

export const getCollectionProducts = (handle) => {
  const c = getCollection(handle);
  if (!c) return [];
  return c.productHandles.map((h) => productsByHandle[h]).filter(Boolean);
};

export const projects = indexData.filter((p) => p.isProject);

/** Projects grouped by surface, in the order the live site presents them. */
export const projectGroups = [
  {
    handle: 'paredes',
    title: 'Paredes',
    subtitle: 'Muros verdes y florales, para interiores y exteriores',
  },
  { handle: 'techos', title: 'Techos', subtitle: 'Cerezos, glicinas y decoración colgante' },
  { handle: 'pisos', title: 'Pisos', subtitle: 'Grama sintética para terrazas y exteriores' },
].map((g) => ({
  ...g,
  items: (collectionsByHandle[g.handle]?.productHandles || [])
    .map((h) => productsByHandle[h])
    .filter(Boolean),
}));

/** Main navigation — labels and order taken from the live header. */
export const navCategories = [
  { label: 'Jardines Verticales', handle: 'jardines-verticales' },
  { label: 'Decoración Colgante', handle: 'decoracion-colgante' },
  { label: 'Grama Sintética', handle: 'grama-sintetica' },
  { label: 'Flores', handle: 'flores' },
  { label: 'Ramas de Follaje', handle: 'ramas-de-follaje' },
  { label: 'Plantas para Materas', handle: 'planta-para-materas' },
  { label: 'Pampas', handle: 'pampas' },
  { label: 'Cerezos', handle: 'cerzas-1' },
  { label: 'Helechos', handle: 'helechos-y-ramas' },
  { label: 'Ramas para Árbol', handle: 'ramas-para-arbol' },
  { label: 'Materas', handle: 'extras' },
  { label: 'Orquídeas', handle: 'orquideas' },
].filter((n) => (collectionsByHandle[n.handle]?.productCount ?? 0) > 0);

/** Homepage category tiles, with the imagery the live site uses. */
export const featuredCategories = [
  {
    handle: 'jardines-verticales',
    label: 'Jardines Verticales',
    image: '/assets/images/collections/image_copy_11_409c194e-859e-441f-8406-46de18ed97a3.png',
  },
  {
    handle: 'decoracion-colgante',
    label: 'Decoración Colgante',
    image: '/assets/images/content/WhatsAppImage2025-06-04at3.23.40PM_2.jpg',
  },
  {
    handle: 'flores',
    label: 'Flores',
    image: '/assets/images/content/WhatsAppImage2026-06-10at4.10.13PM.jpg',
  },
  {
    handle: 'planta-para-materas',
    label: 'Planta para materas',
    image: '/assets/images/content/WhatsAppImage2026-08-05at3.27.04PM.jpg',
  },
  {
    handle: 'cerzas-1',
    label: 'Cerezos',
    image: '/assets/images/content/WhatsAppImage2025-12-17at5.01.09PM_1.jpg',
  },
  {
    handle: 'grama-sintetica',
    label: 'Grama Sintética',
    image: '/assets/images/content/WhatsApp_Image_2026-08-02_at_10.44.10_PM.jpg',
  },
];

export const HERO_IMAGE = '/assets/images/content/WhatsApp_Image_2026-08-03_at_4.12.03_PM.jpg';

/** Lazily loaded full product records (1.7 MB) — only needed on product pages. */
let fullCache = null;
let fullPromise = null;

export function loadFullProducts() {
  if (fullCache) return Promise.resolve(fullCache);
  if (!fullPromise) {
    fullPromise = fetch('/data/products.json')
      .then((r) => {
        if (!r.ok) throw new Error(`products.json ${r.status}`);
        return r.json();
      })
      .then((list) => {
        fullCache = Object.fromEntries(list.map((p) => [p.handle, p]));
        return fullCache;
      })
      .catch((err) => {
        fullPromise = null; // allow a retry on the next mount
        throw err;
      });
  }
  return fullPromise;
}

export const relatedTo = (product, limit = 8) => {
  if (!product) return [];
  const pool = indexData.filter((p) => p.handle !== product.handle);
  const score = (p) => {
    let s = 0;
    if (p.productType && p.productType === product.productType) s += 5;
    s += p.tags.filter((t) => product.tags.includes(t)).length * 2;
    s += p.collections.filter((c) => product.collections.includes(c)).length;
    if (p.isProject === product.isProject) s += 1;
    return s;
  };
  return pool
    .map((p) => ({ p, s: score(p) }))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s)
    .slice(0, limit)
    .map((x) => x.p);
};

export function searchProducts(query, limit = 24) {
  const q = query.trim().toLowerCase();
  if (q.length < 2) return [];
  const terms = q.split(/\s+/);
  return indexData
    .map((p) => {
      const hay = `${p.title} ${p.productType} ${p.tags.join(' ')}`.toLowerCase();
      const hits = terms.filter((t) => hay.includes(t)).length;
      if (hits < terms.length) return null;
      const starts = p.title.toLowerCase().startsWith(terms[0]) ? 3 : 0;
      return { p, s: hits + starts };
    })
    .filter(Boolean)
    .sort((a, b) => b.s - a.s)
    .slice(0, limit)
    .map((x) => x.p);
}
