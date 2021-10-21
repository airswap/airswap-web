import styled, { keyframes } from "styled-components";

const scaleInAnimation = keyframes`
  from {
    transform: scale(0);
  }

  to {
    transform: scale(1);
  }
`;

type BackgroundOverlayProps = {
  open: boolean;
};

const BackgroundOverlay = styled.div<BackgroundOverlayProps>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: ${(props) => props.theme.colors.alwaysBlack};
  opacity: 0.6;
  transform: scale(${(props) => (props.open ? "1" : "0")});
  z-index: 1000;

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

type ContainerProps = {
  open: boolean;
};

const Container = styled.div<ContainerProps>`
  position: absolute;
  width: 24rem;
  height: 100vh;
  background-color: ${(props) => props.theme.colors.black};
  border-left: 1px solid ${(props) => props.theme.colors.borderGrey};
  padding: 50px;
  top: 0;
  right: 0;
  transform: ${({ open }) => (open ? "translateX(0)" : "translateX(24rem)")};
  transition: transform 0.3s ease-in-out;
  z-index: 1001;

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

export { BackgroundOverlay, Container };
