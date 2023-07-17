import { DefaultTheme } from "styled-components/macro";
import styled from "styled-components/macro";

import { InfoSubHeading, Title } from "../../components/Typography/Typography";
import { ScrollBarStyle } from "../../style/mixins";
import { sizes } from "../../style/sizes";

export const ScrollableModalContainer = styled.div`
  ${ScrollBarStyle};

  padding-right: 1rem;
  padding-bottom: 1.5rem;
  width: calc(100% + 1rem);
  height: calc(100% - ${sizes.tradeContainerPadding});
  overflow-y: auto;
`;

export const ModalParagraph = styled(InfoSubHeading)`
  color: ${(props: { theme: DefaultTheme }) => props.theme.colors.darkSubText};

  & + & {
    margin-top: 1rem;
  }
`;

export const ModalSubTitle = styled(Title)`
  margin: 2.5rem 0 0.5rem;
  font-size: 1rem;

  &:first-child {
    margin-top: 0;
  }
`;
