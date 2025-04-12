import { FC, useContext, useMemo, useState } from "react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useParams } from "react-router-dom";

import {
  FullOrderERC20,
  ADDRESS_ZERO,
  TokenInfo,
  FullOrder,
} from "@airswap/utils";
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
import {
  fetchIndexerUrls,
  getFilteredOrders,
} from "../../../features/indexer/indexerActions";
import { selectIndexerReducer } from "../../../features/indexer/indexerSlice";
import { approve, deposit, take } from "../../../features/orders/ordersActions";
import {
  checkFullOrder,
  checkOrderErc20,
} from "../../../features/orders/ordersHelpers";
import {
  clear,
  selectOrdersErrors,
  selectOrdersStatus,
} from "../../../features/orders/ordersSlice";
import {
  reset,
  selectTakeOtcErrors,
  setErrors,
} from "../../../features/takeOtc/takeOtcSlice";
import { compareAddresses } from "../../../helpers/string";
import useAllowance from "../../../hooks/useAllowance";
import useAllowancesOrBalancesFailed from "../../../hooks/useAllowancesOrBalancesFailed";
import useApprovalPending from "../../../hooks/useApprovalPending";
import { useBalanceLoading } from "../../../hooks/useBalanceLoading";
import useDepositPending from "../../../hooks/useDepositPending";
import useInsufficientBalance from "../../../hooks/useInsufficientBalance";
import useNativeWrappedToken from "../../../hooks/useNativeWrappedToken";
import useOrderTransactionLink from "../../../hooks/useOrderTransactionLink";
import useShouldDepositNativeToken from "../../../hooks/useShouldDepositNativeTokenAmount";
import { AppRoutes, routes } from "../../../routes";
import { OrderStatus } from "../../../types/orderStatus";
import { OrderType } from "../../../types/orderTypes";
import TakeOrderReview from "../../@reviewScreens/TakeOrderReview/TakeOrderReview";
import WrapReview from "../../@reviewScreens/WrapReview/WrapReview";
import ApprovalSubmittedScreen from "../../ApprovalSubmittedScreen/ApprovalSubmittedScreen";
import AvailableOrdersWidget from "../../AvailableOrdersWidget/AvailableOrdersWidget";
import addAndSwitchToChain from "../../ChainSelectionPopover/helpers/addAndSwitchToChain";
import { ErrorList } from "../../ErrorList/ErrorList";
import ProtocolFeeModal from "../../InformationModals/subcomponents/ProtocolFeeModal/ProtocolFeeModal";
import ModalOverlay from "../../ModalOverlay/ModalOverlay";
import OrderSubmittedScreen from "../../OrderSubmittedScreen/OrderSubmittedScreen";
import SwapInputs from "../../SwapInputs/SwapInputs";
import TransactionOverlay from "../../TransactionOverlay/TransactionOverlay";
import WalletSignScreen from "../../WalletSignScreen/WalletSignScreen";
import {
  Container,
  StyledActionButtons,
  StyledInfoSection,
  StyledRecipientAndStatus,
} from "../OrderDetailWidget/OrderDetailWidget.styles";
import useFormattedTokenAmount from "../OrderDetailWidget/hooks/useFormattedTokenAmount";
import useTakerTokenInfo from "../OrderDetailWidget/hooks/useTakerTokenInfo";
import { ButtonActions } from "../OrderDetailWidget/subcomponents/ActionButtons/ActionButtons";
import OrderDetailWidgetHeader from "../OrderDetailWidget/subcomponents/OrderDetailWidgetHeader/OrderDetailWidgetHeader";
import { useOtcOrderStatus } from "./hooks/useOtcOrderStatus";
import useSessionOrderTransaction from "./hooks/useSessionOrderTransaction";

interface OtcOrderDetailWidgetProps {
  order: FullOrder;
}

export enum OtcOrderDetailWidgetState {
  overview = "overview",
  review = "review",
}

