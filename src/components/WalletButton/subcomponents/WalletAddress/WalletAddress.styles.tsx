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
  @media ${breakPoints.phoneOnly} {
    padding: 0 1rem;
  }
`;

export const WalletAddressText = styled(InfoHeading)`
  color: ${({ theme }) => theme.colors.alwaysWhite};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 700;

  @media ${breakPoints.phoneOnly} {
    font-size: 0.875rem;
  }
`;

export const ConnectionStatusCircle = styled.div<{ $connected: boolean }>`
  margin-right: 0.75rem;
  width: 0.75rem;
  height: 0.75rem;
  background-color: ${(props) =>
    props.$connected ? props.theme.colors.green : props.theme.colors.red};
  border-radius: 50%;
`;
