import styled from "styled-components/macro";

import AddressInput from "./subcomponents/AddressInput/AddressInput";
import InfoSection from "./subcomponents/InfoSection/InfoSection";
import OrderTypeSelector from "./subcomponents/OrderTypeSelector/OrderTypeSelector";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

export const StyledOrderTypeSelector = styled(OrderTypeSelector)`
  margin-top: 1rem;
`;

export const StyledInfoSection = styled(InfoSection)`
  margin-top: 1rem;
  height: 3.5rem;
`;

export const StyledAddressInput = styled(AddressInput)`
  margin-top: 1rem;
  height: 3.5rem;
`;
