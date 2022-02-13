import { useReducedMotion } from "framer-motion";

import SUPPORTED_WALLET_PROVIDERS, {
  WalletProvider,
} from "../../constants/supportedWalletProviders";
import { overlayShowHideAnimationDuration } from "../Overlay/Overlay";
import { StyledWalletProviderList } from "./WalletProviderList.styles";
import WalletProviderButton from "./subcomponents/WalletProviderButton/WalletProviderButton";

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
      {SUPPORTED_WALLET_PROVIDERS.map((provider, i) => (
        <WalletProviderButton
          key={i}
          provider={provider}
          onClick={() => onProviderButtonClick(provider)}
        />
      ))}
    </StyledWalletProviderList>
  );
};

export default WalletProviderList;
