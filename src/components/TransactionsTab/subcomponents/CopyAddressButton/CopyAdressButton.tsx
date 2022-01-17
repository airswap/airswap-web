import { FC } from "react";

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
  const icon = isSuccess ? "check" : "copy";

  return (
    <Container onClick={onClick} $isSuccess={isSuccess}>
      Copy address
      <StyledIcon iconSize={1} name={icon} />
    </Container>
  );
};

export default CopyAdressButton;
