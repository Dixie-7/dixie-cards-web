import {
  ArrowLeftOnRectangleIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  Cog6ToothIcon,
  PencilSquareIcon,
  UserCircleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { AnimatePresence, motion } from 'motion/react';
import { useState, type RefObject } from 'react';
import { useLanguage } from '@/shared/i18n/useLanguage';
import LanguageSwitcher from './LanguageSwitcher';

export interface FloatingNavbarItem {
  label: string;
  href: string;
}

interface FloatingNavbarProps {
  brandHref?: string;
  brandLabel?: string;
  isAuthenticated: boolean;
  isEditMode: boolean;
  authenticatedPrimaryLabel?: string;
  navigationItems?: FloatingNavbarItem[];
  ownerLabel?: string;
  showAuthActions?: boolean;
  userLabel?: string;
  loginButtonRef: RefObject<HTMLButtonElement | null>;
  configButtonRef: RefObject<HTMLButtonElement | null>;
  onOpenLogin: () => void;
  onOpenConfig: () => void;
  onOpenAuthenticatedPrimary?: () => void;
  onToggleEditMode: () => void;
  onLogout: () => void;
}

export default function FloatingNavbar({
  brandHref = '/',
  brandLabel = 'Dixie Cards',
  isAuthenticated,
  isEditMode,
  authenticatedPrimaryLabel,
  navigationItems,
  ownerLabel,
  showAuthActions = true,
  userLabel,
  loginButtonRef,
  configButtonRef,
  onOpenLogin,
  onOpenConfig,
  onOpenAuthenticatedPrimary,
  onToggleEditMode,
  onLogout,
}: FloatingNavbarProps) {
  const { t } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const displayOwner = ownerLabel ?? userLabel;
  const resolvedNavigationItems = navigationItems ?? [
    { label: t('navHome'), href: '#home' },
    { label: t('navProjects'), href: '#projects' },
    { label: t('navCards'), href: '#dcards' },
    { label: t('navSkills'), href: '#skills' },
    { label: t('navLanguages'), href: '#language' },
    { label: t('navContact'), href: '#contact' },
  ];

  const closeMenu = () => setIsMenuOpen(false);
  const handleLogin = () => {
    closeMenu();
    onOpenLogin();
  };
  const handleToggleEditMode = () => {
    closeMenu();
    onToggleEditMode();
  };
  const handleOpenConfig = () => {
    closeMenu();
    onOpenConfig();
  };
  const handleAuthenticatedPrimary = () => {
    closeMenu();
    onOpenAuthenticatedPrimary?.();
  };
  const handleLogout = () => {
    closeMenu();
    onLogout();
  };

  return (
    <header className="floating-navbar">
      <div className="floating-navbar__inner">
        <a className="floating-navbar__brand" href={brandHref} aria-label={`Dixie Cards ${t('navHome')}`}>
          <span className="floating-navbar__brand-mark" aria-hidden="true">
            <span>D</span>
            <span>C</span>
          </span>
          <span className="floating-navbar__brand-wordmark">
            <strong>{brandLabel.split(' ')[0] ?? brandLabel}</strong>
            <span>{brandLabel.split(' ').slice(1).join(' ') || 'Cards'}</span>
          </span>
        </a>

        {resolvedNavigationItems.length > 0 && (
          <nav className="floating-navbar__nav" aria-label={t('navPortfolioLabel')}>
            {resolvedNavigationItems.map((item) => (
              <a key={`${item.label}-${item.href}`} href={item.href}>
                {item.label}
              </a>
            ))}
          </nav>
        )}

        <div className="floating-navbar__actions">
          <LanguageSwitcher />

          {displayOwner && (
            <span className="floating-navbar__owner" title={displayOwner}>
              <UserCircleIcon className="floating-navbar__icon" aria-hidden="true" />
              <span>{displayOwner}</span>
            </span>
          )}

          {showAuthActions && (
            isAuthenticated && authenticatedPrimaryLabel ? (
              <button
                type="button"
                className="floating-navbar__primary-button"
                onClick={handleAuthenticatedPrimary}
              >
                <ArrowRightOnRectangleIcon className="floating-navbar__icon" aria-hidden="true" />
                {authenticatedPrimaryLabel}
              </button>
            ) : isAuthenticated ? (
              <>
                <button
                  type="button"
                  className={`floating-navbar__action-button ${
                    isEditMode ? 'floating-navbar__action-button--active' : ''
                  }`}
                  onClick={handleToggleEditMode}
                  aria-pressed={isEditMode}
                  aria-label={isEditMode ? t('navExitEdit') : t('navEdit')}
                  title={isEditMode ? t('navExitEdit') : t('navEdit')}
                >
                  <PencilSquareIcon className="floating-navbar__icon" aria-hidden="true" />
                  <span className="floating-navbar__button-label">
                    {isEditMode ? t('navEditing') : t('navEdit')}
                  </span>
                </button>

                <button
                  ref={configButtonRef}
                  type="button"
                  className="floating-navbar__action-button"
                  onClick={handleOpenConfig}
                  aria-label={t('navSettings')}
                  title={t('navSettings')}
                >
                  <Cog6ToothIcon className="floating-navbar__icon" aria-hidden="true" />
                  <span className="floating-navbar__button-label">{t('navSettings')}</span>
                </button>

                <button
                  type="button"
                  className="floating-navbar__action-button"
                  onClick={handleLogout}
                  aria-label={t('navLogout')}
                  title={t('navLogout')}
                >
                  <ArrowLeftOnRectangleIcon className="floating-navbar__icon" aria-hidden="true" />
                  <span className="floating-navbar__button-label">{t('navLogout')}</span>
                </button>
              </>
            ) : (
              <button
                ref={loginButtonRef}
                type="button"
                className="floating-navbar__primary-button"
                onClick={handleLogin}
              >
                <ArrowRightOnRectangleIcon className="floating-navbar__icon" aria-hidden="true" />
                {t('navLogin')}
              </button>
            )
          )}

          <button
            type="button"
            className="floating-navbar__menu-button"
            onClick={() => setIsMenuOpen((current) => !current)}
            aria-expanded={isMenuOpen}
            aria-label={isMenuOpen ? t('navClose') : t('navOpen')}
          >
            {isMenuOpen ? <XMarkIcon /> : <Bars3Icon />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="floating-navbar__mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22 }}
          >
            <nav className="floating-navbar__mobile-menu-inner" aria-label={t('navMobileLabel')}>
              {displayOwner && (
                <span className="floating-navbar__mobile-owner">{displayOwner}</span>
              )}
              {resolvedNavigationItems.map((item) => (
                <a key={`${item.label}-${item.href}-mobile`} href={item.href} onClick={closeMenu}>
                  {item.label}
                </a>
              ))}
              {showAuthActions && (
                isAuthenticated && authenticatedPrimaryLabel ? (
                  <button type="button" onClick={handleAuthenticatedPrimary}>
                    {authenticatedPrimaryLabel}
                  </button>
                ) : isAuthenticated ? (
                  <>
                    <button type="button" onClick={handleToggleEditMode}>
                      {isEditMode ? t('navExitEdit') : t('navEdit')}
                    </button>
                    <button type="button" onClick={handleOpenConfig}>
                      {t('navSettings')}
                    </button>
                    <button type="button" onClick={handleLogout}>
                      {t('navLogout')}
                    </button>
                  </>
                ) : (
                  <button type="button" onClick={handleLogin}>
                    {t('navLogin')}
                  </button>
                )
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
