import { useTranslation } from "react-i18next";
import { HiX } from "react-icons/hi";
import { MdBeenhere, MdError } from "react-icons/md";

import { TokenInfo } from "@airswap/utils";

import { formatUnits } from "ethers/lib/utils";

import {
  SubmittedLastLookOrder,
  SubmittedRFQOrder,
  SubmittedTransaction,
} from "../../entities/SubmittedTransaction/SubmittedTransaction";
import { isLastLookOrderTransaction } from "../../entities/SubmittedTransaction/SubmittedTransactionHelpers";
import { TransactionTypes } from "../../types/transactionTypes";
import { InfoHeading } from "../Typography/Typography";
import {
  Container,
  HiXContainer,
  IconContainer,
  SwapAmounts,
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
  error?: boolean;
  /**
   * The parent object of SubmittedOrder and SubmittedApproval
   */
  transaction: SubmittedTransaction;
  /**
   * Type of transaction the toast will display;
   */
  type: TransactionTypes;
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
  error = false,
  transaction,
  type,
  senderToken,
  signerToken,
  approvalToken,
}: TransactionToastProps) => {
  const { t } = useTranslation();

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
          {type === TransactionTypes.order ||
          type === TransactionTypes.deposit ||
          type === TransactionTypes.withdraw
            ? error
              ? t("toast.swapFail")
              : t("toast.swapComplete")
            : error
            ? t("toast.approvalFail")
            : t("toast.approvalComplete")}
        </InfoHeading>
        <SwapAmounts>
          {(() => {
            if (
              type === TransactionTypes.order ||
              type === TransactionTypes.deposit ||
              type === TransactionTypes.withdraw
            ) {
              if (transaction && senderToken && signerToken) {
                const tx = isLastLookOrderTransaction(transaction)
                  ? (transaction as SubmittedLastLookOrder)
                  : (transaction as SubmittedRFQOrder);
                let translationKey = "wallet.transaction";
                if (tx.isLastLook) {
                  translationKey = "wallet.lastLookTransaction";
                }
                // @ts-ignore dynamic translation key
                return t(translationKey, {
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
                });
              }
            }
            return t("toast.approve", { symbol: approvalToken?.symbol });
          })()}
        </SwapAmounts>
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
