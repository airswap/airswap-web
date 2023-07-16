import React, { FC, ReactElement, useMemo } from "react";
import { useTranslation } from "react-i18next";

import { TokenInfo } from "@airswap/types";
import { useToggle } from "@react-hookz/web";

import { BigNumber } from "bignumber.js";

import { nativeCurrencyAddress } from "../../constants/nativeCurrency";
import toRoundedNumberString from "../../helpers/toRoundedNumberString";
import useShouldDepositNativeTokenAmountInfo from "../../hooks/useShouldDepositNativeTokenAmountInfo";
import { ReviewList } from "../../styled-components/ReviewList/ReviewList";
import {
  ReviewListItem,
  ReviewListItemLabel,
  ReviewListItemValue,
} from "../../styled-components/ReviewListItem/ReviewListItem";
import ProtocolFeeOverlay from "../MakeWidget/subcomponents/ProtocolFeeOverlay/ProtocolFeeOverlay";
import { StyledIconButton } from "../OrderReview/OrderReview.styles";
import OrderReviewToken from "../OrderReviewToken/OrderReviewToken";
import { Title } from "../Typography/Typography";
import {
  Container,
  StyledActionButtons,
  StyledWidgetHeader,
} from "./WrapReview.styles";

interface WrapReviewProps {
  amount: string;
  amountPlusFee: string;
  wrappedNativeToken: TokenInfo | null;
  shouldDepositNativeTokenAmount: string;
  onEditButtonClick: () => void;
  onSignButtonClick: () => void;
  className?: string;
}

const ApproveReview: FC<WrapReviewProps> = ({
  amount,
  amountPlusFee,
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
    const feeAmount = new BigNumber(amountPlusFee).minus(amount).toString();
    return toRoundedNumberString(feeAmount, wrappedNativeToken?.decimals);
  }, [amount, amountPlusFee, wrappedNativeToken]);

  const roundedSignerAmountPlusFee = useMemo(() => {
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
        label={t("common.sending")}
        tokenSymbol={wrappedNativeToken?.symbol || "?"}
        tokenUri={wrappedNativeToken?.logoURI}
      />
      <ReviewList>
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

        <ReviewListItem>
          <ReviewListItemLabel>{t("orders.totalSpending")}</ReviewListItemLabel>
          <ReviewListItemValue>
            {roundedSignerAmountPlusFee} {wrappedNativeTokenSymbol}
          </ReviewListItemValue>
        </ReviewListItem>

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
