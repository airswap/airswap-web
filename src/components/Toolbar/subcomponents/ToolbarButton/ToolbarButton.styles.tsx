import styled, { css } from "styled-components/macro";

import isActiveLanguageLogographic from "../../../../helpers/isActiveLanguageLogographic";
import { InputOrButtonBorderStyle } from "../../../../style/mixins";

const ButtonStyle = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 0.25rem;
  width: 5rem;
  height: 5rem;

  & + a,
  & + button {
    margin-top: 1rem;
  }

  ${InputOrButtonBorderStyle}
`;

export const ToolbarButtonContainer = styled.button`
  ${ButtonStyle}
`;

export const ToolBarAnchorContainer = styled.a`
  ${ButtonStyle}
`;

export const Text = styled.div`
  margin-top: 0.25rem;
  font-weight: 600;
  font-size: ${() => (isActiveLanguageLogographic() ? "0.875rem" : "0.75rem")};
  text-transform: uppercase;
`;
