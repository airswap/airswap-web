import styled from "styled-components/macro";

import breakPoints from "../../../../style/breakpoints";

const triangleSize = 14;

export const Container = styled.div`
  position: absolute;
  display: flex;
  align-items: flex-end;
  bottom: calc(100% + 1rem);
  right: 0;
  width: 100%;
  max-width: 17rem;
  height: 4.5rem;

  @media ${breakPoints.tabletLandscapeUp} {
    align-items: center;
    top: 0;
    right: inherit;
    bottom: inherit;
    left: calc(100% + 1.25rem);
  }
`;

export const ContentContainer = styled.div`
  border: 1px solid ${(props) => props.theme.colors.borderGrey};
  border-radius: 2px;
  padding: 0.75rem;
  line-height: 1.2;
  font-size: 0.875rem;
  color: ${({ theme }) =>
    theme.name === "dark" ? theme.colors.white : theme.colors.darkGrey};
  background: ${({ theme }) =>
    theme.name === "dark" ? theme.colors.darkGrey : theme.colors.primaryLight};
  filter: drop-shadow(${(props) => props.theme.shadows.tooltipGlow});
  pointer-events: none;
`;

export const Triangle = styled.div`
  transform: rotate(-45deg);
  position: absolute;
  width: ${triangleSize}px;
  height: ${triangleSize}px;
  bottom: -${triangleSize / 2}px;
  left: calc(100% - 2rem);
  border: 1px solid ${(props) => props.theme.colors.borderGrey};
  border-top: 0;
  border-right: 0;
  background: ${({ theme }) =>
    theme.name === "dark" ? theme.colors.darkGrey : theme.colors.primaryLight};

  @media ${breakPoints.tabletLandscapeUp} {
    transform: rotate(45deg);
    top: calc(50% - ${triangleSize / 2}px);
    left: -${triangleSize / 2}px;
  }
`;
