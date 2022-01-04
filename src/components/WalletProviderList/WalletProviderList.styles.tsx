import styled from "styled-components/macro";

import uauthLogoDefault from "../../assets/wallet-provider-logos/uauth-default.png";
import uauthLogoHover from "../../assets/wallet-provider-logos/uauth-hover.png";
import uauthLogoPressed from "../../assets/wallet-provider-logos/uauth-pressed.png";
import { InputOrButtonBorderStyleType2 } from "../../style/mixins";
import { sizes } from "../../style/sizes";

export const StyledWalletProviderList = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 ${sizes.tradeContainerPadding};
  background: ${(props) => props.theme.colors.black};
`;

export const TitleContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 1.875rem;
`;

export const StyledButton = styled.button`
  ${InputOrButtonBorderStyleType2};

  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  padding: 1rem;
  height: 4.5rem;
  background: ${({ theme }) =>
    theme.name === "dark" ? theme.colors.darkGrey : theme.colors.primaryLight};

  & + & {
    margin-top: 0.5rem;
  }
`;

export const ButtonIconContainer = styled.div`
  display: flex;
  justify-content: center;
  position: relative;
  width: 3rem;
  height: 100%;
`;

export const ButtonIcon = styled.img`
  width: 100%;
  height: auto;
`;

export const UAuthButton = styled.button`
  margin-top: 0.5rem;
  width: 100%;
  height: 3.4rem;
  background-image: url(${uauthLogoDefault});
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;

  &:hover {
    background-image: url(${uauthLogoHover});
  }

  &:active {
    background-image: url(${uauthLogoPressed});
  }
`;

export const ButtonText = styled.h4`
  margin-left: 1rem;
  width: 100%;
  height: auto;
  font-weight: 600;
  text-align: left;
`;
