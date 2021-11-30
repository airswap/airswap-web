import { useTranslation } from "react-i18next";

import useAddressOrEnsName from "../../../../hooks/useAddressOrEnsName";
import BorderedButton from "../../../../styled-components/BorderedButton/BorderedButton";
import {
  ConnectionStatusCircle,
  Button,
  Placeholder,
  WalletAddressText,
} from "./WalletAddress.styles";

type WalletAddressPropsType = {
  address: string | null;
  isUnsupportedNetwork?: boolean;
  showBlockies?: boolean;
  glow?: boolean;
  transactionsTabOpen: boolean;
  setTransactionsTabOpen: (x: boolean) => void;
  setShowWalletList: (x: boolean) => void;
};

const WalletAddress = ({
  address,
  isUnsupportedNetwork = false,
  transactionsTabOpen,
  setTransactionsTabOpen,
  setShowWalletList,
  glow,
}: WalletAddressPropsType) => {
  const { t } = useTranslation();
  const addressOrName = useAddressOrEnsName(address);

  const renderContent = () =>
    transactionsTabOpen ? (
      <Placeholder />
    ) : (
      <BorderedButton $glow={glow}>
        <ConnectionStatusCircle $connected={!!address} />
        <WalletAddressText>
          {isUnsupportedNetwork
            ? t("wallet.unsupportedNetwork")
            : addressOrName
            ? addressOrName
            : t("wallet.notConnected")}
        </WalletAddressText>
      </BorderedButton>
    );

  return (
    <Button
      onClick={() => {
        !!address
          ? setTransactionsTabOpen(!transactionsTabOpen)
          : setShowWalletList(true);
      }}
    >
      {renderContent()}
    </Button>
  );
};

export default WalletAddress;
