import { AiOutlineLoading } from "react-icons/ai";

import styled, { keyframes } from "styled-components/macro";

export const LoadingSpinnerContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

export const SpinningIcon = styled(AiOutlineLoading)`
  animation: ${spin} 1s linear infinite;
`;
