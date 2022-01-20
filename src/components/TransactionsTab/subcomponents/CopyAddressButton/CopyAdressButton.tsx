import { FC, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import selectElement from "../../helpers/selectElement";
import {
  StyledIcon,
  WalletMobileMenuButton,
} from "../WalletMobileMenu/WalletMobileMenu.styles";
import { Text, TextContainer } from "./CopyAdressButton.styles";

type CopyAdressButtonProps = {
  address: string;
};

const CopyAdressButton: FC<CopyAdressButtonProps> = ({ address }) => {
  const { t } = useTranslation();
  const walletTextRef = useRef<HTMLDivElement>(null);
  const [showAddress, setShowAddress] = useState(false);

  useEffect(() => {
    if (showAddress && walletTextRef.current) {
      selectElement(walletTextRef.current);
    }
  }, [showAddress]);

  const handleClick = () => {
    setShowAddress(true);
  };

  if (showAddress) {
    return (
      <TextContainer onClick={handleClick}>
        <Text ref={walletTextRef}>{address}</Text>
        <StyledIcon iconSize={1} name="check" />
      </TextContainer>
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
