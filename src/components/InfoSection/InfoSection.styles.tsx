import styled from "styled-components/macro";

import Icon from "../Icon/Icon";

export const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid ${(props) => props.theme.colors.borderGrey};
  padding: 0.75rem 1rem;
  background: ${({ theme }) =>
    theme.name === "dark" ? theme.colors.darkGrey : theme.colors.primaryLight};
`;

export const StyledIcon = styled(Icon)`
  color: ${({ theme }) =>
    theme.name === "dark" ? theme.colors.white : theme.colors.darkSubText};
`;
