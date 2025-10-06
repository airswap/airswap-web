import styled from "styled-components";

import AccountLink from "../../../AccountLink/AccountLink";
import TokenLogo from "../../../TokenLogo/TokenLogo";
import { Tooltip } from "../TokenButton/TokenButton.styles";

export const Container = styled.div`
  display: flex;
  gap: 1rem;
  border: 1px solid ${(props) => props.theme.colors.borderGrey};
  border-radius: 0.5rem;
  padding: 1.25rem;
  cursor: pointer;
  align-items: center;
`;

export const StyledTokenLogo = styled(TokenLogo)`
  border-radius: 0.375rem;
  width: 3.5rem;
  aspect-ratio: 1;
`;

export const StyledIcon = styled(AccountLink)`
  display: flex;
  position: relative;
  margin-inline-start: 0.25rem;
  translate: 0 0.125rem;
  transform: scale(0.875);

  &:hover {
    color: ${(props) => props.theme.colors.white};
  }

  &:hover + ${Tooltip} {
    display: block;
  }
`;

export const TextContainer = styled.div`
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  gap: 0.25rem;
  flex-grow: 1;
  max-width: calc(100% - 10rem);
  overflow: hidden;
`;

export const TokenName = styled.h3`
  font-size: 0.9375rem;
  font-weight: 500;
  color: ${(props) => props.theme.colors.white};
  line-height: 1rem;
`;

export const TokenId = styled.h4`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${(props) => props.theme.colors.darkSubText};
  line-height: 1rem;
`;
