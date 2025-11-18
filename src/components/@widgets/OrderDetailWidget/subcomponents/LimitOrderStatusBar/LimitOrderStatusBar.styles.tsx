import styled from "styled-components";

import { InfoSectionHeading } from "../../../../../styled-components/InfoSection/InfoSection";
import OrderStatusInfo from "../OrderStatusInfo/OrderStatusInfo";

export const Container = styled(InfoSectionHeading)`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 0.25rem;
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

export const LiveIndicator = styled.span`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${({ theme }) => theme.colors.white};
`;

export const LiveIndicatorLight = styled.span`
  width: 0.5rem;
  aspect-ratio: 1;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.green};
`;

export const StyledOrderStatusInfo = styled(OrderStatusInfo)`
  justify-self: flex-end;
  margin-left: auto;
`;
