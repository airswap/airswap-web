import styled from "styled-components/macro";

import { WidgetHeader } from "../../../../styled-components/WidgetHeader/WidgetHeader";
import OrderRecipientInfo from "../OrderRecipientInfo/OrderRecipientInfo";
import OrderStatusInfo from "../OrderStatusInfo/OrderStatusInfo";

export const InfoContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  flex-wrap: wrap;
  flex-grow: 1;
  position: relative;
  margin-left: 0.5rem;
`;

export const StyledWidgetHeader = styled(WidgetHeader)`
  margin-bottom: 1.375rem;
`;

export const StyledOrderRecipientInfo = styled(OrderRecipientInfo)`
  max-width: 100%;
  margin-bottom: 0.5rem;
`;

export const StyledOrderStatusInfo = styled(OrderStatusInfo)`
  max-width: 100%;
  margin-left: 0.5rem;
`;
