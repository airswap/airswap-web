import React from "react";

import Icon from "../Icon/Icon";
import { ButtonX, StyledBookmarkWarning, Text } from "./BookmarkWarning.styles";

export type BookmarkWarningProps = {
  /**
   * if hidden, return null so that nothing gets rendered
   */
  hidden?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export const BookmarkWarning = ({
  hidden = false,
  onClick,
}: BookmarkWarningProps) => {
  if (hidden) return null;
  return (
    <StyledBookmarkWarning>
      <Text>
        Make sure the URL is <strong>airswap.io</strong> - Press (Ctrl+D or
        Cmd+D) to bookmark it to be safe.
      </Text>
      <ButtonX onClick={onClick}>
        <Icon iconSize={1.0} name="button-x" />{" "}
      </ButtonX>
    </StyledBookmarkWarning>
  );
};

export default BookmarkWarning;
