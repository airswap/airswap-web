import React, { FC, ReactElement, useMemo } from "react";
import { useTranslation } from "react-i18next";

import { TokenInfo } from "@airswap/types";

import { BigNumber } from "bignumber.js";

import { nativeCurrencyAddress } from "../../../../constants/nativeCurrency";
import { getExpiryTranslation } from "../../../../helpers/getExpiryTranslation";
import useInsufficientBalance from "../../../../hooks/useInsufficientBalance";
import useShouldDepositNativeTokenAmountInfo from "../../../../hooks/useShouldDepositNativeTokenAmountInfo";
import { OrderType } from "../../../../types/orderTypes";
import { getTokenPairTranslation } from "../../helpers";
import WalletLink from "../WalletLink/WalletLink";
import {
  Container,
  ReviewList,
  ReviewListItem,
  ReviewListItemLabel,
  ReviewListItemValue,
  StyledIconButton,
  StyledOrderReviewToken,
} from "./OrderReview.styles";

interface OrderReviewProps {
  chainId?: number;
  expiry: number;
  orderType: OrderType;
  protocolFee: number;
  senderAddress: string;
  senderAmount: string;
  senderToken: TokenInfo | null;
  signerAmount: string;
  signerAmountPlusFee: string;
  signerToken: TokenInfo | null;
  wrappedNativeToken: TokenInfo | null;
  onFeeButtonClick: () => void;
  className?: string;
}

const OrderReview: FC<OrderReviewProps> = ({
  chainId,
  expiry,
  orderType,
  protocolFee,
  senderAddress,
  senderAmount,
  senderToken,
  signerAmount,
  signerAmountPlusFee,
  signerToken,
  wrappedNativeToken,
  onFeeButtonClick,
  className = "",
}): ReactElement => {
  const { t } = useTranslation();

  const isSignerTokenNativeToken =
    signerToken?.address === nativeCurrencyAddress;
  const isSenderTokenNativeToken =
    senderToken?.address === nativeCurrencyAddress;
  const justifiedSignerToken = isSignerTokenNativeToken
    ? wrappedNativeToken
    : signerToken;
  const justifiedSenderToken = isSenderTokenNativeToken
    ? wrappedNativeToken
    : senderToken;

  const { ownedWrappedNativeTokenAmount, wrappedNativeTokenSymbol } =
    useShouldDepositNativeTokenAmountInfo();

  const rate = useMemo(() => {
    return getTokenPairTranslation(
      justifiedSignerToken?.symbol,
      signerAmount,
      justifiedSenderToken?.symbol,
      senderAmount
    );
  }, [signerAmount, senderAmount]);
  const expiryTranslation = useMemo(
    () => getExpiryTranslation(new Date(), new Date(Date.now() + expiry)),
    [expiry]
  );
  const feeAmount = useMemo(
    () => new BigNumber(signerAmountPlusFee).minus(signerAmount).toString(),
    [signerAmount, signerAmountPlusFee]
  );

  return (
    <Container className={className}>
      {signerToken && (
        <StyledOrderReviewToken
          amount={signerAmount}
          label={t("common.sending")}
          tokenSymbol={justifiedSignerToken?.symbol || "?"}
          tokenUri={justifiedSignerToken?.logoURI}
        />
      )}
      {senderToken && (
        <StyledOrderReviewToken
          amount={senderAmount}
          label={t("common.receiving")}
          tokenSymbol={justifiedSenderToken?.symbol || "?"}
          tokenUri={justifiedSenderToken?.logoURI}
        />
      )}
      <ReviewList>
        <ReviewListItem>
          <ReviewListItemLabel>{t("common.for")}:</ReviewListItemLabel>
          <ReviewListItemValue>
            {orderType === OrderType.private ? (
              <>
                {t("orders.specificTaker")}
                <WalletLink address={senderAddress} chainId={chainId || 1} />
              </>
            ) : (
              t("orders.anyone")
            )}
          </ReviewListItemValue>
        </ReviewListItem>

        <ReviewListItem>
          <ReviewListItemLabel>{t("orders.listed")}:</ReviewListItemLabel>
          <ReviewListItemValue>
            {orderType === OrderType.publicListed
              ? t("common.yes")
              : t("common.no")}
          </ReviewListItemValue>
        </ReviewListItem>

        <ReviewListItem>
          <ReviewListItemLabel>{t("orders.expiryTime")}:</ReviewListItemLabel>
          <ReviewListItemValue>{expiryTranslation}</ReviewListItemValue>
        </ReviewListItem>

        <ReviewListItem>
          <ReviewListItemLabel>{t("orders.exchangeRate")}:</ReviewListItemLabel>
          <ReviewListItemValue>{rate}</ReviewListItemValue>
        </ReviewListItem>

        <ReviewListItem>
          <ReviewListItemLabel>
            {`${t("orders.protocolFee")} (${protocolFee}%)`}
            <StyledIconButton
              icon="information-circle-outline"
              onClick={onFeeButtonClick}
            />
            :
          </ReviewListItemLabel>
          <ReviewListItemValue>{feeAmount}</ReviewListItemValue>
        </ReviewListItem>

        <ReviewListItem>
          <ReviewListItemLabel>
            {t("orders.totalSpending")}:
          </ReviewListItemLabel>
          <ReviewListItemValue>{signerAmountPlusFee}</ReviewListItemValue>
        </ReviewListItem>

        {justifiedSignerToken?.address === wrappedNativeToken?.address && (
          <ReviewListItem>
            <ReviewListItemLabel>
              {`${wrappedNativeTokenSymbol} ${t("balances.balance")}`}:
            </ReviewListItemLabel>
            <ReviewListItemValue>
              {ownedWrappedNativeTokenAmount}
            </ReviewListItemValue>
          </ReviewListItem>
        )}
      </ReviewList>
    </Container>
  );
};

export default OrderReview;
