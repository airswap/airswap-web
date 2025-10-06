import styled from "styled-components";

import { InfoSectionHeading } from "../../../../../styled-components/InfoSection/InfoSection";
import OrderStatusInfo from "../OrderStatusInfo/OrderStatusInfo";

export const Container = styled(InfoSectionHeading)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
  min-height: 3rem;
  border: 1px solid ${({ theme }) => theme.colors.borderGrey};
  border-radius: 0.5rem;
  padding-block: 0.5rem;
  padding-inline: 1rem;
  font-weight: 500;
  background-color: ${({ theme }) => theme.colors.darkGrey};
`;

export const FilledAmount = styled.span`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  color: ${({ theme }) => theme.colors.white};
`;

export const Title = styled.span`
  color: ${({ theme }) => theme.colors.lightGrey};
`;

export const Recipient = styled.div`
  color: ${({ theme }) => theme.colors.lightGrey};
`;

export const StyledOrderStatusInfo = styled(OrderStatusInfo)``;
