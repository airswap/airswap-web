import { useTranslation } from "react-i18next";
import { HiX } from "react-icons/hi";
import { MdBeenhere, MdError } from "react-icons/md";

import { TokenInfo } from "@airswap/types";

import { formatUnits } from "ethers/lib/utils";

import {
  SubmittedOrder,
  SubmittedTransaction,
  TransactionType,
} from "../../features/transactions/transactionsSlice";
import { InfoHeading, InfoSubHeading } from "../Typography/Typography";
import {
  Container,
  HiXContainer,
  IconContainer,
  TextContainer,
} from "./Toast.styles";

export type TransactionToastProps = {
  /**
   * Function to trigger closing of toast
   */
  onClose: () => void;
  /**
   * Error affects whether the icon colors show up as blue or red;
   */
  error: boolean;
  /**
   * The parent object of SubmittedOrder and SubmittedApproval
   */
  transaction: SubmittedTransaction;
  /**
   * Type of transaction the toast will display;
   */
  type: TransactionType;
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

const TransactionToast = ({
  onClose,
  error,
  transaction,
  type,
  senderToken,
  signerToken,
  approvalToken,
}: TransactionToastProps) => {
  const { t } = useTranslation(["toast"]);

  return (
    <Container>
      <IconContainer error={error}>
        {error ? (
          <MdError style={{ width: "1.25rem", height: "1.25rem" }} />
        ) : (
          <MdBeenhere style={{ width: "1.25rem", height: "1.25rem" }} />
        )}
      </IconContainer>
      <TextContainer>
        <InfoHeading>
          {type === "Order" || type === "Deposit" || type === "Withdraw"
            ? error
              ? t("toast:swapFail")
              : t("toast:swapComplete")
            : error
            ? t("toast:approvalFail")
            : t("toast:approvalComplete")}
        </InfoHeading>
        <InfoSubHeading>
          {type === "Order" || type === "Deposit" || type === "Withdraw"
            ? transaction && senderToken && signerToken
              ? t("toast:transaction", {
                  senderAmount: parseFloat(
                    Number(
                      formatUnits(
                        (transaction as SubmittedOrder).order.senderAmount,
                        senderToken.decimals
                      )
                    ).toFixed(5)
                  ),
                  senderToken: senderToken.symbol,
                  signerAmount: parseFloat(
                    Number(
                      formatUnits(
                        (transaction as SubmittedOrder).order.signerAmount,
                        signerToken.decimals
                      )
                    ).toFixed(5)
                  ),
                  signerToken: signerToken.symbol,
                })
              : null
            : t("toast:approve", { symbol: approvalToken?.symbol })}
        </InfoSubHeading>
      </TextContainer>
      <HiXContainer>
        <HiX
          style={{
            width: "1rem",
            height: "1rem",
            cursor: "pointer",
          }}
          onClick={onClose}
        />
      </HiXContainer>
    </Container>
  );
};

export default TransactionToast;
