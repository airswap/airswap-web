import React, { FC } from "react";
import { useTranslation } from "react-i18next";

import { useAppDispatch } from "../../app/hooks";
import { resetOrders } from "../../features/orders/ordersSlice";
import { InformationModalType } from "../InformationModals/InformationModals";
import {
  AirswapButton,
  ToolbarButtonsContainer,
  ToolbarContainer,
} from "./Toolbar.styles";
import ToolbarButton from "./subcomponents/ToolbarButton/ToolbarButton";

export type ToolbarProps = {
  onButtonClick?: (type: InformationModalType) => void;
};

const Toolbar: FC<ToolbarProps> = ({ onButtonClick }) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  // TODO: Add content for "about" in modals

  const onToolbarButtonClick = (type: InformationModalType) => {
    if (onButtonClick) {
      onButtonClick(type);
    }
  };

  const onAirswapButtonClick = () => {
    dispatch(resetOrders());
  };

  return (
    <ToolbarContainer>
      <AirswapButton
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
