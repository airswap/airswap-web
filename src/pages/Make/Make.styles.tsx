import styled from "styled-components/macro";

import Page from "../../components/Page/Page";
import { WidgetFrameWrapper } from "../../components/WidgetFrame/WidgetFrame.styles";
import breakPoints from "../../style/breakpoints";

export const StyledPage = styled(Page)`
  ${WidgetFrameWrapper} {
    @media ${breakPoints.phoneOnly} {
      height: 27rem;
    }
  }
`;
