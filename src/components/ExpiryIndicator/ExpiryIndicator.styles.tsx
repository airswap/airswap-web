import styled from "styled-components/macro";

import { Pill } from "../../styled-components/Pill/Pill";
import Tooltip from "./subcomponents/Tooltip";

export const Container = styled.div`
  position: relative;
  width: fit-content;
  height: 2rem;
`;

export const Strong = styled.strong`
  margin-left: 0.375rem;
  color: ${({ theme }) => theme.colors.white};
`;

export const StyledTooltip = styled(Tooltip)`
  display: none;
  position: absolute;
  bottom: 2.5rem;
`;

export const StyledPill = styled(Pill)`
  &:hover + ${StyledTooltip} {
    display: flex;
  }
`;
