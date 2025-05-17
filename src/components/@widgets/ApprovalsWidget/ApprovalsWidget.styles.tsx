import { css } from "styled-components";
import styled from "styled-components/macro";

import breakPoints from "../../../style/breakpoints";
import { FadedScrollContainer } from "../../FadedScrollContainer/FadedScrollContainer";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const StyledScrollContainer = styled(FadedScrollContainer)`
  margin-block-start: 2.5rem;
  padding-inline-end: 1rem;
  min-height: 15rem;
  max-height: 20rem;
`;

export const ApprovalsGridStyle = css`
  display: grid;
  grid-template-columns: 2fr 2fr 2fr 2fr 1fr;
  grid-column-gap: 1rem;
  width: 100%;

  @media ${breakPoints.tabletLandscapeUp} {
    grid-template-columns: repeat(5, 1fr);
  }
`;

export const ApprovalsGrid = styled.div`
  ${ApprovalsGridStyle};

  grid-row-gap: 1.5rem;
  padding: 0 1rem;
`;
