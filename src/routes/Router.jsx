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
    className="flex items-center justify-center min-h-[60vh]"
    role="status"
    aria-label="Loading page"
  >
    <div className="text-center">
      <div
        className="animate-spin rounded-full h-12 w-12 border-4 border-gray-600 border-t-blue-500 mx-auto mb-3"
        aria-hidden="true"
      />
      <p className="text-gray-400 text-sm">Loading...</p>
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
