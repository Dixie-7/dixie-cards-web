import React from 'react';
import { useLanguage } from '@/shared/i18n/useLanguage';

interface ModalHeaderProps {
  title: string;
  titleId: string;
  description?: string;
  descriptionId?: string;
  showCloseButton?: boolean;
  onClose: () => void;
}

const ModalHeader: React.FC<ModalHeaderProps> = ({
  title,
  titleId,
  description,
  descriptionId,
  showCloseButton = true,
  onClose,
}) => {
  const { t } = useLanguage();

  return (
    <div
      data-slot="modal-header"
      className="flex items-start justify-between gap-3 border-b border-violet-500/20 px-4 py-4 sm:gap-4 sm:px-6"
    >
      <div>
        <h2
          id={titleId}
          className="text-lg font-semibold text-violet-200 sm:text-xl"
        >
          {title}
        </h2>

        {description && (
          <p
            id={descriptionId}
            className="mt-1 text-sm leading-relaxed text-zinc-400"
          >
            {description}
          </p>
        )}
      </div>

      {showCloseButton && (
        <button
          type="button"
          onClick={onClose}
          className="shrink-0 rounded-lg p-2 text-zinc-400 transition hover:bg-zinc-800 hover:text-violet-200"
          aria-label={`${t('actionClose')} modal`}
        >
          &times;
        </button>
      )}
    </div>
  );
};

export default ModalHeader;
