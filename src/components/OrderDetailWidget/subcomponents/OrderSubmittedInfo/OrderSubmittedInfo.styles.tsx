import { MdDoneAll } from "react-icons/md";

import styled from "styled-components/macro";

import Icon from "../../../Icon/Icon";
import {
  InfoHeading,
  InfoSubHeading,
  Link,
} from "../../../Typography/Typography";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  flex-grow: 1;
  padding-bottom: 4rem;
`;

export const StyledInfoHeading = styled(InfoHeading)`
  & + ${InfoSubHeading} {
    margin-top: 0.25rem;
  }
`;

export const StyledLink = styled(Link)`
  display: flex;
  width: fit-content;
  align-items: center;
  margin-top: 1rem;
  text-decoration: none;

  &:hover,
  &:active {
    text-decoration: underline;
  }
`;

export const StyledLinkIcon = styled(Icon)`
  margin-left: 0.5rem;
`;

export const DoneAllIcon = styled(MdDoneAll)`
  font-size: 8rem;
  margin: 2rem auto;
  color: ${({ theme }) =>
    theme.name === "dark" ? theme.colors.white : theme.colors.primary};
`;
