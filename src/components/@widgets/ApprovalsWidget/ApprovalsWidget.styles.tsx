import styled from "styled-components/macro";

import breakPoints from "../../../style/breakpoints";
import { FadedScrollContainer } from "../../FadedScrollContainer/FadedScrollContainer";
import LoadingSpinner from "../../LoadingSpinner/LoadingSpinner";
import { SpinningIcon } from "../../LoadingSpinner/LoadingSpinner.styles";
import ModalOverlay from "../../ModalOverlay/ModalOverlay";
import {
  Container as ModalContainer,
  ContentContainer,
} from "../../ModalOverlay/ModalOverlay.styles";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 23.25rem;
`;

export const StyledScrollContainer = styled.div`
  margin-block-start: 2.5rem;
`;

export const StyledFadedScrollContainer = styled(FadedScrollContainer)`
  position: relative;
  display: grid;
  grid-template-columns: subgrid;
  grid-column: 1 / -1;
  width: 100%;
  max-height: 20rem;
`;

export const ApprovalsGrid = styled.div<{ isLoading: boolean }>`
  position: relative;
  display: grid;
  grid-template-columns: 3fr 3fr 3fr 3fr 1fr;
  grid-column-gap: 0.5rem;
  grid-row-gap: 0.5rem;
  width: 100%;
  padding: 0 1rem;
  opacity: ${(props) => (props.isLoading ? 0.5 : 1)};

  @media ${breakPoints.phoneOnly} {
    grid-template-columns: 1fr 1fr 1r 1fr;
    width: calc(100% + 1rem);
  }

  @media ${breakPoints.tabletLandscapeUp} {
    grid-column-gap: 1rem;
  }
`;

export const StyledLoadingSpinner = styled(LoadingSpinner)`
  position: absolute;
  top: 0;
  left: 0;
  grid-column: 1 / -1;
  width: 100%;
  height: 100%;

  ${SpinningIcon} {
    width: 2rem;
    height: 2rem;
  }
`;

export const NoApprovalsFound = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  min-height: 15rem;
`;

export const StyledModalOverlay = styled(ModalOverlay)`
  height: 100%;

  ${ContentContainer} {
    min-height: unset;
  }

  ${ModalContainer} {
    height: 100svh;
  }
`;
