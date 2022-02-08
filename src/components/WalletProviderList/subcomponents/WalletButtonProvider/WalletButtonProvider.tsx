import React, { FC } from "react";

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
  href?: string;
  onClick?: () => void;
};

const WalletButtonProvider: FC<ToolbarButtonProps> = ({
  provider,
  href,
  onClick,
}) => {
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
          {provider.isInstalled ? provider.name : `Get ${provider.name}`}
        </ButtonText>
      </>
    );
  };
  if (href) {
    return (
      <StyledLink key={provider.name} href={href} target="_blank">
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
