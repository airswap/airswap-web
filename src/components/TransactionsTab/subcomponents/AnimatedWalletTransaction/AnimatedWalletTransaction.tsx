import { useEffect, useMemo, useState } from "react";

import { TokenInfo } from "@airswap/types";

import { useReducedMotion } from "framer-motion";
import { useTheme } from "styled-components";

import { SubmittedTransaction } from "../../../../features/transactions/transactionsSlice";
import WalletTransaction from "../WalletTransaction/WalletTransaction";
import { walletTransactionHeight } from "../WalletTransaction/WalletTransaction.styles";
import { Container } from "./AnimatedWalletTransaction.styles";

interface AnimatedWalletTransactionProps {
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

const AnimatedWalletTransaction = ({
  transaction,
  tokens,
  chainId,
}: AnimatedWalletTransactionProps) => {
  const theme = useTheme();
  const shouldReduceMotion = useReducedMotion();

  const [isMounted, setIsMounted] = useState(false);

  const themeHasChanged = useMemo(() => isMounted, [theme.name]); // eslint-disable-line react-hooks/exhaustive-deps

  // Prevents all older (half hour) transactions animating simultaneously when user changes wallet
  const transactionTooOld = useMemo(
    () => (new Date().getTime() - transaction.timestamp) / 1000 > 1800,
    [transaction]
  );

  const heightAnimationDuration =
    shouldReduceMotion || transactionTooOld ? 0 : 0.3;

  // Border transition doesn't clear after animation ends, so when changing theme
  // the border color animates, which looks weird.
  const borderAnimationDuration = themeHasChanged ? 0 : 2;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <Container
      animate={{ height: walletTransactionHeight }}
      initial={!transactionTooOld && { height: "0rem" }}
      exit={{
        height: "0rem",
        transition: {
          duration: heightAnimationDuration,
        },
      }}
      transition={{
        duration: heightAnimationDuration,
      }}
    >
      <WalletTransaction
        animate={{ borderColor: theme.colors.borderGrey }}
        initial={!transactionTooOld && { borderColor: theme.colors.white }}
        transition={{
          delay: heightAnimationDuration,
          duration: borderAnimationDuration,
        }}
        transaction={transaction}
        tokens={tokens}
        chainId={chainId}
      />
    </Container>
  );
};

export default AnimatedWalletTransaction;
