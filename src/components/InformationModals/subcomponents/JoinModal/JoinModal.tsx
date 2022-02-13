import React, { FC } from "react";
import { useTranslation } from "react-i18next";

import {
  ModalParagraph,
  ModalSubTitle,
  ScrollableModalContainer,
} from "../../../../styled-components/Modal/Modal";
import HelmetContainer from "../../../HelmetContainer/HelmetContainer";
import GuideButton, { GuideButtonProps } from "../GuideButton/GuideButton";
import { GuideButtons } from "./JoinModal.styles";

const guideButtons: GuideButtonProps[] = [
  {
    iconName: "vote",
    text: "information.join.voter",
    href: "https://about.airswap.io/guides/voters",
  },
  {
    iconName: "code",
    text: "information.join.developer",
    href: "https://github.com/airswap",
  },
  {
    iconName: "campaign",
    text: "information.join.ambassador",
    href: "https://about.airswap.io/guides/ambassadors",
  },
  {
    iconName: "edit",
    text: "information.join.author",
    href: "https://about.airswap.io/guides/authors",
  },
];

const JoinModal: FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <HelmetContainer
        title={`${t("common.AirSwap")} - ${t("information.join.title")}`}
        description={t("information.join.intro")}
      />

      <ScrollableModalContainer>
        <ModalParagraph>{t("information.join.intro")}</ModalParagraph>

        <ModalSubTitle type="h2">
          {t("information.join.getStarted")}
        </ModalSubTitle>

        <ModalParagraph>{t("information.join.paragraph2")}</ModalParagraph>

        <GuideButtons>
          {guideButtons.map((guideButton, index) => {
            return (
              <GuideButton
                key={`${guideButton.iconName}-${index}`}
                iconName={guideButton.iconName}
                text={guideButton.text}
                href={guideButton.href}
              />
            );
          })}
        </GuideButtons>
      </ScrollableModalContainer>
    </>
  );
};

export default JoinModal;
