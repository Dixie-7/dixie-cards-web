import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';
import type {
  AuthEntryMode,
  LandingContent,
  LandingLanguage,
} from '../landing.types';
import { BrandMark } from './LandingPrimitives';

interface LandingHeaderProps {
  content: LandingContent['navigation'];
  language: LandingLanguage;
  isAuthenticated: boolean;
  onLanguageChange: (language: LandingLanguage) => void;
  onOpenAuth: (mode: AuthEntryMode) => void;
  onOpenPortfolio: () => void;
}

const links = [
  { key: 'possibilities', href: '#possibilities' },
  { key: 'customization', href: '#customization' },
  { key: 'process', href: '#process' },
  { key: 'preview', href: '#preview' },
] as const;

export function LandingHeader({
  content,
  language,
  isAuthenticated,
  onLanguageChange,
  onOpenAuth,
  onOpenPortfolio,
}: LandingHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="landing-header">
      <div className="landing-container landing-header__inner">
        <BrandMark />

        <nav className="landing-header__nav" aria-label="Landing navigation">
          {links.map((link) => (
            <a key={link.href} href={link.href}>
              {content[link.key]}
            </a>
          ))}
        </nav>

        <div className="landing-header__actions">
          <div className="language-switch" aria-label="Language selector">
            {(['es', 'en'] as const).map((option) => (
              <button
                key={option}
                type="button"
                className={language === option ? 'is-active' : ''}
                onClick={() => onLanguageChange(option)}
                aria-pressed={language === option}
              >
                {option.toUpperCase()}
              </button>
            ))}
          </div>

          {isAuthenticated ? (
            <button
              type="button"
              className="landing-button landing-button--small landing-button--primary"
              onClick={onOpenPortfolio}
            >
              {content.portfolio}
            </button>
          ) : (
            <>
              <button
                type="button"
                className="landing-header__login"
                onClick={() => onOpenAuth('login')}
              >
                {content.login}
              </button>
              <button
                type="button"
                className="landing-button landing-button--small landing-button--primary"
                onClick={() => onOpenAuth('register')}
              >
                {content.create}
              </button>
            </>
          )}

          <button
            type="button"
            className="landing-header__menu-button"
            onClick={() => setIsMenuOpen((current) => !current)}
            aria-expanded={isMenuOpen}
            aria-label={isMenuOpen ? content.closeMenu : content.openMenu}
          >
            {isMenuOpen ? <XMarkIcon /> : <Bars3Icon />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="landing-mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22 }}
          >
            <nav className="landing-container" aria-label="Mobile navigation">
              {links.map((link) => (
                <a key={link.href} href={link.href} onClick={closeMenu}>
                  {content[link.key]}
                </a>
              ))}
              {!isAuthenticated && (
                <button
                  type="button"
                  onClick={() => {
                    closeMenu();
                    onOpenAuth('login');
                  }}
                >
                  {content.login}
                </button>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
