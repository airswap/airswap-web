import React, { FC, useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

import { TokenInfo } from "@airswap/utils";
import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";

import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { InterfaceContext } from "../../../contexts/interface/Interface";
import { DelegateRule } from "../../../entities/DelegateRule/DelegateRule";
import { cancelLimitOrder } from "../../../features/cancelLimit/cancelLimitActions";
import { selectCancelLimitStatus } from "../../../features/cancelLimit/cancelLimitSlice";
import { dismissDelegateRule } from "../../../features/delegateRules/delegateRulesActions";
import {
  selectMyOtcOrdersReducer,
  setActiveSortType,
} from "../../../features/myOtcOrders/myOtcOrdersSlice";
import switchToDefaultChain from "../../../helpers/switchToDefaultChain";
import { AppRoutes } from "../../../routes";
import { OrderStatus } from "../../../types/orderStatus";
import { OrdersSortType } from "../../../types/ordersSortType";
import SubmittedCancellationScreen from "../../SubmittedCancellationScreen/SubmittedCancellationScreen";
import TransactionOverlay from "../../TransactionOverlay/TransactionOverlay";
import WalletSignScreen from "../../WalletSignScreen/WalletSignScreen";
import {
  Container,
  InfoSectionContainer,
  StyledActionButtons,
} from "../MyOrdersWidget/MyOrdersWidget.styles";
import { MyOrder } from "../MyOrdersWidget/entities/MyOrder";
import { ButtonActions } from "../MyOrdersWidget/subcomponents/ActionButtons/ActionButtons";
import InfoSection from "../MyOrdersWidget/subcomponents/InfoSection/InfoSection";
import useRuleUnsetPending from "./hooks/useRuleUnsetPending";
import MyLimitOrdersList from "./subcomponents/MyLimitOrdersList/MyLimitOrdersList";

const MyLimitOrdersWidget: FC = () => {
  const dispatch = useAppDispatch();

  const { provider: library } = useWeb3React<Web3Provider>();
  const { isActive, isInitialized } = useAppSelector((state) => state.web3);
  const history = useHistory();
  const {
    delegateRules,
    isInitialized: isDelegateRulesInitialized,
    dismissedDelegateRuleIds,
  } = useAppSelector((state) => state.delegateRules);
  const filteredDelegateRules = delegateRules.filter(
    (rule) => !dismissedDelegateRuleIds.includes(rule.id)
  );

  const { sortTypeDirection, activeSortType } = useAppSelector(
    selectMyOtcOrdersReducer
  );

  const cancelLimitStatus = useAppSelector(selectCancelLimitStatus);
  const isSigning = cancelLimitStatus === "signing";
  const [activeUnsetDelegateRule, setActiveUnsetDelegateRule] =
    useState<DelegateRule>();
  const pendingUnsetRuleTransaction = useRuleUnsetPending(
    activeUnsetDelegateRule,
    true
  );

  // Modal states
  const { setShowWalletList } = useContext(InterfaceContext);

  const handleActionButtonClick = (action: ButtonActions) => {
    if (action === ButtonActions.connectWallet) {
      setShowWalletList(true);
    }

    if (action === ButtonActions.switchNetwork) {
      switchToDefaultChain();
    }
    if (action === ButtonActions.newOrder) {
      history.push({ pathname: AppRoutes.makeLimitOrder });
    }
  };

  const handleDeleteOrderButtonClick = async (
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

      <TransactionOverlay isHidden={isSigning || !pendingUnsetRuleTransaction}>
        {pendingUnsetRuleTransaction && (
          <SubmittedCancellationScreen
            chainId={pendingUnsetRuleTransaction.chainId}
            transaction={pendingUnsetRuleTransaction}
          />
        )}
      </TransactionOverlay>

      {!!filteredDelegateRules.length && (
        <MyLimitOrdersList
          activeCancellationId={activeUnsetDelegateRule?.id}
          activeSortType={activeSortType}
          activeTokens={[]}
          delegateRules={filteredDelegateRules}
          sortTypeDirection={sortTypeDirection}
          library={library!}
          onDeleteOrderButtonClick={handleDeleteOrderButtonClick}
          onSortButtonClick={handleSortButtonClick}
        />
      )}

      {!filteredDelegateRules.length && (
        <InfoSectionContainer>
          <InfoSection
            userHasNoOrders={!filteredDelegateRules.length}
            walletIsNotConnected={!isActive}
          />
        </InfoSectionContainer>
      )}

      <StyledActionButtons
        isLimitOrder
        walletIsNotConnected={!isActive}
        onActionButtonClick={handleActionButtonClick}
      />
    </Container>
  );
};

export default MyLimitOrdersWidget;
