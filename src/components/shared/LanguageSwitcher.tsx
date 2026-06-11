import React from 'react';
import { useTranslation } from 'react-i18next';

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    i18n.changeLanguage(e.target.value);
  };

  return (
    <div className="flex items-center gap-2">
      <span className="material-icons text-[18px] text-yt-text-secondary">language</span>
      <select
        value={i18n.resolvedLanguage || i18n.language}
        onChange={handleLanguageChange}
        className="bg-yt-bg-elevated border border-yt-bg-overlay text-yt-text-primary text-xs rounded-sm py-1 px-2 focus:outline-none focus:border-yt-red cursor-pointer"
      >
        <option value="pt-BR">Português</option>
        <option value="en">English</option>
      </select>
    </div>
  );
}
