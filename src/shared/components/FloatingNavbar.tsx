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

export interface FloatingNavbarItem {
  label: string;
  href: string;
}

const defaultNavigationItems: FloatingNavbarItem[] = [
  { label: 'Home', href: '#home' },
  { label: 'Projects', href: '#projects' },
  { label: 'DCards', href: '#dcards' },
  { label: 'Skills', href: '#skills' },
  { label: 'Language', href: '#language' },
  { label: 'Contact', href: '#contact' },
];

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
  navigationItems = defaultNavigationItems,
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const displayOwner = ownerLabel ?? userLabel;

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
        <a className="floating-navbar__brand" href={brandHref} aria-label="Dixie Cards Home">
          <span className="floating-navbar__brand-mark" aria-hidden="true">
            <span>D</span>
            <span>C</span>
          </span>
          <span className="floating-navbar__brand-wordmark">
            <strong>{brandLabel.split(' ')[0] ?? brandLabel}</strong>
            <span>{brandLabel.split(' ').slice(1).join(' ') || 'Cards'}</span>
          </span>
        </a>

        {navigationItems.length > 0 && (
          <nav className="floating-navbar__nav" aria-label="Portfolio navigation">
            {navigationItems.map((item) => (
              <a key={`${item.label}-${item.href}`} href={item.href}>
                {item.label}
              </a>
            ))}
          </nav>
        )}

        <div className="floating-navbar__actions">
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
                  aria-label={isEditMode ? 'Salir del modo edicion' : 'Activar modo edicion'}
                  title={isEditMode ? 'Exit edit mode' : 'Edit mode'}
                >
                  <PencilSquareIcon className="floating-navbar__icon" aria-hidden="true" />
                  <span className="floating-navbar__button-label">
                    {isEditMode ? 'Editing' : 'Edit'}
                  </span>
                </button>

                <button
                  ref={configButtonRef}
                  type="button"
                  className="floating-navbar__action-button"
                  onClick={handleOpenConfig}
                  aria-label="Abrir configuracion de usuario"
                  title="Settings"
                >
                  <Cog6ToothIcon className="floating-navbar__icon" aria-hidden="true" />
                  <span className="floating-navbar__button-label">Settings</span>
                </button>

                <button
                  type="button"
                  className="floating-navbar__action-button"
                  onClick={handleLogout}
                  aria-label="Cerrar sesion"
                  title="Salir"
                >
                  <ArrowLeftOnRectangleIcon className="floating-navbar__icon" aria-hidden="true" />
                  <span className="floating-navbar__button-label">Salir</span>
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
                Login / Registrarse
              </button>
            )
          )}

          <button
            type="button"
            className="floating-navbar__menu-button"
            onClick={() => setIsMenuOpen((current) => !current)}
            aria-expanded={isMenuOpen}
            aria-label={isMenuOpen ? 'Cerrar navegacion' : 'Abrir navegacion'}
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
            <nav className="floating-navbar__mobile-menu-inner" aria-label="Mobile portfolio navigation">
              {displayOwner && (
                <span className="floating-navbar__mobile-owner">{displayOwner}</span>
              )}
              {navigationItems.map((item) => (
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
                      {isEditMode ? 'Exit edit mode' : 'Edit mode'}
                    </button>
                    <button type="button" onClick={handleOpenConfig}>
                      Settings
                    </button>
                    <button type="button" onClick={handleLogout}>
                      Salir
                    </button>
                  </>
                ) : (
                  <button type="button" onClick={handleLogin}>
                    Login / Registrarse
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
