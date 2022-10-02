import React, { FC, useContext, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

import { Swap } from "@airswap/libraries";
import { FullOrder } from "@airswap/typescript";
import { Web3Provider } from "@ethersproject/providers";
import { useToggle } from "@react-hookz/web";
import { UnsupportedChainIdError, useWeb3React } from "@web3-react/core";

import { BigNumber } from "bignumber.js";
import compareAsc from "date-fns/compareAsc";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { SwapError } from "../../constants/errors";
import { nativeCurrencyAddress } from "../../constants/nativeCurrency";
import { InterfaceContext } from "../../contexts/interface/Interface";
import {
  approve,
  selectOrdersStatus,
  take,
} from "../../features/orders/ordersSlice";
import { selectTakeOtcReducer } from "../../features/takeOtc/takeOtcSlice";
import switchToEthereumChain from "../../helpers/switchToEthereumChain";
import useInsufficientBalance from "../../hooks/useInsufficientBalance";
import useSufficientAllowance from "../../hooks/useSufficientAllowance";
import useSwapType from "../../hooks/useSwapType";
import { AppRoutes } from "../../routes";
import { OrderType } from "../../types/orderTypes";
import FeeModal from "../InformationModals/subcomponents/FeeModal/FeeModal";
import Overlay from "../Overlay/Overlay";
import SwapInputs from "../SwapInputs/SwapInputs";
import { Container, StyledInfoButtons } from "./OrderDetailWidget.styles";
import { getOrderStatus } from "./helpers";
import useFormattedTokenAmount from "./hooks/useFormattedTokenAmount";
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
  const { setShowWalletList } = useContext(InterfaceContext);
  const { active, chainId, error: web3Error } = useWeb3React<Web3Provider>();
  const { status: otcStatus } = useAppSelector(selectTakeOtcReducer);
  const ordersStatus = useAppSelector(selectOrdersStatus);
  const [showFeeInfo, toggleShowFeeInfo] = useToggle(false);
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
  const swapType = useSwapType(senderToken, signerToken);
  const hasInsufficientAllowance = useSufficientAllowance(
    senderToken,
    swapType,
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

  const handleCancelButtonClick = () => {};

  const handleCopyButtonClick = () => {
    navigator.clipboard.writeText(window.location.toString());
  };

  const takeOrder = async () => {
    const errors = (await new Swap(chainId, library.getSigner()).check(
      order,
      order.senderWallet,
      library.getSigner()
    )) as SwapError[];

    if (errors.length) {
      // TODO: Inform user here
      console.error(errors);
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

  const approveOrder = async () => {
    dispatch(
      approve({
        token: senderToken?.address!,
        library,
        contractType: swapType === "swapWithWrap" ? "Wrapper" : "Swap",
        chainId: chainId!,
      })
    );
  };

  const handleSignButtonClick = async (action: ButtonActions) => {
    console.log(action);
    switch (action) {
      case ButtonActions.connectWallet:
        setShowWalletList(true);
        break;

      case ButtonActions.switchNetwork:
        switchToEthereumChain();
        break;

      case ButtonActions.restart:
        history.push({ pathname: AppRoutes.make });
        break;

      case ButtonActions.sign:
        takeOrder();
        break;

      case ButtonActions.approve:
        approveOrder();
        break;

      default:
        break;
    }
  };

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
        isDifferentChainId={walletChainIdIsDifferentThanOrderChainId}
        isIntendedRecipient={userIsIntendedRecipient}
        isLoading={["approving", "taking"].includes(ordersStatus)}
        isMakerOfSwap={userIsMakerOfSwap}
        hasInsufficientBalance={hasInsufficientTokenBalance}
        hasInsufficientAllowance={hasInsufficientAllowance}
        orderType={orderType}
        isNotConnected={!active}
        networkIsUnsupported={
          !!web3Error && web3Error instanceof UnsupportedChainIdError
        }
        onCancelButtonClick={handleCancelButtonClick}
        onBackButtonClick={handleBackButtonClick}
        onSignButtonClick={handleSignButtonClick}
      />
      <Overlay
        title={t("common.fee")}
        onCloseButtonClick={() => toggleShowFeeInfo()}
        isHidden={!showFeeInfo}
      >
        <FeeModal onCloseButtonClick={() => toggleShowFeeInfo()} />
      </Overlay>
    </Container>
  );
};

export default OrderDetailWidget;
