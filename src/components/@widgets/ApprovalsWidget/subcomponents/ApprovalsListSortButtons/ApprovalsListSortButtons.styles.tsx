import styled from "styled-components/macro";

export const Container = styled.div<{
  hasOverflow: boolean;
}>`
  display: grid;
  grid-template-columns: subgrid;
  grid-column: 1 / -1;
`;

export const PairButtonWrapper = styled.div`
  margin-left: -0.25rem;
  overflow: hidden;
`;
