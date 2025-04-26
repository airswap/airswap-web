import React, { FC, ReactElement, useMemo } from "react";
import { useTranslation } from "react-i18next";

import { ADDRESS_ZERO, TokenInfo } from "@airswap/utils";
import { useToggle } from "@react-hookz/web";

import BigNumber from "bignumber.js";

import { AppTokenInfo } from "../../../entities/AppTokenInfo/AppTokenInfo";
import {
  getTokenDecimals,
  getTokenImage,
  getTokenSymbol,
} from "../../../entities/AppTokenInfo/AppTokenInfoHelpers";
import { AppError } from "../../../errors/appError";
import { getExpiryTranslation } from "../../../helpers/getExpiryTranslation";
import toRoundedNumberString from "../../../helpers/toRoundedNumberString";
import { ReviewList } from "../../../styled-components/ReviewList/ReviewList";
import {
  ReviewListItem,
  ReviewListItemLabel,
  ReviewListItemValue,
} from "../../../styled-components/ReviewListItem/ReviewListItem";
import { getTokenPairTranslation } from "../../@widgets/MakeWidget/helpers";
import { ErrorList } from "../../ErrorList/ErrorList";
import ModalOverlay from "../../ModalOverlay/ModalOverlay";
import OrderReviewToken from "../../OrderReviewToken/OrderReviewToken";
import ProtocolFeeOverlay from "../../ProtocolFeeOverlay/ProtocolFeeOverlay";
import { Title } from "../../Typography/Typography";
import {
  Container,
  OrderReviewSenderToken,
  OrderReviewSignerToken,
  StyledActionButtons,
  StyledIconButton,
  StyledWidgetHeader,
} from "./TakeOrderReview.styles";

interface TakeOrderReviewProps {
  isSigner?: boolean;
  errors: AppError[];
  expiry: number;
  senderAmount: string;
  senderAmountPlusFee?: string;
  senderToken: AppTokenInfo | null;
  signerAmount: string;
  signerAmountPlusFee?: string;
  signerToken: AppTokenInfo | null;
  wrappedNativeToken: TokenInfo | null;
  onEditButtonClick: () => void;
  onRestartButtonClick: () => void;
  onSignButtonClick: () => void;
  className?: string;
}

const TakeOrderReview: FC<TakeOrderReviewProps> = ({
  isSigner,
  errors,
  expiry,
  senderAmount,
  senderAmountPlusFee,
  senderToken,
  signerAmount,
  signerAmountPlusFee,
  signerToken,
  wrappedNativeToken,
  onEditButtonClick,
  onRestartButtonClick,
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
  const signerTokenSymbol = signerToken
    ? getTokenSymbol(signerToken)
    : undefined;
  const senderTokenSymbol = senderToken
    ? getTokenSymbol(senderToken)
    : undefined;
  const signerTokenDecimals = signerToken
    ? getTokenDecimals(signerToken)
    : undefined;
  const senderTokenDecimals = senderToken
    ? getTokenDecimals(senderToken)
    : undefined;
  const signerTokenImage = signerToken ? getTokenImage(signerToken) : undefined;
  const senderTokenImage = senderToken ? getTokenImage(senderToken) : undefined;

  const rate = useMemo(() => {
    return getTokenPairTranslation(
      signerTokenSymbol,
      signerAmount,
      senderTokenSymbol,
      senderAmount
    );
  }, [signerAmount, senderAmount]);
  const expiryTranslation = useMemo(
    () => getExpiryTranslation(new Date(), new Date(expiry * 1000)),
    [expiry]
  );

  const amountPlusFee = signerAmountPlusFee || senderAmountPlusFee;
  const amountPlusFeeDecimals = signerAmountPlusFee
    ? signerTokenDecimals
    : senderTokenDecimals;
  const amountPlusFeeSymbol = signerAmountPlusFee
    ? signerTokenSymbol
    : senderTokenSymbol;

  const roundedFeeAmount = useMemo(() => {
    if (!amountPlusFee) {
      return undefined;
    }

    const amount = new BigNumber(amountPlusFee).minus(signerAmount).toString();
    return toRoundedNumberString(amount, amountPlusFeeDecimals);
  }, [signerAmount, amountPlusFee, amountPlusFeeDecimals]);

  const roundedAmountPlusFee = useMemo(() => {
    if (!amountPlusFee) {
      return undefined;
    }

    return toRoundedNumberString(amountPlusFee, amountPlusFeeDecimals);
  }, [amountPlusFee, amountPlusFeeDecimals]);

  return (
    <Container isSigner={isSigner} className={className}>
      <StyledWidgetHeader>
        <Title type="h2" as="h1">
          {t("common.review")}
        </Title>
      </StyledWidgetHeader>
      {senderToken && (
        <OrderReviewSenderToken
          amount={senderAmount}
          label={isSigner ? t("common.receive") : t("common.send")}
          tokenSymbol={senderTokenSymbol || "?"}
          tokenUri={senderTokenImage}
        />
      )}
      {signerToken && (
        <OrderReviewSignerToken
          amount={signerAmount}
          label={isSigner ? t("common.send") : t("common.receive")}
          tokenSymbol={signerTokenSymbol || "?"}
          tokenUri={signerTokenImage}
        />
      )}
      <ReviewList>
        <ReviewListItem>
          <ReviewListItemLabel>{t("orders.expiryTime")}</ReviewListItemLabel>
          <ReviewListItemValue>{expiryTranslation}</ReviewListItemValue>
        </ReviewListItem>

        <ReviewListItem>
          <ReviewListItemLabel>{t("orders.exchangeRate")}</ReviewListItemLabel>
          <ReviewListItemValue>{rate}</ReviewListItemValue>
        </ReviewListItem>

        <ReviewListItem>
          <ReviewListItemLabel>{t("orders.total")}</ReviewListItemLabel>
          <ReviewListItemValue>
            {isSigner ? signerAmount : senderAmount}{" "}
            {isSigner ? signerTokenSymbol : senderTokenSymbol}
          </ReviewListItemValue>
        </ReviewListItem>

        {!!amountPlusFee && (
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
                {roundedFeeAmount} {amountPlusFeeSymbol}
              </ReviewListItemValue>
            </ReviewListItem>

            <ReviewListItem>
              <ReviewListItemLabel>{t("orders.total")}</ReviewListItemLabel>
              <ReviewListItemValue>
                {roundedAmountPlusFee} {amountPlusFeeSymbol}
              </ReviewListItemValue>
            </ReviewListItem>
          </>
        )}
      </ReviewList>

      <StyledActionButtons
        backButtonText={t("common.back")}
        onEditButtonClick={onEditButtonClick}
        onSignButtonClick={onSignButtonClick}
      />

      <ProtocolFeeOverlay
        isHidden={showFeeInfo}
        onCloseButtonClick={() => toggleShowFeeInfo()}
      />

      <ModalOverlay
        title={t("validatorErrors.unableSwap")}
        subTitle={t("validatorErrors.swapFail")}
        onClose={onRestartButtonClick}
        isHidden={!errors.length}
      >
        <ErrorList errors={errors} onBackButtonClick={onRestartButtonClick} />
      </ModalOverlay>
    </Container>
  );
};

export default TakeOrderReview;
