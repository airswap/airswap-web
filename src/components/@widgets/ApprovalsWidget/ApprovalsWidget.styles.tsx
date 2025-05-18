import { css } from "styled-components";
import styled from "styled-components/macro";

import breakPoints from "../../../style/breakpoints";
import { FadedScrollContainer } from "../../FadedScrollContainer/FadedScrollContainer";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const StyledScrollContainer = styled.div`
  margin-block-start: 2.5rem;
`;

export const ApprovalsGridStyle = css`
  display: grid;
  grid-template-columns: 3fr 3fr 3fr 3fr 1fr;
  grid-column-gap: 1rem;
  width: 100%;

  @media ${breakPoints.phoneOnly} {
    grid-template-columns: 1fr 1fr 1r 1fr;
    width: calc(100% + 1rem);
  }
`;

export const StyledFadedScrollContainer = styled(FadedScrollContainer)`
  display: grid;
  grid-template-columns: subgrid;
  grid-column: 1 / -1;
  width: 100%;
  min-height: 15rem;
  max-height: 25rem;
`;

export const ApprovalsGrid = styled.div`
  ${ApprovalsGridStyle};

  grid-row-gap: 0.5rem;
  padding: 0 1rem;
`;
