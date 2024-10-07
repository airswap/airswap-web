import styled from "styled-components/macro";

import Button from "../../../../Button/Button";
import CopyLinkButton from "../CopyLinkButton/CopyLinkButton";

export const Container = styled.div`
  display: flex;
  justify-content: space-between;
  justify-self: flex-end;
  margin-top: auto;
`;

export const BackButton = styled(Button)`
  width: calc(50% - 0.5rem);
`;

export const StyledCopyLinkButton = styled(CopyLinkButton)`
  width: calc(50% - 0.5rem);
`;

export const SignButton = styled(Button)<{ isFilled?: boolean }>`
  ${({ isFilled }) => (isFilled ? `` : `width: calc(50% - 0.5rem);`)};
`;
