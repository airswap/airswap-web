import styled, { css } from "styled-components/macro";

import Button from "../../../../Button/Button";
import CopyLinkButton from "../CopyLinkButton/CopyLinkButton";

export const Container = styled.div<{ center?: boolean }>`
  display: flex;
  justify-content: ${({ center }) => (center ? "center" : "space-between")};
  justify-self: flex-end;
  margin-top: auto;
`;

const ButtonStyle = css`
  width: calc(50% - 0.5rem);
  height: auto;
  min-height: 3rem;
  line-height: 1.375;
  padding: 0.375rem 1rem;
  white-space: normal;

  @supports (-moz-appearance: none) {
    padding-top: 0.4375rem;
  }
`;

export const BackButton = styled(Button)`
  ${ButtonStyle};
`;

export const StyledCopyLinkButton = styled(CopyLinkButton)`
  ${ButtonStyle};
`;

export const SignButton = styled(Button)<{ isFilled?: boolean }>`
  ${ButtonStyle};
  ${({ isFilled }) => (isFilled ? `` : `width: calc(50% - 0.5rem);`)};
`;
