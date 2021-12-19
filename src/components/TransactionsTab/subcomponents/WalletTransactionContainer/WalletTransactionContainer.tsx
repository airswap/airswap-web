import { useEffect } from "react";

import { TokenInfo } from "@airswap/types";

import { usePresence } from "framer-motion";

import { SubmittedTransaction } from "../../../../features/transactions/transactionsSlice";
import WalletTransaction from "../WalletTransaction/WalletTransaction";
import { Container } from "./WalletTransactionContainer.styles";

interface WalletTransactionProps {
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

const WalletTransactionContainer = ({
  transaction,
  tokens,
  chainId,
}: WalletTransactionProps) => {
  const [isPresent, safeToRemove] = usePresence();

  useEffect(() => {
    !isPresent && safeToRemove && setTimeout(safeToRemove, 300);
  }, [isPresent, safeToRemove, transaction]);

  return (
    <Container
      animate={{ height: "4.125rem" }}
      initial={{ height: "0rem" }}
      exit={{
        height: "0rem",
        transition: {
          duration: 0.3,
        },
      }}
      transition={{
        duration: 0.3,
      }}
    >
      <WalletTransaction
        animate={{ borderColor: "#1A1E25" }}
        initial={{ borderColor: "#FFFFFF" }}
        transition={{
          delay: 0.3,
          duration: 2,
        }}
        transaction={transaction}
        tokens={tokens}
        chainId={chainId}
      />
    </Container>
  );
};

export { WalletTransactionContainer };
