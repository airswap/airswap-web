import styled, { css } from "styled-components/macro";

import Button from "../Button/Button";

export const ButtonsContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  padding-top: 2rem;
  max-width: 30rem;
`;

const ButtonStyle = css`
  width: fit-content;
  padding-inline: 3.5rem;
`;

export const MakeNewLimitOrderButton = styled(Button)`
  ${ButtonStyle};
`;
export const ShowLimitOrderButton = styled(Button)`
  ${ButtonStyle};
`;
