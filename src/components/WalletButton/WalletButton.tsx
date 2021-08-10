import Blockies from "react-blockies";
import { useTranslation } from "react-i18next";
import { RiCloseLine } from "react-icons/ri";

import truncateEthAddress from "truncate-eth-address";

import Button from "../Button/Button";
import { StyledWalletButton } from "./WalletButton.styles";

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
   * Additional classes applied to container
   */
  className?: string;
  /**
   * Callback function for when connect button is clicked
   */
  onConnectWalletClicked: () => void;
  /**
   * Callback function for when disconnect button is clicked
   */
  onDisconnectWalletClicked: () => void;
};

export const WalletButton = ({
  address,
  className,
  isConnecting,
  onConnectWalletClicked,
  onDisconnectWalletClicked,
}: WalletButtonProps) => {
  const { t } = useTranslation(["wallet"]);
  return (
    <div className={className}>
      {address ? (
        <StyledWalletButton>
          <Blockies
            size={8}
            scale={3}
            seed={address}
            className="-ml-1 rounded-sm mr-2"
            bgColor="black"
            color="#2b72ff"
          />
          <span>{truncateEthAddress(address)}</span>
          <button
            className="ml-2"
            aria-label={t("wallet:disconnectWallet")}
            onClick={onDisconnectWalletClicked}
          >
            <RiCloseLine />
          </button>
        </StyledWalletButton>
      ) : (
        <Button
          intent="primary"
          loading={isConnecting}
          onClick={onConnectWalletClicked}
        >
          {t("wallet:connectWallet")}
        </Button>
      )}
    </div>
  );
};

export default WalletButton;
