import breakPoints from "../../style/breakpoints";
import styled from "styled-components/macro";

export const ReviewList = styled.ul`
  list-style: none;
  margin: 1.5rem 0;
  padding: 0;

  @media ${breakPoints.phoneOnly} {
    font-size: 0.9375rem;
  }
`;
