import {
  CheckIcon,
  EnvelopeIcon,
  PencilSquareIcon,
  PlusIcon,
  TrashIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { useState, type FormEvent } from 'react';
import type { UserContactDto, UserContactPayload } from '@/features/contact/types/contact.types';

interface ContactEditorPanelProps {
  contact: UserContactDto | null;
  isLoading: boolean;
  error: string | null;
  currentUserId: number;
  onCreateContact: (payload: UserContactPayload) => Promise<UserContactDto>;
  onUpdateContact: (
    contactId: number,
    payload: UserContactPayload,
  ) => Promise<UserContactDto>;
  onDeleteContact: (contactId: number) => Promise<void>;
}

type ContactFieldKey = keyof UserContactPayload;
type ContactDraft = Record<ContactFieldKey, string>;

const fieldClass =
  'w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-950 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white';
const labelClass =
  'mb-1.5 block text-xs font-semibold text-zinc-600 dark:text-zinc-300';

const emptyContactDraft: ContactDraft = {
  publicEmail: '',
  altEmail: '',
  phone: '',
  altPhone: '',
  site: '',
  instagram: '',
  gitHub: '',
  facebook: '',
  linkedIn: '',
};

const contactFields: Array<{
  key: ContactFieldKey;
  label: string;
  type: string;
  maxLength: number;
  placeholder: string;
}> = [
  {
    key: 'publicEmail',
    label: 'PublicEmail',
    type: 'email',
    maxLength: 100,
    placeholder: 'portfolio@dixiecards.dev',
  },
  {
    key: 'altEmail',
    label: 'AltEmail',
    type: 'email',
    maxLength: 100,
    placeholder: 'contacto@dixiecards.dev',
  },
  {
    key: 'phone',
    label: 'Phone',
    type: 'tel',
    maxLength: 30,
    placeholder: '+54 9 11 5555-0101',
  },
  {
    key: 'altPhone',
    label: 'AltPhone',
    type: 'tel',
    maxLength: 30,
    placeholder: '+54 9 11 5555-0102',
  },
  {
    key: 'site',
    label: 'Site',
    type: 'url',
    maxLength: 200,
    placeholder: 'https://portfolio.dev',
  },
  {
    key: 'instagram',
    label: 'Instagram',
    type: 'text',
    maxLength: 100,
    placeholder: 'usuario o URL',
  },
  {
    key: 'gitHub',
    label: 'GitHub',
    type: 'text',
    maxLength: 100,
    placeholder: 'usuario o URL',
  },
  {
    key: 'facebook',
    label: 'Facebook',
    type: 'text',
    maxLength: 100,
    placeholder: 'usuario o URL',
  },
  {
    key: 'linkedIn',
    label: 'LinkedIn',
    type: 'text',
    maxLength: 100,
    placeholder: 'usuario o URL',
  },
];

function createContactDraft(contact: UserContactDto | null): ContactDraft {
  if (!contact) {
    return { ...emptyContactDraft };
  }

  return {
    publicEmail: contact.publicEmail ?? '',
    altEmail: contact.altEmail ?? '',
    phone: contact.phone ?? '',
    altPhone: contact.altPhone ?? '',
    site: contact.site ?? '',
    instagram: contact.instagram ?? '',
    gitHub: contact.gitHub ?? '',
    facebook: contact.facebook ?? '',
    linkedIn: contact.linkedIn ?? '',
  };
}

function getContactPayload(draft: ContactDraft): UserContactPayload {
  return {
    publicEmail: draft.publicEmail.trim() || null,
    altEmail: draft.altEmail.trim() || null,
    phone: draft.phone.trim() || null,
    altPhone: draft.altPhone.trim() || null,
    site: draft.site.trim() || null,
    instagram: draft.instagram.trim() || null,
    gitHub: draft.gitHub.trim() || null,
    facebook: draft.facebook.trim() || null,
    linkedIn: draft.linkedIn.trim() || null,
  };
}

function hasAnyContactValue(payload: UserContactPayload) {
  return Object.values(payload).some((value) => Boolean(value));
}

function ContactSummary({ contact }: { contact: UserContactDto }) {
  const summaryItems = contactFields
    .map((field) => ({
      ...field,
      value: contact[field.key],
    }))
    .filter((item) => item.value);

  return (
    <dl className="mt-5 grid gap-3 md:grid-cols-2">
      {summaryItems.map((item) => (
        <div
          key={item.key}
          className="rounded-lg border border-zinc-200 bg-white p-3 text-left dark:border-zinc-800 dark:bg-zinc-950"
        >
          <dt className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
            {item.label}
          </dt>
          <dd className="mt-1 break-words text-sm font-medium text-zinc-950 dark:text-white">
            {item.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

export default function ContactEditorPanel({
  contact,
  isLoading,
  error,
  currentUserId,
  onCreateContact,
  onUpdateContact,
  onDeleteContact,
}: ContactEditorPanelProps) {
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [draft, setDraft] = useState<ContactDraft>(() =>
    createContactDraft(contact),
  );
  const [statusMessage, setStatusMessage] = useState('');
  const [mutationError, setMutationError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const openEditor = () => {
    setDraft(createContactDraft(contact));
    setIsEditorOpen(true);
    setStatusMessage('');
    setMutationError('');
  };

  const closeEditor = () => {
    setIsEditorOpen(false);
    setDraft(createContactDraft(contact));
    setMutationError('');
  };

  const handleSaveContact = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const payload = getContactPayload(draft);

    if (!hasAnyContactValue(payload)) {
      setMutationError('Carga al menos un dato de contacto.');
      return;
    }

    setIsSaving(true);
    setMutationError('');

    try {
      await (contact
        ? onUpdateContact(contact.id, payload)
        : onCreateContact(payload));

      setStatusMessage('Contacto guardado.');
      setIsEditorOpen(false);
    } catch (unknownError) {
      setMutationError(
        unknownError instanceof Error
          ? unknownError.message
          : 'No se pudo guardar el contacto.',
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteContact = async () => {
    if (!contact || !window.confirm('Eliminar los datos de contacto?')) {
      return;
    }

    setIsSaving(true);
    setMutationError('');

    try {
      await onDeleteContact(contact.id);
      setStatusMessage('Contacto eliminado.');
      setIsEditorOpen(false);
      setDraft(createContactDraft(null));
    } catch (unknownError) {
      setMutationError(
        unknownError instanceof Error
          ? unknownError.message
          : 'No se pudo eliminar el contacto.',
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section className="w-full px-4 py-8">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col gap-3 text-left md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-medium text-cyan-700 dark:text-cyan-300">
              Contact manager
            </p>
            <h2 className="mt-2 text-3xl font-semibold text-zinc-950 dark:text-white">
              UserContact
            </h2>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
              User #{contact?.userId ?? currentUserId}
            </p>
          </div>
          <div className="flex flex-wrap gap-2 md:self-end">
            <button
              type="button"
              onClick={openEditor}
              className="inline-flex items-center gap-2 rounded-lg bg-zinc-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-cyan-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500 dark:bg-white dark:text-zinc-950 dark:hover:bg-cyan-100"
            >
              {contact ? (
                <PencilSquareIcon className="h-4 w-4" aria-hidden="true" />
              ) : (
                <PlusIcon className="h-4 w-4" aria-hidden="true" />
              )}
              {contact ? 'Editar contacto' : 'Crear contacto'}
            </button>
            {contact && (
              <button
                type="button"
                onClick={() => void handleDeleteContact()}
                disabled={isSaving}
                className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-700 transition hover:bg-red-50 disabled:cursor-wait dark:border-red-400/20 dark:text-red-200 dark:hover:bg-red-400/10"
              >
                <TrashIcon className="h-4 w-4" aria-hidden="true" />
                Eliminar
              </button>
            )}
          </div>
        </div>

        {isLoading && (
          <p className="mt-4 rounded-lg border border-zinc-200 bg-white px-4 py-3 text-left text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300">
            Cargando contacto...
          </p>
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

        {!isLoading && contact && <ContactSummary contact={contact} />}

        {!isLoading && !contact && !isEditorOpen && (
          <div className="mt-5 flex items-center gap-3 rounded-lg border border-dashed border-zinc-300 p-5 text-left text-sm text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
            <EnvelopeIcon
              className="h-5 w-5 shrink-0 text-cyan-600 dark:text-cyan-300"
              aria-hidden="true"
            />
            Todavia no hay datos de contacto cargados.
          </div>
        )}

        {isEditorOpen && (
          <form
            onSubmit={handleSaveContact}
            className="mt-6 rounded-lg border border-zinc-200 bg-zinc-50/80 p-4 text-left dark:border-zinc-800 dark:bg-zinc-900/40"
          >
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-zinc-950 dark:text-white">
                  {contact ? 'Editar UserContact' : 'Crear UserContact'}
                </p>
                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                  DTO CreateUserContactDto / UpdateUserContactDto
                </p>
              </div>
              <button
                type="button"
                onClick={closeEditor}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 text-zinc-600 transition hover:border-cyan-300 dark:border-zinc-800 dark:text-zinc-300"
                aria-label="Cerrar editor"
                title="Cerrar"
              >
                <XMarkIcon className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {contactFields.map((field) => (
                <label
                  key={field.key}
                  className={field.key === 'site' ? 'md:col-span-2' : ''}
                >
                  <span className={labelClass}>{field.label}</span>
                  <input
                    type={field.type}
                    value={draft[field.key]}
                    maxLength={field.maxLength}
                    placeholder={field.placeholder}
                    onChange={(event) =>
                      setDraft((currentDraft) => ({
                        ...currentDraft,
                        [field.key]: event.target.value,
                      }))
                    }
                    className={fieldClass}
                  />
                </label>
              ))}
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex items-center gap-2 rounded-lg bg-cyan-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-cyan-600 disabled:cursor-wait disabled:bg-zinc-600"
              >
                <CheckIcon className="h-4 w-4" aria-hidden="true" />
                {isSaving ? 'Guardando...' : 'Guardar'}
              </button>
              <button
                type="button"
                onClick={closeEditor}
                className="rounded-lg border border-zinc-200 px-4 py-2.5 text-sm font-semibold text-zinc-700 transition hover:border-cyan-300 dark:border-zinc-800 dark:text-zinc-200"
              >
                Cancelar
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
