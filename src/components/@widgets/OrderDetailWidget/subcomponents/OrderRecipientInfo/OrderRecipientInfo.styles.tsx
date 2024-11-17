import styled from "styled-components/macro";

import { InputOrButtonBorderStyleType2 } from "../../../../../style/mixins";
import { PillButton, Pill } from "../../../../../styled-components/Pill/Pill";
import Icon from "../../../../Icon/Icon";

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

export const Container = styled.div`
  display: flex;
  align-items: center;
`;

export const CopyButton = styled.button`
  ${InputOrButtonBorderStyleType2};

  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.colors.white};

  ${StyledCopyIcon} {
    margin-left: 0.25rem;
  }

  &:hover:enabled,
  &:focus:enabled {
    outline: none;
    border-color: transparent;

    ${StyledCopyIcon} {
      color: ${({ theme }) => theme.colors.white};
    }
  }
`;

export const InfoWrapper = styled.div`
  display: flex;
  align-items: center;
  color: ${({ theme }) =>
    theme.name === "dark" ? theme.colors.lightGrey : theme.colors.primary};

  ${StyledCheckIcon} {
    margin-left: 0.25rem;
  }
`;
