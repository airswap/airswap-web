import { css } from "styled-components";
import styled from "styled-components/macro";

import breakPoints from "../../../style/breakpoints";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 20rem;
`;

export const ApprovalsGridStyle = css`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
  grid-column-gap: 1rem;
  width: 100%;
`;

export const ApprovalsGrid = styled.div`
  ${ApprovalsGridStyle};

  grid-row-gap: 1.5rem;
  padding: 0 1rem;
`;
