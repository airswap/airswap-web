import { MdDoneAll } from "react-icons/md";

import styled, { css } from "styled-components/macro";

import { fontWide } from "../../style/themes";
import Button from "../Button/Button";
import Icon from "../Icon/Icon";
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
  padding-bottom: 2rem;
`;

export const StyledInfoSubHeading = styled(InfoSubHeading)`
  font-weight: 500;
`;

export const StyledInfoHeading = styled(InfoHeading)`
  margin-top: 1.75rem;
  font-size: 1.875rem;
  font-weight: 700;

  & + ${StyledInfoSubHeading} {
    margin-top: 1.25rem;
  }
`;

export const StyledTransactionLink = styled(TransactionLink)`
  margin-top: 1rem;
`;

export const StyledIcon = styled(Icon)`
  width: 3.6875rem;
  height: 3.6875rem;
  color: ${({ theme }) =>
    theme.name === "dark" ? theme.colors.white : theme.colors.primary};

  svg {
    width: 100%;
    height: 100%;
  }
`;

export const ButtonsContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
`;

const ButtonStyle = css`
  width: fit-content;
  padding-inline: 3.5rem;
`;

export const MakeNewOrderButton = styled(Button)`
  ${ButtonStyle};
`;
export const TrackTransactionButton = styled(Button)`
  ${ButtonStyle};
`;
