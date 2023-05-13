import { MdDoneAll } from "react-icons/md";

import styled from "styled-components/macro";

import { InfoHeading, InfoSubHeading } from "../../../Typography/Typography";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
  justify-content: center;
  flex-grow: 1;
  padding-bottom: 4rem;
`;

export const StyledInfoHeading = styled(InfoHeading)`
  & + ${InfoSubHeading} {
    margin-top: 0.25rem;
  }
`;

export const DoneAllIcon = styled(MdDoneAll)`
  font-size: 8rem;
  margin: 2rem auto;
  color: ${({ theme }) =>
    theme.name === "dark" ? theme.colors.white : theme.colors.primary};
`;
