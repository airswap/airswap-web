import { useTranslation } from "react-i18next";
import { HiOutlineCheck, HiX } from "react-icons/hi";
import { MdOpenInNew } from "react-icons/md";
import { RiLoader2Fill } from "react-icons/ri";

import { getEtherscanURL } from "@airswap/utils";
import { formatUnits } from "@ethersproject/units";
import { TokenInfo } from "@uniswap/token-lists";

import {
  SubmittedApproval,
  SubmittedOrder,
  SubmittedTransaction,
} from "../../features/transactions/transactionsSlice";
import getTimeBetweenTwoDates from "../../helpers/getTimeBetweenTwoDates";
import {
  Container,
  TextContainer,
  SpanTitle,
  SpanSubtitle,
  Link,
} from "./TransactionRow.styles";

type TransactionRowProps = {
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

export const TransactionRow = ({
  transaction,
  type,
  chainId,
  senderToken,
  signerToken,
  approvalToken,
}: TransactionRowProps) => {
  const { t } = useTranslation(["common", "wallet"]);

  if (type === "Order") {
    const tx: SubmittedOrder = transaction as SubmittedOrder;
    return (
      <Container>
        {tx.status === "succeeded" ? (
          <HiOutlineCheck />
        ) : tx.status === "processing" ? (
          <RiLoader2Fill />
        ) : (
          <HiX />
        )}
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
                  ? getTimeBetweenTwoDates(new Date(tx.timestamp))
                  : t("common:undefined")}
              </SpanSubtitle>
            </>
          )}
        </TextContainer>
        <SpanTitle></SpanTitle>
        <Link
          target="_blank"
          rel="noreferrer"
          href={`${getEtherscanURL(`${chainId}`, tx.hash)}`}
        >
          <MdOpenInNew />
        </Link>
      </Container>
    );
  } else if (transaction.type === "Approval") {
    const tx: SubmittedApproval = transaction as SubmittedApproval;
    return (
      <Container>
        {tx.status === "succeeded" ? (
          <HiOutlineCheck />
        ) : tx.status === "processing" ? (
          <RiLoader2Fill />
        ) : (
          <HiX />
        )}
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
                ? getTimeBetweenTwoDates(new Date(tx.timestamp))
                : t("common:undefined")}
            </SpanSubtitle>
          </>
        )}
        <Link
          target="_blank"
          rel="noreferrer"
          href={`${getEtherscanURL(`${chainId}`, tx.hash)}`}
        >
          <MdOpenInNew />
        </Link>
      </Container>
    );
  }
  return <div></div>;
};