const OtcOrderDetailWidget: FC<OtcOrderDetailWidgetProps> = ({ order }) => {
  const { t } = useTranslation();
  const { provider: library } = useWeb3React<Web3Provider>();
  const { isActive, account, chainId } = useAppSelector((state) => state.web3);

  const history = useHistory();
  const dispatch = useAppDispatch();
  const params = useParams<{ compressedOrder: string }>();
  const { setShowWalletList, setTransactionsTabIsOpen } =
    useContext(InterfaceContext);

  const ordersStatus = useAppSelector(selectOrdersStatus);
  const ordersErrors = useAppSelector(selectOrdersErrors);
  const takeOtcErrors = useAppSelector(selectTakeOtcErrors);
  const { indexerUrls } = useAppSelector(selectIndexerReducer);

  const errors = [...ordersErrors, ...takeOtcErrors];

  const [state, setState] = useState<OtcOrderDetailWidgetState>(
    OtcOrderDetailWidgetState.overview
  );
  const [orderStatus, isOrderStatusLoading] = useOtcOrderStatus(order);
  const [senderToken, isSenderTokenLoading] = useTakerTokenInfo({
    address: order.sender.token,
    chainId: order.chainId,
    tokenId: order.sender.id,
  });
  const [signerToken, isSignerTokenLoading] = useTakerTokenInfo({
    address: order.signer.token,
    chainId: order.chainId,
    tokenId: order.signer.id,
    isQuoteToken: true,
  });
  const isBalanceLoading = useBalanceLoading();
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

  const senderAmount = useFormattedTokenAmount(
    order.sender.amount,
    senderTokenDecimals
  );
  const signerAmount = useFormattedTokenAmount(
    order.signer.amount,
    signerTokenDecimals
  );
  const tokenExchangeRate = new BigNumber(senderAmount!).dividedBy(
    signerAmount!
  );
  const approvalTransaction = useApprovalPending(order.sender.token, true);
  const wrappedNativeToken = useNativeWrappedToken(chainId);
  const orderTransaction = useSessionOrderTransaction(order.nonce);

  const { hasSufficientAllowance } = useAllowance(senderToken, senderAmount);

  const hasInsufficientTokenBalance = useInsufficientBalance(
    senderToken,
    senderAmount!
  );

  const shouldDepositNativeTokenAmount = useShouldDepositNativeToken(
    senderToken?.address,
    senderAmount
  );
  const isAllowancesOrBalancesFailed = useAllowancesOrBalancesFailed();
  const shouldDepositNativeToken = !!shouldDepositNativeTokenAmount;
  const hasDepositPending = !!useDepositPending();
  const orderTransactionLink = useOrderTransactionLink(order.nonce);
  const orderChainId = useMemo(() => order.chainId, [order]);
  const walletChainIdIsDifferentThanOrderChainId =
    !!chainId && orderChainId !== chainId;

  const orderType =
    order.sender.wallet === ADDRESS_ZERO
      ? OrderType.publicUnlisted
      : OrderType.private;
  const userIsMakerOfSwap = compareAddresses(
    order.signer.wallet,
    account || ""
  );
  const userIsIntendedRecipient =
    compareAddresses(order.sender.wallet, account || "") ||
    order.sender.wallet === ADDRESS_ZERO;

  const parsedExpiry = useMemo(() => {
    return new Date(parseInt(order.expiry) * 1000);
  }, [order]);

  const [showFeeInfo, toggleShowFeeInfo] = useToggle(false);
  const [showViewAllQuotes, toggleShowViewAllQuotes] = useToggle(false);

  useEffect(() => {
    if (!indexerUrls && library) {
      dispatch(fetchIndexerUrls({ provider: library }));
    }
  }, [indexerUrls]);

  useEffect(() => {
    if (indexerUrls && senderToken && signerToken) {
      dispatch(
        getFilteredOrders({
          filter: {
            senderToken: senderToken.address,
            signerToken: signerToken.address,
          },
        })
      );
    }
  }, [indexerUrls, senderToken, signerToken]);

  // button handlers
  const backToSwapPage = () => {
    history.push({
      pathname: `/${AppRoutes.swap}/${senderToken?.address}/${signerToken?.address}`,
      state: { isFromOrderDetailPage: true },
    });
  };

  const takeOrder = async () => {
    if (!library) return;

    const errors = await checkFullOrder(
      order,
      order.sender.wallet,
      order.chainId,
      library
    );

    if (errors.length) {
      dispatch(setErrors(errors));
      return;
    }

    // TODO: Support FullOrder and AppTokenInfo
    await dispatch(
      take(
        order,
        signerToken! as TokenInfo,
        senderToken! as TokenInfo,
        library,
        "Swap"
      )
    );
  };

  const approveToken = () => {
    if (!senderToken || !senderAmount || !library) {
      return;
    }

    // TODO: Support AppTokenInfo
    dispatch(approve(senderAmount, senderToken as TokenInfo, library, "Swap"));
  };

  const depositNativeToken = async () => {
    // TODO: Support AppTokenInfo
    dispatch(
      deposit(
        shouldDepositNativeTokenAmount!,
        senderToken! as TokenInfo,
        wrappedNativeToken!,
        chainId!,
        library!
      )
    );
  };

  const restart = () => {
    history.push({ pathname: `/${AppRoutes.makeOtcOrder}` });
    dispatch(clear());
    dispatch(reset());
  };

  const backToOverview = () => {
    setState(OtcOrderDetailWidgetState.overview);
  };

  const handleActionButtonClick = async (action: ButtonActions) => {
    console.log("handleActionButtonClick", action);
    if (action === ButtonActions.connectWallet) {
      setShowWalletList(true);
    }

    if (action === ButtonActions.switchNetwork) {
      addAndSwitchToChain(order.chainId);
    }

    if (action === ButtonActions.restart) {
      restart();
    }

    if (action === ButtonActions.approve) {
      approveToken();
    }

    if (action === ButtonActions.review) {
      setState(OtcOrderDetailWidgetState.review);
    }

    if (action === ButtonActions.cancel) {
      history.push(routes.cancelOtcOrder(params.compressedOrder));
    }

    if (action === ButtonActions.take) {
      takeOrder();
    }

    if (
      action === ButtonActions.back ||
      action === ButtonActions.makeNewOrder
    ) {
      history.push(routes.makeOtcOrder());
    }
  };

  const renderScreens = () => {
    if (
      state === OtcOrderDetailWidgetState.review &&
      shouldDepositNativeToken &&
      !orderTransaction
    ) {
      return (
        <WrapReview
          isLoading={hasDepositPending}
          amount={senderAmount || "0"}
          errors={errors}
          shouldDepositNativeTokenAmount={shouldDepositNativeTokenAmount}
          wrappedNativeToken={wrappedNativeToken}
          onRestartButtonClick={backToOverview}
          onSignButtonClick={depositNativeToken}
        />
      );
    }

    if (state === OtcOrderDetailWidgetState.review) {
      return (
        <TakeOrderReview
          errors={errors}
          expiry={+order.expiry}
          senderAmount={senderAmount || "0"}
          senderToken={senderToken}
          signerAmount={signerAmount || "0"}
          signerToken={signerToken}
          wrappedNativeToken={wrappedNativeToken}
          onEditButtonClick={backToOverview}
          onRestartButtonClick={restart}
          onSignButtonClick={takeOrder}
        />
      );
    }

    return (
      <>
        <OrderDetailWidgetHeader isMakerOfSwap={userIsMakerOfSwap} />
        <SwapInputs
          readOnly
          disabled={orderStatus === OrderStatus.canceled}
          isRequestingBaseAmount={isSignerTokenLoading}
          isRequestingBaseToken={isSignerTokenLoading}
          isRequestingQuoteAmount={isSenderTokenLoading}
          isRequestingQuoteToken={isSenderTokenLoading}
          showTokenContractLink
          baseAmount={signerAmount || "0.00"}
          baseTokenInfo={signerToken}
          maxAmount={null}
          side={userIsMakerOfSwap ? "sell" : "buy"}
          tradeNotAllowed={walletChainIdIsDifferentThanOrderChainId}
          quoteAmount={senderAmount || "0.00"}
          quoteTokenInfo={senderToken}
          onBaseAmountChange={() => {}}
          onChangeTokenClick={() => {}}
          onMaxButtonClick={() => {}}
        />

        <StyledRecipientAndStatus
          isLoading={isOrderStatusLoading}
          expiry={parsedExpiry}
          link={orderTransactionLink}
          orderType={orderType}
          recipient={order.sender.wallet}
          status={orderStatus}
          userAddress={account || undefined}
        />

        <StyledInfoSection
          isAllowancesFailed={isAllowancesOrBalancesFailed}
          isExpired={orderStatus === OrderStatus.expired}
          isDifferentChainId={walletChainIdIsDifferentThanOrderChainId}
          isIntendedRecipient={userIsIntendedRecipient}
          isMakerOfSwap={userIsMakerOfSwap}
          isNotConnected={!isActive}
          orderChainId={orderChainId}
          token1={signerTokenSymbol}
          token2={senderTokenSymbol}
          rate={tokenExchangeRate}
          onFeeButtonClick={toggleShowFeeInfo}
        />

        <StyledActionButtons
          hasInsufficientBalance={hasInsufficientTokenBalance}
          hasInsufficientAllowance={!hasSufficientAllowance}
          isExpired={orderStatus === OrderStatus.expired}
          isCanceled={orderStatus === OrderStatus.canceled}
          isTaken={orderStatus === OrderStatus.taken}
          isDifferentChainId={walletChainIdIsDifferentThanOrderChainId}
          isIntendedRecipient={userIsIntendedRecipient}
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

      {signerToken && senderToken && (
        <ModalOverlay
          title={t("orders.availableOrders")}
          isHidden={!showViewAllQuotes}
          onClose={() => toggleShowViewAllQuotes()}
        >
          <AvailableOrdersWidget
            senderToken={senderToken}
            signerToken={signerToken}
            onSwapLinkClick={backToSwapPage}
            onFullOrderLinkClick={toggleShowViewAllQuotes}
          />
        </ModalOverlay>
      )}

      <TransactionOverlay isHidden={ordersStatus !== "signing"}>
        <WalletSignScreen type="swap" />
      </TransactionOverlay>

      <TransactionOverlay
        isHidden={ordersStatus === "signing" || !approvalTransaction}
      >
        {approvalTransaction && (
          <ApprovalSubmittedScreen
            chainId={chainId}
            transaction={approvalTransaction}
          />
        )}
      </TransactionOverlay>

      <TransactionOverlay isHidden={!orderTransaction}>
        {orderTransaction && (
          <OrderSubmittedScreen
            showTrackTransactionButton
            chainId={chainId}
            transaction={orderTransaction}
            onMakeNewOrderButtonClick={restart}
          />
        )}
      </TransactionOverlay>
    </Container>
  );
};

export default OtcOrderDetailWidget;
