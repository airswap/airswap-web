import styled from "styled-components/macro";

import InfoSection from "../InfoSection/InfoSection";
import OrderTypeSelector from "../OrderTypeSelector/OrderTypeSelector";

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
`;
