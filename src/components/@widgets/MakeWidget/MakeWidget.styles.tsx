import styled from "styled-components/macro";

import breakPoints from "../../../style/breakpoints";
import { SelectLabel } from "../../../styled-components/Select/Select";
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
  margin-bottom: 1rem;
  width: calc(50% - 1rem);
  
  ${SelectLabel} {
    flex-grow: 1;
    max-width: 4.375rem;
  }

  @media ${breakPoints.phoneOnly} {
    width: auto;
  }
}
`;

export const OrderTypeSelectorAndExpirySelectorWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;

  @media ${breakPoints.phoneOnly} {
    flex-direction: column;
    align-items: center;
  }
`;

export const StyledExpirySelector = styled(ExpirySelector)<{
  hideExpirySelector: boolean;
}>`
  transition: opacity 0.3s ease-out;

  margin-left: 1rem;
  opacity: ${({ hideExpirySelector }) => (hideExpirySelector ? 0 : 1)};
`;

export const StyledAddressInput = styled(AddressInput)`
  margin-bottom: 1rem;
  height: 3.5rem;
`;

export const StyledActionButtons = styled(ActionButtons)`
  margin-block-start: 1.25rem;
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
