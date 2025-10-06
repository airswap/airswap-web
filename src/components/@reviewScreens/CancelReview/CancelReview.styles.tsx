import styled from "styled-components/macro";

import { ReviewListItemLabel } from "../../../styled-components/ReviewListItem/ReviewListItem";
import { WidgetHeader } from "../../../styled-components/WidgetHeader/WidgetHeader";
import ReviewActionButtons from "../../ReviewActionButtons/ReviewActionButtons";
import { InfoHeading, InfoSubHeading } from "../../Typography/Typography";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

export const StyledWidgetHeader = styled(WidgetHeader)`
  margin-bottom: 0.75rem;
  overflow: hidden;
`;

export const StyledActionButtons = styled(ReviewActionButtons)`
  justify-self: flex-end;
  margin-top: auto;
`;

export const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-grow: 1;
`;

export const StyledInfoHeading = styled(InfoHeading)`
  margin-top: 2rem;
  text-align: center;

  & + ${InfoSubHeading} {
    margin-top: 0.75rem;
  }
`;
