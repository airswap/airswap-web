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
import { ethers } from "ethers";

import { nativeCurrencyAddress } from "../../constants/nativeCurrency";
import { InterfaceContext } from "../../contexts/interface/Interface";
import stringToSignificantDecimals from "../../helpers/stringToSignificantDecimals";
import switchToEthereumChain from "../../helpers/switchToEthereumChain";
import useInsufficientBalance from "../../hooks/useInsufficientBalance";
import useTokenInfo from "../../hooks/useTokenInfo";
import { OrderStatus } from "../../types/orderStatus";
import { OrderType } from "../../types/orderTypes";
import FeeModal from "../InformationModals/subcomponents/FeeModal/FeeModal";
import { ButtonActions } from "../MakeWidget/subcomponents/ActionButtons/ActionButtons";
import Overlay from "../Overlay/Overlay";
import SwapInputs from "../SwapInputs/SwapInputs";
import { Container, StyledInfoButtons } from "./OrderDetailWidget.styles";
import ActionButtons from "./subcomponents/ActionButtons/ActionButtons";
import OrderDetailWidgetHeader from "./subcomponents/OrderDetailWidgetHeader/OrderDetailWidgetHeader";

interface OrderDetailWidgetProps {
  status: "idle" | "not-found" | "open" | "taken" | "canceled";
  order: FullOrder;
}

const OrderDetailWidget: FC<OrderDetailWidgetProps> = ({ status, order }) => {
  const { t } = useTranslation();
  const history = useHistory();
  const { setShowWalletList } = useContext(InterfaceContext);
  const { active, account, error: web3Error } = useWeb3React<Web3Provider>();
  const [showFeeInfo, toggleShowFeeInfo] = useToggle(false);
  const senderToken = useTokenInfo(order.senderToken);
  const signerToken = useTokenInfo(order.signerToken);
  const hasInsufficientTokenBalance = useInsufficientBalance(
    signerToken,
    ethers.utils.formatUnits(order.signerAmount, signerToken?.decimals!)
  );

  const orderStatus = () => {
    switch (status) {
      case "taken":
        return OrderStatus.taken;
      case "canceled":
        return OrderStatus.canceled;
      default:
        return OrderStatus.open;
    }
  };

  const orderType =
    order.signerWallet === nativeCurrencyAddress
      ? OrderType.publicUnlisted
      : OrderType.private;
  const tokenInfoLoading = !senderToken || !signerToken;
  const isMakerOfSwap = order.senderWallet === account;
  const isIntendedRecipient =
    order.signerWallet === account ||
    order.signerWallet === nativeCurrencyAddress;
  const swapsDisabled =
    tokenInfoLoading || (!isMakerOfSwap && !isIntendedRecipient);

  const rate = useMemo(() => {
    return new BigNumber(order.senderAmount).dividedBy(order.signerAmount);
  }, [order]);

  const baseAmount = useMemo(() => {
    const formattedAmount = tokenInfoLoading
      ? "0.00"
      : ethers.utils.formatUnits(order.signerAmount, signerToken?.decimals!);

    return stringToSignificantDecimals(formattedAmount);
  }, [tokenInfoLoading]);

  const quoteAmount = useMemo(() => {
    const formattedAmount = tokenInfoLoading
      ? "0.00"
      : ethers.utils.formatUnits(order.senderAmount, senderToken?.decimals!);

    return stringToSignificantDecimals(formattedAmount);
  }, [tokenInfoLoading]);

  const parsedExpiry = useMemo(() => {
    return new Date(Number(order.expiry) * 1000);
  }, [order]);

  // button handlers
  const handleBackButtonClick = () => {
    history.goBack();
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

      case ButtonActions.sign:
        break;
    }
  };

  return (
    <Container>
      <OrderDetailWidgetHeader
        expiry={parsedExpiry}
        orderStatus={orderStatus()}
        orderType={orderType}
        recipientAddress={order.signerWallet}
        userAddress={account || undefined}
      />
      <SwapInputs
        readOnly
        disabled={swapsDisabled}
        baseAmount={baseAmount}
        baseTokenInfo={signerToken}
        maxAmount={null}
        side={isMakerOfSwap ? "sell" : "buy"}
        quoteAmount={quoteAmount}
        quoteTokenInfo={senderToken}
        onBaseAmountChange={() => {}}
        onChangeTokenClick={() => {}}
        onMaxButtonClick={() => {}}
      />
      {!tokenInfoLoading && (
        <StyledInfoButtons
          ownerIsCurrentUser={active}
          onFeeButtonClick={toggleShowFeeInfo}
          onCopyButtonClick={handleCopyButtonClick}
          token1={signerToken?.symbol!}
          token2={senderToken?.symbol!}
          rate={rate}
        />
      )}
      <ActionButtons
        isExpired={compareAsc(new Date(), parsedExpiry) === 1}
        isMakerOfSwap={isMakerOfSwap}
        isIntendedRecipient={isIntendedRecipient}
        hasInsufficientBalance={hasInsufficientTokenBalance}
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
