import {
  AtSymbolIcon,
  EnvelopeIcon,
  GlobeAltIcon,
  LinkIcon,
  PaperAirplaneIcon,
  PhoneIcon,
} from '@heroicons/react/24/outline';
import { motion } from 'motion/react';
import {
  useMemo,
  useState,
  type ComponentType,
  type FormEvent,
  type SVGProps,
} from 'react';
import {
  defaultUserConfigPayload,
  type UserConfigPayload,
} from '@/features/user-config/types/userConfig.types';
import type { UserContactDto } from '@/features/contact/types/contact.types';

interface ContactSectionProps {
  contact: UserContactDto | null;
  isLoading?: boolean;
  error?: string | null;
  visibility?: ContactVisibilityConfig;
}

type ContactIcon = ComponentType<SVGProps<SVGSVGElement>>;
type ContactVisibilityConfig = Pick<
  UserConfigPayload,
  | 'showEmail'
  | 'showAltEmail'
  | 'showPhone'
  | 'showAltPhone'
  | 'showInstagram'
  | 'showGitHub'
  | 'showFacebook'
  | 'showLinkedIn'
  | 'showWebsite'
>;

interface ContactLink {
  id: string;
  label: string;
  value: string;
  href: string;
  icon: ContactIcon;
}

interface MailDraft {
  senderEmail: string;
  subject: string;
  message: string;
}

const fieldClass =
  'w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-950 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white';
const labelClass =
  'mb-1.5 block text-xs font-semibold text-zinc-600 dark:text-zinc-300';

function hasText(value?: string | null): value is string {
  return Boolean(value?.trim());
}

function normalizeExternalUrl(value: string) {
  const trimmedValue = value.trim();

  if (/^https?:\/\//i.test(trimmedValue)) {
    return trimmedValue;
  }

  return `https://${trimmedValue.replace(/^\/+/, '')}`;
}

function normalizeSocialHandle(value: string) {
  return value.trim().replace(/^@/, '').replace(/^\/+/, '');
}

function getSocialUrl(platform: 'instagram' | 'github' | 'facebook' | 'linkedin', value: string) {
  const trimmedValue = value.trim();

  if (/^https?:\/\//i.test(trimmedValue)) {
    return trimmedValue;
  }

  const handle = normalizeSocialHandle(trimmedValue);
  const socialBaseUrl = {
    instagram: 'https://www.instagram.com',
    github: 'https://github.com',
    facebook: 'https://www.facebook.com',
    linkedin: 'https://www.linkedin.com/in',
  }[platform];

  return `${socialBaseUrl}/${handle}`;
}

