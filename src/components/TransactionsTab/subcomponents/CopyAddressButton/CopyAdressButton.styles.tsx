import styled from "styled-components/macro";

import { WalletMobileMenuButton } from "../WalletMobileMenu/WalletMobileMenu.styles";

export const Container = styled(WalletMobileMenuButton)<{
  $isSuccess?: boolean;
}>`
  svg {
    color: ${({ $isSuccess, theme }) =>
      $isSuccess ? theme.colors.primary : "inherit"};
  }
`;
