import styled from "styled-components";

import LoadingSpinner from "../../../LoadingSpinner/LoadingSpinner";
import { SpinningIcon } from "../../../LoadingSpinner/LoadingSpinner.styles";

export const TokensScrollContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  position: relative;
  margin-block-start: 0.5rem;
  width: 100%;
  height: fit-content;
  min-height: 10rem;
`;

export const TokensContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const TokenListLoader = styled(LoadingSpinner)`
  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background: ${(props) => props.theme.colors.darkBlue};
    opacity: 0.35;
  }

  position: absolute;
  inset: 0;

  ${SpinningIcon} {
    width: 2rem;
    height: 2rem;
  }
`;
