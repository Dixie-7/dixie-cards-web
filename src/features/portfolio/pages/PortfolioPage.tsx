import { useRef, useState } from 'react';
import LoginModal from '@/features/auth/components/LoginModal';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { mainCardTitle } from '@/features/cards/constants/cardEditorOptions';
import MainCard from '@/features/cards/components/MainCard';
import UserCardsEditorPanel from '@/features/cards/components/UserCardsEditorPanel';
import { useUserCards } from '@/features/cards/hooks/useUserCards';
import ContactEditorPanel from '@/features/contact/components/ContactEditorPanel';
import ContactSection from '@/features/contact/components/ContactSection';
import { useContact } from '@/features/contact/hooks/useContact';
import LanguagesEditorPanel from '@/features/languages/components/LanguagesEditorPanel';
import LanguagesSection from '@/features/languages/components/LanguagesSection';
import { useLanguages } from '@/features/languages/hooks/useLanguages';
import MusicPlayer from '@/features/music-player/components/MusicPlayer';
import ProjectsCarousel from '@/features/projects/components/ProjectsCarousel';
import ProjectsEditorPanel from '@/features/projects/components/ProjectsEditorPanel';
import { useProjects } from '@/features/projects/hooks/useProjects';
import SkillsEditorPanel from '@/features/skills/components/SkillsEditorPanel';
import SkillsSection from '@/features/skills/components/SkillsSection';
import { useSkills } from '@/features/skills/hooks/useSkills';
import UserConfigModal from '@/features/user-config/components/UserConfigModal';
import { useUserConfig } from '@/features/user-config/hooks/useUserConfig';
import FloatingNavbar from '@/shared/components/FloatingNavbar';

function PortfolioPage() {
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
  } = useUserCards();
  const {
    projects,
    isLoading: areProjectsLoading,
    error: projectsError,
    createProject,
    updateProject,
    deleteProject,
  } = useProjects(token);
  const {
    skills,
    isLoading: areSkillsLoading,
    error: skillsError,
    createSkill,
    updateSkill,
    deleteSkill,
  } = useSkills(token, user?.id ?? 7);
  const {
    languages,
    isLoading: areLanguagesLoading,
    error: languagesError,
    createLanguage,
    updateLanguage,
    deleteLanguage,
  } = useLanguages(token, user?.id ?? 7);
  const {
    contact,
    isLoading: isContactLoading,
    error: contactError,
    createContact,
    updateContact,
    deleteContact,
  } = useContact(token, user?.id ?? 7);
  const {
    config: userConfig,
    isLoading: isConfigLoading,
    error: configError,
    updateConfig,
  } = useUserConfig(token, user?.id ?? 7);
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
          <ProjectsEditorPanel
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
          <UserCardsEditorPanel
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
          <SkillsEditorPanel
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
          <LanguagesEditorPanel
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
          <ContactEditorPanel
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

export default PortfolioPage;
