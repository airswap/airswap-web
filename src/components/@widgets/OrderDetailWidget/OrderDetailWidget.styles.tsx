import styled from "styled-components/macro";

import { sizes } from "../../../style/sizes";
import { RecipientAndStatus } from "../SwapWidget/subcomponents/RecipientAndStatus/RecipientAndStatus";
import ActionButtons from "./subcomponents/ActionButtons/ActionButtons";
import InfoSection from "./subcomponents/InfoSection/InfoSection";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  height: 100%;
`;

export const StyledRecipientAndStatus = styled(RecipientAndStatus)`
  margin-block-start: ${sizes.widgetGutter};
`;

export const StyledInfoSection = styled(InfoSection)`
  margin-top: ${sizes.widgetGutter};
`;

export const StyledActionButtons = styled(ActionButtons)`
  margin-top: ${sizes.widgetGutter};
`;
