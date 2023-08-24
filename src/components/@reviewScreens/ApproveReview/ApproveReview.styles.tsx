import styled from "styled-components/macro";

import { WidgetHeader } from "../../../styled-components/WidgetHeader/WidgetHeader";
import ReviewActionButtons from "../../ReviewActionButtons/ReviewActionButtons";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

export const StyledWidgetHeader = styled(WidgetHeader)`
  margin-bottom: 0.75rem;
`;

export const StyledActionButtons = styled(ReviewActionButtons)`
  justify-self: flex-end;
  margin-top: auto;
`;
