import styled from "styled-components/macro";

import Icon from "../Icon/Icon";

interface StyledIconButtonProps {
  hasText: boolean;
}

export const StyledIcon = styled(Icon)``;

export const StyledIconButton = styled.button<StyledIconButtonProps>`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  padding: 1rem;
  font-weight: 600;

  ${StyledIcon} {
    svg {
      margin-left: ${(props) => (props.hasText ? "0.5rem" : 0)};
    }
  }
`;
