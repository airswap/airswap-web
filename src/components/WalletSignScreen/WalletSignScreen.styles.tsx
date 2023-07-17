import styled from "styled-components/macro";

import { WidgetHeader } from "../../styled-components/WidgetHeader/WidgetHeader";

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
  padding: 0 15%;
  text-align: center;
  color: ${({ theme }) => theme.colors.darkSubText};
`;

export const StyledWidgetHeader = styled(WidgetHeader)`
  justify-self: flex-start;
  margin-bottom: auto;
`;
