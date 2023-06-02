import { css } from "styled-components";
import styled from "styled-components/macro";

import Icon from "../Icon/Icon";

interface StyledIconButtonProps {
  hasText?: boolean;
}

export const StyledIcon = styled(Icon)``;

export const IconButtonStyle = css<StyledIconButtonProps>`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  padding: 0.5rem;
  font-weight: 600;
  box-sizing: border-box;
  border-radius: full;

  ${StyledIcon} {
    svg {
      margin-left: ${(props) => (props.hasText ? "0.5rem" : 0)};
    }
  }

  &:focus {
    outline: 0;
    border-color: ${(props) => props.theme.colors.lightGrey};
  }

  &:active {
    border-color: ${(props) => props.theme.colors.primary};
  }
`;

export const StyledIconButton = styled.button<StyledIconButtonProps>`
  ${IconButtonStyle};
`;
