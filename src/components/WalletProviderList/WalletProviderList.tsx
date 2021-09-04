import { useTranslation } from "react-i18next";
import SUPPORTED_WALLET_PROVIDERS, {
  WalletProvider,
} from "../../constants/supportedWalletProviders";
import {
  StyledButton,
  ButtonIconContainer,
  StyledWalletProviderList,
  ButtonIcon,
  ButtonText, TitleContainer,
} from "./WalletProviderList.styles";
import { Title } from "../Typography/Typography";
import CloseButton from "../../styled-components/CloseButton/CloseButton";

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
  const { t } = useTranslation(["wallet"]);

  return (
    <StyledWalletProviderList className={className}>
      <TitleContainer>
        <Title type="h2">{t("wallet:selectWallet")}</Title>
        <CloseButton icon="chevron-down" iconSize={1} onClick={onClose} />
      </TitleContainer>
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
