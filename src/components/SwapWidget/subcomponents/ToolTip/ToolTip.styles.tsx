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
  font-size: 0.8125rem;
  color: ${(props) => props.theme.colors.white};
  background: ${(props) => props.theme.colors.darkGrey};
  pointer-events: none;
`;

export const Triangle = styled.div`
  transform: rotate(-45deg);
  position: absolute;
  width: ${triangleSize}px;
  height: ${triangleSize}px;
  bottom: -${triangleSize / 2}px;
  left: calc(100% - 2rem);
  overflow: hidden;

  &:after {
    content: "";
    display: block;
    position: absolute;
    top: -1px;
    left: 1px;
    width: ${triangleSize}px;
    height: ${triangleSize}px;
    background: ${(props) => props.theme.colors.darkGrey};
  }

  @media ${breakPoints.tabletLandscapeUp} {
    transform: rotate(45deg);
    top: calc(50% - ${triangleSize / 2}px);
    left: -${triangleSize / 2}px;
  }
`;

export const Square = styled.div`
  width: ${triangleSize}px;
  height: ${triangleSize}px;
  border: 1px solid ${(props) => props.theme.colors.borderGrey};
  background: ${(props) => props.theme.colors.darkGrey};
`;
