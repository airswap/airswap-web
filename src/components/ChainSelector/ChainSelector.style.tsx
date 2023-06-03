import styled from "styled-components/macro";

import breakPoints from "../../style/breakpoints";
import { BorderedPill, InputOrButtonBorderStyle } from "../../style/mixins";
import { IconButtonStyle } from "../IconButton/IconButton.styles";

type ContainerProps = {
  open: boolean;
  shiftLeft: boolean;
};

type ArrowIconProps = {
  open: boolean;
};

export const Container = styled.div<ContainerProps>`
  position: relative;
  transform: ${({ shiftLeft }) =>
    shiftLeft ? "translate(-12.75rem, 0)" : "0"};
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

  width: fit;
  font-weight: bold;
  margin-right: 0.5rem;
  margin-left: 0.5rem;
  align-items: center;

  @media ${breakPoints.tabletPortraitUpMax} {
    padding-right: 1rem;
    padding-left: 1rem;
  }

  @media ${breakPoints.phoneOnly} {
    ${IconButtonStyle};
    width: fit;
    height: 2rem;
    height: 2.5rem;
  }
`;

export const ChainIcon = styled.img`
  width: 1.5rem;
  height: max;
  margin-right: 0.5rem;
`;

export const ChainNameText = styled.span`
  @media ${breakPoints.tabletPortraitUpMax} {
    display: none;
  }
`;

export const ArrowIcon = styled.div<ArrowIconProps>`
  margin-left: 0.5rem;
  transition: transform 0.3s ease-in-out;

  ${({ open }) => open && `transform: rotateX(180deg);`}
`;
