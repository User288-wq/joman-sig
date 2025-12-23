import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Import des traductions
import frTranslations from "./locales/fr.json";
import enTranslations from "./locales/en.json";

// Ressources de traduction
const resources = {
  fr: { translation: frTranslations },
  en: { translation: enTranslations }
};

// Configuration i18n
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "fr",
    lng: localStorage.getItem("joma-language") || "fr",
    
    interpolation: {
      escapeValue: false
    },
    
    detection: {
      order: ["localStorage", "navigator", "htmlTag"],
      caches: ["localStorage"]
    },
    
    react: {
      useSuspense: false
    }
  });

export default i18n;
