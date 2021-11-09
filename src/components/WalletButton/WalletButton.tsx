import WalletAddress from "./subcomponents/WalletAddress/WalletAddress";

export type WalletButtonProps = {
  /**
   * Address of currenlty connected wallet, if any
   */
  address?: string | null;
  transactionsTabOpen: boolean;
  setTransactionsTabOpen: (x: boolean) => void;
  isUnsupportedNetwork?: boolean;
  glow?: boolean;
  setShowWalletList: (x: boolean) => void;
};

export const WalletButton = ({
  address,
  transactionsTabOpen,
  setTransactionsTabOpen,
  isUnsupportedNetwork = false,
  setShowWalletList,
  glow,
}: WalletButtonProps) => {
  return (
    <WalletAddress
      isUnsupportedNetwork={isUnsupportedNetwork}
      address={address || null}
      transactionsTabOpen={transactionsTabOpen}
      setTransactionsTabOpen={setTransactionsTabOpen}
      setShowWalletList={setShowWalletList}
      glow={glow}
    />
  );
};

export default WalletButton;
