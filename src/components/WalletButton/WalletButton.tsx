import { useTranslation } from "react-i18next";

import { TokenInfo } from "@airswap/types";

import { SubmittedTransaction } from "../../features/transactions/transactionsSlice";
import {
  OpenWallet,
  ExitButton,
  DisconnectButton,
  OpenWalletTopContainer,
  StyledWalletAddress,
} from "./WalletButton.styles";
import WalletAddress from "./subcomponents/WalletAddress/WalletAddress";

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
