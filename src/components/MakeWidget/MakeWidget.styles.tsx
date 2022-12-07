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
  width: 50%;

  @media ${breakPoints.phoneOnly} {
    width: auto;
  }
`;

export const OrderTypeSelectorAndRateFieldWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;

  @media ${breakPoints.phoneOnly} {
    flex-direction: column;
    align-items: center;
  }
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
  position: relative;
  left: 1rem;
  top: 1rem;
  visibility: hidden;
`;

export const RateFieldContainer = styled.div`
  display: flex;
  flex-direction: row;
  position: relative;

  &:hover {
    ${RateFieldTooltip} {
      visibility: visible;
    }
  }
`;
