import { useReducedMotion } from "framer-motion";

import SUPPORTED_WALLET_PROVIDERS, {
  WalletProvider,
} from "../../constants/supportedWalletProviders";
import { overlayShowHideAnimationDuration } from "../Overlay/Overlay";
import {
  StyledButton,
  ButtonIconContainer,
  StyledWalletProviderList,
  ButtonIcon,
  ButtonText,
} from "./WalletProviderList.styles";

declare let window: any;

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
  const shouldReduceMotion = useReducedMotion();
  const onProviderButtonClick = (provider: WalletProvider) => {
    onClose();

    setTimeout(
      () => {
        onProviderSelected(provider);
      },
      shouldReduceMotion ? 0 : overlayShowHideAnimationDuration * 1000
    );
  };

  const isProviderInstalled = (provider: WalletProvider) => {
    switch (provider.name) {
      case "MetaMask":
        return window.ethereum;
      case "xDefi":
        return window.xfi;
      default:
        return true;
    }
  };

  const clickEvent = (e: any, provider: WalletProvider) => {
    if (isProviderInstalled(provider)) {
      onProviderButtonClick(provider);
    } else {
      e.preventDefault();
      switch (provider.name) {
        case "MetaMask":
          window.open("https://metamask.io", "_blank");
          break;
        case "MetaMask":
          window.open("https://www.xdefi.io", "_blank");
          break;
      }
    }
  };

  return (
    <StyledWalletProviderList className={className}>
      {SUPPORTED_WALLET_PROVIDERS.map((provider) => (
        <StyledButton
          key={provider.name}
          onClick={(e) => clickEvent(e, provider)}
        >
          <ButtonIconContainer>
            <ButtonIcon
              src={provider.logo}
              alt={`${provider.name} logo`}
              className="w-12 h-12"
            />
          </ButtonIconContainer>
          <ButtonText>
            {isProviderInstalled(provider)
              ? provider.name
              : `Get ${provider.name}`}
          </ButtonText>
        </StyledButton>
      ))}
    </StyledWalletProviderList>
  );
};

export default WalletProviderList;
