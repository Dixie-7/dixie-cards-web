import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { useEffect } from 'react';
import { useLanguage } from '@/shared/i18n/useLanguage';

export type StatusToastKind = 'success' | 'error';

export interface StatusToastMessage {
  id: number;
  kind: StatusToastKind;
  message: string;
}

interface StatusToastProps {
  notification: StatusToastMessage | null;
  onDismiss: () => void;
}

export default function StatusToast({
  notification,
  onDismiss,
}: StatusToastProps) {
  const { t } = useLanguage();
  useEffect(() => {
    if (!notification) {
      return;
    }

    const timeoutId = window.setTimeout(onDismiss, 4500);

    return () => window.clearTimeout(timeoutId);
  }, [notification, onDismiss]);

  if (!notification) {
    return null;
  }

  const isSuccess = notification.kind === 'success';
  const Icon = isSuccess ? CheckCircleIcon : ExclamationCircleIcon;

  return (
    <div
      className={`fixed right-4 top-24 z-[70] flex w-[calc(100vw-2rem)] max-w-sm items-start gap-3 rounded-lg border px-4 py-3 text-left shadow-xl ${
        isSuccess
          ? 'border-emerald-300 bg-emerald-50 text-emerald-900 dark:border-emerald-400/30 dark:bg-emerald-950 dark:text-emerald-100'
          : 'border-red-300 bg-red-50 text-red-900 dark:border-red-400/30 dark:bg-red-950 dark:text-red-100'
      }`}
      role={isSuccess ? 'status' : 'alert'}
      aria-live={isSuccess ? 'polite' : 'assertive'}
    >
      <Icon className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
      <p className="min-w-0 flex-1 text-sm font-semibold leading-5">
        {notification.message}
      </p>
      <button
        type="button"
        onClick={onDismiss}
        className="inline-flex h-6 w-6 shrink-0 items-center justify-center text-current opacity-70 transition hover:opacity-100"
        aria-label={t('actionClose')}
        title={t('actionClose')}
      >
        <XMarkIcon className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
}
