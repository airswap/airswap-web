import styled from "styled-components/macro";

import breakPoints from "../../style/breakpoints";
import { SelectLabel } from "../../styled-components/Select/Select";
import Tooltip from "../ExpiryIndicator/subcomponents/Tooltip";
import ActionButtons from "./subcomponents/ActionButtons/ActionButtons";
import AddressInput from "./subcomponents/AddressInput/AddressInput";
import InfoSection from "./subcomponents/InfoSection/InfoSection";
import InputSection from "./subcomponents/InputSection/InputSection";
import OrderTypeSelector from "./subcomponents/OrderTypeSelector/OrderTypeSelector";
import { RateField } from "./subcomponents/RateField/RateField";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

export const StyledInputSection = styled(InputSection)`
  display: none;
  margin-bottom: 1rem;
  height: 3.5rem;
`;

export const StyledAddressInput = styled(AddressInput)`
  margin-bottom: 1rem;
  height: 3.5rem;
`;

export const StyledActionButtons = styled(ActionButtons)``;

export const StyledInfoSection = styled(InfoSection)`
  & + ${StyledActionButtons} {
    margin-top: 1rem;
  }
`;

export const RateFieldTooltip = styled(Tooltip)`
  display: none;
  position: absolute;
  left: calc(50% + 5.2rem);
  top: 3.5rem;

  @media ${breakPoints.tabletLandscapeUp} {
    left: calc(100% + 1rem);
    top: 1rem;
    width: fit-content;
  }
`;

export const RateFieldContainer = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  justify-content: center;
`;

export const StyledOrderTypeSelector = styled(OrderTypeSelector)`
  margin-bottom: 1rem;
  width: calc(50% - 1rem);
  
  ${SelectLabel} {
    flex-shrink: 0;
  }

  @media ${breakPoints.phoneOnly} {
    width: auto;
  }
}
`;

export const StyledRateField = styled(RateField)`
  justify-content: flex-end;
  margin-bottom: 1rem;
  overflow: hidden;
  width: 50%;

  @media ${breakPoints.phoneOnly} {
    width: auto;
  }

  &:hover + ${RateFieldTooltip} {
    display: flex;
  }
`;

export const OrderTypeSelectorAndRateFieldWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
  width: calc(100% + 0.3rem);

  @media ${breakPoints.phoneOnly} {
    flex-direction: column;
    align-items: center;
  }
`;
