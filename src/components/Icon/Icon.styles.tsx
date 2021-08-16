import styled from "styled-components/macro";

interface StyledIconProps {
  iconSize: number;
}

export const StyledIcon = styled.div<StyledIconProps>`
  svg {
    width: ${(props) => `${props.iconSize}rem`};
    height: ${(props) => `${props.iconSize}rem`};
  }

  circle,
  path,
  polygon,
  rect {
    fill: ${(props) => props.color || "currentColor"};
  }

  .stroke {
    fill: none;
    stroke: ${(props) => props.color || "currentColor"};
  }
`;
