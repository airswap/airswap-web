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
import useDecompressOrderFromURL from "../../hooks/useDecompressOrderFromURL";
import useInsufficientBalance from "../../hooks/useInsufficientBalance";
import useTokenInfo from "../../hooks/useTokenInfo";
import { OrderStatus } from "../../types/orderStatus";
import { OrderType } from "../../types/orderTypes";
import FeeModal from "../InformationModals/subcomponents/FeeModal/FeeModal";
import Overlay from "../Overlay/Overlay";
import SwapInputs from "../SwapInputs/SwapInputs";
import { Container, StyledInfoButtons } from "./OrderDetailWidget.styles";
import ActionButtons from "./subcomponents/ActionButtons/ActionButtons";
import OrderDetailWidgetHeader from "./subcomponents/OrderDetailWidgetHeader/OrderDetailWidgetHeader";

const OrderDetailWidget: FC = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const { account } = useWeb3React<Web3Provider>();
  const [showFeeInfo, toggleShowFeeInfo] = useToggle(false);
  const params = new URLSearchParams(history.location.search);
  const order = useDecompressOrderFromURL(params.get("compressedOrder")!);
  const senderToken = useTokenInfo(order.senderToken);
  const signerToken = useTokenInfo(order.signerToken);
  const hasInsufficientMakerTokenBalance = useInsufficientBalance(
    senderToken,
    order.senderAmount
  );

  const handleBackButtonClick = () => {
    history.goBack();
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
        // bad request dummy link
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
        baseAmount={ethers.utils.formatUnits(order.signerAmount, 6)}
        baseTokenInfo={signerToken}
        maxAmount={null}
        side="buy"
        quoteAmount={ethers.utils.formatUnits(order.senderAmount, 6)}
        quoteTokenInfo={senderToken}
        onBaseAmountChange={() => {}}
        onChangeTokenClick={() => {}}
        onMaxButtonClick={() => {}}
      />
      {senderToken && signerToken && (
        <StyledInfoButtons
          ownerIsCurrentUser
          onFeeButtonClick={toggleShowFeeInfo}
          token1={senderToken?.symbol}
          token2={signerToken?.symbol}
          rate={new BigNumber(order.signerAmount).dividedBy(order.senderAmount)}
        />
      )}
      <ActionButtons
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
