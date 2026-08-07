/**
 * Project estimator — reverse-engineered from the live Shopify site's
 * data-* attributes. Full provenance in docs/08-project-calculator.md.
 *
 * Two modes:
 *   area      → Ancho × Alto, charged per whole m²
 *   unidades  → Largo × Grosor, charged per whole unit (linear metre)
 *
 * Slack (holgura) is applied BEFORE rounding up, matching the stated intent
 * of "avoid patching small sections". See the caveat in the docs.
 */

export function estimate(cfg, a, b, opts = {}) {
  const width = Math.max(0, Number(a) || 0);
  const height = Math.max(0, Number(b) || 0);
  const raw = width * height;

  const slackApplied = opts.slack && cfg.slackPct > 0;
  const withSlack = slackApplied ? raw * (1 + cfg.slackPct / 100) : raw;

  // Both modes round UP to a whole unit.
  const qty = raw > 0 ? Math.ceil(withSlack) : 0;

  const bulkActive =
    !!cfg.bulkPrice && !!cfg.bulkMinQty && cfg.bulkPrice < cfg.price && qty >= cfg.bulkMinQty;
  const unitPrice = bulkActive ? cfg.bulkPrice : cfg.price;

  const projectTotal = qty * unitPrice;
  const kitTotal = opts.kit && cfg.kitPricePerM2 ? qty * cfg.kitPricePerM2 : 0;
  const prearmadoTotal = opts.prearmado && cfg.prearmadoPrice ? cfg.prearmadoPrice : 0;

  return {
    rawArea: raw,
    qty,
    unitPrice,
    bulkActive,
    slackApplied,
    projectTotal,
    kitTotal,
    prearmadoTotal,
    total: projectTotal + kitTotal + prearmadoTotal,
  };
}

/** Copy differs per mode — taken verbatim from the live site. */
export const estimatorCopy = (cfg) =>
  cfg.mode === 'unidades'
    ? {
        title: 'Calcula tu proyecto',
        inputA: 'Largo (metros)',
        inputB: 'Grosor (metros)',
        qtyLabel: 'Unidades necesarias',
        unitSuffix: 'und',
        rounding: 'Redondeamos a la unidad completa. Valor estimado, sujeto a confirmación.',
        slackLabel: `Incrementar ${cfg.slackPct}% para que quede más tupido`,
        slackHelp: 'Recomendado para un acabado más denso, sin espacios visibles.',
        perUnit: 'por unidad',
        prompt: 'Ingresa el largo que quieres cubrir',
      }
    : {
        title: 'Calcula tu proyecto',
        inputA: 'Ancho (metros)',
        inputB: 'Alto (metros)',
        qtyLabel: 'Área',
        unitSuffix: 'm²',
        rounding:
          'Se cobra por metro cuadrado completo. Redondeamos al siguiente metro cuadrado completo. Valor estimado, sujeto a confirmación.',
        slackLabel: `Agregar ${cfg.slackPct}% adicional recomendado`,
        slackHelp: 'Evita remiendos y tramos pequeños durante la instalación.',
        perUnit: 'por m²',
        prompt: 'Ingresa las medidas de tu pared',
      };

export const WHATSAPP = '573234021053';

export function whatsappQuoteUrl({ title, qty, unitSuffix, total, formatted }) {
  const msg =
    `Hola Mapalu 👋 Estoy interesado en *${title}*.\n` +
    (qty ? `Calculé ${qty} ${unitSuffix} · Total estimado ${formatted}\n` : '') +
    `¿Me pueden asesorar?`;
  return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`;
}
