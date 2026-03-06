// i18n configuration using i18next and react-i18next.
// Only English is implemented now but the architecture supports
// adding new languages by adding a new locale file and import.

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import en from "./locales/en.json";

i18n
  .use(LanguageDetector)   // Detects language from browser settings
  .use(initReactI18next)   // Binds i18next to React
  .init({
    resources: {
      en: { translation: en },
    },
    fallbackLng: "en",
    defaultNS: "translation",
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },
  });

export default i18n;