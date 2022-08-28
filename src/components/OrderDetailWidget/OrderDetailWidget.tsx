import React, { FC, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { matchPath, useHistory } from "react-router-dom";

import { findTokenByAddress } from "@airswap/metadata";
import { TokenInfo } from "@airswap/typescript";
import { getEtherscanURL, hashOrder } from "@airswap/utils";
import { Web3Provider } from "@ethersproject/providers";
import { useToggle } from "@react-hookz/web";
import { useWeb3React } from "@web3-react/core";

import { BigNumber } from "bignumber.js";
import { addDays } from "date-fns";
import format from "date-fns/format";
import { ethers } from "ethers";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { nativeCurrencyAddress } from "../../constants/nativeCurrency";
import {
  selectActiveTokens,
  selectAllTokenInfo,
} from "../../features/metadata/metadataSlice";
import { selectUserTokens } from "../../features/userSettings/userSettingsSlice";
import { setUserTokens } from "../../features/userSettings/userSettingsSlice";
import findEthOrTokenByAddress from "../../helpers/findEthOrTokenByAddress";
import useAppRouteParams from "../../hooks/useAppRouteParams";
import useDecompressOrderFromURL from "../../hooks/useDecompressOrderFromURL";
import useTokenInfo from "../../hooks/useTokenInfo";
import { OrderStatus } from "../../types/orderStatus";
import { OrderType } from "../../types/orderTypes";
import FeeModal from "../InformationModals/subcomponents/FeeModal/FeeModal";
import Overlay from "../Overlay/Overlay";
import SwapInputs from "../SwapInputs/SwapInputs";
import { Container, StyledInfoButtons } from "./OrderDetailWidget.styles";
import ActionButtons from "./subcomponents/ActionButtons/ActionButtons";
import OrderDetailWidgetHeader from "./subcomponents/OrderDetailWidgetHeader/OrderDetailWidgetHeader";

// Dummy data, this data will come from store later.
const expiry = addDays(new Date(), 1);
const orderStatus = OrderStatus.open;
const orderType = OrderType.private;
const recipientAddress = nativeCurrencyAddress;
const transactionLink =
  "https://etherscan.io/tx/0x53ddb90435ab46d96035da71b4ff8a26bb0a682a7f2327aaeb8ff3848406204f";

const OrderDetailWidget: FC = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const { account } = useWeb3React<Web3Provider>();
  const [showFeeInfo, toggleShowFeeInfo] = useToggle(false);
  const params = new URLSearchParams(history.location.search);
  const order = useDecompressOrderFromURL(params.get("compressedOrder")!);
  const activeTokens = useAppSelector(selectActiveTokens);
  const senderToken = useTokenInfo(order.senderToken);
  const signerToken = useTokenInfo(order.signerToken);

  console.log(order.signerAmount);

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
