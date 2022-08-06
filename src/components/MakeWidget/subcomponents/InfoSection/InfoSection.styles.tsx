import styled from "styled-components/macro";

import IconButton from "../../../IconButton/IconButton";

export const Wrapper = styled.div`
  display: grid;
  grid-template-columns: calc(100% - 2rem) 2rem;
  border: 1px solid ${(props) => props.theme.colors.borderGrey};
  width: 100%;
  padding: 0.75rem 1rem;
  background: ${({ theme }) =>
    theme.name === "dark" ? theme.colors.darkGrey : theme.colors.primaryLight};
`;

export const StyledIconButton = styled(IconButton)`
  color: ${({ theme }) =>
    theme.name === "dark" ? theme.colors.white : theme.colors.darkSubText};
`;
