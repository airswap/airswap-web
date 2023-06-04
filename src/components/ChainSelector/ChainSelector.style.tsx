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

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }

  @media ${breakPoints.tabletPortraitUp} {
    transform: ${({ shiftLeft }) =>
      shiftLeft ? "translate(-12.75rem, 0)" : "0"};
    transition: transform 0.3s ease-in-out;
  }
`;

export const ChainSelectButton = styled.button`
  ${BorderedPill}
  ${InputOrButtonBorderStyle}

  align-items: center;
  padding: 0 0.5rem;

  @media ${breakPoints.tabletPortraitUp} {
    padding: 0 1rem;
  }

  @media ${breakPoints.phoneOnly} {
    ${IconButtonStyle};

    height: 2.5rem;
  }
`;

export const ChainIcon = styled.img`
  width: 1.5rem;

  @media ${breakPoints.tabletPortraitUp} {
    margin-right: 0.5rem;
  }
`;

export const ChainNameText = styled.span`
  display: none;

  @media ${breakPoints.tabletPortraitUp} {
    display: inline;
  }
`;

export const ArrowIcon = styled.div<ArrowIconProps>`
  margin-left: 0.5rem;
  transition: transform 0.3s ease-in-out;

  ${({ open }) => open && `transform: rotateX(180deg);`}
`;
