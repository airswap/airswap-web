import { useState } from "react";

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

  return (
    <StyledWalletProviderList className={className}>
      {SUPPORTED_WALLET_PROVIDERS.map((provider) => (
        <StyledButton
          key={provider.name}
          onClick={() => onProviderButtonClick(provider)}
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
