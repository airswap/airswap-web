import { css } from "styled-components";
import styled from "styled-components/macro";

import ActionButtons from "./subcomponents/ActionButtons/ActionButtons";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 20rem;
`;

export const MyOrdersGrid = css`
  display: grid;
  grid-template-columns: 1rem 3rem 3fr 4fr 4fr 3fr 1rem;
  grid-column-gap: 1rem;
  width: 100%;
  padding: 0 1rem;
`;

export const InfoSectionContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex-grow: 1;
  margin-top: 1rem;
  text-align: center;
`;

export const StyledActionButtons = styled(ActionButtons)`
  justify-self: flex-end;
  margin-top: auto;
`;
