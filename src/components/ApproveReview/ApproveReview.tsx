import React, { FC, ReactElement, useMemo } from "react";
import { useTranslation } from "react-i18next";

import { TokenInfo } from "@airswap/types";
import { useToggle } from "@react-hookz/web";

import { BigNumber } from "bignumber.js";

import { nativeCurrencyAddress } from "../../constants/nativeCurrency";
import toRoundedNumberString from "../../helpers/toRoundedNumberString";
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
} from "./ApproveReview.styles";

interface ApproveReviewProps {
  amount: string;
  amountPlusFee: string;
  token: TokenInfo | null;
  wrappedNativeToken: TokenInfo | null;
  onEditButtonClick: () => void;
  onSignButtonClick: () => void;
  className?: string;
}

const ApproveReview: FC<ApproveReviewProps> = ({
  amount,
  amountPlusFee,
  token,
  wrappedNativeToken,
  onEditButtonClick,
  onSignButtonClick,
  className = "",
}): ReactElement => {
  const { t } = useTranslation();
  const [showFeeInfo, toggleShowFeeInfo] = useToggle(false);

  const isTokenNativeToken = token?.address === nativeCurrencyAddress;
  const justifiedToken = isTokenNativeToken ? wrappedNativeToken : token;

  const roundedFeeAmount = useMemo(() => {
    const feeAmount = new BigNumber(amountPlusFee).minus(amount).toString();
    return toRoundedNumberString(feeAmount, justifiedToken?.decimals);
  }, [amount, amountPlusFee, justifiedToken]);

  const roundedSignerAmountPlusFee = useMemo(() => {
    return toRoundedNumberString(amountPlusFee, justifiedToken?.decimals);
  }, [amountPlusFee, justifiedToken]);

  return (
    <Container className={className}>
      <StyledWidgetHeader>
        <Title type="h2" as="h1">
          {t("orders.approve")}
        </Title>
      </StyledWidgetHeader>
      <OrderReviewToken
        amount={amount}
        label={t("common.sending")}
        tokenSymbol={justifiedToken?.symbol || "?"}
        tokenUri={justifiedToken?.logoURI}
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
            {roundedFeeAmount} {justifiedToken?.symbol}
          </ReviewListItemValue>
        </ReviewListItem>

        <ReviewListItem>
          <ReviewListItemLabel>Total approve amount</ReviewListItemLabel>
          <ReviewListItemValue>
            {roundedSignerAmountPlusFee} {justifiedToken?.symbol}
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
