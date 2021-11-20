import styled, { keyframes, css } from "styled-components/macro";

import { BorderedPill, InputOrButtonBorderStyle } from "../../style/mixins";

const beatAnimation = keyframes`
 0% {
    transform: scale(0.9);
  }
 20% {
    transform: scale(0.9);
  }
  50% {
    transform: scale(1);
  }
  80% {
    transform: scale(0.9);
  }
  100% {
    transform: scale(0.9);
  }
`;

const BorderedButton = styled.button<{ $glow?: boolean }>`
  ${BorderedPill}
  ${InputOrButtonBorderStyle}

  ${({ $glow, theme }) =>
    $glow !== undefined &&
    css`
      position: relative;
      background: ${theme.name === "dark"
        ? theme.colors.black
        : theme.colors.primary};
      ${$glow &&
      css`
        border-color: ${theme.name === "dark"
          ? theme.colors.primary
          : theme.colors.borderGrey};
      `};
      &:after {
        position: absolute;
        display: block;
        inset: 0;
        border-radius: 24rem;
        content: "";
        opacity: ${$glow ? 1 : 0};
        transition: opacity 1.2s ease-in-out;
        box-shadow: ${theme.shadows.buttonGlow};
        background: ${theme.shadows.buttonGlowFill};
        will-change: transform, opacity;
        animation: ${beatAnimation} 3s ease-in-out infinite;
        z-index: -1;
      }
    `}
`;

export default BorderedButton;
