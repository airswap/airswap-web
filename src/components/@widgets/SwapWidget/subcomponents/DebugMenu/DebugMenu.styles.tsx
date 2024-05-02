import styled from "styled-components/macro";

import CloseButton from "../../../../../styled-components/CloseButton/CloseButton";
import Checkbox from "../../../../Checkbox/Checkbox";

export const Container = styled.div`
  position: relative;
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  padding-right: 2rem;
`;

export const StyledCheckbox = styled(Checkbox)``;

export const StyledCloseButton = styled(CloseButton)`
  position: absolute;
  top: 0;
  right: 0;
`;
