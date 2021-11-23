// import the original type declarations
import "react-i18next";

// import all namespaces (for the default language, only)
import en from "../../public/locales/en/translation.json";

declare module "react-i18next" {
  // Extend with new types.
  // Only need english as it's the base language
  interface Resources {
    translation: typeof en;
  }
}
