import { useRef, useState } from 'react';
import './App.css';
import { mainCardTitle } from './constants/userCardEditorOptions';
import LoginModal from './components/ui/Modal/LoginModal';
import MusicPlayer from './components/ui/MusicPlayer/MusicPlayer';
import ContactCrudPanel from './components/ui/Contact/ContactCrudPanel';
import ContactSection from './components/ui/Contact/ContactSection';
import ProjectsCarousel from './components/ui/Projects/ProjectsCarousel';
import ProjectsCrudPanel from './components/ui/Projects/ProjectsCrudPanel';
import MainCard from './components/ui/UserCards/MainCard';
import UserCardsCrudPanel from './components/ui/UserCards/UserCardsCrudPanel';
import { useAuth } from './hooks/useAuth';
import { useProjectsCrud } from './hooks/useProjectsCrud';
import { useUserContactCrud } from './hooks/useUserContactCrud';
import { useUserCardsCrud } from './hooks/useUserCardsCrud';

function App() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const loginButtonRef = useRef<HTMLButtonElement | null>(null);
  const { isAuthenticated, logout, token, user } = useAuth();
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
  const {
    projects,
    isLoading: areProjectsLoading,
    error: projectsError,
    createProject,
    updateProject,
    deleteProject,
  } = useProjectsCrud(token);
  const {
    contact,
    isLoading: isContactLoading,
    error: contactError,
    createContact,
    updateContact,
    deleteContact,
  } = useUserContactCrud(token, user?.id ?? 7);
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
              className={`rounded-md px-3 py-1.5 text-xs font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500 ${
                isEditMode
                  ? 'bg-cyan-600 text-white hover:bg-cyan-500'
                  : 'border border-zinc-700 text-zinc-100 hover:border-cyan-400 hover:text-cyan-100'
              }`}
              onClick={() => setIsEditMode((currentMode) => !currentMode)}
            >
              {isEditMode ? 'Exit edit mode' : 'Edit mode'}
            </button>
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
        <ProjectsCarousel
          projects={projects}
          isLoading={areProjectsLoading}
          error={projectsError}
        />
      </section>

      {isEditMode && (
        <ProjectsCrudPanel
          projects={projects}
          isLoading={areProjectsLoading}
          error={projectsError}
          currentUserId={user?.id ?? 7}
          onCreateProject={createProject}
          onUpdateProject={updateProject}
          onDeleteProject={deleteProject}
        />
      )}

      <UserCardsCrudPanel
        key={isEditMode ? 'cards-edit' : 'cards-view'}
        cards={cards}
        displayCards={portfolioCards}
        isEditMode={isEditMode}
        isLoading={isLoading}
        error={error}
        onCreateCard={createCard}
        onUpdateCard={updateCard}
        onDeleteCard={deleteCard}
        onCreateBlock={createBlock}
        onUpdateBlock={updateBlock}
        onDeleteBlock={deleteBlock}
      />

      {isEditMode && (
        <ContactCrudPanel
          contact={contact}
          isLoading={isContactLoading}
          error={contactError}
          currentUserId={user?.id ?? 7}
          onCreateContact={createContact}
          onUpdateContact={updateContact}
          onDeleteContact={deleteContact}
        />
      )}

      <ContactSection
        contact={contact}
        isLoading={isContactLoading}
        error={contactError}
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
