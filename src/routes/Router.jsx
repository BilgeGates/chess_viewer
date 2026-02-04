import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

// Lazy load pages for better performance
const HomePage = lazy(() => import('../pages/HomePage'));
const AboutPage = lazy(() => import('../pages/AboutPage'));
const DownloadPage = lazy(() => import('../pages/DownloadPage'));
const SupportPage = lazy(() => import('../pages/SupportPage'));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'));

// Simple loading fallback
const PageLoader = () => (
  <div
    className="flex items-center justify-center min-h-[70vh]"
    role="status"
    aria-label="Loading page"
  >
    <div className="text-center">
      {/* Elegant Chess-Themed Spinner */}
      <div className="relative w-20 h-20 mx-auto mb-6">
        <div className="absolute inset-0 rounded-2xl border-4 border-accent/20" />
        <div className="absolute inset-0 rounded-2xl border-4 border-accent border-t-transparent animate-spin" />
        <div className="absolute inset-3 rounded-xl bg-gradient-to-br from-accent/10 to-accent/5 flex items-center justify-center">
          <div className="w-6 h-6 rounded-lg bg-accent/30 animate-pulse" />
        </div>
      </div>
      <p className="text-text-secondary text-sm font-semibold tracking-wide">
        Loading...
      </p>
    </div>
  </div>
);

const AppRoutes = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/download" element={<DownloadPage />} />
        <Route path="/support" element={<SupportPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
