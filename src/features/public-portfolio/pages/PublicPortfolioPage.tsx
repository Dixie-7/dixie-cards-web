import { useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import LoginModal from '@/features/auth/components/LoginModal';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { mainCardTitle } from '@/features/cards/constants/cardEditorOptions';
import MainCard from '@/features/cards/components/MainCard';
import UserCardsSection from '@/features/cards/components/UserCardsSection';
import ContactSection from '@/features/contact/components/ContactSection';
import LanguagesSection from '@/features/languages/components/LanguagesSection';
import MusicPlayer from '@/features/music-player/components/MusicPlayer';
import ProjectsCarousel from '@/features/projects/components/ProjectsCarousel';
import CvSection from '@/features/public-portfolio/components/CvSection';
import { usePublicPortfolio } from '@/features/public-portfolio/hooks/usePublicPortfolio';
import type { PublicPortfolio } from '@/features/public-portfolio/types/publicPortfolio.types';
import SkillsSection from '@/features/skills/components/SkillsSection';
import { defaultUserConfigPayload } from '@/features/user-config/types/userConfig.types';
import FloatingNavbar, {
  type FloatingNavbarItem,
} from '@/shared/components/FloatingNavbar';
import ParticlesBackground from '@/shared/components/Background/ParticlesBackground';
import LoadingState from '@/shared/components/LoadingState';
import { useLanguage } from '@/shared/i18n/useLanguage';

const publicContactVisibility = {
  ...defaultUserConfigPayload,
  showEmail: true,
  showAltEmail: true,
  showPhone: true,
  showAltPhone: true,
  showInstagram: true,
  showGitHub: true,
  showFacebook: true,
  showLinkedIn: true,
  showWebsite: true,
};

function getDisplayName(portfolio: PublicPortfolio) {
  const displayName = [portfolio.name, portfolio.lastName]
    .map((value) => value?.trim())
    .filter(Boolean)
    .join(' ');

  return displayName || portfolio.username;
}

function PublicPortfolioHero({ portfolio }: { portfolio: PublicPortfolio }) {
  return (
    <section className="w-full px-4 pb-8 pt-6">
      <div className="mx-auto max-w-5xl rounded-lg border border-cyan-400/20 bg-zinc-950/80 px-5 py-10 text-left shadow-2xl shadow-black/20">
        <p className="text-sm font-semibold text-cyan-300">
          @{portfolio.username}
        </p>
        <h1 className="mt-3 text-4xl font-bold text-white">
          {getDisplayName(portfolio)}
        </h1>
      </div>
    </section>
  );
}

function PublicPortfolioStatus({
  message,
  title,
}: {
  message: string;
  title: string;
}) {
  return (
    <main id="home" className="app-shell">
      <section className="grid min-h-[60vh] place-items-center px-4 text-center">
        <div className="max-w-md rounded-lg border border-zinc-800 bg-zinc-950/80 p-6 shadow-2xl shadow-black/20">
          <p className="text-sm font-semibold text-cyan-300">Dixie Cards</p>
          <h1 className="mt-3 text-3xl font-bold text-white">{title}</h1>
          <p className="mt-3 text-sm leading-6 text-zinc-300">{message}</p>
        </div>
      </section>
    </main>
  );
}

function PublicPortfolioPage() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { username } = useParams();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const loginButtonRef = useRef<HTMLButtonElement | null>(null);
  const configButtonRef = useRef<HTMLButtonElement | null>(null);
  const { isAuthenticated } = useAuth();
  const { portfolio, isLoading, error, isNotFound } =
    usePublicPortfolio(username);

  if (isLoading) {
    return <LoadingState variant="screen" label={t('loadingPortfolio')} />;
  }

  if (error || !portfolio) {
    return (
      <PublicPortfolioStatus
        title={isNotFound ? t('portfolioNotFound') : t('portfolioLoadError')}
        message={
          error ?? t('portfolioLoadErrorMessage')
        }
      />
    );
  }

  const mainCard = portfolio.cards.find((card) => card.title === mainCardTitle);
  const portfolioCards = portfolio.cards.filter(
    (card) => card.title !== mainCardTitle,
  );
  const hasPublicContent =
    Boolean(mainCard) ||
    portfolio.projects.length > 0 ||
    portfolioCards.length > 0 ||
    portfolio.skills.length > 0 ||
    portfolio.languages.length > 0 ||
    Boolean(portfolio.contact) ||
    Boolean(portfolio.cv);
  const displayName = getDisplayName(portfolio);
  const navigationItems: FloatingNavbarItem[] = [
    { label: t('navHome'), href: '/' },
    ...(portfolio.projects.length > 0
      ? [{ label: t('navProjects'), href: '#projects' }]
      : []),
    ...(portfolioCards.length > 0
      ? [{ label: t('navCards'), href: '#dcards' }]
      : []),
    ...(portfolio.skills.length > 0
      ? [{ label: t('navSkills'), href: '#skills' }]
      : []),
    ...(portfolio.languages.length > 0
      ? [{ label: t('navLanguages'), href: '#language' }]
      : []),
    ...(portfolio.cv ? [{ label: 'CV', href: '#cv' }] : []),
    ...(portfolio.contact ? [{ label: t('navContact'), href: '#contact' }] : []),
  ];

  return (
    <main id="home" className="app-shell">
      <ParticlesBackground
        id={`public-portfolio-particles-${portfolio.username}`}
        config={portfolio.particles}
      />

      <FloatingNavbar
        brandHref="/"
        authenticatedPrimaryLabel={t('navPortfolio')}
        isAuthenticated={isAuthenticated}
        isEditMode={false}
        navigationItems={navigationItems}
        ownerLabel={t('portfolioOwner', { username: portfolio.username })}
        loginButtonRef={loginButtonRef}
        configButtonRef={configButtonRef}
        onOpenLogin={() => setIsLoginModalOpen(true)}
        onOpenAuthenticatedPrimary={() => navigate('/portfolio')}
        onOpenConfig={() => undefined}
        onToggleEditMode={() => undefined}
        onLogout={() => undefined}
      />

      {mainCard ? (
        <MainCard card={mainCard} />
      ) : (
        <PublicPortfolioHero portfolio={portfolio} />
      )}

      {portfolio.projects.length > 0 && (
        <div id="projects" className="app-section-anchor">
          <section className="portfolio-stage">
            <ProjectsCarousel projects={portfolio.projects} />
          </section>
        </div>
      )}

      {portfolioCards.length > 0 && (
        <div id="dcards" className="app-section-anchor">
          <UserCardsSection
            cards={portfolioCards}
            // TODO(showCardNumber): Uncomment when card numbering is enabled again.
            // showCardNumber={portfolio.showCardNumber}
          />
        </div>
      )}

      {portfolio.skills.length > 0 && (
        <div id="skills" className="app-section-anchor">
          <SkillsSection skills={portfolio.skills} />
        </div>
      )}

      {portfolio.languages.length > 0 && (
        <div id="language" className="app-section-anchor">
          <LanguagesSection languages={portfolio.languages} />
        </div>
      )}

      {portfolio.cv && <CvSection cv={portfolio.cv} />}

      {portfolio.contact && (
        <div id="contact" className="app-section-anchor">
          <ContactSection
            contact={portfolio.contact}
            visibility={publicContactVisibility}
          />
        </div>
      )}

      {!hasPublicContent && (
        <section className="w-full px-4 py-16">
          <div className="mx-auto max-w-5xl rounded-lg border border-dashed border-zinc-700 p-6 text-left text-sm text-zinc-300">
            {t('portfolioEmpty')}
          </div>
        </section>
      )}

      {portfolio.songUrl && (
        <MusicPlayer
          allowSourceEditing={false}
          sourceTitle={t('musicBy', { name: displayName })}
          sourceUrl={portfolio.songUrl}
          startPlaying={false}
        />
      )}

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        restoreFocusRef={loginButtonRef}
      />
    </main>
  );
}

export default PublicPortfolioPage;
