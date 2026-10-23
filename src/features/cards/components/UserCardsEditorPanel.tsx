import {
  AdjustmentsHorizontalIcon,
  CheckIcon,
  DocumentTextIcon,
  PaintBrushIcon,
  PlusIcon,
  Squares2X2Icon,
  SwatchIcon,
} from '@heroicons/react/24/outline';
import {
  useMemo,
  useState,
  type ComponentType,
  type FormEvent,
  type ReactNode,
  type SVGProps,
} from 'react';
import {
  blockIconOptions,
  blockStyleOptions,
  blockTemplateOptions,
  cardStyleOptions,
  cardTemplateOptions,
} from '@/features/cards/constants/cardEditorOptions';
import type { StyleOption, TemplateOption } from '@/features/cards/constants/cardEditorOptions';
import type {
  UserCardBlockDto,
  UserCardBlockPayload,
  UserCardDto,
  UserCardPayload,
} from '@/features/cards/types/userCard.types';
import {
  getHexColorFromStyleText,
  getHorizontalPlacementClassFromStyleText,
  type HexColorTarget,
  isValidHexColor,
  normalizeStyleText,
  styleTextIncludes,
  toggleStyleOption,
  upsertHexColorStyle,
} from '@/features/cards/services/styleText';
import FloatingEditorWindow from './FloatingEditorWindow';
import UserCard from './UserCard';
import UserCardsEditSection from './UserCardsEditSection';
import UserCardsSection from './UserCardsSection';
import type { StatusToastKind } from '@/shared/components/StatusToast';
import LoadingState from '@/shared/components/LoadingState';
import { useLanguage } from '@/shared/i18n/useLanguage';

interface UserCardsEditorPanelProps {
  cards: UserCardDto[];
  displayCards: UserCardDto[];
  // TODO(showCardNumber): Uncomment when card numbering is enabled again.
  // showCardNumber?: boolean;
  isEditMode: boolean;
  isLoading: boolean;
  error: string | null;
  onCreateCard: (payload: UserCardPayload) => Promise<UserCardDto>;
  onUpdateCard: (
    userCardId: number,
    payload: UserCardPayload,
  ) => Promise<UserCardDto>;
  onDeleteCard: (userCardId: number) => Promise<void>;
  onCreateBlock: (
    userCardId: number,
    payload: UserCardBlockPayload,
  ) => Promise<void>;
  onUpdateBlock: (
    userCardId: number,
    userCardBlockId: number,
    payload: UserCardBlockPayload,
  ) => Promise<void>;
  onDeleteBlock: (
    userCardId: number,
    userCardBlockId: number,
  ) => Promise<void>;
  onFeedback?: (message: string, kind: StatusToastKind) => void;
}

type CardDraft = UserCardPayload;
type BlockDraft = UserCardBlockPayload;
type CardEditor = { mode: 'create' } | { mode: 'edit'; cardId: number };
type BlockEditor =
  | { mode: 'create'; cardId: number }
  | { mode: 'edit'; cardId: number; blockId: number };
type EditorSectionIcon = ComponentType<SVGProps<SVGSVGElement>>;

const styleOptionGroupLabels: Record<string, string> = {
  accent: 'Acento',
  blockDistribution: 'Distribucion de blocks',
  blockSpacing: 'Espacio vertical entre blocks',
  blockSpacingX: 'Espacio horizontal entre blocks',
  contentAlign: 'Alineacion de contenido',
  contentPaddingX: 'Padding horizontal del contenido',
  contentPaddingY: 'Padding vertical del contenido',
  contentSize: 'Tamano del contenido',
  contentSpacing: 'Margen del contenido',
  contentWeight: 'Grosor del contenido',
  descriptionPaddingX: 'Padding horizontal de descripcion',
  descriptionPaddingY: 'Padding vertical de descripcion',
  descriptionSpacing: 'Margen de descripcion',
  headerSpacing: 'Margen del header',
  height: 'Altura',
  horizontalPosition: 'Posicion horizontal',
  margin: 'Margen general',
  marginBottom: 'Margen inferior',
  marginTop: 'Margen superior',
  opacity: 'Opacidad',
  overflow: 'Overflow',
  radius: 'Radio y forma',
  shadow: 'Sombra',
  spacingX: 'Padding horizontal',
  spacingY: 'Padding vertical',
  surface: 'Fondo',
  textAlign: 'Alineacion de texto',
  titleAlign: 'Alineacion del titulo',
  titlePaddingX: 'Padding horizontal del titulo',
  titlePaddingY: 'Padding vertical del titulo',
  titleSize: 'Tamano del titulo',
  titleSpacing: 'Margen del titulo',
  titleWeight: 'Grosor del titulo',
  verticalPosition: 'Posicion vertical',
};

const styleOptionCategoryLabels: Record<string, string> = {
  typography: 'Texto',
  layout: 'Layout',
  spacing: 'Espaciado',
  appearance: 'Fondo, borde y color',
  sizing: 'Tamano y forma',
  behavior: 'Comportamiento',
  advanced: 'Otros estilos',
};

