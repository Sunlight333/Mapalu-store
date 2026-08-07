// Colombian peso formatting. Shopify money_format is ${{amount_with_comma_separator}}
// => "." thousands, "," decimals, bare "$" (never the "COP" ISO prefix).
const nf = new Intl.NumberFormat('es-CO', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const nfCompact = new Intl.NumberFormat('es-CO', {
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

export const formatCOP = (n) => '$' + nf.format(Number(n) || 0);

/** Grid/card price — no cents, easier to scan across a 4-up grid. */
export const formatCOPShort = (n) => '$' + nfCompact.format(Number(n) || 0);

export const discountPct = (price, compareAt) => {
  if (!compareAt || compareAt <= price) return 0;
  return Math.round(((compareAt - price) / compareAt) * 100);
};

export const unitLabel = (priceUnit) =>
  priceUnit === 'm2' ? '/ m²' : priceUnit === 'ml' ? '/ m lineal' : '';

/**
 * Strips Shopify rich-text down to tags we actually style, and drops the
 * page-builder classes (PDq2pG_selectionAnchorContainer et al) that carry no
 * styles outside the old theme.
 */
export function sanitizeDescription(html) {
  if (!html) return '';
  return html
    .replace(/<\s*(script|style|iframe|object|embed)[^>]*>[\s\S]*?<\s*\/\s*\1\s*>/gi, '')
    .replace(/\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
    .replace(/\s(class|id|style|data-[\w-]+)\s*=\s*("[^"]*"|'[^']*')/gi, '')
    .replace(/<\/?(?!\/?(?:h3|h4|p|ul|ol|li|strong|em|br|span)\b)[a-z][^>]*>/gi, '');
}

export const excerpt = (html, len = 155) => {
  const text = (html || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return text.length > len ? text.slice(0, len).replace(/\s\S*$/, '') + '…' : text;
};

export const slugTitle = (s = '') =>
  s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
