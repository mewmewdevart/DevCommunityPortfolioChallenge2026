import React, { createContext, useContext, useCallback } from 'react';
import { useTranslation as useTranslationHook } from 'react-i18next';
import { type Language, type TranslationKeys } from '../utils/translationsKeys';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKeys, options?: any) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);
const STORAGE_KEY = 'APP_LANGUAGE';

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { t, i18n } = useTranslationHook();

  const setLanguage = useCallback((lang: Language) => {
    i18n.changeLanguage(lang);
    localStorage.setItem(STORAGE_KEY, lang);
    document.documentElement.lang = lang;
  }, [i18n]);

  React.useEffect(() => {
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  return (
    <LanguageContext.Provider value={{
      language: i18n.language as Language,
      setLanguage,
      t: t as any
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
};