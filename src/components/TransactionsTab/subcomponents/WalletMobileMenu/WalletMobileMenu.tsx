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
  copyAddressIsSuccess?: boolean;
  walletUrl?: string;
  onDisconnectButtonClick?: () => void;
  onCopyAddressButtonClick?: () => void;
  className?: string;
};

const WalletMobileMenu: FC<WalletMobileMenuType> = ({
  copyAddressIsSuccess,
  walletUrl,
  onDisconnectButtonClick,
  onCopyAddressButtonClick,
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
      {onCopyAddressButtonClick && (
        <CopyAdressButton
          onClick={onCopyAddressButtonClick}
          isSuccess={!!copyAddressIsSuccess}
        />
      )}
      {onDisconnectButtonClick && (
        <WalletMobileMenuButton onClick={onDisconnectButtonClick}>
          {t("wallet.disconnectWallet")}
        </WalletMobileMenuButton>
      )}
    </Container>
  );
};

export default WalletMobileMenu;
