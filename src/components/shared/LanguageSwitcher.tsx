import React from 'react';
import { useTranslation } from 'react-i18next';

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const current = i18n.resolvedLanguage || i18n.language;
    i18n.changeLanguage(current === 'pt-BR' ? 'en' : 'pt-BR');
  };

  const currentLang = i18n.resolvedLanguage || i18n.language;
  const displayText = currentLang === 'pt-BR' ? 'PT' : 'ENG';

  return (
    <div 
      className="flex items-center gap-1.5 cursor-pointer group" 
      onClick={toggleLanguage}
      title="Change language"
    >
      <span className="material-icons text-[18px] text-yt-text-secondary group-hover:text-yt-text-primary transition-colors">language</span>
      <span className="text-yt-text-secondary text-xs font-medium group-hover:text-yt-text-primary transition-colors">
        {displayText}
      </span>
    </div>
  );
}
