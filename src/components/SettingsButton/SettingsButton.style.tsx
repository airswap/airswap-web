import styled from "styled-components/macro";

import breakPoints from "../../style/breakpoints";
import { BorderedPill, InputOrButtonBorderStyle } from "../../style/mixins";
import { IconButtonStyle } from "../IconButton/IconButton.styles";

type ContainerProps = {
  open: boolean;
};

export const Container = styled.div<ContainerProps>`
  position: relative;
  transform: ${(props) => (props.open ? "translate(-12.75rem, 0)" : "0")};
  transition: transform 0.3s ease-in-out;

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }

  @media ${breakPoints.phoneOnly} {
    transform: none;
    transition: none;
  }
`;

export const SettingsButtonContainer = styled.button`
  ${BorderedPill}
  ${InputOrButtonBorderStyle}
  
  width: 3rem;
  height: 3rem;
  padding: 0;

  @media ${breakPoints.phoneOnly} {
    ${IconButtonStyle};
    width: 2rem;
    height: 2rem;

    svg {
      width: 1.25rem;
    }
  }
`;
