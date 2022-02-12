import React, { FC, ReactElement } from "react";

import { SvgIconProps } from "../Icon";

const IconMenu: FC<SvgIconProps> = ({ className = "" }): ReactElement => (
  <svg viewBox="0 0 18 18" className={className}>
    <path
      transform="translate(0 3)"
      d="M0 12H18V10H0V12ZM0 7H18V5H0V7ZM0 0V2H18V0H0Z"
    />
  </svg>
);

export default IconMenu;
