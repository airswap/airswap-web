import { useTranslation } from "react-i18next";

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
   * Callback function for when disconnect button is clicked
   */
  onDisconnectWalletClicked: () => void;
  walletOpen: boolean;
  setWalletOpen: (x: boolean) => void;
  isUnsupportedNetwork?: boolean;
};

export const WalletButton = ({
  address,
  onDisconnectWalletClicked,
  walletOpen,
  setWalletOpen,
  isUnsupportedNetwork = false,
}: WalletButtonProps) => {
  const { t } = useTranslation(["wallet"]);

  if (!walletOpen) {
    return (
      <WalletAddress
        isUnsupportedNetwork={isUnsupportedNetwork}
        isButton
        address={address || null}
        onClick={() => setWalletOpen(!walletOpen)}
      />
    );
  }

  if (address && walletOpen) {
    return (
      <OpenWallet>
        <OpenWalletTopContainer>
          <StyledWalletAddress
            isUnsupportedNetwork={isUnsupportedNetwork}
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
