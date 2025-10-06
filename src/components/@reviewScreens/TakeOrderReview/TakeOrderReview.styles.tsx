import styled from "styled-components/macro";

import { BorderlessButtonStyle } from "../../../style/mixins";
import { WidgetHeader } from "../../../styled-components/WidgetHeader/WidgetHeader";
import IconButton from "../../IconButton/IconButton";
import OrderReviewToken from "../../OrderReviewToken/OrderReviewToken";
import ActionButtons from "../../ReviewActionButtons/ReviewActionButtons";

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

export const OrderReviewSenderToken = styled(OrderReviewToken)``;
export const OrderReviewSignerToken = styled(OrderReviewToken)``;

export const Container = styled.div<{ isSigner?: boolean }>`
  display: flex;
  flex-direction: column;
  flex-grow: 1;

  ${StyledWidgetHeader} {
    order: -2;
  }

  ${OrderReviewSignerToken} {
    order: ${({ isSigner }) => (isSigner ? -1 : "inherit")};
  }

  ${OrderReviewSenderToken} {
    order: ${({ isSigner }) => (isSigner ? 0 : "inherit")};
  }
`;
