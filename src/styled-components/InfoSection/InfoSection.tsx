import styled from "styled-components";

import IconButton from "../../components/IconButton/IconButton";
import { InfoHeading } from "../../components/Typography/Typography";
import { BorderlessButtonStyle } from "../../style/mixins";

export const InfoSectionHeading = styled(InfoHeading)`
  display: flex;
  align-items: center;
  color: ${(props) => props.theme.colors.lightGrey};
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
