import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import Backend from "i18next-chained-backend";
import LocalStorageBackend from "i18next-localstorage-backend"; // primary use cache
import HttpApi from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";

i18n
  // load translation using http -> see /public/locales
  .use(Backend)
  // detect user language
  // learn more: https://github.com/i18next/i18next-browser-languageDetector
  .use(LanguageDetector)
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    fallbackLng: "en",
    ns: "common",
    load: "languageOnly",
    debug: process.env.NODE_ENV !== "production",
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    react: {
      useSuspense: true,
    },
    backend: {
      backends: [
        LocalStorageBackend, // primary
        HttpApi, // secondary
      ],
      backendOptions: [
        // Local storage options
        {
          prefix: "airswap/i18n/",
          // 4 weeks expiry
          expirationTime: 4 * 7 * 24 * 60 * 60 * 1000,
          // Version applied to all languages, can be overriden using versions
          defaultVersion: "",
          // lang specific versions
          versions: {},
          store: window.localStorage,
        },
        // HTTP options
        {
          loadPath: "/locales/{{lng}}/{{ns}}.json",
        },
      ],
    },
  });

export default i18n;
