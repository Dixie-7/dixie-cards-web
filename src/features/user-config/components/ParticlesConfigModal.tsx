import {
  ArrowPathIcon,
  BoltIcon,
  CheckIcon,
  CursorArrowRaysIcon,
  LinkIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';
import { useReducedMotion } from 'motion/react';
import {
  useState,
  type CSSProperties,
  type FormEvent,
  type RefObject,
} from 'react';
import { useParticlesConfigDraft } from '@/features/user-config/hooks/useParticlesConfigDraft';
import type {
  UserParticleDirection,
  UserParticleHoverMode,
  UserParticlesConfig,
  UserParticleShape,
} from '@/features/user-config/types/userConfig.types';
import ParticlesBackground from '@/shared/components/Background/ParticlesBackground';
import BaseModal from '@/shared/components/Modal/BaseModal';
import './ParticlesConfigModal.css';

interface ParticlesConfigModalProps {
  isOpen: boolean;
  config: UserParticlesConfig;
  onClose: () => void;
  onSave: (config: UserParticlesConfig) => Promise<void>;
  restoreFocusRef?: RefObject<HTMLElement | null>;
}

function ToggleControl({
  checked,
  description,
  label,
  onChange,
}: {
  checked: boolean;
  description: string;
  label: string;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="group flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-zinc-700/80 bg-zinc-950/65 p-3.5 transition hover:border-violet-400/40">
      <span>
        <strong className="block text-sm font-semibold text-zinc-100">
          {label}
        </strong>
        <span className="mt-1 block text-xs leading-5 text-zinc-500">
          {description}
        </span>
      </span>
      <span
        className={`relative h-6 w-11 shrink-0 rounded-full border transition ${
          checked
            ? 'border-violet-400 bg-violet-500'
            : 'border-zinc-600 bg-zinc-800'
        }`}
      >
        <span
          className={`absolute top-0.5 h-[18px] w-[18px] rounded-full bg-white shadow transition-transform ${
            checked ? 'translate-x-5' : 'translate-x-0.5'
          }`}
        />
      </span>
      <input
        type="checkbox"
        className="sr-only"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
    </label>
  );
}

function RangeControl({
  label,
  value,
  min,
  max,
  step,
  suffix = '',
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  suffix?: string;
  onChange: (value: number) => void;
}) {
  const progress = ((value - min) / (max - min)) * 100;

  return (
    <label className="block rounded-xl border border-zinc-800 bg-zinc-950/45 p-3.5">
      <span className="flex items-center justify-between gap-3">
        <span className="text-xs font-semibold text-zinc-300">{label}</span>
        <output className="rounded-md border border-violet-400/20 bg-violet-400/10 px-2 py-1 text-xs font-bold tabular-nums text-violet-200">
          {value}{suffix}
        </output>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        style={{ '--range-progress': `${progress}%` } as CSSProperties}
        className="particles-range mt-4 w-full"
      />
      <span className="mt-2 flex justify-between text-[10px] text-zinc-600">
        <span>{min}{suffix}</span>
        <span>{max}{suffix}</span>
      </span>
    </label>
  );
}

function ColorControl({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="flex items-center justify-between gap-4 rounded-xl border border-zinc-800 bg-zinc-950/45 p-3.5">
      <span>
        <strong className="block text-xs font-semibold text-zinc-300">
          {label}
        </strong>
        <span className="mt-1 block font-mono text-[11px] uppercase text-zinc-500">
          {value}
        </span>
      </span>
      <span className="relative h-10 w-14 overflow-hidden rounded-lg border border-white/10 shadow-inner">
        <input
          type="color"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="absolute -inset-2 h-14 w-20 cursor-pointer border-0 bg-transparent p-0"
          aria-label={label}
        />
      </span>
    </label>
  );
}

function SelectControl<Value extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: Value;
  options: Array<{ value: Value; label: string }>;
  onChange: (value: Value) => void;
}) {
  return (
    <label className="block rounded-xl border border-zinc-800 bg-zinc-950/45 p-3.5">
      <span className="mb-2 block text-xs font-semibold text-zinc-300">
        {label}
      </span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value as Value)}
        className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-sm text-zinc-100 outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-500/15"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

