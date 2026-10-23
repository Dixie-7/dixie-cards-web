import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { LanguageContext, type TranslationValues } from './LanguageContext';
import type { AppLanguage } from './i18n.types';
import { translations, type TranslationKey } from './translations';

const languageStorageKey = 'dixie-cards-language';

function isSupportedLanguage(value: string | null): value is AppLanguage {
  return value === 'en' || value === 'es';
}

function getInitialLanguage(): AppLanguage {
  if (typeof window === 'undefined') {
    return 'en';
  }

  let storedLanguage: string | null = null;

  try {
    storedLanguage = window.localStorage.getItem(languageStorageKey);
  } catch {
    // Some privacy modes disable storage; browser language remains available.
  }

  if (isSupportedLanguage(storedLanguage)) {
    return storedLanguage;
  }

  const browserLanguages = navigator.languages?.length
    ? navigator.languages
    : [navigator.language];
  const browserLanguage = browserLanguages.find((value) =>
    /^(en|es)(-|$)/i.test(value),
  );

  return browserLanguage?.toLowerCase().startsWith('es') ? 'es' : 'en';
}

function interpolate(message: string, values?: TranslationValues) {
  if (!values) {
    return message;
  }

  return message.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match,
  );
}

export default function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<AppLanguage>(getInitialLanguage);

  useEffect(() => {
    document.documentElement.lang = language;

    try {
      window.localStorage.setItem(languageStorageKey, language);
    } catch {
      // The in-memory preference still works when storage is unavailable.
    }
  }, [language]);

  const t = useCallback(
    (key: TranslationKey, values?: TranslationValues) =>
      interpolate(translations[language][key], values),
    [language],
  );

  const value = useMemo(
    () => ({ language, setLanguage, t }),
    [language, t],
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

