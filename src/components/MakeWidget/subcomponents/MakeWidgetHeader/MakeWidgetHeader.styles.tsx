import styled from "styled-components/macro";

import { ExpirySelector } from "../ExpirySelector/ExpirySelector";

export const StyledExpirySelector = styled(ExpirySelector)<{
  hideExpirySelector: boolean;
}>`
  transition: opacity 0.3s ease-out;

  margin-left: 1rem;
  opacity: ${({ hideExpirySelector }) => (hideExpirySelector ? 0 : 1)};
`;
