import { CheckIcon, EyeIcon } from '@heroicons/react/24/outline';
import { useEffect, useState, type FormEvent, type RefObject } from 'react';
import BaseModal from '@/shared/components/Modal/BaseModal';
import {
  defaultUserConfigPayload,
  type UserConfigDto,
  type UserConfigPayload,
} from '@/features/user-config/types/userConfig.types';

interface UserConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: UserConfigDto;
  isLoading: boolean;
  error: string | null;
  onUpdateConfig: (payload: UserConfigPayload) => Promise<UserConfigDto>;
  restoreFocusRef?: RefObject<HTMLElement | null>;
}

type ConfigFieldKey = keyof UserConfigPayload;

const configGroups: Array<{
  title: string;
  description: string;
  fields: Array<{
    key: ConfigFieldKey;
    label: string;
  }>;
}> = [
  {
    title: 'Secciones publicas',
    description: 'Controla que bloques grandes aparecen en el portfolio.',
    fields: [
      { key: 'showProjectsSection', label: 'Proyectos' },
      { key: 'showCardsSection', label: 'Cards' },
      { key: 'showContactSection', label: 'Contacto' },
      { key: 'showSkillsSection', label: 'Skills' },
      { key: 'showLanguagesSection', label: 'Idiomas' },
      { key: 'showCv', label: 'CV' },
    ],
  },
  {
    title: 'Datos de contacto',
    description: 'Elige que medios de contacto se publican.',
    fields: [
      { key: 'showEmail', label: 'Email publico' },
      { key: 'showAltEmail', label: 'Email alternativo' },
      { key: 'showPhone', label: 'Telefono' },
      { key: 'showAltPhone', label: 'Telefono alternativo' },
      { key: 'showInstagram', label: 'Instagram' },
      { key: 'showGitHub', label: 'GitHub' },
      { key: 'showFacebook', label: 'Facebook' },
      { key: 'showLinkedIn', label: 'LinkedIn' },
      { key: 'showWebsite', label: 'Website' },
    ],
  },
  {
    title: 'Idiomas',
    description: 'Preferencias para la futura seccion de idiomas.',
    fields: [
      { key: 'showLanguagePercent', label: 'Mostrar porcentaje' },
      { key: 'showLanguageLevel', label: 'Mostrar nivel' },
    ],
  },
];

function getPayloadFromConfig(config: UserConfigDto): UserConfigPayload {
  return {
    showProjectsSection: config.showProjectsSection,
    showSkillsSection: config.showSkillsSection,
    showLanguagesSection: config.showLanguagesSection,
    showContactSection: config.showContactSection,
    showCardsSection: config.showCardsSection,
    showCv: config.showCv,
    showEmail: config.showEmail,
    showAltEmail: config.showAltEmail,
    showPhone: config.showPhone,
    showAltPhone: config.showAltPhone,
    showInstagram: config.showInstagram,
    showGitHub: config.showGitHub,
    showFacebook: config.showFacebook,
    showLinkedIn: config.showLinkedIn,
    showWebsite: config.showWebsite,
    showLanguagePercent: config.showLanguagePercent,
    showLanguageLevel: config.showLanguageLevel,
  };
}

function ConfigToggleField({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex min-h-11 items-center justify-between gap-3 rounded-lg border border-zinc-700/80 bg-zinc-950/70 px-3 py-2 text-sm font-semibold text-zinc-100">
      <span>{label}</span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="h-4 w-4 shrink-0 accent-cyan-500"
      />
    </label>
  );
}

export default function UserConfigModal({
  isOpen,
  onClose,
  config,
  isLoading,
  error,
  onUpdateConfig,
  restoreFocusRef,
}: UserConfigModalProps) {
  const [draft, setDraft] = useState<UserConfigPayload>(() =>
    getPayloadFromConfig(config),
  );
  const [isSaving, setIsSaving] = useState(false);
  const [mutationError, setMutationError] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setDraft(getPayloadFromConfig(config));
    setMutationError('');
    setStatusMessage('');
  }, [config, isOpen]);

  const handleSaveConfig = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);
    setMutationError('');

    try {
      await onUpdateConfig(draft);
      setStatusMessage('Configuracion guardada.');
    } catch (unknownError) {
      setMutationError(
        unknownError instanceof Error
          ? unknownError.message
          : 'No se pudo guardar la configuracion.',
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Configuracion"
      description="Visibilidad de secciones y datos publicos del portfolio."
      size="lg"
      restoreFocusRef={restoreFocusRef}
    >
      <form onSubmit={handleSaveConfig} className="space-y-5 text-left">
        <div className="flex items-center gap-3 rounded-lg border border-cyan-400/20 bg-cyan-400/10 px-3 py-2 text-sm text-cyan-100">
          <EyeIcon className="h-5 w-5 shrink-0" aria-hidden="true" />
          User #{config.userId} / Config #{config.id || 'default'}
        </div>

        {isLoading && (
          <p className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-300">
            Cargando configuracion...
          </p>
        )}

        {error && (
          <p className="rounded-lg border border-red-400/20 bg-red-400/10 px-3 py-2 text-sm text-red-200">
            {error}
          </p>
        )}

        {mutationError && (
          <p className="rounded-lg border border-red-400/20 bg-red-400/10 px-3 py-2 text-sm text-red-200">
            {mutationError}
          </p>
        )}

        {statusMessage && (
          <p className="rounded-lg border border-emerald-400/20 bg-emerald-400/10 px-3 py-2 text-sm text-emerald-200">
            {statusMessage}
          </p>
        )}

        {configGroups.map((group) => (
          <section
            key={group.title}
            className="rounded-lg border border-zinc-800 bg-zinc-900/60 p-4"
          >
            <div className="mb-3">
              <h3 className="text-sm font-semibold text-white">
                {group.title}
              </h3>
              <p className="mt-1 text-xs leading-5 text-zinc-400">
                {group.description}
              </p>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              {group.fields.map((field) => (
                <ConfigToggleField
                  key={field.key}
                  label={field.label}
                  checked={draft[field.key]}
                  onChange={(checked) =>
                    setDraft((currentDraft) => ({
                      ...currentDraft,
                      [field.key]: checked,
                    }))
                  }
                />
              ))}
            </div>
          </section>
        ))}

        <div className="flex flex-wrap gap-2">
          <button
            type="submit"
            disabled={isSaving || isLoading}
            className="inline-flex items-center gap-2 rounded-lg bg-cyan-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-cyan-600 disabled:cursor-wait disabled:bg-zinc-600"
          >
            <CheckIcon className="h-4 w-4" aria-hidden="true" />
            {isSaving ? 'Guardando...' : 'Guardar'}
          </button>
          <button
            type="button"
            onClick={() => setDraft(defaultUserConfigPayload)}
            className="rounded-lg border border-zinc-700 px-4 py-2.5 text-sm font-semibold text-zinc-100 transition hover:border-cyan-400 hover:text-cyan-100"
          >
            Mostrar todo
          </button>
        </div>
      </form>
    </BaseModal>
  );
}
