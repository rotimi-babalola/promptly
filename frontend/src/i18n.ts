import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import eng from './locales/en/translation.json';
import de from './locales/de/translation.json';

const resources = {
  en: { translation: eng },
  de: { translation: de },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    resources,
    interpolation: {
      escapeValue: false, // React already escapes
    },
    detection: {},
  });

export default i18n;
