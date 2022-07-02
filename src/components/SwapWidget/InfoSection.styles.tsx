import styled from "styled-components/macro";

import { BorderlessButtonStyle } from "../../style/mixins";
import IconButton from "../IconButton/IconButton";
import { InfoHeading, InfoSubHeading } from "../Typography/Typography";
import { StyledParagraph } from "../Typography/Typography.styles";

export const StyledInfoHeading = styled(InfoHeading)`
  display: flex;
  align-items: center;

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
