import styled from "styled-components";

import { fontLoos } from "../../../../../style/themes";
import Timer from "../../../../Timer/Timer";

export const Container = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: ${(props) => props.theme.colors.lightGrey};
`;

export const GasFreeButton = styled.button`
  color: ${(props) => props.theme.colors.lightGrey};
  text-transform: uppercase;

  &:hover,
  &:focus {
    color: ${(props) => props.theme.colors.white};
  }
`;

export const StyledTimer = styled(Timer)`
  min-width: 2.125rem;
  text-align: left;
  font-family: ${fontLoos};
  color: ${(props) => props.theme.colors.white};
`;
