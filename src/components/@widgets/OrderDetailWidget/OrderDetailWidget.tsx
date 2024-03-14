import { FC, useContext, useMemo, useState } from "react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useLocation, useParams } from "react-router-dom";

import { FullOrderERC20, ADDRESS_ZERO } from "@airswap/utils";
import { Web3Provider } from "@ethersproject/providers";
import { useToggle } from "@react-hookz/web";
import { unwrapResult } from "@reduxjs/toolkit";
import { UnsupportedChainIdError, useWeb3React } from "@web3-react/core";

import { BigNumber } from "bignumber.js";

import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { InterfaceContext } from "../../../contexts/interface/Interface";
import { AppErrorType } from "../../../errors/appError";
import { selectIndexerReducer } from "../../../features/indexer/indexerSlice";
import {
  getFilteredOrders,
  fetchIndexerUrls,
} from "../../../features/indexer/indexerSlice";
import { selectMyOrdersReducer } from "../../../features/myOrders/myOrdersSlice";
import { check } from "../../../features/orders/orderApi";
import {
  approve,
  clear,
  deposit,
  selectOrdersErrors,
  selectOrdersStatus,
  take,
} from "../../../features/orders/ordersSlice";
import {
  reset,
  selectTakeOtcErrors,
  setErrors,
} from "../../../features/takeOtc/takeOtcSlice";
import useAllowance from "../../../hooks/useAllowance";
import useApprovalPending from "../../../hooks/useApprovalPending";
import useDepositPending from "../../../hooks/useDepositPending";
import useInsufficientBalance from "../../../hooks/useInsufficientBalance";
import useNativeWrappedToken from "../../../hooks/useNativeWrappedToken";
import useOrderTransactionLink from "../../../hooks/useOrderTransactionLink";
import useShouldDepositNativeToken from "../../../hooks/useShouldDepositNativeTokenAmount";
import { AppRoutes } from "../../../routes";
import { OrderStatus } from "../../../types/orderStatus";
import { OrderType } from "../../../types/orderTypes";
import ApproveReview from "../../@reviewScreens/ApproveReview/ApproveReview";
import TakeOrderReview from "../../@reviewScreens/TakeOrderReview/TakeOrderReview";
import WrapReview from "../../@reviewScreens/WrapReview/WrapReview";
import AvailableOrdersWidget from "../../AvailableOrdersWidget/AvailableOrdersWidget";
import addAndSwitchToChain from "../../ChainSelectionPopover/helpers/addAndSwitchToChain";
import { ErrorList } from "../../ErrorList/ErrorList";
import ProtocolFeeModal from "../../InformationModals/subcomponents/ProtocolFeeModal/ProtocolFeeModal";
import OrderSubmittedScreen from "../../OrderSubmittedScreen/OrderSubmittedScreen";
import Overlay from "../../Overlay/Overlay";
import SwapInputs from "../../SwapInputs/SwapInputs";
import WalletSignScreen from "../../WalletSignScreen/WalletSignScreen";
import {
  Container,
  StyledActionButtons,
  StyledInfoButtons,
  StyledInfoSection,
} from "./OrderDetailWidget.styles";
import useFormattedTokenAmount from "./hooks/useFormattedTokenAmount";
import { useOrderStatus } from "./hooks/useOrderStatus";
import useSessionOrderTransaction from "./hooks/useSessionOrderTransaction";
import useTakerTokenInfo from "./hooks/useTakerTokenInfo";
import { ButtonActions } from "./subcomponents/ActionButtons/ActionButtons";
import OrderDetailWidgetHeader from "./subcomponents/OrderDetailWidgetHeader/OrderDetailWidgetHeader";

interface OrderDetailWidgetProps {
  order: FullOrderERC20;
}

export enum OrderDetailWidgetState {
  overview = "overview",
  review = "review",
}

