import { MdDoneAll } from "react-icons/md";

import styled from "styled-components/macro";

import Button from "../Button/Button";
import TransactionLink from "../TransactionLink/TransactionLink";
import { InfoHeading, InfoSubHeading } from "../Typography/Typography";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

export const InfoContainer = styled.div`
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

export const StyledTransactionLink = styled(TransactionLink)`
  margin-top: 1rem;
`;

export const DoneAllIcon = styled(MdDoneAll)`
  font-size: 8rem;
  margin: 2rem auto;
  color: ${({ theme }) =>
    theme.name === "dark" ? theme.colors.white : theme.colors.primary};
`;

export const ButtonsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1rem;
`;

export const MakeNewOrderButton = styled(Button)`
  width: 100%;
`;

export const TrackTransactionButton = styled(Button)`
  width: 100%;
`;
