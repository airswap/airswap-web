import { css } from "styled-components";
import styled from "styled-components/macro";

import { InputOrButtonBorderStyleType2 } from "../../../../style/mixins";
import Icon from "../../../Icon/Icon";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 12.5rem;
`;

export const WalletMobileMenuButtonStyle = css`
  ${InputOrButtonBorderStyleType2};

  display: flex;
  align-items: center;
  position: relative;
  padding: 0.625rem 1.5rem;
  width: 100%;
  height: 2.625rem;
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  color: ${({ theme }) =>
    theme.name === "dark" ? theme.colors.white : theme.colors.primary};
  background: ${({ theme }) => theme.colors.black};

  &:not(:first-child) {
    margin-top: -1px;
  }

  &:focus,
  &:hover {
    z-index: 2;
  }
`;

export const WalletMobileMenuLink = styled.a`
  ${WalletMobileMenuButtonStyle};
`;

export const WalletMobileMenuButton = styled.button`
  ${WalletMobileMenuButtonStyle};
`;

export const WalletMobileMenuDiv = styled.div`
  ${WalletMobileMenuButtonStyle};
`;

export const StyledIcon = styled(Icon)`
  margin-left: 0.5rem;
  color: ${({ theme }) => theme.colors.lightGrey};
`;
