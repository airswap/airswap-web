import styled from "styled-components/macro";

import breakPoints from "../../../../style/breakpoints";
import {
  BorderedPill,
  InputOrButtonBorderStyleType2,
} from "../../../../style/mixins";
import { InfoHeading } from "../../../Typography/Typography";

export const Container = styled.button`
  ${BorderedPill}
  ${InputOrButtonBorderStyleType2}
`;

export const StyledInfoHeading = styled(InfoHeading)`
  @media ${breakPoints.phoneOnly} {
    font-size: 0.875rem;
  }
`;
