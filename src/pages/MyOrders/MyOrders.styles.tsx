import styled from "styled-components/macro";

import Page from "../../components/Page/Page";
import { WidgetFrameWrapper } from "../../components/WidgetFrame/WidgetFrame.styles";
import { sizes } from "../../style/sizes";

export const StyledPage = styled(Page)`
  ${WidgetFrameWrapper} {
    width: 100%;
    max-width: ${sizes.mySwapsWidgetSize};
  }
`;
