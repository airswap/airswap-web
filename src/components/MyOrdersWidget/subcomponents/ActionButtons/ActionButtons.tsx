import React, { FC, useMemo } from "react";

import { Container, SignButton } from "./ActionButtons.styles";
import { getActionButtonTranslation } from "./helpers";

export enum ButtonActions {
  connectWallet,
  switchNetwork,
  newOrder,
  removeOrder,
  goBack,
}

type ActionButtonsProps = {
  networkIsUnsupported: boolean;
  walletIsNotConnected: boolean;
  loading: boolean;
  onActionButtonClick: (action: ButtonActions) => void;
};

const ActionButtons: FC<ActionButtonsProps> = ({
  networkIsUnsupported,
  walletIsNotConnected,
  loading,
  onActionButtonClick,
}) => {
  const buttonText = useMemo(() => {
    return loading
      ? ""
      : getActionButtonTranslation(networkIsUnsupported, walletIsNotConnected);
  }, [networkIsUnsupported, walletIsNotConnected, loading]);

  const showNewOrderLink = useMemo(
    () => !networkIsUnsupported && !walletIsNotConnected,
    [networkIsUnsupported, walletIsNotConnected]
  );

  const handleActionButtonClick = () => {
    if (walletIsNotConnected) {
      onActionButtonClick(ButtonActions.connectWallet);
    } else if (networkIsUnsupported) {
      onActionButtonClick(ButtonActions.switchNetwork);
    } else {
      onActionButtonClick(ButtonActions.newOrder);
    }
  };

  return (
    <Container>
      {showNewOrderLink ? (
        <SignButton
          intent="primary"
          onClick={handleActionButtonClick}
          disabled={loading}
          loading={loading}
        >
          {buttonText}
        </SignButton>
      ) : (
        <SignButton intent="primary" onClick={handleActionButtonClick}>
          {buttonText}
        </SignButton>
      )}
    </Container>
  );
};

export default ActionButtons;
