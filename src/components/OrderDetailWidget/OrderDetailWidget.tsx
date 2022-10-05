import React, { FC, useContext, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { matchPath, useHistory, useParams } from "react-router-dom";

import { Swap } from "@airswap/libraries";
import { FullOrder } from "@airswap/typescript";
import { Web3Provider } from "@ethersproject/providers";
import { useToggle } from "@react-hookz/web";
import { UnsupportedChainIdError, useWeb3React } from "@web3-react/core";

import { BigNumber } from "bignumber.js";
import compareAsc from "date-fns/compareAsc";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { ErrorType, SwapError } from "../../constants/errors";
import { nativeCurrencyAddress } from "../../constants/nativeCurrency";
import { InterfaceContext } from "../../contexts/interface/Interface";
import {
  approve,
  clear,
  selectOrdersErrors,
  selectOrdersStatus,
  take,
} from "../../features/orders/ordersSlice";
import { selectTakeOtcReducer } from "../../features/takeOtc/takeOtcSlice";
import switchToEthereumChain from "../../helpers/switchToEthereumChain";
import useApprovalPending from "../../hooks/useApprovalPending";
import useInsufficientBalance from "../../hooks/useInsufficientBalance";
import useSufficientAllowance from "../../hooks/useSufficientAllowance";
import useTakingOrderPending from "../../hooks/useTakingOrderPending";
import { AppRoutes } from "../../routes";
import { OrderStatus } from "../../types/orderStatus";
import { OrderType } from "../../types/orderTypes";
import FeeModal from "../InformationModals/subcomponents/FeeModal/FeeModal";
import { OrderErrorList } from "../OrderErrorList/OrderErrorList";
import Overlay from "../Overlay/Overlay";
import SwapInputs from "../SwapInputs/SwapInputs";
import { notifyError } from "../Toasts/ToastController";
import { Container, StyledInfoButtons } from "./OrderDetailWidget.styles";
import useFormattedTokenAmount from "./hooks/useFormattedTokenAmount";
import { useOrderStatus } from "./hooks/useOrderStatus";
import useTakerTokenInfo from "./hooks/useTakerTokenInfo";
import ActionButtons, {
  ButtonActions,
} from "./subcomponents/ActionButtons/ActionButtons";
import OrderDetailWidgetHeader from "./subcomponents/OrderDetailWidgetHeader/OrderDetailWidgetHeader";

interface OrderDetailWidgetProps {
  account: string;
  library: Web3Provider;
  order: FullOrder;
}

const OrderDetailWidget: FC<OrderDetailWidgetProps> = ({
  account,
  library,
  order,
}) => {
  const { t } = useTranslation();
  const history = useHistory();
  const dispatch = useAppDispatch();
  const params = useParams<{ compressedOrder: string }>();
  const { setShowWalletList } = useContext(InterfaceContext);
  const { active, chainId, error: web3Error } = useWeb3React<Web3Provider>();
  const { status: otcStatus } = useAppSelector(selectTakeOtcReducer);
  const ordersStatus = useAppSelector(selectOrdersStatus);
  const ordersErrors = useAppSelector(selectOrdersErrors);
  const [showFeeInfo, toggleShowFeeInfo] = useToggle(false);
  const orderStatus = useOrderStatus(order, chainId, library);
  const senderToken = useTakerTokenInfo(order.senderToken);
  const signerToken = useTakerTokenInfo(order.signerToken);
  const senderAmount = useFormattedTokenAmount(
    order.senderAmount,
    senderToken?.decimals
  );
  const signerAmount = useFormattedTokenAmount(
    order.signerAmount,
    signerToken?.decimals
  );
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
  const orderChainId = useMemo(() => parseInt(order.chainId), [order]);
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
  const orderIsExpired = useMemo(() => {
    return compareAsc(new Date(), parsedExpiry) === 1;
  }, [parsedExpiry]);

  const [validatorErrors, setValidatorErrors] = useState<ErrorType[]>([]);

  useEffect(() => {
    if (ordersErrors.some((error) => error === "userRejectedRequest")) {
      notifyError({
        heading: t("orders.swapFailed"),
        cta: t("orders.swapRejectedByUser"),
      });
    }

    setValidatorErrors(
      ordersErrors.filter((error) => error !== "userRejectedRequest")
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ordersErrors]);

  // button handlers
  const handleBackButtonClick = () => {
    if (orderType === OrderType.private) {
      !userIsIntendedRecipient
        ? history.push({ pathname: AppRoutes.make })
        : history.push({ pathname: `/` });
    } else {
      history.goBack();
    }
  };

  const handleCopyButtonClick = () => {
    navigator.clipboard.writeText(window.location.toString());
  };

  const takeOrder = async () => {
    const errors = (await new Swap(chainId, library.getSigner()).check(
      order,
      order.senderWallet,
      library.getSigner()
    )) as SwapError[];

    // TODO: Skipping when senderWallet is 0x00 for now. Check function needs to be updated first.
    if (errors.length && order.senderWallet !== nativeCurrencyAddress) {
      setValidatorErrors(errors);
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
        setValidatorErrors([]);
        dispatch(clear());
        break;

      case ButtonActions.sign:
        takeOrder();
        break;

      case ButtonActions.approve:
        approveToken();
        break;

      case ButtonActions.cancel:
        // Cancel here
        break;

      default:
        break;
    }
  };

  console.log(getOrderStatus(status));

  return (
    <Container>
      <OrderDetailWidgetHeader
        expiry={parsedExpiry}
        orderStatus={getOrderStatus(otcStatus)}
        orderType={orderType}
        recipientAddress={order.senderWallet}
        userAddress={account || undefined}
      />
      <SwapInputs
        readOnly
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
        isExpired={orderIsExpired}
        isDifferentChainId={walletChainIdIsDifferentThanOrderChainId}
        isIntendedRecipient={userIsIntendedRecipient}
        isMakerOfSwap={userIsMakerOfSwap}
        isNotConnected={!active}
        orderChainId={orderChainId}
        token1={signerToken?.symbol}
        token2={senderToken?.symbol}
        rate={tokenExchangeRate}
        onFeeButtonClick={toggleShowFeeInfo}
        onCopyButtonClick={handleCopyButtonClick}
      />
      <ActionButtons
        isExpired={orderIsExpired}
        isTaken={orderStatus === OrderStatus.taken}
        isDifferentChainId={walletChainIdIsDifferentThanOrderChainId}
        isIntendedRecipient={userIsIntendedRecipient}
        isLoading={
          ["taking"].includes(ordersStatus) ||
          hasApprovalPending ||
          hasTakingOrderPending
        }
        isMakerOfSwap={userIsMakerOfSwap}
        hasInsufficientBalance={hasInsufficientTokenBalance}
        hasInsufficientAllowance={hasInsufficientAllowance}
        orderType={orderType}
        isNotConnected={!active}
        networkIsUnsupported={
          !!web3Error && web3Error instanceof UnsupportedChainIdError
        }
        senderTokenSymbol={senderToken?.symbol}
        onBackButtonClick={handleBackButtonClick}
        onActionButtonClick={handleActionButtonClick}
      />
      <Overlay
        title={t("common.fee")}
        onCloseButtonClick={() => toggleShowFeeInfo()}
        isHidden={!showFeeInfo}
      >
        <FeeModal onCloseButtonClick={() => toggleShowFeeInfo()} />
      </Overlay>
      <Overlay
        title={t("validatorErrors.unableSwap")}
        subTitle={t("validatorErrors.swapFail")}
        onCloseButtonClick={() =>
          handleActionButtonClick(ButtonActions.restart)
        }
        isHidden={!validatorErrors.length}
      >
        <OrderErrorList
          errors={validatorErrors}
          handleClick={() => handleActionButtonClick(ButtonActions.restart)}
        />
      </Overlay>
    </Container>
  );
};

export default OrderDetailWidget;
