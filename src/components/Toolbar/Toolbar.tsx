import React, { FC } from "react";
import { useTranslation } from "react-i18next";

import { InformationModalType } from "../InformationModals/InformationModals";
import {
  StyledAirswapButton,
  ToolbarButtonsContainer,
  ToolbarContainer,
} from "./Toolbar.styles";
import ToolbarButton from "./subcomponents/ToolbarButton/ToolbarButton";

export type ToolbarProps = {
  onLinkButtonClick?: (type: InformationModalType) => void;
  onAirswapButtonClick?: () => void;
};

const Toolbar: FC<ToolbarProps> = ({
  onLinkButtonClick,
  onAirswapButtonClick,
}) => {
  const { t } = useTranslation();

  const onToolbarButtonClick = (type: InformationModalType) => {
    if (onLinkButtonClick) {
      onLinkButtonClick(type);
    }
  };

  return (
    <ToolbarContainer>
      <StyledAirswapButton
        onClick={onAirswapButtonClick}
        ariaLabel={t("common.AirSwap")}
        icon="airswap"
        iconSize={2.5}
      />
      <ToolbarButtonsContainer>
        <ToolbarButton
          iconName="swap-horizontal"
          text={t("common.otc")}
          href="https://trader.airswap.io/"
        />
        <ToolbarButton
          iconName="bars"
          text={t("common.stats")}
          href="https://dune.xyz/agrimony/AirSwap-v2"
        />
        <ToolbarButton
          iconName="vote"
          text={t("common.vote")}
          href="https://activate.codefi.network/staking/airswap/governance"
        />
        <ToolbarButton
          iconName="code"
          text={t("common.build")}
          href="https://github.com/airswap"
        />
        <ToolbarButton
          iconName="learn"
          text={t("common.about")}
          href="https://about.airswap.io/"
        />
        <ToolbarButton
          iconName="contact-support"
          text={t("common.join")}
          onClick={() => onToolbarButtonClick("join")}
        />
      </ToolbarButtonsContainer>
    </ToolbarContainer>
  );
};

export default Toolbar;
