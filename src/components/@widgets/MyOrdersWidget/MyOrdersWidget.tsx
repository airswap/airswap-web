import React, { FC, useContext, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

import { FullOrderERC20 } from "@airswap/utils";
import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";

import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { InterfaceContext } from "../../../contexts/interface/Interface";
import { selectAllTokenInfo } from "../../../features/metadata/metadataSlice";
import {
  OrdersSortType,
  removeUserOrder,
  selectMyOrdersReducer,
  setActiveSortType,
} from "../../../features/myOrders/myOrdersSlice";
import { getNonceUsed } from "../../../features/orders/ordersHelpers";
import { cancelOrder } from "../../../features/takeOtc/takeOtcActions";
import { selectTakeOtcStatus } from "../../../features/takeOtc/takeOtcSlice";
import { selectPendingCancellations } from "../../../features/transactions/transactionsSlice";
import switchToDefaultChain from "../../../helpers/switchToDefaultChain";
import useCancellationPending from "../../../hooks/useCancellationPending";
import { AppRoutes } from "../../../routes";
import SubmittedCancellationScreen from "../../SubmittedCancellationScreen";
import TransactionOverlay from "../../TransactionOverlay/TransactionOverlay";
import WalletSignScreen from "../../WalletSignScreen/WalletSignScreen";
import { Container, InfoSectionContainer } from "./MyOrdersWidget.styles";
import { getSortedOrders } from "./helpers";
import ActionButtons, {
  ButtonActions,
} from "./subcomponents/ActionButtons/ActionButtons";
import InfoSection from "./subcomponents/InfoSection/InfoSection";
import MyOrdersList from "./subcomponents/MyOrdersList/MyOrdersList";
import MyOrdersWidgetHeader from "./subcomponents/MyOrdersWidgetHeader/MyOrdersWidgetHeader";

const MyOrdersWidget: FC = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const { provider: library } = useWeb3React<Web3Provider>();
  const { isActive, chainId } = useAppSelector((state) => state.web3);
  const history = useHistory();
  const allTokens = useAppSelector(selectAllTokenInfo);
  const { userOrders, sortTypeDirection, activeSortType } = useAppSelector(
    selectMyOrdersReducer
  );

  const status = useAppSelector(selectTakeOtcStatus);
  const [activeCancellationNonce, setActiveCancellationNonce] =
    useState<string>();
  const pendingCancelTranssaction = useCancellationPending(
    activeCancellationNonce || null,
    true
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

  const cancelOrderOnChain = async (order: FullOrderERC20) => {
    const expiry = parseInt(order.expiry) * 1000;
    const isExpired = new Date().getTime() > expiry;
    const nonceUsed = await getNonceUsed(order, library!);

    if (!isExpired && !nonceUsed) {
      setActiveCancellationNonce(order.nonce);
      await dispatch(
        cancelOrder({ order: order, chainId: chainId!, library: library! })
      );
    } else {
      dispatch(removeUserOrder(order));
    }
  };

  const handleActionButtonClick = (action: ButtonActions) => {
    if (action === ButtonActions.connectWallet) {
      setShowWalletList(true);
    }

    if (action === ButtonActions.switchNetwork) {
      switchToDefaultChain();
    }
    if (action === ButtonActions.newOrder) {
      history.push({ pathname: AppRoutes.make });
    }
  };

  const handleDeleteOrderButtonClick = async (order: FullOrderERC20) => {
    await cancelOrderOnChain(order);
  };

  const handleSortButtonClick = (type: OrdersSortType) => {
    dispatch(setActiveSortType(type));
  };

  return (
    <Container>
      <MyOrdersWidgetHeader title={t("common.myOrders")} />

      <TransactionOverlay isHidden={status !== "signing"}>
        <WalletSignScreen type="signature" />
      </TransactionOverlay>

      <TransactionOverlay
        isHidden={status === "signing" || !pendingCancelTranssaction}
      >
        {pendingCancelTranssaction && (
          <SubmittedCancellationScreen
            chainId={chainId}
            transaction={pendingCancelTranssaction}
          />
        )}
      </TransactionOverlay>

      {!!sortedUserOrders.length && (
        <>
          <MyOrdersList
            activeSortType={activeSortType}
            orders={sortedUserOrders}
            sortTypeDirection={sortTypeDirection}
            onDeleteOrderButtonClick={handleDeleteOrderButtonClick}
            onSortButtonClick={handleSortButtonClick}
          />
        </>
      )}

      {!sortedUserOrders.length && (
        <InfoSectionContainer>
          <InfoSection
            userHasNoOrders={!sortedUserOrders.length}
            walletIsNotConnected={!isActive}
          />
        </InfoSectionContainer>
      )}

      <ActionButtons
        walletIsNotConnected={!isActive}
        onActionButtonClick={handleActionButtonClick}
      />
    </Container>
  );
};

export default MyOrdersWidget;
