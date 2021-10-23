import React, { FC, ReactElement } from "react";

import { SvgIconProps } from "../Icon";

const IconChevronDown: FC<SvgIconProps> = ({
  className = "",
}): ReactElement => (
  <svg fill="currentColor" viewBox="0 0 24 24" className={className}>
    <path
      strokeWidth="0"
      d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"
    />
  </svg>
);

export default IconChevronDown;
