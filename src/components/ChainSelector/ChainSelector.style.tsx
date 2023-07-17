import styled from "styled-components/macro";

import breakPoints from "../../style/breakpoints";
import { BorderedPill, InputOrButtonBorderStyle } from "../../style/mixins";
import ChainSelectionPopover from "../ChainSelectionPopover/ChainSelectionPopover";
import { IconButtonStyle } from "../IconButton/IconButton.styles";

type ContainerProps = {
  isOpen: boolean;
  shiftLeft: boolean;
};

type ArrowIconProps = {
  isOpen: boolean;
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
  text-transform: uppercase;
  font-size: 0.8rem;
  font-weight: bold;

  @media ${breakPoints.tabletPortraitUp} {
    display: inline;
  }
`;

export const ArrowIcon = styled.div<ArrowIconProps>`
  margin-left: 0.5rem;
  transition: transform 0.3s ease-in-out;

  ${({ isOpen }) => (isOpen ? "transform: rotateX(180deg);" : "")}
`;

export const StyledChainSelectionPopover = styled(ChainSelectionPopover)`
  position: absolute;
  min-height: 100%;
  top: 3.5rem;
  left: 0;

  @media ${breakPoints.tabletPortraitUp} {
    right: 0;
    left: auto;
  }
`;
