import { FC } from "react";

import { ConnectionStatusCircle } from "../../TransactionsTab.styles";
import { Container, StyledInfoHeading } from "./WalletInfoButton.styles";

type WalletInfoButtonType = {
  isConnected?: boolean;
  onClick: () => void;
  className?: string;
};

const WalletInfoButton: FC<WalletInfoButtonType> = ({
  isConnected,
  onClick,
  className,
  children,
}) => {
  return (
    <Container className={className} onClick={onClick}>
      <ConnectionStatusCircle $connected={!!isConnected} />
      <StyledInfoHeading>{children}</StyledInfoHeading>
    </Container>
  );
};

export default WalletInfoButton;
