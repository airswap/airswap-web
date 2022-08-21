import styled from "styled-components/macro";

import breakPoints from "../../style/breakpoints";
import { SelectLabel } from "../../styled-components/Select/Select";
import AddressInput from "./subcomponents/AddressInput/AddressInput";
import InfoSection from "./subcomponents/InfoSection/InfoSection";
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
  margin-left: 1rem;
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

export const StyledInfoSection = styled(InfoSection)`
  margin-bottom: 1rem;
  height: 3.5rem;
`;

export const StyledAddressInput = styled(AddressInput)`
  margin-bottom: 1rem;
  height: 3.5rem;
`;
