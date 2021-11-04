import styled, { keyframes, css } from "styled-components/macro";

const glowAnimation = keyframes`
  0% {
    transform: translate(-1.5%, -2%);
  }
  25% {
    transform: translate(-1.5%, 2%);
  }
  50% {
    transform: translate(1.5%, 2%);
  }
  75% {
    transform: translate(1.5%, -2%);
  }
  100% {
    transform: translate(-1.5%, -2%);
  }
`;

const BorderedButton = styled.div<{ $glow?: boolean }>`
  display: flex;
  align-items: center;
  padding: 1rem 1.25rem;
  border: 1px solid ${(props) => props.theme.colors.darkGrey};
  border-radius: 24rem;
  transition: border-color ease-out 0.3s;

  &:hover {
    border-color: ${(props) => props.theme.colors.white};
  }

  ${({ $glow, theme }) =>
    $glow !== undefined &&
    css`
      position: relative;
      background: ${theme.colors.black};
      ${$glow &&
      css`
        border-color: ${theme.colors.primary};
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
        animation: ${glowAnimation} 4s linear infinite reverse;
        z-index: -1;
      }
    `}
`;

export default BorderedButton;
