import styled from "styled-components/macro";

import { InputOrButtonBorderStyle } from "../../../../style/mixins";
import Button from "../../../Button/Button";

export const Container = styled.div`
  display: flex;
  justify-content: space-between;
  justify-self: flex-end;
  margin-top: auto;
`;

export const BackButton = styled(Button)`
  ${InputOrButtonBorderStyle};

  width: calc(50% - 0.5rem);
`;

export const SignButton = styled(Button)<{ isFilled: boolean }>`
  ${({ isFilled }) => (isFilled ? `` : `width: calc(50% - 0.5rem);`)};
`;
