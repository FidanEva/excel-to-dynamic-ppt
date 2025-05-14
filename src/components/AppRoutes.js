import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Import pages
import Dashboard from '../pages/Dashboard';
import UploadFiles from '../pages/UploadFiles';
import ChartViewer from '../pages/ChartViewer';
import PdfExport from '../pages/PdfExport';
// import Settings from '../pages/Settings';
// import NotFound from '../pages/NotFound';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/upload" element={<UploadFiles />} />
      <Route path="/charts" element={<ChartViewer />} />
      <Route path="/export" element={<PdfExport />} />
      {/*<Route path="/settings" element={<Settings />} />
      <Route path="/404" element={<NotFound />} />
      <Route path="*" element={<Navigate to="/404" replace />} /> */}
    </Routes>
  );
};

export default AppRoutes;