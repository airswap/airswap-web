import styled from "styled-components/macro";

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
`;

export const StyledRateField = styled(RateField)`
  margin-left: 1rem;
  margin-bottom: 1rem;
`;

export const OrderTypeSelectorAndRateFieldWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  margin-top: 1rem;
`;

export const StyledInfoSection = styled(InfoSection)`
  margin-bottom: 1rem;
  height: 3.5rem;
`;

export const StyledAddressInput = styled(AddressInput)`
  margin-bottom: 1rem;
  height: 3.5rem;
`;
