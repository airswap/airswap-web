import styled from "styled-components/macro";

import { TextEllipsis } from "../../style/mixins";
import { Pill } from "../../styled-components/Pill/Pill";
import Tooltip from "./subcomponents/Tooltip";

export const Container = styled.div`
  position: relative;
  width: fit-content;
  height: 2rem;
`;

export const Text = styled.span`
  ${TextEllipsis};
`;

export const Strong = styled.strong`
  ${TextEllipsis};

  display: inline;
  margin-left: 0.375rem;
  color: ${({ theme }) => theme.colors.white};
`;

export const StyledTooltip = styled(Tooltip)`
  display: none;
  position: absolute;
  bottom: 2.5rem;
`;

export const StyledPill = styled(Pill)`
  ${TextEllipsis};

  &:hover + ${StyledTooltip} {
    display: flex;
  }
`;
