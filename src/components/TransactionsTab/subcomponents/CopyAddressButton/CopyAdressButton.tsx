import { FC, useRef } from "react";
import { useTranslation } from "react-i18next";

import { StyledIcon } from "../WalletMobileMenu/WalletMobileMenu.styles";
import { Container, Text } from "./CopyAdressButton.styles";

type CopyAdressButtonProps = {
  /**
   * If address is successfully copied then show isSuccess state
   */
  isSuccess: boolean;
  /**
   * Optional textNode used for writing address to using document.execCommand (fallback method)
   */
  onClick: (textNode?: HTMLDivElement) => void;
};

const CopyAdressButton: FC<CopyAdressButtonProps> = ({
  isSuccess,
  onClick,
}) => {
  const { t } = useTranslation();
  const textRef = useRef<HTMLDivElement>(null);
  const icon = isSuccess ? "check" : "copy";

  const handleClick = () => {
    onClick(textRef.current || undefined);
  };

  return (
    <Container onClick={handleClick} $isSuccess={isSuccess}>
      <Text ref={textRef}>{t("wallet.copyAddress")}</Text>
      <StyledIcon iconSize={1} name={icon} />
    </Container>
  );
};

export default CopyAdressButton;
