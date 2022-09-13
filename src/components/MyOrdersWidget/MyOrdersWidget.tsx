import React, { FC, useContext, useMemo } from "react";
import { useTranslation } from "react-i18next";

import { FullOrder } from "@airswap/typescript";
import { Web3Provider } from "@ethersproject/providers";
import { UnsupportedChainIdError, useWeb3React } from "@web3-react/core";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { InterfaceContext } from "../../contexts/interface/Interface";
import { selectAllTokenInfo } from "../../features/metadata/metadataSlice";
import {
  OrdersSortType,
  removeUserOrder,
  selectMyOrdersReducer,
  setActiveSortType,
} from "../../features/myOrders/myOrdersSlice";
import switchToEthereumChain from "../../helpers/switchToEthereumChain";
import { Container } from "./MyOrdersWidget.styles";
import { getSortedOrders } from "./helpers";
import ActionButtons, {
  ButtonActions,
} from "./subcomponents/ActionButtons/ActionButtons";
import MyOrdersList from "./subcomponents/MyOrdersList/MyOrdersList";
import MyOrdersWidgetHeader from "./subcomponents/MyOrdersWidgetHeader/MyOrdersWidgetHeader";

const MyOrdersWidget: FC = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const { active, chainId, error: web3Error } = useWeb3React<Web3Provider>();
  const allTokens = useAppSelector(selectAllTokenInfo);
  const { userOrders, sortTypeDirection, activeSortType } = useAppSelector(
    selectMyOrdersReducer
  );

  // Modal states
  const { setShowWalletList } = useContext(InterfaceContext);

  const sortedUserOrders = useMemo(() => {
    return chainId
      ? getSortedOrders(
          userOrders,
          activeSortType,
          allTokens,
          chainId,
          !sortTypeDirection[activeSortType]
        )
      : userOrders;
  }, [userOrders, activeSortType, allTokens, chainId, sortTypeDirection]);

  const handleActionButtonClick = (action: ButtonActions) => {
    if (action === ButtonActions.connectWallet) {
      setShowWalletList(true);
    }

    if (action === ButtonActions.switchNetwork) {
      switchToEthereumChain();
    }
  };

  const handleDeleteOrderButtonClick = (order: FullOrder) => {
    dispatch(removeUserOrder(order));
  };

  const handleSortButtonClick = (type: OrdersSortType) => {
    dispatch(setActiveSortType(type));
  };

  return (
    <Container>
      <MyOrdersWidgetHeader title={t("common.myOrders")} />
      <MyOrdersList
        activeSortType={activeSortType}
        orders={sortedUserOrders}
        sortTypeDirection={sortTypeDirection}
        onDeleteOrderButtonClick={handleDeleteOrderButtonClick}
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
