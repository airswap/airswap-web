import React, { FC, useMemo } from "react";

import { AppRoutes } from "../../../../../routes";
import { Container, SignButton, StyledLink } from "./ActionButtons.styles";
import { getActionButtonTranslation } from "./helpers";

export enum ButtonActions {
  connectWallet,
  switchNetwork,
  newOrder,
  removeOrder,
  goBack,
}

type ActionButtonsProps = {
  walletIsNotConnected: boolean;
  onActionButtonClick: (action: ButtonActions) => void;
};

const ActionButtons: FC<ActionButtonsProps> = ({
  walletIsNotConnected,
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
    <Container>
      {showNewOrderLink ? (
        <StyledLink to={AppRoutes.make}>{buttonText}</StyledLink>
      ) : (
        <SignButton intent="primary" onClick={handleActionButtonClick}>
          {buttonText}
        </SignButton>
      )}
    </Container>
  );
};

export default ActionButtons;
