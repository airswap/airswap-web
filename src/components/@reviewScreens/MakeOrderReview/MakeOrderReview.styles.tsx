import styled from "styled-components/macro";

import { BorderlessButtonStyle } from "../../../style/mixins";
import { WidgetHeader } from "../../../styled-components/WidgetHeader/WidgetHeader";
import IconButton from "../../IconButton/IconButton";
import ActionButtons from "../../ReviewActionButtons/ReviewActionButtons";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

export const StyledWidgetHeader = styled(WidgetHeader)`
  margin-bottom: 0.75rem;
`;

export const StyledIconButton = styled(IconButton)`
  ${BorderlessButtonStyle};

  margin-top: 0.1875rem;
  padding: 0;

  &:hover,
  &:active {
    color: ${(props) => props.theme.colors.white};
  }
`;

export const StyledActionButtons = styled(ActionButtons)`
  justify-self: flex-end;
  margin-top: auto;
`;
