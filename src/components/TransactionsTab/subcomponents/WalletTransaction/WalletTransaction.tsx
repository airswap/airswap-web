import { useTranslation } from "react-i18next";

import { findTokenByAddress } from "@airswap/metadata";
import { TokenInfo } from "@airswap/types";
import { formatUnits } from "@ethersproject/units";

import BigNumber from "bignumber.js";

import {
  SubmittedApproval,
  SubmittedTransactionWithOrder,
  SubmittedTransaction,
} from "../../../../features/transactions/transactionsSlice";
import findEthOrTokenByAddress from "../../../../helpers/findEthOrTokenByAddress";
import getTimeBetweenTwoDates from "../../../../helpers/getTimeBetweenTwoDates";
import ProgressBar from "../../../ProgressBar/ProgressBar";
import {
  Container,
  RotatedIcon,
  SpanSubtitle,
  SpanTitle,
  StyledTransactionLink,
  TextContainer,
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

const WalletTransaction = ({
  transaction,
  tokens,
  chainId,
}: WalletTransactionProps) => {
  const { t } = useTranslation(["common", "wallet", "orders"]);

  let statusText: string;

  switch (transaction.status) {
    case "succeeded":
      statusText = t("common:success");
      break;
    case "processing":
      statusText = t("common:processing");
      break;
    case "expired":
      statusText = t("common:expired");
      break;
    case "reverted":
      statusText = t("common:failed");
      break;
    case "declined":
      statusText = t("orders:swapRejected");
      break;
    default:
      statusText = t("common:unknown");
  }

  if (transaction.type === "Approval") {
    const tx: SubmittedApproval = transaction as SubmittedApproval;
    const approvalToken = findTokenByAddress(tx.tokenAddress, tokens);
    return (
      <Container>
        <TextContainer>
          <>
            <SpanTitle>
              {t("wallet:approve", { symbol: approvalToken?.symbol })}
            </SpanTitle>
            <SpanSubtitle>
              {statusText} · {getTimeBetweenTwoDates(new Date(tx.timestamp), t)}
            </SpanSubtitle>
          </>
        </TextContainer>
        {tx.hash && <StyledTransactionLink chainId={chainId} hash={tx.hash} />}
      </Container>
    );
  } else {
    const tx: SubmittedTransactionWithOrder = transaction as SubmittedTransactionWithOrder;
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
    const hasExpiry = !!tx.expiry;

    // For last look transactions, the user has sent the signer amount plus
    // the fee:
    let signerAmountWithFee: string | null = null;
    if (tx.protocol === "last-look") {
      signerAmountWithFee = new BigNumber(tx.order.signerAmount)
        .multipliedBy(1.0007)
        .integerValue(BigNumber.ROUND_FLOOR)
        .toString();
    }
    return (
      <Container>
        {tx.status === "processing" && (
          <RotatedIcon name="swap" iconSize={1.25} />
        )}
        <TextContainer>
          {tx && senderToken && signerToken && (
            <>
              <SpanTitle hasProgress={hasExpiry && tx.status === "processing"}>
                {t(
                  tx.protocol === "last-look"
                    ? "wallet:lastLookTransaction"
                    : "wallet:transaction",
                  {
                    senderAmount: parseFloat(
                      Number(
                        formatUnits(tx.order.senderAmount, senderToken.decimals)
                      ).toFixed(5)
                    ),
                    senderToken: senderToken.symbol,
                    signerAmount: parseFloat(
                      Number(
                        formatUnits(
                          signerAmountWithFee || tx.order.signerAmount,
                          signerToken.decimals
                        )
                      ).toFixed(5)
                    ),
                    signerToken: signerToken.symbol,
                  }
                )}
              </SpanTitle>
              {hasExpiry && tx.status === "processing" ? (
                <ProgressBar
                  startTime={tx.timestamp}
                  endTime={parseInt(tx.expiry!) * 1000}
                />
              ) : (
                <SpanSubtitle>
                  {statusText} ·{" "}
                  {getTimeBetweenTwoDates(new Date(tx.timestamp), t)}
                </SpanSubtitle>
              )}
            </>
          )}
        </TextContainer>
        {tx.status !== "processing" &&
          (tx.hash ? (
            <StyledTransactionLink chainId={chainId} hash={tx.hash} />
          ) : (
            <span />
          ))}
      </Container>
    );
  }
};

export { WalletTransaction };
