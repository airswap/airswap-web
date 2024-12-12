import styled from "styled-components";

import Page from "../../components/Page/Page";
import { WidgetFrameWrapper } from "../../components/WidgetFrame/WidgetFrame.styles";

export const StyledMyOrdersPage = styled(Page)`
  ${WidgetFrameWrapper} {
    width: 100%;
    max-width: 52rem;
  }
`;
