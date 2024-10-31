import styled, { keyframes } from "styled-components/macro";

import { fontWide } from "../../style/themes";
import { WidgetHeader } from "../../styled-components/WidgetHeader/WidgetHeader";
import { Title } from "../Typography/Typography";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex-grow: 1;
`;

export const Text = styled.div`
  display: flex;
  align-items: center;
  flex-grow: 1;
  margin-block-start: 1rem;
  padding: 0 15%;
  text-align: center;
  font-family: ${fontWide};
  color: ${({ theme }) => theme.colors.darkSubText};
`;

export const StyledTitle = styled(Title)`
  margin-block-start: 1rem;
  font-size: 1.875rem;
`;

export const StyledWidgetHeader = styled(WidgetHeader)`
  justify-self: flex-start;
  margin-bottom: auto;
`;

const spin = keyframes`
  to {
    transform: rotate(1turn);
  }
`;

export const Loader = styled.div`
  width: 2.375rem;
  height: 2.375rem;
  border-radius: 50%;
  border: 4px solid;
  border-color: #475777;
  border-right-color: ${({ theme }) => theme.colors.carteBlanche};
  animation: ${spin} 2s infinite linear;
`;
