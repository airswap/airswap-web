import styled from "styled-components/macro";

import { ApprovalsGridStyle } from "../../ApprovalsWidget.styles";

export const Container = styled.div<{
  hasOverflow: boolean;
  hasFilledColumn?: boolean;
}>`
  ${ApprovalsGridStyle};

  padding-right: ${({ hasOverflow }) => (hasOverflow ? "2.5rem" : "2rem")};
`;

export const PairButtonWrapper = styled.div`
  margin-left: -0.25rem;
  overflow: hidden;
`;