const styleOptionGroupCategories: Record<string, string> = {
  accent: 'appearance',
  blockDistribution: 'layout',
  blockSpacing: 'spacing',
  blockSpacingX: 'spacing',
  contentAlign: 'layout',
  contentPaddingX: 'spacing',
  contentPaddingY: 'spacing',
  contentSize: 'typography',
  contentSpacing: 'spacing',
  contentWeight: 'typography',
  descriptionPaddingX: 'spacing',
  descriptionPaddingY: 'spacing',
  descriptionSpacing: 'spacing',
  headerSpacing: 'spacing',
  height: 'sizing',
  horizontalPosition: 'layout',
  margin: 'spacing',
  marginBottom: 'spacing',
  marginTop: 'spacing',
  opacity: 'appearance',
  overflow: 'behavior',
  radius: 'sizing',
  shadow: 'appearance',
  spacingX: 'spacing',
  spacingY: 'spacing',
  surface: 'appearance',
  textAlign: 'typography',
  titleAlign: 'typography',
  titlePaddingX: 'spacing',
  titlePaddingY: 'spacing',
  titleSize: 'typography',
  titleSpacing: 'spacing',
  titleWeight: 'typography',
  verticalPosition: 'layout',
};

const fieldClass =
  'w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-950 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white';
const labelClass =
  'mb-1.5 block text-xs font-semibold text-zinc-600 dark:text-zinc-300';
const formClass =
  'text-left';

function getNextSortOrder(items: Array<{ sortOrder: number }>) {
  return Math.max(0, ...items.map((item) => item.sortOrder)) + 1;
}

function getSafeWidth(width: number) {
  if (!Number.isFinite(width)) {
    return 100;
  }

  return Math.min(Math.max(width, 0), 100);
}

function getSafeSortOrder(sortOrder: number) {
  if (!Number.isFinite(sortOrder)) {
    return 0;
  }

  return Math.max(0, Math.round(sortOrder));
}

function createEmptyCardDraft(cards: UserCardDto[], defaultTitle = 'New portfolio card'): CardDraft {
  return {
    title: defaultTitle,
    description: '',
    template: 'default',
    styleText: '',
    width: 100,
    sortOrder: getNextSortOrder(cards),
  };
}

function createCardDraft(card: UserCardDto): CardDraft {
  return {
    title: card.title,
    description: card.description ?? '',
    template: card.template ?? 'default',
    styleText: card.styleText ?? '',
    width: card.width,
    sortOrder: card.sortOrder,
  };
}

function createEmptyBlockDraft(blocks: UserCardBlockDto[], defaultTitle = 'New block'): BlockDraft {
  return {
    type: 'text',
    title: defaultTitle,
    content: 'Write the block content here.',
    mediaUrl: '',
    icon: '',
    template: 'default',
    styleText: '',
    caption: '',
    width: 100,
    sortOrder: getNextSortOrder(blocks),
  };
}

function createBlockDraft(block: UserCardBlockDto): BlockDraft {
  return {
    type: block.type,
    title: block.title ?? '',
    content: block.content ?? '',
    mediaUrl: block.mediaUrl ?? '',
    icon: block.icon ?? '',
    template: block.template ?? 'default',
    styleText: block.styleText ?? '',
    caption: block.caption ?? '',
    width: block.width,
    sortOrder: block.sortOrder,
  };
}

function getCardPayload(draft: CardDraft): UserCardPayload {
  return {
    title: draft.title.trim() || 'Untitled card',
    description: draft.description?.trim() || null,
    template: draft.template?.trim() || 'default',
    styleText: normalizeStyleText(draft.styleText),
    width: getSafeWidth(Number(draft.width)),
    sortOrder: getSafeSortOrder(Number(draft.sortOrder)),
  };
}

function getBlockPayload(draft: BlockDraft): UserCardBlockPayload {
  return {
    type: draft.type.trim() || 'text',
    title: draft.title?.trim() || null,
    content: draft.content?.trim() || null,
    mediaUrl: draft.mediaUrl?.trim() || null,
    icon: draft.icon?.trim() || null,
    template: draft.template?.trim() || 'default',
    styleText: normalizeStyleText(draft.styleText),
    caption: draft.caption?.trim() || null,
    width: getSafeWidth(Number(draft.width)),
    sortOrder: getSafeSortOrder(Number(draft.sortOrder)),
  };
}

function createPreviewCard(
  draft: CardDraft,
  id: number,
  blocks: UserCardBlockDto[],
): UserCardDto {
  return {
    ...getCardPayload(draft),
    id,
    userId: 0,
    blocks,
  };
}

function createPreviewBlock(
  draft: BlockDraft,
  id: number,
  userCardId: number,
): UserCardBlockDto {
  return {
    ...getBlockPayload(draft),
    id,
    userCardId,
  };
}

