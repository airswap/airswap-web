import { useTranslation } from "react-i18next";

import { formatUnits } from "@ethersproject/units";
import { TokenInfo } from "@uniswap/token-lists";

import {
  SubmittedApproval,
  SubmittedOrder,
  SubmittedTransaction,
} from "../../../../features/transactions/transactionsSlice";
import getTimeBetweenTwoDates from "../../../../helpers/getTimeBetweenTwoDates";
import {
  Container,
  TextContainer,
  SpanTitle,
  SpanSubtitle,
  StyledTransactionLink,
  StyledWalletTransactionStatus,
} from "./WalletTransaction.styles";

type WalletTransactionProps = {
  /**
   * The parent object of SubmittedOrder and SubmittedApproval
   */
  transaction: SubmittedTransaction;
  /**
   * the type of transaction
   * @type "Approval" | "Order"
   */
  type: "Approval" | "Order";
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

  if (type === "Order") {
    const tx: SubmittedOrder = transaction as SubmittedOrder;
    return (
      <Container>
        <StyledWalletTransactionStatus status={tx.status} />
        <TextContainer>
          {tx && senderToken && signerToken && (
            <>
              <SpanTitle>
                {t("wallet:transaction", {
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
                ·{" "}
                {tx.timestamp
                  ? t("wallet:transactionTimeAgo", {
                      time: getTimeBetweenTwoDates(new Date(tx.timestamp)),
                    })
                  : t("common:undefined")}
              </SpanSubtitle>
            </>
          )}
        </TextContainer>
        <StyledTransactionLink chainId={chainId} hash={tx.hash} />
      </Container>
    );
  } else {
    const tx: SubmittedApproval = transaction as SubmittedApproval;
    return (
      <Container>
        <StyledWalletTransactionStatus status={tx.status} />
        <TextContainer>
          {approvalToken && (
            <>
              <SpanTitle>Approve {approvalToken.symbol}</SpanTitle>
              <SpanSubtitle>
                {tx.status === "succeeded"
                  ? t("common:success")
                  : tx.status === "processing"
                  ? t("common:processing")
                  : t("common:failed")}{" "}
                ·{" "}
                {tx.timestamp
                  ? t("wallet:transactionTimeAgo", {
                      time: getTimeBetweenTwoDates(new Date(tx.timestamp)),
                    })
                  : t("common:undefined")}
              </SpanSubtitle>
            </>
          )}
        </TextContainer>
        <StyledTransactionLink chainId={chainId} hash={tx.hash} />
      </Container>
    );
  }
};
