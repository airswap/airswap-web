import styled from "styled-components/macro";

import { BorderedPill } from "../../style/mixins";

export const Container = styled.div`
  ${BorderedPill};

  height: 2rem;
`;

export const Label = styled.div`
  text-transform: uppercase;
  line-height: 2;
  font-size: 0.75rem;
  font-weight: 700;
  color: ${({ theme }) =>
    theme.name === "dark" ? theme.colors.lightGrey : theme.colors.primary};
`;

export const Strong = styled.strong`
  margin-left: 0.375rem;
  color: ${({ theme }) => theme.colors.white};
`;
