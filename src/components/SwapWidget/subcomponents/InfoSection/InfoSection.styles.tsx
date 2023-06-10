import { MdDoneAll } from "react-icons/md";

import styled from "styled-components/macro";

import { BorderlessButtonStyle } from "../../../../style/mixins";
import { LargePillButton } from "../../../../styled-components/Pill/Pill";
import IconButton from "../../../IconButton/IconButton";
import { InfoHeading, InfoSubHeading } from "../../../Typography/Typography";
import { StyledParagraph } from "../../../Typography/Typography.styles";

type StyledInfoHeadingProps = {
  serverUrl?: string | null;
};

export const StyledInfoHeading = styled(InfoHeading)<StyledInfoHeadingProps>`
  display: flex;
  align-items: center;
  margin-top: ${({ serverUrl }) => (serverUrl ? "1rem" : "0")};

  & + ${InfoSubHeading} {
    margin-top: 0.25rem;
  }
`;

export const FeeTextContainer = styled.div`
  display: flex;
  align-items: center;
`;

export const FeeText = styled(StyledParagraph)`
  color: ${(props) => props.theme.colors.lightGrey};
`;

export const ApprovalText = styled(InfoSubHeading)`
  font-size: 1rem;
`;

export const InfoButton = styled(IconButton)`
  display: inline-block;
  padding: 0.25rem;
  color: ${(props) => props.theme.colors.lightGrey};

  &:hover,
  &:focus {
    color: ${(props) => props.theme.colors.white};
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
