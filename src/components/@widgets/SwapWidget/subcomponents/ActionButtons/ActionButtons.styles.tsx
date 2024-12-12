import styled from "styled-components/macro";

import Button from "../../../../Button/Button";

export const Container = styled.div<{ center?: boolean }>`
  display: flex;
  justify-content: ${({ center }) => (center ? "center" : "space-between")};
  justify-self: flex-end;
  margin-top: auto;
`;

export const BackButton = styled(Button)`
  width: calc(50% - 0.5rem);
`;

export const SignButton = styled(Button)<{ isFilled?: boolean }>`
  ${({ isFilled }) => (isFilled ? `` : `width: calc(50% - 0.5rem);`)};
`;
