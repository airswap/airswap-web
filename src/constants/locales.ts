export const SUPPORTED_LOCALES = [
  // order as they appear in the language dropdown
  "en",
  "fr",
  "nb",
  "zh-tr",
];

export type SupportedLocale = typeof SUPPORTED_LOCALES[number];

export const DEFAULT_LOCALE: SupportedLocale = "en";

export const LOCALE_LABEL: { [locale in SupportedLocale]: string } = {
  en: "English",
  nb: "Norsk Bokmål",
  fr: "Français",
  "zh-tr": "中文繁體",
};
