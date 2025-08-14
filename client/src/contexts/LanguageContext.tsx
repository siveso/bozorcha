import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, TRANSLATIONS, getTranslations } from '@/../../shared/locales';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof TRANSLATIONS.uz) => string;
  translations: typeof TRANSLATIONS.uz;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('bozorcha_language') as Language;
      return stored && ['uz', 'ru'].includes(stored) ? stored : 'uz';
    }
    return 'uz';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('bozorcha_language', lang);
  };

  const t = (key: keyof typeof TRANSLATIONS.uz): string => {
    return TRANSLATIONS[language][key] || TRANSLATIONS.uz[key];
  };

  const translations = getTranslations(language);

  const value: LanguageContextType = {
    language,
    setLanguage,
    t,
    translations,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}