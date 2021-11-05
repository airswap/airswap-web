import { useCallback, useEffect, useRef, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { TokenInfo } from "@airswap/types";

import { SubmittedTransaction } from "../../features/transactions/transactionsSlice";
import useWindowSize from "../../helpers/useWindowSize";
import useAddressOrEnsName from "../../hooks/useAddressOrEnsName";
import Icon from "../Icon/Icon";
import { StyledBlockies } from "../WalletButton/subcomponents/WalletAddress/WalletAddress.styles";
import {
  Container,
  BackgroundOverlay,
  WalletHeader,
  BlockiesContainer,
  WalletAddress,
  WalletLinkContainer,
  Legend,
  LegendLine,
  TransactionContainer,
  TransactionsContainer,
  DiconnectButtonContainer,
  DisconnectButton,
  NoTransactions,
  IconContainer,
} from "./TransactionsTab.styles";
import WalletLink from "./subcomponents/WalletLink/WalletLink";
import { WalletTransaction } from "./subcomponents/WalletTransaction/WalletTransaction";

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
};

const TransactionsTab = ({
  address = "",
  chainId,
  open,
  setTransactionsTabOpen,
  onDisconnectWalletClicked,
  transactions = [],
  tokens = [],
}: TransactionsTabType) => {
  const { width, height } = useWindowSize();

  const [overflow, setOverflow] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const transactionsScrollRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation(["wallet"]);

  const addressOrName = useAddressOrEnsName(address);

  const handleClick = useCallback(
    (e) => {
      if (containerRef.current && containerRef.current.contains(e.target)) {
        return;
      }
      setTransactionsTabOpen(false);
    },
    [setTransactionsTabOpen]
  );

  const handleEscKey = useCallback(
    (e) => {
      if (e.keyCode === 27) {
        setTransactionsTabOpen(false);
      }
    },
    [setTransactionsTabOpen]
  );

  useEffect(() => {
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleEscKey, false);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleEscKey, false);
    };
  }, [handleClick, handleEscKey]);

  useEffect(() => {
    if (containerRef.current && transactionsScrollRef.current) {
      const { offsetTop, scrollHeight } = transactionsScrollRef.current;
      // subtracting 78 to account for the disconnect button on the bottom
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

  return (
    <>
      <BackgroundOverlay open={open} />
      <Container open={open} ref={containerRef}>
        <WalletHeader>
          <BlockiesContainer>
            <StyledBlockies
              size={8}
              scale={5}
              seed={address}
              bgColor="black"
              color="#2b72ff"
            />
          </BlockiesContainer>
          <WalletLinkContainer>
            <WalletAddress>{addressOrName}</WalletAddress>
            <WalletLink chainId={chainId!} address={address!} />
          </WalletLinkContainer>
        </WalletHeader>

        <TransactionsContainer ref={transactionsScrollRef} $overflow={overflow}>
          <Legend>
            <LegendLine>{t("wallet:activeTransactions")}</LegendLine>
          </Legend>
          <TransactionContainer>
            {pendingTransactions.length ? (
              pendingTransactions.map((transaction) => (
                <WalletTransaction
                  transaction={transaction}
                  tokens={tokens}
                  chainId={chainId!}
                  key={`${transaction.hash}-${transaction.nonce}`}
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
              <LegendLine>{t("wallet:completedTransactions")}</LegendLine>
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
                    key={transaction.hash}
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
    </>
  );
};

export default TransactionsTab;
