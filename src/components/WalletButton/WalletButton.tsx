import { useState } from "react";
import { useTranslation } from "react-i18next";
import { RiCloseLine } from "react-icons/ri";

import { findTokenByAddress } from "@airswap/metadata";
import { TokenInfo } from "@uniswap/token-lists";

import truncateEthAddress from "truncate-eth-address";

import {
  SubmittedApproval,
  SubmittedOrder,
  SubmittedTransaction,
} from "../../features/transactions/transactionsSlice";
import Button from "../Button/Button";
import { InfoHeading } from "../Typography/Typography";
import { TransactionRow } from "./TransactionRow";
import {
  StyledWalletButton,
  StyledBlockies,
  BlockiesContainer,
  GreenCircle,
  Container,
  WalletExtension,
  ExitButton,
  DisconnectButton,
  TransactionContainer,
  Line,
  Span,
} from "./WalletButton.styles";

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
   * Callback function for when connect button is clicked
   */
  onConnectWalletClicked: () => void;
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
  isConnecting,
  onConnectWalletClicked,
  onDisconnectWalletClicked,
  transactions,
  chainId,
  tokens,
}: WalletButtonProps) => {
  const { t } = useTranslation(["wallet"]);

  const [walletOpen, setWalletOpen] = useState<boolean>(false);

  return (
    <Container>
      {address ? (
        <>
          <StyledWalletButton onClick={() => setWalletOpen(!walletOpen)}>
            <BlockiesContainer>
              <StyledBlockies
                size={8}
                scale={3}
                seed={address}
                bgColor="black"
                color="#2b72ff"
              />
              <GreenCircle />
            </BlockiesContainer>
            <InfoHeading>{truncateEthAddress(address)}</InfoHeading>
            {walletOpen && (
              <ExitButton onClick={() => setWalletOpen(!walletOpen)}>
                <RiCloseLine />
              </ExitButton>
            )}
          </StyledWalletButton>
          {walletOpen && (
            <WalletExtension>
              <Line />
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
                        <TransactionRow
                          transaction={transaction}
                          senderToken={senderToken}
                          signerToken={signerToken}
                          type={transaction.type}
                          chainId={chainId!}
                          key={transaction.hash}
                        />
                      );
                    } else if (transaction.type === "Approval") {
                      const tx: SubmittedApproval = transaction as SubmittedApproval;
                      token = findTokenByAddress(tx.tokenAddress, tokens);
                      return (
                        <TransactionRow
                          transaction={transaction}
                          approvalToken={token}
                          type={transaction.type}
                          chainId={chainId!}
                          key={transaction.hash}
                        />
                      );
                    }
                    return null;
                  })
                ) : (
                  <Span>{t("wallet:noTransactions")}</Span>
                )}
              </TransactionContainer>

              <DisconnectButton
                aria-label={t("wallet:disconnectWallet")}
                onClick={onDisconnectWalletClicked}
              >
                {t("wallet:disconnectWallet")}
              </DisconnectButton>
            </WalletExtension>
          )}
        </>
      ) : (
        <Button
          intent="primary"
          loading={isConnecting}
          onClick={onConnectWalletClicked}
        >
          {t("wallet:connectWallet")}
        </Button>
      )}
    </Container>
  );
};

export default WalletButton;
