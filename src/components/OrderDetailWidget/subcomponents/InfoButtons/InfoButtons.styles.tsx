import styled from "styled-components/macro";

import { LargePillButton } from "../../../../styled-components/Pill/Pill";

export const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 1rem;
`;

export const ButtonsWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;

  > button {
    margin-bottom: 1rem;
  }
`;

export const StyledLargePillButton = styled(LargePillButton)`
  margin: 0 0.5rem;
`;

export const InfoText = styled.div`
  color: ${({ theme }) =>
    theme.name === "dark" ? theme.colors.white : theme.colors.primary};
  width: 100%;
  text-align: center;
  margin-bottom: 1rem;
`;
