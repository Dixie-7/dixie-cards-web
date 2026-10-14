import './App.css';
import { lazy, Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

const LandingPage = lazy(() => import('@/features/landing/pages/LandingPage'));
const PortfolioPage = lazy(
  () => import('@/features/portfolio/pages/PortfolioPage'),
);

function App() {
  return (
    <BrowserRouter>
      <Suspense
        fallback={
          <div
            className="grid min-h-screen place-items-center bg-zinc-950 text-sm font-medium text-zinc-400"
            role="status"
          >
            Loading Dixie Cards…
          </div>
        }
      >
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/portfolio" element={<PortfolioPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
