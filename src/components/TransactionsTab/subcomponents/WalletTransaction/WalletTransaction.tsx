import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { findTokenByAddress } from "@airswap/metadata";
import { TokenInfo } from "@airswap/typescript";
import { formatUnits } from "@ethersproject/units";

import BigNumber from "bignumber.js";
import { HTMLMotionProps } from "framer-motion";

import {
  SubmittedApproval,
  SubmittedTransactionWithOrder,
  SubmittedTransaction,
} from "../../../../features/transactions/transactionsSlice";
import findEthOrTokenByAddress from "../../../../helpers/findEthOrTokenByAddress";
import getTimeBetweenTwoDates from "../../../../helpers/getTimeBetweenTwoDates";
import ProgressBar from "../../../ProgressBar/ProgressBar";
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
   * All token metadata
   */
  tokens: TokenInfo[];
  /**
   * chainId of current Ethereum net
   */
  chainId: number;
}

const WalletTransaction = ({
  transaction,
  tokens,
  chainId,
  animate,
  initial,
  transition,
}: WalletTransactionProps) => {
  const { t } = useTranslation();

  const statusText = useMemo(() => {
    return getWalletTransactionStatusText(transaction.status, t);
  }, [transaction.status, t]);

  if (transaction.type === "Approval") {
    const tx: SubmittedApproval = transaction as SubmittedApproval;
    const approvalToken = findTokenByAddress(tx.tokenAddress, tokens);
    //@ts-ignore
    const timeBetween = getTimeBetweenTwoDates(new Date(tx.timestamp), t);
    return (
      <Container transition={transition} animate={animate} initial={initial}>
        <TextContainer>
          <>
            <SpanTitle>
              {t("wallet.approve", { symbol: approvalToken?.symbol })}
            </SpanTitle>
            <SpanSubtitle>
              {statusText} · {timeBetween}
            </SpanSubtitle>
          </>
        </TextContainer>
        {tx.hash && <StyledTransactionLink chainId={chainId} hash={tx.hash} />}
      </Container>
    );
  } else {
    const tx: SubmittedTransactionWithOrder =
      transaction as SubmittedTransactionWithOrder;
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
    //@ts-ignore
    const timeBetween = getTimeBetweenTwoDates(new Date(tx.timestamp), t);

    return (
      <Container transition={transition} animate={animate} initial={initial}>
        {tx.status === "processing" && (
          <RotatedIcon name="swap" iconSize={1.25} />
        )}
        <TextContainer>
          {tx && senderToken && signerToken && (
            <>
              <SpanTitle hasProgress={hasExpiry && tx.status === "processing"}>
                {t(
                  tx.protocol === "last-look"
                    ? "wallet.lastLookTransaction"
                    : "wallet.transaction",
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
                  {statusText} · {timeBetween}
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

export default WalletTransaction;
