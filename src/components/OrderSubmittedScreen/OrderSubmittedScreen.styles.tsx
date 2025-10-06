import styled, { css } from "styled-components/macro";

import Button from "../Button/Button";

export const ButtonsContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  padding-top: 2rem;
  width: 100%;
  max-width: 30rem;
`;

const ButtonStyle = css`
  width: calc(50% - 0.5rem);
  height: auto;
  min-height: 3rem;
  line-height: 1.375;
  padding: 0.375rem 1rem;
  white-space: normal;
`;

export const MakeNewOrderButton = styled(Button)`
  ${ButtonStyle};
`;

export const ReturnToOrderButton = styled(Button)`
  ${ButtonStyle};
`;

export const TrackTransactionButton = styled(Button)`
  ${ButtonStyle};
`;