const shapeOptions: Array<{ value: UserParticleShape; label: string }> = [
  { value: 'circle', label: 'Círculos' },
  { value: 'square', label: 'Cuadrados' },
  { value: 'triangle', label: 'Triángulos' },
  { value: 'star', label: 'Estrellas' },
  { value: 'basic', label: 'Formas combinadas' },
];

const directionOptions: Array<{
  value: UserParticleDirection;
  label: string;
}> = [
  { value: 'none', label: 'Libre' },
  { value: 'top', label: 'Hacia arriba' },
  { value: 'bottom', label: 'Hacia abajo' },
  { value: 'left', label: 'Hacia la izquierda' },
  { value: 'right', label: 'Hacia la derecha' },
];

const hoverModeOptions: Array<{
  value: UserParticleHoverMode;
  label: string;
}> = [
  { value: 'repulse', label: 'Repeler' },
  { value: 'grab', label: 'Conectar' },
  { value: 'bubble', label: 'Expandir' },
];

export default function ParticlesConfigModal({
  isOpen,
  config,
  onClose,
  onSave,
  restoreFocusRef,
}: ParticlesConfigModalProps) {
  const { draft, updateField, validationError, reset } =
    useParticlesConfigDraft(config);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const shouldReduceMotion = useReducedMotion() ?? false;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (validationError) {
      return;
    }

    setIsSaving(true);
    setSaveError('');

    try {
      await onSave(draft);
      onClose();
    } catch (unknownError) {
      setSaveError(
        unknownError instanceof Error
          ? unknownError.message
          : 'No se pudo guardar el fondo.',
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Personalizar fondo"
      description="Definí el movimiento, la forma y la interacción de las partículas de tu portfolio."
      size="xl"
      restoreFocusRef={restoreFocusRef}
    >
      <form onSubmit={handleSubmit} className="space-y-5 text-left">
        <section className="relative isolate min-h-56 overflow-hidden rounded-2xl border border-violet-400/25 bg-[radial-gradient(circle_at_top_right,rgba(124,58,237,0.3),transparent_45%),linear-gradient(145deg,#09090b,#111827)] shadow-2xl shadow-violet-950/30">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:32px_32px]" />
          <ParticlesBackground
            id="particles-config-preview"
            config={draft}
            preview
          />
          <div className="pointer-events-none relative z-10 flex min-h-56 flex-col justify-between p-5 sm:p-6">
            <div className="flex items-start justify-between gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-3 py-1.5 text-[11px] font-semibold text-violet-100 backdrop-blur">
                <SparklesIcon className="h-3.5 w-3.5" />
                Vista previa en vivo
              </span>
              <span className="rounded-full border border-white/10 bg-black/30 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-zinc-300 backdrop-blur">
                {draft.enabled ? `${draft.count} partículas` : 'Desactivado'}
              </span>
            </div>
            <div>
              <p className="max-w-sm text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Tu contenido siempre al frente.
              </p>
              <p className="mt-2 max-w-md text-xs leading-5 text-zinc-400">
                El fondo acompaña la identidad visual sin competir con el portfolio.
              </p>
              {shouldReduceMotion && (
                <span className="mt-3 inline-flex rounded-full border border-cyan-400/20 bg-cyan-400/10 px-2.5 py-1 text-[10px] font-semibold text-cyan-100">
                  Movimiento reducido activo
                </span>
              )}
            </div>
          </div>
        </section>

        <ToggleControl
          label="Activar partículas"
          description="Muestra este fondo en tu portfolio personal y público."
          checked={draft.enabled}
          onChange={(checked) => updateField('enabled', checked)}
        />

        <div className="grid gap-4 lg:grid-cols-2">
          <section className="space-y-3 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4">
            <div className="flex items-center gap-2">
              <SparklesIcon className="h-4 w-4 text-violet-300" />
              <h3 className="text-sm font-semibold text-white">Apariencia</h3>
            </div>
            <RangeControl
              label="Cantidad"
              value={draft.count}
              min={0}
              max={100}
              step={1}
              onChange={(value) => updateField('count', value)}
            />
            <ColorControl
              label="Color de partículas"
              value={draft.color}
              onChange={(value) => updateField('color', value)}
            />
            <SelectControl
              label="Forma"
              value={draft.shape}
              options={shapeOptions}
              onChange={(value) => updateField('shape', value)}
            />
          </section>

          <section className="space-y-3 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4">
            <div className="flex items-center gap-2">
              <BoltIcon className="h-4 w-4 text-cyan-300" />
              <h3 className="text-sm font-semibold text-white">
                Tamaño y movimiento
              </h3>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <RangeControl
                label="Tamaño mínimo"
                value={draft.minSize}
                min={1}
                max={12}
                step={0.5}
                suffix="px"
                onChange={(value) => updateField('minSize', value)}
              />
              <RangeControl
                label="Tamaño máximo"
                value={draft.maxSize}
                min={1}
                max={12}
                step={0.5}
                suffix="px"
                onChange={(value) => updateField('maxSize', value)}
              />
            </div>
            <RangeControl
              label="Velocidad"
              value={draft.speed}
              min={0}
              max={5}
              step={0.1}
              onChange={(value) => updateField('speed', value)}
            />
            <SelectControl
              label="Dirección"
              value={draft.direction}
              options={directionOptions}
              onChange={(value) => updateField('direction', value)}
            />
            <RangeControl
              label="Opacidad"
              value={draft.opacity}
              min={0}
              max={1}
              step={0.05}
              onChange={(value) => updateField('opacity', value)}
            />
          </section>

          <section className="space-y-3 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4">
            <div className="flex items-center gap-2">
              <LinkIcon className="h-4 w-4 text-violet-300" />
              <h3 className="text-sm font-semibold text-white">Conexiones</h3>
            </div>
            <ToggleControl
              label="Unir partículas"
              description="Dibuja líneas entre partículas cercanas."
              checked={draft.linksEnabled}
              onChange={(checked) => updateField('linksEnabled', checked)}
            />
            <ColorControl
              label="Color de conexiones"
              value={draft.linksColor}
              onChange={(value) => updateField('linksColor', value)}
            />
          </section>

          <section className="space-y-3 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4">
            <div className="flex items-center gap-2">
              <CursorArrowRaysIcon className="h-4 w-4 text-cyan-300" />
              <h3 className="text-sm font-semibold text-white">Interacción</h3>
            </div>
            <ToggleControl
              label="Responder al cursor"
              description="Activa una reacción sutil al mover el mouse."
              checked={draft.hoverEnabled}
              onChange={(checked) => updateField('hoverEnabled', checked)}
            />
            <SelectControl
              label="Efecto al pasar el cursor"
              value={draft.hoverMode}
              options={hoverModeOptions}
              onChange={(value) => updateField('hoverMode', value)}
            />
          </section>
        </div>

        {(validationError || saveError) && (
          <p
            role="alert"
            className="rounded-xl border border-red-400/25 bg-red-400/10 px-3 py-2.5 text-sm text-red-200"
          >
            {validationError ?? saveError}
          </p>
        )}

        <div className="flex flex-col-reverse gap-2 border-t border-zinc-800 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-zinc-700 px-4 py-2.5 text-sm font-semibold text-zinc-200 transition hover:border-violet-400/60 hover:text-white"
          >
            <ArrowPathIcon className="h-4 w-4" />
            Descartar cambios
          </button>
          <div className="flex flex-col-reverse gap-2 sm:flex-row">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-zinc-700 px-4 py-2.5 text-sm font-semibold text-zinc-200 transition hover:border-zinc-500"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSaving || Boolean(validationError)}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-violet-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-950/30 transition hover:bg-violet-400 disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:text-zinc-400"
            >
              <CheckIcon className="h-4 w-4" />
              {isSaving ? 'Guardando…' : 'Guardar fondo'}
            </button>
          </div>
        </div>
      </form>
    </BaseModal>
  );
}
