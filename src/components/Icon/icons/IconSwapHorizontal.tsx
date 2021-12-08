import React, { FC, ReactElement } from "react";

import { SvgIconProps } from "../Icon";

// used for OTC in menu bar.
const IconSwap: FC<SvgIconProps> = ({ className = "" }): ReactElement => (
  <svg
    width="18"
    height="14"
    viewBox="0 0 18 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M3.99 6L0 10L3.99 14V11H11V9H3.99V6ZM18 4L14.01 0V3H7V5H14.01V8L18 4Z"
      fill="currentColor"
    />
  </svg>
);

export default IconSwap;
