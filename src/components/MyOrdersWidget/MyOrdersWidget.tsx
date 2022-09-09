import React, { FC, useContext } from "react";
import { useTranslation } from "react-i18next";

import { Web3Provider } from "@ethersproject/providers";
import { UnsupportedChainIdError, useWeb3React } from "@web3-react/core";

import { InterfaceContext } from "../../contexts/interface/Interface";
import switchToEthereumChain from "../../helpers/switchToEthereumChain";
import { Container } from "./MyOrdersWidget.styles";
import ActionButtons, {
  ButtonActions,
} from "./subcomponents/ActionButtons/ActionButtons";
import MyOrdersWidgetHeader from "./subcomponents/MyOrdersWidgetHeader/MyOrdersWidgetHeader";

const MyOrdersWidget: FC = () => {
  const { t } = useTranslation();

  const { active, error: web3Error } = useWeb3React<Web3Provider>();

  // Modal states
  const { setShowWalletList } = useContext(InterfaceContext);

  const handleActionButtonClick = (action: ButtonActions) => {
    if (action === ButtonActions.connectWallet) {
      setShowWalletList(true);
    }

    if (action === ButtonActions.switchNetwork) {
      switchToEthereumChain();
    }
  };

  return (
    <Container>
      <MyOrdersWidgetHeader title={t("common.myOrders")} />
      <ActionButtons
        networkIsUnsupported={
          !!web3Error && web3Error instanceof UnsupportedChainIdError
        }
        walletIsNotConnected={!active}
        onActionButtonClick={handleActionButtonClick}
      />
    </Container>
  );
};

export default MyOrdersWidget;
