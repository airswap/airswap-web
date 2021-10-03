import styled from "styled-components/macro";

import { BookmarkWarningProps } from "./BookmarkWarning";

export const Text = styled.div`
  transition: opacity 0.3s ease-out;
`;

export const ButtonX = styled.button`
  position: absolute;
  right: 2rem;
  color: ${(props) => props.theme.colors.alwaysWhite};
  pointer-events: ${(props) => (props.disabled ? "none" : "visible")};
  cursor: ${(props) => (props.disabled ? "none" : "pointer")};
`;

export const StyledBookmarkWarning = styled.div<BookmarkWarningProps>`
  height: 2rem;
  display: flex;
  transition: opacity 0.3s ease-out;
  align-items: center;
  justify-content: center;
  width: 100%;
  font-size: 1rem;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: ${(props) => props.theme.colors.alwaysWhite};
  background: ${(props) => props.theme.colors.primary};
  cursor: pointer;
  z-index: 1;
  ${Text} {
    font-weight: normal;
  }
  ${ButtonX} {
    font-weight: normal;
  }
`;
