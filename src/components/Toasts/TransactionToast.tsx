import { useTranslation } from "react-i18next";
import { HiX } from "react-icons/hi";
import { MdBeenhere, MdError } from "react-icons/md";

import { TokenInfo } from "@airswap/types";

import { formatUnits } from "ethers/lib/utils";

import {
  SubmittedLastLookOrder,
  SubmittedRFQOrder,
  SubmittedTransaction,
  TransactionType,
} from "../../features/transactions/transactionsSlice";
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
          {type === "Order" || type === "Deposit" || type === "Withdraw"
            ? error
              ? t("toast.swapFail")
              : t("toast.swapComplete")
            : error
            ? t("toast.approvalFail")
            : t("toast.approvalComplete")}
        </InfoHeading>
        <SwapAmounts>
          {(() => {
            if (type === "Order" || type === "Deposit" || type === "Withdraw") {
              if (transaction && senderToken && signerToken) {
                const tx =
                  transaction.protocol === "last-look-erc20"
                    ? (transaction as SubmittedLastLookOrder)
                    : (transaction as SubmittedRFQOrder);
                let translationKey = "wallet.transaction";
                if (tx.protocol === "last-look-erc20") {
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
