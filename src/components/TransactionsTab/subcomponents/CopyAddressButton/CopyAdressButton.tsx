import { FC } from "react";
import { useTranslation } from "react-i18next";

import { StyledIcon } from "../WalletMobileMenu/WalletMobileMenu.styles";
import { Container } from "./CopyAdressButton.styles";

type CopyAdressButtonProps = {
  isSuccess: boolean;
  onClick: () => void;
};

const CopyAdressButton: FC<CopyAdressButtonProps> = ({
  isSuccess,
  onClick,
}) => {
  const { t } = useTranslation();
  const icon = isSuccess ? "check" : "copy";

  return (
    <Container onClick={onClick} $isSuccess={isSuccess}>
      {t("wallet.copyAddress")}
      <StyledIcon iconSize={1} name={icon} />
    </Container>
  );
};

export default CopyAdressButton;
