import { createContext } from 'react';
import type { AppLanguage } from './i18n.types';
import type { TranslationKey } from './translations';

export type TranslationValues = Record<string, string | number>;

export interface LanguageContextValue {
  language: AppLanguage;
  setLanguage: (language: AppLanguage) => void;
  t: (key: TranslationKey, values?: TranslationValues) => string;
}

export const LanguageContext = createContext<LanguageContextValue | null>(null);

