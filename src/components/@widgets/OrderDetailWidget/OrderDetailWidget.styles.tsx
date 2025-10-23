import styled from "styled-components/macro";

import { sizes } from "../../../style/sizes";
import ActionButtons from "./subcomponents/ActionButtons/ActionButtons";
import { FilledBar } from "./subcomponents/FilledBar/FilledBar";
import InfoSection from "./subcomponents/InfoSection/InfoSection";
import { LimitOrderStatusBar } from "./subcomponents/LimitOrderStatusBar/LimitOrderStatusBar";
import { RecipientAndStatus } from "./subcomponents/RecipientAndStatus/RecipientAndStatus";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  height: 100%;
`;

export const StyledRecipientAndStatus = styled(RecipientAndStatus)`
  margin-block-start: ${sizes.widgetGutter};
`;

export const StyledRecipientAndStatusBar = styled(LimitOrderStatusBar)`
  margin-block-start: ${sizes.widgetGutter};
`;

export const StyledFilledBar = styled(FilledBar)`
  margin-block-start: ${sizes.widgetGutter};
`;

export const StyledInfoSection = styled(InfoSection)`
  margin-top: ${sizes.widgetGutter};
`;

export const StyledActionButtons = styled(ActionButtons)`
  margin-top: ${sizes.widgetGutter};
`;
