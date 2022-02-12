import React, { FC } from "react";
import { useTranslation } from "react-i18next";

import { WalletProvider } from "../../../../constants/supportedWalletProviders";
import {
  ButtonIcon,
  ButtonIconContainer,
  ButtonText,
  StyledButton,
  StyledLink,
} from "../../WalletProviderList.styles";

type ToolbarButtonProps = {
  provider: WalletProvider;
  onClick?: () => void;
};

const WalletButtonProvider: FC<ToolbarButtonProps> = ({
  provider,
  onClick,
}) => {
  const { t } = useTranslation();
  const renderInner = () => {
    return (
      <>
        <ButtonIconContainer>
          <ButtonIcon
            src={provider.logo}
            alt={`${provider.name} logo`}
            className="w-12 h-12"
          />
        </ButtonIconContainer>
        <ButtonText>
          {provider.isInstalled
            ? provider.name
            : `${t("wallet.get")} ${provider.name}`}
        </ButtonText>
      </>
    );
  };
  if (!provider.isInstalled) {
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

export default WalletButtonProvider;
