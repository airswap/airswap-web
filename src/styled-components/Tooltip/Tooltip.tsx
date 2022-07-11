import styled from "styled-components";
import { css } from "styled-components/macro";

export const TooltipStyle = css`
  border: 1px solid ${(props) => props.theme.colors.borderGrey};
  border-radius: 2px;
  padding: 0.75rem;
  line-height: 1.2;
  font-size: 0.875rem;
  color: ${({ theme }) =>
    theme.name === "dark" ? theme.colors.white : theme.colors.darkGrey};
  background: ${({ theme }) =>
    theme.name === "dark" ? theme.colors.darkGrey : theme.colors.primaryLight};
  filter: drop-shadow(${(props) => props.theme.shadows.tooltipGlow});
`;

export const Tooltip = styled.div`
  ${TooltipStyle};
`;
