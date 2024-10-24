import styled from "styled-components/macro";

import breakPoints from "../../style/breakpoints";
import {
  BorderedPill,
  BorderlessButtonStyle,
  InputOrButtonBorderStyle,
  InputOrButtonBorderStyleType2,
} from "../../style/mixins";
import { IconButtonStyle } from "../IconButton/IconButton.styles";

export const Container = styled.div`
  position: relative;

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }

  @media ${breakPoints.phoneOnly} {
    transform: none;
    transition: none;
  }
`;

export const SettingsButtonContainer = styled.button`
  ${BorderlessButtonStyle};
  ${IconButtonStyle};

  width: 2rem;
  height: 2rem;

  svg {
    width: 1.375rem;
  }

  @media ${breakPoints.tabletPortraitUp} {
    ${BorderedPill};
    ${InputOrButtonBorderStyle};

    width: 3rem;
    height: 3rem;
  }
`;
