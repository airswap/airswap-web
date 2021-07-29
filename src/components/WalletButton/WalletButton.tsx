import {
  SubmittedApproval,
  SubmittedOrder,
  SubmittedTransaction,
} from "../../features/transactions/transactionsSlice";
import Button from "../Button/Button";
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
} from "./WalletButton.styles";
import { findTokenByAddress } from "@airswap/metadata";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { RiCloseLine } from "react-icons/ri";
import truncateEthAddress from "truncate-eth-address";

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
  tokens: any;
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
            <span>{truncateEthAddress(address)}</span>
            {walletOpen && (
              <ExitButton onClick={() => setWalletOpen(!walletOpen)}>
                <RiCloseLine />
              </ExitButton>
            )}
          </StyledWalletButton>
          {walletOpen && (
            <WalletExtension>
              <TransactionContainer>
                {transactions.length !== 0
                  ? transactions.slice(0, 3).map((transaction) => {
                      let token;
                      if (transaction.type === "Order") {
                        const tx: SubmittedOrder = transaction as SubmittedOrder;
                        token = findTokenByAddress(tx.order.signerToken, tokens);
                      } else if (transaction.type === "Approval") {
                        const tx: SubmittedApproval = transaction as SubmittedApproval;
                        token = findTokenByAddress(tx.tokenAddress, tokens);
                      }
                      return (
                        <TransactionRow
                          transaction={transaction}
                          token={token}
                          type={transaction.type}
                          chainId={chainId}
                          key={transaction.hash}
                        />
                      );
                    })
                  : "No transactions"}
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
