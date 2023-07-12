import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { TokenInfo } from "@airswap/types";
import { formatUnits } from "@ethersproject/units";

import BigNumber from "bignumber.js";
import { HTMLMotionProps } from "framer-motion";

import {
  SubmittedApproval,
  SubmittedCancellation,
  SubmittedTransactionWithOrder,
  SubmittedTransaction,
} from "../../../../features/transactions/transactionsSlice";
import findEthOrTokenByAddress from "../../../../helpers/findEthOrTokenByAddress";
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
    const timeBetween = getTimeAgoTranslation(new Date(tx.timestamp), t);
    return (
      <Container transition={transition} animate={animate} initial={initial}>
        <TextContainer>
          <SpanTitle>{t("wallet.approve")}</SpanTitle>
          <SpanSubtitle>
            {statusText} · {timeBetween}
          </SpanSubtitle>
        </TextContainer>
        {tx.hash && (
          <StyledTransactionLink hideLabel chainId={chainId} hash={tx.hash} />
        )}
      </Container>
    );
  } else if (transaction.type === "Cancel") {
    const tx: SubmittedCancellation = transaction as SubmittedCancellation;
    const timeBetween = getTimeAgoTranslation(new Date(tx.timestamp), t);
    return (
      <Container transition={transition} animate={animate} initial={initial}>
        <TextContainer>
          <SpanTitle>{t("orders.cancelOrder")}</SpanTitle>
          <SpanSubtitle>
            {statusText} · {timeBetween}
          </SpanSubtitle>
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
    if (tx.protocol === "last-look-erc20") {
      signerAmountWithFee = new BigNumber(tx.order.signerAmount)
        .multipliedBy(1.0007)
        .integerValue(BigNumber.ROUND_FLOOR)
        .toString();
    }
    //@ts-ignore
    const timeBetween = getTimeAgoTranslation(new Date(tx.timestamp), t);

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
                  tx.protocol === "last-look-erc20"
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
        {tx.hash && (
          <StyledTransactionLink hideLabel chainId={chainId} hash={tx.hash} />
        )}
      </Container>
    );
  }
};

export default WalletTransaction;
