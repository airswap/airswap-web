import styled from "styled-components/macro";

import breakPoints from "../../../style/breakpoints";
import { sizes } from "../../../style/sizes";
import SwapInputs from "../../SwapInputs/SwapInputs";
import Tooltip from "../../SwapInputs/subcomponents/Tooltip/Tooltip";
import ActionButtons from "./subcomponents/ActionButtons/ActionButtons";
import AddressInput from "./subcomponents/AddressInput/AddressInput";
import { ExpirySelector } from "./subcomponents/ExpirySelector/ExpirySelector";
import InfoSection from "./subcomponents/InfoSection/InfoSection";
import OrderTypeSelector from "./subcomponents/OrderTypeSelector/OrderTypeSelector";
import { RateField } from "./subcomponents/RateField/RateField";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

export const StyledSwapInputs = styled(SwapInputs)`
  margin-block-start: 2rem;
`;

export const StyledOrderTypeSelector = styled(OrderTypeSelector)`
  margin-bottom: ${sizes.widgetGutter};
  width: calc(46% - ${sizes.widgetGutter});
}
`;

export const OrderTypeSelectorAndExpirySelectorWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: ${sizes.widgetGutter};
`;

export const StyledExpirySelector = styled(ExpirySelector)<{
  hideExpirySelector: boolean;
}>`
  width: 54%;
  transition: opacity 0.3s ease-out;

  margin-left: ${sizes.widgetGutter};
  visibility: ${({ hideExpirySelector }) =>
    hideExpirySelector ? "hidden" : "visible"};
`;

export const StyledAddressInput = styled(AddressInput)`
  margin-bottom: ${sizes.widgetGutter};
  height: 3.5rem;
`;

export const StyledActionButtons = styled(ActionButtons)`
  margin-block-start: 0.5rem;
`;

export const StyledInfoSection = styled(InfoSection)`
  flex-grow: 1;

  & + ${StyledActionButtons} {
    margin-top: 1rem;
  }
`;

export const StyledTooltip = styled(Tooltip)`
  position: absolute;
  right: 0;
  top: -5.125rem;

  @media ${breakPoints.tabletLandscapeUp} {
    top: 0;
    height: 3.5rem;
  }
`;

export const TooltipContainer = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
`;

export const StyledRateField = styled(RateField)`
  margin-inline: auto;
  margin-block-start: 1rem;

  @media ${breakPoints.phoneOnly} {
    width: auto;
  }
`;
