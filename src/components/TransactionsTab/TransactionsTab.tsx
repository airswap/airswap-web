import { useCallback, useEffect, useRef, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { TokenInfo } from "@airswap/types";

import { formatUnits } from "ethers/lib/utils";
import { AnimatePresence } from "framer-motion";

import { BalancesState } from "../../features/balances/balancesSlice";
import { SubmittedTransaction } from "../../features/transactions/transactionsSlice";
import useWindowSize from "../../helpers/useWindowSize";
import useAddressOrEnsName from "../../hooks/useAddressOrEnsName";
import Icon from "../Icon/Icon";
import { InfoHeading } from "../Typography/Typography";
import {
  Container,
  WalletHeader,
  Legend,
  LegendLine,
  TransactionContainer,
  TransactionsContainer,
  DiconnectButtonContainer,
  DisconnectButton,
  NoTransactions,
  IconContainer,
  BackButton,
  NetworkInfoContainer,
  NetworkName,
  Balances,
  WalletAnchorTag,
  ConnectionStatusCircle,
} from "./TransactionsTab.styles";
import { WalletTransaction } from "./subcomponents/WalletTransaction/WalletTransaction";

const addressMapping: Record<number, string> = {
  1: "Mainnet",
  4: "Rinkeby",
};

const hrefAddressMapping: Record<number, string> = {
  1: "",
  4: "rinkeby.",
};

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

  const [overflow, setOverflow] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const transactionsScrollRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation(["wallet"]);

  const addressOrName = useAddressOrEnsName(address);

  const handleEscKey = useCallback(
    (e) => {
      if (e.keyCode === 27) {
        setTransactionsTabOpen(false);
      }
    },
    [setTransactionsTabOpen]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleEscKey, false);
    return () => {
      document.removeEventListener("keydown", handleEscKey, false);
    };
  }, [handleEscKey]);

  useEffect(() => {
    if (containerRef.current && transactionsScrollRef.current) {
      const { offsetTop, scrollHeight } = transactionsScrollRef.current;
      // subtracting 86 to account for the disconnect button on the bottom
      setOverflow(
        scrollHeight + offsetTop > containerRef.current.offsetHeight - 86
      );
    }
  }, [containerRef, transactionsScrollRef, width, height]);

  const pendingTransactions = useMemo(() => {
    return transactions.filter(
      (transaction) => transaction.status === "processing"
    );
  }, [transactions]);

  const completedTransactions = useMemo(() => {
    return transactions.filter(
      (transaction) => transaction.status !== "processing"
    );
  }, [transactions]);

  const balance =
    balances.values["0x0000000000000000000000000000000000000000"] || "0";

  return (
    <AnimatePresence>
      {open && (
        <Container
          ref={containerRef}
          animate={{ x: 0 }}
          transition={{ duration: 0.3 }}
          initial={{ x: "24rem" }}
          exit={{ x: "24rem" }}
        >
          <BackButton
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
            initial={{ y: "-5rem" }}
            exit={{ opacity: 0 }}
            onClick={() => setTransactionsTabOpen(false)}
          >
            <Icon name="chevron-right" iconSize={1} />
          </BackButton>
          <WalletHeader>
            <NetworkInfoContainer>
              <NetworkName>
                {addressMapping[chainId] || t("wallet:unsupported")}
              </NetworkName>
              <Balances>{formatUnits(balance).substring(0, 5)} ETH</Balances>
            </NetworkInfoContainer>
            <WalletAnchorTag
              target="_blank"
              rel="noreferrer"
              href={
                chainId
                  ? `https://${hrefAddressMapping[chainId]}etherscan.io/address/${address}`
                  : ""
              }
            >
              <ConnectionStatusCircle $connected={!!address} />
              <InfoHeading>
                {isUnsupportedNetwork
                  ? t("wallet:unsupported")
                  : addressOrName
                  ? addressOrName
                  : t("wallet:notConnected")}
              </InfoHeading>
            </WalletAnchorTag>
          </WalletHeader>

          <TransactionsContainer
            ref={transactionsScrollRef}
            $overflow={overflow}
          >
            <Legend>
              <LegendLine>
                {t("wallet:activeTransactions").toUpperCase()}
              </LegendLine>
            </Legend>
            <TransactionContainer>
              {pendingTransactions.length ? (
                pendingTransactions.map((transaction) => (
                  <WalletTransaction
                    transaction={transaction}
                    tokens={tokens}
                    chainId={chainId!}
                    key={`${transaction.hash}-${transaction.nonce}-${transaction.expiry}`}
                  />
                ))
              ) : (
                <NoTransactions>
                  <IconContainer>
                    <Icon name="transaction" />
                  </IconContainer>
                  {t("wallet:noActiveTransactions")}
                </NoTransactions>
              )}
            </TransactionContainer>
            {completedTransactions && (
              <Legend>
                <LegendLine>
                  {t("wallet:completedTransactions").toUpperCase()}
                </LegendLine>
              </Legend>
            )}
            <TransactionContainer>
              {completedTransactions.length > 0 ? (
                completedTransactions
                  .slice(0, 10)
                  .map((transaction) => (
                    <WalletTransaction
                      transaction={transaction}
                      tokens={tokens}
                      chainId={chainId!}
                      key={`${transaction.hash}-${transaction.nonce}-${transaction.expiry}`}
                    />
                  ))
              ) : (
                <NoTransactions>
                  <IconContainer>
                    <Icon name="transaction" />
                  </IconContainer>
                  {t("wallet:noCompletedTransactions")}
                </NoTransactions>
              )}
            </TransactionContainer>
          </TransactionsContainer>
          <DiconnectButtonContainer>
            <DisconnectButton
              aria-label={t("wallet:disconnectWallet")}
              onClick={onDisconnectWalletClicked}
            >
              {t("wallet:disconnectWallet")}
            </DisconnectButton>
          </DiconnectButtonContainer>
        </Container>
      )}
    </AnimatePresence>
  );
};

export default TransactionsTab;
