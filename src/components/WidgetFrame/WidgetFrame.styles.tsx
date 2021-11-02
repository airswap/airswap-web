import styled, { keyframes } from "styled-components/macro";

import { sizes } from "../../style/sizes";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  border-radius: 0.25rem;
  height: 30rem;
  width: 30rem;
  padding: ${sizes.tradeContainerPadding};
  background: ${(props) => props.theme.colors.black};
  overflow: hidden;
`;

export const StyledTradeContainer = styled.div`
  position: relative;
  display: flex;
  box-sizing: border-box;
  margin: 0 auto;
  transition: transform 0.3s ease-in-out;

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

const warp = keyframes`
  0% {
    opacity: 0.8;
    transform: skew(0deg) rotate(0deg) translate(0%, -1%);
  }
  20% {
    opacity: 0.7;
    transform: skew(4.3deg) rotate(-0.7deg) translate(-2%, 0%);
  }
  40% {
    opacity: 0.85;
    transform: skew(0deg) rotate(1.5deg) translate(0%, -2%);
  }
  60%{
    opacity: 0.74;
    transform: skew(-4.2deg) rotate(-0.2deg) translate(2%, 0%);
  }
  80%{
    opacity: 0.87;
    transform: skew(0.3deg) rotate(-0.5deg) translate(-1%, 1%);
  }
  92%{
    opacity: 0.8;
    transform: skew(0deg) rotate(1deg) translate(0.1%, 0%);
  }
`;

export const BackgroundBlurriness = styled.div`
  position: absolute;
  inset: -0.8rem;
  background-image: linear-gradient(
    45deg,
    ${(props) => props.theme.colors.primary},
    ${(props) => props.theme.colors.primaryDark}
  );
  ${(props) => props.theme.colors.primary};
  filter: blur(100px);
  opacity: 0.8;
  border-radius: 1rem;
  will-change: transform, opacity;
  animation: ${warp} 11s infinite;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;
