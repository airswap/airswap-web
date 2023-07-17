import styled from "styled-components/macro";

import { InfoHeading, InfoSubHeading } from "../../../Typography/Typography";

export const StyledInfoHeading = styled(InfoHeading)`
  display: flex;
  align-items: center;

  & + ${InfoSubHeading} {
    margin-top: 0.25rem;
  }
`;
