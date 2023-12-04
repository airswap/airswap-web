import { WidgetHeader } from "../../../../../styled-components/WidgetHeader/WidgetHeader";
import { ExpirySelector } from "../ExpirySelector/ExpirySelector";
import styled from "styled-components/macro";

export const StyledWidgetHeader = styled(WidgetHeader)``;

export const StyledExpirySelector = styled(ExpirySelector)<{
  hideExpirySelector: boolean;
}>`
  transition: opacity 0.3s ease-out;

  margin-left: 1rem;
  opacity: ${({ hideExpirySelector }) => (hideExpirySelector ? 0 : 1)};
`;
