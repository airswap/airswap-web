import styled from "styled-components";

import MyOrdersList from "../../../MyOrdersWidget/subcomponents/MyOrdersList/MyOrdersList";
import {
  ActionButtonContainer,
  FilledAmount,
  OrderStatusLabel,
  SenderAmount,
  SignerAmount,
  StatusIndicator,
  StyledNavLink,
  Tokens,
} from "../../../MyOrdersWidget/subcomponents/Order/Order.styles";

export const StyledMyLimitOrdersList = styled(MyOrdersList)`
  ${StatusIndicator} {
    order: 1;
  }

  ${Tokens} {
    order: 2;
  }

  ${FilledAmount} {
    order: 3;
  }

  ${SignerAmount} {
    order: 5;
  }

  ${SenderAmount} {
    order: 4;
  }

  ${OrderStatusLabel} {
    order: 6;
  }

  ${StyledNavLink} {
    order: 7;
  }

  ${ActionButtonContainer} {
    order: 8;
  }
`;
