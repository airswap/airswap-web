import { useEffect, useRef, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { AnimatePresence, useReducedMotion } from "framer-motion";

import { useAppSelector } from "../../app/hooks";
import { SubmittedTransaction } from "../../entities/SubmittedTransaction/SubmittedTransaction";
import { getSubmittedTransactionKey } from "../../entities/SubmittedTransaction/SubmittedTransactionHelpers";
import useIsOverflowing from "../../hooks/useIsOverflowing";
import { useKeyPress } from "../../hooks/useKeyPress";
import useMediaQuery from "../../hooks/useMediaQuery";
import useWindowSize from "../../hooks/useWindowSize";
import breakPoints from "../../style/breakpoints";
import { ClearOrderType } from "../../types/clearOrderType";
import { TransactionStatusType } from "../../types/transactionTypes";
import Icon from "../Icon/Icon";
import {
  Container,
  Legend,
  LegendLine,
  TransactionContainer,
  TransactionsContainer,
  BottomButtonContainer,
  DisconnectButton,
  NoTransactions,
  IconContainer,
  LegendContainer,
  MobileBackButton,
  BackdropFilter,
  ConnectButton,
} from "./TransactionsTab.styles";
import useClickOutsideTransactionsTab from "./hooks/useClickOutsideTransactionsTab";
import AnimatedWalletTransaction from "./subcomponents/AnimatedWalletTransaction/AnimatedWalletTransaction";
import ClearTransactionsSelector from "./subcomponents/ClearTransactionsSelector/ClearTransactionsSelector";

interface TransactionsTabProps {
  account: string;
  chainId: number;
  open: boolean;
  protocolFee: number;
  setTransactionsTabOpen: (x: boolean) => void;
  onClearTransactionsChange: (value: ClearOrderType) => void;
  onConnectButtonClick: () => void;
  onDisconnectButtonClick: () => void;
  transactions: SubmittedTransaction[];
}

const TransactionsTab = ({
  account = "",
  chainId,
  open,
  protocolFee,
  setTransactionsTabOpen,
  onClearTransactionsChange,
  onConnectButtonClick,
  onDisconnectButtonClick,
  transactions = [],
}: TransactionsTabProps) => {
  const { width, height } = useWindowSize();
  const shouldReduceMotion = useReducedMotion();
  const isMobile = useMediaQuery(breakPoints.phoneOnly);
  const { t } = useTranslation();

  const { isActive } = useAppSelector((state) => state.web3);

  const [overflow, setOverflow] = useState<boolean>(false);
  const [showMobileMenu, setShowMobileMenu] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const transactionsScrollRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);

  useKeyPress(() => setTransactionsTabOpen(false), ["Escape"]);
  useClickOutsideTransactionsTab(() => setTransactionsTabOpen(false));

  const toggleWalletMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
  };

  useEffect(() => {
    if (!open) {
      setShowMobileMenu(false);
    }
  }, [open]);

  useEffect(() => {
    if (
      containerRef.current &&
      transactionsScrollRef.current &&
      buttonRef.current
    ) {
      const { offsetTop, scrollHeight } = transactionsScrollRef.current;
      const containerHeight =
        containerRef.current.getBoundingClientRect().height;
      const buttonHeight = buttonRef.current.getBoundingClientRect().height;
      setOverflow(scrollHeight + offsetTop > containerHeight - buttonHeight);
    }
  }, [
    containerRef,
    transactionsScrollRef,
    buttonRef,
    width,
    height,
    open,
    transactions,
  ]);

  // Every time a new transactions is added, scroll to top.
  useEffect(() => {
    if (transactionsScrollRef && transactionsScrollRef.current) {
      transactionsScrollRef.current.scrollTo({ top: 0 });
    }
  }, [transactionsScrollRef, transactions]);

  const pendingTransactions = useMemo(() => {
    return transactions.filter(
      (transaction) => transaction.status === TransactionStatusType.processing
    );
  }, [transactions]);

  const completedTransactions = useMemo(() => {
    return transactions
      .filter(
        (transaction) => transaction.status !== TransactionStatusType.processing
      )
      .sort((a, b) => b.timestamp - a.timestamp);
  }, [transactions]);

  return (
    <AnimatePresence initial={false}>
      {open && (
        <Container
          ref={containerRef}
          animate={{ x: 0 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.3 }}
          initial={{ x: isMobile ? "100%" : "27.75rem" }}
          exit={{ x: isMobile ? "100%" : "27.75rem" }}
        >
          <TransactionsContainer
            ref={transactionsScrollRef}
            hasOverflow={overflow}
          >
            <LegendContainer $isVisible={!!pendingTransactions.length}>
              <Legend>
                <LegendLine>
                  {t("wallet.activeTransactions").toUpperCase()}
                </LegendLine>
              </Legend>
            </LegendContainer>
            <TransactionContainer $isEmpty={!pendingTransactions.length}>
              <AnimatePresence initial={false}>
                {pendingTransactions.map((transaction) => (
                  <AnimatedWalletTransaction
                    key={getSubmittedTransactionKey(transaction)}
                    protocolFee={protocolFee}
                    transaction={transaction}
                    chainId={chainId!}
                    account={account}
                  />
                ))}
              </AnimatePresence>
            </TransactionContainer>
            <LegendContainer $isVisible>
              <Legend>
                <LegendLine>{t("wallet.completedTransactions")}</LegendLine>
              </Legend>
              <ClearTransactionsSelector onChange={onClearTransactionsChange} />
            </LegendContainer>
            <TransactionContainer>
              <AnimatePresence initial={false}>
                {completedTransactions.map((transaction) => (
                  <AnimatedWalletTransaction
                    key={getSubmittedTransactionKey(transaction)}
                    protocolFee={protocolFee}
                    transaction={transaction}
                    chainId={chainId!}
                    account={account}
                  />
                ))}
              </AnimatePresence>
              {!completedTransactions.length && (
                <NoTransactions>
                  <IconContainer>
                    <Icon name="transaction" />
                  </IconContainer>
                  {t("wallet.noCompletedTransactions")}
                </NoTransactions>
              )}
            </TransactionContainer>
          </TransactionsContainer>
          <BottomButtonContainer ref={buttonRef}>
            {isActive ? (
              <DisconnectButton onClick={onDisconnectButtonClick}>
                {t("wallet.disconnectWallet")}
              </DisconnectButton>
            ) : (
              <ConnectButton onClick={onConnectButtonClick}>
                {t("wallet.connectWallet")}
              </ConnectButton>
            )}
            <MobileBackButton
              aria-label={t("common.back")}
              onClick={() => setTransactionsTabOpen(false)}
            >
              {t("common.back")}
            </MobileBackButton>
          </BottomButtonContainer>
          {showMobileMenu && (
            <BackdropFilter onClick={toggleWalletMobileMenu} />
          )}
        </Container>
      )}
    </AnimatePresence>
  );
};

export default TransactionsTab;
