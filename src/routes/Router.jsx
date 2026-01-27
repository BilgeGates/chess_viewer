import { Routes, Route } from 'react-router-dom';

import { HomePage, AboutPage, DownloadPage, SupportPage } from '../pages';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/download" element={<DownloadPage />} />
      <Route path="/support" element={<SupportPage />} />
    </Routes>
  );
};

export default AppRoutes;
