import React, { FC, useMemo, useContext } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

import { FullOrder } from "@airswap/typescript";
import { Web3Provider } from "@ethersproject/providers";
import { useToggle } from "@react-hookz/web";
import { useWeb3React } from "@web3-react/core";
import { UnsupportedChainIdError } from "@web3-react/core";

import { BigNumber } from "bignumber.js";
import compareAsc from "date-fns/compareAsc";

import { useAppDispatch } from "../../app/hooks";
import { nativeCurrencyAddress } from "../../constants/nativeCurrency";
import { InterfaceContext } from "../../contexts/interface/Interface";
import { takeOtcOrder } from "../../features/takeOtc/takeOtcActions";
import switchToEthereumChain from "../../helpers/switchToEthereumChain";
import useInsufficientBalance from "../../hooks/useInsufficientBalance";
import { AppRoutes } from "../../routes";
import { OrderStatus } from "../../types/orderStatus";
import { OrderType } from "../../types/orderTypes";
import FeeModal from "../InformationModals/subcomponents/FeeModal/FeeModal";
import { ButtonActions } from "../MakeWidget/subcomponents/ActionButtons/ActionButtons";
import Overlay from "../Overlay/Overlay";
import SwapInputs from "../SwapInputs/SwapInputs";
import { Container, StyledInfoButtons } from "./OrderDetailWidget.styles";
import useFormattedTokenAmount from "./hooks/useFormattedTokenAmount";
import { useOrderStatus } from "./hooks/useOrderStatus";
import useTakerTokenInfo from "./hooks/useTakerTokenInfo";
import ActionButtons from "./subcomponents/ActionButtons/ActionButtons";
import OrderDetailWidgetHeader from "./subcomponents/OrderDetailWidgetHeader/OrderDetailWidgetHeader";

interface OrderDetailWidgetProps {
  order: FullOrder;
}

const OrderDetailWidget: FC<OrderDetailWidgetProps> = ({ order }) => {
  const { t } = useTranslation();
  const history = useHistory();
  const dispatch = useAppDispatch();
  const { setShowWalletList } = useContext(InterfaceContext);
  const {
    active,
    account,
    chainId,
    library,
    error: web3Error,
  } = useWeb3React<Web3Provider>();
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

  const handleSignButtonClick = async (action: ButtonActions) => {
    switch (action) {
      case ButtonActions.connectWallet:
        setShowWalletList(true);
        break;

      case ButtonActions.switchNetwork:
        switchToEthereumChain();
        break;

      case ButtonActions.restart:
        history.push({ pathname: `/${AppRoutes.make}` });
        break;

      case ButtonActions.sign:
        await dispatch(
          takeOtcOrder({
            chainId: chainId!,
            order: order,
            library: library!,
          })
        );
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
        isMakerOfSwap={userIsMakerOfSwap}
        isIntendedRecipient={userIsIntendedRecipient}
        hasInsufficientBalance={hasInsufficientTokenBalance}
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
