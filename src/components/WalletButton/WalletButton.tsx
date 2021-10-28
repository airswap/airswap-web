import { useTranslation } from "react-i18next";

import { findTokenByAddress } from "@airswap/metadata";
import { TokenInfo } from "@airswap/types";

import {
  SubmittedApproval,
  SubmittedOrder,
  SubmittedTransaction,
} from "../../features/transactions/transactionsSlice";
import findEthOrTokenByAddress from "../../helpers/findEthOrTokenByAddress";
import {
  OpenWallet,
  ExitButton,
  DisconnectButton,
  TransactionContainer,
  OpenWalletTopContainer,
  StyledWalletAddress,
  NoTransactions,
} from "./WalletButton.styles";
import WalletAddress from "./subcomponents/WalletAddress/WalletAddress";
import { WalletTransaction } from "./subcomponents/WalletTransaction/WalletTransaction";

export type WalletButtonProps = {
  /**
   * Address of currenlty connected wallet, if any
   */
  address?: string | null;
  /**
   * Boolean to indicate if wallet is currently connecting. (Ignored if address
   * is set)
   */
  isConnecting?: boolean;
  /**
   * Callback function for when disconnect button is clicked
   */
  onDisconnectWalletClicked: () => void;
  /**
   * List of transactions that have been submitted
   */
  transactions: SubmittedTransaction[];
  /**
   * Number representing chainId of ETH network
   */
  chainId: number;
  /**
   * List of all tokens in metadata
   */
  tokens: TokenInfo[];
  walletOpen: boolean;
  setWalletOpen: (x: boolean) => void;
};

export const WalletButton = ({
  address,
  onDisconnectWalletClicked,
  transactions = [],
  chainId,
  tokens,
  walletOpen,
  setWalletOpen,
}: WalletButtonProps) => {
  const { t } = useTranslation(["wallet"]);

  if (address && !walletOpen) {
    return (
      <WalletAddress
        isButton
        address={address}
        onClick={() => setWalletOpen(!walletOpen)}
      />
    );
  }

  if (address && walletOpen) {
    return (
      <OpenWallet>
        <OpenWalletTopContainer>
          <StyledWalletAddress
            showBlockies
            address={address}
            onClick={() => setWalletOpen(!walletOpen)}
          />
          <ExitButton
            iconSize={1.25}
            icon="exit-modal"
            onClick={() => setWalletOpen(!walletOpen)}
          />
        </OpenWalletTopContainer>
        <TransactionContainer flex={transactions.length === 0}>
          {transactions.length > 0 ? (
            transactions.slice(0, 3).map((transaction) => {
              let token;
              if (
                transaction.type === "Order" ||
                transaction.type === "Deposit" ||
                transaction.type === "Withdraw"
              ) {
                const tx: SubmittedOrder = transaction as SubmittedOrder;
                const senderToken = findEthOrTokenByAddress(
                  tx.order.senderToken,
                  tokens,
                  chainId
                );
                const signerToken = findEthOrTokenByAddress(
                  tx.order.signerToken,
                  tokens,
                  chainId
                );
                return (
                  <WalletTransaction
                    transaction={transaction}
                    senderToken={senderToken}
                    signerToken={signerToken}
                    type={transaction.type}
                    chainId={chainId!}
                    key={tx.timestamp}
                  />
                );
              } else {
                const tx: SubmittedApproval = transaction as SubmittedApproval;
                token = findTokenByAddress(tx.tokenAddress, tokens);
                return (
                  <WalletTransaction
                    transaction={transaction}
                    approvalToken={token}
                    type={transaction.type}
                    chainId={chainId!}
                    key={tx.timestamp}
                  />
                );
              }
            })
          ) : (
            <NoTransactions>{t("wallet:noTransactions")}</NoTransactions>
          )}
        </TransactionContainer>

        <DisconnectButton
          aria-label={t("wallet:disconnectWallet")}
          onClick={onDisconnectWalletClicked}
        >
          {t("wallet:disconnectWallet")}
        </DisconnectButton>
      </OpenWallet>
    );
  }

  return null;
};

export default WalletButton;
