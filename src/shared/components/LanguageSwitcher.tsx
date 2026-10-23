import { useLanguage } from '@/shared/i18n/useLanguage';

interface LanguageSwitcherProps {
  className?: string;
}

export default function LanguageSwitcher({ className = '' }: LanguageSwitcherProps) {
  const { language, setLanguage, t } = useLanguage();

  return (
    <div
      className={`app-language-switcher ${className}`.trim()}
      aria-label={t('languageSelector')}
    >
      {(['en', 'es'] as const).map((option) => (
        <button
          key={option}
          type="button"
          className={language === option ? 'is-active' : ''}
          onClick={() => setLanguage(option)}
          aria-pressed={language === option}
        >
          {option.toUpperCase()}
        </button>
      ))}
    </div>
  );
}

