import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { HTMLMotionProps } from "framer-motion";

import { SubmittedTransaction } from "../../../../entities/SubmittedTransaction/SubmittedTransaction";
import {
  isApprovalTransaction,
  isCancelTransaction,
  isDepositTransaction,
  isSubmittedOrder,
  isSubmittedOrderUnderConsideration,
  isWithdrawTransaction,
} from "../../../../entities/SubmittedTransaction/SubmittedTransactionHelpers";
import { TransactionStatusType } from "../../../../types/transactionTypes";
import ProgressBar from "../../../ProgressBar/ProgressBar";
import getTimeAgoTranslation from "../../helpers/getTimeAgoTranslation";
import getWalletTransactionOrderText from "../../helpers/getWalletTransactionOrderText";
import getWalletTransactionStatusText from "../../helpers/getWalletTransactionStatusText";
import {
  Container,
  RotatedIcon,
  SpanSubtitle,
  SpanTitle,
  StyledTransactionLink,
  TextContainer,
} from "./WalletTransaction.styles";

interface WalletTransactionProps extends HTMLMotionProps<"div"> {
  protocolFee: number;
  transaction: SubmittedTransaction;
  chainId: number;
  account: string;
}

const WalletTransaction = ({
  protocolFee,
  transaction,
  chainId,
  animate,
  initial,
  transition,
  account,
}: WalletTransactionProps) => {
  const { t } = useTranslation();

  const statusText = useMemo(() => {
    return getWalletTransactionStatusText(transaction.status, t);
  }, [transaction.status, t]);

  if (isApprovalTransaction(transaction)) {
    const timeBetween = getTimeAgoTranslation(
      new Date(transaction.timestamp),
      t
    );

    return (
      <Container transition={transition} animate={animate} initial={initial}>
        <TextContainer>
          <SpanTitle>
            {t("wallet.approve", { symbol: transaction.token.symbol })}
          </SpanTitle>

          <SpanSubtitle>
            {statusText} · {timeBetween}
          </SpanSubtitle>
        </TextContainer>

        <StyledTransactionLink
          hideLabel
          chainId={chainId}
          hash={transaction.hash}
        />
      </Container>
    );
  }

  if (isCancelTransaction(transaction)) {
    const timeBetween = getTimeAgoTranslation(
      new Date(transaction.timestamp),
      t
    );

    return (
      <Container transition={transition} animate={animate} initial={initial}>
        <TextContainer>
          <SpanTitle>{t("orders.cancelOrder")}</SpanTitle>
          <SpanSubtitle>
            {statusText} · {timeBetween}
          </SpanSubtitle>
        </TextContainer>

        <StyledTransactionLink
          hideLabel
          chainId={chainId}
          hash={transaction.hash}
        />
      </Container>
    );
  }

  if (
    isSubmittedOrder(transaction) ||
    isWithdrawTransaction(transaction) ||
    isDepositTransaction(transaction)
  ) {
    const { signerToken, senderToken } = transaction;
    const expiry = isSubmittedOrder(transaction)
      ? transaction.order.expiry
      : undefined;

    const timeBetween = getTimeAgoTranslation(
      new Date(transaction.timestamp),
      t
    );

    return (
      <Container transition={transition} animate={animate} initial={initial}>
        {transaction.status === TransactionStatusType.processing && (
          <RotatedIcon name="swap" iconSize={1.25} />
        )}
        <TextContainer>
          {transaction && senderToken && signerToken && (
            <>
              <SpanTitle
                hasProgress={
                  !!expiry &&
                  transaction.status === TransactionStatusType.processing
                }
              >
                {getWalletTransactionOrderText(
                  transaction,
                  signerToken,
                  senderToken,
                  account,
                  protocolFee
                )}
              </SpanTitle>
              {!!expiry &&
              transaction.status === TransactionStatusType.processing ? (
                <ProgressBar
                  startTime={transaction.timestamp}
                  endTime={+expiry * 1000}
                />
              ) : (
                <SpanSubtitle>
                  {statusText} · {timeBetween}
                </SpanSubtitle>
              )}
            </>
          )}
        </TextContainer>

        {!isSubmittedOrderUnderConsideration(transaction) && (
          <StyledTransactionLink
            hideLabel
            chainId={chainId}
            hash={transaction.hash}
          />
        )}
      </Container>
    );
  }

  return null;
};

export default WalletTransaction;
