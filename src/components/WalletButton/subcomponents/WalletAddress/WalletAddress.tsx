import { useTranslation } from "react-i18next";

import useAddressOrEnsName from "../../../../hooks/useAddressOrEnsName";
import BorderedButton from "../../../../styled-components/BorderedButton/BorderedButton";
import { InfoHeading } from "../../../Typography/Typography";
import { ConnectionStatusCircle, Button } from "./WalletAddress.styles";

type WalletAddressPropsType = {
  address: string | null;
  isButton?: boolean;
  isUnsupportedNetwork?: boolean;
  showBlockies?: boolean;
  transactionsTabOpen: boolean;
  setTransactionsTabOpen: (x: boolean) => void;
  setShowWalletList: (x: boolean) => void;
};

const WalletAddress = ({
  address,
  isUnsupportedNetwork = false,
  isButton = false,
  transactionsTabOpen,
  setTransactionsTabOpen,
  setShowWalletList,
}: WalletAddressPropsType) => {
  const { t } = useTranslation("wallet");
  const addressOrName = useAddressOrEnsName(address);

  const renderContent = () => (
    <BorderedButton>
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
