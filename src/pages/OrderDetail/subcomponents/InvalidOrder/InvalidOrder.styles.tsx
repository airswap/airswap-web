import styled from "styled-components/macro";

import Button from "../../../../components/Button/Button";
import {
  InfoHeading,
  InfoSubHeading,
} from "../../../../components/Typography/Typography";
import { InputOrButtonBorderStyle } from "../../../../style/mixins";

export const Header = styled.div`
  justify-self: flex-start;
  margin-bottom: auto;
  width: 100%;
`;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  flex-grow: 1;
`;

export const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex-grow: 1;
`;

export const StyledInfoHeading = styled(InfoHeading)`
  margin-top: 2rem;

  & + ${InfoSubHeading} {
    margin-top: 0.25rem;
  }
`;

export const BackButton = styled(Button)`
  ${InputOrButtonBorderStyle};
`;
