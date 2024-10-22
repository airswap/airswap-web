import styled from "styled-components/macro";

import breakPoints from "../../../../style/breakpoints";
import BorderedButton from "../../../../styled-components/BorderedButton/BorderedButton";
import { InfoHeading } from "../../../Typography/Typography";

export const Button = styled.div`
  border: 0;
  margin: 0;
  padding: 0;
  cursor: pointer;
  background: none;
`;

export const StyledBorderedButton = styled(BorderedButton)`
  padding-inline: 1.5rem;

  @media ${breakPoints.phoneOnly} {
    padding-inline: 1rem;
  }
`;

export const WalletAddressText = styled(InfoHeading)`
  color: ${({ theme }) => theme.colors.alwaysWhite};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 700;
  font-size: 0.9375rem;

  @media ${breakPoints.phoneOnly} {
    font-size: 0.875rem;
  }
`;

export const ConnectionStatusCircle = styled.div<{ $connected: boolean }>`
  margin-top: 0.125rem;
  margin-right: 0.75rem;
  width: 0.625rem;
  height: 0.625rem;
  background-color: ${(props) =>
    props.$connected ? props.theme.colors.green : props.theme.colors.red};
  border-radius: 50%;
`;
