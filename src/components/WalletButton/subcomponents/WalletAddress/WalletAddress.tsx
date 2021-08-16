import truncateEthAddress from "truncate-eth-address";

import { InfoHeading } from "../../../Typography/Typography";
import {
  StyledWalletAddress,
  BlockiesContainer,
  StyledBlockies,
  GreenCircle,
  Button,
} from "./WalletAddress.styles";

type WalletBlockiesProps = {
  address: string;
  isButton: boolean;
  onClick?: () => void;
};

const WalletAddress = ({ address, isButton, onClick }: WalletBlockiesProps) => {
  const renderContent = () => (
    <StyledWalletAddress>
      <BlockiesContainer>
        <StyledBlockies
          size={8}
          scale={3}
          seed={address}
          bgColor="black"
          color="#2b72ff"
        />
        <GreenCircle />
      </BlockiesContainer>
      <InfoHeading>{truncateEthAddress(address)}</InfoHeading>
    </StyledWalletAddress>
  );

  if (isButton) {
    return <Button onClick={onClick}>{renderContent()}</Button>;
  }

  return renderContent();
};

export default WalletAddress;
