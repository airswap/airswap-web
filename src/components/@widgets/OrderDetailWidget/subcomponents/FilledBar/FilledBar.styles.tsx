import styled from "styled-components";

import { InfoSectionHeading } from "../../../../../styled-components/InfoSection/InfoSection";
import OrderStatusInfo from "../OrderStatusInfo/OrderStatusInfo";

export const Container = styled(InfoSectionHeading)`
  display: flex;
  justify-content: center;
  flex-direction: column;
  gap: 0.5rem;
  height: 4.5rem;
  border: 1px solid ${({ theme }) => theme.colors.borderGrey};
  border-radius: 0.5rem;
  padding-block: 0.5rem;
  padding-inline: 1rem;
  font-weight: 500;
  background-color: ${({ theme }) => theme.colors.darkGrey};
`;

export const FilledAmount = styled.span`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 0.375rem;
  width: 100%;
  color: ${({ theme }) => theme.colors.white};
`;

export const FilledBarContainer = styled.div`
  position: relative;
  border-radius: 1rem;
  width: 100%;
  height: 0.5rem;
  background-color: ${({ theme }) => theme.colors.darkBlue};
  overflow: hidden;
`;

export const FilledBarProgress = styled.div<{ filledPercentage: number }>`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  border-top-right-radius: 1rem;
  border-bottom-right-radius: 1rem;
  overflow: hidden;
  width: ${({ filledPercentage }) => filledPercentage}%;
  background-color: ${({ theme }) => theme.colors.primary};
`;

export const Title = styled.span`
  justify-self: flex-start;
  margin-right: auto;
  color: ${({ theme }) => theme.colors.white};
`;

export const Recipient = styled.div`
  color: ${({ theme }) => theme.colors.lightGrey};
`;

export const FilledPercentage = styled.span`
  color: ${({ theme }) => theme.colors.lightGrey};
`;

export const StyledOrderStatusInfo = styled(OrderStatusInfo)``;
