import styled from "styled-components/macro";

export const Track = styled.div`
  width: 100%;
  height: 0.25rem;
  background-color: ${(props) => props.theme.colors.borderGrey};
  border-radius: 0.1875rem;
  overflow: hidden;
`;

interface ProgressBarProps {
  initialWidth: number;
  duration: number;
}

export const Progress = styled.div<ProgressBarProps>`
  height: 100%;
  transform: scaleX(${({ initialWidth }) => initialWidth});
  background-color: ${(props) => props.theme.colors.primary};
  transform-origin: left;
  transition: transform ${({ duration }) => duration}s linear;
  will-change: transform;
`;
