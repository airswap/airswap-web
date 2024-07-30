import React, { FC, ReactElement, useMemo } from "react";
import { useTranslation } from "react-i18next";

import { ADDRESS_ZERO, TokenInfo } from "@airswap/utils";
import { useToggle } from "@react-hookz/web";

import { AppError } from "../../../errors/appError";
import { getExpiryTranslation } from "../../../helpers/getExpiryTranslation";
import { ReviewList } from "../../../styled-components/ReviewList/ReviewList";
import {
  ReviewListItem,
  ReviewListItemLabel,
  ReviewListItemValue,
} from "../../../styled-components/ReviewListItem/ReviewListItem";
import { getTokenPairTranslation } from "../../@widgets/MakeWidget/helpers";
import { ErrorList } from "../../ErrorList/ErrorList";
import OrderReviewToken from "../../OrderReviewToken/OrderReviewToken";
import Overlay from "../../Overlay/Overlay";
import ProtocolFeeOverlay from "../../ProtocolFeeOverlay/ProtocolFeeOverlay";
import { Title } from "../../Typography/Typography";
import {
  Container,
  StyledActionButtons,
  StyledWidgetHeader,
} from "./TakeOrderReview.styles";

interface TakeOrderReviewProps {
  errors: AppError[];
  expiry: number;
  senderAmount: string;
  senderToken: TokenInfo | null;
  signerAmount: string;
  signerToken: TokenInfo | null;
  wrappedNativeToken: TokenInfo | null;
  onEditButtonClick: () => void;
  onRestartButtonClick: () => void;
  onSignButtonClick: () => void;
  className?: string;
}

const MakeOrderReview: FC<TakeOrderReviewProps> = ({
  errors,
  expiry,
  senderAmount,
  senderToken,
  signerAmount,
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

  const rate = useMemo(() => {
    return getTokenPairTranslation(
      justifiedSignerToken?.symbol,
      signerAmount,
      justifiedSenderToken?.symbol,
      senderAmount
    );
  }, [signerAmount, senderAmount]);
  const expiryTranslation = useMemo(
    () => getExpiryTranslation(new Date(), new Date(expiry * 1000)),
    [expiry]
  );

  return (
    <Container className={className}>
      <StyledWidgetHeader>
        <Title type="h2" as="h1">
          {t("common.review")}
        </Title>
      </StyledWidgetHeader>
      {senderToken && (
        <OrderReviewToken
          amount={senderAmount}
          label={t("common.send")}
          tokenSymbol={justifiedSenderToken?.symbol || "?"}
          tokenUri={justifiedSenderToken?.logoURI}
        />
      )}
      {signerToken && (
        <OrderReviewToken
          amount={signerAmount}
          label={t("common.receive")}
          tokenSymbol={justifiedSignerToken?.symbol || "?"}
          tokenUri={justifiedSignerToken?.logoURI}
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
            {senderAmount} {justifiedSenderToken?.symbol}
          </ReviewListItemValue>
        </ReviewListItem>
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

      <Overlay
        title={t("validatorErrors.unableSwap")}
        subTitle={t("validatorErrors.swapFail")}
        onClose={onRestartButtonClick}
        isHidden={!errors.length}
      >
        <ErrorList errors={errors} onBackButtonClick={onRestartButtonClick} />
      </Overlay>
    </Container>
  );
};

export default MakeOrderReview;
