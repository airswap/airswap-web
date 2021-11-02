import { useTranslation } from "react-i18next";

import { findTokenByAddress } from "@airswap/metadata";
import { TokenInfo } from "@airswap/types";
import { formatUnits } from "@ethersproject/units";

import {
  SubmittedApproval,
  SubmittedOrder,
  SubmittedTransaction,
} from "../../../../features/transactions/transactionsSlice";
import findEthOrTokenByAddress from "../../../../helpers/findEthOrTokenByAddress";
import getTimeBetweenTwoDates from "../../../../helpers/getTimeBetweenTwoDates";
import {
  Container,
  TextContainer,
  SpanTitle,
  SpanSubtitle,
  StyledTransactionLink,
} from "./WalletTransaction.styles";

type WalletTransactionProps = {
  /**
   * The parent object of SubmittedOrder and SubmittedApproval
   */
  transaction: SubmittedTransaction;
  /**
   * All token metadata
   */
  tokens: TokenInfo[];
  /**
   * chainId of current Ethereum net
   */
  chainId: number;
};

export const WalletTransaction = ({
  transaction,
  tokens,
  chainId,
}: WalletTransactionProps) => {
  const { t } = useTranslation(["common", "wallet"]);

  if (transaction.type === "Approval") {
    const tx: SubmittedApproval = transaction as SubmittedApproval;
    const approvalToken = findTokenByAddress(tx.tokenAddress, tokens);
    return (
      <Container>
        <TextContainer>
          {approvalToken && (
            <>
              <SpanTitle>
                {t("wallet:approve", { symbol: approvalToken.symbol })}
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
          )}
        </TextContainer>
        <StyledTransactionLink chainId={chainId} hash={tx.hash} />
      </Container>
    );
  } else {
    const tx: SubmittedOrder = transaction as SubmittedOrder;
    const senderToken = findEthOrTokenByAddress(
      tx.order.senderToken,
      tokens,
      chainId
    );
    const signerToken = findEthOrTokenByAddress(
      tx.order.signerToken,
      tokens,
      chainId
    );
    return (
      <Container>
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
                · {getTimeBetweenTwoDates(new Date(tx.timestamp), t)}
              </SpanSubtitle>
            </>
          )}
        </TextContainer>
        <StyledTransactionLink chainId={chainId} hash={tx.hash} />
      </Container>
    );
  }
};
