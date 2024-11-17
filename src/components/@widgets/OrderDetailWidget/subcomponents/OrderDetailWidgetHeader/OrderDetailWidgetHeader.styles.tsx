import styled from "styled-components/macro";

import { WidgetHeader } from "../../../../../styled-components/WidgetHeader/WidgetHeader";
import { Title } from "../../../../Typography/Typography";

export const StyledWidgetHeader = styled(WidgetHeader)`
  margin-bottom: 2rem;
`;

export const StyledTitle = styled(Title)`
  color: ${({ theme }) => theme.colors.carteBlanche};
`;
