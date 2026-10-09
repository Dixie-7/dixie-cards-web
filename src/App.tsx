import { useRef, useState } from 'react';
import './App.css';
import { mainCardTitle } from './constants/userCardEditorOptions';
import LoginModal from './components/ui/Modal/LoginModal';
import MusicPlayer from './components/ui/MusicPlayer/MusicPlayer';
import ContactCrudPanel from './components/ui/Contact/ContactCrudPanel';
import ContactSection from './components/ui/Contact/ContactSection';
import LanguagesCrudPanel from './components/ui/Languages/LanguagesCrudPanel';
import LanguagesSection from './components/ui/Languages/LanguagesSection';
import ProjectsCarousel from './components/ui/Projects/ProjectsCarousel';
import ProjectsCrudPanel from './components/ui/Projects/ProjectsCrudPanel';
import SkillsCrudPanel from './components/ui/Skills/SkillsCrudPanel';
import SkillsSection from './components/ui/Skills/SkillsSection';
import UserConfigModal from './components/ui/UserConfig/UserConfigModal';
import MainCard from './components/ui/UserCards/MainCard';
import UserCardsCrudPanel from './components/ui/UserCards/UserCardsCrudPanel';
import FloatingNavbar from './components/ui/Navbar/FloatingNavbar';
import { useAuth } from './hooks/useAuth';
import { useProjectsCrud } from './hooks/useProjectsCrud';
import { useSkillsCrud } from './hooks/useSkillsCrud';
import { useUserConfigCrud } from './hooks/useUserConfigCrud';
import { useUserContactCrud } from './hooks/useUserContactCrud';
import { useUserCardsCrud } from './hooks/useUserCardsCrud';
import { useUserLanguagesCrud } from './hooks/useUserLanguagesCrud';

function App() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const loginButtonRef = useRef<HTMLButtonElement | null>(null);
  const configButtonRef = useRef<HTMLButtonElement | null>(null);
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
    skills,
    isLoading: areSkillsLoading,
    error: skillsError,
    createSkill,
    updateSkill,
    deleteSkill,
  } = useSkillsCrud(token, user?.id ?? 7);
  const {
    languages,
    isLoading: areLanguagesLoading,
    error: languagesError,
    createLanguage,
    updateLanguage,
    deleteLanguage,
  } = useUserLanguagesCrud(token, user?.id ?? 7);
  const {
    contact,
    isLoading: isContactLoading,
    error: contactError,
    createContact,
    updateContact,
    deleteContact,
  } = useUserContactCrud(token, user?.id ?? 7);
  const {
    config: userConfig,
    isLoading: isConfigLoading,
    error: configError,
    updateConfig,
  } = useUserConfigCrud(token, user?.id ?? 7);
  const mainCard = cards.find((card) => card.title === mainCardTitle);
  const portfolioCards = cards.filter(
    (card) => card.title !== mainCardTitle,
  );
  const userLabel = user?.username ?? user?.email;

  return (
    <main id="home" className="app-shell">
      <FloatingNavbar
        isAuthenticated={isAuthenticated}
        isEditMode={isEditMode}
        userLabel={userLabel}
        loginButtonRef={loginButtonRef}
        configButtonRef={configButtonRef}
        onOpenLogin={() => setIsLoginModalOpen(true)}
        onOpenConfig={() => setIsConfigModalOpen(true)}
        onToggleEditMode={() => setIsEditMode((currentMode) => !currentMode)}
        onLogout={logout}
      />

      {mainCard && <MainCard card={mainCard} />}

      <div id="projects" className="app-section-anchor">
        {userConfig.showProjectsSection && (
          <section className="portfolio-stage">
            <ProjectsCarousel
              projects={projects}
              isLoading={areProjectsLoading}
              error={projectsError}
            />
          </section>
        )}

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
      </div>

      <div id="dcards" className="app-section-anchor">
        {(isEditMode || userConfig.showCardsSection) && (
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
        )}
      </div>

      <div id="skills" className="app-section-anchor">
        {userConfig.showSkillsSection && (
          <SkillsSection
            skills={skills}
            isLoading={areSkillsLoading}
            error={skillsError}
          />
        )}

        {isEditMode && (
          <SkillsCrudPanel
            skills={skills}
            isLoading={areSkillsLoading}
            error={skillsError}
            currentUserId={user?.id ?? 7}
            onCreateSkill={createSkill}
            onUpdateSkill={updateSkill}
            onDeleteSkill={deleteSkill}
          />
        )}
      </div>

      <div id="language" className="app-section-anchor">
        {userConfig.showLanguagesSection && (
          <LanguagesSection
            languages={languages}
            isLoading={areLanguagesLoading}
            error={languagesError}
            showPercent={userConfig.showLanguagePercent}
            showLevel={userConfig.showLanguageLevel}
          />
        )}

        {isEditMode && (
          <LanguagesCrudPanel
            languages={languages}
            isLoading={areLanguagesLoading}
            error={languagesError}
            currentUserId={user?.id ?? 7}
            onCreateLanguage={createLanguage}
            onUpdateLanguage={updateLanguage}
            onDeleteLanguage={deleteLanguage}
          />
        )}
      </div>

      <div id="contact" className="app-section-anchor">
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

        {userConfig.showContactSection && (
          <ContactSection
            contact={contact}
            isLoading={isContactLoading}
            error={contactError}
            visibility={userConfig}
          />
        )}
      </div>

      {isAuthenticated && (
        <UserConfigModal
          isOpen={isConfigModalOpen}
          onClose={() => setIsConfigModalOpen(false)}
          config={userConfig}
          isLoading={isConfigLoading}
          error={configError}
          onUpdateConfig={updateConfig}
          restoreFocusRef={configButtonRef}
        />
      )}

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
