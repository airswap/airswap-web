import React, { FC, useContext } from "react";
import { useTranslation } from "react-i18next";

import { Web3Provider } from "@ethersproject/providers";
import { UnsupportedChainIdError, useWeb3React } from "@web3-react/core";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { InterfaceContext } from "../../contexts/interface/Interface";
import {
  OrdersSortType,
  selectMyOrdersReducer,
  setActiveSortType,
} from "../../features/myOrders/myOrdersSlice";
import switchToEthereumChain from "../../helpers/switchToEthereumChain";
import { Container } from "./MyOrdersWidget.styles";
import ActionButtons, {
  ButtonActions,
} from "./subcomponents/ActionButtons/ActionButtons";
import MyOrdersList from "./subcomponents/MyOrdersList/MyOrdersList";
import MyOrdersWidgetHeader from "./subcomponents/MyOrdersWidgetHeader/MyOrdersWidgetHeader";

const MyOrdersWidget: FC = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const { active, error: web3Error } = useWeb3React<Web3Provider>();
  const { userOrders, sortTypeDirection, activeSortType } = useAppSelector(
    selectMyOrdersReducer
  );
  console.log(userOrders);

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

  const handleSortButtonClick = (type: OrdersSortType) => {
    dispatch(setActiveSortType(type));
  };

  return (
    <Container>
      <MyOrdersWidgetHeader title={t("common.myOrders")} />
      <MyOrdersList
        activeSortType={activeSortType}
        orders={userOrders}
        sortTypeDirection={sortTypeDirection}
        onSortButtonClick={handleSortButtonClick}
      />
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
