import { DefaultTheme } from "styled-components/macro";
import styled from "styled-components/macro";

import { InfoSubHeading, Title } from "../../components/Typography/Typography";

export const ModalParagraph = styled(InfoSubHeading)`
  line-height: 1.5;
  color: ${(props: { theme: DefaultTheme }) => props.theme.colors.white};

  & + & {
    margin-top: 1rem;
  }
`;

export const ModalSubTitle = styled(Title)`
  margin: 2rem 0 0.5rem;
  font-size: 1rem;

  &:first-child {
    margin-top: 0;
  }
`;
