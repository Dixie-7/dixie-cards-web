import {
  CheckIcon,
  EyeIcon,
  MusicalNoteIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';
import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type RefObject,
} from 'react';
import BaseModal from '@/shared/components/Modal/BaseModal';
import type { StatusToastKind } from '@/shared/components/StatusToast';
import ParticlesConfigModal from '@/features/user-config/components/ParticlesConfigModal';
import {
  defaultUserConfigPayload,
  defaultUserParticlesConfig,
  type UserConfigDto,
  type UserConfigPayload,
  type UserParticlesConfig,
} from '@/features/user-config/types/userConfig.types';

interface UserConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: UserConfigDto;
  isLoading: boolean;
  error: string | null;
  onUpdateConfig: (payload: UserConfigPayload) => Promise<UserConfigDto>;
  onFeedback?: (message: string, kind: StatusToastKind) => void;
  restoreFocusRef?: RefObject<HTMLElement | null>;
}

type ConfigFieldKey = Exclude<
  keyof UserConfigPayload,
  'songUrl' | 'particles'
>;

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
      { key: 'showCardNumber', label: 'Mostrar numero de las Cards' },
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
    songUrl: config.songUrl,
    showSong: config.showSong,
    particles: config.particles ? { ...config.particles } : null,
    showSkillsSection: config.showSkillsSection,
    showLanguagesSection: config.showLanguagesSection,
    showContactSection: config.showContactSection,
    showCardsSection: config.showCardsSection,
    showCardNumber: config.showCardNumber,
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
  onFeedback,
  restoreFocusRef,
}: UserConfigModalProps) {
  const [draft, setDraft] = useState<UserConfigPayload>(() =>
    getPayloadFromConfig(config),
  );
  const [isSaving, setIsSaving] = useState(false);
  const [mutationError, setMutationError] = useState('');
  const [isParticlesModalOpen, setIsParticlesModalOpen] = useState(false);
  const [particlesModalKey, setParticlesModalKey] = useState(0);
  const particlesButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setDraft(getPayloadFromConfig(config));
    setMutationError('');
  }, [config, isOpen]);

  const handleSaveConfig = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);
    setMutationError('');

    try {
      await onUpdateConfig({
        ...draft,
        songUrl: draft.songUrl?.trim() || null,
      });
      onClose();
      onFeedback?.('Configuracion guardada correctamente.', 'success');
    } catch (unknownError) {
      const message =
        unknownError instanceof Error
          ? unknownError.message
          : 'No se pudo guardar la configuracion.';
      setMutationError(message);
      onFeedback?.(message, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveParticles = async (
    particles: UserParticlesConfig,
  ) => {
    try {
      const updatedConfig = await onUpdateConfig({
        ...draft,
        songUrl: draft.songUrl?.trim() || null,
        particles,
      });
      setDraft(getPayloadFromConfig(updatedConfig));
      onFeedback?.('Fondo del portfolio guardado.', 'success');
    } catch (unknownError) {
      const message =
        unknownError instanceof Error
          ? unknownError.message
          : 'No se pudo guardar el fondo del portfolio.';
      onFeedback?.(message, 'error');
      throw unknownError;
    }
  };

  return (
    <>
      <BaseModal
        isOpen={isOpen && !isParticlesModalOpen}
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

        <section className="overflow-hidden rounded-xl border border-violet-400/25 bg-[radial-gradient(circle_at_top_right,rgba(139,92,246,0.18),transparent_45%),rgba(24,24,27,0.7)] p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-violet-400/20 bg-violet-400/10 text-violet-200">
                <SparklesIcon className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <h3 className="text-sm font-semibold text-white">
                  Fondo del portfolio
                </h3>
                <p className="mt-1 text-xs leading-5 text-zinc-400">
                  {draft.particles?.enabled
                    ? `${draft.particles.count} partículas · ${draft.particles.shape}`
                    : 'Creá un fondo animado sutil y personalizado.'}
                </p>
              </div>
            </div>
            <button
              ref={particlesButtonRef}
              type="button"
              onClick={() => {
                setParticlesModalKey((currentKey) => currentKey + 1);
                setIsParticlesModalOpen(true);
              }}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-violet-400/35 bg-violet-400/10 px-3.5 py-2.5 text-sm font-semibold text-violet-100 transition hover:border-violet-300 hover:bg-violet-400/20"
            >
              <SparklesIcon className="h-4 w-4" aria-hidden="true" />
              Personalizar fondo
            </button>
          </div>
        </section>

        <section className="rounded-lg border border-zinc-800 bg-zinc-900/60 p-4">
          <div className="mb-3 flex items-start gap-3">
            <MusicalNoteIcon
              className="mt-0.5 h-5 w-5 shrink-0 text-cyan-300"
              aria-hidden="true"
            />
            <div>
              <h3 className="text-sm font-semibold text-white">
                Musica del portfolio
              </h3>
              <p className="mt-1 text-xs leading-5 text-zinc-400">
                Configura la cancion que se mostrara en tu portfolio publico.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold text-zinc-300">
                URL de la cancion
              </span>
              <input
                type="url"
                maxLength={500}
                value={draft.songUrl ?? ''}
                placeholder="https://..."
                onChange={(event) =>
                  setDraft((currentDraft) => ({
                    ...currentDraft,
                    songUrl: event.target.value,
                  }))
                }
                className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-sm text-zinc-100 outline-none transition placeholder:text-zinc-600 focus:border-cyan-400"
              />
              <span className="mt-1 block text-right text-xs text-zinc-500">
                {(draft.songUrl ?? '').length}/500
              </span>
            </label>

            <ConfigToggleField
              label="Mostrar reproductor"
              checked={draft.showSong}
              onChange={(checked) =>
                setDraft((currentDraft) => ({
                  ...currentDraft,
                  showSong: checked,
                }))
              }
            />
          </div>
        </section>

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

      <ParticlesConfigModal
        key={particlesModalKey}
        isOpen={isOpen && isParticlesModalOpen}
        config={draft.particles ?? defaultUserParticlesConfig}
        onClose={() => setIsParticlesModalOpen(false)}
        onSave={handleSaveParticles}
        restoreFocusRef={particlesButtonRef}
      />
    </>
  );
}
