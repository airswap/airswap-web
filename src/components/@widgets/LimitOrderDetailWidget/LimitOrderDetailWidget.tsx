import { FC, useContext, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

import { TokenInfo } from "@airswap/utils";
import { Web3Provider } from "@ethersproject/providers";
import { useToggle } from "@react-hookz/web";
import { useWeb3React } from "@web3-react/core";

import { BigNumber } from "bignumber.js";

import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { InterfaceContext } from "../../../contexts/interface/Interface";
import {
  getTokenDecimals,
  getTokenSymbol,
} from "../../../entities/AppTokenInfo/AppTokenInfoHelpers";
import { DelegateRule } from "../../../entities/DelegateRule/DelegateRule";
import { cancelLimitOrder } from "../../../features/cancelLimit/cancelLimitActions";
import { selectCancelLimitStatus } from "../../../features/cancelLimit/cancelLimitSlice";
import { approve, deposit } from "../../../features/orders/ordersActions";
import {
  clear,
  selectOrdersErrors,
  selectOrdersStatus,
} from "../../../features/orders/ordersSlice";
import {
  getDelegateOrder,
  takeLimitOrder,
} from "../../../features/takeLimit/takeLimitActions";
import {
  reset,
  selectTakeLimitErrors,
  selectTakeLimitStatus,
} from "../../../features/takeLimit/takeLimitSlice";
import { compareAddresses } from "../../../helpers/string";
import useAllowance from "../../../hooks/useAllowance";
import useAllowancesOrBalancesFailed from "../../../hooks/useAllowancesOrBalancesFailed";
import { useAmountPlusFee } from "../../../hooks/useAmountPlusFee";
import useApprovalPending from "../../../hooks/useApprovalPending";
import { useBalanceLoading } from "../../../hooks/useBalanceLoading";
import useDepositPending from "../../../hooks/useDepositPending";
import useInsufficientBalance from "../../../hooks/useInsufficientBalance";
import useNativeWrappedToken from "../../../hooks/useNativeWrappedToken";
import useOrderTransactionLink from "../../../hooks/useOrderTransactionLink";
import useShouldDepositNativeToken from "../../../hooks/useShouldDepositNativeTokenAmount";
import { routes } from "../../../routes";
import { OrderStatus } from "../../../types/orderStatus";
import { OrderType } from "../../../types/orderTypes";
import ApproveReview from "../../@reviewScreens/ApproveReview/ApproveReview";
import CancelReview from "../../@reviewScreens/CancelReview/CancelReview";
import TakeOrderReview from "../../@reviewScreens/TakeOrderReview/TakeOrderReview";
import WrapReview from "../../@reviewScreens/WrapReview/WrapReview";
import ApprovalSubmittedScreen from "../../ApprovalSubmittedScreen/ApprovalSubmittedScreen";
import addAndSwitchToChain from "../../ChainSelectionPopover/helpers/addAndSwitchToChain";
import { ErrorList } from "../../ErrorList/ErrorList";
import ProtocolFeeModal from "../../InformationModals/subcomponents/ProtocolFeeModal/ProtocolFeeModal";
import ModalOverlay from "../../ModalOverlay/ModalOverlay";
import OrderSubmittedScreen from "../../OrderSubmittedScreen/OrderSubmittedScreen";
import SwapInputs from "../../SwapInputs/SwapInputs";
import TransactionOverlay from "../../TransactionOverlay/TransactionOverlay";
import UnsetRuleSubmittedScreen from "../../UnsetRuleScreen/UnsetRuleScreen";
import WalletSignScreen from "../../WalletSignScreen/WalletSignScreen";
import { useFilledStatus } from "../MyLimitOrdersWidget/hooks/useFilledStatus";
import { useLimitOrderStatus } from "../MyLimitOrdersWidget/hooks/useLimitOrderStatus";
import {
  Container,
  StyledActionButtons,
  StyledFilledAndStatus,
  StyledInfoSection,
} from "../OrderDetailWidget/OrderDetailWidget.styles";
import useTakerTokenInfo from "../OrderDetailWidget/hooks/useTakerTokenInfo";
import { ButtonActions } from "../OrderDetailWidget/subcomponents/ActionButtons/ActionButtons";
import OrderDetailWidgetHeader from "../OrderDetailWidget/subcomponents/OrderDetailWidgetHeader/OrderDetailWidgetHeader";
import {
  getCustomSenderAmount,
  getCustomSignerAmount,
  getDelegateRuleTokensExchangeRate,
} from "./helpers";
import { useAvailableSenderAndSignerAmount } from "./hooks/useAvailableSenderAndSignerAmount";
import useCustomSignerAmountPlusFee from "./hooks/useCustomSignerAmountPlusFee";
import useSessionDelegateSwapTransaction from "./hooks/useSessionDelegateSwapTransaction";
import useSessionUnsetRuleTransaction from "./hooks/useSessionUnsetRuleTransaction";

interface LimitOrderDetailWidgetProps {
  delegateRule: DelegateRule;
}

export enum LimitOrderDetailWidgetState {
  overview = "overview",
  review = "review",
}

const LimitOrderDetailWidget: FC<LimitOrderDetailWidgetProps> = ({
  delegateRule,
}) => {
  const { t } = useTranslation();
  const { provider: library } = useWeb3React<Web3Provider>();
  const { isActive, account, chainId } = useAppSelector((state) => state.web3);
  const { protocolFee } = useAppSelector((state) => state.metadata);

  const history = useHistory();
  const dispatch = useAppDispatch();
  const { setShowWalletList } = useContext(InterfaceContext);

  const ordersStatus = useAppSelector(selectOrdersStatus);
  const takeLimitStatus = useAppSelector(selectTakeLimitStatus);
  const ordersErrors = useAppSelector(selectOrdersErrors);
  const takeLimitErrors = useAppSelector(selectTakeLimitErrors);
  const unsetRuleStatus = useAppSelector(selectCancelLimitStatus);

  const isOrdersSigning = ordersStatus === "signing";
  const isTakeLimitSigning =
    takeLimitStatus === "signing-signature" ||
    takeLimitStatus === "signing-transaction";
  const isCancelLimitSigning = unsetRuleStatus === "signing";
  const isSigning =
    isOrdersSigning || isTakeLimitSigning || isCancelLimitSigning;

  const errors = [...ordersErrors, ...takeLimitErrors];

  const [state, setState] = useState<LimitOrderDetailWidgetState>(
    LimitOrderDetailWidgetState.overview
  );
  const [showCancelReview, toggleShowCancelReview] = useToggle(false);

  const orderStatus = useLimitOrderStatus(delegateRule);
  const [senderToken, isSenderTokenLoading] = useTakerTokenInfo({
    address: delegateRule.senderToken,
    chainId: delegateRule.chainId,
  });
  const [signerToken, isSignerTokenLoading] = useTakerTokenInfo({
    address: delegateRule.signerToken,
    chainId: delegateRule.chainId,
  });
  const senderTokenDecimals = senderToken
    ? getTokenDecimals(senderToken)
    : undefined;
  const signerTokenDecimals = signerToken
    ? getTokenDecimals(signerToken)
    : undefined;
  const senderTokenSymbol = senderToken
    ? getTokenSymbol(senderToken)
    : undefined;
  const signerTokenSymbol = signerToken
    ? getTokenSymbol(signerToken)
    : undefined;

  const isBalanceLoading = useBalanceLoading();

  const { availableSenderAmount, availableSignerAmount } =
    useAvailableSenderAndSignerAmount(
      delegateRule,
      senderTokenDecimals,
      signerTokenDecimals
    );

  const [customSignerAmount, setCustomSignerAmount] = useState<string>();
  const [customSenderAmount, setCustomSenderAmount] = useState<string>();

  const [filledAmount, filledPercentage] = useFilledStatus(
    delegateRule,
    senderTokenDecimals
  );

  const tokenExchangeRate = getDelegateRuleTokensExchangeRate(
    delegateRule,
    senderTokenDecimals,
    signerTokenDecimals
  );

  const customSignerAmountPlusFee = useCustomSignerAmountPlusFee(
    tokenExchangeRate,
    customSenderAmount,
    signerTokenDecimals
  );

  const approvalTransaction = useApprovalPending(
    delegateRule.signerToken,
    true
  );
  const {
    transaction: unsetRuleTransaction,
    reset: resetUnsetRuleTransaction,
  } = useSessionUnsetRuleTransaction(delegateRule);

  const wrappedNativeToken = useNativeWrappedToken(chainId);
  const {
    transaction: delegateSwapTransaction,
    reset: resetDelegateSwapTransaction,
  } = useSessionDelegateSwapTransaction(delegateRule.id);

  const { hasSufficientAllowance, readableAllowance } = useAllowance(
    signerToken,
    customSignerAmountPlusFee
  );

  const hasInsufficientTokenBalance = useInsufficientBalance(
    signerToken,
    customSignerAmountPlusFee!
  );

  const shouldDepositNativeTokenAmount = useShouldDepositNativeToken(
    signerToken?.address,
    customSignerAmountPlusFee
  );
  const isAllowancesOrBalancesFailed = useAllowancesOrBalancesFailed();
  const shouldDepositNativeToken = !!shouldDepositNativeTokenAmount;
  const hasDepositPending = !!useDepositPending();
  const orderTransactionLink = useOrderTransactionLink(delegateRule.id);
  const orderChainId = useMemo(() => delegateRule.chainId, [delegateRule]);
  const walletChainIdIsDifferentThanOrderChainId =
    !!chainId && orderChainId !== chainId;

  const orderType = OrderType.publicUnlisted;
  const userIsMakerOfSwap = account
    ? compareAddresses(delegateRule.senderWallet, account)
    : false;
  const parsedExpiry = useMemo(() => {
    return new Date(delegateRule.expiry * 1000);
  }, [delegateRule]);

  const [showFeeInfo, toggleShowFeeInfo] = useToggle(false);

  // Review states
  const showWrapReview =
    state === LimitOrderDetailWidgetState.review &&
    shouldDepositNativeToken &&
    !delegateSwapTransaction;
  const showApproveReview =
    (state === LimitOrderDetailWidgetState.review && !hasSufficientAllowance) ||
    !!approvalTransaction;
  const showOrderReview = state === LimitOrderDetailWidgetState.review;

  const handleSignerAmountChange = (value: string): void => {
    if (!availableSignerAmount) {
      return;
    }

    const {
      signerAmount: newCustomSignerAmount,
      senderAmount: newCustomSenderAmount,
    } = getCustomSenderAmount(
      tokenExchangeRate,
      value,
      availableSignerAmount,
      signerTokenDecimals,
      senderTokenDecimals
    );

    setCustomSignerAmount(newCustomSignerAmount);
    setCustomSenderAmount(newCustomSenderAmount);
  };

  const handleSenderAmountChange = (value: string): void => {
    if (!availableSenderAmount) {
      return;
    }

    const {
      signerAmount: newCustomSignerAmount,
      senderAmount: newCustomSenderAmount,
    } = getCustomSignerAmount(
      tokenExchangeRate,
      value,
      availableSenderAmount,
      signerTokenDecimals,
      senderTokenDecimals
    );

    setCustomSignerAmount(newCustomSignerAmount);
    setCustomSenderAmount(newCustomSenderAmount);
  };

  const handleMaxButtonClick = () => {
    setCustomSignerAmount(availableSignerAmount);
    setCustomSenderAmount(availableSenderAmount);
  };

  const takeOrder = async () => {
    if (
      !library ||
      !account ||
      !customSignerAmount ||
      !customSenderAmount ||
      !signerToken ||
      !senderToken
    )
      return;

    dispatch(
      takeLimitOrder({
        delegateRule,
        protocolFee,
        signerWallet: account,
        signerAmount: customSignerAmount,
        senderAmount: customSenderAmount,
        signerTokenInfo: signerToken as TokenInfo,
        senderTokenInfo: senderToken as TokenInfo,
        library,
      })
    );
  };

  const approveToken = () => {
    if (!signerToken || !customSignerAmountPlusFee || !library) {
      return;
    }

    // TODO: Support AppTokenInfo
    dispatch(
      approve(
        customSignerAmountPlusFee,
        signerToken as TokenInfo,
        library,
        "Swap"
      )
    );
  };

  const depositNativeToken = async () => {
    dispatch(
      deposit(
        shouldDepositNativeTokenAmount!,
        // TODO: Support AppTokenInfo
        senderToken as TokenInfo,
        wrappedNativeToken!,
        chainId!,
        library!
      )
    );
  };

  const makeNewOrder = () => {
    history.push(routes.makeLimitOrder());
  };

  const cancelOrder = () => {
    dispatch(
      cancelLimitOrder({
        chainId: delegateRule.chainId,
        senderWallet: delegateRule.senderWallet,
        // TODO: Support AppTokenInfo
        senderTokenInfo: senderToken! as TokenInfo,
        signerTokenInfo: signerToken! as TokenInfo,
        library: library!,
      })
    );
  };

  const restart = () => {
    resetDelegateSwapTransaction();
    resetUnsetRuleTransaction();
    setState(LimitOrderDetailWidgetState.overview);
    dispatch(clear());
    dispatch(reset());
    dispatch(
      getDelegateOrder({
        senderWallet: delegateRule.senderWallet,
        senderToken: delegateRule.senderToken,
        signerToken: delegateRule.signerToken,
        chainId: delegateRule.chainId,
        library: library!,
      })
    );
  };

  const backToOverview = () => {
    setState(LimitOrderDetailWidgetState.overview);
  };

  const handleActionButtonClick = async (action: ButtonActions) => {
    if (action === ButtonActions.connectWallet) {
      setShowWalletList(true);
    }

    if (action === ButtonActions.switchNetwork) {
      addAndSwitchToChain(delegateRule.chainId);
    }

    if (action === ButtonActions.restart) {
      restart();
    }

    if (action === ButtonActions.makeNewOrder) {
      makeNewOrder();
    }

    if (action === ButtonActions.approve) {
      setState(LimitOrderDetailWidgetState.review);
    }

    if (action === ButtonActions.review) {
      setState(LimitOrderDetailWidgetState.review);
    }

    if (action === ButtonActions.cancel) {
      toggleShowCancelReview();
    }

    if (action === ButtonActions.take) {
      takeOrder();
    }

    if (action === ButtonActions.back) {
      history.push(routes.makeLimitOrder());
    }
  };

  useEffect(() => {
    setCustomSignerAmount(availableSignerAmount);
    setCustomSenderAmount(availableSenderAmount);
  }, [availableSenderAmount, availableSignerAmount]);

  const renderScreens = () => {
    if (showWrapReview) {
      return (
        <WrapReview
          isLoading={hasDepositPending}
          amount={customSenderAmount || "0"}
          errors={errors}
          shouldDepositNativeTokenAmount={shouldDepositNativeTokenAmount}
          wrappedNativeToken={wrappedNativeToken}
          onEditButtonClick={backToOverview}
          onRestartButtonClick={restart}
          onSignButtonClick={depositNativeToken}
        />
      );
    }

    if (showApproveReview) {
      return (
        <>
          <ApproveReview
            hasEditButton
            isLoading={!!approvalTransaction}
            amount={customSignerAmount || "0"}
            amountPlusFee={customSignerAmountPlusFee}
            readableAllowance={readableAllowance}
            token={signerToken}
            wrappedNativeToken={wrappedNativeToken}
            onEditButtonClick={backToOverview}
            onRestartButtonClick={restart}
            onSignButtonClick={approveToken}
          />
        </>
      );
    }

    if (showOrderReview) {
      return (
        <TakeOrderReview
          isSigner
          errors={errors}
          expiry={delegateRule.expiry}
          senderAmount={customSenderAmount || "0"}
          senderToken={senderToken}
          signerAmount={customSignerAmount || "0"}
          signerAmountPlusFee={customSignerAmountPlusFee}
          signerToken={signerToken}
          wrappedNativeToken={wrappedNativeToken}
          onEditButtonClick={backToOverview}
          onRestartButtonClick={restart}
          onSignButtonClick={takeOrder}
        />
      );
    }

    if (showCancelReview) {
      return (
        <CancelReview
          onBackButtonClick={() => toggleShowCancelReview()}
          onSignButtonClick={cancelOrder}
        />
      );
    }

    return (
      <>
        <OrderDetailWidgetHeader isMakerOfSwap={userIsMakerOfSwap} />
        <SwapInputs
          showMaxButton={
            orderStatus === OrderStatus.open &&
            customSignerAmount !== availableSignerAmount
          }
          readOnly={userIsMakerOfSwap}
          disabled={orderStatus !== OrderStatus.open}
          canSetQuoteAmount
          isSelectTokenDisabled
          isRequestingBaseAmount={isSignerTokenLoading}
          isRequestingBaseToken={isSignerTokenLoading}
          isRequestingQuoteAmount={isSenderTokenLoading}
          isRequestingQuoteToken={isSenderTokenLoading}
          showTokenContractLink
          baseAmount={customSignerAmount || "0.00"}
          baseTokenInfo={signerToken}
          maxAmount={null}
          side={userIsMakerOfSwap ? "buy" : "sell"}
          tradeNotAllowed={walletChainIdIsDifferentThanOrderChainId}
          quoteAmount={customSenderAmount || "0.00"}
          quoteTokenInfo={senderToken}
          onBaseAmountChange={handleSignerAmountChange}
          onQuoteAmountChange={handleSenderAmountChange}
          onMaxButtonClick={handleMaxButtonClick}
        />

        <StyledFilledAndStatus
          expiry={parsedExpiry}
          isOwner={userIsMakerOfSwap}
          filledAmount={filledAmount}
          filledPercentage={filledPercentage}
          orderType={orderType}
          status={orderStatus}
          tokenSymbol={senderTokenSymbol}
          link={orderTransactionLink}
        />

        <StyledInfoSection
          isAllowancesFailed={isAllowancesOrBalancesFailed}
          isExpired={orderStatus === OrderStatus.expired}
          isDifferentChainId={walletChainIdIsDifferentThanOrderChainId}
          isIntendedRecipient={true}
          isMakerOfSwap={userIsMakerOfSwap}
          isNotConnected={!isActive}
          orderChainId={orderChainId}
          token1={signerTokenSymbol}
          token2={senderTokenSymbol}
          rate={new BigNumber(1).dividedBy(tokenExchangeRate)}
          onFeeButtonClick={toggleShowFeeInfo}
        />

        <StyledActionButtons
          hasInsufficientBalance={hasInsufficientTokenBalance}
          hasInsufficientAllowance={!hasSufficientAllowance}
          isExpired={orderStatus === OrderStatus.expired}
          isCanceled={orderStatus === OrderStatus.canceled}
          isLimitOrder={true}
          isTaken={orderStatus === OrderStatus.taken}
          isDifferentChainId={walletChainIdIsDifferentThanOrderChainId}
          isIntendedRecipient={true}
          isLoading={isBalanceLoading}
          isMakerOfSwap={userIsMakerOfSwap}
          isNotConnected={!isActive}
          requiresReload={isAllowancesOrBalancesFailed}
          shouldDepositNativeToken={shouldDepositNativeToken}
          onActionButtonClick={handleActionButtonClick}
        />
      </>
    );
  };

  return (
    <Container>
      {renderScreens()}

      <ModalOverlay
        title={t("information.protocolFee.title")}
        onClose={() => toggleShowFeeInfo()}
        isHidden={!showFeeInfo}
      >
        <ProtocolFeeModal onCloseButtonClick={() => toggleShowFeeInfo()} />
      </ModalOverlay>

      <ModalOverlay
        title={t("validatorErrors.unableSwap")}
        subTitle={t("validatorErrors.swapFail")}
        onClose={restart}
        isHidden={!errors.length}
      >
        <ErrorList errors={errors} onBackButtonClick={restart} />
      </ModalOverlay>

      <TransactionOverlay isHidden={!isSigning}>
        <WalletSignScreen
          type={takeLimitStatus === "signing-signature" ? "signature" : "swap"}
        />
      </TransactionOverlay>

      <TransactionOverlay isHidden={isSigning || !approvalTransaction}>
        {approvalTransaction && (
          <ApprovalSubmittedScreen
            chainId={chainId}
            transaction={approvalTransaction}
          />
        )}
      </TransactionOverlay>

      <TransactionOverlay isHidden={isSigning || !unsetRuleTransaction}>
        {unsetRuleTransaction && (
          <UnsetRuleSubmittedScreen
            chainId={chainId}
            transaction={unsetRuleTransaction}
            onMakeNewLimitOrderButtonClick={makeNewOrder}
            onShowLimitOrderButtonClick={restart}
          />
        )}
      </TransactionOverlay>

      <TransactionOverlay isHidden={!delegateSwapTransaction}>
        {delegateSwapTransaction && (
          <OrderSubmittedScreen
            showReturnToOrderButton
            showTrackTransactionButton
            chainId={chainId}
            transaction={delegateSwapTransaction}
            onMakeNewOrderButtonClick={makeNewOrder}
            onReturnToOrderButtonClick={restart}
          />
        )}
      </TransactionOverlay>
    </Container>
  );
};

export default LimitOrderDetailWidget;
