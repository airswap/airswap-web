import { useTranslation } from "react-i18next";

import truncateEthAddress from "truncate-eth-address";

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
  showBlockies?: boolean;
  onClick?: () => void;
};

const WalletAddress = ({
  address,
  isButton = false,
  showBlockies = false,
  onClick,
}: WalletBlockiesProps) => {
  const { t } = useTranslation("wallet");

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
        {address ? truncateEthAddress(address) : t("notConnected")}
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
