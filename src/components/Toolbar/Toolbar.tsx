import React, { FC } from "react";
import { useTranslation } from "react-i18next";

import { InformationModalType } from "../InformationModals/InformationModals";
import {
  IconAirswap,
  ToolbarButtonsContainer,
  ToolbarContainer,
} from "./Toolbar.styles";
import ToolbarButton from "./subcomponents/ToolbarButton/ToolbarButton";

export type ToolbarProps = {
  onButtonClick?: (type: InformationModalType) => void;
};

const Toolbar: FC<ToolbarProps> = ({ onButtonClick }) => {
  const { t } = useTranslation(["common"]);

  // TODO: Add content for "about" in modals

  const onToolbarButtonClick = (type: InformationModalType) => {
    if (onButtonClick) {
      onButtonClick(type);
    }
  };

  return (
    <ToolbarContainer>
      <IconAirswap iconSize={2.5} name="airswap" />
      <ToolbarButtonsContainer>
        {/*<ToolbarButton iconName="bars" text={t("common:stats")} />*/}
        <ToolbarButton
          iconName="learn"
          text={t("common:learn")}
          href="https://about.airswap.io/"
        />
        <ToolbarButton
          iconName="vote"
          text={t("common:vote")}
          href="https://activate.codefi.network/staking/airswap/governance"
        />
        <ToolbarButton
          iconName="code"
          text={t("common:build")}
          href="https://github.com/airswap"
        />
        <ToolbarButton
          iconName="contact-support"
          text={t("common:join")}
          onClick={() => onToolbarButtonClick("join")}
        />
      </ToolbarButtonsContainer>
    </ToolbarContainer>
  );
};

export default Toolbar;
