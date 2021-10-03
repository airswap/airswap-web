import React from "react";
import { useTranslation } from "react-i18next";

import Icon from "../Icon/Icon";
import { ButtonX, StyledBookmarkWarning, Text } from "./BookmarkWarning.styles";

export type BookmarkWarningProps = {
  /**
   * if hidden, return null so that nothing gets rendered
   */
  hidden?: boolean;
  /**
   * A handler for the close action
   */
  onClick?: () => void;
};

export const BookmarkWarning = ({
  hidden = false,
  onClick,
}: BookmarkWarningProps) => {
  const { t } = useTranslation(["common"]);
  if (hidden) return null;

  return (
    <StyledBookmarkWarning>
      <Text>
        {t("common:bookmarkWarning1")}
        <strong>airswap.io</strong>
        {t("common:bookmarkWarning2")}
      </Text>
      <ButtonX onClick={onClick}>
        <Icon iconSize={1.0} name="button-x" />{" "}
      </ButtonX>
    </StyledBookmarkWarning>
  );
};

export default BookmarkWarning;
