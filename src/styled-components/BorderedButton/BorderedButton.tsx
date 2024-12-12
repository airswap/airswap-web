import styled, { keyframes, css } from "styled-components/macro";

import { BorderedPill, InputOrButtonBorderStyle } from "../../style/mixins";

const pulseStartOpacity = 0.2;
const pulseEndOpacity = 0.5;
const pulseAnimation = keyframes`
 0% {
    opacity: ${pulseStartOpacity};
  }
 20% {
    opacity: ${pulseStartOpacity};
  }
  50% {
    opacity: ${pulseEndOpacity};
  }
  80% {
    opacity: ${pulseStartOpacity};
  }
  100% {
    opacity: ${pulseStartOpacity};
  }
`;

const BorderedButton = styled.button<{ $glow?: boolean }>`
  ${BorderedPill}
  ${InputOrButtonBorderStyle}

  ${({ $glow, theme }) =>
    $glow !== undefined &&
    css`
      position: relative;
      ${$glow &&
      css`
        border-color: ${theme.name === "dark"
          ? theme.colors.primary
          : theme.colors.borderGrey};
      `};
      &:before {
        content: "";
        display: ${$glow ? "block" : "none"};
        position: absolute;
        z-index: -1;
        inset: 0;
        border-radius: 0.75rem;
        transition: opacity 1.2s ease-in-out;
        box-shadow: ${theme.shadows.buttonGlow};
        will-change: opacity;
        animation: ${pulseAnimation} 3s ease-in-out infinite;
        pointer-events: none;
      }
    `}
`;

export default BorderedButton;
