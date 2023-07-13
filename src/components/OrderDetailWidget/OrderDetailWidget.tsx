import { FC, useContext, useMemo } from "react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useLocation, useParams } from "react-router-dom";

import { FullOrderERC20 } from "@airswap/types";
import { Web3Provider } from "@ethersproject/providers";
import { useToggle } from "@react-hookz/web";
import { unwrapResult } from "@reduxjs/toolkit";
import { UnsupportedChainIdError, useWeb3React } from "@web3-react/core";

import { BigNumber } from "bignumber.js";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { nativeCurrencyAddress } from "../../constants/nativeCurrency";
import { InterfaceContext } from "../../contexts/interface/Interface";
import { selectIndexerReducer } from "../../features/indexer/indexerSlice";
import {
  getFilteredOrders,
  fetchIndexerUrls,
} from "../../features/indexer/indexerSlice";
import { selectMyOrdersReducer } from "../../features/myOrders/myOrdersSlice";
import { check } from "../../features/orders/orderApi";
import {
  approve,
  clear,
  deposit,
  selectOrdersErrors,
  selectOrdersStatus,
  take,
} from "../../features/orders/ordersSlice";
import {
  reset,
  selectTakeOtcErrors,
  selectTakeOtcStatus,
  setErrors,
} from "../../features/takeOtc/takeOtcSlice";
import switchToDefaultChain from "../../helpers/switchToDefaultChain";
import useApprovalPending from "../../hooks/useApprovalPending";
import useDepositPending from "../../hooks/useDepositPending";
import useInsufficientBalance from "../../hooks/useInsufficientBalance";
import useOrderTransactionLink from "../../hooks/useOrderTransactionLink";
import useShouldDepositNativeToken from "../../hooks/useShouldDepositNativeTokenAmount";
import useSufficientAllowance from "../../hooks/useSufficientAllowance";
import { AppRoutes } from "../../routes";
import { OrderStatus } from "../../types/orderStatus";
import { OrderType } from "../../types/orderTypes";
import AvailableOrdersWidget from "../AvailableOrdersWidget/AvailableOrdersWidget";
import { ErrorList } from "../ErrorList/ErrorList";
import ProtocolFeeModal from "../InformationModals/subcomponents/ProtocolFeeModal/ProtocolFeeModal";
import Overlay from "../Overlay/Overlay";
import SwapInputs from "../SwapInputs/SwapInputs";
import WalletSignScreen from "../WalletSignScreen/WalletSignScreen";
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
import OrderSubmittedInfo from "./subcomponents/OrderSubmittedInfo/OrderSubmittedInfo";

interface OrderDetailWidgetProps {
  order: FullOrderERC20;
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
  const { indexerUrls, orders, bestSwapOrder } =
    useAppSelector(selectIndexerReducer);
  const errors = [...ordersErrors, ...takeOtcErrors];

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
  const orderTransaction = useSessionOrderTransaction(order.nonce);
  const hasInsufficientAllowance = !useSufficientAllowance(
    senderToken,
    senderAmount
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
    order.senderWallet === nativeCurrencyAddress
      ? OrderType.publicUnlisted
      : OrderType.private;
  const userIsMakerOfSwap = order.signerWallet === account;
  const userIsIntendedRecipient =
    order.senderWallet === account ||
    order.senderWallet === nativeCurrencyAddress;
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
            senderTokens: [senderToken.address],
            signerTokens: [signerToken.address],
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

  const handleActionButtonClick = async (action: ButtonActions) => {
    if (action === ButtonActions.connectWallet) {
      setShowWalletList(true);
    }

    if (action === ButtonActions.switchNetwork) {
      switchToDefaultChain();
    }

    if (action === ButtonActions.restart) {
      dispatch(clear());
      dispatch(reset());
      history.push({ pathname: `/${AppRoutes.make}` });
    }

    if (action === ButtonActions.sign) {
      takeOrder();
    }

    if (action === ButtonActions.approve) {
      approveToken();
    }

    if (action === ButtonActions.cancel) {
      history.push({ pathname: `/order/${params.compressedOrder}/cancel` });
    }

    if (action === ButtonActions.deposit) {
      depositNativeToken();
    }
  };

  if (ordersStatus === "signing") {
    return (
      <Container>
        <WalletSignScreen />
      </Container>
    );
  }

  return (
    <Container>
      {!orderTransaction ? (
        <>
          <OrderDetailWidgetHeader
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
            showViewAllQuotes={
              isFromAvailableOrdersWidget && !userIsMakerOfSwap
            }
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
            shouldDepositNativeTokenAmount={shouldDepositNativeTokenAmount}
          />
        </>
      ) : (
        <OrderSubmittedInfo chainId={chainId} transaction={orderTransaction} />
      )}
      <StyledActionButtons
        hasInsufficientBalance={hasInsufficientTokenBalance}
        hasInsufficientAllowance={hasInsufficientAllowance}
        isExpired={orderStatus === OrderStatus.expired}
        isCanceled={orderStatus === OrderStatus.canceled}
        isTaken={orderStatus === OrderStatus.taken}
        isDifferentChainId={walletChainIdIsDifferentThanOrderChainId}
        isIntendedRecipient={userIsIntendedRecipient}
        isLoading={
          ["taking"].includes(ordersStatus) ||
          hasApprovalPending ||
          hasDepositPending
        }
        isMakerOfSwap={userIsMakerOfSwap}
        isNotConnected={!active}
        isOrderSubmitted={!!orderTransaction}
        orderType={orderType}
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
        onCloseButtonClick={() =>
          handleActionButtonClick(ButtonActions.restart)
        }
        isHidden={!errors.length}
      >
        <ErrorList
          errors={errors}
          onBackButtonClick={() =>
            handleActionButtonClick(ButtonActions.restart)
          }
        />
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
