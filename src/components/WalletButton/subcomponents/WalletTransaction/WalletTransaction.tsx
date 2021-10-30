import { useTranslation } from "react-i18next";

import { TokenInfo } from "@airswap/types";
import { formatUnits } from "@ethersproject/units";

import {
  SubmittedApproval,
  SubmittedLastLookOrder,
  SubmittedRFQOrder,
  SubmittedTransaction,
  TransactionType,
} from "../../../../features/transactions/transactionsSlice";
import getTimeBetweenTwoDates from "../../../../helpers/getTimeBetweenTwoDates";
import {
  Container,
  SpanSubtitle,
  SpanTitle,
  StyledTransactionLink,
  StyledWalletTransactionStatus,
  TextContainer,
} from "./WalletTransaction.styles";

type WalletTransactionProps = {
  /**
   * The parent object of SubmittedOrder and SubmittedApproval
   */
  transaction: SubmittedTransaction;
  /**
   * the type of transaction
   * @type "Approval" | "Order" | "Withdraw" | "Deposit"
   */
  type: TransactionType;
  /**
   * chainId of current Ethereum net
   */
  chainId: number;
  /**
   * Token Info of sender token
   */
  senderToken?: TokenInfo;
  /**
   * Token Info of signer token
   */
  signerToken?: TokenInfo;
  /**
   * Token Info of approval token
   */
  approvalToken?: TokenInfo;
};

export const WalletTransaction = ({
  transaction,
  type,
  chainId,
  senderToken,
  signerToken,
  approvalToken,
}: WalletTransactionProps) => {
  const { t } = useTranslation(["common", "wallet"]);
  if (type === "Order" || type === "Deposit" || type === "Withdraw") {
    const tx =
      transaction.protocol === "last-look"
        ? (transaction as SubmittedLastLookOrder)
        : (transaction as SubmittedRFQOrder);
    return (
      <Container>
        <StyledWalletTransactionStatus status={tx.status} />
        <TextContainer>
          {(() => {
            if (tx && senderToken && signerToken) {
              let translationKey = "wallet:transaction";
              if (tx.protocol === "last-look") {
                translationKey = "wallet:lastLookTransaction";
              }
              return (
                <>
                  <SpanTitle>
                    {
                      // @ts-ignore dynamic translation key.
                      t(translationKey, {
                        senderAmount: parseFloat(
                            Number(
                                formatUnits(tx.order.senderAmount, senderToken.decimals)
                            ).toFixed(5)
                        ),
                        senderToken: senderToken.symbol,
                        signerAmount: parseFloat(
                            Number(
                                formatUnits(tx.order.signerAmount, signerToken.decimals)
                            ).toFixed(5)
                        ),
                        signerToken: signerToken.symbol,
                      })}
                  </SpanTitle>
                  <SpanSubtitle>
                    {tx.status === "succeeded"
                        ? t("common:success")
                        : tx.status === "processing"
                            ? t("common:processing")
                            : t("common:failed")}{" "}
                    · {getTimeBetweenTwoDates(new Date(tx.timestamp), t)}
                  </SpanSubtitle>
                </>
              );
            }
          })()}
        </TextContainer>
        {tx.hash && <StyledTransactionLink chainId={chainId} hash={tx.hash} />}
      </Container>
    );
  } else {
    const tx: SubmittedApproval = transaction as SubmittedApproval;
    return (
      <Container>
        <StyledWalletTransactionStatus status={tx.status} />
        <TextContainer>
          <>
            <SpanTitle>
              {t("wallet:approve", { symbol: approvalToken?.symbol })}
            </SpanTitle>
            <SpanSubtitle>
              {tx.status === "succeeded"
                  ? t("common:success")
                  : tx.status === "processing"
                      ? t("common:processing")
                      : t("common:failed")}{" "}
              · {getTimeBetweenTwoDates(new Date(tx.timestamp), t)}
            </SpanSubtitle>
          </>
        </TextContainer>
        {tx.hash && <StyledTransactionLink chainId={chainId} hash={tx.hash} />}
      </Container>
    );
  }
};
