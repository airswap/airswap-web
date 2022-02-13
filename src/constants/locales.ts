export const SUPPORTED_LOCALES = [
  // order as they appear in the language dropdown
  "en",
  "fr",
  "nb",
  "nl",
  "pt",
  "ro",
  "zh-tr",
];

export type SupportedLocale = typeof SUPPORTED_LOCALES[number];

export const DEFAULT_LOCALE: SupportedLocale = "en";

export const LOCALE_LABEL: { [locale in SupportedLocale]: string } = {
  en: "English",
  nb: "Norsk Bokmål",
  nl: "Nederlands",
  pt: "Portugues",
  fr: "Français",
  ro: "Romanian",
  "zh-tr": "中文繁體",
};
