import styled from "styled-components";

import { BorderedPill, InputOrButtonBorderStyle } from "../../style/mixins";

export const Container = styled.div`
  position: relative;
`;

export const SettingsButtonContainer = styled.button`
  ${BorderedPill}
  ${InputOrButtonBorderStyle}
  
  width: 3rem;
  height: 3rem;
  padding: 0;
`;
