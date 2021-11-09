import { useTranslation } from "react-i18next";

import useAddressOrEnsName from "../../../../hooks/useAddressOrEnsName";
import BorderedButton from "../../../../styled-components/BorderedButton/BorderedButton";
import { InfoHeading } from "../../../Typography/Typography";
import {
  ConnectionStatusCircle,
  Button,
  Placeholder,
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
  const { t } = useTranslation("wallet");
  const addressOrName = useAddressOrEnsName(address);

  const renderContent = () =>
    transactionsTabOpen ? (
      <Placeholder />
    ) : (
      <BorderedButton $glow={glow}>
        <ConnectionStatusCircle $connected={!!address} />
        <InfoHeading>
          {isUnsupportedNetwork
            ? t("unsupportedNetwork")
            : addressOrName
            ? addressOrName
            : t("notConnected")}
        </InfoHeading>
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
