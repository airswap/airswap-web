import styled from "styled-components/macro";

import { Pill, PillButton } from "../../../../styled-components/Pill/Pill";
import Icon from "../../../Icon/Icon";
import LoadingSpinner from "../../../LoadingSpinner/LoadingSpinner";

export const InfoWrapper = styled(Pill)`
  color: ${({ theme }) => theme.colors.lightGrey};
`;

export const StyledIcon = styled(Icon)`
  color: ${({ theme }) => theme.colors.lightGrey};
`;

export const Button = styled(PillButton)`
  ${StyledIcon} {
    margin-left: 0.375rem;
    color: ${({ theme }) =>
      theme.name === "dark" ? theme.colors.lightGrey : theme.colors.primary};
  }

  &:hover {
    color: ${({ theme }) => theme.colors.white};

    ${StyledIcon} {
      color: ${({ theme }) =>
        theme.name === "dark" ? theme.colors.white : theme.colors.white};
    }
  }
`;

export const StyledLoadingSpinner = styled(LoadingSpinner)`
  width: 2rem;
`;
