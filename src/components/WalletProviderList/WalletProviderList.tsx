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
};

const WalletProviderList = ({
  onProviderSelected,
}: WalletProviderListProps) => {
  return (
    <StyledWalletProviderList>
      {SUPPORTED_WALLET_PROVIDERS.map((provider) => (
        <StyledButton
          key={provider.name}
          onClick={() => {
            onProviderSelected(provider);
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
