import { css } from "styled-components";
import styled from "styled-components/macro";

import breakPoints from "../../../style/breakpoints";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  justify-content: center;
`;

export const MyOrdersGrid = css`
  display: grid;
  grid-template-columns: 1rem 0 calc(50% - 6.5rem) calc(50% - 6.5rem) 5.5rem 1.5rem;
  grid-column-gap: 1rem;
  width: 100%;
  padding: 0 1rem;

  @media ${breakPoints.tabletPortraitUp} {
    grid-template-columns: 1rem 3rem calc(50% - 8rem) calc(50% - 8rem) 5.5rem 1.5rem;
  }
`;

export const InfoSectionContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-bottom: 0.5rem;
  text-align: center;
`;
