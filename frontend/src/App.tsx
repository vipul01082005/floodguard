import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AppProvider } from './contexts/AppContext';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';

// Import pages - using named imports where no default export exists
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// These use named exports, so we import them differently
const DashboardPageWrapper = React.lazy(() =>
  import('./pages/DashboardPage').then(m => ({ default: m.DashboardPage }))
);
const ReportPageWrapper = React.lazy(() =>
  import('./pages/ReportPage').then(m => ({ default: m.ReportPage }))
);
const AlertsPageWrapper = React.lazy(() =>
  import('./pages/AlertsPage').then(m => ({ default: m.AlertsPage }))
);
const RoutePlannerPageWrapper = React.lazy(() =>
  import('./pages/RoutePlannerPage').then(m => ({ default: m.RoutePlannerPage }))
);
const AdminPageWrapper = React.lazy(() =>
  import('./pages/AdminPage').then(m => ({ default: m.AdminPage }))
);
const SystemHealthPageWrapper = React.lazy(() =>
  import('./pages/SystemHealthPage').then(m => ({ default: m.SystemHealthPage }))
);

const NotFound: React.FC = () => (
  <div className="flex-1 flex items-center justify-center p-8">
    <div className="text-center">
      <h1 className="text-6xl font-bold text-surface-400 mb-4">404</h1>
      <p className="text-xl text-surface-400 mb-6">Page not found</p>
      <a
        href="/"
        className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
      >
        Return to FloodGuard
      </a>
    </div>
  </div>
);

const LoadingFallback: React.FC = () => (
  <div className="flex-1 flex items-center justify-center">
    <div className="flex flex-col items-center gap-3">
      <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      <p className="text-surface-400 text-sm">Loading...</p>
    </div>
  </div>
);

export const App: React.FC = () => {
  return (
    <AppProvider>
      <div className="min-h-screen flex flex-col bg-surface-950 text-surface-100 font-sans selection:bg-blue-500/30">
        <Header />
        <main className="flex-1 flex flex-col">
          <React.Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/dashboard" element={<DashboardPageWrapper />} />
              <Route path="/routes" element={<RoutePlannerPageWrapper />} />
              <Route path="/report" element={<ReportPageWrapper />} />
              <Route path="/alerts" element={<AlertsPageWrapper />} />
              <Route path="/admin" element={<AdminPageWrapper />} />
              <Route path="/system-health" element={<SystemHealthPageWrapper />} />
              <Route path="/auth/login" element={<LoginPage />} />
              <Route path="/auth/register" element={<RegisterPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </React.Suspense>
        </main>
        <Footer />
      </div>
    </AppProvider>
  );
};

export default App;
