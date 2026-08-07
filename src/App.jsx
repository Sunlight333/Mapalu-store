import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { useScroll, useSpring } from 'framer-motion';

import Header from './components/layout/Header';
import Footer, { WhatsAppFab, ScrollProgress } from './components/layout/Footer';
import { CartDrawer, MobileMenu, SearchOverlay, Toast } from './components/layout/Drawers';
import Home from './pages/Home';
import Placeholder from './pages/Placeholder';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
}

export default function App() {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 28, restDelta: 0.001 });

  return (
    <div className="flex min-h-screen flex-col">
      <ScrollToTop />
      <ScrollProgress progress={progress} />
      <Header />

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/proyectos" element={<Placeholder title="Proyectos" />} />
          <Route path="/productos" element={<Placeholder title="Productos" />} />
          <Route path="/collections/:handle" element={<Placeholder />} />
          <Route path="/products/:handle" element={<Placeholder title="Detalle de producto" />} />
          <Route path="/favoritos" element={<Placeholder title="Favoritos" />} />
          <Route path="/contacto" element={<Placeholder title="Contacto · PQRS" />} />
          <Route path="/politicas/:slug" element={<Placeholder title="Políticas" />} />
          <Route
            path="*"
            element={<Placeholder title="Página no encontrada" note="El enlace que seguiste no existe." />}
          />
        </Routes>
      </main>

      <Footer />
      <WhatsAppFab />
      <CartDrawer />
      <MobileMenu />
      <SearchOverlay />
      <Toast />
    </div>
  );
}
