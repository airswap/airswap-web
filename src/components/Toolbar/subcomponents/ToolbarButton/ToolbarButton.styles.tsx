import { Link } from "react-router-dom";

import styled, { css } from "styled-components/macro";

import isActiveLanguageLogographic from "../../../../helpers/isActiveLanguageLogographic";
import breakPoints from "../../../../style/breakpoints";
import { InputOrButtonBorderStyle } from "../../../../style/mixins";
import { sizes } from "../../../../style/sizes";
import Icon from "../../../Icon/Icon";

const ButtonStyle = css`
  ${InputOrButtonBorderStyle};

  display: flex;
  justify-content: flex-start;
  align-items: center;
  position: relative;
  border-left: 0;
  border-right: 0;
  width: 100%;
  height: 3.5rem;
  min-height: 3.5rem;
  padding: 0 1.5rem;
  background: ${({ theme }) =>
    theme.name === "dark" ? theme.colors.black : theme.colors.primary};

  & + a,
  & + button {
    margin-top: -1px;
  }

  &:hover,
  &:active,
  &:focus {
    z-index: 2;
  }

  @media ${breakPoints.tabletPortraitUp} {
    ${InputOrButtonBorderStyle};

    flex-direction: column;
    justify-content: center;
    border-bottom-style: solid !important;
    border-radius: 0.25rem;
    margin-top: 0;
    width: 4rem;
    height: 4rem;
    min-height: inherit;
    padding: 0;

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
  }
`;

export const ToolbarButtonContainer = styled.button`
  ${ButtonStyle}
`;

export const ToolBarAnchorContainer = styled.a`
  ${ButtonStyle}
`;

export const ToolBarLinkContainer = styled(Link)`
  ${ButtonStyle}
`;

export const StyledIcon = styled(Icon)`
  display: flex;
  justify-content: center;
  min-width: 1.5rem;
`;

export const Text = styled.div`
  margin-left: 0.75rem;
  width: 100%;
  font-weight: 600;
  font-size: ${() => (isActiveLanguageLogographic() ? "0.75rem" : "0.675rem")};
  text-transform: uppercase;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (min-height: ${sizes.toolbarMaxHeight}) {
    font-size: ${() =>
      isActiveLanguageLogographic() ? "0.875rem" : "0.75rem"};
  }

  @media ${breakPoints.tabletPortraitUp} {
    margin-left: 0;
    margin-top: 0.125rem;
  }

  @media (min-height: ${sizes.toolbarMaxHeight}) and (${breakPoints.tabletPortraitUp}) {
    margin-top: 0.25rem;
  }
`;
