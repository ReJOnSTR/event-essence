import { createContext, useContext, useEffect, useState } from "react";
import { tr } from "../utils/i18n/translations/tr";
import { en } from "../utils/i18n/translations/en";
import { getDefaultLanguage, type LanguageCode } from "../utils/i18n/languages";

type Translations = typeof tr;

const translations: Record<LanguageCode, Translations> = {
  tr,
  en,
  de: en, // Fallback to English for now
  fr: en,
  es: en,
  it: en,
  ru: en,
  ar: en,
  zh: en,
  ja: en,
  ko: en,
};

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<LanguageCode>(() => {
    const stored = localStorage.getItem("app-language");
    return (stored as LanguageCode) || getDefaultLanguage();
  });

  useEffect(() => {
    localStorage.setItem("app-language", language);
  }, [language]);

  const value = {
    language,
    setLanguage,
    t: translations[language],
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
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}