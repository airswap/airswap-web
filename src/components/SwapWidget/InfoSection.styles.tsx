import styled from "styled-components/macro";

import { BorderlessButtonStyle } from "../../style/mixins";
import IconButton from "../IconButton/IconButton";
import { InfoHeading } from "../Typography/Typography";

export const StyledInfoHeading = styled(InfoHeading)`
  display: flex;
  align-items: center;
`;

export const RevertPriceButton = styled(IconButton)`
  transform: rotate(90deg);
  position: relative;
  margin-left: 0.25rem;
  padding: 0.25rem;
  font-size: 1rem;
  color: ${(props) => props.theme.colors.lightGrey};

  &:hover,
  &:focus {
    color: ${(props) => props.theme.colors.white};
  }

  ${BorderlessButtonStyle}
`;
