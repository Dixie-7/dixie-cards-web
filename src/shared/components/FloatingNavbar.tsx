import {
  ArrowLeftOnRectangleIcon,
  ArrowRightOnRectangleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  Cog6ToothIcon,
  PencilSquareIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import { useState, type RefObject } from 'react';

const navigationItems = [
  { label: 'Home', href: '#home' },
  { label: 'Projects', href: '#projects' },
  { label: 'DCards', href: '#dcards' },
  { label: 'Skills', href: '#skills' },
  { label: 'Language', href: '#language' },
  { label: 'Contact', href: '#contact' },
];

interface FloatingNavbarProps {
  isAuthenticated: boolean;
  isEditMode: boolean;
  userLabel?: string;
  loginButtonRef: RefObject<HTMLButtonElement | null>;
  configButtonRef: RefObject<HTMLButtonElement | null>;
  onOpenLogin: () => void;
  onOpenConfig: () => void;
  onToggleEditMode: () => void;
  onLogout: () => void;
}

export default function FloatingNavbar({
  isAuthenticated,
  isEditMode,
  userLabel,
  loginButtonRef,
  configButtonRef,
  onOpenLogin,
  onOpenConfig,
  onToggleEditMode,
  onLogout,
}: FloatingNavbarProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <header
      className={`floating-navbar ${
        isExpanded ? 'floating-navbar--expanded' : 'floating-navbar--collapsed'
      }`}
    >
      <div className="floating-navbar__inner ">
        <div className="floating-navbar__navigation" aria-hidden={!isExpanded}>
          <div className="floating-navbar__navigation-content">
            <a
              className="floating-navbar__brand"
              href="#home"
              aria-label="Ir al inicio"
            >
              Dixie Cards
            </a>

            <nav
              className="floating-navbar__links"
              aria-label="Secciones del portfolio"
            >
              {navigationItems.map((item) => (
                <a
                  key={item.href}
                  className="floating-navbar__link"
                  href={item.href}
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </div>
        </div>

        <button
          type="button"
          className="floating-navbar__toggle"
          onClick={() => setIsExpanded((currentState) => !currentState)}
          aria-expanded={isExpanded}
          aria-label={isExpanded ? 'Colapsar navegacion' : 'Expandir navegacion'}
          title={isExpanded ? 'Colapsar navegacion' : 'Expandir navegacion'}
        >
          {isExpanded ? (
            <ChevronRightIcon className="floating-navbar__icon" aria-hidden="true" />
          ) : (
            <ChevronLeftIcon className="floating-navbar__icon" aria-hidden="true" />
          )}
        </button>

        <div className="floating-navbar__actions">
          {isAuthenticated ? (
            <>
              <span className="floating-navbar__user" title={userLabel}>
                <UserCircleIcon className="floating-navbar__icon" aria-hidden="true" />
                <span>{userLabel ?? 'Sesion activa'}</span>
              </span>

              <button
                type="button"
                className={`floating-navbar__action-button ${
                  isEditMode ? 'floating-navbar__action-button--active' : ''
                }`}
                onClick={onToggleEditMode}
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
                onClick={onOpenConfig}
                aria-label="Abrir configuracion de usuario"
                title="Settings"
              >
                <Cog6ToothIcon className="floating-navbar__icon" aria-hidden="true" />
                <span className="floating-navbar__button-label">Settings</span>
              </button>

              <button
                type="button"
                className="floating-navbar__action-button"
                onClick={onLogout}
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
              onClick={onOpenLogin}
            >
              <ArrowRightOnRectangleIcon className="floating-navbar__icon" aria-hidden="true" />
              Login
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
