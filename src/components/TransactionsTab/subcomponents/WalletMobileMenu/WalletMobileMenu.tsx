import { FC } from "react";
import { useTranslation } from "react-i18next";

import CopyAdressButton from "../CopyAddressButton/CopyAdressButton";
import {
  Container,
  StyledIcon,
  WalletMobileMenuButton,
  WalletMobileMenuLink,
} from "./WalletMobileMenu.styles";

type WalletMobileMenuType = {
  walletUrl?: string;
  address?: string;
  onDisconnectButtonClick?: () => void;
  className?: string;
};

const WalletMobileMenu: FC<WalletMobileMenuType> = ({
  walletUrl,
  address,
  onDisconnectButtonClick,
  className,
}) => {
  const { t } = useTranslation();

  return (
    <Container className={className}>
      {walletUrl && (
        <WalletMobileMenuLink href={walletUrl} target="_blank">
          {t("wallet.viewOnExplorer")}
          <StyledIcon iconSize={1} name="transaction-link" />
        </WalletMobileMenuLink>
      )}
      {address && <CopyAdressButton address={address} />}
      {onDisconnectButtonClick && (
        <WalletMobileMenuButton onClick={onDisconnectButtonClick}>
          {t("wallet.disconnectWallet")}
        </WalletMobileMenuButton>
      )}
    </Container>
  );
};

export default WalletMobileMenu;
