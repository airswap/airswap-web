import styled from "styled-components/macro";

import TextInput from "../../../TextInput/TextInput";
import { StyledInput } from "../../../TextInput/TextInput.styles";

export const Input = styled(TextInput)`
  display: flex;
  align-items: center;
  flex-grow: 1;
  height: 2.125rem;

  ${StyledInput} {
    font-size: 1rem;
    font-weight: 400;
  }

  &:focus {
    outline: 0;
  }
`;
