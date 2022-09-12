import { css } from "styled-components";
import styled from "styled-components/macro";

import breakPoints from "../../style/breakpoints";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

export const MyOrdersGrid = css`
  display: grid;
  grid-template-columns: 1rem 2.5rem calc(50% - 9.5rem) calc(50% - 9.5rem) 9rem 1.5rem;
  grid-column-gap: 1rem;
  width: 100%;
  padding: 0 1rem;

  @media ${breakPoints.phoneOnly} {
    grid-template-columns: 1rem 2.5rem calc(50% - 8rem) calc(50% - 8rem) 6rem 1.5rem;
  }
`;
