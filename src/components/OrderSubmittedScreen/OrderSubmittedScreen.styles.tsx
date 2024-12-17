import styled, { css } from "styled-components/macro";

import Button from "../Button/Button";

export const ButtonsContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  padding-top: 2rem;
`;

const ButtonStyle = css`
  width: fit-content;
  padding-inline: 3.5rem;
`;

export const MakeNewOrderButton = styled(Button)`
  ${ButtonStyle};
`;
export const TrackTransactionButton = styled(Button)`
  ${ButtonStyle};
`;
