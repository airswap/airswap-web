import styled from "styled-components/macro";

import Page from "../../components/Page/Page";
import { Container } from "../../components/WidgetFrame/WidgetFrame.styles";
import { sizes } from "../../style/sizes";

export const StyledPage = styled(Page)`
  ${Container} {
    width: 100%;
    max-width: ${sizes.mySwapsWidgetSize};
  }
`;
