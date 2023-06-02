import styled from "styled-components/macro";

import breakPoints from "../../style/breakpoints";
import { BorderedPill, InputOrButtonBorderStyle } from "../../style/mixins";
import { IconButtonStyle } from "../IconButton/IconButton.styles";

/**
 * @remarks `open` in ContainerProps is a boolean value that controls when the chain selection menu should be displayed or not. It also makes the arrow icon rotate on the ChainButton component
 */
type ContainerProps = {
  open: boolean;
  shiftLeft: boolean;
};

/**
 * @remarks `open` is a boolean value that controls when arrow icon rotates on the ChainButton component
 */
type ArrowIconProps = {
  open: boolean;
};

/**
 * @remarks `shiftLeft` in ContainerProps takes in transactionsTabOpen as an argument. This bool value originates at the WalletButton component. When WalletButton is clicked, right-side drawer opens up, which makes transactionsTabOpen. When this is open, ChainButton must shiftLeft to the left to prevent UI component overlap
 */
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
