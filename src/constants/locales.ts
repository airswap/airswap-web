export const SUPPORTED_LOCALES = [
  // order as they appear in the language dropdown
  "en",
  "fr",
  "nb",
  "nl",
  "pt",
  "tr",
  "zh-tr",
] as const;

export type SupportedLocale = typeof SUPPORTED_LOCALES[number];

export const DEFAULT_LOCALE: SupportedLocale = "en";

export const LOCALE_LABEL: { [locale in SupportedLocale]: string } = {
  en: "English",
  nb: "Norsk Bokmål",
  nl: "Nederlands",
  pt: "Portugues",
  fr: "Français",
  tr: "Türkçe",
  "zh-tr": "中文繁體",
};

export const getUserLanguage = (): SupportedLocale => {
  const localStorageLanguage = localStorage
    .getItem("i18nextLng")
    ?.substring(0, 2) as SupportedLocale;
  const deviceLanguage = window.navigator.language.substring(
    0,
    2
  ) as SupportedLocale;

  if (
    localStorageLanguage &&
    SUPPORTED_LOCALES.includes(localStorageLanguage)
  ) {
    return localStorageLanguage;
  }

  if (deviceLanguage && SUPPORTED_LOCALES.includes(deviceLanguage)) {
    return deviceLanguage;
  }

  return DEFAULT_LOCALE;
};
