import SUPPORTED_WALLET_PROVIDERS, {
  WalletProvider,
} from "../../constants/supportedWalletProviders";
import {
  StyledButton,
  ButtonIconContainer,
  StyledWalletProviderList,
  ButtonIcon,
  ButtonText,
} from "./WalletProviderList.styles";

export type WalletProviderListProps = {
  onProviderSelected: (provider: WalletProvider) => void;
  onClose: () => void;
  className?: string;
};

const WalletProviderList = ({
  onProviderSelected,
  onClose,
  className,
}: WalletProviderListProps) => {
  return (
    <StyledWalletProviderList className={className}>
      {SUPPORTED_WALLET_PROVIDERS.map((provider) => (
        <StyledButton
          key={provider.name}
          onClick={() => {
            onProviderSelected(provider);
            onClose();
          }}
        >
          <ButtonIconContainer>
            <ButtonIcon
              src={provider.logo}
              alt={`${provider.name} logo`}
              className="w-12 h-12"
            />
          </ButtonIconContainer>
          <ButtonText>{provider.name}</ButtonText>
        </StyledButton>
      ))}
    </StyledWalletProviderList>
  );
};

export default WalletProviderList;
