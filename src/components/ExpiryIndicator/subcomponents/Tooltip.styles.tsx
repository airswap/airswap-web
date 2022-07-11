import styled from "styled-components/macro";

import { Tooltip } from "../../../styled-components/Tooltip/Tooltip";

export const Container = styled.div`
  display: flex;
  justify-content: center;
  left: 0;
  width: 100%;
  height: 2rem;
  white-space: nowrap;
`;

export const Content = styled(Tooltip)`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 2rem;
  color: ${({ theme }) =>
    theme.name === "dark" ? theme.colors.darkSubText : theme.colors.primary};
`;
