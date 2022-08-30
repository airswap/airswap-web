import React, { FC, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

import { getEtherscanURL, hashOrder } from "@airswap/utils";
import { Web3Provider } from "@ethersproject/providers";
import { useToggle } from "@react-hookz/web";
import { useWeb3React } from "@web3-react/core";

import { BigNumber } from "bignumber.js";
import { ethers } from "ethers";

import { nativeCurrencyAddress } from "../../constants/nativeCurrency";
import useInsufficientBalance from "../../hooks/useInsufficientBalance";
import useTokenInfo from "../../hooks/useTokenInfo";
import { OrderStatus } from "../../types/orderStatus";
import { OrderType } from "../../types/orderTypes";
import FeeModal from "../InformationModals/subcomponents/FeeModal/FeeModal";
import Overlay from "../Overlay/Overlay";
import SwapInputs from "../SwapInputs/SwapInputs";
import { Container, StyledInfoButtons } from "./OrderDetailWidget.styles";
import useDecompressOrderFromURL from "./hooks/useDecompressOrderFromURL";
import { useGetTxHash } from "./hooks/useGetTxHash";
import ActionButtons from "./subcomponents/ActionButtons/ActionButtons";
import OrderDetailWidgetHeader from "./subcomponents/OrderDetailWidgetHeader/OrderDetailWidgetHeader";

const OrderDetailWidget: FC = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const { account } = useWeb3React<Web3Provider>();
  const [showFeeInfo, toggleShowFeeInfo] = useToggle(false);
  const order = useDecompressOrderFromURL();
  const senderToken = useTokenInfo(order.senderToken);
  const signerToken = useTokenInfo(order.signerToken);
  const hasInsufficientMakerTokenBalance = useInsufficientBalance(
    senderToken,
    order.senderAmount
  );
  const orderStatus = OrderStatus.open; // dummy
  const orderType =
    order.signerWallet === nativeCurrencyAddress
      ? OrderType.publicUnlisted
      : OrderType.private;
  const tokenInfoLoading = !senderToken || !signerToken;
  const isMakerOfSwap = order.senderWallet === account;
  const isIntendedRecipient =
    order.signerWallet === (account || nativeCurrencyAddress);

  const transactionLink = useMemo(() => {
    return getEtherscanURL(Number(order.chainId), txHash);
  }, [order.chainId, txHash]);

  const rate = useMemo(() => {
    return new BigNumber(
      isMakerOfSwap ? order.signerAmount : order.senderAmount
    ).dividedBy(isMakerOfSwap ? order.senderAmount : order.signerAmount);
  }, [isMakerOfSwap]);

  const baseAmount = useMemo(() => {
    return tokenInfoLoading
      ? "0.0"
      : ethers.utils.formatUnits(order.signerAmount, senderToken?.decimals!);
  }, [tokenInfoLoading]);

  const quoteAmount = useMemo(() => {
    return tokenInfoLoading
      ? "0.0"
      : ethers.utils.formatUnits(order.senderAmount, senderToken?.decimals!);
  }, [tokenInfoLoading]);

  const handleBackButtonClick = () => {
    history.goBack();
  };

  const handleCopyButtonClick = () => {
    navigator.clipboard.writeText(window.location.toString());
  };

  return (
    <Container>
      <OrderDetailWidgetHeader
        expiry={new Date(Number(order.expiry) * 1000)}
        orderStatus={orderStatus}
        orderType={orderType}
        recipientAddress={order.signerWallet}
        // bad request as a dummy link, what is the best way to compute the hash?
        transactionLink={transactionLink}
        userAddress={account || undefined}
      />
      <SwapInputs
        readOnly
        disabled={tokenInfoLoading || isIntendedRecipient}
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
          ownerIsCurrentUser
          onFeeButtonClick={toggleShowFeeInfo}
          onCopyButtonClick={handleCopyButtonClick}
          token1={senderToken?.symbol}
          token2={signerToken?.symbol}
          rate={rate}
        />
      )}
      <ActionButtons
        isMakerOfSwap={isMakerOfSwap}
        isIntendedRecipient={isIntendedRecipient}
        hasInsufficientBalance={hasInsufficientMakerTokenBalance}
        onBackButtonClick={handleBackButtonClick}
        onSignButtonClick={() => {}}
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
