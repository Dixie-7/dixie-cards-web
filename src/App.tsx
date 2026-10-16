import './App.css';
import { lazy, Suspense, type ReactNode } from 'react';
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
  useParams,
} from 'react-router-dom';
import { AuthProvider } from '@/features/auth/context/AuthProvider';
import { useAuth } from '@/features/auth/hooks/useAuth';

const LandingPage = lazy(() => import('@/features/landing/pages/LandingPage'));
const PortfolioPage = lazy(
  () => import('@/features/portfolio/pages/PortfolioPage'),
);
const PublicPortfolioPage = lazy(
  () => import('@/features/public-portfolio/pages/PublicPortfolioPage'),
);

const reservedPublicUsernames = new Set([
  'dashboard',
  'login',
  'portfolio',
  'settings',
  'verify-email',
]);

function withAuthProvider(element: ReactNode) {
  return <AuthProvider>{element}</AuthProvider>;
}

function PublicPortfolioRoute() {
  const { username } = useParams();

  if (username && reservedPublicUsernames.has(username.toLowerCase())) {
    return <Navigate to="/" replace />;
  }

  return <PublicPortfolioPage />;
}

function ProtectedPortfolioRoute() {
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/"
        replace
        state={{ authMode: 'login', returnTo: location.pathname }}
      />
    );
  }

  return <PortfolioPage />;
}

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
          <Route path="/" element={withAuthProvider(<LandingPage />)} />
          <Route
            path="/portfolio"
            element={withAuthProvider(<ProtectedPortfolioRoute />)}
          />
          <Route
            path="/:username"
            element={withAuthProvider(<PublicPortfolioRoute />)}
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
