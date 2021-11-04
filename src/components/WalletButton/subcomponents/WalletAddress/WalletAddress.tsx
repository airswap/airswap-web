import { useTranslation } from "react-i18next";

import useAddressOrEnsName from "../../../../hooks/useAddressOrEnsName";
import BorderedButton from "../../../../styled-components/BorderedButton/BorderedButton";
import { InfoHeading } from "../../../Typography/Typography";
import {
  BlockiesContainer,
  ConnectionStatusCircle,
  Button,
  StyledBlockies,
} from "./WalletAddress.styles";

type WalletBlockiesProps = {
  address: string | null;
  isButton?: boolean;
  isUnsupportedNetwork?: boolean;
  showBlockies?: boolean;
  onClick?: () => void;
};

const WalletAddress = ({
  address,
  isUnsupportedNetwork = false,
  isButton = false,
  showBlockies = false,
  onClick,
}: WalletBlockiesProps) => {
  const { t } = useTranslation("wallet");
  const addressOrName = useAddressOrEnsName(address);

  const renderContent = () => (
    <BorderedButton>
      {address && showBlockies ? (
        <BlockiesContainer>
          <StyledBlockies
            size={8}
            scale={3}
            seed={address}
            bgColor="black"
            color="#2b72ff"
          />
        </BlockiesContainer>
      ) : (
        <ConnectionStatusCircle $connected={!!address} />
      )}
      <InfoHeading>
        {isUnsupportedNetwork
          ? t("unsupportedNetwork")
          : addressOrName
          ? addressOrName
          : t("notConnected")}
      </InfoHeading>
    </BorderedButton>
  );

  if (isButton) {
    return (
      <Button onClick={!!address ? onClick : undefined}>
        {renderContent()}
      </Button>
    );
  }

  return renderContent();
};

export default WalletAddress;
