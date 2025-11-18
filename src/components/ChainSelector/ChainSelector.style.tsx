import styled from "styled-components/macro";

import breakPoints from "../../style/breakpoints";
import { BorderedPill, InputOrButtonBorderStyle } from "../../style/mixins";
import ChainSelectionPopover from "../ChainSelectionPopover/ChainSelectionPopover";
import { IconButtonStyle } from "../IconButton/IconButton.styles";

type ContainerProps = {
  isOpen: boolean;
};

type ArrowIconProps = {
  isOpen: boolean;
};

export const Container = styled.div<ContainerProps>`
  position: relative;
`;

export const ChainSelectButton = styled.button`
  ${BorderedPill}
  ${InputOrButtonBorderStyle}
  
  align-items: center;
  padding: 0 1rem;
  padding-right: 0.75rem;

  @media ${breakPoints.phoneOnly} {
    ${IconButtonStyle};

    height: 2.5rem;
  }
`;

export const ChainIcon = styled.img`
  margin-right: 0.25rem;
  width: 1rem;
`;

export const ChainNameText = styled.span`
  display: none;
  text-transform: uppercase;
  font-size: 0.9375rem;
  font-weight: 700;

  @media ${breakPoints.tabletPortraitUp} {
    display: inline;
  }
`;

export const ArrowIcon = styled.div<ArrowIconProps>`
  margin-top: 0.125rem;
  transition: transform 0.3s ease-in-out;

  svg {
    width: 1.5rem;
    height: 1.5rem;
  }

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
