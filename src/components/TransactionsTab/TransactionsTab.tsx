import { useEffect, useRef, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { chainCurrencies, chainNames } from "@airswap/constants";
import { TokenInfo } from "@airswap/types";
import { getAccountUrl } from "@airswap/utils";
import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";

import { formatUnits } from "ethers/lib/utils";
import { AnimatePresence, useReducedMotion } from "framer-motion";

import { nativeCurrencyAddress } from "../../constants/nativeCurrency";
import { BalancesState } from "../../features/balances/balancesSlice";
import { SubmittedTransaction } from "../../features/transactions/transactionsSlice";
import useAddressOrEnsName from "../../hooks/useAddressOrEnsName";
import { useKeyPress } from "../../hooks/useKeyPress";
import useMediaQuery from "../../hooks/useMediaQuery";
import useWindowSize from "../../hooks/useWindowSize";
import breakPoints from "../../style/breakpoints";
import Icon from "../Icon/Icon";
import {
  Container,
  WalletHeader,
  Legend,
  LegendLine,
  TransactionContainer,
  TransactionsContainer,
  BottomButtonContainer,
  DisconnectButton,
  NoTransactions,
  IconContainer,
  BackButton,
  NetworkInfoContainer,
  NetworkName,
  Balances,
  LegendContainer,
  MobileBackButton,
  DesktopWalletInfoButton,
  MobileWalletInfoButton,
  StyledWalletMobileMenu,
  BackdropFilter,
} from "./TransactionsTab.styles";
import AnimatedWalletTransaction from "./subcomponents/AnimatedWalletTransaction/AnimatedWalletTransaction";

type TransactionsTabType = {
  address: string;
  chainId: number;
  open: boolean;
  setTransactionsTabOpen: (x: boolean) => void;
  /**
   * Callback function for when disconnect button is clicked
   */
  onDisconnectWalletClicked: () => void;
  transactions: SubmittedTransaction[];
  tokens: TokenInfo[];
  balances: BalancesState;
  isUnsupportedNetwork?: boolean;
};

const TransactionsTab = ({
  address = "",
  chainId,
  open,
  setTransactionsTabOpen,
  onDisconnectWalletClicked,
  transactions = [],
  tokens = [],
  balances,
  isUnsupportedNetwork = false,
}: TransactionsTabType) => {
  const { width, height } = useWindowSize();
  const shouldReduceMotion = useReducedMotion();
  const isMobile = useMediaQuery(breakPoints.phoneOnly);
  const { t } = useTranslation();

  const { active } = useWeb3React<Web3Provider>();

  const [overflow, setOverflow] = useState<boolean>(false);
  const [showMobileMenu, setShowMobileMenu] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const transactionsScrollRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);

  const addressOrName = useAddressOrEnsName(address);
  const walletInfoText = useMemo(() => {
    return isUnsupportedNetwork
      ? t("wallet.unsupported")
      : addressOrName
      ? addressOrName
      : t("wallet.notConnected");
  }, [addressOrName, isUnsupportedNetwork, t]);
  const walletUrl = useMemo(
    () => getAccountUrl(chainId, address),
    [chainId, address]
  );
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
  ]);

  // Every time a new transactions is added, scroll to top.
  useEffect(() => {
    if (transactionsScrollRef && transactionsScrollRef.current) {
      transactionsScrollRef.current.scrollTo({ top: 0 });
    }
  }, [transactionsScrollRef, transactions]);

  const pendingTransactions = useMemo(() => {
    return transactions.filter(
      (transaction) => transaction.status === "processing"
    );
  }, [transactions]);

  const completedTransactions = useMemo(() => {
    return transactions
      .filter((transaction) => transaction.status !== "processing")
      .sort((a, b) => b.timestamp - a.timestamp);
  }, [transactions]);

  const balance = balances.values[nativeCurrencyAddress] || "0";

  return (
    <AnimatePresence initial={false}>
      {open && (
        <Container
          ref={containerRef}
          animate={{ x: 0 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.3 }}
          initial={{ x: isMobile ? "100%" : "24rem" }}
          exit={{ x: isMobile ? "100%" : "24rem" }}
        >
          <BackButton
            aria-label={t("common.back")}
            animate={{ y: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.5 }}
            initial={{ y: "-5rem" }}
            exit={{ opacity: 0 }}
            onClick={() => setTransactionsTabOpen(false)}
          >
            <Icon name="chevron-right" iconSize={1.5} />
          </BackButton>
          <WalletHeader>
            <NetworkInfoContainer>
              <NetworkName>
                {chainNames[chainId] || t("wallet.unsupported")}
              </NetworkName>
              {active && (
                <Balances>
                  {formatUnits(balance).substring(0, 4)}{" "}
                  {chainCurrencies[chainId]}
                </Balances>
              )}
            </NetworkInfoContainer>
            <DesktopWalletInfoButton
              isConnected={active}
              onClick={setTransactionsTabOpen.bind(null, false)}
            >
              {walletInfoText}
            </DesktopWalletInfoButton>
            <MobileWalletInfoButton onClick={toggleWalletMobileMenu}>
              {walletInfoText}
            </MobileWalletInfoButton>
            {showMobileMenu && (
              <StyledWalletMobileMenu
                walletUrl={walletUrl}
                address={address}
                onDisconnectButtonClick={onDisconnectWalletClicked}
              />
            )}
          </WalletHeader>

          <TransactionsContainer
            ref={transactionsScrollRef}
            $overflow={overflow}
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
                    key={`${transaction.hash}-${transaction.nonce}-${transaction.expiry}-pending`}
                    transaction={transaction}
                    tokens={tokens}
                    chainId={chainId!}
                  />
                ))}
              </AnimatePresence>
            </TransactionContainer>
            <LegendContainer $isVisible>
              <Legend>
                <LegendLine>
                  {t("wallet.completedTransactions").toUpperCase()}
                </LegendLine>
              </Legend>
            </LegendContainer>
            <TransactionContainer>
              <AnimatePresence initial={false}>
                {completedTransactions.slice(0, 10).map((transaction) => (
                  <AnimatedWalletTransaction
                    key={`${transaction.hash}-${transaction.nonce}-${transaction.expiry}`}
                    transaction={transaction}
                    tokens={tokens}
                    chainId={chainId!}
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
            <DisconnectButton
              aria-label={t("wallet.disconnectWallet")}
              onClick={onDisconnectWalletClicked}
            >
              {t("wallet.disconnectWallet")}
            </DisconnectButton>
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
