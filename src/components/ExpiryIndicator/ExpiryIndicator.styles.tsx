import styled from "styled-components/macro";

import { TextEllipsis } from "../../style/mixins";
import Tooltip from "./subcomponents/Tooltip";

export const Container = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  width: fit-content;
  height: 2rem;
`;

export const Text = styled.span<{ hasExpired: boolean }>`
  ${TextEllipsis};

  color: ${({ theme }) => theme.colors.lightGrey};
`;

export const TimeLeft = styled.div`
  ${TextEllipsis};

  display: inline;
  margin-left: 0.375rem;
  color: ${({ theme }) =>
    theme.name === "dark" ? theme.colors.white : theme.colors.primary};
`;

export const StyledTooltip = styled(Tooltip)`
  display: none;
  position: absolute;
  bottom: 2.5rem;
`;

export const Expiry = styled.div`
  ${TextEllipsis};

  &:hover + ${StyledTooltip} {
    display: flex;
  }
`;