function getPhoneHref(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, '')}`;
}

function getPrimaryEmail(
  contact: UserContactDto | null,
  visibility: ContactVisibilityConfig,
) {
  if (!contact) {
    return null;
  }

  if (visibility.showEmail && contact.publicEmail?.trim()) {
    return contact.publicEmail.trim();
  }

  if (visibility.showAltEmail && contact.altEmail?.trim()) {
    return contact.altEmail.trim();
  }

  return null;
}

function createMailtoHref(targetEmail: string, draft: MailDraft) {
  const subject = draft.subject.trim() || 'Contacto desde portfolio';
  const bodyParts = [draft.message.trim()];
  const senderEmail = draft.senderEmail.trim();

  if (senderEmail) {
    bodyParts.push(`\n\nDe: ${senderEmail}`);
  }

  const params = new URLSearchParams({
    subject,
    body: bodyParts.filter(Boolean).join(''),
  });

  return `mailto:${targetEmail}?${params.toString()}`;
}

function createContactLinks(
  contact: UserContactDto | null,
  visibility: ContactVisibilityConfig,
): ContactLink[] {
  if (!contact) {
    return [];
  }

  const links: ContactLink[] = [];

  if (visibility.showEmail && hasText(contact.publicEmail)) {
    links.push({
      id: 'publicEmail',
      label: 'Email publico',
      value: contact.publicEmail,
      href: `mailto:${contact.publicEmail}`,
      icon: EnvelopeIcon,
    });
  }

  if (visibility.showAltEmail && hasText(contact.altEmail)) {
    links.push({
      id: 'altEmail',
      label: 'Email alternativo',
      value: contact.altEmail,
      href: `mailto:${contact.altEmail}`,
      icon: EnvelopeIcon,
    });
  }

  if (visibility.showPhone && hasText(contact.phone)) {
    links.push({
      id: 'phone',
      label: 'Telefono',
      value: contact.phone,
      href: getPhoneHref(contact.phone),
      icon: PhoneIcon,
    });
  }

  if (visibility.showAltPhone && hasText(contact.altPhone)) {
    links.push({
      id: 'altPhone',
      label: 'Telefono alternativo',
      value: contact.altPhone,
      href: getPhoneHref(contact.altPhone),
      icon: PhoneIcon,
    });
  }

  if (visibility.showWebsite && hasText(contact.site)) {
    links.push({
      id: 'site',
      label: 'Sitio',
      value: contact.site,
      href: normalizeExternalUrl(contact.site),
      icon: GlobeAltIcon,
    });
  }

  if (visibility.showInstagram && hasText(contact.instagram)) {
    links.push({
      id: 'instagram',
      label: 'Instagram',
      value: contact.instagram,
      href: getSocialUrl('instagram', contact.instagram),
      icon: AtSymbolIcon,
    });
  }

  if (visibility.showGitHub && hasText(contact.gitHub)) {
    links.push({
      id: 'gitHub',
      label: 'GitHub',
      value: contact.gitHub,
      href: getSocialUrl('github', contact.gitHub),
      icon: LinkIcon,
    });
  }

  if (visibility.showFacebook && hasText(contact.facebook)) {
    links.push({
      id: 'facebook',
      label: 'Facebook',
      value: contact.facebook,
      href: getSocialUrl('facebook', contact.facebook),
      icon: AtSymbolIcon,
    });
  }

  if (visibility.showLinkedIn && hasText(contact.linkedIn)) {
    links.push({
      id: 'linkedIn',
      label: 'LinkedIn',
      value: contact.linkedIn,
      href: getSocialUrl('linkedin', contact.linkedIn),
      icon: LinkIcon,
    });
  }

  return links;
}

function ContactMethod({ link }: { link: ContactLink }) {
  const Icon = link.icon;
  const isExternalLink = /^https?:\/\//i.test(link.href);

  return (
    <a
      href={link.href}
      target={isExternalLink ? '_blank' : undefined}
      rel={isExternalLink ? 'noreferrer' : undefined}
      className="group flex min-h-20 items-center gap-3 rounded-lg border border-zinc-200 bg-white p-4 text-left shadow-sm shadow-zinc-950/5 transition hover:-translate-y-0.5 hover:border-cyan-300 hover:shadow-cyan-950/10 dark:border-zinc-800 dark:bg-zinc-950/80 dark:shadow-black/20 dark:hover:border-cyan-400/40"
    >
      <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-cyan-100 bg-cyan-50 text-cyan-700 transition group-hover:bg-cyan-100 dark:border-cyan-400/20 dark:bg-cyan-400/10 dark:text-cyan-200">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <span className="min-w-0">
        <span className="block text-xs font-semibold uppercase tracking-normal text-zinc-500 dark:text-zinc-400">
          {link.label}
        </span>
        <span className="mt-1 block break-words text-sm font-semibold text-zinc-950 dark:text-white">
          {link.value}
        </span>
      </span>
    </a>
  );
}

export default function ContactSection({
  contact,
  isLoading = false,
  error = null,
  visibility = defaultUserConfigPayload,
}: ContactSectionProps) {
  const contactLinks = useMemo(
    () => createContactLinks(contact, visibility),
    [contact, visibility],
  );
  const targetEmail = getPrimaryEmail(contact, visibility);
  const [mailDraft, setMailDraft] = useState<MailDraft>({
    senderEmail: '',
    subject: '',
    message: '',
  });
  const [mailStatus, setMailStatus] = useState('');

  const handleMailSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!targetEmail) {
      setMailStatus('Este portfolio no tiene un email publico disponible.');
      return;
    }

    window.location.href = createMailtoHref(targetEmail, mailDraft);
    setMailStatus('Abriendo tu cliente de correo...');
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className="w-full px-4 pb-20 pt-12"
    >
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 text-left">
          <p className="text-sm font-medium text-cyan-700 dark:text-cyan-300">
            Contacto
          </p>
          <h2 className="mt-2 text-3xl font-semibold text-zinc-950 dark:text-white">
            Hablemos
          </h2>
        </div>

        {isLoading && (
          <p className="rounded-lg border border-zinc-200 bg-white px-4 py-3 text-left text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300">
            Cargando datos de contacto...
          </p>
        )}

        {!isLoading && error && (
          <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-left text-sm text-red-700 dark:border-red-400/20 dark:bg-red-400/10 dark:text-red-200">
            {error}
          </p>
        )}

        {!isLoading && !error && contactLinks.length === 0 && (
          <div className="rounded-lg border border-dashed border-zinc-300 p-6 text-left text-sm text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
            Este portfolio todavia no tiene datos de contacto publicados.
          </div>
        )}

        {!isLoading && !error && contactLinks.length > 0 && (
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(22rem,0.85fr)]">
            <div className="grid content-start gap-3 md:grid-cols-2">
              {contactLinks.map((link) => (
                <ContactMethod key={link.id} link={link} />
              ))}
            </div>

            <form
              onSubmit={handleMailSubmit}
              className="rounded-lg border border-zinc-200 bg-zinc-50/80 p-5 text-left shadow-sm shadow-zinc-950/5 dark:border-zinc-800 dark:bg-zinc-900/50 dark:shadow-black/20"
            >
              <div className="mb-4 flex items-start gap-3">
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-cyan-100 bg-cyan-50 text-cyan-700 dark:border-cyan-400/20 dark:bg-cyan-400/10 dark:text-cyan-200">
                  <PaperAirplaneIcon className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="text-lg font-semibold text-zinc-950 dark:text-white">
                    Enviar mail
                  </h3>
                  <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                    Para: {targetEmail ?? 'sin email publico'}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <label className="block">
                  <span className={labelClass}>Tu email</span>
                  <input
                    type="email"
                    value={mailDraft.senderEmail}
                    onChange={(event) =>
                      setMailDraft((currentDraft) => ({
                        ...currentDraft,
                        senderEmail: event.target.value,
                      }))
                    }
                    className={fieldClass}
                    placeholder="tu@email.com"
                  />
                </label>

                <label className="block">
                  <span className={labelClass}>Asunto</span>
                  <input
                    value={mailDraft.subject}
                    onChange={(event) =>
                      setMailDraft((currentDraft) => ({
                        ...currentDraft,
                        subject: event.target.value,
                      }))
                    }
                    className={fieldClass}
                    placeholder="Consulta desde tu portfolio"
                  />
                </label>

                <label className="block">
                  <span className={labelClass}>Mensaje</span>
                  <textarea
                    value={mailDraft.message}
                    onChange={(event) =>
                      setMailDraft((currentDraft) => ({
                        ...currentDraft,
                        message: event.target.value,
                      }))
                    }
                    rows={5}
                    className={fieldClass}
                    placeholder="Escribi tu mensaje..."
                    required
                  />
                </label>
              </div>

              {mailStatus && (
                <p className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-200">
                  {mailStatus}
                </p>
              )}

              <button
                type="submit"
                disabled={!targetEmail}
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-cyan-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-cyan-600 disabled:cursor-not-allowed disabled:bg-zinc-500"
              >
                <PaperAirplaneIcon className="h-4 w-4" aria-hidden="true" />
                Enviar mail
              </button>
            </form>
          </div>
        )}
      </div>
    </motion.section>
  );
}
