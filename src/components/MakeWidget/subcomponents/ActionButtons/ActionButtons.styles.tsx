import styled, { css } from "styled-components/macro";

import { InputOrButtonBorderStyle } from "../../../../style/mixins";
import Button from "../../../Button/Button";

export const Container = styled.div`
  display: flex;
  justify-content: space-between;
  justify-self: flex-end;
  margin-top: auto;
`;

const ButtonStyle = css`
  ${InputOrButtonBorderStyle};

  width: calc(50% - 0.5rem);
  height: auto;
  min-height: 3rem;
  line-height: 1.375;
  padding: 0.375rem 1rem;
  white-space: inherit;

  @supports (-moz-appearance: none) {
    padding-top: 0.4375rem;
  }
`;

export const BackButton = styled(Button)`
  ${ButtonStyle}
`;

export const SignButton = styled(Button)`
  ${ButtonStyle}
`;
