import { FC, useMemo } from "react";

import { AppRoutes } from "../../../../../routes";
import { Container, SignButton, StyledLink } from "./ActionButtons.styles";
import { getActionButtonTranslation } from "./helpers";

export enum ButtonActions {
  connectWallet,
  switchNetwork,
  newOrder,
}

type ActionButtonsProps = {
  isLimitOrder?: boolean;
  walletIsNotConnected: boolean;
  className?: string;
  onActionButtonClick: (action: ButtonActions) => void;
};

const ActionButtons: FC<ActionButtonsProps> = ({
  isLimitOrder,
  walletIsNotConnected,
  className,
  onActionButtonClick,
}) => {
  const buttonText = useMemo(() => {
    return getActionButtonTranslation(walletIsNotConnected);
  }, [walletIsNotConnected]);

  const showNewOrderLink = useMemo(
    () => !walletIsNotConnected,
    [walletIsNotConnected]
  );

  const handleActionButtonClick = () => {
    if (walletIsNotConnected) {
      onActionButtonClick(ButtonActions.connectWallet);
    } else {
      onActionButtonClick(ButtonActions.newOrder);
    }
  };

  return (
    <Container className={className}>
      {showNewOrderLink ? (
        <StyledLink
          to={isLimitOrder ? AppRoutes.makeLimitOrder : AppRoutes.makeOtcOrder}
        >
          {buttonText}
        </StyledLink>
      ) : (
        <SignButton intent="primary" onClick={handleActionButtonClick}>
          {buttonText}
        </SignButton>
      )}
    </Container>
  );
};

export default ActionButtons;
