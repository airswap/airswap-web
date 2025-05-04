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
import { AppError } from "../../../errors/appError";
import toRoundedNumberString from "../../../helpers/toRoundedNumberString";
import { ReviewList } from "../../../styled-components/ReviewList/ReviewList";
import {
  ReviewListItem,
  ReviewListItemLabel,
  ReviewListItemValue,
} from "../../../styled-components/ReviewListItem/ReviewListItem";
import { ErrorList } from "../../ErrorList/ErrorList";
import ModalOverlay from "../../ModalOverlay/ModalOverlay";
import OrderReviewToken from "../../OrderReviewToken/OrderReviewToken";
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
  token: AppTokenInfo | null;
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
  const tokenSymbol =
    (justifiedToken ? getTokenSymbol(justifiedToken) : undefined) || "?";
  const tokenDecimals =
    (justifiedToken ? getTokenDecimals(justifiedToken) : undefined) || 18;
  const tokenImage = justifiedToken ? getTokenImage(justifiedToken) : undefined;

  const roundedFeeAmount = useMemo(() => {
    if (!amountPlusFee) {
      return undefined;
    }

    const feeAmount = new BigNumber(amountPlusFee).minus(amount).toString();
    return toRoundedNumberString(feeAmount, tokenDecimals);
  }, [amount, amountPlusFee, justifiedToken]);

  const roundedAmountPlusFee = useMemo(() => {
    if (!amountPlusFee) {
      return undefined;
    }

    return toRoundedNumberString(amountPlusFee, tokenDecimals);
  }, [amountPlusFee, tokenDecimals]);

  const handleEditOrBackButtonClick = () => {
    if (!isLoading && hasEditButton && onEditButtonClick) {
      onEditButtonClick();

      return;
    }

    if (onRestartButtonClick) {
      onRestartButtonClick();
    }
  };

  return (
    <Container className={className}>
      <StyledWidgetHeader>
        <Title type="h2" as="h1">
          {t("orders.approve")}
        </Title>
      </StyledWidgetHeader>
      <OrderReviewToken
        amount={amount}
        label={t("common.send")}
        tokenSymbol={tokenSymbol}
        tokenKind={token ? getTokenKind(token) : undefined}
        tokenUri={tokenImage}
      />
      <ReviewList>
        {!!amountPlusFee && (
          <>
            <ReviewListItem>
              <ReviewListItemLabel>
                {t("orders.orderAmount")}
              </ReviewListItemLabel>
              <ReviewListItemValue>{amount}</ReviewListItemValue>
            </ReviewListItem>
            <ReviewListItem>
              <ReviewListItemLabel>
                {t("orders.feeAmount")}
                <StyledIconButton
                  icon="information-circle-outline"
                  onClick={toggleShowFeeInfo}
                />
              </ReviewListItemLabel>
              <ReviewListItemValue>{roundedFeeAmount}</ReviewListItemValue>
            </ReviewListItem>
          </>
        )}
        {readableAllowance !== "0" && (
          <ReviewListItem>
            <ReviewListItemLabel>
              {t("orders.currentApprovalAmount")}
            </ReviewListItemLabel>
            <ReviewListItemValue>{readableAllowance}</ReviewListItemValue>
          </ReviewListItem>
        )}
        <ReviewListItem>
          <ReviewListItemLabel>
            {t("orders.requiredApprovalAmount")}
          </ReviewListItemLabel>
          <ReviewListItemValue>
            {roundedAmountPlusFee || amount}
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
        <ModalOverlay
          title={t("validatorErrors.unableSwap")}
          subTitle={t("validatorErrors.swapFail")}
          onClose={onRestartButtonClick}
          isHidden={!errors.length}
        >
          <ErrorList errors={errors} onBackButtonClick={onRestartButtonClick} />
        </ModalOverlay>
      )}
    </Container>
  );
};

export default ApproveReview;
