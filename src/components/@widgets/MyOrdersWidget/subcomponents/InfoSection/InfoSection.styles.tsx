import styled from "styled-components/macro";

import { fontWide } from "../../../../../style/themes";
import { InfoHeading, InfoSubHeading } from "../../../../Typography/Typography";

export const StyledInfoHeading = styled(InfoHeading)`
  display: flex;
  align-items: center;

  & + ${InfoSubHeading} {
    margin-top: 1rem;
  }
`;
