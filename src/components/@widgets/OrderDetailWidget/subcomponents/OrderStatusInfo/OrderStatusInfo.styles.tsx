import styled from "styled-components/macro";

import Icon from "../../../../Icon/Icon";
import LoadingSpinner from "../../../../LoadingSpinner/LoadingSpinner";

export const InfoWrapper = styled.div`
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.colors.lightGrey};
`;

export const StyledIcon = styled(Icon)`
  color: ${({ theme }) => theme.colors.lightGrey};
`;

export const Button = styled.button`
  display: flex;
  align-items: center;

  ${StyledIcon} {
    margin-top: 0.125rem;
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
