import styled from "styled-components/macro";

import {
  WalletMobileMenuDiv,
  StyledIcon,
} from "../WalletMobileMenu/WalletMobileMenu.styles";

export const TextContainer = styled(WalletMobileMenuDiv)`
  ${StyledIcon} {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

export const Text = styled.div`
  max-width: 10rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
