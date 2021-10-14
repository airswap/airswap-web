import { useState } from "react";
import { useTranslation } from "react-i18next";

import { ThemeType } from "styled-components";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  SUPPORTED_LOCALES,
  LOCALE_LABEL,
  DEFAULT_LOCALE,
} from "../../constants/locales";
import {
  selectUserSettings,
  toggleTheme,
} from "../../features/userSettings/userSettingsSlice";
import {
  Container,
  ThemeContainer,
  ThemeButton,
  LocaleContainer,
  LocaleButton,
} from "./SettingsPopover.styles";
import PopoverSection from "./subcomponents/PopoverSection/PopoverSection";

const SettingsPopover = () => {
  const [selectedButton, setSelectedButton] = useState<
    ThemeType | "system"
    //@ts-ignore
  >(localStorage.getItem("airswap/theme") || "system");

  // selects i18nextLang first, window language, falls back to default locale (en)
  // TODO: keep track of different langauage locale (e.g. en-US, en-AU)?
  const [selectedLocale, setSelectedLocale] = useState<string>(
    localStorage.getItem("i18nextLng") ||
      window.navigator.language.substring(0, 2) ||
      DEFAULT_LOCALE
  );
  const dispatch = useAppDispatch();
  const { theme } = useAppSelector(selectUserSettings);
  const { t, i18n } = useTranslation(["common"]);

  const handleThemeButtonClick = (newTheme: ThemeType | "system") => {
    setSelectedButton(newTheme);
    // if the user perfers dark color scheme and they are currently on light mode -> switch to dark
    if (newTheme === "system") {
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        if (theme === "light") dispatch(toggleTheme());
      } else {
        if (theme === "dark") dispatch(toggleTheme());
      }
    } else if (newTheme !== theme) {
      dispatch(toggleTheme());
    }
  };

  return (
    <Container>
      <PopoverSection title="THEME">
        <ThemeContainer>
          <ThemeButton
            active={selectedButton === "system"}
            onClick={() => handleThemeButtonClick("system")}
          >
            {t("common:system")}
          </ThemeButton>
          <ThemeButton
            active={selectedButton === "light"}
            onClick={() => handleThemeButtonClick("light")}
          >
            {t("common:light")}
          </ThemeButton>
          <ThemeButton
            active={selectedButton === "dark"}
            onClick={() => handleThemeButtonClick("dark")}
          >
            {t("common:dark")}
          </ThemeButton>
        </ThemeContainer>
      </PopoverSection>
      <PopoverSection title="LANGUAGE">
        <LocaleContainer>
          {SUPPORTED_LOCALES.map((locale) => {
            return (
              <LocaleButton
                active={selectedLocale === locale}
                onClick={() => {
                  setSelectedLocale(locale);
                  i18n.changeLanguage(locale);
                }}
              >
                {LOCALE_LABEL[locale]}
              </LocaleButton>
            );
          })}
        </LocaleContainer>
      </PopoverSection>
    </Container>
  );
};

export default SettingsPopover;
