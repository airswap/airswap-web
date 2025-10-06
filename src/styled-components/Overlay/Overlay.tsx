import styled from "styled-components";
import { keyframes } from "styled-components";

import TransactionLink from "../../components/TransactionLink/TransactionLink";
import { InfoSubHeading, Title } from "../../components/Typography/Typography";
import { sizes } from "../../style/sizes";

export const OverlayContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex-grow: 1;
  transition: transform 0.3s cubic-bezier(0.68, 0.007, 0.488, 0.997);
  width: 100%;
  max-width: ${sizes.widgetWidth}px;
`;

export const OverlayTitle = styled(Title)<{ isFocused?: boolean }>`
  margin-block-start: 1.75rem;
  font-size: 1.875rem;
  color: ${({ theme }) => theme.colors.carteBlanche};

  &:first-child {
    margin-block-start: 0;
  }
`;

export const OverlaySubHeading = styled(InfoSubHeading)<{ isHidden?: boolean }>`
  display: flex;
  align-items: center;
  flex-grow: 1;
  margin-top: 1.75rem;
  padding: 0 15%;
  font-weight: 500;
  text-align: center;
  transition: opacity 0.3s ease-in-out;

  ${({ isHidden }) => isHidden && "opacity: 0; pointer-events: none;"}
`;

export const OverlayTransactionLink = styled(TransactionLink)<{
  isHidden?: boolean;
}>`
  margin-top: 0rem;
  transition: opacity 0.3s ease-in;

  ${({ isHidden }) => isHidden && "opacity: 0; pointer-events: none;"}
`;

const spin = keyframes`
  to {
    transform: rotate(1turn);
  }
`;

export const OverlaySpinningLoader = styled.div`
  width: 3.6875rem;
  height: 3.6875rem;
  border-radius: 50%;
  border: 4px solid;
  border-color: #475777;
  border-right-color: ${({ theme }) => theme.colors.carteBlanche};
  animation: ${spin} 2s infinite linear;
`;
