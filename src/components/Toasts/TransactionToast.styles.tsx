import styled, { keyframes } from "styled-components/macro";
import { ThemeProps } from "../../style/themes";

export const Container = styled.div<{ theme: ThemeProps }>`
  color: ${(props) => props.theme.colors.white};
  background: ${(props) => props.theme.colors.black};
  &:hover .timer-bar {
    animation-play-state: paused;
  }
`;

export const InfoContainer = styled.div<{ theme: ThemeProps }>`
  display: grid;
  grid-template-columns: auto auto auto;
  margin-top: 1rem;
`;

type IconContainerProps = {
  error?: boolean;
};

export const IconContainer = styled.div<
  { theme: ThemeProps } & IconContainerProps
>`
  background: ${(props) =>
    props.error ? props.theme.colors.red : props.theme.colors.primary};
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 3rem;
  height: 3rem;
  margin: 0 0 0 1rem;
  color: white;
`;

export const HiXContainer = styled.div<{ theme: ThemeProps }>``;

export const TextContainer = styled.div<{ theme: ThemeProps }>`
  margin: 0 1rem;
  font-weight: 700;
`;

export const TimeContainer = styled.div<{ theme: ThemeProps }>`
  display: flex;
  justify-content: space-between;
  margin: 1rem;
`;

// Create the keyframes
export const roundtime = keyframes`
  to {
    transform: scaleX(0);
  }
`;

type TimerBarProps = {
  duration: number;
  error?: boolean;
};

export const TimerBar = styled.div``;

export const TimerBarContainer = styled.div<
  { theme: ThemeProps } & TimerBarProps
>`
  position: relative;
  overflow: hidden;
  background: ${(props) => props.theme.colors.lightGrey};

  ${TimerBar} {
    height: 0.75rem;
    width: 100%;
    animation: ${roundtime} calc(${(props) => props.duration || 30}s) forwards
      linear;
    transform-origin: left center;
    background: ${(props) =>
      props.error ? props.theme.colors.red : props.theme.colors.primary};
  }
`;
