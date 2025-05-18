import { css } from "styled-components/macro";
import styled from "styled-components/macro";

import breakpoints from "../../style/breakpoints";
import { ScrollContainer } from "../ModalOverlay/ModalOverlay.styles";

type FadedScrollContainerProps = {
  $overflow: boolean;
  hasScrolledToBottom: boolean;
};

export const Container = styled(ScrollContainer)<FadedScrollContainerProps>`
  position: relative;
  margin-block-start: 0.625rem;
  margin-inline-start: -0.875rem;
  width: calc(100% + 3.25rem);
  max-height: 20rem;
  padding-inline: 0.875rem 1.5rem;
  padding-block-start: 0.125rem;
  padding-block-end: 1rem;

  @media ${breakpoints.tabletPortraitUp} {
    padding-inline-end: 2.25rem;
  }

  ${(props) =>
    props.hasScrolledToBottom &&
    css`
      -webkit-mask-image: none;
    `}
`;
