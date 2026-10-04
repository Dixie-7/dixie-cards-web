import { useRef, useState } from 'react';
import './App.css';
import { mainCardTitle } from './constants/userCardEditorOptions';
import LoginModal from './components/ui/Modal/LoginModal';
import MusicPlayer from './components/ui/MusicPlayer/MusicPlayer';
import ProjectsCarousel from './components/ui/Projects/ProjectsCarousel';
import MainCard from './components/ui/UserCards/MainCard';
import UserCardsCrudPanel from './components/ui/UserCards/UserCardsCrudPanel';
import { useAuth } from './hooks/useAuth';
import { useUserCardsCrud } from './hooks/useUserCardsCrud';

function App() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const loginButtonRef = useRef<HTMLButtonElement | null>(null);
  const { isAuthenticated, logout, user } = useAuth();
  const {
    cards,
    isLoading,
    error,
    createCard,
    updateCard,
    deleteCard,
    createBlock,
    updateBlock,
    deleteBlock,
  } = useUserCardsCrud();
  const mainCard = cards.find((card) => card.title === mainCardTitle);
  const portfolioCards = cards.filter(
    (card) => card.title !== mainCardTitle,
  );

  return (
    <main className="app-shell">
      <header className="app-actions">
        {isAuthenticated ? (
          <div className="flex items-center gap-3 rounded-lg border border-cyan-500/20 bg-zinc-950/80 px-4 py-2 text-sm text-zinc-100 shadow-lg shadow-cyan-950/10">
            <span className="hidden text-zinc-400 sm:inline">Sesion activa</span>
            <span className="font-semibold text-cyan-100">
              {user?.username ?? user?.email}
            </span>
            <button
              type="button"
              className="rounded-md border border-zinc-700 px-3 py-1.5 text-xs font-semibold text-zinc-100 transition hover:border-cyan-400 hover:text-cyan-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500"
              onClick={logout}
            >
              Salir
            </button>
          </div>
        ) : (
          <button
            ref={loginButtonRef}
            type="button"
            className="login-btn rounded-lg bg-zinc-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-cyan-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500 dark:bg-white dark:text-zinc-950 dark:hover:bg-cyan-100"
            onClick={() => setIsLoginModalOpen(true)}
          >
            Login
          </button>
        )}
      </header>

      {mainCard && <MainCard card={mainCard} />}

      <section className="portfolio-stage">
        <ProjectsCarousel />
      </section>

      <UserCardsCrudPanel
        cards={cards}
        displayCards={portfolioCards}
        isLoading={isLoading}
        error={error}
        onCreateCard={createCard}
        onUpdateCard={updateCard}
        onDeleteCard={deleteCard}
        onCreateBlock={createBlock}
        onUpdateBlock={updateBlock}
        onDeleteBlock={deleteBlock}
      />

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        restoreFocusRef={loginButtonRef}
      />

      <MusicPlayer />
    </main>
  );
}

export default App;
