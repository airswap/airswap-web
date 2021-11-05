import styled from "styled-components";

import { BorderedPill, InputOrButtonBorder } from "../../style/mixins";

export const Container = styled.div`
  position: relative;
`;

export const SettingsButtonContainer = styled.button`
  ${BorderedPill}
  ${InputOrButtonBorder}
  
  width: 3rem;
  height: 3rem;
  padding: 0;
`;
