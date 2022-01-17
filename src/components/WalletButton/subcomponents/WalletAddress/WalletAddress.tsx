import { useTranslation } from "react-i18next";

import useAddressOrEnsName from "../../../../hooks/useAddressOrEnsName";
import {
  ConnectionStatusCircle,
  Button,
  WalletAddressText,
  StyledBorderedButton,
} from "./WalletAddress.styles";

type WalletAddressPropsType = {
  address: string | null;
  isUnsupportedNetwork?: boolean;
  showBlockies?: boolean;
  glow?: boolean;
  setTransactionsTabOpen: (x: boolean) => void;
  setShowWalletList: (x: boolean) => void;
};

const WalletAddress = ({
  address,
  isUnsupportedNetwork = false,
  setTransactionsTabOpen,
  setShowWalletList,
  glow,
}: WalletAddressPropsType) => {
  const { t } = useTranslation();
  const addressOrName = useAddressOrEnsName(address);

  const renderContent = () => (
    <StyledBorderedButton $glow={glow}>
      <ConnectionStatusCircle $connected={!!address} />
      <WalletAddressText>
        {isUnsupportedNetwork
          ? t("wallet.unsupportedNetwork")
          : addressOrName
          ? addressOrName
          : t("wallet.notConnected")}
      </WalletAddressText>
    </StyledBorderedButton>
  );

  return (
    <Button
      onClick={() => {
        !!address ? setTransactionsTabOpen(true) : setShowWalletList(true);
      }}
    >
      {renderContent()}
    </Button>
  );
};

export default WalletAddress;
