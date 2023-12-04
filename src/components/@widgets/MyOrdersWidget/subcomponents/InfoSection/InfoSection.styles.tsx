import { InfoHeading, InfoSubHeading } from "../../../../Typography/Typography";
import styled from "styled-components/macro";

export const StyledInfoHeading = styled(InfoHeading)`
  display: flex;
  align-items: center;

  & + ${InfoSubHeading} {
    margin-top: 0.25rem;
  }
`;
