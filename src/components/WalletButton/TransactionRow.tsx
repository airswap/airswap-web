import {
  SubmittedApproval,
  SubmittedOrder,
  SubmittedTransaction,
} from "../../features/transactions/transactionsSlice";
import getTimeBetweenTwoDates from "../../helpers/getTimeBetweenTwoDates";
import { Container, TextContainer, Span, Link } from "./TransactionRow.styles";
import { getEtherscanURL } from "@airswap/utils";
import { formatUnits } from "@ethersproject/units";
import { TokenInfo } from "@uniswap/token-lists";
import { HiOutlineCheck, HiX } from "react-icons/hi";
import { MdOpenInNew } from "react-icons/md";
import { RiLoader2Fill } from "react-icons/ri";

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
   * List of all token info from metadata
   */
  token: TokenInfo | undefined;
};

export const TransactionRow = ({
  transaction,
  token,
  type,
  chainId,
}: TransactionRowProps) => {
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
          {tx && token ? (
            <>
              <Span>
                {`${parseFloat(
                  Number(
                    formatUnits(tx.order.senderAmount, token.decimals)
                  ).toFixed(5)
                )} ${token.symbol} -> ${parseFloat(
                  Number(
                    formatUnits(tx.order.signerAmount, token.decimals)
                  ).toFixed(5)
                )} ${token.symbol}`}
              </Span>
              <Span>
                {tx.status === "succeeded"
                  ? "Success"
                  : tx.status === "processing"
                  ? "Processing"
                  : "Failed"}{" "}
                ·{" "}
                {tx.timestamp
                  ? getTimeBetweenTwoDates(new Date(tx.timestamp))
                  : "undefined"}
              </Span>
            </>
          ) : null}
        </TextContainer>
        <Span></Span>
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
        <TextContainer>Approve {token!.symbol}</TextContainer>
        <Span></Span>
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
