import styled from "styled-components/macro";

import { PillButton, Pill } from "../../../../styled-components/Pill/Pill";
import Icon from "../../../Icon/Icon";

export const For = styled.div`
  margin-right: 0.25rem;
  color: ${({ theme }) => theme.colors.lightGrey};
`;

export const You = styled.div`
  color: ${({ theme }) =>
    theme.name === "dark" ? theme.colors.lightGrey : theme.colors.primary};
`;

export const StyledCheckIcon = styled(Icon)`
  color: ${({ theme }) => theme.colors.green};
`;

export const StyledCopyIcon = styled(Icon)`
  color: ${({ theme }) => theme.colors.lightGrey};
`;

export const Button = styled(PillButton)`
  ${StyledCopyIcon} {
    margin-left: 0.25rem;
  }

  &:hover {
    color: ${({ theme }) => theme.colors.white};

    ${For},
    ${StyledCopyIcon} {
      color: ${({ theme }) => theme.colors.white};
    }
  }
`;

export const InfoWrapper = styled(Pill)`
  color: ${({ theme }) =>
    theme.name === "dark" ? theme.colors.lightGrey : theme.colors.primary};

  ${StyledCheckIcon} {
    margin-left: 0.25rem;
  }
`;
