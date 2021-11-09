import React, { FC, ReactElement } from "react";

import { SvgIconProps } from "../Icon";

const IconChevronRight: FC<SvgIconProps> = ({
  className = "",
}): ReactElement => (
  <svg viewBox="0 0 24 24">
    <path
      d="M9.99997 6L8.58997 7.41L13.17 12L8.58997 16.59L9.99997 18L16 12L9.99997 6Z"
      fill="white"
    />
  </svg>
);

export default IconChevronRight;
