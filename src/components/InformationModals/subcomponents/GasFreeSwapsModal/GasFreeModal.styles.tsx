import { sizes } from "../../../../style/sizes";
import styled from "styled-components/macro";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  padding-bottom: ${sizes.tradeContainerPadding};
`;
