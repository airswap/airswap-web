import React, { FC, useContext, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

import { FullOrder, FullOrderERC20 } from "@airswap/utils";
import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";

import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { InterfaceContext } from "../../../contexts/interface/Interface";
import { selectAllTokenInfo } from "../../../features/metadata/metadataSlice";
import {
  removeOtcUserOrder,
  selectMyOtcOrdersReducer,
  setActiveSortType,
} from "../../../features/myOtcOrders/myOtcOrdersSlice";
import { getNonceUsed } from "../../../features/orders/ordersHelpers";
import { cancelOrder } from "../../../features/takeOtc/takeOtcActions";
import { selectTakeOtcStatus } from "../../../features/takeOtc/takeOtcSlice";
import switchToDefaultChain from "../../../helpers/switchToDefaultChain";
import { useAllowancesLoading } from "../../../hooks/useAllowancesLoading";
import useCancellationPending from "../../../hooks/useCancellationPending";
import { AppRoutes } from "../../../routes";
import { OrdersSortType } from "../../../types/ordersSortType";
import SubmittedCancellationScreen from "../../SubmittedCancellationScreen/SubmittedCancellationScreen";
import TransactionOverlay from "../../TransactionOverlay/TransactionOverlay";
import WalletSignScreen from "../../WalletSignScreen/WalletSignScreen";
import {
  Container,
  InfoSectionContainer,
  StyledActionButtons,
} from "../MyOrdersWidget/MyOrdersWidget.styles";
import { ButtonActions } from "../MyOrdersWidget/subcomponents/ActionButtons/ActionButtons";
import InfoSection from "../MyOrdersWidget/subcomponents/InfoSection/InfoSection";
import MyOtcOrdersList from "./subcomponents/MyOtcOrdersList/MyOtcOrdersList";

const MyOtcOrdersWidget: FC = () => {
  const dispatch = useAppDispatch();

  const { provider: library } = useWeb3React<Web3Provider>();
  const { isActive, isInitialized, chainId } = useAppSelector(
    (state) => state.web3
  );
  const history = useHistory();
  const allTokens = useAppSelector(selectAllTokenInfo);
  const allowances = useAppSelector((state) => state.allowances);
  const { userOrders, sortTypeDirection, activeSortType } = useAppSelector(
    selectMyOtcOrdersReducer
  );

  const status = useAppSelector(selectTakeOtcStatus);
  const [activeCancellationNonce, setActiveCancellationNonce] =
    useState<string>();
  const pendingCancelTranssaction = useCancellationPending(
    activeCancellationNonce || null,
    true
  );
  const isAllowancesLoading = useAllowancesLoading();

  // Modal states
  const { setShowWalletList } = useContext(InterfaceContext);

  const cancelOrderOnChain = async (order: FullOrder | FullOrderERC20) => {
    const expiry = parseInt(order.expiry) * 1000;
    const isExpired = new Date().getTime() > expiry;
    const nonceUsed = await getNonceUsed(order, library!);

    if (!isExpired && !nonceUsed) {
      setActiveCancellationNonce(order.nonce);
      await dispatch(
        cancelOrder({ order: order, chainId: chainId!, library: library! })
      );
    } else {
      dispatch(removeOtcUserOrder(order));
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
      history.push({ pathname: AppRoutes.makeOtcOrder });
    }
  };

  const handleDeleteOrderButtonClick = async (
    order: FullOrder | FullOrderERC20
  ) => {
    await cancelOrderOnChain(order);
  };

  const handleSortButtonClick = (type: OrdersSortType) => {
    dispatch(setActiveSortType(type));
  };

  useEffect(() => {
    if (!pendingCancelTranssaction) {
      setActiveCancellationNonce(undefined);
    }
  }, [pendingCancelTranssaction]);

  if (!isInitialized) {
    return <Container />;
  }

  return (
    <Container>
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

      {!!userOrders.length && (
        <MyOtcOrdersList
          isAllowancesLoading={isAllowancesLoading}
          activeCancellationId={activeCancellationNonce}
          activeSortType={activeSortType}
          activeTokens={allTokens}
          allowances={allowances}
          fullOrders={userOrders}
          sortTypeDirection={sortTypeDirection}
          library={library!}
          onDeleteOrderButtonClick={handleDeleteOrderButtonClick}
          onSortButtonClick={handleSortButtonClick}
        />
      )}

      {!userOrders.length && (
        <InfoSectionContainer>
          <InfoSection
            userHasNoOrders={!userOrders.length}
            walletIsNotConnected={!isActive}
          />
        </InfoSectionContainer>
      )}

      <StyledActionButtons
        walletIsNotConnected={!isActive}
        onActionButtonClick={handleActionButtonClick}
      />
    </Container>
  );
};

export default MyOtcOrdersWidget;
