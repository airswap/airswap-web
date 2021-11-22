// import the original type declarations
import "react-i18next";

// import all namespaces (for the default language, only)
import en from "../../public/locales/en/translation.json";
import validatorErrors from "../../public/locales/en/validatorErrors.json";
import nb from "../../public/locales/nb/translation.json";

declare module "react-i18next" {
  // Extend with new types.
  interface Resources {
    translation: typeof en;
    validatorErrors: typeof validatorErrors;
  }
}
