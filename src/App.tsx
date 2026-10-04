import { useState } from 'react';
import './App.css';
import { mainCardTitle } from './constants/userCardEditorOptions';
import LoginModal from './components/ui/Modal/LoginModal';
import ProjectsCarousel from './components/ui/Projects/ProjectsCarousel';
import MainCard from './components/ui/UserCards/MainCard';
import UserCardsCrudPanel from './components/ui/UserCards/UserCardsCrudPanel';
import { useUserCardsCrud } from './hooks/useUserCardsCrud';

function App() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
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
        <button
          type="button"
          className="login-btn rounded-lg bg-zinc-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-cyan-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500 dark:bg-white dark:text-zinc-950 dark:hover:bg-cyan-100"
          onClick={() => setIsLoginModalOpen(true)}
        >
          Login
        </button>
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
      />
    </main>
  );
}

export default App;
