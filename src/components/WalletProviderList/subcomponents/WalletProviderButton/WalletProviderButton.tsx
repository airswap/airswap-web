import React, { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { WalletProvider } from "../../../../constants/supportedWalletProviders";
import {
  ButtonIcon,
  ButtonIconContainer,
  ButtonText,
  StyledButton,
  StyledLink,
} from "./WalletProviderButton.styles";

type ToolbarButtonProps = {
  provider: WalletProvider;
  onClick?: () => void;
};

const WalletProviderButton: FC<ToolbarButtonProps> = ({
  provider,
  onClick,
}) => {
  const { t } = useTranslation();

  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    provider.isProviderInstalled.then((value) => {
      setIsInstalled(value);
    });
  }, [provider.isProviderInstalled]);

  const renderInner = () => {
    return (
      <>
        <ButtonIconContainer>
          <ButtonIcon src={provider.logo} alt={`${provider.name} logo`} />
        </ButtonIconContainer>
        <ButtonText>
          {isInstalled ? provider.name : `${t("wallet.get")} ${provider.name}`}
        </ButtonText>
      </>
    );
  };
  if (!isInstalled) {
    return (
      <StyledLink key={provider.name} href={provider.url} target="_blank">
        {renderInner()}
      </StyledLink>
    );
  }

  return (
    <StyledButton key={provider.name} onClick={onClick}>
      {renderInner()}
    </StyledButton>
  );
};

export default WalletProviderButton;
