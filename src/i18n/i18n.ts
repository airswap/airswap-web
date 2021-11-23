import { initReactI18next } from "react-i18next";

import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import HttpBackend from "i18next-http-backend";

i18n
  // load translation using http -> see /public/locales
  .use(HttpBackend)
  // detect user language
  // learn more: https://github.com/i18next/i18next-browser-languageDetector
  .use(LanguageDetector)
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)

  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    fallbackLng: "en",
    load: "languageOnly",
    debug: process.env.NODE_ENV !== "production",
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    react: {
      useSuspense: true,
    },
    backend: {
      loadPath: process.env.PUBLIC_URL + "/locales/{{lng}}/translation.json",
    },
  });

export default i18n;
