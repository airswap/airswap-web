import React, { FC, ReactElement, useMemo } from "react";
import { useTranslation } from "react-i18next";

import { ADDRESS_ZERO, TokenInfo } from "@airswap/utils";
import { useToggle } from "@react-hookz/web";

import { BigNumber } from "bignumber.js";

import { AppTokenInfo } from "../../../entities/AppTokenInfo/AppTokenInfo";
import {
  getTokenDecimals,
  getTokenImage,
  getTokenKind,
  getTokenSymbol,
} from "../../../entities/AppTokenInfo/AppTokenInfoHelpers";
import { getExpiryTranslation } from "../../../helpers/getExpiryTranslation";
import toRoundedNumberString from "../../../helpers/toRoundedNumberString";
import { ReviewList } from "../../../styled-components/ReviewList/ReviewList";
import {
  ReviewListItem,
  ReviewListItemLabel,
  ReviewListItemValue,
} from "../../../styled-components/ReviewListItem/ReviewListItem";
import { OrderType } from "../../../types/orderTypes";
import { getTokenPairTranslation } from "../../@widgets/MakeWidget/helpers";
import WalletLink from "../../@widgets/MakeWidget/subcomponents/WalletLink/WalletLink";
import OrderReviewToken from "../../OrderReviewToken/OrderReviewToken";
import ProtocolFeeOverlay from "../../ProtocolFeeOverlay/ProtocolFeeOverlay";
import { Title } from "../../Typography/Typography";
import {
  Container,
  StyledActionButtons,
  StyledIconButton,
  StyledWidgetHeader,
} from "./MakeOrderReview.styles";

interface MakeOrderReviewProps {
  chainId?: number;
  expiry: number;
  orderType: OrderType;
  senderAddress: string;
  senderAmount: string;
  senderToken: AppTokenInfo | null;
  signerAmount: string;
  signerAmountPlusFee?: string;
  signerToken: AppTokenInfo | null;
  wrappedNativeToken: TokenInfo | null;
  onEditButtonClick: () => void;
  onSignButtonClick: () => void;
  className?: string;
}

const MakeOrderReview: FC<MakeOrderReviewProps> = ({
  chainId,
  expiry,
  orderType,
  senderAddress,
  senderAmount,
  senderToken,
  signerAmount,
  signerAmountPlusFee,
  signerToken,
  wrappedNativeToken,
  onEditButtonClick,
  onSignButtonClick,
  className = "",
}): ReactElement => {
  const { t } = useTranslation();
  const [showFeeInfo, toggleShowFeeInfo] = useToggle(false);

  const isSignerTokenNativeToken = signerToken?.address === ADDRESS_ZERO;
  const isSenderTokenNativeToken = senderToken?.address === ADDRESS_ZERO;
  const justifiedSignerToken = isSignerTokenNativeToken
    ? wrappedNativeToken
    : signerToken;
  const justifiedSenderToken = isSenderTokenNativeToken
    ? wrappedNativeToken
    : senderToken;
  const signerTokenSymbol = justifiedSignerToken
    ? getTokenSymbol(justifiedSignerToken)
    : undefined;
  const senderTokenSymbol = justifiedSenderToken
    ? getTokenSymbol(justifiedSenderToken)
    : undefined;
  const signerTokenDecimals = justifiedSignerToken
    ? getTokenDecimals(justifiedSignerToken)
    : undefined;
  const senderTokenDecimals = justifiedSenderToken
    ? getTokenDecimals(justifiedSenderToken)
    : undefined;
  const signerTokenImage = justifiedSignerToken
    ? getTokenImage(justifiedSignerToken)
    : undefined;
  const senderTokenImage = justifiedSenderToken
    ? getTokenImage(justifiedSenderToken)
    : undefined;

  const rate = useMemo(() => {
    return getTokenPairTranslation(
      signerTokenSymbol,
      signerAmount,
      senderTokenSymbol,
      senderAmount
    );
  }, [signerAmount, senderAmount]);
  const expiryTranslation = useMemo(
    () => getExpiryTranslation(new Date(), new Date(Date.now() + expiry)),
    [expiry]
  );
  const roundedFeeAmount = useMemo(() => {
    if (!signerAmountPlusFee) {
      return undefined;
    }

    const amount = new BigNumber(signerAmountPlusFee)
      .minus(signerAmount)
      .toString();
    return toRoundedNumberString(amount, signerTokenDecimals);
  }, [signerAmount, signerAmountPlusFee, signerTokenDecimals]);

  const roundedSignerAmountPlusFee = useMemo(() => {
    if (!signerAmountPlusFee) {
      return undefined;
    }

    return toRoundedNumberString(signerAmountPlusFee, signerTokenDecimals);
  }, [signerAmountPlusFee, signerTokenDecimals]);

  return (
    <Container className={className}>
      <StyledWidgetHeader>
        <Title type="h2" as="h1">
          {t("common.review")}
        </Title>
      </StyledWidgetHeader>
      {signerToken && (
        <OrderReviewToken
          amount={signerAmount}
          label={t("common.send")}
          tokenSymbol={signerTokenSymbol || "?"}
          tokenKind={getTokenKind(signerToken)}
          tokenUri={signerTokenImage}
        />
      )}
      {senderToken && (
        <OrderReviewToken
          amount={senderAmount}
          label={t("common.receive")}
          tokenSymbol={senderTokenSymbol || "?"}
          tokenKind={getTokenKind(senderToken)}
          tokenUri={senderTokenImage}
        />
      )}
      <ReviewList>
        <ReviewListItem>
          <ReviewListItemLabel>{t("common.for")}</ReviewListItemLabel>
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
          <ReviewListItemLabel>{t("orders.expiryTime")}</ReviewListItemLabel>
          <ReviewListItemValue>{expiryTranslation}</ReviewListItemValue>
        </ReviewListItem>

        <ReviewListItem>
          <ReviewListItemLabel>{t("orders.exchangeRate")}</ReviewListItemLabel>
          <ReviewListItemValue>{rate}</ReviewListItemValue>
        </ReviewListItem>

        {!!signerAmountPlusFee && (
          <>
            <ReviewListItem>
              <ReviewListItemLabel>
                {t("orders.protocolFee")}
                <StyledIconButton
                  icon="information-circle-outline"
                  onClick={toggleShowFeeInfo}
                />
              </ReviewListItemLabel>
              <ReviewListItemValue>
                {roundedFeeAmount} {signerTokenSymbol}
              </ReviewListItemValue>
            </ReviewListItem>

            <ReviewListItem>
              <ReviewListItemLabel>{t("orders.total")}</ReviewListItemLabel>
              <ReviewListItemValue>
                {roundedSignerAmountPlusFee} {signerTokenSymbol}
              </ReviewListItemValue>
            </ReviewListItem>
          </>
        )}
      </ReviewList>

      <StyledActionButtons
        backButtonText={t("common.edit")}
        onEditButtonClick={onEditButtonClick}
        onSignButtonClick={onSignButtonClick}
      />

      <ProtocolFeeOverlay
        isHidden={showFeeInfo}
        onCloseButtonClick={() => toggleShowFeeInfo()}
      />
    </Container>
  );
};

export default MakeOrderReview;
