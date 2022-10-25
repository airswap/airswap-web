import { useState, useEffect, useRef, RefObject } from "react";
import { useTranslation } from "react-i18next";

import i18n from "i18next";
import { ThemeType } from "styled-components/macro";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { SUPPORTED_LOCALES, LOCALE_LABEL } from "../../constants/locales";
import {
  selectTheme,
  setTheme,
} from "../../features/userSettings/userSettingsSlice";
import useAppRouteParams from "../../hooks/useAppRouteParams";
import useWindowSize from "../../hooks/useWindowSize";
import {
  Container,
  ThemeContainer,
  ThemeButton,
  LocaleContainer,
  LocaleButton,
  BottomPopoverSection,
} from "./SettingsPopover.styles";
import GithubInfo from "./subcomponents/GithubInfo/GithubInfo";
import PopoverSection from "./subcomponents/PopoverSection/PopoverSection";

type SettingsPopoverPropsType = {
  open: boolean;
  popoverRef: RefObject<HTMLDivElement>;
};

const SettingsPopover = ({ open, popoverRef }: SettingsPopoverPropsType) => {
  const { width, height } = useWindowSize();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const selectedTheme = useAppSelector(selectTheme);
  const [overflow, setOverflow] = useState<boolean>(false);

  const appRouteParams = useAppRouteParams();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const handleThemeButtonClick = (newTheme: ThemeType | "system") => {
    dispatch(setTheme(newTheme));
  };

  useEffect(() => {
    if (popoverRef.current && scrollContainerRef.current) {
      const { offsetTop, scrollHeight } = scrollContainerRef.current;
      setOverflow(scrollHeight + offsetTop > popoverRef.current.offsetHeight);
    }
  }, [popoverRef, scrollContainerRef, width, height]);

  return (
    <Container ref={popoverRef} open={open}>
      <PopoverSection title={t("common.theme")}>
        <ThemeContainer>
          <ThemeButton
            $isActive={selectedTheme === "system"}
            onClick={() => handleThemeButtonClick("system")}
          >
            {t("common.system")}
          </ThemeButton>
          <ThemeButton
            $isActive={selectedTheme === "light"}
            onClick={() => handleThemeButtonClick("light")}
          >
            {t("common.light")}
          </ThemeButton>
          <ThemeButton
            $isActive={selectedTheme === "dark"}
            onClick={() => handleThemeButtonClick("dark")}
          >
            {t("common.dark")}
          </ThemeButton>
        </ThemeContainer>
      </PopoverSection>
      <PopoverSection title={t("common.language")}>
        <LocaleContainer ref={scrollContainerRef} $overflow={overflow}>
          {SUPPORTED_LOCALES.map((locale) => {
            return (
              <LocaleButton
                key={locale}
                $isActive={appRouteParams.lang === locale}
                onClick={() => i18n.changeLanguage(locale)}
              >
                {LOCALE_LABEL[locale]}
              </LocaleButton>
            );
          })}
        </LocaleContainer>
      </PopoverSection>
      <BottomPopoverSection>
        <GithubInfo />
      </BottomPopoverSection>
    </Container>
  );
};

export default SettingsPopover;
