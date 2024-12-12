import styled from "styled-components/macro";

import Icon from "../Icon/Icon";

export const Container = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: center;
  position: relative;
  width: 3.6875rem;
  height: 3.6875rem;
`;

export const StyledIcon = styled(Icon)`
  width: 100%;
  height: 100%;
  color: ${({ theme }) =>
    theme.name === "dark" ? theme.colors.white : theme.colors.primary};

  svg {
    width: 100%;
    height: 100%;
  }
`;
