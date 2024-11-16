import { MdDoneAll } from "react-icons/md";

import styled from "styled-components/macro";

import { BorderlessButtonStyle } from "../../../../../style/mixins";
import { LargePillButton } from "../../../../../styled-components/Pill/Pill";
import IconButton from "../../../../IconButton/IconButton";
import TransactionLink from "../../../../TransactionLink/TransactionLink";
import { InfoHeading, InfoSubHeading } from "../../../../Typography/Typography";

export const StyledInfoHeading = styled(InfoHeading)`
  display: flex;
  align-items: center;
  color: ${(props) => props.theme.colors.lightGrey};

  & + ${InfoSubHeading} {
    margin-top: 0.25rem;
  }
`;

export const RevertPriceButton = styled(IconButton)`
  transform: rotate(90deg);
  position: relative;
  margin-left: 0.25rem;
  padding: 0.25rem;
  font-size: 1rem;
  color: ${(props) => props.theme.colors.white};

  &:hover,
  &:focus {
    color: ${(props) => props.theme.colors.white};
  }

  ${BorderlessButtonStyle}
`;

export const StyledLargePillButton = styled(LargePillButton)`
  margin-top: 1rem;
`;

export const DoneAllIcon = styled(MdDoneAll)`
  font-size: 8rem;
  margin: 0 auto 2rem;
  color: ${({ theme }) =>
    theme.name === "dark" ? theme.colors.white : theme.colors.primary};
`;

export const StyledTransactionLink = styled(TransactionLink)`
  margin-top: 0.5rem;
`;
