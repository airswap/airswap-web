import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { formatUnits } from "@ethersproject/units";

import BigNumber from "bignumber.js";
import { HTMLMotionProps } from "framer-motion";

import { SubmittedTransaction } from "../../../../entities/SubmittedTransaction/SubmittedTransaction";
import {
  isApprovalTransaction,
  isCancelTransaction,
  isDepositTransaction,
  isLastLookOrderTransaction,
  isSubmittedOrder,
  isWithdrawTransaction,
} from "../../../../entities/SubmittedTransaction/SubmittedTransactionHelpers";
import { TransactionStatusType } from "../../../../types/transactionTypes";
import ProgressBar from "../../../ProgressBar/ProgressBar";
import getTimeAgoTranslation from "../../helpers/getTimeAgoTranslation";
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
  /**
   * The parent object of SubmittedOrder and SubmittedApproval
   */
  transaction: SubmittedTransaction;
  /**
   * chainId of current Ethereum net
   */
  chainId: number;
}

const WalletTransaction = ({
  transaction,
  chainId,
  animate,
  initial,
  transition,
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
          <SpanTitle>{t("wallet.approve")}</SpanTitle>

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

    // For last look transactions, the user has sent the signer amount plus
    // the fee:
    let signerAmountWithFee: string | null = null;
    if (isLastLookOrderTransaction(transaction)) {
      signerAmountWithFee = new BigNumber(transaction.order.signerAmount)
        .multipliedBy(1.0007)
        .integerValue(BigNumber.ROUND_FLOOR)
        .toString();
    }

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
                {t(
                  isSubmittedOrder(transaction) && transaction.isLastLook
                    ? "wallet.lastLookTransaction"
                    : "wallet.transaction",
                  {
                    senderAmount: parseFloat(
                      Number(
                        formatUnits(
                          transaction.order.senderAmount,
                          senderToken.decimals
                        )
                      ).toFixed(5)
                    ),
                    senderToken: senderToken.symbol,
                    signerAmount: parseFloat(
                      Number(
                        formatUnits(
                          signerAmountWithFee || transaction.order.signerAmount,
                          signerToken.decimals
                        )
                      ).toFixed(5)
                    ),
                    signerToken: signerToken.symbol,
                  }
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

        {transaction.hash && (
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
