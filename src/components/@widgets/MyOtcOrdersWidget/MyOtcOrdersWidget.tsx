import React, { FC, useContext, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

import { FullOrder, FullOrderERC20, TokenInfo } from "@airswap/utils";
import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";

import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { InterfaceContext } from "../../../contexts/interface/Interface";
import { DelegateRule } from "../../../entities/DelegateRule/DelegateRule";
import { cancelLimitOrder } from "../../../features/cancelLimit/cancelLimitActions";
import { selectCancelLimitStatus } from "../../../features/cancelLimit/cancelLimitSlice";
import { dismissDelegateRule } from "../../../features/delegateRules/delegateRulesActions";
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
import { OrderStatus } from "../../../types/orderStatus";
import { OrdersSortType } from "../../../types/ordersSortType";
import SubmittedCancellationScreen from "../../SubmittedCancellationScreen/SubmittedCancellationScreen";
import TransactionOverlay from "../../TransactionOverlay/TransactionOverlay";
import WalletSignScreen from "../../WalletSignScreen/WalletSignScreen";
import useRuleUnsetPending from "../MyLimitOrdersWidget/hooks/useRuleUnsetPending";
import {
  Container,
  InfoSectionContainer,
  StyledActionButtons,
} from "../MyOrdersWidget/MyOrdersWidget.styles";
import { MyOrder } from "../MyOrdersWidget/entities/MyOrder";
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
  const {
    delegateRules,
    isInitialized: isDelegateRulesInitialized,
    dismissedDelegateRuleIds,
  } = useAppSelector((state) => state.delegateRules);
  const filteredDelegateRules = delegateRules.filter(
    (rule) => !dismissedDelegateRuleIds.includes(rule.id)
  );

  const status = useAppSelector(selectTakeOtcStatus);
  const cancelLimitStatus = useAppSelector(selectCancelLimitStatus);
  const isSigning = status === "signing" || cancelLimitStatus === "signing";
  const [activeCancellationNonce, setActiveCancellationNonce] =
    useState<string>();
  const pendingCancelTranssaction = useCancellationPending(
    activeCancellationNonce || null,
    true
  );
  const [activeUnsetDelegateRule, setActiveUnsetDelegateRule] =
    useState<DelegateRule>();
  const pendingUnsetRuleTransaction = useRuleUnsetPending(
    activeUnsetDelegateRule,
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

  const handleDeleteDelegateRuleOrderButtonClick = async (
    delegateRule: DelegateRule,
    order: MyOrder
  ) => {
    if (
      order.status === OrderStatus.filled ||
      order.status === OrderStatus.expired
    ) {
      dispatch(dismissDelegateRule(delegateRule));

      return;
    }

    if (!order.senderToken || !order.signerToken) {
      console.error(
        "[handleDeleteOrderButtonClick]: Sender token or signer token is missing."
      );

      return;
    }

    dispatch(
      // TODO: fix action for AppTokenInfo
      cancelLimitOrder({
        chainId: delegateRule.chainId,
        senderWallet: delegateRule.senderWallet,
        senderTokenInfo: order.senderToken as TokenInfo,
        signerTokenInfo: order.signerToken as TokenInfo,
        library: library!,
      })
    );

    setActiveUnsetDelegateRule(delegateRule);
  };

  const handleSortButtonClick = (type: OrdersSortType) => {
    dispatch(setActiveSortType(type));
  };

  useEffect(() => {
    if (!pendingCancelTranssaction) {
      setActiveCancellationNonce(undefined);
    }
  }, [pendingCancelTranssaction]);

  useEffect(() => {
    if (!pendingUnsetRuleTransaction) {
      setActiveUnsetDelegateRule(undefined);
    }
  }, [pendingUnsetRuleTransaction]);

  if (!isInitialized || (isActive && !isDelegateRulesInitialized)) {
    return <Container />;
  }

  return (
    <Container>
      <TransactionOverlay isHidden={!isSigning}>
        <WalletSignScreen type="signature" />
      </TransactionOverlay>

      <TransactionOverlay isHidden={isSigning || !pendingCancelTranssaction}>
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
          delegateRules={filteredDelegateRules}
          fullOrders={userOrders}
          sortTypeDirection={sortTypeDirection}
          library={library!}
          onDeleteOrderButtonClick={handleDeleteOrderButtonClick}
          onDeleteDelegateRuleOrderButtonClick={
            handleDeleteDelegateRuleOrderButtonClick
          }
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
    </Container>
  );
};

export default MyOtcOrdersWidget;
