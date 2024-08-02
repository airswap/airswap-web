import { useReducedMotion } from "framer-motion";

import walletProviders, {
  WalletProvider,
} from "../../web3-connectors/walletProviders";
import { overlayShowHideAnimationDuration } from "../Overlay/Overlay";
import { StyledWalletProviderList } from "./WalletProviderList.styles";
import WalletProviderButton from "./subcomponents/WalletProviderButton/WalletProviderButton";

export type WalletProviderListProps = {
  onWalletProviderButtonClick: (provider: WalletProvider) => void;
  onClose: () => void;
  className?: string;
};

const WalletProviderList = ({
  onWalletProviderButtonClick,
  onClose,
  className,
}: WalletProviderListProps) => {
  const shouldReduceMotion = useReducedMotion();
  const onProviderButtonClick = (provider: WalletProvider) => {
    onClose();

    setTimeout(
      () => {
        onWalletProviderButtonClick(provider);
      },
      shouldReduceMotion ? 0 : overlayShowHideAnimationDuration * 1000
    );
  };

  return (
    <StyledWalletProviderList className={className}>
      {walletProviders.map((provider, i) => (
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
