import { useState } from "react";
import { useTranslation } from "react-i18next";

import { findTokenByAddress } from "@airswap/metadata";
import { TokenInfo } from "@uniswap/token-lists";

import {
  SubmittedApproval,
  SubmittedOrder,
  SubmittedTransaction,
} from "../../features/transactions/transactionsSlice";
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
};

export const WalletButton = ({
  address,
  onDisconnectWalletClicked,
  transactions = [],
  chainId,
  tokens,
}: WalletButtonProps) => {
  const { t } = useTranslation(["wallet"]);

  const [walletOpen, setWalletOpen] = useState<boolean>(false);

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
              if (transaction.type === "Order") {
                const tx: SubmittedOrder = transaction as SubmittedOrder;
                const senderToken = findTokenByAddress(
                  tx.order.senderToken,
                  tokens
                );
                const signerToken = findTokenByAddress(
                  tx.order.signerToken,
                  tokens
                );
                return (
                  <WalletTransaction
                    transaction={transaction}
                    senderToken={senderToken}
                    signerToken={signerToken}
                    type={transaction.type}
                    chainId={chainId!}
                    key={transaction.hash}
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
                    key={transaction.hash}
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
