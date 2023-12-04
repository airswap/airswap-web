import breakPoints from "../../../../style/breakpoints";
import IconButton from "../../../IconButton/IconButton";
import styled from "styled-components/macro";

export const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 4.125rem;
  min-height: 4.125rem;
  padding: 0 1.125rem;
  background: ${({ theme }) =>
    theme.name === "dark" ? theme.colors.black : theme.colors.primary};

  @media ${breakPoints.tabletPortraitUp} {
    display: none;
  }
`;

export const StyledAirswapButton = styled(IconButton)`
  margin-left: -0.5rem;
`;

export const StyledCloseButton = styled(IconButton)`
  margin-right: -0.5rem;
`;
