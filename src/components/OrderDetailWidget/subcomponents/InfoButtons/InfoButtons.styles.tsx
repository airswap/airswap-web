import styled from "styled-components/macro";

import { LargePillButton } from "../../../../styled-components/Pill/Pill";
import CopyLinkButton from "../CopyLinkButton/CopyLinkButton";

export const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 1rem;
`;

export const ButtonsWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;

  > button,
  > div {
    margin-bottom: 1rem;
  }
`;

export const StyledLargePillButton = styled(LargePillButton)`
  margin: 0 0.5rem;
`;

export const StyledCopyLinkButton = styled(CopyLinkButton)`
  margin: 0 0.5rem;
`;
