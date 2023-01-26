import WalletAddress from "./subcomponents/WalletAddress/WalletAddress";

export type WalletButtonProps = {
  isConnected: boolean;
  isUnsupportedNetwork?: boolean;
  address?: string | null;
  glow?: boolean;
  setShowWalletList: (x: boolean) => void;
  setTransactionsTabOpen: (x: boolean) => void;
};

export const WalletButton = ({
  isConnected,
  isUnsupportedNetwork = false,
  address,
  glow,
  setShowWalletList,
  setTransactionsTabOpen,
}: WalletButtonProps) => {
  return (
    <WalletAddress
      isConnected={isConnected}
      isUnsupportedNetwork={isUnsupportedNetwork}
      address={address || null}
      glow={glow}
      setShowWalletList={setShowWalletList}
      setTransactionsTabOpen={setTransactionsTabOpen}
    />
  );
};

export default WalletButton;
