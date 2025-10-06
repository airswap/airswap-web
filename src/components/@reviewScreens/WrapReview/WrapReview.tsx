import React, { FC, ReactElement, useMemo } from "react";
import { useTranslation } from "react-i18next";

import { TokenInfo } from "@airswap/utils";
import { useToggle } from "@react-hookz/web";

import { BigNumber } from "bignumber.js";

import { AppError } from "../../../errors/appError";
import toRoundedNumberString from "../../../helpers/toRoundedNumberString";
import useShouldDepositNativeTokenAmountInfo from "../../../hooks/useShouldDepositNativeTokenAmountInfo";
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
} from "./WrapReview.styles";

interface WrapReviewProps {
  hasEditButton?: boolean;
  isLoading: boolean;
  amount: string;
  amountPlusFee?: string;
  errors?: AppError[];
  wrappedNativeToken: TokenInfo | null;
  shouldDepositNativeTokenAmount: string;
  onEditButtonClick?: () => void;
  onRestartButtonClick?: () => void;
  onSignButtonClick: () => void;
  className?: string;
}

const WrapReview: FC<WrapReviewProps> = ({
  hasEditButton,
  isLoading,
  amount,
  amountPlusFee,
  errors = [],
  shouldDepositNativeTokenAmount,
  wrappedNativeToken,
  onEditButtonClick,
  onRestartButtonClick,
  onSignButtonClick,
  className = "",
}): ReactElement => {
  const { t } = useTranslation();
  const [showFeeInfo, toggleShowFeeInfo] = useToggle(false);

  const {
    nativeTokenSymbol,
    ownedWrappedNativeTokenAmount,
    wrappedNativeTokenSymbol,
  } = useShouldDepositNativeTokenAmountInfo();

  const roundedFeeAmount = useMemo(() => {
    if (!amountPlusFee) {
      return undefined;
    }

    const feeAmount = new BigNumber(amountPlusFee).minus(amount).toString();
    return toRoundedNumberString(feeAmount, wrappedNativeToken?.decimals);
  }, [amount, amountPlusFee, wrappedNativeToken]);

  const roundedSignerAmountPlusFee = useMemo(() => {
    if (!amountPlusFee) {
      return undefined;
    }

    return toRoundedNumberString(amountPlusFee, wrappedNativeToken?.decimals);
  }, [amountPlusFee, wrappedNativeToken]);

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
          Wrap {nativeTokenSymbol}
        </Title>
      </StyledWidgetHeader>
      <OrderReviewToken
        amount={amount}
        label={t("common.send")}
        tokenSymbol={wrappedNativeToken?.symbol || "?"}
        tokenUri={wrappedNativeToken?.logoURI}
      />
      <ReviewList>
        {roundedFeeAmount && (
          <ReviewListItem>
            <ReviewListItemLabel>
              {t("orders.protocolFee")}
              <StyledIconButton
                icon="information-circle-outline"
                onClick={toggleShowFeeInfo}
              />
            </ReviewListItemLabel>
            <ReviewListItemValue>
              {roundedFeeAmount} {wrappedNativeTokenSymbol}
            </ReviewListItemValue>
          </ReviewListItem>
        )}

        {roundedSignerAmountPlusFee && (
          <ReviewListItem>
            <ReviewListItemLabel>{t("orders.total")}</ReviewListItemLabel>
            <ReviewListItemValue>
              {roundedSignerAmountPlusFee} {wrappedNativeTokenSymbol}
            </ReviewListItemValue>
          </ReviewListItem>
        )}

        <ReviewListItem>
          <ReviewListItemLabel>
            {`${wrappedNativeTokenSymbol} ${t("balances.balance")}`}:
          </ReviewListItemLabel>
          <ReviewListItemValue>
            {ownedWrappedNativeTokenAmount} {wrappedNativeTokenSymbol}
          </ReviewListItemValue>
        </ReviewListItem>

        <ReviewListItem>
          <ReviewListItemLabel>Amount of ETH to deposit:</ReviewListItemLabel>
          <ReviewListItemValue>
            {shouldDepositNativeTokenAmount} {nativeTokenSymbol}
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

export default WrapReview;
