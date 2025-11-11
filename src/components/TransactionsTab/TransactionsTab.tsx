import { useEffect, useRef, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { AnimatePresence, useReducedMotion } from "framer-motion";
import { useAtomValue } from "jotai";

import { useAppSelector } from "../../app/hooks";
import { TransactionsTabMenu } from "../../contexts/interface/Interface";
import { SubmittedTransaction } from "../../entities/SubmittedTransaction/SubmittedTransaction";
import { getSubmittedTransactionKey } from "../../entities/SubmittedTransaction/SubmittedTransactionHelpers";
import { useActiveOrdersCount } from "../../hooks/useActiveOrdersCount";
import { useKeyPress } from "../../hooks/useKeyPress";
import useMediaQuery from "../../hooks/useMediaQuery";
import useWindowSize from "../../hooks/useWindowSize";
import breakPoints from "../../style/breakpoints";
import { ClearOrderType } from "../../types/clearOrderType";
import { TransactionStatusType } from "../../types/transactionTypes";
import { myOrdersListLoadingAtom } from "../@widgets/MyOrdersWidget/subcomponents/MyOrdersList/MyOrdersList";
import MyOtcOrdersWidget from "../@widgets/MyOtcOrdersWidget/MyOtcOrdersWidget";
import {
  Container,
  Legend,
  TransactionContainer,
  TransactionsContainer,
  BottomButtonContainer,
  DisconnectButton,
  LegendContainer,
  MobileBackButton,
  BackdropFilter,
  ConnectButton,
  TransactionsTabNavigation,
  TransactionsTabNavigationButton,
} from "./TransactionsTab.styles";
import useClickOutsideTransactionsTab from "./hooks/useClickOutsideTransactionsTab";
import AnimatedWalletTransaction from "./subcomponents/AnimatedWalletTransaction/AnimatedWalletTransaction";
import ClearTransactionsSelector from "./subcomponents/ClearTransactionsSelector/ClearTransactionsSelector";
import { EmptyList } from "./subcomponents/EmptyList/EmptyList";

interface TransactionsTabProps {
  account: string;
  activeTab: TransactionsTabMenu;
  chainId: number;
  open: boolean;
  protocolFee: number;
  setTransactionsTabOpen: (x: boolean) => void;
  setTransactionsTabMenu: (x: TransactionsTabMenu) => void;
  onClearTransactionsChange: (value: ClearOrderType) => void;
  onConnectButtonClick: () => void;
  onDisconnectButtonClick: () => void;
  transactions: SubmittedTransaction[];
}

const TransactionsTab = ({
  account = "",
  activeTab,
  chainId,
  open,
  protocolFee,
  setTransactionsTabOpen,
  setTransactionsTabMenu,
  onClearTransactionsChange,
  onConnectButtonClick,
  onDisconnectButtonClick,
  transactions,
}: TransactionsTabProps) => {
  const { width, height } = useWindowSize();
  const shouldReduceMotion = useReducedMotion();
  const isMobile = useMediaQuery(breakPoints.phoneOnly);
  const { t } = useTranslation();

  const { isActive } = useAppSelector((state) => state.web3);

  const [overflow, setOverflow] = useState<boolean>(false);
  const [showMobileMenu, setShowMobileMenu] = useState<boolean>(false);

  const isLoadingOtcOrders = useAtomValue(myOrdersListLoadingAtom);
  const containerRef = useRef<HTMLDivElement>(null);
  const transactionsScrollRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);
  const activeOrdersCount = useActiveOrdersCount();

  useKeyPress(() => setTransactionsTabOpen(false), ["Escape"]);

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
    activeTab,
    isLoadingOtcOrders,
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
          <TransactionsTabNavigation>
            <TransactionsTabNavigationButton
              isActive={activeTab === "myActivity"}
              onClick={() => setTransactionsTabMenu("myActivity")}
            >
              My activity
            </TransactionsTabNavigationButton>
            <TransactionsTabNavigationButton
              isActive={activeTab === "myOrders"}
              onClick={() => setTransactionsTabMenu("myOrders")}
            >
              {`My orders ${activeOrdersCount ? `(${activeOrdersCount})` : ""}`}
            </TransactionsTabNavigationButton>
          </TransactionsTabNavigation>

          <TransactionsContainer
            ref={transactionsScrollRef}
            hasOverflow={overflow}
          >
            {activeTab === "myActivity" ? (
              <>
                <LegendContainer $isVisible={!!pendingTransactions.length}>
                  <Legend>
                    {t("wallet.activeTransactions").toUpperCase()}
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
                <LegendContainer
                  $isVisible={isActive && !!completedTransactions.length}
                >
                  <Legend>{t("wallet.completedTransactions")}</Legend>
                  <ClearTransactionsSelector
                    onChange={onClearTransactionsChange}
                  />
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
                  {isActive && !completedTransactions.length && (
                    <EmptyList>{t("wallet.noCompletedTransactions")}</EmptyList>
                  )}
                </TransactionContainer>
              </>
            ) : (
              <MyOtcOrdersWidget />
            )}
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
