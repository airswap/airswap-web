import styled, { css } from "styled-components/macro";

import isActiveLanguageLogographic from "../../../../helpers/isActiveLanguageLogographic";
import { InputOrButtonBorderStyle } from "../../../../style/mixins";
import { sizes } from "../../../../style/sizes";

const ButtonStyle = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 0.25rem;
  width: 4rem;
  height: 4rem;

  ${InputOrButtonBorderStyle};

  & + a,
  & + button {
    margin-top: 0.75rem;

    @media (min-height: ${sizes.toolbarMaxHeight}) {
      margin-top: 1rem;
    }
  }

  @media (min-height: ${sizes.toolbarMaxHeight}) {
    width: 5rem;
    height: 5rem;
  }
`;

export const ToolbarButtonContainer = styled.button`
  ${ButtonStyle}
`;

export const ToolBarAnchorContainer = styled.a`
  ${ButtonStyle}
`;

export const Text = styled.div`
  margin-top: 0.125rem;
  font-weight: 600;
  font-size: ${() => (isActiveLanguageLogographic() ? "0.75rem" : "0.674rem")};
  text-transform: uppercase;

  @media (min-height: ${sizes.toolbarMaxHeight}) {
    margin-top: 0.25rem;
    font-size: ${() =>
      isActiveLanguageLogographic() ? "0.875rem" : "0.75rem"};
  }
`;