function TemplateSelect({
  id,
  label,
  options,
  value,
  onChange,
}: {
  id: string;
  label: string;
  options: TemplateOption[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label>
      <span className={labelClass}>{label}</span>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={fieldClass}
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

function IconSelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const { language, t } = useLanguage();

  return (
    <label>
      <span className={labelClass}>{t('editorIcon')}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={fieldClass}
      >
        {blockIconOptions.map((option) => (
          <option key={option.value || 'auto'} value={option.value}>
            {language === 'en'
              ? option.value === ''
                ? 'Automatic by type'
                : option.value === 'none'
                  ? 'No icon'
                  : option.value.charAt(0).toUpperCase() + option.value.slice(1)
              : option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function WidthControl({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  const safeValue = getSafeWidth(value);

  return (
    <label>
      <span className={labelClass}>{label}</span>
      <div className="grid gap-2">
        <input
          type="number"
          min={0}
          max={100}
          value={safeValue}
          onChange={(event) => onChange(Number(event.target.value))}
          className={fieldClass}
        />
        <input
          type="range"
          min={0}
          max={100}
          value={safeValue}
          onChange={(event) => onChange(Number(event.target.value))}
          className="w-full accent-cyan-700"
        />
      </div>
    </label>
  );
}

function SortOrderControl({
  value,
  max,
  onChange,
}: {
  value: number;
  max: number;
  onChange: (value: number) => void;
}) {
  const { t } = useLanguage();
  const safeValue = getSafeSortOrder(value);
  const safeMax = Math.max(10, getSafeSortOrder(max), safeValue);

  return (
    <label>
      <span className={labelClass}>{t('editorSortOrder')}</span>
      <div className="grid gap-2">
        <input
          type="number"
          min={0}
          max={safeMax}
          value={safeValue}
          onChange={(event) => onChange(Number(event.target.value))}
          className={fieldClass}
        />
        <input
          type="range"
          min={0}
          max={safeMax}
          value={safeValue}
          onChange={(event) => onChange(Number(event.target.value))}
          className="w-full accent-cyan-700"
        />
      </div>
    </label>
  );
}

const hexColorControls: Array<{
  target: HexColorTarget;
  label: string;
  fallback: string;
}> = [
  { target: 'bg', label: 'Background', fallback: '#0f172a' },
  { target: 'text', label: 'Text', fallback: '#f8fafc' },
  { target: 'border', label: 'Border', fallback: '#06b6d4' },
  { target: 'ring', label: 'Ring', fallback: '#22c55e' },
];

function HexColorControls({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const { language, t } = useLanguage();
  const spanishColorLabels: Record<HexColorTarget, string> = {
    bg: 'Fondo',
    text: 'Texto',
    border: 'Borde',
    ring: 'Contorno',
  };

  return (
    <div className="grid gap-3 md:grid-cols-2">
      {hexColorControls.map((control) => {
        const selectedColor = getHexColorFromStyleText(value, control.target);
        const pickerValue = isValidHexColor(selectedColor)
          ? selectedColor
          : control.fallback;

        return (
          <div
            key={control.target}
            className="rounded-lg border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-950"
          >
            <div className="mb-2 flex items-center justify-between gap-2">
              <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-300">
                {language === 'es' ? spanishColorLabels[control.target] : control.label}
              </span>
              <button
                type="button"
                onClick={() =>
                  onChange(upsertHexColorStyle(value, control.target, ''))
                }
                className="text-xs font-semibold text-zinc-500 transition hover:text-cyan-700 dark:text-zinc-400 dark:hover:text-cyan-200"
              >
                {t('editorClear')}
              </button>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={pickerValue}
                onChange={(event) =>
                  onChange(
                    upsertHexColorStyle(
                      value,
                      control.target,
                      event.target.value,
                    ),
                  )
                }
                className="h-10 w-12 cursor-pointer rounded-lg border border-zinc-200 bg-transparent p-1 dark:border-zinc-800"
                aria-label={`${control.label} color`}
              />
              <input
                value={selectedColor}
                placeholder={control.fallback}
                onChange={(event) => {
                  const nextColor = event.target.value.trim();

                  if (nextColor === '' || isValidHexColor(nextColor)) {
                    onChange(
                      upsertHexColorStyle(value, control.target, nextColor),
                    );
                  }
                }}
                className={fieldClass}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function EditorSection({
  title,
  description,
  icon: Icon,
  children,
}: {
  title: string;
  description?: string;
  icon: EditorSectionIcon;
  children: ReactNode;
}) {
  return (
    <section className="rounded-lg border border-zinc-200 bg-zinc-50/70 p-4 dark:border-zinc-800 dark:bg-zinc-900/40">
      <div className="mb-4 flex items-start gap-3">
        <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-cyan-100 bg-cyan-50 text-cyan-700 dark:border-cyan-400/20 dark:bg-cyan-400/10 dark:text-cyan-200">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <h3 className="text-sm font-semibold text-zinc-950 dark:text-white">
            {title}
          </h3>
          {description && (
            <p className="mt-0.5 text-xs leading-5 text-zinc-500 dark:text-zinc-400">
              {description}
            </p>
          )}
        </div>
      </div>
      {children}
    </section>
  );
}

function formatTechnicalLabel(value: string) {
  const label = value
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[-_]+/g, ' ')
    .trim();

  return label.charAt(0).toUpperCase() + label.slice(1);
}

function StyleOptionSelector({
  options,
  value,
  onChange,
}: {
  options: StyleOption[];
  value: string;
  onChange: (value: string) => void;
}) {
  const { language, t } = useLanguage();
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>(
    {},
  );
  const categorizedOptions = useMemo(() => {
    const categories: Record<string, Record<string, StyleOption[]>> = {};

    options.forEach((option) => {
      const category = styleOptionGroupCategories[option.group] ?? 'advanced';

      categories[category] ??= {};
      categories[category][option.group] = [
        ...(categories[category][option.group] ?? []),
        option,
      ];
    });

    return Object.entries(categories).map(([category, groups]) => ({
      category,
      groups: Object.entries(groups),
    }));
  }, [options]);

  return (
    <div className="space-y-3">
      {categorizedOptions.map(({ category, groups }) => {
        const selectedCount = groups
          .flatMap(([, groupOptions]) => groupOptions)
          .filter((option) => styleTextIncludes(value, option)).length;
        const isOpen = openCategories[category] ?? selectedCount > 0;

        return (
          <div
            key={category}
            className="rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950"
          >
            <button
              type="button"
              className="flex w-full items-center justify-between gap-3 px-3 py-2.5 text-left text-sm font-semibold text-zinc-800 transition hover:text-cyan-700 dark:text-zinc-100 dark:hover:text-cyan-200"
              onClick={() =>
                setOpenCategories((currentOpenCategories) => ({
                  ...currentOpenCategories,
                  [category]: !isOpen,
                }))
              }
              aria-expanded={isOpen}
            >
              <span>
                {language === 'en'
                  ? formatTechnicalLabel(category)
                  : styleOptionCategoryLabels[category] ?? category}
              </span>
              <span className="flex items-center gap-2 text-xs font-medium text-zinc-500 dark:text-zinc-400">
                {selectedCount > 0
                  ? t('editorSelected', { count: selectedCount })
                  : t('editorCollapsed')}
                <span
                  className={`text-base leading-none transition ${
                    isOpen ? 'rotate-90' : ''
                  }`}
                >
                  &gt;
                </span>
              </span>
            </button>
            {isOpen && (
              <div className="space-y-4 border-t border-zinc-200 px-3 py-3 dark:border-zinc-800">
                {groups.map(([group, groupOptions]) => (
                  <fieldset key={group}>
                    <legend className="mb-1.5 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                      {language === 'en'
                        ? formatTechnicalLabel(group)
                        : styleOptionGroupLabels[group] ?? group}
                    </legend>
                    <div className="flex flex-wrap gap-2">
                      {groupOptions.map((option) => {
                        const selected = styleTextIncludes(value, option);

                        return (
                          <button
                            key={option.id}
                            type="button"
                            onClick={() =>
                              onChange(
                                toggleStyleOption(value, option, options),
                              )
                            }
                            className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${
                              selected
                                ? 'border-cyan-500 bg-cyan-50 text-cyan-800 dark:border-cyan-400/50 dark:bg-cyan-400/10 dark:text-cyan-100'
                                : 'border-zinc-200 bg-white text-zinc-600 hover:border-cyan-300 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300'
                            }`}
                          >
                            {language === 'en'
                              ? formatTechnicalLabel(option.id.replace(/^(card|block)-/, ''))
                              : option.label}
                          </button>
                        );
                      })}
                    </div>
                  </fieldset>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function EditorActions({
  onCancel,
  label,
  isSaving,
}: {
  onCancel: () => void;
  label: string;
  isSaving: boolean;
}) {
  const { t } = useLanguage();
  return (
    <div className="flex gap-2 pt-4">
      <button
        type="submit"
        disabled={isSaving}
        className="inline-flex items-center gap-2 rounded-lg bg-cyan-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-cyan-600 disabled:cursor-wait disabled:bg-zinc-500"
      >
        <CheckIcon className="h-4 w-4" aria-hidden="true" />
        {isSaving ? t('actionSaving') : label}
      </button>
      <button
        type="button"
        disabled={isSaving}
        onClick={onCancel}
        className="rounded-lg border border-zinc-200 px-4 py-2.5 text-sm font-semibold text-zinc-700 transition hover:border-cyan-300 disabled:cursor-wait disabled:opacity-50 dark:border-zinc-800 dark:text-zinc-200"
      >
        {t('actionCancel')}
      </button>
    </div>
  );
}

export default function UserCardsEditorPanel({
  cards,
  displayCards,
  // showCardNumber = false,
  isEditMode,
  isLoading,
  error,
  onCreateCard,
  onUpdateCard,
  onDeleteCard,
  onCreateBlock,
  onUpdateBlock,
  onDeleteBlock,
  onFeedback,
}: UserCardsEditorPanelProps) {
  const { language, t } = useLanguage();
  const newCardTitle = language === 'es' ? 'Nueva tarjeta del portfolio' : 'New portfolio card';
  const newBlockTitle = language === 'es' ? 'Nuevo bloque' : 'New block';
  const sortedCards = useMemo(
    () =>
      [...cards].sort(
        (currentCard, nextCard) => currentCard.sortOrder - nextCard.sortOrder,
      ),
    [cards],
  );
  const [cardEditor, setCardEditor] = useState<CardEditor | null>(null);
  const [blockEditor, setBlockEditor] = useState<BlockEditor | null>(null);
  const [cardDraft, setCardDraft] = useState<CardDraft>(() =>
    createEmptyCardDraft([], newCardTitle),
  );
  const [blockDraft, setBlockDraft] = useState<BlockDraft>(() =>
    createEmptyBlockDraft([], newBlockTitle),
  );
  const [statusMessage, setStatusMessage] = useState('');
  const [mutationError, setMutationError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const cardEditorSource =
    cardEditor?.mode === 'edit'
      ? sortedCards.find((card) => card.id === cardEditor.cardId) ?? null
      : null;
  const blockEditorCard =
    blockEditor !== null
      ? sortedCards.find((card) => card.id === blockEditor.cardId) ?? null
      : null;
  const cardPreview =
    cardEditor === null
      ? null
      : createPreviewCard(
          cardDraft,
          cardEditor.mode === 'edit' ? cardEditor.cardId : -1,
          cardEditorSource?.blocks ?? [],
        );
  const blockPreviewCard =
    blockEditor === null || blockEditorCard === null
      ? null
      : (() => {
          const previewBlock = createPreviewBlock(
            blockDraft,
            blockEditor.mode === 'edit' ? blockEditor.blockId : -1,
            blockEditor.cardId,
          );
          const blocks =
            blockEditor.mode === 'create'
              ? [...blockEditorCard.blocks, previewBlock]
              : blockEditorCard.blocks.map((block) =>
                  block.id === blockEditor.blockId ? previewBlock : block,
                );

          return {
            ...blockEditorCard,
            blocks,
          };
        })();
  const activeCardId =
    cardEditor?.mode === 'edit'
      ? cardEditor.cardId
      : blockEditor?.cardId ?? null;
  const editModeCards = sortedCards.map((card) => {
    if (cardEditor?.mode === 'edit' && cardPreview && card.id === cardEditor.cardId) {
      return cardPreview;
    }

    if (blockEditor && blockPreviewCard && card.id === blockEditor.cardId) {
      return blockPreviewCard;
    }

    return card;
  });
  const openCreateCard = () => {
    setCardEditor({ mode: 'create' });
    setBlockEditor(null);
    setCardDraft(createEmptyCardDraft(sortedCards, newCardTitle));
    setStatusMessage('');
    setMutationError('');
  };

  const openEditCard = (card: UserCardDto) => {
    const sourceCard = sortedCards.find((candidate) => candidate.id === card.id) ?? card;

    setCardEditor({ mode: 'edit', cardId: sourceCard.id });
    setBlockEditor(null);
    setCardDraft(createCardDraft(sourceCard));
    setStatusMessage('');
    setMutationError('');
  };

  const closeCardEditor = () => {
    setCardEditor(null);
    setCardDraft(createEmptyCardDraft(sortedCards, newCardTitle));
    setMutationError('');
  };

  const openCreateBlock = (card: UserCardDto) => {
    const sourceCard = sortedCards.find((candidate) => candidate.id === card.id) ?? card;

    setCardEditor(null);
    setBlockEditor({ mode: 'create', cardId: sourceCard.id });
    setBlockDraft(createEmptyBlockDraft(sourceCard.blocks, newBlockTitle));
    setStatusMessage('');
    setMutationError('');
  };

  const openEditBlock = (card: UserCardDto, block: UserCardBlockDto) => {
    if (block.id < 0) {
      return;
    }

    const sourceCard = sortedCards.find((candidate) => candidate.id === card.id) ?? card;
    const sourceBlock =
      sourceCard.blocks.find((candidate) => candidate.id === block.id) ?? block;

    setCardEditor(null);
    setBlockEditor({
      mode: 'edit',
      cardId: sourceCard.id,
      blockId: sourceBlock.id,
    });
    setBlockDraft(createBlockDraft(sourceBlock));
    setStatusMessage('');
    setMutationError('');
  };

  const closeBlockEditor = () => {
    setBlockEditor(null);
    setBlockDraft(createEmptyBlockDraft(blockEditorCard?.blocks ?? [], newBlockTitle));
    setMutationError('');
  };

  const handleSaveCard = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!cardEditor) {
      return;
    }

    setIsSaving(true);
    setMutationError('');

    try {
      const payload = getCardPayload(cardDraft);
      const savedCard =
        cardEditor.mode === 'create'
          ? await onCreateCard(payload)
          : await onUpdateCard(cardEditor.cardId, payload);
      const message = t('itemSaved', { name: savedCard.title });

      setCardEditor(null);
      setCardDraft(createEmptyCardDraft(sortedCards, newCardTitle));
      setStatusMessage(message);
      onFeedback?.(message, 'success');
    } catch (unknownError) {
      const message =
        unknownError instanceof Error
          ? unknownError.message
          : t('cardSaveError');

      setMutationError(message);
      onFeedback?.(message, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteCard = async (card: UserCardDto) => {
    if (!window.confirm(t('cardDeleteConfirm', { name: card.title }))) {
      return;
    }

    await onDeleteCard(card.id);

    if (cardEditor?.mode === 'edit' && cardEditor.cardId === card.id) {
      closeCardEditor();
    }

    if (blockEditor?.cardId === card.id) {
      closeBlockEditor();
    }

    setStatusMessage(t('itemDeleted', { name: card.title }));
  };

  const handleSaveBlock = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!blockEditor) {
      return;
    }

    setIsSaving(true);

    try {
      setMutationError('');

      const payload = getBlockPayload(blockDraft);
      if (blockEditor.mode === 'create') {
        await onCreateBlock(blockEditor.cardId, payload);
      } else {
        await onUpdateBlock(
          blockEditor.cardId,
          blockEditor.blockId,
          payload,
        );
      }

      setBlockEditor(null);
      setBlockDraft(createEmptyBlockDraft(blockEditorCard?.blocks ?? [], newBlockTitle));
      const message = t('blockSaveSuccess');
      setStatusMessage(message);
      onFeedback?.(message, 'success');
    } catch (unknownError) {
      const message =
        unknownError instanceof Error
          ? unknownError.message
          : t('blockSaveError');
      setMutationError(message);
      onFeedback?.(message, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteBlock = async (
    card: UserCardDto,
    block: UserCardBlockDto,
  ) => {
    if (block.id < 0) {
      closeBlockEditor();
      return;
    }

    await onDeleteBlock(card.id, block.id);

    if (blockEditor?.mode === 'edit' && blockEditor.blockId === block.id) {
      closeBlockEditor();
    }

    setStatusMessage(t('itemDeleted', { name: block.title ?? block.type }));
  };

  const renderCardEditor = (): ReactNode => {
    if (!cardEditor) {
      return null;
    }

    return (
      <form onSubmit={handleSaveCard} className={formClass}>
        <CardFields
          draft={cardDraft}
          sortOrderMax={Math.max(
            10,
            getNextSortOrder(sortedCards),
            Number(cardDraft.sortOrder),
          )}
          onChange={setCardDraft}
        />
        <EditorActions
          onCancel={closeCardEditor}
          label={t('actionSave')}
          isSaving={isSaving}
        />
      </form>
    );
  };

  const renderBlockEditor = (): ReactNode => {
    if (!blockEditor || !blockEditorCard) {
      return null;
    }

    return (
      <form onSubmit={handleSaveBlock} className={formClass}>
        <BlockFields
          draft={blockDraft}
          sortOrderMax={Math.max(
            10,
            getNextSortOrder(blockEditorCard.blocks),
            Number(blockDraft.sortOrder),
          )}
          onChange={setBlockDraft}
        />
        <EditorActions
          onCancel={closeBlockEditor}
          label={t('actionSave')}
          isSaving={isSaving}
        />
      </form>
    );
  };
  const activeBlockId =
    blockEditor?.mode === 'edit' ? blockEditor.blockId : null;
  const floatingEditorTitle =
    cardEditor !== null
      ? cardEditor.mode === 'create'
        ? t('cardCreate')
        : t('cardEdit')
      : blockEditor?.mode === 'create'
        ? t('blockCreate')
        : blockEditor?.mode === 'edit'
          ? t('blockEdit')
          : '';
  const floatingEditorDescription =
    cardEditor !== null
      ? t('cardEditorDrag')
      : blockEditorCard
        ? t('blockEditorDrag', { name: blockEditorCard.title })
        : t('cardEditorDrag');
  const floatingEditorContent =
    cardEditor !== null
      ? renderCardEditor()
      : blockEditor !== null
        ? renderBlockEditor()
        : null;
  const floatingEditorAvoidSelector =
    activeBlockId !== null
      ? `[data-user-card-block-id="${activeBlockId}"]`
      : activeCardId !== null
        ? `[data-user-card-id="${activeCardId}"]`
        : null;
  const closeFloatingEditor =
    cardEditor !== null ? closeCardEditor : closeBlockEditor;

  if (!isEditMode) {
    return (
      <UserCardsSection
        cards={displayCards}
        // TODO(showCardNumber): Uncomment when card numbering is enabled again.
        // showCardNumber={showCardNumber}
      />
    );
  }

  return (
    <>
      <section className="w-full px-4 py-8">
        <div className="mx-auto max-w-5xl">
          <div className="flex flex-col gap-3 text-left md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                {t('cardsManager')}
              </p>
              <h2 className="mt-2 text-3xl font-semibold text-zinc-950 dark:text-white">
                {t('cardsAndBlocks')}
              </h2>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={openCreateCard}
                className="inline-flex items-center gap-2 rounded-lg bg-zinc-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-cyan-700 dark:bg-white dark:text-zinc-950 dark:hover:bg-cyan-100"
              >
                <PlusIcon className="h-4 w-4" aria-hidden="true" />
                {t('cardCreate')}
              </button>
            </div>
          </div>

          {isLoading && (
            <LoadingState
              className="mt-4"
              label={t('loadingContent')}
              variant="compact"
            />
          )}

          {error && (
            <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-left text-sm text-red-700 dark:border-red-400/20 dark:bg-red-400/10 dark:text-red-200">
              {error}
            </p>
          )}

          {mutationError && (
            <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-left text-sm text-red-700 dark:border-red-400/20 dark:bg-red-400/10 dark:text-red-200">
              {mutationError}
            </p>
          )}

          {statusMessage && (
            <p className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-left text-sm text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-200">
              {statusMessage}
            </p>
          )}
        </div>
      </section>

      {cardEditor?.mode === 'create' && cardPreview && (
        <section className="w-full px-4 pb-8">
          <div className="mx-auto max-w-5xl">
            <div className="-m-2.5 mb-2 flex flex-wrap">
              <div
                className={`p-2.5 ${getHorizontalPlacementClassFromStyleText(cardPreview.styleText)}`}
                style={{ width: `${getSafeWidth(cardPreview.width)}%` }}
              >
                <UserCard
                  card={cardPreview}
                  // TODO(showCardNumber): Uncomment when card numbering is enabled again.
                  // showCardNumber
                  showBlockMetadata
                />
              </div>
            </div>
          </div>
        </section>
      )}

      <UserCardsEditSection
        cards={editModeCards}
        activeCardId={activeCardId}
        onEditCard={openEditCard}
        onDeleteCard={(card) => void handleDeleteCard(card)}
        onAddBlock={openCreateBlock}
        onEditBlock={openEditBlock}
        onDeleteBlock={(card, block) => void handleDeleteBlock(card, block)}
      />

      {floatingEditorContent && (
        <FloatingEditorWindow
          title={floatingEditorTitle}
          description={floatingEditorDescription}
          avoidSelector={floatingEditorAvoidSelector}
          onClose={closeFloatingEditor}
        >
          {floatingEditorContent}
        </FloatingEditorWindow>
      )}
    </>
  );
}

function CardFields({
  draft,
  sortOrderMax,
  onChange,
}: {
  draft: CardDraft;
  sortOrderMax: number;
  onChange: React.Dispatch<React.SetStateAction<CardDraft>>;
}) {
  const { t } = useLanguage();

  return (
    <div className="space-y-4">
      <EditorSection
        title={t('cardContent')}
        description={t('cardContentDescription')}
        icon={Squares2X2Icon}
      >
        <div className="grid gap-4 md:grid-cols-2">
          <label>
            <span className={labelClass}>{t('editorTitle')}</span>
            <input
              value={draft.title}
              onChange={(event) =>
                onChange((currentDraft) => ({
                  ...currentDraft,
                  title: event.target.value,
                }))
              }
              className={fieldClass}
            />
          </label>
          <TemplateSelect
            id="card-template"
            label={t('cardTemplate')}
            options={cardTemplateOptions}
            value={draft.template ?? 'default'}
            onChange={(template) =>
              onChange((currentDraft) => ({ ...currentDraft, template }))
            }
          />
          <WidthControl
            label={t('editorWidth')}
            value={draft.width}
            onChange={(width) =>
              onChange((currentDraft) => ({ ...currentDraft, width }))
            }
          />
          <SortOrderControl
            value={draft.sortOrder}
            max={sortOrderMax}
            onChange={(sortOrder) =>
              onChange((currentDraft) => ({ ...currentDraft, sortOrder }))
            }
          />
          <label className="md:col-span-2">
            <span className={labelClass}>{t('editorDescription')}</span>
            <textarea
              value={draft.description ?? ''}
              onChange={(event) =>
                onChange((currentDraft) => ({
                  ...currentDraft,
                  description: event.target.value,
                }))
              }
              rows={3}
              className={fieldClass}
            />
          </label>
        </div>
      </EditorSection>

      <EditorSection
        title={t('cardStyles')}
        description={t('cardStylesDescription')}
        icon={SwatchIcon}
      >
        <div className="space-y-4">
          <HexColorControls
            value={draft.styleText ?? ''}
            onChange={(styleText) =>
              onChange((currentDraft) => ({ ...currentDraft, styleText }))
            }
          />
          <StyleOptionSelector
            options={cardStyleOptions}
            value={draft.styleText ?? ''}
            onChange={(styleText) =>
              onChange((currentDraft) => ({ ...currentDraft, styleText }))
            }
          />
        </div>
      </EditorSection>

      <EditorSection
        title={t('advancedStyles')}
        description={t('advancedStylesDescription')}
        icon={AdjustmentsHorizontalIcon}
      >
        <label className="block">
          <span className={labelClass}>styleText</span>
          <textarea
            value={draft.styleText ?? ''}
            onChange={(event) =>
              onChange((currentDraft) => ({
                ...currentDraft,
                styleText: event.target.value,
              }))
            }
            rows={2}
            className={fieldClass}
          />
        </label>
      </EditorSection>
    </div>
  );
}

function BlockFields({
  draft,
  sortOrderMax,
  onChange,
}: {
  draft: BlockDraft;
  sortOrderMax: number;
  onChange: React.Dispatch<React.SetStateAction<BlockDraft>>;
}) {
  const { language, t } = useLanguage();

  return (
    <div className="space-y-4">
      <EditorSection
        title={t('blockStructure')}
        description={t('blockStructureDescription')}
        icon={Squares2X2Icon}
      >
        <div className="grid gap-4 md:grid-cols-2">
          <label>
            <span className={labelClass}>{t('editorType')}</span>
            <select
              value={draft.type}
              onChange={(event) =>
                onChange((currentDraft) => ({
                  ...currentDraft,
                  type: event.target.value,
                }))
              }
              className={fieldClass}
            >
              <option value="text">{language === 'es' ? 'Texto' : 'Text'}</option>
              <option value="media">Media</option>
              <option value="image">{language === 'es' ? 'Imagen' : 'Image'}</option>
              <option value="video">Video</option>
              <option value="list">{language === 'es' ? 'Lista' : 'List'}</option>
              <option value="quote">{language === 'es' ? 'Cita' : 'Quote'}</option>
            </select>
          </label>
          <TemplateSelect
            id="block-template"
            label={t('blockTemplate')}
            options={blockTemplateOptions}
            value={draft.template ?? 'default'}
            onChange={(template) =>
              onChange((currentDraft) => ({ ...currentDraft, template }))
            }
          />
          <IconSelect
            value={draft.icon ?? ''}
            onChange={(icon) =>
              onChange((currentDraft) => ({ ...currentDraft, icon }))
            }
          />
          <WidthControl
            label={t('editorWidth')}
            value={draft.width}
            onChange={(width) =>
              onChange((currentDraft) => ({ ...currentDraft, width }))
            }
          />
          <SortOrderControl
            value={draft.sortOrder}
            max={sortOrderMax}
            onChange={(sortOrder) =>
              onChange((currentDraft) => ({ ...currentDraft, sortOrder }))
            }
          />
        </div>
      </EditorSection>

      <EditorSection
        title={t('blockContent')}
        description={t('blockContentDescription')}
        icon={DocumentTextIcon}
      >
        <div className="grid gap-4 md:grid-cols-2">
          <label>
            <span className={labelClass}>{t('editorTitle')}</span>
            <input
              value={draft.title ?? ''}
              onChange={(event) =>
                onChange((currentDraft) => ({
                  ...currentDraft,
                  title: event.target.value,
                }))
              }
              className={fieldClass}
            />
          </label>
          <label>
            <span className={labelClass}>{t('editorMediaUrl')}</span>
            <input
              value={draft.mediaUrl ?? ''}
              onChange={(event) =>
                onChange((currentDraft) => ({
                  ...currentDraft,
                  mediaUrl: event.target.value,
                }))
              }
              className={fieldClass}
            />
          </label>
          <label className="md:col-span-2">
            <span className={labelClass}>{t('editorContent')}</span>
            <textarea
              value={draft.content ?? ''}
              onChange={(event) =>
                onChange((currentDraft) => ({
                  ...currentDraft,
                  content: event.target.value,
                }))
              }
              rows={3}
              className={fieldClass}
            />
          </label>
          <label className="md:col-span-2">
            <span className={labelClass}>{t('editorCaption')}</span>
            <input
              value={draft.caption ?? ''}
              onChange={(event) =>
                onChange((currentDraft) => ({
                  ...currentDraft,
                  caption: event.target.value,
                }))
              }
              className={fieldClass}
            />
          </label>
        </div>
      </EditorSection>

      <EditorSection
        title={t('blockStyles')}
        description={t('blockStylesDescription')}
        icon={PaintBrushIcon}
      >
        <div className="space-y-4">
          <HexColorControls
            value={draft.styleText ?? ''}
            onChange={(styleText) =>
              onChange((currentDraft) => ({ ...currentDraft, styleText }))
            }
          />
          <StyleOptionSelector
            options={blockStyleOptions}
            value={draft.styleText ?? ''}
            onChange={(styleText) =>
              onChange((currentDraft) => ({ ...currentDraft, styleText }))
            }
          />
        </div>
      </EditorSection>

      <EditorSection
        title={t('advancedStyles')}
        description={t('advancedStylesDescription')}
        icon={AdjustmentsHorizontalIcon}
      >
        <label className="block">
          <span className={labelClass}>styleText</span>
          <textarea
            value={draft.styleText ?? ''}
            onChange={(event) =>
              onChange((currentDraft) => ({
                ...currentDraft,
                styleText: event.target.value,
              }))
            }
            rows={2}
            className={fieldClass}
          />
        </label>
      </EditorSection>
    </div>
  );
}
