import React, { FC } from "react";
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

  const tokenInfoLoading = !senderToken || !signerToken;
  const isMakerOfSwap = order.senderWallet === account;
  const isIntendedRecipient =
    order.signerWallet === (account || nativeCurrencyAddress);

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
        orderStatus={OrderStatus.open}
        orderType={
          order.signerWallet === nativeCurrencyAddress
            ? OrderType.publicUnlisted
            : OrderType.private
        }
        recipientAddress={order.signerWallet}
        // bad request as a dummy link, what is the best way to compute the hash?
        transactionLink={getEtherscanURL(
          Number(order.chainId),
          `${
            hashOrder({
              nonce: order.nonce,
              expiry: order.expiry,
              signerWallet: order.signerWallet,
              signerToken: order.signerToken,
              signerAmount: order.signerAmount,
              senderToken: order.senderToken,
              senderAmount: order.senderAmount,
              senderWallet: order.senderWallet,
              protocolFee: order.protocolFee,
            })[0]
          }`
        )}
        userAddress={account || undefined}
      />
      <SwapInputs
        readOnly
        disabled={tokenInfoLoading}
        baseAmount={
          tokenInfoLoading
            ? "0.0"
            : ethers.utils.formatUnits(
                order.signerAmount,
                senderToken?.decimals!
              )
        }
        baseTokenInfo={signerToken}
        maxAmount={null}
        side={isMakerOfSwap ? "sell" : "buy"}
        quoteAmount={
          tokenInfoLoading
            ? "0.0"
            : ethers.utils.formatUnits(
                order.senderAmount,
                senderToken?.decimals!
              )
        }
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
          rate={new BigNumber(order.signerAmount).dividedBy(order.senderAmount)}
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
