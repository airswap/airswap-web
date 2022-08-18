import styled from "styled-components/macro";

import { LargePillButton } from "../../../../styled-components/Pill/Pill";

export const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
`;

export const StyledLargePillButton = styled(LargePillButton)`
  margin: 0 0.5rem;
`;
