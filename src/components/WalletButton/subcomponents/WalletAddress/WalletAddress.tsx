import useAddressOrEnsName from "../../../../hooks/useAddressOrEnsName";
import BorderedButton from "../../../../styled-components/BorderedButton/BorderedButton";
import { InfoHeading } from "../../../Typography/Typography";
import {
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
};

const WalletAddress = ({
  address,
  isButton = false,
  showBlockies = false,
  onClick,
}: WalletBlockiesProps) => {
  const addressOrName = useAddressOrEnsName(address);

  const renderContent = () => (
    <BorderedButton>
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
      <InfoHeading>{addressOrName}</InfoHeading>
    </BorderedButton>
  );

  if (isButton) {
    return <Button onClick={onClick}>{renderContent()}</Button>;
  }

  return renderContent();
};

export default WalletAddress;
