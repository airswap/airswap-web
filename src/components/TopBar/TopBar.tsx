import React, { FC, ReactElement } from "react";
import { useTranslation } from "react-i18next";

import {
  Container,
  StyledAirswapButton,
  StyledMenuButton,
  StyledWallet,
} from "./TopBar.styles";

type TopBarProps = {
  setShowWalletList: (x: boolean) => void;
  transactionsTabOpen: boolean;
  setTransactionsTabOpen: (x: boolean) => void;
  onAirswapButtonClick: () => void;
};

const TopBar: FC<TopBarProps> = ({
  setShowWalletList,
  transactionsTabOpen,
  setTransactionsTabOpen,
  onAirswapButtonClick,
}): ReactElement => {
  const { t } = useTranslation();

  return (
    <Container>
      <StyledAirswapButton
        onClick={onAirswapButtonClick}
        ariaLabel={t("common.AirSwap")}
        icon="airswap"
        iconSize={2}
      />
      <StyledWallet
        transactionsTabOpen={transactionsTabOpen}
        setTransactionsTabOpen={setTransactionsTabOpen}
        setShowWalletList={setShowWalletList}
      />
      <StyledMenuButton
        onClick={() => {}}
        ariaLabel={t("common.select")}
        icon="menu"
        iconSize={1.5625}
      />
    </Container>
  );
};

export default TopBar;
