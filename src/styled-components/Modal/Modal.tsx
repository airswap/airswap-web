import { DefaultTheme } from "styled-components/macro";
import styled from "styled-components/macro";
import Modal from "styled-react-modal";

import IconButton from "../../components/IconButton/IconButton";
import { InfoSubHeading, Title } from "../../components/Typography/Typography";
import breakPoints from "../../style/breakpoints";
import { sizes } from "../../style/sizes";

export const StyledModal = Modal.styled`
  position: relative;
  top: 1rem;
  border: 1px solid ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.borderGrey};
  border-radius: 0.1875rem;
  width: 37.5rem;
  min-height: 30rem;
  padding: 2.5rem 2.125rem;
  background: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.darkGrey};

  @media ${breakPoints.tabletPortraitUp} {
    left: calc(${sizes.toolBarWidth}/2);
  }

  @media ${breakPoints.tabletLandscapeUp} {
    left: 0;
  }
`;

export const ModalCloseButton = styled(IconButton)`
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  padding: 0.25rem;
`;

export const ModalTitle = styled(Title)`
  margin-bottom: 1.5rem;
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
`;
