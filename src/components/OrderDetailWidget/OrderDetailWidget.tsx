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

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { nativeCurrencyAddress } from "../../constants/nativeCurrency";
import { InterfaceContext } from "../../contexts/interface/Interface";
import { takeOtcOrder } from "../../features/takeOtc/takeOtcActions";
import { selectTakeOtcReducer } from "../../features/takeOtc/takeOtcSlice";
import stringToSignificantDecimals from "../../helpers/stringToSignificantDecimals";
import switchToEthereumChain from "../../helpers/switchToEthereumChain";
import useInsufficientBalance from "../../hooks/useInsufficientBalance";
import useTokenInfo from "../../hooks/useTokenInfo";
import { OrderType } from "../../types/orderTypes";
import FeeModal from "../InformationModals/subcomponents/FeeModal/FeeModal";
import { ButtonActions } from "../MakeWidget/subcomponents/ActionButtons/ActionButtons";
import Overlay from "../Overlay/Overlay";
import SwapInputs from "../SwapInputs/SwapInputs";
import { Container, StyledInfoButtons } from "./OrderDetailWidget.styles";
import { getOrderStatus } from "./helpers/index";
import useFormattedTokenAmount from "./hooks/useFormattedTokenAmount";
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
  const { status } = useAppSelector(selectTakeOtcReducer);
  const [showFeeInfo, toggleShowFeeInfo] = useToggle(false);
  const senderToken = useTokenInfo(order.senderToken);
  const signerToken = useTokenInfo(order.signerToken);
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

  const orderType =
    order.senderWallet === nativeCurrencyAddress
      ? OrderType.publicUnlisted
      : OrderType.private;
  const tokenInfoLoading = !senderToken || !signerToken;
  const userIsMakerOfSwap = order.signerWallet === account;
  const userIsIntendedRecipient =
    order.senderWallet === account ||
    order.senderWallet === nativeCurrencyAddress;
  const swapsDisabled = tokenInfoLoading || !active;

  const baseAmount = useMemo(() => {
    const formattedAmount = tokenInfoLoading ? "0.00" : signerAmount!;

    return stringToSignificantDecimals(formattedAmount);
  }, [tokenInfoLoading, signerAmount]);

  const quoteAmount = useMemo(() => {
    const formattedAmount = tokenInfoLoading ? "0.00" : senderAmount!;

    return stringToSignificantDecimals(formattedAmount);
  }, [tokenInfoLoading, senderAmount]);

  const parsedExpiry = useMemo(() => {
    return new Date(Number(order.expiry) * 1000);
  }, [order]);

  // button handlers
  const handleBackButtonClick = () => {
    if (orderType === OrderType.private) {
      !userIsIntendedRecipient
        ? history.push({ pathname: `/make` })
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
        history.push({ pathname: `/make` });
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
        orderStatus={getOrderStatus(status)}
        orderType={orderType}
        recipientAddress={order.senderWallet}
        userAddress={account || undefined}
      />
      <SwapInputs
        readOnly
        disabled={swapsDisabled}
        baseAmount={baseAmount}
        baseTokenInfo={signerToken}
        maxAmount={null}
        side={userIsMakerOfSwap ? "sell" : "buy"}
        quoteAmount={quoteAmount}
        quoteTokenInfo={senderToken}
        onBaseAmountChange={() => {}}
        onChangeTokenClick={() => {}}
        onMaxButtonClick={() => {}}
      />
      {!tokenInfoLoading && (
        <StyledInfoButtons
          ownerIsCurrentUser={userIsMakerOfSwap}
          isIntendedRecipient={userIsIntendedRecipient}
          isExpired={compareAsc(new Date(), parsedExpiry) === 1}
          onFeeButtonClick={toggleShowFeeInfo}
          onCopyButtonClick={handleCopyButtonClick}
          token1={signerToken?.symbol!}
          token2={senderToken?.symbol!}
          rate={tokenExchangeRate}
        />
      )}
      <ActionButtons
        isExpired={compareAsc(new Date(), parsedExpiry) === 1}
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
