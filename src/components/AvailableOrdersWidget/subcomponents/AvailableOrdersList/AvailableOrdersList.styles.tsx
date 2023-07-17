import styled from "styled-components/macro";

import { ScrollBarStyle } from "../../../../style/mixins";
import { Tooltip } from "../../../../styled-components/Tooltip/Tooltip";
import AvailableOrdersListSortButtons from "../AvailableOrdersListSortButtons/AvailableOrdersListSortButtons";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  position: relative;
`;

export const StyledAvailableOrdersListSortButtons = styled(
  AvailableOrdersListSortButtons
)<{
  width: number;
}>`
  width: ${({ width }) => (width ? `${width}px` : "100%")};
`;

export const OrdersContainer = styled.div`
  ${ScrollBarStyle};

  margin-top: 0.5rem;
  width: calc(100% + 0.5rem);
  max-height: 17rem;
  padding-right: 0.5rem;
  overflow-y: auto;
  overflow-x: visible;
`;

const darkShadow =
  "linear-gradient(0deg, rgba(0, 0, 0, 0.75) 0%, rgba(0, 0, 0, 0) 100%)";
const lightShadow =
  "linear-gradient(0deg, rgba(255, 255, 255, 0.75) 0%, rgba(255, 255, 255, 0) 100%)";

export const Shadow = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 3rem;
  z-index: 2;
  background: ${({ theme }) =>
    theme.name === "dark" ? darkShadow : lightShadow};
  pointer-events: none;
`;

export const HelperText = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
`;

export const CutoffTooltip = styled(Tooltip)<{
  containerScrollTop: number;
  orderIndex?: number;
  shift?: number;
}>`
  position: absolute;
  top: calc(
    5rem + ${({ containerScrollTop }) => -containerScrollTop}px + 3rem *
      ${({ orderIndex }) => orderIndex}
  );
  left: ${({ shift }) => `calc(33% * ${shift} + 0.5rem)`};
  width: auto;
  z-index: 3;
  pointer-events: none;
`;
