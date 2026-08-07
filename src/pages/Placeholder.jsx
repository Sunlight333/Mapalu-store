import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Hammer } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { EASE } from '../components/ui/motion';
import { getCollection } from '../lib/catalog';

/**
 * Interim page for routes beyond the landing page.
 * Keeps the client demo intact — every link resolves to a real, on-brand
 * screen instead of a 404 or a blank error boundary.
 */
export default function Placeholder({ title, note }) {
  const params = useParams();
  const collection = params.handle ? getCollection(params.handle) : null;
  const heading = collection?.title || title || 'Próximamente';

  return (
    <div className="flex min-h-[78svh] items-center justify-center px-5 pb-24 pt-40">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE }}
        className="w-full max-w-lg text-center"
      >
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-brand-50 text-brand-500 shadow-e2">
          <Hammer size={24} />
        </span>

        <h1 className="mt-7 font-display text-3xl text-ink sm:text-4xl">{heading}</h1>

        <p className="text-pretty mt-4 text-ink-muted">
          {note ||
            'Esta sección está en construcción. La landing page ya está lista para revisión.'}
        </p>

        {collection && (
          <p className="mt-3 text-sm text-ink-muted">
            {collection.productCount} producto{collection.productCount === 1 ? '' : 's'} listos
            para esta colección.
          </p>
        )}

        <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
          <Button to="/" variant="primary">
            <ArrowLeft size={16} /> Volver al inicio
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
