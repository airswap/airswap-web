import truncateEthAddress from "truncate-eth-address";

import { InfoHeading } from "../../../Typography/Typography";
import {
  StyledWalletAddress,
  BlockiesContainer,
  GreenCircle,
  Button,
  StyledBlockies,
} from "./WalletAddress.styles";

type WalletBlockiesProps = {
  address: string;
  isButton?: boolean;
  showBlockies?: boolean;
  onClick?: () => void;
  className?: string;
};

const WalletAddress = ({
  address,
  isButton = false,
  showBlockies = false,
  className = "",
  onClick,
}: WalletBlockiesProps) => {
  const renderContent = () => (
    <StyledWalletAddress className={className}>
      {showBlockies ? (
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
        <GreenCircle />
      )}
      <InfoHeading>{truncateEthAddress(address)}</InfoHeading>
    </StyledWalletAddress>
  );

  if (isButton) {
    return <Button onClick={onClick}>{renderContent()}</Button>;
  }

  return renderContent();
};

export default WalletAddress;
