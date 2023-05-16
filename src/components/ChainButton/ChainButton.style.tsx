import styled from "styled-components/macro";

import breakPoints from "../../style/breakpoints";
import { BorderedPill, InputOrButtonBorderStyle } from "../../style/mixins";
import { IconButtonStyle } from "../IconButton/IconButton.styles";

type ContainerProps = {
  open: boolean;
};

export const Container = styled.div<ContainerProps>`
  position: relative;
  transition: transform 0.3s ease-in-out;

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }

  @media ${breakPoints.phoneOnly} {
    transform: none;
    transition: none;
  }
`;

export const ChainSelectButton = styled.button`
  ${BorderedPill}
  ${InputOrButtonBorderStyle}

  display: flex;
  flex-direction: row;
  align-content: center;
  width: 10rem;
  height: 3rem;
  padding: 0;
  font-weight: bold;
  margin-right: 0.5rem;

  @media ${breakPoints.phoneOnly} {
    ${IconButtonStyle};
    width: 2rem;
    height: 2rem;
  }
`;

export const ChainIcon = styled.img`
  width: 1.5rem;
  height: auto;
  margin-right: 0.5rem;
`;
