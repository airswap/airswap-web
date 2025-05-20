import styled from "styled-components/macro";

import { InputOrButtonBorderStyle } from "../../style/mixins";
import { fontWide } from "../../style/themes";

export const CompactActionButton = styled.button`
  ${InputOrButtonBorderStyle};

  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.5rem;
  padding-inline: 0.5rem;
  min-width: 5.125rem;
  height: 1.5625rem;
  font-family: ${fontWide};
  font-size: 0.875rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.lightGrey};
  background: ${({ theme }) => theme.colors.darkGrey};
`;
