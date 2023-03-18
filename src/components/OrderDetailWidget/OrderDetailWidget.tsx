import React, { FC, useContext, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useParams } from "react-router-dom";

import { FullOrderERC20 } from "@airswap/types";
import { Web3Provider } from "@ethersproject/providers";
import { useToggle } from "@react-hookz/web";
import { UnsupportedChainIdError, useWeb3React } from "@web3-react/core";

import { BigNumber } from "bignumber.js";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { nativeCurrencyAddress } from "../../constants/nativeCurrency";
import { InterfaceContext } from "../../contexts/interface/Interface";
import { selectMyOrdersReducer } from "../../features/myOrders/myOrdersSlice";
import { check } from "../../features/orders/orderApi";
import {
  approve,
  clear,
  selectOrdersErrors,
  selectOrdersStatus,
  take,
} from "../../features/orders/ordersSlice";
import {
  reset,
  selectTakeOtcErrors,
  setErrors,
} from "../../features/takeOtc/takeOtcSlice";
import switchToEthereumChain from "../../helpers/switchToEthereumChain";
import writeTextToClipboard from "../../helpers/writeTextToClipboard";
import useApprovalPending from "../../hooks/useApprovalPending";
import useInsufficientBalance from "../../hooks/useInsufficientBalance";
import useOrderTransactionLink from "../../hooks/useOrderTransactionLink";
import useSufficientAllowance from "../../hooks/useSufficientAllowance";
import useTakingOrderPending from "../../hooks/useTakingOrderPending";
import { AppRoutes } from "../../routes";
import { OrderStatus } from "../../types/orderStatus";
import { OrderType } from "../../types/orderTypes";
import { ErrorList } from "../ErrorList/ErrorList";
import ProtocolFeeModal from "../InformationModals/subcomponents/ProtocolFeeModal/ProtocolFeeModal";
import Overlay from "../Overlay/Overlay";
import SwapInputs from "../SwapInputs/SwapInputs";
import { notifyCopySuccess, notifyError } from "../Toasts/ToastController";
import { Container, StyledInfoButtons } from "./OrderDetailWidget.styles";
import useFormattedTokenAmount from "./hooks/useFormattedTokenAmount";
import { useOrderStatus } from "./hooks/useOrderStatus";
import useTakerTokenInfo from "./hooks/useTakerTokenInfo";
import ActionButtons, {
  ButtonActions,
} from "./subcomponents/ActionButtons/ActionButtons";
import OrderDetailWidgetHeader from "./subcomponents/OrderDetailWidgetHeader/OrderDetailWidgetHeader";

interface OrderDetailWidgetProps {
  order: FullOrderERC20;
}

const OrderDetailWidget: FC<OrderDetailWidgetProps> = ({ order }) => {
  const { t } = useTranslation();
  const { account, library } = useWeb3React<Web3Provider>();
  const history = useHistory();
  const dispatch = useAppDispatch();
  const params = useParams<{ compressedOrder: string }>();
  const { setShowWalletList } = useContext(InterfaceContext);
  const { active, chainId, error: web3Error } = useWeb3React<Web3Provider>();
  const ordersStatus = useAppSelector(selectOrdersStatus);
  const ordersErrors = useAppSelector(selectOrdersErrors);
  const takeOtcErrors = useAppSelector(selectTakeOtcErrors);
  const { userOrders } = useAppSelector(selectMyOrdersReducer);
  const errors = [...ordersErrors, ...takeOtcErrors];

  const orderStatus = useOrderStatus(order);
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
  const hasTakingOrderPending = useTakingOrderPending(order.nonce);
  const hasInsufficientAllowance = !useSufficientAllowance(
    senderToken,
    senderAmount
  );

  const hasInsufficientTokenBalance = useInsufficientBalance(
    senderToken,
    senderAmount!
  );
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

  // button handlers
  const handleBackButtonClick = () => {
    history.push({
      pathname: `/${userOrders.length ? AppRoutes.myOrders : AppRoutes.make}`,
    });
  };

  const handleCopyButtonClick = async () => {
    const copy = await writeTextToClipboard(window.location.toString());
    copy
      ? notifyCopySuccess()
      : notifyError({ heading: t("toast.copyFailed"), cta: "" });
  };

  const takeOrder = async () => {
    const errors = await check(
      order,
      order.senderWallet,
      order.chainId,
      library!.getSigner()
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
    dispatch(
      approve({
        token: senderToken?.address!,
        library,
        contractType: "Swap",
        chainId: chainId!,
      })
    );
  };

  const handleActionButtonClick = async (action: ButtonActions) => {
    switch (action) {
      case ButtonActions.connectWallet:
        setShowWalletList(true);
        break;

      case ButtonActions.switchNetwork:
        switchToEthereumChain();
        break;

      case ButtonActions.restart:
        dispatch(clear());
        dispatch(reset());
        history.push({ pathname: `/${AppRoutes.make}` });
        break;

      case ButtonActions.sign:
        takeOrder();
        break;

      case ButtonActions.approve:
        approveToken();
        break;

      case ButtonActions.cancel:
        history.push({ pathname: `/order/${params.compressedOrder}/cancel` });
        break;

      default:
        break;
    }
  };

  return (
    <Container>
      <OrderDetailWidgetHeader
        expiry={parsedExpiry}
        orderStatus={orderStatus}
        orderType={orderType}
        recipientAddress={order.senderWallet}
        transactionLink={orderTransactionLink}
        userAddress={account || undefined}
      />
      <SwapInputs
        readOnly
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
        isExpired={orderStatus === OrderStatus.expired}
        isDifferentChainId={walletChainIdIsDifferentThanOrderChainId}
        isIntendedRecipient={userIsIntendedRecipient}
        isMakerOfSwap={userIsMakerOfSwap}
        isNotConnected={!active}
        orderChainId={orderChainId}
        token1={signerTokenSymbol}
        token2={senderTokenSymbol}
        rate={tokenExchangeRate}
        onFeeButtonClick={toggleShowFeeInfo}
        onCopyButtonClick={handleCopyButtonClick}
      />
      <ActionButtons
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
          hasTakingOrderPending
        }
        isMakerOfSwap={userIsMakerOfSwap}
        isNotConnected={!active}
        orderType={orderType}
        networkIsUnsupported={
          !!web3Error && web3Error instanceof UnsupportedChainIdError
        }
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
    </Container>
  );
};

export default OrderDetailWidget;
