import { getI18n } from "react-i18next";

// This helper is used for adjusting the styling for logographic languages.
// As far as I know the active logographic languages currently still in use are
// chinese, korean and japanese.

export default function isActiveLanguageLogographic(): boolean {
  switch (getI18n().language.substr(0, 2)) {
    case "zh":
    case "ko":
    case "ja":
      return true;
    default:
      return false;
  }
}
