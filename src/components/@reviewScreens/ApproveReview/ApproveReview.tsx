import React, { FC, ReactElement, useMemo } from "react";
import { useTranslation } from "react-i18next";

import { ADDRESS_ZERO, TokenInfo } from "@airswap/utils";
import { useToggle } from "@react-hookz/web";

import { BigNumber } from "bignumber.js";

import { AppError } from "../../../errors/appError";
import toRoundedNumberString from "../../../helpers/toRoundedNumberString";
import { ReviewList } from "../../../styled-components/ReviewList/ReviewList";
import {
  ReviewListItem,
  ReviewListItemLabel,
  ReviewListItemValue,
} from "../../../styled-components/ReviewListItem/ReviewListItem";
import { ErrorList } from "../../ErrorList/ErrorList";
import OrderReviewToken from "../../OrderReviewToken/OrderReviewToken";
import Overlay from "../../Overlay/Overlay";
import ProtocolFeeOverlay from "../../ProtocolFeeOverlay/ProtocolFeeOverlay";
import { Title } from "../../Typography/Typography";
import { StyledIconButton } from "../MakeOrderReview/MakeOrderReview.styles";
import {
  Container,
  StyledActionButtons,
  StyledWidgetHeader,
} from "./ApproveReview.styles";

interface ApproveReviewProps {
  hasEditButton?: boolean;
  isLoading: boolean;
  amount: string;
  amountPlusFee?: string;
  backButtonText?: string;
  errors?: AppError[];
  readableAllowance: string;
  token: TokenInfo | null;
  wrappedNativeToken: TokenInfo | null;
  onEditButtonClick?: () => void;
  onRestartButtonClick?: () => void;
  onSignButtonClick: () => void;
  className?: string;
}

const ApproveReview: FC<ApproveReviewProps> = ({
  hasEditButton,
  isLoading,
  amount,
  amountPlusFee,
  errors = [],
  readableAllowance,
  token,
  wrappedNativeToken,
  onEditButtonClick,
  onRestartButtonClick,
  onSignButtonClick,
  className = "",
}): ReactElement => {
  const { t } = useTranslation();
  const [showFeeInfo, toggleShowFeeInfo] = useToggle(false);
  const isTokenNativeToken = token?.address === ADDRESS_ZERO;
  const justifiedToken = isTokenNativeToken ? wrappedNativeToken : token;
  const tokenSymbol = justifiedToken?.symbol || "?";

  const roundedFeeAmount = useMemo(() => {
    if (!amountPlusFee) {
      return undefined;
    }

    const feeAmount = new BigNumber(amountPlusFee).minus(amount).toString();
    return toRoundedNumberString(feeAmount, justifiedToken?.decimals);
  }, [amount, amountPlusFee, justifiedToken]);

  const roundedAmountPlusFee = useMemo(() => {
    if (!amountPlusFee) {
      return undefined;
    }

    return toRoundedNumberString(amountPlusFee, justifiedToken?.decimals);
  }, [amountPlusFee, justifiedToken]);

  const handleEditOrBackButtonClick = () => {
    if (!isLoading && hasEditButton && onEditButtonClick) {
      onEditButtonClick();
    }

    if (onRestartButtonClick) {
      onRestartButtonClick();
    }
  };

  return (
    <Container className={className}>
      <StyledWidgetHeader>
        <Title type="h2" as="h1">
          {t("orders.approve")} {tokenSymbol}
        </Title>
      </StyledWidgetHeader>
      <OrderReviewToken
        amount={amount}
        label={t("common.send")}
        tokenSymbol={tokenSymbol}
        tokenUri={justifiedToken?.logoURI}
      />
      <ReviewList>
        {readableAllowance !== "0" && (
          <ReviewListItem>
            <ReviewListItemLabel>Current approve amount</ReviewListItemLabel>
            <ReviewListItemValue>
              {readableAllowance} {tokenSymbol}
            </ReviewListItemValue>
          </ReviewListItem>
        )}
        {roundedFeeAmount && (
          <>
            <ReviewListItem>
              <ReviewListItemLabel>Order amount</ReviewListItemLabel>
              <ReviewListItemValue>
                {amount} {tokenSymbol}
              </ReviewListItemValue>
            </ReviewListItem>
            <ReviewListItem>
              <ReviewListItemLabel>
                {t("orders.protocolFee")}
                <StyledIconButton
                  icon="information-circle-outline"
                  onClick={toggleShowFeeInfo}
                />
              </ReviewListItemLabel>
              <ReviewListItemValue>
                {roundedFeeAmount} {tokenSymbol}
              </ReviewListItemValue>
            </ReviewListItem>
          </>
        )}

        <ReviewListItem>
          <ReviewListItemLabel>Total approve amount</ReviewListItemLabel>
          <ReviewListItemValue>
            {roundedAmountPlusFee || amount} {tokenSymbol}
          </ReviewListItemValue>
        </ReviewListItem>
      </ReviewList>

      <StyledActionButtons
        isLoading={isLoading}
        backButtonText={
          hasEditButton && !isLoading ? t("common.edit") : t("common.back")
        }
        onEditButtonClick={handleEditOrBackButtonClick}
        onSignButtonClick={onSignButtonClick}
      />

      <ProtocolFeeOverlay
        isHidden={showFeeInfo}
        onCloseButtonClick={() => toggleShowFeeInfo()}
      />

      {onRestartButtonClick && (
        <Overlay
          title={t("validatorErrors.unableSwap")}
          subTitle={t("validatorErrors.swapFail")}
          onClose={onRestartButtonClick}
          isHidden={!errors.length}
        >
          <ErrorList errors={errors} onBackButtonClick={onRestartButtonClick} />
        </Overlay>
      )}
    </Container>
  );
};

export default ApproveReview;
