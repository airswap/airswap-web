import { useTranslation } from "react-i18next";
import truncateEthAddress from "truncate-eth-address";
import Blockies from "react-blockies";

import Button from "../Button/Button";
import classNames from "classnames";

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
};

export const WalletButton = ({
  address,
  className,
  isConnecting,
  onConnectWalletClicked,
}: WalletButtonProps) => {
  const { t } = useTranslation(["wallet"]);
  return (
    <div className={className}>
      {address ? (
        <div
          className={classNames(
            "flex flex-row items-center",
            "px-2 py-1",
            "rounded-sm",
            "bg-gray-200 dark:bg-gray-800"
          )}
        >
          <Blockies
            size={8}
            scale={3}
            seed={address}
            className="-ml-1 rounded-sm mr-2"
            bgColor="black"
            color="#2b72ff"
          />
          <span>{truncateEthAddress(address)}</span>
        </div>
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
