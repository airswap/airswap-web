import useAddressOrEnsName from "../../../../hooks/useAddressOrEnsName";
import { getWalletButtonText } from "../../helpers";
import {
  ConnectionStatusCircle,
  Button,
  WalletAddressText,
  StyledBorderedButton,
} from "./WalletAddress.styles";

type WalletAddressPropsType = {
  isConnected: boolean;
  isUnsupportedNetwork?: boolean;
  address: string | null;
  glow?: boolean;
  setShowWalletList: (x: boolean) => void;
  setTransactionsTabOpen: (x: boolean) => void;
  className?: string;
};

const WalletAddress = ({
  isConnected,
  isUnsupportedNetwork = false,
  address,
  glow,
  setShowWalletList,
  setTransactionsTabOpen,
  className,
}: WalletAddressPropsType) => {
  const addressOrName = useAddressOrEnsName(address);

  const renderContent = () => (
    <StyledBorderedButton $glow={glow}>
      <ConnectionStatusCircle $connected={isConnected} />
      <WalletAddressText>
        {getWalletButtonText(isConnected, isUnsupportedNetwork, addressOrName)}
      </WalletAddressText>
    </StyledBorderedButton>
  );

  return (
    <Button
      onClick={() => {
        isConnected ? setTransactionsTabOpen(true) : setShowWalletList(true);
      }}
      className={className}
    >
      {renderContent()}
    </Button>
  );
};

export default WalletAddress;