const OrderDetailWidget: FC<OrderDetailWidgetProps> = ({ order }) => {
  const { t } = useTranslation();
  const { account, library } = useWeb3React<Web3Provider>();
  const history = useHistory();
  const location = useLocation<{ isFromAvailableOrdersWidget?: boolean }>();
  const isFromAvailableOrdersWidget =
    !!location.state?.isFromAvailableOrdersWidget;
  const dispatch = useAppDispatch();
  const params = useParams<{ compressedOrder: string }>();
  const { setShowWalletList } = useContext(InterfaceContext);
  const { active, chainId, error: web3Error } = useWeb3React<Web3Provider>();
  const ordersStatus = useAppSelector(selectOrdersStatus);
  const ordersErrors = useAppSelector(selectOrdersErrors);
  const takeOtcErrors = useAppSelector(selectTakeOtcErrors);
  const { userOrders } = useAppSelector(selectMyOrdersReducer);
  const { indexerUrls } = useAppSelector(selectIndexerReducer);
  const errors = [...ordersErrors, ...takeOtcErrors];

  const [state, setState] = useState<OrderDetailWidgetState>(
    OrderDetailWidgetState.overview
  );
  const [orderStatus, isOrderStatusLoading] = useOrderStatus(order);
  const [senderToken, isSenderTokenLoading] = useTakerTokenInfo(
    order.senderToken
  );
  const [signerToken, isSignerTokenLoading] = useTakerTokenInfo(
    order.signerToken
  );

  const senderAmount = useFormattedTokenAmount(
    order.senderAmount,
    senderToken?.decimals
  );
  const signerAmount = useFormattedTokenAmount(
    order.signerAmount,
    signerToken?.decimals
  );
  const senderTokenSymbol = senderToken?.symbol;
  const signerTokenSymbol = signerToken?.symbol;
  const tokenExchangeRate = new BigNumber(senderAmount!).dividedBy(
    signerAmount!
  );
  const hasApprovalPending = useApprovalPending(order.senderToken);
  const wrappedNativeToken = useNativeWrappedToken(chainId);
  const orderTransaction = useSessionOrderTransaction(order.nonce);
  const { hasSufficientAllowance } = useAllowance(
    senderToken,
    senderAmount,
    true
  );

  const hasInsufficientTokenBalance = useInsufficientBalance(
    senderToken,
    senderAmount!
  );

  const shouldDepositNativeTokenAmount = useShouldDepositNativeToken(
    senderToken?.address,
    senderAmount
  );
  const shouldDepositNativeToken = !!shouldDepositNativeTokenAmount;
  const hasDepositPending = useDepositPending();
  const orderTransactionLink = useOrderTransactionLink(order.nonce);
  const orderChainId = useMemo(() => order.chainId, [order]);
  const walletChainIdIsDifferentThanOrderChainId =
    !!chainId && orderChainId !== chainId;

  const orderType =
    order.senderWallet === ADDRESS_ZERO
      ? OrderType.publicUnlisted
      : OrderType.private;
  const userIsMakerOfSwap = order.signerWallet === account;
  const userIsIntendedRecipient =
    order.senderWallet.toLowerCase() === account?.toLowerCase() ||
    order.senderWallet === ADDRESS_ZERO;
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

  const handleBackButtonClick = () => {
    if (isFromAvailableOrdersWidget) {
      backToSwapPage();

      return;
    }

    history.push({
      pathname: `/${userOrders.length ? AppRoutes.myOrders : AppRoutes.make}`,
    });
  };

  const takeOrder = async () => {
    if (!library) return;
    const errors = await check(
      order,
      order.senderWallet,
      order.chainId,
      library
    );
    if (errors.length) {
      dispatch(setErrors(errors));
      return;
    }

    await dispatch(
      take({
        order,
        library: library,
        contractType: "Swap",
        onExpired: () => {},
      })
    );
  };

  const approveToken = () => {
    if (!senderToken || !senderAmount) {
      return;
    }

    dispatch(
      approve({
        token: senderToken,
        library,
        contractType: "Swap",
        chainId: chainId!,
        amount: senderAmount,
      })
    );
  };

  const depositNativeToken = async () => {
    const result = await dispatch(
      deposit({
        chainId: chainId!,
        senderAmount: shouldDepositNativeTokenAmount!,
        senderTokenDecimals: senderToken!.decimals,
        provider: library!,
      })
    );
    await unwrapResult(result);
  };

  const restart = () => {
    history.push({ pathname: `/${AppRoutes.make}` });
    dispatch(clear());
    dispatch(reset());
  };

  const backToOverview = () => {
    setState(OrderDetailWidgetState.overview);
  };

  const handleActionButtonClick = async (action: ButtonActions) => {
    if (action === ButtonActions.connectWallet) {
      setShowWalletList(true);
    }

    if (action === ButtonActions.switchNetwork) {
      addAndSwitchToChain(order.chainId);
    }

    if (action === ButtonActions.restart) {
      restart();
    }

    if (action === ButtonActions.review) {
      setState(OrderDetailWidgetState.review);
    }

    if (action === ButtonActions.cancel) {
      history.push({ pathname: `/order/${params.compressedOrder}/cancel` });
    }
  };

  if (ordersStatus === "signing") {
    return (
      <Container>
        <WalletSignScreen />
      </Container>
    );
  }

  if (state === OrderDetailWidgetState.review && shouldDepositNativeToken) {
    return (
      <Container>
        <WrapReview
          isLoading={hasDepositPending}
          amount={senderAmount || "0"}
          errors={errors}
          shouldDepositNativeTokenAmount={shouldDepositNativeTokenAmount}
          wrappedNativeToken={wrappedNativeToken}
          onRestartButtonClick={backToOverview}
          onSignButtonClick={depositNativeToken}
        />
      </Container>
    );
  }

  if (state === OrderDetailWidgetState.review && !hasSufficientAllowance) {
    return (
      <Container>
        <ApproveReview
          isLoading={hasApprovalPending}
          amount={senderAmount || "0"}
          errors={errors}
          readableAllowance={"0"}
          token={senderToken}
          wrappedNativeToken={wrappedNativeToken}
          onRestartButtonClick={backToOverview}
          onSignButtonClick={approveToken}
        />
      </Container>
    );
  }

  if (state === OrderDetailWidgetState.review && !orderTransaction) {
    return (
      <Container>
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
      </Container>
    );
  }

  if (orderTransaction) {
    return (
      <OrderSubmittedScreen
        chainId={chainId}
        transaction={orderTransaction}
        onMakeNewOrderButtonClick={restart}
      />
    );
  }

  return (
    <Container>
      <OrderDetailWidgetHeader
        isMakerOfSwap={userIsMakerOfSwap}
        isOrderStatusLoading={isOrderStatusLoading}
        expiry={parsedExpiry}
        orderStatus={orderStatus}
        orderType={orderType}
        recipientAddress={order.senderWallet}
        transactionLink={orderTransactionLink}
        userAddress={account || undefined}
      />
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
      <StyledInfoButtons
        isMakerOfSwap={userIsMakerOfSwap}
        showViewAllQuotes={isFromAvailableOrdersWidget && !userIsMakerOfSwap}
        token1={signerTokenSymbol}
        token2={senderTokenSymbol}
        rate={tokenExchangeRate}
        onViewAllQuotesButtonClick={toggleShowViewAllQuotes}
        onFeeButtonClick={toggleShowFeeInfo}
      />
      <StyledInfoSection
        isExpired={orderStatus === OrderStatus.expired}
        isDifferentChainId={walletChainIdIsDifferentThanOrderChainId}
        isIntendedRecipient={userIsIntendedRecipient}
        isMakerOfSwap={userIsMakerOfSwap}
        isNotConnected={!active}
        orderChainId={orderChainId}
      />
      <StyledActionButtons
        hasInsufficientBalance={hasInsufficientTokenBalance}
        hasInsufficientAllowance={!hasSufficientAllowance}
        isExpired={orderStatus === OrderStatus.expired}
        isCanceled={orderStatus === OrderStatus.canceled}
        isTaken={orderStatus === OrderStatus.taken}
        isDifferentChainId={walletChainIdIsDifferentThanOrderChainId}
        isIntendedRecipient={userIsIntendedRecipient}
        isMakerOfSwap={userIsMakerOfSwap}
        isNotConnected={!active}
        isNetworkUnsupported={
          !!web3Error && web3Error instanceof UnsupportedChainIdError
        }
        shouldDepositNativeToken={shouldDepositNativeToken}
        senderTokenSymbol={senderTokenSymbol}
        onBackButtonClick={handleBackButtonClick}
        onActionButtonClick={handleActionButtonClick}
      />
      <Overlay
        title={t("information.protocolFee.title")}
        onCloseButtonClick={() => toggleShowFeeInfo()}
        isHidden={!showFeeInfo}
      >
        <ProtocolFeeModal onCloseButtonClick={() => toggleShowFeeInfo()} />
      </Overlay>
      <Overlay
        title={t("validatorErrors.unableSwap")}
        subTitle={t("validatorErrors.swapFail")}
        onCloseButtonClick={restart}
        isHidden={!errors.length}
      >
        <ErrorList errors={errors} onBackButtonClick={restart} />
      </Overlay>
      {signerToken && senderToken && (
        <Overlay
          title={t("orders.availableOrders")}
          isHidden={!showViewAllQuotes}
          onCloseButtonClick={() => toggleShowViewAllQuotes()}
        >
          <AvailableOrdersWidget
            senderToken={senderToken}
            signerToken={signerToken}
            onSwapLinkClick={backToSwapPage}
            onFullOrderLinkClick={toggleShowViewAllQuotes}
          />
        </Overlay>
      )}
    </Container>
  );
};

export default OrderDetailWidget;
