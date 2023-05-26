import styled from "styled-components/macro";

import breakPoints from "../../../../style/breakpoints";
import { TooltipStyle } from "../../../../styled-components/Tooltip/Tooltip";

const triangleSize = 14;

export const Container = styled.div`
  display: flex;
  align-items: flex-end;
  max-width: 17rem;
  height: 4.5rem;

  @media ${breakPoints.tabletLandscapeUp} {
    align-items: center;
    top: 0;
    right: inherit;
    bottom: inherit;
    left: calc(100% + 1.25rem);
    width: 100%;
    height: auto;
  }
`;

export const ContentContainer = styled.div`
  ${TooltipStyle};

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
