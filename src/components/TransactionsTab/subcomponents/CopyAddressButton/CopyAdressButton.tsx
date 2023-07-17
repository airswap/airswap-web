import { FC, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import writeTextToClipboard from "../../../../helpers/writeTextToClipboard";
import selectElement from "../../helpers/selectElement";
import {
  StyledIcon,
  WalletMobileMenuButton,
  WalletMobileMenuDiv,
} from "../WalletMobileMenu/WalletMobileMenu.styles";
import { Text } from "./CopyAdressButton.styles";

type CopyAdressButtonProps = {
  address: string;
};

const CopyAdressButton: FC<CopyAdressButtonProps> = ({ address }) => {
  const { t } = useTranslation();
  const walletTextRef = useRef<HTMLDivElement>(null);
  const [showAddress, setShowAddress] = useState(false);
  const [writeAddressToClipboardSuccess, setWriteAddressToClipboardSuccess] =
    useState(false);

  const iconName = writeAddressToClipboardSuccess ? "check" : "copy";

  useEffect(() => {
    if (showAddress && walletTextRef.current) {
      selectElement(walletTextRef.current);
    }
  }, [showAddress]);

  const handleClick = async () => {
    setShowAddress(true);
    setWriteAddressToClipboardSuccess(await writeTextToClipboard(address));
  };

  if (showAddress) {
    return (
      <WalletMobileMenuDiv onClick={handleClick}>
        <Text ref={walletTextRef}>{address}</Text>
        <StyledIcon
          $isSuccess={writeAddressToClipboardSuccess}
          iconSize={1}
          name={iconName}
        />
      </WalletMobileMenuDiv>
    );
  }

  return (
    <WalletMobileMenuButton onClick={handleClick}>
      <Text>{t("wallet.copyAddress")}</Text>
      <StyledIcon iconSize={1} name="copy" />
    </WalletMobileMenuButton>
  );
};

export default CopyAdressButton;
