import styled from "styled-components/macro";

import { BorderedPill, InputOrButtonBorderStyle } from "../../style/mixins";

type ContainerProps = {
  open: boolean;
};

export const Container = styled.div<ContainerProps>`
  position: relative;
  transform: ${(props) => (props.open ? "translate(-11.5rem, 0)" : "0")};
  transition: transform 0.3s ease-in-out;

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

export const SettingsButtonContainer = styled.button`
  ${BorderedPill}
  ${InputOrButtonBorderStyle}
  
  width: 3rem;
  height: 3rem;
  padding: 0;
`;
