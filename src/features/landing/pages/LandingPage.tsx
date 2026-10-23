import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import LoginModal from '@/features/auth/components/LoginModal';
import { useAuth } from '@/features/auth/hooks/useAuth';
import ParticlesBackground from '@/shared/components/Background/ParticlesBackground';
import { useLanguage } from '@/shared/i18n/useLanguage';
import { CustomizationSection } from '../components/CustomizationSection';
import { FinalCtaSection } from '../components/FinalCtaSection';
import { HeroSection } from '../components/HeroSection';
import { HowItWorksSection } from '../components/HowItWorksSection';
import { LandingFooter } from '../components/LandingFooter';
import { LandingHeader } from '../components/LandingHeader';
import { LearnDixieSection } from '../components/LearnDixieSection';
import { PortfolioPreviewSection } from '../components/PortfolioPreviewSection';
import { PossibilitiesSection } from '../components/PossibilitiesSection';
import { landingContent } from '../landingContent';
import { landingParticlesConfig } from '../landingParticlesConfig';
import type { AuthEntryMode } from '../landing.types';
import '../styles/landing.css';

interface LandingNavigationState {
  authMode?: AuthEntryMode;
  returnTo?: string;
}

function LandingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const { language, setLanguage } = useLanguage();
  const navigationState = location.state as LandingNavigationState | null;
  const redirectedAuthMode =
    navigationState?.authMode === 'login' ||
    navigationState?.authMode === 'register'
      ? navigationState.authMode
      : null;
  const returnTo =
    navigationState?.returnTo === '/portfolio'
      ? navigationState.returnTo
      : null;
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(
    Boolean(redirectedAuthMode),
  );
  const [authMode, setAuthMode] = useState<AuthEntryMode>(
    redirectedAuthMode ?? 'register',
  );
  const [authModalKey, setAuthModalKey] = useState(0);
  const content = landingContent[language];

  const openAuth = (mode: AuthEntryMode) => {
    if (isAuthenticated) {
      navigate('/portfolio');
      return;
    }

    setAuthMode(mode);
    setAuthModalKey((currentKey) => currentKey + 1);
    setIsAuthModalOpen(true);
  };

  return (
    <main className="landing-page">
      <ParticlesBackground
        id="landing-particles"
        className="landing-page__particles"
        config={landingParticlesConfig}
      />

      <div className="landing-page__content">
        <LandingHeader
          content={content.navigation}
          language={language}
          isAuthenticated={isAuthenticated}
          onLanguageChange={setLanguage}
          onOpenAuth={openAuth}
          onOpenPortfolio={() => navigate('/portfolio')}
        />
        <HeroSection
          content={content.hero}
          onCreate={() => openAuth('register')}
        />
        <PossibilitiesSection content={content.possibilities} />
        <CustomizationSection content={content.customization} />
        <HowItWorksSection content={content.process} />
        <LearnDixieSection
          content={content.learn}
          onLearn={() => navigate('/learn')}
        />
        <PortfolioPreviewSection content={content.preview} />
        <FinalCtaSection
          content={content.finalCta}
          onCreate={() => openAuth('register')}
        />
        <LandingFooter content={content.footer} onOpenAuth={openAuth} />

        <LoginModal
          key={authModalKey}
          isOpen={isAuthModalOpen}
          initialMode={authMode}
          onClose={() => setIsAuthModalOpen(false)}
          onLoginSuccess={() => {
            if (returnTo) {
              navigate(returnTo, { replace: true });
            }
          }}
        />
      </div>
    </main>
  );
}

export default LandingPage;
