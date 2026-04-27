import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import React, { useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import ModalHeader from './ModalHeader';
import type { BaseModalProps } from './modal.types';
import { getFocusableElements } from './modal.utils';

const sizeClasses = {
  sm: 'sm:max-w-sm',
  md: 'sm:max-w-md',
  lg: 'sm:max-w-lg',
};

const BaseModal: React.FC<BaseModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  description,
  closeOnOverlayClick = true,
  showCloseButton = true,
  size = 'md',
  initialFocusRef,
  restoreFocusRef,
}) => {
  const titleId = useId();
  const descriptionId = useId();
  const shouldReduceMotion = useReducedMotion() ?? false;

  const modalRef = useRef<HTMLDivElement | null>(null);
  const previousFocusedElementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    previousFocusedElementRef.current = document.activeElement as HTMLElement | null;

    const timer = window.setTimeout(() => {
      if (initialFocusRef?.current) {
        initialFocusRef.current.focus();
        return;
      }

      if (modalRef.current) {
        const focusable = getFocusableElements(modalRef.current);
        if (focusable.length > 0) {
          focusable[0].focus();
        } else {
          modalRef.current.focus();
        }
      }
    }, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, [isOpen, initialFocusRef, restoreFocusRef]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== 'Tab' || !modalRef.current) return;

      const focusable = getFocusableElements(modalRef.current);

      if (focusable.length === 0) {
        event.preventDefault();
        modalRef.current.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement as HTMLElement | null;

      if (event.shiftKey) {
        if (active === first || active === modalRef.current) {
          event.preventDefault();
          last.focus();
        }
      } else {
        if (active === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const overlayTransition = shouldReduceMotion
    ? { duration: 0.1 }
    : { duration: 0.15 };
  const panelTransition = shouldReduceMotion
    ? { duration: 0.12 }
    : { duration: 0.19, ease: [0.22, 1, 0.36, 1] as const };

  const handleExitComplete = () => {
    if (isOpen) return;

    const elementToRestore =
      restoreFocusRef?.current ?? previousFocusedElementRef.current;

    elementToRestore?.focus();
  };

  const overlay = (
    <AnimatePresence mode="wait" onExitComplete={handleExitComplete}>
      {isOpen && (
        <motion.div
          key="modal-root"
          data-slot="modal-overlay-wrapper"
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto px-3 py-3 sm:px-4 sm:py-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={overlayTransition}
          onClick={() => {
            if (closeOnOverlayClick) onClose();
          }}
        >
          <div
            data-slot="modal-backdrop"
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            aria-hidden="true"
          />

          <motion.div
            key="modal-panel"
            ref={modalRef}
            data-slot="modal-panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={description ? descriptionId : undefined}
            tabIndex={-1}
            className={`relative flex max-h-[calc(100dvh-1.5rem)] w-full max-w-full flex-col overflow-hidden rounded-[1.25rem] border border-violet-500/30 bg-zinc-900 shadow-2xl shadow-violet-950/40 outline-none sm:max-h-[calc(100dvh-3rem)] sm:rounded-2xl ${sizeClasses[size]}`}
            initial={
              shouldReduceMotion
                ? { opacity: 0 }
                : { opacity: 0, scale: 0.96, y: 24 }
            }
            animate={
              shouldReduceMotion
                ? { opacity: 1 }
                : { opacity: 1, scale: 1, y: 0 }
            }
            exit={
              shouldReduceMotion
                ? { opacity: 0 }
                : { opacity: 0, scale: 0.98, y: 12 }
            }
            transition={panelTransition}
            onClick={(e) => e.stopPropagation()}
          >
            <ModalHeader
              title={title}
              titleId={titleId}
              description={description}
              descriptionId={description ? descriptionId : undefined}
              showCloseButton={showCloseButton}
              onClose={onClose}
            />

            <div
              data-slot="modal-content"
              className="overflow-y-auto px-4 py-4 sm:px-6 sm:py-5"
            >
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return createPortal(overlay, document.body);
};

export default BaseModal;
