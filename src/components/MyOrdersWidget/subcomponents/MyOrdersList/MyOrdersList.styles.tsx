import styled from "styled-components/macro";

import { ScrollBarStyle } from "../../../../style/mixins";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  position: relative;
`;

export const OrdersContainer = styled.div`
  ${ScrollBarStyle};

  margin-top: 0.5rem;
  width: calc(100% + 0.5rem);
  max-height: 17rem;
  padding-right: 0.5rem;
  overflow-y: auto;
`;

export const Shadow = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 3rem;
  z-index: 2;
  background: linear-gradient(
    0deg,
    rgba(0, 0, 0, 0.75) 0%,
    rgba(0, 0, 0, 0) 100%
  );
  pointer-events: none;
`;
