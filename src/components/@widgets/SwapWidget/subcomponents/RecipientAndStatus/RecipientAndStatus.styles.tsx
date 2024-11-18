import styled from "styled-components";

import { InfoSectionHeading } from "../../../../../styled-components/InfoSection/InfoSection";
import OrderStatusInfo from "../../../OrderDetailWidget/subcomponents/OrderStatusInfo/OrderStatusInfo";

export const Container = styled(InfoSectionHeading)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
  height: 3rem;
  border: 1px solid ${({ theme }) => theme.colors.borderGrey};
  border-radius: 0.5rem;
  padding-inline: 1rem;
  font-weight: 500;
  background-color: ${({ theme }) => theme.colors.darkGrey};
`;

export const StyledInfoSectionHeading = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
`;

export const Recipient = styled.span`
  color: ${({ theme }) => theme.colors.white};
`;

export const StyledOrderStatusInfo = styled(OrderStatusInfo)``;
