import React, { FC, ReactElement, useMemo } from "react";
import { useTranslation } from "react-i18next";

import { TokenInfo } from "@airswap/types";
import { useToggle } from "@react-hookz/web";

import { BigNumber } from "bignumber.js";

import toRoundedNumberString from "../../helpers/toRoundedNumberString";
import useShouldDepositNativeTokenAmountInfo from "../../hooks/useShouldDepositNativeTokenAmountInfo";
import { ReviewList } from "../../styled-components/ReviewList/ReviewList";
import {
  ReviewListItem,
  ReviewListItemLabel,
  ReviewListItemValue,
} from "../../styled-components/ReviewListItem/ReviewListItem";
import { StyledIconButton } from "../MakeOrderReview/MakeOrderReview.styles";
import ProtocolFeeOverlay from "../MakeWidget/subcomponents/ProtocolFeeOverlay/ProtocolFeeOverlay";
import OrderReviewToken from "../OrderReviewToken/OrderReviewToken";
import { Title } from "../Typography/Typography";
import {
  Container,
  StyledActionButtons,
  StyledWidgetHeader,
} from "./WrapReview.styles";

interface WrapReviewProps {
  isLoading: boolean;
  amount: string;
  amountPlusFee?: string;
  backButtonText?: string;
  wrappedNativeToken: TokenInfo | null;
  shouldDepositNativeTokenAmount: string;
  onEditButtonClick: () => void;
  onSignButtonClick: () => void;
  className?: string;
}

const ApproveReview: FC<WrapReviewProps> = ({
  isLoading,
  amount,
  amountPlusFee,
  backButtonText,
  shouldDepositNativeTokenAmount,
  wrappedNativeToken,
  onEditButtonClick,
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
        backButtonText={backButtonText || t("common.back")}
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

export default ApproveReview;
